import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import ModalContainer from "../ModalContainer";
import { _post } from "../../api";
import { AuthContext } from "../../AuthProvider";
import SuccesAlert from "../alerts/SuccesAlert";

const VolunteerButton = ({ project }) => {


    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        contactNumber: "",
    });
    const [errors, setErrors] = useState({});
    const { user } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        setErrors({});
        if (!project) {
            setErrors({ form: "Project information is missing. Please try again later." });
            return;
        }
        setIsSubmitting(true);

        const payload = user
            ? {
                  first_name: user.firstName,
                  middle_name: user.middleName,
                  last_name: user.lastName,
                  email: user.email,
                  contact_number: user.contactNumber,
              }
            : {
                  first_name: formData.firstName,
                  middle_name: formData.middleName || null,
                  last_name: formData.lastName,
                  email: formData.email,
                  contact_number: formData.contactNumber,
              };

        try {
            await _post(`/projects/${project.id}/volunteer`, payload);
            setIsFormOpen(false);
            setShowSuccessModal(true);
            setFormData({
                firstName: "",
                middleName: "",
                lastName: "",
                email: "",
                contactNumber: "",
            });
        } catch (error) {
            const backendErrors = error?.response?.data?.errors;
            if (backendErrors) {
                const fieldMap = {
                    first_name: "firstName",
                    middle_name: "middleName",
                    last_name: "lastName",
                    email: "email",
                    contact_number: "contactNumber",
                };

                const formattedErrors = {};
                Object.entries(backendErrors).forEach(([key, messages]) => {
                    const mappedKey = fieldMap[key] || key;
                    formattedErrors[mappedKey] = Array.isArray(messages)
                        ? messages.join(" ")
                        : String(messages);
                });
                const firstMessage = Object.values(formattedErrors).find(Boolean);
                setErrors(firstMessage ? { ...formattedErrors, form: firstMessage } : formattedErrors);
            } else {
                setErrors({ form: "Something went wrong. Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex">
            <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="w-fit bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1 rounded-md">
                Volunteer
            </button>

            {isFormOpen && (
                createPortal(
                    <ModalContainer close={() => setIsFormOpen(false)}>
                        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-orange-600">
                                    Volunteer Information
                                </h2>
                                <p className="text-sm text-gray-700">
                                    Please provide the following information so we can review and process your
                                    volunteer request.
                                </p>
                                <p className="text-xs mt-2 italic">You are about to send a volunteering request for the project <span className="text-orange-500">"{project.title}"</span></p>
                                {/* <p className="text-xs italic"><span className="text-sm text-red-500">*</span> - indicates required fields</p> */}
                            </div>
                            
                            {user ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-700">
                                        We'll send your volunteer request using your saved account details.
                                    </p>
                                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-700 space-y-1">
                                        <p><span className="font-medium">Name:</span> {user.firstName} {user.middleName} {user.lastName}</p>
                                        <p><span className="font-medium">Email:</span> {user.email}</p>
                                        <p><span className="font-medium">Contact:</span> {user.contactNumber}</p>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsFormOpen(false)}
                                            className="px-4 py-2 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 text-xs rounded-md bg-orange-600 text-white hover:bg-orange-700"
                                        >
                                            {isSubmitting ? "Sending your request..." : "Confirm"}
                                        </button>
                                    </div>
                                    {errors.form && <p className="text-xs text-red-600">{errors.form}</p>}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="firstName" className="text-xs font-medium text-gray-700">First Name <span className="text-sm text-red-500">*</span> </label>
                                            <input
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="max-h-9 mt-1 rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-orange-500"
                                                placeholder="Enter your first name"
                                            />
                                            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="middleName" className="text-xs font-medium text-gray-700">Middle Name (Optional)</label>
                                            <input
                                                id="middleName"
                                                name="middleName"
                                                value={formData.middleName}
                                                onChange={handleChange}
                                                className="max-h-9 mt-1 rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-orange-500"
                                                placeholder="Enter your middle name"
                                            />
                                            {errors.middleName && <p className="mt-1 text-xs text-red-600">{errors.middleName}</p>}
                                        </div>

                                        <div className="flex flex-col">
                                            <label htmlFor="lastName" className="text-xs font-medium text-gray-700">Last Name <span className="text-sm text-red-500">*</span> </label>
                                            <input
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="max-h-9 mt-1 rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-orange-500"
                                                placeholder="Enter your last name"
                                            />
                                            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                                        </div>

                                        <div className="flex flex-col">
                                            <label htmlFor="email" className="text-xs font-medium text-gray-700">Email <span className="text-sm text-red-500">*</span> </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="max-h-9 mt-1 rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-orange-500"
                                                placeholder="Enter your email"
                                            />
                                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                        </div>

                                        <div className="flex flex-col md:col-span-2">
                                            <label htmlFor="contactNumber" className="text-xs font-medium text-gray-700">Contact Number <span className="text-sm text-red-500">*</span> </label>
                                            <input
                                                id="contactNumber"
                                                name="contactNumber"
                                                value={formData.contactNumber}
                                                onChange={handleChange}
                                                className="max-h-9 mt-1 rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-orange-500"
                                                placeholder="Enter your contact number"
                                            />
                                            {errors.contactNumber && <p className="mt-1 text-xs text-red-600">{errors.contactNumber}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsFormOpen(false)}
                                            className="px-4 py-2 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 text-xs rounded-md bg-orange-600 text-white hover:bg-orange-700"
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </ModalContainer>,
                    document.body
                )
            )}
            {showSuccessModal && createPortal(
                <SuccesAlert
                    message="Thank you for volunteering. Please check your email for confirmation and next steps."
                    onClose={() => setShowSuccessModal(false)}
                />,
                document.body
            )}
        </div>
    );
}

export default VolunteerButton;
