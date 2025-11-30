import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { _get } from "../api";
import Guest from '../layouts/Guest';
import { ArrowLeft, MapPin, CalendarDays } from "lucide-react";
import { set } from 'lodash';

const EventDetails = () => {

    const baseURL = "https://api.kalingangkababaihan.com/storage/";
    // const baseURL = "http://127.0.0.1:8000/storage/";

    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // projects
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProject();
        fetchProjects();
    }, [id]);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const response = await _get(`/projects/${id}`);
            setEvent(response.data);
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await _get("/upcoming-projects");
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    return (
        <Guest>
            <div className="w-full min-h-screen bg-white pt-24 pb-16 px-4">

                <div className="max-w-[900px] mx-auto">

                    {/* LOADING */}
                    {loading && (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-sm font-medium text-gray-500">Loading event...</p>
                        </div>
                    )}

                    {/* NO EVENT FOUND */}
                    {!loading && !event && (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-sm font-medium text-gray-500">Event not found.</p>
                        </div>
                    )}

                    {/* EVENT DETAILS */}
                    {!loading && event && (
                        <div className="flex flex-col gap-6">

                            {/* Back Button */}
                            <Link
                                to="/our-projects"
                                className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 transition"
                            >
                                <ArrowLeft size={16} />
                                Back to Projects
                            </Link>

                            <div className='flex flex-col gap-6 px-4'>
                                {/* Image */}
                                {event.image && (
                                    <div className="rounded-xl overflow-hidden shadow-sm bg-gray-100 w-full">
                                        <img
                                            src={`${baseURL}${event.image}`}
                                            alt={event.title}
                                            className="w-full h-[240px] sm:h-[300px] md:h-[380px] lg:h-[430px] object-cover"
                                        />
                                    </div>
                                )}

                                {/* Event Title */}
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 leading-snug">
                                    {event.title}
                                </h1>

                                {/* Date & Location */}
                                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-xs sm:text-sm">

                                    <div className="flex items-center gap-1">
                                        <CalendarDays size={16} className="text-orange-500" />
                                        <span>{event.date}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} className="text-orange-500" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-white rounded-lg leading-relaxed">
                                    <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line text-justify">
                                        {event.description}
                                    </p>
                                </div>
                            </div>

                            <div className='flex flex-col gap-6 p-4 mt-20'>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300"> Other Projects</h2>
                                </div>
                                {projects.length > 0 && projects.map((event) => (
                                    <div
                                        key={event.id}
                                        className="h-fit bg-white rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
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

                        </div>
                    )}
                </div>
            </div>
        </Guest>
    );
};

export default EventDetails;

