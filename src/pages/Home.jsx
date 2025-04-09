import React from "react";
import Header from "../components/headers/Header";
import banner from "../assets/img/banner.png";
import activity1 from "../assets/img/activity1.png";
import activity2 from "../assets/img/activity2.png";
import { useState, useEffect } from "react";
import logo from '../assets/img/logo.png';
import ChatButton from "../components/chatbot/ChatButton";

const images = [
    { src: banner, text: "Think of giving not as a duty, but as a privilege." },
    { src: activity1, text: "Lose yourself in the service of others." },
    { src: activity2, text: "No act of kindness, no matter how small, is ever wasted." },
];

const Home = () => {

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };


    return (
        <div className="bg-gray-50 max-w-screen w-screen h-auto min-h-screen overflow-hidden">
            <Header />

            <section className="bg-gradient-to-tl from-orange to-white py-20 pb-5">
                <div className="px-4 pt-20 flex justify-center items-start ">
                    <div className="flex flex-col space-y-14 text-center">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-5xl font-bold chewy">Welcome to the <span className="text-orange-600 chewy">Kalinga ng Kababaihan</span></h1>
                            <p className="text-gray-600 text-base poppins-regular">We are a non-profit organization that is dedicated to helping the less fortunate.</p>
                        </div>

                        <div className="relative w-full h-[450px] mt-5 mx-auto overflow-hidden rounded-3xl shadow-xl">
                            {/* Image and Text */}
                            <div className="relative">
                                <img
                                    src={images[currentIndex].src}
                                    alt={`Slide ${currentIndex + 1}`}
                                    className="w-[1200px] h-[600px] rounded-3xl object-cover transition-transform duration-500 ease-in-out"
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-3xl"></div>
                                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white text-3xl font-bold text-center px-5">
                                    <p className="poppins-regular">{images[currentIndex].text}</p>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                            >
                                ❮
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                            >
                                ❯
                            </button>

                            {/* Dots Navigation */}
                            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {images.map((_, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-4 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-gray-400"}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-screen max-w-[1200px] mx-auto px-4">
                <div className="px-4 py-20 flex flex-col space-y-8 items-center">
                    <h1 className="text-4xl chewy">Recent Projects</h1>
                </div>
                <div className="w-full flex items-center justify-center flex-wrap gap-4">
                    <div data-aos="fade-down" className="relative w-[500px] h-80 rounded-lg overflow-hidden group">
                        <img
                            src={activity1}
                            alt="activity1"
                            className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

                        <div className="absolute bottom-0 left-0 w-full text-white p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-2xl font-bold">Lorem ipsum dolor sit amet</p>
                            <p className="text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta dolores, assumenda nostrum possimus praesentium eos. Dicta dolores, assumenda nostrum possimus praesentium eos.</p>
                            <p className="text-sm mt-1 cursor-pointer">See more</p>
                        </div>
                    </div>
                    <div data-aos="fade-up" className="relative w-[500px] h-80 rounded-lg overflow-hidden group">
                        <img
                            src={activity2}
                            alt="activity2"
                            className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

                        <div className="absolute bottom-0 left-0 w-full text-white p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-2xl font-bold">Lorem ipsum dolor sit</p>
                            <p className="text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta dolores, assumenda nostrum possimus praesentium eos. Dicta dolores, assumenda nostrum possimus praesentium eos.</p>
                            <p className="text-sm mt-1 cursor-pointer">See more</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="px-4 py-20 flex flex-col space-y-8 items-center">
                    <h1 className="text-4xl chewy">Our Mission</h1>
                    <p className="w-full md:w-1/2 text-lg poppins-regular text-center">Our mission is to help the less fortunate by providing them with the necessary resources they need to survive. We believe that everyone deserves a chance to live a better life.</p>
                </div>
                <div className="px-4 pb-20 flex flex-col space-y-8 items-center">
                    <h1 className="text-4xl chewy">Our Vision</h1>
                    <p className="w-full md:w-1/2 text-lg poppins-regular text-center">Our mission is to help the less fortunate by providing them with the necessary resources they need to survive. We believe that everyone deserves a chance to live a better life.</p>
                </div>
            </section>

            <section className="bg-orange-600 w-full py-20">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="max-w-screen-2xl mx-auto px-4">
                        <div className="flex flex-wrap justify-center gap-6">
                            <div data-aos="fade-left" data-aos-delay="100" className="w-full md:w-80 p-5 rounded-lg bg-white/60 backdrop-blur-md  shadow-lg ">
                                <p className="text-lg italic">"I don’t think you ever stop giving. I really don’t. I think it’s an on-going process. And it’s not just about being able to write a check. It’s being able to touch somebody’s life."</p>
                                <p className="pt-4 text-right text-xl chewy">-Oprah Winfrey</p>
                            </div>
                            <div data-aos="fade-left" data-aos-delay="2-00" className="w-full md:w-80 p-5 rounded-lg bg-white/60 backdrop-blur-md shadow-lg ">
                                <p className="text-lg italic">"At the end of the day it’s not about what you have or even what you’ve accomplished… it’s about who you’ve lifted up, who you’ve made better. It’s about what you’ve given back."</p>
                                <p className="pt-4 text-right text-xl chewy">-Denzel Washington</p>
                            </div>
                            <div data-aos="fade-left" data-aos-delay="300" className="w-full md:w-80 p-5 rounded-lg bg-white/60 backdrop-blur-md shadow-lg ">
                                <p className="text-lg italic">"Volunteers are the only human beings on the face of the earth who reflect this nation’s compassion, unselfish caring, patience, and just plain loving one another."</p>
                                <p className="pt-4 text-right text-xl chewy">-Erma Bombeck</p>
                            </div>
                        </div>
                    </div>

                </div>

            </section>

            <section className=" w-full py-20">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex flex-col space-y-6 items-center text-center">
                        <h1 className="text-4xl chewy">Get Involved</h1>
                        <p className="text-lg poppins-regular">We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us.</p>
                        <button className="px-8 py-4 rounded-md text-white bg-orange-600 border-0 hover:outline-none active:outline-none">Contact Us</button>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-tl from-orange-500 w-full py-20">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex justify-between p-4">
                        <h2 className="text-5xl font-bold chewy">Upcoming Events</h2>
                        {/* <button className="text-sm">See All Events</button> */}
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-end p-4 gap-5">
                        <div className="md:hidden bg-white w-full md:w-64 h-80 rounded-lg p-5 shadow-md">
                            <div className="flex flex-col items-center justify-center gap-6 h-full">
                                <p className="text-3xl font-bold">September</p>
                                <p className="text-9xl font-bold">15</p>
                            </div>
                        </div>
                        <div className="relative w-full md:w-3/5 h-auto md:h-[600px] bg-white/80 rounded-xl shadow-lg ">
                            <div className="flex flex-col items-left justify-center h-full gap-5 p-5 md:p-12 md:ml-16 text-lg poppins-regular">
                                <div className="flex flex-col gap-">
                                    <h2 className="text-3xl">FEATURE ACTIVITY</h2>
                                    <h1 className="uppercase">Teresa Part Homes</h1>
                                    <h3 className="text-orange-500">Monday, July 07,2025</h3>
                                </div>
                                <p className="">Plant and Gardening program headed by our Kalinga ng Kababaihan Ms. Beavin Soriano along with our volunteer mommies preparing our community garden in Teresa Park Homes.
                                All thanks to TPHAI Press Barbie Dimatulac and its Board of Directors for lending us the  place.</p>
                            </div>
                            <div className="hidden md:block absolute top-1/2 -left-12 transform -translate-x-1/2 -translate-y-1/2 bg-white w-64 h-80 rounded-md p-5 shadow-lg">
                                <div className="flex flex-col items-center justify-center gap-6 h-full">
                                    <p className="text-3xl font-bold">September</p>
                                    <p className="text-9xl font-bold">15</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-50">
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
            <ChatButton />
        </div>
    );
}

export default Home;
