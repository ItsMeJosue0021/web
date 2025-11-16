import { useState, useEffect } from "react";
import { _get, _put } from "../../api";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const UpdateUserForm = ({ user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        confirmPassword: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {

        setFormData({
            name: user.name,
            email: user.email,
            password: "", 
        });

    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setErrors({ password: ["Passwords do not match"] });
            setLoading(false);
            return;
        }

        try {
            const response = await _put(`/users/${user.id}`, formData);

            toast.success("User updated successfully.");
            onSuccess();
            onClose();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.error("Update failed:", error);
            toast.error("Update failed. Please try again.");
        }
        setLoading(false);
    };

    if (!user) return null;

    return (
        <AnimatePresence>
            <motion.div 
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-w-96 w-full md:max-w-[700px] mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-base font-semibold mb-4">Update User</h2>

                <form onSubmit={handleSubmit}>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="">
                            <label className="text-xs block font-medium">First Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full min-w-48 px-4 py-2 text-xs border rounded"
                                required
                            />
                        </div>

                        <div className="">
                            <label className="text-xs block font-medium">Middle Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full min-w-48 px-4 py-2 text-xs border rounded"
                                required
                            />
                        </div>

                        <div className="">
                            <label className="text-xs block font-medium">Last Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full min-w-48 px-4 py-2 text-xs border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs block font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-xs w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium text-xs">Password (<span className="text-xs">Leave blank to keep current password</span>)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 text-xs py-2 border rounded"
                        />
                        {errors && errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 text-xs py-2 border rounded"
                        />
                    </div>
                    
                    <div className="w-full text-sm flex items-center justify-end gap-2">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:orange-600 text-white text-xs px-4 py-2 rounded"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update User"}
                        </button>
                        <button className="px-4 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded" onClick={() => onClose()}>Cancel</button>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
       
    );
};

export default UpdateUserForm;
