import Admin from "../../layouts/Admin";
import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { _get } from "../../api"; 

const GoodsDonations = () => {

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await _get("/goods-donations"); 
            const data = await response.data;
            setDonations(data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    }


    const header = { 
        title: "Goods Donations Management",
        subTitle: "Easily manage incoming goodonations — add new entries, view donor details, or update donation records with ease."
    };

    const breadcrumbs = [
        { name: "Goods Donations", link: "/goods-donations" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between bg-white border-gray-100 p-3 rounded-lg">
                    <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4">
                        <p className="text-xs">Search</p>
                        <input type="text" className="placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" placeholder="Type something.." />
                    </div>
                    {/* <div className="flex items-center justify-end gap-2">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">+ New</button>
                    </div> */}
                </div>
                <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-xs">
                    <thead className="bg-orange-500 text-white">
                    <tr>
                        <th className="p-3 text-start">Date of Donation</th>
                        <th className="p-3 text-start">Donor</th>
                        <th className="p-3 text-start">Email</th>
                        <th className="p-3 text-start">Type of Donation</th>
                        <th className="p-3 text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {donations.map((donation, index) => (
                        <tr key={donation.id} className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                            <td className="p-3">
                            {donation.created_at
                                ? new Date(donation.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                                : ''}
                            </td>
                            <td className="p-3">{donation.name || ''}</td>
                            <td className="p-3">{donation.email || ''}</td>
                            <td className="p-3">
                                {
                                    donation.type && donation.type.length > 0 && (
                                        donation.type.map((type, idx) => (
                                        <span key={idx} className="inline-block border text-gray-500 border-gray-300 px-2 py-1 rounded text-[10px] mr-1">
                                            {type}
                                        </span>
                                        ))
                                    )
                                }
                            </td>
                            <td className="p-3 h-full flex items-center justify-end gap-2">
                                <button className="bg-blue-50 text-blue-600 px-1 py-1 rounded"><Edit size={16} /></button>
                                <button className="bg-red-50 text-red-600 px-1 py-1 rounded" ><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
            </div>
        </Admin>
    )
}

export default GoodsDonations;