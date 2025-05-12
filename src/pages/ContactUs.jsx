import React from "react";
import Guest from "../layouts/Guest";
import aboutImage from "../assets/img/about.png";
import supermom from "../assets/img/supermom.png";
import feeding from "../assets/img/feeding.png";
import volunteers from "../assets/img/volunteers.png";
import volunteer from "../assets/img/volunteer.png";
import logo from "../assets/img/logo.png";
import contact from "../assets/img/contact.png";
import { MapPin, Phone, Send } from "lucide-react";
import { toast } from 'react-toastify';
import { useState } from "react";
import { _post } from "../api";

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
            toast.success("Your message has ben sent!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            toast.error("Something went wrong, please try again!");
            console.error("Error submitting enquiry:", error);
        }
    };

    return (
        <Guest>
            <div className="w-screen min-screen h-auto flex flex-col items-center justify-center pt-24">
                <div className="relative md:h-[800px] w-full">
                    <img src={contact} alt="" className="absolute top-0 left-0 w-full h-full object-cover object-center "/>
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
                </div>
                
            </div>
            <div className="w-full max-w-[1200px] mx-auto px-4 py-20 5">
                <div className="flex flex-col gap-4 items-center justify-start">
                    <p className="text-4xl font-semibold text-orange-500">Get in Touch</p>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-semibold">Contact Information</p>
                        <p>Don't hesitate to contact us with any questions or to learn more about our organization. We're happy to assist you!</p>
                    </div>

                    <div className="w-full border-y border-gray-300 mt-12 flex flex-col gap-4 justify-center items-center py-8">
                        <p className="text-orange-600 font-bold">Address</p>
                         <div className="flex items-center gap-8">
                            <MapPin className="w-12 h-12" />
                            <p className="text-xl">B4 LOT6-6 FANTACY ROAD 3 TERESA PARK SUBD. PILAR LAS PINAS CITY</p>
                        </div>
                    </div>
                    <div className="w-full flex border-b border-gray-300 my-1">
                        <div className="w-full flex flex-col gap-4 justify-center items-center py-8">
                            <p className="text-orange-600 font-bold">Phone</p>
                            <div className="flex items-center gap-8">
                                <Phone className="w-12 h-12" />
                                <p className="text-xl">TL#: 0283742811 | CP: 09209859508</p>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-4 justify-center items-center py-8">
                            <p className="text-orange-600 font-bold">Email</p>
                            <div className="flex items-center gap-8">
                                <Send className="w-12 h-12 " />
                                <p className="text-xl">kalingangkababaihan.wllpc@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full bg-orange-500 py-16">
                    <div className="w-full max-w-[1200px] mx-auto px-4 flex gap-5 flex-col">
                        <div className="flex items-center flex-col justify-start">
                            <h1 className="text-4xl chewy text-white">Contact Us</h1>
                            <p className="text-white text-lg">Contact our team for inquiries, partnerships, or support.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="w-full flex items-center gap-5">
                            <div className="w-full">
                                <img src={aboutImage} alt="" className="w-full h-96 rounded-lg" />
                            </div>
                            <div className="w-full flex flex-col gap-4 bg-white p-5 py-6 rounded-md ">
                                <div className="w-full flex flex-col">
                                    <p className="text-sm">Your Name</p>
                                    <input  value={formData.name} onChange={handleChange} type="text" name="name" id="name" placeholder="Type sometihng.." className="bg-transparent text-sm w-full border border-gray-300 rounded px-4 py-2 placeholder:text-white"/>
                                </div>
                                <div className="w-full flex flex-col">
                                    <p className="text-sm">Your Email</p>
                                    <input value={formData.email} onChange={handleChange} type="email" name="email" id="email" placeholder="Type sometihng.." className="bg-transparent text-sm w-full border border-gray-300 rounded px-4 py-2 placeholder:text-white"/>
                                </div>
                                <div className="w-full flex flex-col">
                                    <p className="text-sm">How can we help you Today?</p>
                                    <textarea value={formData.message} onChange={handleChange} name="message" id="message" placeholder="Type sometihng.." className="h-28 w-full bg-transparent border border-gray-300 rounded p-4 placeholder:text-white"></textarea>
                                </div>
                                <button type="submit" className="w-full text-white rounded-md text-sm bg-orange-500 hover:bg-orange-600 px-5 py-2 text-center shadow">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            <footer className="bg-gray-50 border-t">
                <div className="max-w-[1200px] mx-auto px-4 py-20 ">
                    <div className="flex flex-col md:flex-row items-center gap-10 md:items-start md:justify-between">
                        <div className="w-full flex flex-col md:flex-row md:gap-12 items-center md:items-start">
                            <img src={logo} alt="logo" className="w-40 h-40 rounded-full"/>
                            <div className="flex flex-col items-center md:items-start pt-5 text-lg poppins-regular">
                                <p>About Us</p>
                                <p>Mission</p>
                                <p>Vision</p>
                                <p>Contact Us</p>
                            </div>
                            <div className="flex flex-col items-center md:items-start pt-5 text-lg poppins-regular">
                                <p>Volunteers</p>
                                <p>FAQs</p>
                                <p>Sign Up</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 cursor-pointer">
                            <span class="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-[#6a76ac]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 448 512">
                                    
                                    <path
                                    d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                                </svg>
                            </span>

                            <span class="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-[#1877f2]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path
                                    d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                                </svg>
                            </span>

                            <span class="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-[#0084ff]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 512 512">
                                    <path
                                    d="M256.6 8C116.5 8 8 110.3 8 248.6c0 72.3 29.7 134.8 78.1 177.9 8.4 7.5 6.6 11.9 8.1 58.2A19.9 19.9 0 0 0 122 502.3c52.9-23.3 53.6-25.1 62.6-22.7C337.9 521.8 504 423.7 504 248.6 504 110.3 396.6 8 256.6 8zm149.2 185.1l-73 115.6a37.4 37.4 0 0 1 -53.9 9.9l-58.1-43.5a15 15 0 0 0 -18 0l-78.4 59.4c-10.5 7.9-24.2-4.6-17.1-15.7l73-115.6a37.4 37.4 0 0 1 53.9-9.9l58.1 43.5a15 15 0 0 0 18 0l78.4-59.4c10.4-8 24.1 4.5 17.1 15.6z" />
                                </svg>
                            </span>

                        </div>    
                    </div>
                    <div className="pt-12">
                        <p className="text-center text-lg poppins-regular">© 2021 Kalinga ng Kababaihan. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </Guest>
    );
};

export default ContactUs;