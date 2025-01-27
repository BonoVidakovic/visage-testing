import {Movie} from "./Movie";

export type MoviesResponse = {
    movies: Movie[];
    meta: {
        hasNext: boolean;
    }
}