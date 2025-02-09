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
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </Router>
    );
}


export default App;
