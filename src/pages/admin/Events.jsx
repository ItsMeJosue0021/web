import Admin from "../../layouts/Admin";
import { useEffect, useState } from "react";
import { X, Edit, Trash2 } from "lucide-react";
import { _get, _post, _put, _delete } from "../../api";

const Events = () => {

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
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }

    const header = {
        title: "Events Management",
        subTitle: "Easily manage your projects' information — create new entries, update project details, or remove completed or inactive projects."
    };

    const breadcrumbs = [
        { name: "Events", link: "/events-management" }
    ];

    return (
       <Admin header={header} breadcrumbs={breadcrumbs}>
        <div className="w-full mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white border-gray-100 p-3 rounded-lg">
                <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4">
                    <p className="text-xs">Search</p>
                    <input type="text" className="placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" placeholder="Type something.." />
                </div>
                <div className="flex items-center justify-end gap-2">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">+ New</button>
                </div>
            </div>
            <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-xs">
                <thead className="bg-orange-500 text-white">
                <tr>
                    <th className="p-3 text-start">Title</th>
                    <th className="p-3 text-start">Description</th>
                    <th className="p-3 text-start">Location</th>
                    <th className="p-3 text-start">Date</th>
                    <th className="p-3 text-end">Actions</th>
                </tr>
                </thead>
                <tbody>
                {events.map((event, index) => (
                    <tr key={event.id} className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                        <td className="p-3">{event.title || ''}</td>
                        <td className="p-3">
                        {(event.description || '').length > 100
                            ? event.description.substring(0, 100) + '...'
                            : event.description || ''}
                        </td>
                        <td className="p-3">{event.location || ''}</td>
                        <td className="p-3">{event.date || ''}</td>
                        <td className="p-3 h-full flex items-center justify-end gap-2">
                            <button className="bg-blue-50 text-blue-600 px-1 py-1 rounded"><Edit size={16} /></button>
                            <button className="bg-red-50 text-red-600 px-1 py-1 rounded" ><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
                </tbody>
                {loading && (
                    <div className="w-full h-36 flex items-center text-xs justify-center">
                        <div className="self-start h-full px-3 py-2 text-sm">
                            <div className="h-full flex items-center space-x-1">
                                <div className="dot dot-1 w-1 h-1 bg-orange-700 rounded-full"></div>
                                <div className="dot dot-2 w-1 h-1 bg-orange-700 rounded-full"></div>
                                <div className="dot dot-3 w-1 h-1 bg-orange-700 rounded-full"></div>
                                <div className="dot dot-4 w-1 h-1 bg-orange-700 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                )}
            </table>
        </div>
    </Admin>
    )
}

export default Events;