import { useEffect, useState } from "react";
import { MapPin, Phone, Send } from "lucide-react";
import Guest from "../layouts/Guest";
import aboutImage from "../assets/img/about.png";
import { toast } from "react-toastify";
import { _post, _get } from "../api";
import Footer from "../components/Footer";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [contactInfo, setContactInfo] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const response = await _get("/contact-info");
            setContactInfo(response.data || {});
        } catch (error) {
            console.error("Error fetching contact info:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            await _post("/enquiries", formData);
            toast.success("Your message has been sent!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Something went wrong, please try again!");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Guest>
            {/* HERO HEADER */}
            <div className="w-full max-w-[1200px] mx-auto px-4 py-16 pt-32">
                <div className="flex flex-col items-center text-center space-y-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-orange-500 font-semibold">Contact</p>
                    <h1 className="text-4xl font-semibold text-gray-800 chewy">We&apos;d love to hear from you</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Reach out with questions, partnerships, or ways we can collaborate to uplift women and communities.
                    </p>
                </div>

                {/* CONTACT INFO SECTION */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ADDRESS */}
                    <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6 flex flex-col gap-3 text-center">
                        <div className="mx-auto w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                            <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">Address</p>
                        <p className="text-sm text-gray-600">
                            {contactInfo?.physical_address ? contactInfo.physical_address : (
                                <>
                                    ...
                                </>
                            )}
                        </p>
                    </div>

                    {/* PHONE */}
                    <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6 flex flex-col gap-3 text-center">
                        <div className="mx-auto w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                            <Phone className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">Phone</p>
                        <p className="text-sm text-gray-600">
                            TL#: {contactInfo?.telephone_number || "..."}<br />
                            CP: {contactInfo?.phone_number || "..."}
                        </p>
                    </div>

                    {/* EMAIL */}
                    <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6 flex flex-col gap-3 text-center">
                        <div className="mx-auto w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                            <Send className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">Email</p>
                        <p className="text-sm text-gray-600 break-all">{contactInfo?.email_address || "..."}</p>
                    </div>
                </div>
            </div>

            {/* CONTACT FORM SECTION */}
            <div className="w-full bg-white py-16">
                <div className="w-full max-w-[1100px] mx-auto px-4 space-y-10">
                    
                    {/* TITLE */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Send us a message</p>
                            <h1 className="text-3xl font-bold text-gray-800 chewy">Let&apos;s talk</h1>
                            <p className="text-sm text-gray-600 max-w-xl">
                                Tell us how we can help. We aim to respond within 1-2 business days.
                            </p>
                        </div>
                    </div>

                    {/* FORM SECTION */}
                    <form 
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
                    >
                        {/* IMAGE */}
                        <div className="w-full">
                            <img 
                                src={aboutImage}
                                alt="Contact"
                                className="w-full h-80 md:h-[420px] object-cover rounded-2xl shadow"
                            />
                        </div>

                        {/* FORM FIELDS */}
                        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-orange-100 space-y-5">
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Your Name</label>
                                <input
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    name="name"
                                    className="bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Your Email</label>
                                <input
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    className="bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={handleChange}
                                    name="message"
                                    className="bg-white border border-gray-300 rounded px-4 py-2 text-sm h-28 text-gray-700 focus:outline-none focus:border-orange-400"
                                    placeholder="How can we help you today?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className={`bg-orange-600 hover:bg-orange-700 transition text-white font-semibold px-5 py-2 rounded-md shadow text-sm w-full md:w-auto ${isSending ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {isSending ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </Guest>
    );
};

export default ContactUs;
