import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import Loading from '../components/LoadingDots';

const ProtectedRoute = ({ children, role }) => {

    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <Loading/>;

    if (!user) return <Navigate to="/login" />;

    if (role && user.role.name !== role) return <Navigate to="/login" state={{ from: location }} />;

    return children;
};

export default ProtectedRoute;
