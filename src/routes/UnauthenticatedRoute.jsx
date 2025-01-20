import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const UnuathenticatedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (user) {
        if (user.role.name === 'admin') {
            return <Navigate to="/roles" />;
        } else if (user.role.name === 'user') {
            return <Navigate to="/" />;
        }
    }

    return children;
}

export default UnuathenticatedRoute;