import React from "react";
import Guest from "../layouts/Guest";
import aboutImage from "../assets/img/about.png";
import supermom from "../assets/img/supermom.png";
import feeding from "../assets/img/feeding.png";
import volunteers from "../assets/img/volunteers.png";
import logo from "../assets/img/logo.png";
import { toast } from 'react-toastify';
import { useState } from "react";
import { _post } from "../api";
import Footer from "../components/Footer";

const AboutUs = () => {

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
                    <img src={aboutImage} alt="" className="absolute top-0 left-0 w-full h-full object-cover object-center "/>
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
                    <div className="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center flex-col">
                        <div className="w-full h-full max-w-[1100px] mx-auto flex items-start justify-center flex-col gap-6">
                            <h2 data-aos="fade-left" data-aos-delay="100" className="text-white text-6xl font-semibold text-left">This is who we are!</h2>
                            <p data-aos="fade-left" data-aos-delay="200" className="text-white text-xl text-justify">Kalinga ng Kababaihan is a community initiative focused on empowering women through skills training, health support, legal aid, and advocacy. It promotes financial independence, gender equality, and community engagement while providing assistance in areas such as maternal care, mental health, and disaster preparedness. 
                                Through education and leadership programs, the organization aims to uplift women and build a more inclusive society.</p>
                        </div>
                    </div>
                </div>
                <div className="relative w-full" >
                    <div className="absolute -top-44 left-0 w-full h-full ">
                        <div className="max-w-[1100px] mx-auto bg-white h-80 shadow-xl rounded-xl flex items-center justify-between gap-12 p-10">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-3xl font-bold text-orange-600">Mission</h2>
                                <p className="text-lg text-justify">Our mission is to help the less fortunate by providing them with the necessary resources they need to survive. We believe that everyone deserves a chance to live a better life.</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-3xl font-bold text-orange-600">Vission</h2>
                                <p className="text-lg text-justify">Our mission is to help the less fortunate by providing them with the necessary resources they need to survive. We believe that everyone deserves a chance to live a better life.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="pt-56 w-full py-20 bg-gradient-to-tl from-orange-500">
                    <div className="w-full max-w-[1200px] mx-auto px-4">
                        <div className="w-full flex flex-col items-center justify-center gap-14">
                            <h2 className="text-5xl font-bold chewy text-center">Committed Volunteers, Real Impact.</h2>
                            <div className="w-full flex flex-col gap-24">
                                <h2 className="text-3xl font-bold text-center">Organizational Chart</h2>
                                <div className="flex flex-col items-center justify-center">
                                    <p className="text-xl font-bold">Beavin Soriano</p>
                                    <p className="text-sm text-gray-600">President</p>
                                </div>
                                <div className="w-full flex items-start justify-evenly">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-xl font-bold">Juliet Eronico</p>
                                        <p className="text-sm text-gray-600">Vice President</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-xl font-bold">Beavin Soriano</p>
                                        <p className="text-sm text-gray-600">Secretary</p>
                                    </div>
                                </div>
                                <div className="w-full flex items-start justify-evenly">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-xl font-bold">Beavin Soriano</p>
                                        <p className="text-sm text-gray-600">Treasurer</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-xl font-bold">Beavin Soriano</p>
                                        <p className="text-sm text-gray-600">Auditor</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <section className="bg-gradient-to-tl from-orange-500 w-full py-20 pt-56">
                    <div className="max-w-[1200px] mx-auto px-4">
                        <div className="flex justify-center p-4 mb-8">
                            <h2 className="text-5xl font-bold chewy">Our Foundation Advocacy</h2>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-center p-4 gap-5">
                           <div data-aos="fade-left" data-aos-delay="100" className="p-5 rounded-md bg-white flex flex-col justify-start items-start gap-5">
                                <img src={supermom} alt=""  className="w-64 h-48 object-cover object-fit" />
                                <div className="flex flex-col gap-3 w-64">
                                    <h2 className="text-xl font-bold">Super Mom Program</h2>
                                    <p className="text-justify">Your performance throughout the competition was nothing short of spectacular, and your crowning as the winner is a testament to your hard work, dedication, and grace.</p>
                                    <button className="text-sm text-orange-600 bg-white border border-orange-600 px-4 py-2 rounded hover:border-orange-600">See More</button>
                                </div>
                           </div>
                           <div data-aos="fade-left" data-aos-delay="200" className="p-5 rounded-md bg-white flex flex-col justify-start items-start gap-5">
                                <img src={feeding} alt=""  className="w-64 h-48 object-cover object-fit" />
                                <div className="flex flex-col gap-3 w-64">
                                    <h2 className="text-xl font-bold">Feeding Program</h2>
                                    <p className="text-justify">Your performance throughout the competition was nothing short of spectacular, and your crowning as the winner is a testament to your hard work, dedication, and grace.</p>
                                    <button className="text-sm text-orange-600 bg-white border border-orange-600 px-4 py-2 rounded hover:border-orange-600">See More</button>
                                </div>
                           </div>
                           <div data-aos="fade-left" data-aos-delay="300" className="p-5 rounded-md bg-white flex flex-col justify-start items-start gap-5">
                                <img src={volunteers} alt=""  className="w-64 h-48 object-cover object-fit" />
                                <div className="flex flex-col gap-3 w-64">
                                    <h2 className="text-xl font-bold">Volunterism</h2>
                                    <p className="text-justify">Your performance throughout the competition was nothing short of spectacular, and your crowning as the winner is a testament to your hard work, dedication, and grace.</p>
                                    <button className="text-sm text-orange-600 bg-white border border-orange-600 px-4 py-2 rounded hover:border-orange-600">See More</button>
                                </div>
                           </div>
                        </div>
                    </div>
                </section> */}
                <section className="bg-white w-full py-20">
                    <div className="max-w-[1200px] mx-auto px-4">
                        <div className="flex flex-col gap-12 items-center text-center">
                            <h1 className="text-5xl chewy">Our Core Values</h1>
                            <div className="flex w-full flex-col md:flex-row items-center justify-evenly ">
                                <div className="text-xl font-semibold">Leadership</div>
                                <div className="text-xl font-semibold">Collaboration</div>
                                <div className="text-xl font-semibold">Fairness</div>
                                <div className="text-xl font-semibold">Useflness</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-gray-100 ">
                    <div className="w-full max-w-[1200px] mx-auto px-4 py-20 ">
                        <p className="text-center text-5xl font-bold chewy pb-4">Find Us Here!</p>
                        <p className="text-center text-lg pb-10 text-orange-600">B4 Lot 6-6 Fantacy Road 3, Teresa Park Subd., Pilar, Las Piñas City</p>
                        <div className="w-full rounded-md">
                            <div className="w-full h-[500px]">
                                <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1624.643344412647!2d121.00521134463953!3d14.42284865762466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d139981f8ad5%3A0xef833b6731e952d2!2sRespiratory%20and%20Sleep%20Centre!5e0!3m2!1sen!2sph!4v1747614913745!5m2!1sen!2sph"
                                width="100%"
                                height="100%"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                style={{ border: 0 }}
                                className="rounded-md"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer/>
        </Guest>
    );
};

export default AboutUs; 