import {Auth} from "../models/Auth.ts";
import * as React from "react";
import {createContext, useCallback, useContext, useEffect, useState} from "react";
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
    const [{isLoggedIn, username}, setAuth] = useState<{
        isLoggedIn: boolean,
        username?: string,
    }>({
        isLoggedIn: false
    })

    const navigate = useNavigate();


    const setupAuthGenerator = () => {
        let authInterceptorCleanup: () => void;

        return (token: string) => {
            if (authInterceptorCleanup) authInterceptorCleanup();

            const interceptor = axios.interceptors.request.use(config => {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            });

            axios.get("/api/auth/me")
                .then(res => setAuth({
                    isLoggedIn: true,
                    username: res.data.username
                }));

            authInterceptorCleanup = () => axios.interceptors.request.eject(interceptor)
        }
    }

    const setupAuth = useCallback(setupAuthGenerator(), [setAuth]);

    // On each 401 try to refresh token, if it fails navigate to login page
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(res => res,
            err => {
                if (err.response.status === 401) {
                    setAuth({isLoggedIn: false})
                    axios.post("/api/auth/refresh")
                        .then(res => {
                            setupAuth(res.data.token);
                        })
                        .catch(() => navigate("/login"));
                } else {
                    throw err;
                }
            })
        return () => {
            axios.interceptors.response.eject(interceptor);
        }
    }, [navigate])

    useEffect(() => {
        axios.post("/api/auth/refresh")
            .then(res => {
                setupAuth(res.data.token);
            })
    }, [setupAuth]);

    const logout = async () => {
        const [err] = await to(axios.post("/api/auth/logout")); // Remove refresh token cookie
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

        setupAuth(res.data.token);

        return {isError: false};
    }


    return (
        <AuthContext.Provider value={{logout, login, isLoggedIn, username}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;