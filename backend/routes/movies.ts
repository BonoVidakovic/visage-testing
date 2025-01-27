import express from "express";
import sql from '../services/db.js';
import {Movie} from "../models/Movie";
import paginationProvider from "../middleware/paginationProvider";
import authProvider from "../middleware/authProvider";
import mapMovieToDto from "../util/mapMovieToDto";

const router = express.Router();

router.get('/', paginationProvider, async (req, res, next) => {
    // @ts-ignore
    const {page, limit} = req.pagination;

    const selectMovies = sql`
        select *
        from movies offset ${page * limit}
        limit ${limit + 1}
    `

    const movies: Movie[] = await selectMovies;

    res.status(200).json({
        movies: movies.slice(0, -1).map(mapMovieToDto),
        meta: {
            hasNext: movies.length > limit
        }
    });
    next();
})

router.get('/favorites', authProvider, paginationProvider, async (req, res, next) => {
    // @ts-ignore
    const {page, limit} = req.pagination;
    // @ts-ignore
    const {userId} = req.auth;

    const selectMovies = sql`
        select movies.*, count(user_movie_favorite.*) > 0 as is_favorite
        from movies
                 left outer join user_movie_favorite
                                 on movies.id = user_movie_favorite.movie_id and user_movie_favorite.user_id = ${userId}
        group by movies.id
        offset ${page * limit} limit ${limit + 1}
    `

    const movies: Movie[] = await selectMovies;

    res.status(200).json({
        movies: movies.slice(0, -1).map(mapMovieToDto),
        meta: {
            hasNext: movies.length > limit
        }
    });
    next();
})

router.get('/:id', async (req, res, next) => {
    const {id} = req.params;

    const selectMovie = sql`
        select *
        from movies
        where id = ${id}
    `
    const [movie, ..._] = await selectMovie;

    if (!movie) {
        res.status(404).json({
            message: 'Movie not found'
        });
        next();
    }

    res.status(200).json(mapMovieToDto(movie));
})

router.get('/:id/reviews', paginationProvider, async (req, res, next) => {
    // @ts-ignore
    const {page, limit} = req.pagination;

    const selectReviews = sql`
        select content, movies_reviews.rating
        from movies,
             movies_reviews
        where movies.id = ${req.params.id}
          and movies.id = movie_id
        offset ${page * limit} limit ${limit + 1}
    `

    const reviews = await selectReviews;

    res.status(200).json({
        reviews: reviews.length > 0 ? [] : reviews.slice(0, -1),
        meta: {hasNext: reviews.length > limit}
    });

    next();
})

router.post('/:id/toggle-favorite', authProvider, async (req, res, next) => {
    // @ts-ignore
    const {userId} = req.auth;
    const {id} = req.params;

    const isToggledQuerry = sql`
        select exists (select 1
                       from user_movie_favorite
                       where movie_id = ${id}
                         and user_id = ${userId}) as is_favorite
    `;

    const [{is_favorite}] = await isToggledQuerry;

    if(is_favorite) {
        await sql`
            delete from user_movie_favorite
            where movie_id = ${id}
              and user_id = ${userId}
        `
    } else {
        await sql`
            insert into user_movie_favorite (user_id, movie_id)
            values (${userId}, ${id})
        `
    }

    res.status(200).json({
        message: 'Favorite status toggled'});

})

export default router;