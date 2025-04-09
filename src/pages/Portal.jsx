import { useEffect } from "react";
import User from "../layouts/User";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import Logout from "../components/Logout";
import { div } from "framer-motion/client";
import { SlidersHorizontal } from "lucide-react";
import { Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import ChatButton from "../components/chatbot/ChatButton";

const events = [
    {
        title: "Mental Health Awareness Session",
        date: "2023-10-10",
        time: "10:00 AM",
        description: "A talk on mental well-being and stress management for women.",
        images: [
            {src: "volunteers.png", alt: "Volunteer" },
            {src: "supermom.png", alt: "Supermom" }, 
            {src: "volunteers.png", alt: "Volunteer" },
            {src: "supermom.png", alt: "Supermom" }, 
            {src: "volunteers.png", alt: "Volunteer" },
            {src: "supermom.png", alt: "Supermom" },   
        ]
    },
    {
        title: "Self-Defense Workshop",
        date: "2023-10-11",
        time: "1:00 PM",
        description: "Practical self-defense techniques for personal safety and confidence.",
        images: [
            {src: "feeding.png", alt: "Volunteer" }   
        ]
    },
    {
        title: "Financial Literacy Seminar",
        date: "2023-10-12",
        time: "9:30 AM",
        description: "Learn about budgeting, savings, and smart financial planning for women.",
    },
    {
        title: "Women in Leadership Forum",
        date: "2023-10-13",
        time: "2:00 PM",
        description: "Inspiring stories and strategies from female leaders in the community.",
    },
    {
        title: "Community Outreach Program",
        date: "2023-10-14",
        time: "8:00 AM",
        description: "Outreach activity where women volunteers extend support to underserved areas.",
        images: [
            {src: "about.png", alt: "About" },
            {src: "banner.png", alt: "Banner" },    
        ]
    },
    {
        title: "Health and Wellness Talk",
        date: "2023-10-05",
        time: "9:00 AM",
        description: "A session on women’s health and self-care with guest medical professionals.",
    },
    {
        title: "Livelihood Training Workshop",
        date: "2023-10-06",
        time: "1:00 PM",
        description: "Hands-on workshop on soap-making and other income-generating skills.",
    },
    {
        title: "Legal Rights Awareness Seminar",
        date: "2023-10-07",
        time: "10:30 AM",
        description: "Discussion about women’s legal rights and protection against abuse.",
    },
    {
        title: "Empowerment Through Art",
        date: "2023-10-08",
        time: "3:00 PM",
        description: "Creative painting and storytelling session to express women's strength.",
    },
    {
        title: "Closing Ceremony and Recognition Day",
        date: "2023-10-09",
        time: "5:00 PM",
        description: "Program finale with performances, reflections, and recognition of participants.",
    }
];

const prevEvents = [
    {
        title: "Health and Wellness Talk",
        date: "2023-10-05",
        time: "9:00 AM",
        description: "A session on women’s health and self-care with guest medical professionals.",
    },
    {
        title: "Livelihood Training Workshop",
        date: "2023-10-06",
        time: "1:00 PM",
        description: "Hands-on workshop on soap-making and other income-generating skills.",
    },
    {
        title: "Legal Rights Awareness Seminar",
        date: "2023-10-07",
        time: "10:30 AM",
        description: "Discussion about women’s legal rights and protection against abuse.",
    },
    {
        title: "Empowerment Through Art",
        date: "2023-10-08",
        time: "3:00 PM",
        description: "Creative painting and storytelling session to express women's strength.",
    }
];


const Portal = () => {

    const {user} = useContext(AuthContext);

    const [selectedIamge, setSelectedImage] = useState();
    const [viewImage, setViewImage] = useState(false);

    const handleImageClick = (url) => {
        setSelectedImage(url);
        setViewImage(true);
    };

    return (
        <User>
            <div className="w-full flex items-center justify-center flex-col p-4 overflow-hidden ">
                <div className="w-full max-w-[1200px] grid grid-cols-7 gap-4" >
                    <div className="col-span-2 h-72">
                        <p className="font-medium text-sm py-2 mb-2">My Previous Eevents</p>
                        <div className="flex flex-col gap-2">
                            {prevEvents.map((event, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded-md shadow-sm bg-white">
                                    <img src="logo.png" alt="img" className="w-10 h-10 rounded bg-gray-gray-300" />
                                    <div className="flex flex-col items-start justify-start gap-1">
                                        <h1 className="text-xs font-semibold text-gray-700">{event.title}</h1>
                                        <p className="text-[9px] text-gray-500">{event.date} - {event.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-3 h-auto rounded flex items-start flex-col justify-start gap-2">
                        <div className="w-full">
                            <div className="w-full text-xs rounded px-4 py-1.5 flex items-center justify-start gap-2 bg-white shadow-sm">
                                <Search className="w-4 h-4 text-gray-500" />
                                <input type="text" placeholder="Search.." className="w-full h-full border-0 text-xs placeholder:text-xs bg-transparent outline-none"/>
                            </div>
                            

                            <div className="flex items-center justify-start gap-1 mt-2">
                                <div className="bg-white mr-1 p-1 border rounded">
                                    <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                                </div>
                                <button className="bg-white text-[10px] px-2 py-1 rounded border border-gray-200">All</button>
                                <button className="bg-white text-[10px] px-2 py-1 rounded border border-gray-200">Upcoming</button>
                                <button className="bg-white text-[10px] px-2 py-1 rounded border border-gray-200">Previous</button>
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-2 w-full h-auto max-h-[530px] overflow-y-auto py-2 hide-scrollbar">
                            {events.map((event, index) => (
                                <div key={index} className="w-full h-fit flex flex-col items-start justify-start gap-2 bg-white rounded-md shadow-sm p-4 border border-gray-50">
                                    <div className="flex flex-col items-start justify-start gap-1">
                                        <h1 className="text-sm font-semibold text-gray-700">{event.title}</h1>
                                        <p className="text-[10px] text-gray-500 rounded-md px-2 bg-green-100">{event.date} - {event.time}</p>
                                        <p className="text-xs text-gray-500">{event.description}</p>
                                    </div>
                                    <div>
                                        {event.images && event.images.length > 0 && (
                                            <div className="flex items-center justify-start gap-2 mt-2 overflow-scroll hide-scrollbar">
                                                {event.images.map((image, index) => (
                                                    <img key={index} src={image.src} alt={image.alt} className="w-24 h-24 rounded bg-gray-gray-300 object-cover object-center cursor-pointer" onClick={() => handleImageClick(image.src)}/>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button className="px-2 py-1 text-[10px] bg-blue-500 text-white hover:bg-blue-600 rounded">Volunteer</button>
                                </div>
                            ))}
                        </div>
                        {viewImage && (
                                <AnimatePresence>
                                    <motion.div 
                                    role="alert"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-screen h-screen flex items-center justify-center bg-black/40 fixed top-0 left-0 z-50 cursor-pointer px-5" onClick={() => setViewImage(false)}>
                                        <motion.div 
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-white rounded-lg h-auto w-full max-w-[600px] flex flex-col justify-start gap-4">
                                            <img src={selectedIamge} alt="image" className="h-full w-full rounded-lg" />
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            )
                        }
                    </div>

                    <div className="col-span-2 h-fit w-full max-w-sm bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex flex-col items-center p-8">
                            <img className="w-24 h-24 mb-3 rounded-full shadow-lg bg-gray-400 object-center object-cover cursor-pointer" src="sampleprofile.jpg" alt="image" onClick={() => handleImageClick("sampleprofile.jpg")}/>
                            <h5 className="mb-1  font-medium text-gray-900 dark:text-white">{user.fullName}</h5>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                            <span className="text-xs text-blue-500 dark:text-gray-400">@{user.username}</span>
                        </div>
                    </div>
                </div>
                <ChatButton/>
            </div>
        </User>
    );
}

export default Portal;