import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export default function ProtectedRoute() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("authToken");
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [navigate]);

    return <h1>This is a protected route!</h1>;
}
