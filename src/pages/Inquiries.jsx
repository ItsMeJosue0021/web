import Admin from "../layouts/Admin";
import { Edit, Trash2 } from "lucide-react";

const Inquiries = () => {
    return (
        <Admin>
            <div className="p-6 w-full mx-auto">
                <table className="w-full border rounded-lg overflow-hidden shadow">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 text-start">First Name</th>
                        <th className="p-3 text-start">Last Name</th>
                        <th className="p-3 text-start">Nick Name</th>
                        <th className="p-3 text-start">Contact</th>
                        <th className="p-3 text-start">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t">
                            <td className="p-3">sample</td>
                            <td className="p-3">sample</td>
                            <td className="p-3">sample</td>
                            <td className="p-3">sample</td>
                            <td className="p-3 flex justify-start gap-2">
                                <button className="bg-blue-50 text-blue-600 px-1 py-1 rounded"><Edit size={16} /></button>
                                <button className="bg-red-50 text-red-600 px-1 py-1 rounded"><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
             
        </Admin>
    )
}

export default Inquiries;