import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UnuathenticatedRoute from './routes/UnauthenticatedRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import Unauthorized from './pages/auth/Unauthorized';
import Login from './pages/auth/Login';
import Roles from './pages/Roles';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Volunteers from './pages/Volunteers';
import Faqs from './pages/Faqs';

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
                    <Home />
                }
            />
            <Route
                path="/about-us"
                element={
                    <AboutUs />
                }
            />
            <Route
                path="volunteers"
                element={
                    <Volunteers />
                }
            />
            <Route
                path="/faqs"
                element={
                    <Faqs />
                }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
    </Router>
);

export default App;
