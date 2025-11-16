import Guest from "../layouts/Guest";
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
            const response = await _get("/projects");
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Guest>
            <div className="w-full h-auto pt-32 px-4 pb-20">

                {/* HEADER */}
                <div className="flex flex-col items-center text-center gap-2">
                    <h1 className="text-3xl font-bold chewy text-orange-600">Our Upcoming Projects</h1>

                    <p className="text-sm md:text-base text-gray-600 max-w-[650px]">
                        Stay informed about our latest activities and initiatives. These events are dedicated to 
                        empowering and supporting women in our community.
                    </p>

                    {/* SEARCH BAR */}
                    <div className="w-full max-w-[500px] flex items-center mt-4 shadow-sm">
                        <div className="bg-orange-500 p-3 rounded-l-md flex items-center justify-center">
                            <Search size={20} className="text-white" />
                        </div>
                        <input 
                            type="text" 
                            className="bg-white px-4 py-3 rounded-r-md border border-gray-200 text-sm w-full outline-none placeholder:text-xs"
                            placeholder="Search for projects..."
                        />
                    </div>
                </div>

                {/* EVENTS LIST */}
                <div className="w-full max-w-[1200px] mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                    {/* Loading */}
                    {loading && (
                        <div className="col-span-full flex justify-center py-10">
                            <p className="text-sm font-semibold text-gray-600">Loading events...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && events.length === 0 && (
                        <div className="col-span-full flex justify-center py-10">
                            <p className="text-sm font-semibold text-gray-600">No events available at the moment.</p>
                        </div>
                    )}

                    {/* EVENTS */}
                    {!loading && events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                        >
                            {/* IMAGE */}
                            {event.image && (
                                <img
                                    src={`${baseURL}${event.image}`}
                                    alt={event.title}
                                    className="w-full h-52 object-cover"
                                />
                            )}

                            {/* CONTENT */}
                            <div className="p-4 flex flex-col gap-2">
                                <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
                                    {event.title}
                                </h2>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <p>{event.date}</p>
                                    <span>•</span>
                                    <p>{event.location}</p>
                                </div>

                                <p className="text-xs text-gray-600 line-clamp-3">
                                    {event.description}
                                </p>

                                {/* CTA */}
                                <Link
                                    to={`/our-projects/${event.id}`}
                                    className="mt-2 text-xs px-4 py-1 rounded-md border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600 transition w-fit"
                                >
                                    See More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <Footer />
            </div>
        </Guest>
    );
};

export default EventsList;
