import {Movie} from "./Movie.ts";

export type MoviesResponse = {
    movies: Movie[];
    meta: {
        hasNext: boolean;
    }
}