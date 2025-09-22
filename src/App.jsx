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
import ProjectDetails from './pages/ProjectDetails';
import BannerImg from './pages/BannerImg';
import ContactInfo from './pages/ContactInfo';
import ContactUs from './pages/ContactUs';
import AdvocacyDetails from './pages/AdvocacyDetails';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import Projects from './pages/admin/Projects';
import Events from './pages/admin/Events';
import Option from './pages/donation/Option';
import Cash from './pages/donation/Cash';
import Goods from './pages/donation/Goods';
import Donations from './pages/admin/donations';
import Dashboard from './pages/admin/dashboard';
import GoodsDonations from './pages/admin/GoodsDonations';
import WebHome from './pages/admin/website/Home';
import WebAboutUs from './pages/admin/website/AboutUs';
import WebFaqs from './pages/admin/website/Faqs';
import WebVolunteers from './pages/admin/website/Volunteers';
import WebEvents from './pages/admin/website/Events';
import WebContactUs from './pages/admin/website/ContactUs';
import User from './layouts/User';

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
                    path="/projects"
                    element={
                        <ProtectedRoute role="admin">
                            <Projects />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/events-management"
                    element={
                        <ProtectedRoute role="admin">
                            <Events />
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
                <Route
                    path="/settings/banner-images"
                    element={
                        <ProtectedRoute role="admin">
                            <BannerImg />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings/contact-info"
                    element={
                        <ProtectedRoute role="admin">
                            <ContactInfo />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/donations/cash"
                    element={
                        <ProtectedRoute role="admin">
                            <Donations />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/donations/goods"
                    element={
                        <ProtectedRoute role="admin">
                            <GoodsDonations />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/web-content/home"
                    element={
                        <ProtectedRoute role="admin">
                            <WebHome />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/web-content/about-us"
                    element={
                        <ProtectedRoute role="admin">
                            <WebAboutUs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/web-content/faqs"
                    element={
                        <ProtectedRoute role="admin">
                            <WebFaqs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/web-content/volunteers"
                    element={
                        <ProtectedRoute role="admin">
                            <WebVolunteers />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/web-content/events"
                    element={
                        <ProtectedRoute role="admin">
                            <WebEvents />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/web-content/contact-us"
                    element={
                        <ProtectedRoute role="admin">
                            <WebContactUs />
                        </ProtectedRoute>
                    }
                />



                {/* User */}

                <Route
                    path="/portal"
                    element={
                        <ProtectedRoute role="user">
                            <User>
                                <Portal />
                            </User>
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
                <Route
                    path="/contact-us"
                    element={
                        <ContactUs />
                    }
                />
                <Route
                    path="/our-projects"
                    element={
                        <EventsList />
                    }
                />
                 <Route
                    path="/our-projects/:id"
                    element={
                        <EventDetails />
                    }
                />
                <Route
                    path="/projects/:id"
                    element={
                        <ProjectDetails />
                    }
                />
                <Route
                    path="/volunteers/advocacy/:id"
                    element={
                        <AdvocacyDetails />
                    }
                />
                <Route
                    path="/donate"
                    element={
                        <Option />
                    }
                />
                <Route
                    path="/donate/cash"
                    element={
                        <Cash />
                    }
                />
                <Route
                    path="/donate/goods"
                    element={
                        <Goods />
                    }
                />

                {/* Auth */}
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
