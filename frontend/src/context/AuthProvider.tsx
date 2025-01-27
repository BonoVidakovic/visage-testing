import {Auth} from "../models/Auth.ts";
import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import to from "await-to-js";


export const AuthContext = createContext<Auth>({
    isLoggedIn: false,
    username: undefined,
    logout: () => {
    },
    login: async () => ({isError: false}),
});

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
};

const AuthProvider = ({children}: React.PropsWithChildren) => {
    const [{isLoggedIn, token, username}, setAuth] = useState<{
        isLoggedIn: boolean,
        username?: string,
        token?: string
    }>({
        isLoggedIn: false
    })

    const navigate = useNavigate();

    // On each 401 try to refresh token, if it fails navigate to login page
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(res => res,
            err => {
                if (err.response.status === 401 && !token) {
                    setAuth({isLoggedIn: false})
                    axios.get("/api/auth/refresh")
                        .then(res => setAuth({
                            isLoggedIn: true,
                            token: res.data.token
                        }))
                        .catch(() => !err.config.url.includes("auth") && navigate("/login"));
                } else {
                    throw err;
                }
            })
        axios.get("/api/auth/me").then();
        return () => axios.interceptors.response.eject(interceptor);
    }, [navigate])

    // Setup interceptors and user info
    useEffect(() => {
        const setupAuthHeader = () => {
            return axios.interceptors.request.use(config => {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            });
        }

        if (isLoggedIn) {
            if (token == null) throw new Error(
                "Token is null, but auth is logged in"
            );

            const interceptor = setupAuthHeader();

            if (username == null) {
                axios.get("/api/auth/me")
                    .then(res => setAuth(prevState => ({...prevState, username: res.data.username})));
            }

            return () => axios.interceptors.request.eject(interceptor)
        }
    }, [isLoggedIn, token, navigate, username]);

    const logout = async () => {
        const [err] = await to(axios.get("/api/auth/logout")); // Remove refresh token cookie
        if (!err) {
            setAuth({isLoggedIn: false});
        }
    }

    const login = async (username: string, password: string) => {
        const [err, res] = await to(axios.post("/api/auth/login", {
            username,
            password
        }, {headers: {"Content-Type": "application/json"}}));

        if (err) {
            return {isError: true}
        }

        setAuth({
            isLoggedIn: true,
            token: res?.data.token
        });

        return {isError: false};
    }


    return (
        <AuthContext.Provider value={{logout, login, isLoggedIn, username}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;