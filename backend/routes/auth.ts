// Added in: node v14.17.0
import jwt from "jsonwebtoken";
import {log} from "debug";
import {randomUUID} from "crypto";
import sql from "../services/db";
import express from "express";
import authProvider from "../middleware/authProvider";
import bcrypt from "bcrypt";

const router = express.Router();

/**
 * Sets new refresh token cookie and returns new access token
 */
router.get('/refresh', async function (req, res, next) {
    const getToken = sql`
        select user_id
        from refresh_tokens
        where token = ${req.cookies.refreshToken}
          and is_valid = true
    `;

    const [userRecord, ..._] = await getToken;

    if (!userRecord?.user_id) {
        res.status(404)
            .json({
                message: 'Refresh token not found'
            });
        next();
    } else {
        const {user_id} = userRecord;

        // Invalidate all tokens for user
        await sql`
            update refresh_tokens
            set is_valid = false
            where user_id = ${user_id}
        `


        const insertToken = sql`
            insert into refresh_tokens (user_id, token, is_valid)
            values (${user_id}, ${randomUUID()}, true) returning token;
        `

        const [{token}, ..._] = await insertToken;
        if (!token) {
            log('Error updating refresh token');
            res.status(500)
                .json({
                    message: 'Error updating refresh token'
                });
            next();
        } else {
            res.cookie('refreshToken', token);
            res.status(200)
                .json({
                    token: jwt.sign({userId: user_id}, process.env.JWT_SECRET, {expiresIn: '10m'})
                })
            next();
        }
    }
});

router.get('/me', authProvider, async (req, res, next) => {

    // @ts-ignore
    const {userId} = req.auth;

    const getUser = sql`
        select username
        from users
        where id = ${userId}
    `

    const [{username}, ..._] = await getUser;

    if (!username) {
        log(`User ${userId} not found in db`);
    }

    res.status(200).json({username})
    next();
});


router.post('/login', async (req, res, next) => {
    const {username, password} = req.body;

    const userQuerry = await sql`
        select id, password
        from users
        where username = ${username}
    `;

    const [user, ..._] = await userQuerry;

    bcrypt.compare(password, user.password, async (err, result) => {
        if (err) {
            log('Error comparing passwords:', err);
            res.status(500).json({message: 'Error comparing passwords'});
            next();
        }

        if (result) {
            const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '10m'});

            const invalidateAllUsersTokens = sql`
                update refresh_tokens
                set is_valid = false
                where user_id = ${user.id};
            `

            await invalidateAllUsersTokens;

            const updateToken = sql`
                insert into refresh_tokens (user_id, token, is_valid)
                values (${user.id}, ${randomUUID()}, true) returning token;
            `
            const [updated, ..._] = await updateToken;

            res.status(200)
                .cookie("refreshToken", updated.token)
                .json({token});

            next();
        } else {
            // Passwords don't match, authentication failed
            log('Passwords do not match! Authentication failed.');
            res.status(401).json({message: 'Authentication failed'});
            next();
        }
    });
})

router.post('/signup', async (req, res, next) => {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUser = sql`
        insert into users (id, username, password)
        values (${randomUUID()}, ${username}, ${hashedPassword})
    `;

    await insertUser;

    res.status(201).json({message: 'User created'});
})

router.get('/logout', authProvider, async (req, res, next) => {
   // @ts-ignore
    const {userId} = req.auth;

    if (!userId) {
        res.status(401)
            .json({message: 'Unauthorized'});
        next();
    }

    // Invalidate all tokens for user
    await sql`
            update refresh_tokens
            set is_valid = false
            where user_id = ${userId}
        `

    res.clearCookie('refreshToken')
        .status(200)
        .json({message: 'User logged out'});
    next();
})

export default router;
