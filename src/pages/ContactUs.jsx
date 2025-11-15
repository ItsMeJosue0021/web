// import React from "react";
// import Guest from "../layouts/Guest";
// import aboutImage from "../assets/img/about.png";
// import supermom from "../assets/img/supermom.png";
// import feeding from "../assets/img/feeding.png";
// import volunteers from "../assets/img/volunteers.png";
// import volunteer from "../assets/img/volunteer.png";
// import logo from "../assets/img/logo.png";
// import contact from "../assets/img/contact.png";
// import { MapPin, Phone, Send } from "lucide-react";
// import { toast } from 'react-toastify';
// import { useState } from "react";
// import { _post } from "../api";
// import Footer from "../components/Footer";

// const ContactUs = () => {

//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         message: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await _post("/enquiries", formData);
//             toast.success("Your message has ben sent!");
//             setFormData({ name: "", email: "", message: "" });
//         } catch (error) {
//             toast.error("Something went wrong, please try again!");
//             console.error("Error submitting enquiry:", error);
//         }
//     };

//     return (
//         <Guest>
//             <div className="w-full max-w-[1200px] mx-auto px-4 py-20 5">
//                 <div className="flex flex-col gap-4 items-center justify-start">
//                     <p className="text-4xl font-semibold text-orange-500">Get in Touch</p>
//                     <div className="flex flex-col items-center justify-center">
//                         <p className="text-2xl font-semibold">Contact Information</p>
//                         <p>Don't hesitate to contact us with any questions or to learn more about our organization. We're happy to assist you!</p>
//                     </div>

//                     <div className="w-full border-y border-gray-300 mt-12 flex flex-col gap-4 justify-center items-center py-8">
//                         <p className="text-orange-600 font-bold">Address</p>
//                          <div className="flex items-center gap-8">
//                             <MapPin className="w-12 h-12" />
//                             <p className="text-xl">B4 LOT6-6 FANTACY ROAD 3 TERESA PARK SUBD. PILAR LAS PINAS CITY</p>
//                         </div>
//                     </div>
//                     <div className="w-full flex border-b border-gray-300 my-1">
//                         <div className="w-full flex flex-col gap-4 justify-center items-center py-8">
//                             <p className="text-orange-600 font-bold">Phone</p>
//                             <div className="flex items-center gap-8">
//                                 <Phone className="w-12 h-12" />
//                                 <p className="text-xl">TL#: 0283742811 | CP: 09209859508</p>
//                             </div>
//                         </div>
//                         <div className="w-full flex flex-col gap-4 justify-center items-center py-8">
//                             <p className="text-orange-600 font-bold">Email</p>
//                             <div className="flex items-center gap-8">
//                                 <Send className="w-12 h-12 " />
//                                 <p className="text-xl">kalingangkababaihan.wllpc@gmail.com</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="w-full bg-orange-500 py-16">
//                 <div className="w-full max-w-[1200px] mx-auto px-4 flex gap-5 flex-col">
//                     <div className="flex items-center flex-col justify-start">
//                         <h1 className="text-4xl chewy text-white">Contact Us</h1>
//                         <p className="text-white text-lg">Contact our team for inquiries, partnerships, or support.</p>
//                     </div>
//                     <form onSubmit={handleSubmit} className="w-full flex items-center gap-5">
//                         <div className="w-full">
//                             <img src={aboutImage} alt="" className="w-full h-96 rounded-lg" />
//                         </div>
//                         <div className="w-full flex flex-col gap-4 bg-white p-5 py-6 rounded-md ">
//                             <div className="w-full flex flex-col">
//                                 <p className="text-sm">Your Name</p>
//                                 <input  value={formData.name} onChange={handleChange} type="text" name="name" id="name" placeholder="Type sometihng.." className="bg-transparent text-sm w-full border border-gray-300 rounded px-4 py-2 placeholder:text-white"/>
//                             </div>
//                             <div className="w-full flex flex-col">
//                                 <p className="text-sm">Your Email</p>
//                                 <input value={formData.email} onChange={handleChange} type="email" name="email" id="email" placeholder="Type sometihng.." className="bg-transparent text-sm w-full border border-gray-300 rounded px-4 py-2 placeholder:text-white"/>
//                             </div>
//                             <div className="w-full flex flex-col">
//                                 <p className="text-sm">How can we help you Today?</p>
//                                 <textarea value={formData.message} onChange={handleChange} name="message" id="message" placeholder="Type sometihng.." className="h-28 w-full bg-transparent border border-gray-300 rounded p-4 placeholder:text-white"></textarea>
//                             </div>
//                             <button type="submit" className="w-full text-white rounded-md text-sm bg-orange-500 hover:bg-orange-600 px-5 py-2 text-center shadow">Send</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//             <Footer/>
//         </Guest>
//     );
// };

// export default ContactUs;

import React, { useState } from "react";
import { MapPin, Phone, Send } from "lucide-react";
import Guest from "../layouts/Guest";
import aboutImage from "../assets/img/about.png";
import { toast } from "react-toastify";
import { _post } from "../api";
import Footer from "../components/Footer";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await _post("/enquiries", formData);
            toast.success("Your message has been sent!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            toast.error("Something went wrong, please try again!");
        }
    };

    return (
        <Guest>
            {/* HERO HEADER */}
            <div className="w-full max-w-[1200px] mx-auto px-4 py-16 pt-32">
                <div className="flex flex-col items-center text-center space-y-4">
                    <h1 className="text-4xl font-semibold text-orange-600">Get in Touch</h1>
                    <p className="text-2xl font-semibold text-gray-800">Contact Information</p>
                    <p className="text-gray-600 max-w-2xl">
                        Don't hesitate to contact us with any questions or to learn more about our organization.
                        We're always here to assist you!
                    </p>
                </div>

                {/* CONTACT INFO SECTION */}
                <div className="mt-12 grid gap-8">
                    {/* ADDRESS */}
                    <div className="border-y border-gray-300 py-8 text-center space-y-4">
                        <p className="text-orange-600 font-bold text-lg">Address</p>
                        <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-4">
                            <MapPin className="w-10 h-10 mx-auto md:mx-0 text-orange-600" />
                            <p className="text-lg text-gray-700 max-w-xl">
                                B4 LOT6-6 FANTACY ROAD 3 TERESA PARK SUBD. PILAR LAS PINAS CITY
                            </p>
                        </div>
                    </div>

                    {/* CONTACT ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-300">
                        {/* PHONE */}
                        <div className="py-8 flex flex-col items-center space-y-4 text-center">
                            <p className="text-orange-600 font-bold text-lg">Phone</p>
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <Phone className="w-10 h-10 text-orange-600" />
                                <p className="text-lg text-gray-700">TL#: 0283742811 | CP: 09209859508</p>
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="py-8 flex flex-col items-center space-y-4 text-center">
                            <p className="text-orange-600 font-bold text-lg">Email</p>
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <Send className="w-10 h-10 text-orange-600" />
                                <p className="text-lg text-gray-700 break-all">
                                    kalingangkababaihan.wllpc@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTACT FORM SECTION */}
            <div className="w-full bg-orange-500 py-16">
                <div className="w-full max-w-[1200px] mx-auto px-4 space-y-8">
                    
                    {/* TITLE */}
                    <div className="text-center text-white space-y-2">
                        <h1 className="text-4xl chewy">Contact Us</h1>
                        <p className="text-lg">Contact our team for inquiries, partnerships, or support.</p>
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
                                className="w-full h-80 md:h-96 object-cover rounded-lg shadow-lg"
                            />
                        </div>

                        {/* FORM FIELDS */}
                        <div className="bg-white p-6 rounded-lg shadow space-y-5">
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-600">Your Name</label>
                                <input
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    name="name"
                                    className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-600">Your Email</label>
                                <input
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-600">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={handleChange}
                                    name="message"
                                    className="border border-gray-300 rounded px-4 py-2 text-sm h-28 text-gray-700 focus:outline-none"
                                    placeholder="How can we help you today?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 transition text-white font-semibold px-5 py-2 rounded-md shadow text-sm"
                            >
                                Send Message
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
