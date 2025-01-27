import * as React from "react";
import {useAuthContext} from "../context/AuthProvider.tsx";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children}: React.PropsWithChildren) => {
    const {isLoggedIn} = useAuthContext();

    if (!isLoggedIn) return (
        <Navigate to="/login"/>
    )

    return <>{children}</>;
}

export default ProtectedRoute;