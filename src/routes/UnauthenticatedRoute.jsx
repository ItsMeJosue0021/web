import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import LoadingDots from "../components/LoadingDots";

const UnuathenticatedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <LoadingDots/>;

    if (user) {
        const normalizedRole = typeof user?.role === "string"
            ? user.role
            : user?.role?.name;

        if (normalizedRole === 'admin' || normalizedRole === 'super-admin') {
            return <Navigate to="/dashboard" />;
        } else if (normalizedRole === 'user') {
            return <Navigate to="/portal" />;
        }
    }

    return children;
}

export default UnuathenticatedRoute;
