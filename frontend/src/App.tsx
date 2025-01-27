import {Box} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import MoviesView from "./views/MoviesView.tsx";
import MovieDetailsView from "./views/MovieDetailsView.tsx";
import LoginView from "./views/LoginView.tsx";
import MenuAppBar from "./components/MenuAppBar.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SignupView from "./views/SignupView.tsx";

export default function App() {
    return (
        <Box height={"100vh"} width={"100vw"}>
            <MenuAppBar/>
            <Routes>
                <Route path="/" element={<MoviesView/>}/>
                <Route path="/favourites" element={
                    <ProtectedRoute>
                        <MoviesView filterFavorites={true}/>
                    </ProtectedRoute>}/>
                <Route path="/movie/:movieId" element={<MovieDetailsView/>}/>
                <Route path="/login" element={<LoginView/>}/>
                <Route path="/signup" element={<SignupView/>}/>
            </Routes>
        </Box>
    );
}
