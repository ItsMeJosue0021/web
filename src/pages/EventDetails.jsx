import React, { useEffect, useState} from 'react';
import activity1 from "../assets/img/activity1.png";
import { Link } from 'react-router-dom';
import Guest from '../layouts/Guest';
import { useParams } from 'react-router-dom';
import { _get } from "../api";


const EventDetails = () => {

    const baseURL = "https://api.kalingangkababaihan.com/storage/";
    // const baseURL = "http://127.0.0.1:8000/storage/";

    const { id } = useParams();
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        fetchProject();
    }, []);  

    const fetchProject = async () => {
        try {
            const response = await _get(`/projects/${id}`);
            const data = await response.data;
            setEvent(data);

        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Guest>
            <div className="w-screen h-auto min-h-screen bg-white pt-20">
                <div className='max-w-[1200px] mx-auto'>
                    {loading ? (
                        <div className="w-full flex items-center justify-center h-32">
                            <p className="text-sm font-semibold">Loading...</p>
                        </div>
                    ) : !event ? (
                        <div className="w-full flex items-center justify-center">
                            <p className="text-sm font-semibold">No events found.</p>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-4 p-4'>
                            <div>
                                <Link to="/our-projects" className='text-xs '>Back</Link>
                            </div>
                            {event.image && (
                                <img src={`${baseURL}${event.image}`} alt={event.title} className="w-fit min-h-[400px] max-h-[400px] bg-gray-200 h-auto object-center object-contain rounded-md" />
                            )}
                            <div className='flex flex-col gap-4'>
                                <h1 className="text-xl font-semibold text-orange-600">{event.title}</h1>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs">{event.date}</p>
                                    <p className="text-xs">|</p>
                                    <p className="text-xs">{event.location}</p>
                                </div>
                                <p className="text-sm text-justify">{event.description}</p>
                            </div>
                        </div>
                    )}
                   
                </div>
            </div>
        </Guest>
    );
}

export default EventDetails; 