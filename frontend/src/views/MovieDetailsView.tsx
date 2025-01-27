import {useEffect, useState} from "react";
import {Movie} from "../models/Movie.ts";
import {Card, CardContent, Rating, Stack, Typography} from "@mui/material";
import {MovieReviewResponse} from "../models/MovieReview.ts";
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import {useParams} from "react-router-dom";

function MovieDetailsView() {
    const {movieId} = useParams();
    const [{page, limit}, setReviewPagination] = useState({
        page: 0,
        limit: 10
    })
    const [movieReviewResponse, setMovieReviewResponse] = useState<MovieReviewResponse>({
        reviews: [],
        meta: {
            hasNext: false
        }
    });

    const [movie, setMovie] = useState<Movie>();


    useEffect(() => {
        axios.get("/api/movies/" + movieId + "/reviews?page=" + page + "&limit=" + limit)
            .then(response => {
                setMovieReviewResponse({
                    ...response.data,
                    reviews: [...movieReviewResponse.reviews, ...response.data.reviews]
                });
            })
    }, [page, limit, movieId]);

    useEffect(() => {
        axios.get("/api/movies/" + movieId)
            .then(response => {
                setMovie(response.data);
            })
    }, [movieId]);

    const getMovieReviews = () => {
        setReviewPagination({
            page: page + 1,
            limit
        })
    }


    return (
        <>
            <Stack spacing={2}
                   sx={{width: "100%"}}
                   alignItems={"center"}>
                <img src={movie?.poster} alt={movie?.title}/>
                <Typography variant="h3" component="div">{movie?.title} ({movie?.releaseYear})</Typography>
                <Typography variant="body1" component="div">Genre: {movie?.genre}</Typography>
                <Typography variant="body1" component="div">Runtime: {movie?.runtime}</Typography>
                <Typography variant="body1" component="div">Language: {movie?.language}</Typography>
                <Rating value={movie?.rating || 0} readOnly precision={0.5}/>
                <Typography variant="h4" component="div" paddingTop="20px">Reviews</Typography>
            </Stack>
            <div
                id="scrollableDiv"
                style={{
                    height: 300,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                <InfiniteScroll
                    dataLength={movieReviewResponse?.reviews.length || 0}
                    next={getMovieReviews}
                    height={300}
                    hasMore={movieReviewResponse?.meta.hasNext || false}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    scrollableTarget="scrollableDiv"
                    scrollThreshold={1}
                >
                    <Stack>
                        {movieReviewResponse.reviews.map(review => (<Card key={review.id}>
                            <CardContent>
                                <Typography variant="body1">{review.text}</Typography>
                                <Rating value={movie?.rating} readOnly precision={0.5}/>
                            </CardContent>
                        </Card>))}
                    </Stack>
                    <div style={{height: 20}}></div>
                    {/* External component to adjust the scroll */}
                </InfiniteScroll>
            </div>
        </>
    )

}

export default MovieDetailsView;