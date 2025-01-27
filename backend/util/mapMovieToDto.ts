import {Movie} from "../models/Movie";

export default function mapMovieToDto(movies): Movie {
    return {
        id: movies.id,
        language: movies.language,
        runtime: movies.runtime,
        rating: movies.rating,
        genre: movies.genre,
        releaseYear: movies.release_year,
        title: movies.title,
        poster: movies.poster,
        isFavorite: movies.is_favorite,
    }
}