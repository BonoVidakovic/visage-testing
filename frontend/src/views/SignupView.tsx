import {Box, Button, TextField, Typography} from "@mui/material";
import {Suspense, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import to from "await-to-js";

function SignupView() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const onSignup = async (formData: FormData) => {
        const [err] = await to(axios.post('/api/auth/signup', {
            username: formData.get('username') as string,
            password: formData.get('password') as string
        }, {headers: {"Content-Type": "application/json"}}));

        if (err) {
            setIsError(true);
        } else {
            navigate("/login");
        }
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
                    <form action={onSignup}>
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
                        <div style={{paddingTop: "5vh", height: "5vh", width: "30vw"}}>
                            <TextField label="Repeat password"
                                       name="repeat_password"
                                       type="password"
                                       required
                                       hidden
                                       fullWidth
                                       value={repeatPassword}
                                       error={password !== repeatPassword}
                                       helperText={password !== repeatPassword ? "Passwords don't match" : ""}
                                       onChange={(e) => setRepeatPassword(e.target.value)}/>
                        </div>
                        <div style={{
                            paddingTop: "5vh",
                            height: "5vh",
                            width: "30vw",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Button variant="contained" type="submit">Sign Up</Button>
                        </div>
                        {isError &&
                            <div style={{
                                paddingTop: "5vh",
                                height: "5vh",
                                width: "30vw",
                                display: "flex",
                                justifyContent: "center"
                            }}>
                                <Typography variant="body1" color="error" display="inline">Signup failed</Typography>
                            </div>}
                    </form>
                </Suspense>
            </ErrorBoundary>
        </Box>
    );
}

export default SignupView;