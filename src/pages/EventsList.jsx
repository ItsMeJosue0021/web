import Guest from "../layouts/Guest";
import logo from '../assets/img/logo.png';
import { Search } from 'lucide-react';
import { _get } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const EventsList = () => {

    const baseURL = "https://api.kalingangkababaihan.com/storage/";
    // const baseURL = "http://127.0.0.1:8000/storage/";


    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await _get("/events"); 
            const data = await response.data;
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <Guest>
            <div className="w-screen h-auto pt-32 px-4 pb-12">
                <div className="flex items-center justify-center flex-col gap-2 text-center">
                  <h1 className="text-2xl font-semibold">Our Upcoming Events</h1>
                    <p className="text-sm">Stay informed about our latest activities and initiatives. Here’s a look at the upcoming events dedicated <br/> to empowering and supporting women in our community.</p>

                    <div className="w-full min-w-80 max-w-[500px] flex items-center mt-4">
                        <div className="bg-orange-500 px-4 py-2 rounded-l">
                            <Search size={21} className="text-white" />
                        </div>
                        <input type="text" className="placeholder:text-xs px-4 py-2 rounded-r border border-gray-200 text-sm w-full" placeholder="Search for events.." />
                    </div>
                </div>

                <div className="w-full max-w-[1200px] mx-auto mt-8 flex flex-wrap justify-center gap-4">
                    {loading ? (
                        <div className="w-full flex items-center justify-center">
                            <p className="text-sm font-semibold">Loading...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="w-full flex items-center justify-center">
                            <p className="text-sm font-semibold">No events found.</p>
                        </div>
                    ) : (
                        events.map((event, index) => (
                            <div key={index} className="w-full md:w-96 h-fit p-4 shadow bg-white rounded-md flex flex-col gap-2">
                                {event.image && (
                                    <img src={`${baseURL}${event.image}`} alt={event.title} className="w-full h-52 object-center object-cover rounded-md" />
                                )}
                                {/* <img src={logo} alt="logo" className="w-full h-52 object-center object-cover rounded-md" /> */}
                                <div className="flex flex-col gap-1">
                                    <h2 className='text-sm font-semibold'>{event.title}</h2>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs">{event.date}</p>
                                        <p className="text-xs">|</p>
                                        <p className="text-xs">{event.location}</p>
                                    </div>
                                    <p className="text-xs">{event.description}</p>
                                    <Link to={`/events/${event.id}`} className="mt-2 w-fit text-xs px-4 py-1 rounded text-gray-600 border border-gray-200 hover:border-orange-600 hover:text-orange-600">See More</Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <Footer />
            </div>
        </Guest>
        
    )
}

export default EventsList;