import {Movie} from "../models/Movie.ts";
import {Box, Card, CardContent, IconButton, Typography} from "@mui/material";
import {Favorite, FavoriteBorder} from "@mui/icons-material";
import {Link} from "react-router-dom";

export default function MovieCard({
                                      data: {title, releaseYear, isFavorite, poster, id},
                                      toggleFavorite,
                                      showFavoriteStatus,
                                  }: React.PropsWithChildren<{
    data: Movie,
    showFavoriteStatus?: boolean,
    toggleFavorite?: () => void,
}>) {

    return (
        <Card>
            <CardContent>
                <Box height={"20vh"} width={"20vw"}>
                    <img height="15vh" src={poster} alt={title}/>
                    <Typography variant="h5">
                        <Link to={"/movie/" + id}>{title}</Link> ({releaseYear})
                    </Typography>
                    {showFavoriteStatus &&
                        <Typography variant="body1">Favorite: <IconButton onClick={toggleFavorite}>{isFavorite ?
                            <Favorite/> :
                            <FavoriteBorder/>}</IconButton>
                        </Typography>}
                </Box>
            </CardContent>
        </Card>
    );
}