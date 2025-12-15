import { useEffect, useState } from "react";
import { _get } from "../api"

const VolunteerListPerProject = ({ projectId }) => {

    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVolunteers();
    }, [projectId]);

    const fetchVolunteers = async () => {
        try {
            const response = _get(`/volunteering-requests/by-project/${projectId}`);
            if ((await response).status == 200) {
                setVolunteers((await response).data.volunteers || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p className="w-full text-center text-xs text-gray-700">Loading volunteers..</p>

    return (
        <div className="w-full flex flex-col gap-2 divide-y p-1">
            {volunteers.length > 0 && volunteers.map((item, index) => (
                <div key={index} className="flex items-center justify-between pt-2 ">
                    <p className="text-sm text-gray-700">{item.first_name} {item.middle_name} {item.last_name}</p> 
                    <p className={`text-[10px] text-white rounded px-3 py-1 ${item.is_member ? 'bg-blue-500' : 'bg-red-500'}`}>
                        {item.is_member ? 'Member' : 'Non-member'}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default VolunteerListPerProject;