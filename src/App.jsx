import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import Login from './pages/Login';
import Roles from './pages/Roles';
import Home from './pages/Home';
import UnuathenticatedRoute from './routes/UnauthenticatedRoute';

const App = () => (
    <Router>
        <Routes>
            <Route path="/login"
                element={
                    <UnuathenticatedRoute>
                        <Login />
                    </UnuathenticatedRoute>
                }
            />
            <Route
                path="/roles"
                element={
                    <ProtectedRoute role="admin">
                        <Roles />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute role="user">
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
    </Router>
);

export default App;
