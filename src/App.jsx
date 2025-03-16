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
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";
import Chat from './pages/Chat';
import Members from './pages/Members';
import Portal from './pages/Portal';
import Registration from './pages/auth/Registration';

const App = () => {
    useEffect(() => {
        AOS.init({
            duration: 2000, // Animation duration in milliseconds
            once: true, // Whether animation should happen only once
            easing: "ease-in-out", // Type of easing
          });
    }, []);

    return (
        <Router>
            <Routes>

                {/* Admin */}
                <Route
                    path="/members"
                    element={
                        <ProtectedRoute role="admin">
                            <Members />
                        </ProtectedRoute>
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

                {/* User */}

                <Route
                    path="/portal"
                    element={
                        <ProtectedRoute role="user">
                            <Portal />
                        </ProtectedRoute>
                    }
                />

                {/* Public */}
                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <Chat />
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
                <Route path="/login"
                    element={
                        <UnuathenticatedRoute>
                            <Login />
                        </UnuathenticatedRoute>
                    }
                />
                <Route path="/register"
                    element={
                        <UnuathenticatedRoute>
                            <Registration />
                        </UnuathenticatedRoute>
                    }
                />
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </Router>
    );
}


export default App;
