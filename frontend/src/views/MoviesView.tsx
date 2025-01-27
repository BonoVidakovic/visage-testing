import MovieCard from "../components/MovieCard.tsx";
import {Box, Grid2 as Grid} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import {MoviesResponse} from "../models/MoviesResponse.ts";
import {useEffect, useState} from "react";
import axios from "axios";

export default function MoviesView({filterFavorites}: React.PropsWithChildren<{
    filterFavorites?: boolean
}>) {
    const [{page, limit}, setReviewPagination] = useState({
        page: 0,
        limit: 10
    })
    const [moviesResponse, setMoviesResponse] = useState<MoviesResponse>({
        movies: [],
        meta: {
            hasNext: false
        }
    });

    const getMovies = () => {
        setReviewPagination({
            page: page + 1,
            limit
        })
    }

    useEffect(() => {
        axios.get(`/api/movies${filterFavorites ? '/favorites' : ''}?page=${page}&limit=${limit}`).then(response => setMoviesResponse({
            ...response.data,
            movies: [...moviesResponse.movies, ...response.data.movies]
        }));
    }, [limit, page, filterFavorites]);


    return (
        <Box paddingTop="1vh"
             sx={{
                 width: '100vw',
                 height: '90vh',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 spacing: 5,
             }}>
            <div
                id="scrollableDiv"
                style={{
                    height: '90vh',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <InfiniteScroll
                    dataLength={moviesResponse?.movies.length || 0}
                    next={getMovies}
                    height="90vh"
                    hasMore={moviesResponse?.meta.hasNext || false}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    scrollableTarget="scrollableDiv"
                    scrollThreshold={1}
                >
                    <div style={{height: 20}}></div>
                    <Grid container spacing={2}>
                        {moviesResponse?.movies.map(movie => (
                            <MovieCard showFavoriteStatus={filterFavorites} data={movie} key={movie.id + "" + movie.isFavorite}/>
                        ))}
                    </Grid>
                    <div style={{height: 20}}></div>
                    {/* External component to adjust the scroll */}
                </InfiniteScroll>
            </div>
        </Box>);
}
