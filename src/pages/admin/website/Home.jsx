import { useEffect, useMemo, useState } from "react";
import Admin from "../../../layouts/Admin";
import { _get, _put } from "../../../api";
import CircularLoading from "../../../components/CircularLoading";
import SuccesAlert from "../../../components/alerts/SuccesAlert";
import { toast } from "react-toastify";

const WebHome = () => {
    const [formData, setFormData] = useState({
        welcome_message: "",
        intro_text: "",
        women_supported: "",
        meals_served: "",
        communities_reached: "",
        number_of_volunteers: "",
    });
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchHomepageInfo = async () => {
        setLoading(true);
        try {
            const response = await _get("/homepage-info");
            const data = response.data || {};
            const cleaned = {
                welcome_message: data.welcome_message || "",
                intro_text: data.intro_text || "",
                women_supported: data.women_supported || "",
                meals_served: data.meals_served || "",
                communities_reached: data.communities_reached || "",
                number_of_volunteers: data.number_of_volunteers || "",
            };
            setFormData(cleaned);
            setOriginalData(cleaned);
        } catch (error) {
            console.error("Error fetching homepage info:", error);
            toast.error("Unable to load homepage info.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomepageInfo();
    }, []);

    const hasChanges = useMemo(() => {
        if (!originalData) return false;
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    }, [formData, originalData]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!hasChanges) return;

        setSaving(true);
        try {
            setValidationErrors({});
            await _put("/homepage-info", formData);
            setSuccessMessage("Homepage content saved successfully.");
            setShowSuccessAlert(true);
            setOriginalData(formData);
        } catch (error) {
            console.error("Error saving homepage info:", error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                toast.error("Unable to save homepage info. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const header = {
        title: "Website Home",
        subTitle: "Manage the content shown on the home page",
    };

    const breadcrumbs = [
        { name: "Website Content", link: "/web-content" },
        { name: "Home", link: "/web-content/home" },
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full max-w-5xl mx-auto mt-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Homepage Content</h2>
                            <p className="text-xs text-gray-500">Update the hero copy and impact stats displayed on the site.</p>
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
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Welcome message</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-16 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter the welcome message"
                                    value={formData.welcome_message}
                                    onChange={(e) => handleChange("welcome_message", e.target.value)}
                                />
                                {validationErrors.welcome_message && (
                                    <p className="text-xs text-red-500">{validationErrors.welcome_message[0]}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Intro text</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-16 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter the intro text"
                                    value={formData.intro_text}
                                    onChange={(e) => handleChange("intro_text", e.target.value)}
                                />
                                {validationErrors.intro_text && (
                                    <p className="text-xs text-red-500">{validationErrors.intro_text[0]}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Women supported</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., 1,200+"
                                        value={formData.women_supported}
                                        onChange={(e) => handleChange("women_supported", e.target.value)}
                                    />
                                    {validationErrors.women_supported && (
                                        <p className="text-xs text-red-500">{validationErrors.women_supported[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Meals served</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., 5,000+"
                                        value={formData.meals_served}
                                        onChange={(e) => handleChange("meals_served", e.target.value)}
                                    />
                                    {validationErrors.meals_served && (
                                        <p className="text-xs text-red-500">{validationErrors.meals_served[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Communities reached</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., 12 barangays"
                                        value={formData.communities_reached}
                                        onChange={(e) => handleChange("communities_reached", e.target.value)}
                                    />
                                    {validationErrors.communities_reached && (
                                        <p className="text-xs text-red-500">{validationErrors.communities_reached[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Number of volunteers</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., 150+"
                                        value={formData.number_of_volunteers}
                                        onChange={(e) => handleChange("number_of_volunteers", e.target.value)}
                                    />
                                    {validationErrors.number_of_volunteers && (
                                        <p className="text-xs text-red-500">{validationErrors.number_of_volunteers[0]}</p>
                                    )}
                                </div>
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

export default WebHome;
