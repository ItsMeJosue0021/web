import React, { useState, useEffect } from "react";
import { _get, _post, _put, _delete } from "../api";
import { X, Edit, Trash2 } from "lucide-react";
import Admin from "../layouts/Admin";

const Members = () => {
    const [members, setMembers] = useState([]);
    const [memberData, setMemberData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        nick_name: '',
        address: '',
        dob: '',
        civil_status: '',
        contact_number: '',
        fb_messenger_account: '',
    });

    const [contactData, setContactData] = useState({
        contact_person: '',
        cp_address: '',
        cp_contact_number: '',
        cp_fb_messenger_account: '',
        cp_relationship: '',
    });
    const [errors, setErrors] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
        const response = await _get("/members");
        setMembers(response.data);
        } catch (error) {
        console.error("Error fetching members:", error);
        }
    };

    const handleInputChange = (e, setData) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleCloseAddModel = () => {
        setShowAddModal(false);
        setErrors({});
    }

    const handleSubmit = async () => {
        try {
            const response = await _post('/members', {
                member: memberData,
                contactPerson: contactData
            });
            setMembers([...members, response.data]);
            setShowAddModal(false);
            setMemberData({
                first_name: '', middle_name: '', last_name: '', nick_name: '',
                address: '', dob: '', civil_status: '', contact_number: '', fb_messenger_account: ''
            });
            setContactData({
                contact_person: '', cp_address: '', cp_contact_number: '', cp_fb_messenger_account: '', cp_relationship: ''
            });
            setErrors({});
        } catch (error) {
            setErrors(error.response?.data?.errors || {});
            console.error(errors);
        }
    };

    const handleDelete = async (id) => {
        try {
        await _delete(`/members/${id}`);
        fetchMembers();
        } catch (error) {
        console.error("Error deleting member:", error);
        }
    };

    const openEditModal = (member) => {
        setEditingMember(member);
        setFormData(member);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
        await _put(`/members/${editingMember.id}`, formData);
        fetchMembers();
        setIsEditModalOpen(false);
        } catch (error) {
        if (error.response && error.response.data.errors) {
            setErrors(error.response.data.errors);
        }
        }
    };

  return (
    <Admin>
        <div className="p-6 w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4">Member Management</h2>
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded mb-4" onClick={() => setShowAddModal(true)}>+ Add Member</button>
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
                {members.map((member) => (
                    <tr key={member.id} className="border-t">
                    <td className="p-3">{member.first_name}</td>
                    <td className="p-3">{member.last_name}</td>
                    <td className="p-3">{member.nick_name}</td>
                    <td className="p-3">{member.contact_number}</td>
                    <td className="p-3 flex justify-start gap-2">
                        <button className="bg-blue-50 text-blue-600 px-1 py-1 rounded" onClick={() => openEditModal(member)}><Edit size={16} /></button>
                        <button className="bg-red-50 text-red-600 px-1 py-1 rounded" onClick={() => handleDelete(member.id)}><Trash2 size={16} /></button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Add Member Modal */}
            {showAddModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900/10">
                    <div className="bg-white p-6 rounded-lg w-[900px]">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-semibold">Add Member</h3>
                            <button onClick={handleCloseAddModel}><X /></button>
                        </div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex flex-col w-full">
                                <input type="text" name="first_name" placeholder="First Name" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.member.first_name && <p className="text-red-600 text-xs">{errors.member.first_name}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input type="text" name="middle_name" placeholder="Middle Name" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.middle_name && <p className="text-red-600 text-xs">{errors.middle_name}</p>}
                            </div>
                        </div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex flex-col w-full">
                                <input type="text" name="last_name" placeholder="Last Name" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.last_name && <p className="text-red-600 text-xs">{errors.last_name}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input type="text" name="nick_name" placeholder="Nick Name" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.nick_name && <p className="text-red-600 text-xs">{errors.nick_name}</p>}
                            </div>
                        </div>
                        
                        
                        <input type="text" name="address" placeholder="Address" className="border p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex flex-col w-full">
                                <input type="date" name="dob" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.dob && <p className="text-red-600 text-xs">{errors.dob}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input type="text" name="civil_status" placeholder="Civil Status" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.civil_status && <p className="text-red-600 text-xs">{errors.civil_status}</p>}
                            </div>
                        </div>
                        
                        <input type="text" name="contact_number" placeholder="Contact Number" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />
                        <input type="text" name="fb_messenger_account" placeholder="FB Messenger" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />

                        <h4 className="text-md font-semibold mt-4 mb-4">Emergency Contact</h4>
                        <div className="flex flex-col w-full">
                            <input type="text" name="contact_person" placeholder="Contact Person" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setContactData)} />  
                            {errors.contact_person && <p className="text-red-600 text-xs">{errors.contact_person}</p>}
                        </div>
                        <div className="flex flex-col w-full">
                            <input type="text" name="cp_address" placeholder="Address" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setContactData)} />  
                            {errors.cp_address && <p className="text-red-600 text-xs">{errors.cp_address}</p>}
                        </div>
                        
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col w-full">
                                <input type="text" name="cp_contact_number" placeholder="Contact Number" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setContactData)} /> 
                                {errors.cp_contact_number && <p className="text-red-600 text-xs">{errors.cp_contact_number}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input type="text" name="cp_relationship" placeholder="Relationship" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setContactData)} />
                                {errors.cp_relationship && <p className="text-red-600 text-xs">{errors.cp_relationship}</p>}
                            </div>
                        </div>
                        <input type="text" name="cp_fb_messenger_account" placeholder="FB Messenger" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={handleCloseAddModel} className="w-fit mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md ">Cancel</button>
                            <button onClick={handleSubmit} className="w-fit mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Save Member</button>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    </Admin>
    
  );
};

export default Members;
