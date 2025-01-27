import {AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthContext} from "../context/AuthProvider.tsx";

function MenuAppBar() {
    const location = useLocation();
    const {movieId} = useParams();
    const [viewName, setViewName] = useState<string>();
    const {isLoggedIn, username, logout} = useAuthContext();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (path: string) => () => {
        navigate(path);
        setAnchorEl(null);
    }

    useEffect(() => {
        if (location.pathname === "/favourites") return setViewName("Favourites")
        else if (movieId) return setViewName("Movie Details");
        else if (location.pathname === "/login") return setViewName("Login");
        else if (location.pathname === "/signup") return setViewName("Sign Up");
        else return setViewName("All Movies");
    }, [location.pathname, movieId]);


    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={handleClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {viewName}
                    </Typography>
                    {!isLoggedIn && <Button sx={{backgroundColor: "blue"}}
                                            onClick={() => {
                                                navigate("/login");
                                            }}>
                        Login
                    </Button>}
                    {isLoggedIn && <span>
                        Hi, {username}!
                        <Button style={{marginLeft: "3vw"}}
                                color="inherit"
                                onClick={() => {
                                    logout();
                                }}>
                        Log out
                    </Button>
                    </span>}
                </Toolbar>
            </AppBar>
            <Menu
                id="navigation-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleMenuItemClick("/")}>Home</MenuItem>
                <MenuItem onClick={handleMenuItemClick("/favourites")}>Favourites</MenuItem>
                {!isLoggedIn && <MenuItem onClick={handleMenuItemClick("/signup")}>Sign Up</MenuItem>}
            </Menu>
        </Box>
    );
}

export default MenuAppBar;