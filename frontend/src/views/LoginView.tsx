import {Box, Button, TextField, Typography} from "@mui/material";
import {Suspense, useState} from "react";
import {useAuthContext} from "../context/AuthProvider.tsx";
import {ErrorBoundary} from "react-error-boundary";
import {Link, useNavigate} from "react-router-dom";

function LoginView() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login, isLoggedIn} = useAuthContext();
    const [isLoginError, setIsLoginError] = useState(false);
    const navigate = useNavigate();

    if (isLoggedIn) {
        navigate("/");
    }

    const onLogin = async (formData: FormData) => {
        const {isError} = await login(formData.get('username') as string, formData.get('password') as string)
        if (!isError) {
            navigate("/")
        }
        setIsLoginError(isError);
    }

    return (
        <Box sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            spacing: 5,
        }}>
            <div style={{paddingTop: "5vh", height: "5vh", width: "40vw"}}>
                <Typography variant="h4">Enter your username and password</Typography>
            </div>
            <ErrorBoundary fallback={<p>Error occurred</p>}>
                <Suspense>
                    <form action={onLogin}>
                        <div style={{paddingTop: "5vh", height: "5vh", width: "30vw"}}>
                            <TextField label="Username"
                                       name="username"
                                       required
                                       fullWidth
                                       value={username}
                                       onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div style={{paddingTop: "5vh", height: "5vh", width: "30vw"}}>
                            <TextField label="Password"
                                       name="password"
                                       type="password"
                                       required
                                       hidden
                                       fullWidth
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div style={{
                            paddingTop: "5vh",
                            height: "5vh",
                            width: "30vw",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Button variant="contained" type="submit">Login</Button>
                        </div>
                        <div style={{
                            paddingTop: "5vh",
                            height: "5vh",
                            width: "30vw",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Link to="/signup">Don't have an account? Sign up</Link>
                        </div>
                        {isLoginError &&
                            <div style={{
                                paddingTop: "5vh",
                                height: "5vh",
                                width: "30vw",
                                display: "flex",
                                justifyContent: "center"
                            }}>
                                <Typography variant="body1" color="error" display="inline">Login failed</Typography>
                            </div>}
                    </form>
                </Suspense>
            </ErrorBoundary>
        </Box>
    );
}

export default LoginView;