import { useEffect, useMemo, useState } from "react";
import Admin from "../../../layouts/Admin";
import { _get, _put } from "../../../api";
import CircularLoading from "../../../components/CircularLoading";
import SuccesAlert from "../../../components/alerts/SuccesAlert";
import { toast } from "react-toastify";

const WebContactUs = () => {
    const [formData, setFormData] = useState({
        telephone_number: "",
        phone_number: "",
        email_address: "",
        physical_address: "",
    });
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchContactInfo = async () => {
        setLoading(true);
        try {
            const response = await _get("/contact-info");
            const data = response.data || {};
            const cleaned = {
                telephone_number: data.telephone_number || "",
                phone_number: data.phone_number || "",
                email_address: data.email_address || "",
                physical_address: data.physical_address || "",
            };
            setFormData(cleaned);
            setOriginalData(cleaned);
        } catch (error) {
            console.error("Error fetching contact info:", error);
            toast.error("Unable to load contact information.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const hasChanges = useMemo(() => {
        if (!originalData) return false;
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    }, [formData, originalData]);

    const handleChange = (field, value) => {
        // Restrict numbers for phone fields and enforce 11 digits for phone_number
        if (field === "telephone_number" || field === "phone_number") {
            let cleaned = value.replace(/\D/g, "");
            if (field === "phone_number") {
                cleaned = cleaned.slice(0, 11);
            }
            setFormData((prev) => ({ ...prev, [field]: cleaned }));
            return;
        }

        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!hasChanges) return;

        setSaving(true);
        try {
            setValidationErrors({});
            await _put("/contact-info", formData);
            setSuccessMessage("Contact information saved successfully.");
            setShowSuccessAlert(true);
            setOriginalData(formData);
        } catch (error) {
            console.error("Error saving contact info:", error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                toast.error("Unable to save contact information. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const header = {
        title: "Website Contact",
        subTitle: "Manage the contact details shown on the public site",
    };

    const breadcrumbs = [
        { name: "Website Content", link: "/web-content" },
        { name: "Contact Us", link: "/web-content/contact-us" },
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full max-w-5xl mx-auto mt-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                            <p className="text-xs text-gray-500">Update phone, email, and address details shown on the contact page.</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className={`w-full sm:w-auto px-5 py-2 text-xs rounded text-white transition ${
                                !hasChanges || saving
                                    ? "bg-orange-300 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600"
                            }`}
                        >
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-12 flex items-center justify-center">
                            <CircularLoading customClass="text-orange-500 w-6 h-6" />
                        </div>
                    ) : (
                        <form className="flex flex-col gap-5" onSubmit={handleSave}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Telephone number</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., (02) 1234 5678"
                                        value={formData.telephone_number}
                                        onChange={(e) => handleChange("telephone_number", e.target.value)}
                                    />
                                    {validationErrors.telephone_number && (
                                        <p className="text-xs text-red-500">{validationErrors.telephone_number[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Phone number</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\\d{0,11}"
                                        maxLength={11}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., +63 912 345 6789"
                                        value={formData.phone_number}
                                        onChange={(e) => handleChange("phone_number", e.target.value)}
                                    />
                                    {validationErrors.phone_number && (
                                        <p className="text-xs text-red-500">{validationErrors.phone_number[0]}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Email address</label>
                                <input
                                    type="email"
                                    inputMode="email"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="e.g., hello@example.com"
                                    value={formData.email_address}
                                    onChange={(e) => handleChange("email_address", e.target.value)}
                                />
                                {validationErrors.email_address && (
                                    <p className="text-xs text-red-500">{validationErrors.email_address[0]}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Physical address</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter the full address"
                                    value={formData.physical_address}
                                    onChange={(e) => handleChange("physical_address", e.target.value)}
                                />
                                {validationErrors.physical_address && (
                                    <p className="text-xs text-red-500">{validationErrors.physical_address[0]}</p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {showSuccessAlert && (
                <SuccesAlert
                    message={successMessage || "Success!"}
                    onClose={() => setShowSuccessAlert(false)}
                />
            )}
        </Admin>
    );
};

export default WebContactUs;
