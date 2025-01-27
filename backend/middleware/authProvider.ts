import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

function authProvider(req: Request, res: Response, next: NextFunction) {
    const [_, token] = req.headers.authorization?.split(' ') || [];

    if (!token) {
        res.status(401)
            .json({
                message: 'Unauthorized'
            });
        next('route');
        return;
    }

    // @ts-ignore
    jwt.verify(token, process.env.JWT_SECRET, (err, {userId}) => {
        if (err) {
            res.status(401)
                .json({
                    message: 'Unauthorized'
                });
            next('route');
        }

        // @ts-ignore
        req.auth = {
            userId
        }

        next();
    });
}

export default authProvider;