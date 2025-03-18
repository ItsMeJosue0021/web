import React, { useState, useEffect } from "react";
import { _get, _post, _put, _delete } from "../api";
import { X, Edit, Trash2 } from "lucide-react";
import Admin from "../layouts/Admin";
import { toast } from 'react-toastify';
import ConfirmationAlert from "../components/alerts/ConfirmationAlert";

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
        contact_person: '',
        cp_address: '',
        cp_contact_number: '',
        cp_fb_messenger_account: '',
        cp_relationship: '',
    });
    const [loading, isLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        isLoading(true);
        try {
            const response = await _get("/members");
            setMembers(response.data);
        isLoading(false);
        } catch (error) {
            console.error("Error fetching members:", error);
            isLoading(false);
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
        setIsSaving(true);
        try {
            const response = await _post('/members', memberData);
            fetchMembers();
            setShowAddModal(false);
            toast.success("Member added successfully!");
            setMemberData({
                first_name: '', middle_name: '', last_name: '', nick_name: '',
                address: '', dob: '', civil_status: '', contact_number: '', fb_messenger_account: '',
                contact_person: '', cp_address: '', cp_contact_number: '', cp_fb_messenger_account: '', cp_relationship: ''
            });
            setErrors({});
            setIsSaving(false);
        } catch (error) {
            setErrors(error.response?.data?.errors || {});
            console.error(errors);
            toast.error("Error adding member!");
        } finally {
            setIsSaving(false);
        }
    };

    const openEditModal = (member) => {
        setEditingMember(member);
        setMemberData({
            first_name: member.first_name,
            middle_name: member.middle_name,
            last_name: member.last_name,
            nick_name: member.nick_name,
            address: member.address,
            dob: member.dob,
            civil_status: member.civil_status,
            contact_number: member.contact_number,
            fb_messenger_account: member.fb_messenger_account,
            contact_person: member.emergency_contact.contact_person ? member.emergency_contact.contact_person : '',
            cp_address: member.emergency_contact.address ?? '',
            cp_contact_number: member.emergency_contact.contact_number ?? '',
            cp_fb_messenger_account: member.emergency_contact.fb_messenger_account ?? '',
            cp_relationship: member.emergency_contact.relationship ?? ''
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {  
        setShowEditModal(false);
        setErrors({});
    }

    const handleEditSubmit = async (e) => {
        setIsEditing(true);
        e.preventDefault();
        try {
            console.log(memberData);
            await _put(`/members/${editingMember.id}`, memberData);
            toast.success("Member has been updated!");
            setShowEditModal(false);
            fetchMembers();
            setIsEditing(false);
            setMemberData({
                first_name: '', middle_name: '', last_name: '', nick_name: '',
                address: '', dob: '', civil_status: '', contact_number: '', fb_messenger_account: '',
                contact_person: '', cp_address: '', cp_contact_number: '', cp_fb_messenger_account: '', cp_relationship: ''
            });
        } catch (error) {
        if (error.response && error.response.data.errors) {
            toast.error("Error updating member's information!");
            setErrors(error.response.data.errors);
            setIsEditing(false);
        }
        }
    };

    const handleDeleteAction = (id) => {
        setToBeDeleted(id);
        setConfirmDelete(true);
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await _delete(`/members/${toBeDeleted}`);
            toast.success("Member has been deleted!");
            setIsDeleting(false);
            setConfirmDelete(false);
            fetchMembers();
        } catch (error) {
            toast.error("Error deleting a member!");
            console.error("Error deleting member:", error);
            setIsDeleting(false);
        }
    };

    const closeDeleteConfirmation = () => {
        setConfirmDelete(false);
    }

    const handleSearch = async (search) => {
        if (search.trim() === "") return;

        try {
            const response = await _get(`/members/search?search=${search}`);
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

  return (
    <Admin>
        {confirmDelete && <ConfirmationAlert title="Confirm Deletion" message="Are you sure you want to delete this member?" onClose={closeDeleteConfirmation} onConfirm={handleDelete} isDelete={true} isDeleting={isDeleting} />}
        <div className="p-6 w-full mx-auto">
            <h2 className="text-xl font-medium mb-4">Member Management</h2>
            <div className="flex items-center justify-between mb-4">
                <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4">
                    <p>Search</p>
                    <input onChange={(e) => handleSearch(e.target.value)} type="text" className="px-4 py-2 rounded border border-gray-300 text-sm" placeholder="Search for name or facebook account.." />
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded" onClick={() => setShowAddModal(true)}>+ Add Member</button>
            </div>
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
                        <button className="bg-red-50 text-red-600 px-1 py-1 rounded" onClick={() => handleDeleteAction(member.id)}><Trash2 size={16} /></button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {loading && (
                <div className="w-full h-20 flex items-center justify-center"><p>Loading..</p></div>
            )}

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
                                {errors.first_name && <p className="text-red-600 text-xs">{errors.first_name}</p>}
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
                            <input type="text" name="contact_person" placeholder="Contact Person" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />  
                            {errors.contact_person && <p className="text-red-600 text-xs">{errors.contact_person}</p>}
                        </div>
                        <div className="flex flex-col w-full">
                            <input type="text" name="cp_address" placeholder="Address" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />  
                            {errors.cp_address && <p className="text-red-600 text-xs">{errors.cp_address}</p>}
                        </div>
                        
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col w-full">
                                <input type="text" name="cp_contact_number" placeholder="Contact Number" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} /> 
                                {errors.cp_contact_number && <p className="text-red-600 text-xs">{errors.cp_contact_number}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input type="text" name="cp_relationship" placeholder="Relationship" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.cp_relationship && <p className="text-red-600 text-xs">{errors.cp_relationship}</p>}
                            </div>
                        </div>
                        <input type="text" name="cp_fb_messenger_account" placeholder="FB Messenger" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={handleCloseAddModel} className="w-fit mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md ">Cancel</button>
                            <button onClick={handleSubmit} className="w-fit mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">{isSaving ? "Saving..." : "Save Member"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {showEditModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900/10">
                    <div className="bg-white p-6 rounded-lg w-[900px]">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-semibold">Add Member</h3>
                            <button onClick={closeEditModal}><X /></button>
                        </div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex flex-col w-full">
                                <input type="text" value={memberData.first_name} name="first_name" placeholder="First Name" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.first_name && <p className="text-red-600 text-xs">{errors.first_name}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input type="text" value={memberData.middle_name} name="middle_name" placeholder="Middle Name" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.middle_name && <p className="text-red-600 text-xs">{errors.middle_name}</p>}
                            </div>
                        </div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex flex-col w-full">
                                <input type="text" value={memberData.last_name} name="last_name" placeholder="Last Name" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.last_name && <p className="text-red-600 text-xs">{errors.last_name}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input type="text" value={memberData.nick_name} name="nick_name" placeholder="Nick Name" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.nick_name && <p className="text-red-600 text-xs">{errors.nick_name}</p>}
                            </div>
                        </div>
                        
                        
                        <input type="text" value={memberData.address} name="address" placeholder="Address" className="border p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex flex-col w-full">
                                <input type="date" value={memberData.dob} name="dob" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.dob && <p className="text-red-600 text-xs">{errors.dob}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input type="text" value={memberData.civil_status} name="civil_status" placeholder="Civil Status" className="border rounded p-2 w-full " onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.civil_status && <p className="text-red-600 text-xs">{errors.civil_status}</p>}
                            </div>
                        </div>
                        
                        <input type="text" value={memberData.contact_number} name="contact_number" placeholder="Contact Number" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />
                        <input type="text" value={memberData.fb_messenger_account} name="fb_messenger_account" placeholder="FB Messenger" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />

                        <h4 className="text-md font-semibold mt-4 mb-4">Emergency Contact</h4>
                        <div className="flex flex-col w-full">
                            <input type="text" value={memberData.contact_person ?? ''} name="contact_person" placeholder="Contact Person" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />  
                            {errors.contact_person && <p className="text-red-600 text-xs">{errors.contact_person}</p>}
                        </div>
                        <div className="flex flex-col w-full">
                            <input type="text" value={memberData?.cp_address ?? ''} name="cp_address" placeholder="Address" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />  
                            {errors.cp_address && <p className="text-red-600 text-xs">{errors.cp_address}</p>}
                        </div>
                        
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col w-full">
                                <input type="text" value={memberData?.cp_contact_number ?? ''} name="cp_contact_number" placeholder="Contact Number" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} /> 
                                {errors.cp_contact_number && <p className="text-red-600 text-xs">{errors.cp_contact_number}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input type="text" value={memberData?.cp_relationship ?? ''} name="cp_relationship" placeholder="Relationship" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />
                                {errors.cp_relationship && <p className="text-red-600 text-xs">{errors.cp_relationship}</p>}
                            </div>
                        </div>
                        <input type="text" value={memberData?.cp_fb_messenger_account ?? ''} name="cp_fb_messenger_account" placeholder="FB Messenger" className="border rounded p-2 w-full mb-3" onChange={(e) => handleInputChange(e, setMemberData)} />
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={closeEditModal} className="w-fit mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md ">Cancel</button>
                            <button onClick={handleEditSubmit} className="w-fit mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">{isEditing ? "Updating..." : "Update"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Admin>
  );
};

export default Members;
