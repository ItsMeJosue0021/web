import React from "react";
import Guest from "../layouts/Guest";
import aboutImage from "../assets/img/about.png";
import supermom from "../assets/img/supermom.png";
import feeding from "../assets/img/feeding.png";
import volunteers from "../assets/img/volunteers.png";
import volunteer from "../assets/img/volunteer.png";
import logo from "../assets/img/logo.png";
import action from "../assets/img/action.png";
import { MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Volunteers = () => {
    return (
        <Guest>
            <div className="w-screen min-screen h-auto flex flex-col items-center justify-center pt-24">
                <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center gap-4 py-6 pb-12">
                    <div className="relative md:h-[550px] w-full">
                        <img src={volunteer} alt="" className="absolute top-0 left-0 w-full h-full object-cover object-center rounded-2xl "/>
                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-2xl"></div>
                    </div>
                </div>
                
                <section className="bg-gradient-to-tl from-orange-500 w-full py-20 pt-12">
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
                                    <Link to={`/volunteers/advocacy/${'dsf4teryfd'}`} className="w-fit text-xs text-orange-600 bg-white border border-orange-600 px-4 py-2 rounded hover:border-orange-600">See More</Link>
                                </div>
                            </div>
                            <div data-aos="fade-left" data-aos-delay="200" className="p-5 rounded-md bg-white flex flex-col justify-start items-start gap-5">
                                <img src={feeding} alt=""  className="w-64 h-48 object-cover object-fit" />
                                <div className="flex flex-col gap-3 w-64">
                                    <h2 className="text-xl font-bold">Feeding Program</h2>
                                    <p className="text-justify">Your performance throughout the competition was nothing short of spectacular, and your crowning as the winner is a testament to your hard work, dedication, and grace.</p>
                                    <Link to={`/volunteers/advocacy/${'dsf4teryfd'}`} className="w-fit text-xs text-orange-600 bg-white border border-orange-600 px-4 py-2 rounded hover:border-orange-600">See More</Link>
                                </div>
                            </div>
                            <div data-aos="fade-left" data-aos-delay="300" className="p-5 rounded-md bg-white flex flex-col justify-start items-start gap-5">
                                <img src={volunteers} alt=""  className="w-64 h-48 object-cover object-fit" />
                                <div className="flex flex-col gap-3 w-64">
                                    <h2 className="text-xl font-bold">Volunterism</h2>
                                    <p className="text-justify">Your performance throughout the competition was nothing short of spectacular, and your crowning as the winner is a testament to your hard work, dedication, and grace.</p>
                                    <Link to={`/volunteers/advocacy/${'dsf4teryfd'}`} className="w-fit text-xs text-orange-600 bg-white border border-orange-600 px-4 py-2 rounded hover:border-orange-600">See More</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="flex items-center gap-6 py-16">
                        <div>
                            <img src={action} alt="" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-2xl font-semibold">Take Action and Inspire Change</p>
                            <p className="text-lg">Your donation can bring hope and oppotunities to <br/>children in need.</p>
                            <button className="w-fit text-white bg-orange-600 rounded-md px-6 py-3 text-sm">Join Us</button>
                        </div>
                    </div>
                </section>
                <section className="bg-gray-300 w-full py-20">
                    <div className="w-full max-w-[1000px] mx-auto flex flex-col items-start gap-6  ">
                        <div className="flex items-center gap-8">
                            <MapPin className="w-12 h-12" />
                            <p className="text-xl">B4 LOT6-6 FANTACY ROAD 3 TERESA PARK SUBD. PILAR LAS PINAS CITY</p>
                        </div>

                        <div className="flex items-center gap-8">
                            <Phone className="w-12 h-12" />
                            <p className="text-xl">TL#: 0283742811 | CP: 09209859508</p>
                        </div>

                        <div className="flex items-center gap-8">
                            <Send className="w-12 h-12 " />
                            <p className="text-xl">kalingangkababaihan.wllpc@gmail.com</p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </Guest>
    );
};

export default Volunteers;