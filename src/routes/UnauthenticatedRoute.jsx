import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import LoadingDots from "../components/LoadingDots";

const UnuathenticatedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <LoadingDots/>;

    if (user) {
        if (user.role.name === 'admin') {
            return <Navigate to="/members" />;
        } else if (user.role.name === 'user') {
            return <Navigate to="/portal" />;
        }
    }

    return children;
}

export default UnuathenticatedRoute;