import Guest from "../layouts/Guest";
import { Search, CalendarX2 } from 'lucide-react';
import { _get } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import VolunteerButton from "../components/volunteering/VolunteerButton";

const EventsList = () => {

    const baseURL = "https://api.kalingangkababaihan.com/storage/";
    // const baseURL = "http://127.0.0.1:8000/storage/";

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchEvents(searchTerm);
        }, 350); // light debounce to avoid hammering the API while typing

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchEvents = async (query = "") => {
        const isSearch = query.trim() !== "";

        setLoading(true);

        try {
            const endpoint = isSearch
                ? `/upcoming-projects?search=${encodeURIComponent(query)}`
                : "/upcoming-projects";

            const response = await _get(endpoint);
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
                    <div className="w-full max-w-[650px] flex items-center mt-4 shadow-sm bg-white border border-gray-200 rounded-md overflow-hidden">
                        <div className="bg-orange-500 p-3 flex items-center justify-center">
                            <Search size={20} className="text-white" />
                        </div>
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white px-4 py-3 text-sm w-full outline-none placeholder:text-xs"
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
                        <div className="col-span-full">
                            <div className="max-w-xl mx-auto bg-white border border-orange-100 shadow-sm rounded-2xl p-8 text-center flex flex-col items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                    <CalendarX2 size={28} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-800">No upcoming projects just yet</h3>
                                    <p className="text-sm text-gray-600">
                                        We are preparing our next set of community initiatives. Check back soon or learn more about what we do.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    <Link
                                        to="/about-us"
                                        className="text-xs px-4 py-2 rounded-md border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 transition"
                                    >
                                        About our mission
                                    </Link>
                                    <Link
                                        to="/"
                                        className="text-xs px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:border-orange-600 hover:text-orange-600 transition"
                                    >
                                        Back to home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EVENTS */}
                    {!loading && events.map((event) => (
                        <div
                            key={event.id}
                            className="h-fit bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
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
                                    <span className="text-gray-300">|</span>
                                    <p>{event.location}</p>
                                </div>

                                <p className="text-xs text-gray-600 line-clamp-3">
                                    {event.description}
                                </p>

                                {/* CTA */}
                                <div className="flex items-center gap-2 mt-2">
                                    <Link
                                        to={`/our-projects/${event.id}`}
                                        className="text-xs px-4 py-1 rounded-md border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600 transition w-fit"
                                    >
                                        See More
                                    </Link>
                                    <VolunteerButton project={event} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </Guest>
    );
};

export default EventsList;
