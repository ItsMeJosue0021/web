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
import Inquiries from './pages/Inquiries';
import Knowledgebase from './pages/Knowledgebase';
import Users from './pages/Users';

const App = () => {
    useEffect(() => {
        AOS.init({
            duration: 2000, 
            once: true, 
            easing: "ease-in-out", 
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
                <Route
                    path="/inquiries"
                    element={
                        <ProtectedRoute role="admin">
                            <Inquiries />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/knowledgebase"
                    element={
                        <ProtectedRoute role="admin">
                            <Knowledgebase />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings/users"
                    element={
                        <ProtectedRoute role="admin">
                            <Users />
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
