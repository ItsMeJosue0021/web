import Guest from "../layouts/Guest";
import { Search, CalendarX2 } from 'lucide-react';
import { _get } from "../api";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import VolunteerButton from "../components/volunteering/VolunteerButton";
import ProjectShareButton from "../components/projects/ProjectShareButton";
import {
    canProjectAcceptVolunteers,
    getProjectLifecycleClasses,
    getProjectLifecycleLabel,
    getProjectLifecycleStatus,
    getProjectPublicPath,
    getProjectTypeClasses,
    getProjectTypeLabel,
} from "../utils/projectMeta";

const getEventTime = (value) => {
    if (!value) return 0;

    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(`${value}`.trim());
    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const EventsList = () => {

    const baseURL = "https://api.kalingangkababaihan.com/storage/";
    // const baseURL = "http://127.0.0.1:8000/storage/";

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("upcoming");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);

        try {
            const response = await _get("/projects");
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const visibleEvents = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();

        return events
            .filter((event) => {
                const lifecycleStatus = getProjectLifecycleStatus(event);

                if (statusFilter === "upcoming" && lifecycleStatus === "done") {
                    return false;
                }

                if (statusFilter === "previous" && lifecycleStatus !== "done") {
                    return false;
                }

                if (startDate && event.date < startDate) {
                    return false;
                }

                if (endDate && event.date > endDate) {
                    return false;
                }

                if (!normalizedSearchTerm) {
                    return true;
                }

                const searchableText = [
                    event.title,
                    event.description,
                    event.location,
                    ...(event.tags || []),
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(normalizedSearchTerm);
            })
            .sort((first, second) => {
                const firstTime = getEventTime(first.date);
                const secondTime = getEventTime(second.date);
                const firstIsPrevious = getProjectLifecycleStatus(first) === "done";
                const secondIsPrevious = getProjectLifecycleStatus(second) === "done";

                if (statusFilter === "all" && firstIsPrevious !== secondIsPrevious) {
                    return firstIsPrevious ? 1 : -1;
                }

                if (statusFilter === "previous" || (firstIsPrevious && secondIsPrevious)) {
                    return secondTime - firstTime;
                }

                return firstTime - secondTime;
            });
    }, [events, endDate, searchTerm, startDate, statusFilter]);

    const emptyTitle = statusFilter === "previous"
        ? "No previous projects found"
        : statusFilter === "all"
            ? "No projects found"
            : "No upcoming projects just yet";

    const emptyDescription = searchTerm || startDate || endDate || statusFilter !== "upcoming"
        ? "Try adjusting your search or filters to find another community initiative."
        : "We are preparing our next set of community initiatives. Check back soon or learn more about what we do.";

    return (
        <Guest>
            <div className="w-full h-auto pt-32 px-4 pb-20">

                {/* HEADER */}
                <div className="max-w-[1200px] mx-auto flex flex-col items-start text-left gap-2">
                    <h1 className="w-full text-center text-3xl font-bold chewy text-orange-600">Our Projects</h1>

                    <p className="w-full text-center text-sm md:text-base text-gray-600 max-w-[650px] mx-auto">
                        Stay informed about our latest activities and initiatives. These events are dedicated to 
                        empowering and supporting women in our community.
                    </p>

                    {/* SEARCH AND FILTERS */}
                    <div className="w-full mt-4 flex flex-wrap items-end gap-3 rounded-md ">
                        <div className="flex w-full max-w-[420px] items-center overflow-hidden rounded-md border border-gray-200 bg-white">
                            <div className="bg-orange-500 p-2 flex items-center justify-center">
                                <Search size={20} className="text-white" />
                            </div>
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white px-4 py-2 text-sm w-full outline-none placeholder:text-xs"
                                placeholder="Search for projects..."
                            />
                        </div>

                        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
                            Status
                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                className="min-w-[150px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-normal text-gray-700 outline-none focus:border-orange-500"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="previous">Previous</option>
                                <option value="all">All projects</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
                            Start date
                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) => setStartDate(event.target.value)}
                                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-normal text-gray-700 outline-none focus:border-orange-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
                            End date
                            <input
                                type="date"
                                value={endDate}
                                min={startDate || undefined}
                                onChange={(event) => setEndDate(event.target.value)}
                                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-normal text-gray-700 outline-none focus:border-orange-500"
                            />
                        </label>

                        {(searchTerm || startDate || endDate || statusFilter !== "upcoming") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStartDate("");
                                    setEndDate("");
                                    setStatusFilter("upcoming");
                                }}
                                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-orange-500 hover:text-orange-600 transition"
                            >
                                Clear filters
                            </button>
                        )}
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
                    {!loading && visibleEvents.length === 0 && (
                        <div className="col-span-full">
                            <div className="max-w-xl mx-auto bg-white border border-orange-100 shadow-sm rounded-2xl p-8 text-center flex flex-col items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                    <CalendarX2 size={28} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{emptyTitle}</h3>
                                    <p className="text-sm text-gray-600">
                                        {emptyDescription}
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
                    {!loading && visibleEvents.map((event) => (
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
                            <div className="p-4 flex flex-1 flex-col gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${getProjectTypeClasses(event)}`}>
                                        {getProjectTypeLabel(event)}
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${getProjectLifecycleClasses(event)}`}>
                                        {getProjectLifecycleLabel(event)}
                                    </span>
                                </div>

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
                                <div className="mt-auto flex flex-wrap items-center gap-2">
                                    <Link
                                        to={getProjectPublicPath(event)}
                                        className="text-xs px-4 py-1 rounded-md border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600 transition w-fit"
                                    >
                                        See More
                                    </Link>
                                    {canProjectAcceptVolunteers(event) && <VolunteerButton project={event} />}
                                    <ProjectShareButton
                                        title={event.title}
                                        description={event.description}
                                        path={getProjectPublicPath(event)}
                                    />
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
