import React from "react";
import Header from "../components/headers/Header";
import banner from "../assets/img/banner.png";
import activity1 from "../assets/img/activity1.png";
import activity2 from "../assets/img/activity2.png";
import donateNowImg from "../assets/img/donateNow.png";
import { useState, useEffect } from "react";
import logo from '../assets/img/logo.png';
import ChatButton from "../components/chatbot/ChatButton";
import { Link } from "react-router-dom";
import projects from "../data/projects.json"
import Footer from "../components/Footer";


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

    const [currentPIndex, setCurrentPIndex] = useState(0);

    const prevPSlide = () => {
        setCurrentPIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    };

    const nextPSlide = () => {
        setCurrentPIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    };

    const project = projects[currentIndex];


    return (
        <div className="bg-gray-50 max-w-screen w-screen h-auto min-h-screen overflow-hidden text-gray-700">
            <Header />

            <section className="bg-gradient-to-tl from-orange to-white py-20 pb-5">
                <div className="px-4 pt-20 flex justify-center items-start">
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
                                    <p className=" italic">{images[currentIndex].text}</p>
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

            <section className="bg-gray-200">
                <div className="max-w-[1200px] mx-auto px-4 py-16 mt-12">
                    <div className="px-4 pb-8 flex flex-col space-y-8 items-center">
                        <h1 className="text-4xl chewy">Recent Projects</h1>
                    </div>
                    <div className="w-full flex items-center justify-center flex-wrap gap-4">
                        {projects.slice(0, 2).map((project, index) => (
                            <div key={index} data-aos="fade-down" className="relative w-[500px] h-80 rounded-lg overflow-hidden group">
                            <img
                                src={activity1}
                                alt="activity1"
                                className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

                            <div className="absolute bottom-0 left-0 w-full text-white p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-xl font-bold">{project.title}</p>
                                <p className="text-xs">
                                {project.description.length > 150
                                    ? project.description.slice(0, 150) + '...'
                                    : project.description}
                                </p>
                                <div className="mt-3">
                                <Link to={`/projects/${project.id}`} className="px-3 text-gray-200 hover:text-white py-1 text-xs border border-gray-200 hover:border-white rounded">
                                    Read More
                                </Link>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white w-full py-20">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 ">
                        <img src={donateNowImg} alt="img" className="w-full h-auto md:w-[500px] " />
                        <div className="flex flex-col items-center md:items-start gap-5">
                            <p className="text-6xl font-bold chewy text-center md:text-left">Give food and bring Hope.</p>
                            <p className="text-3xl font-light text-center md:text-left">Every meal matters. Every donation counts. Start giving today.</p>
                            <Link to="/donate" className="w-fit px-6 py-3 rounded-md text-sm text-white hover:text-white bg-orange-600 transform transition-transform duration-300 hover:scale-105 cursor-pointer">Donate Now</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-orange-600 w-full py-20">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="max-w-screen-2xl mx-auto md:px-4">
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
                        <Link to="/contact-us" className="w-fit px-6 py-3 rounded-md text-sm text-white bg-orange-600 hover:bg-orange-700">Contact Us</Link>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-tl from-orange-500 w-full py-20">
                <div className="max-w-[1200px] mx-auto md:px-4">
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
                                <div className="w-full flex flex-col items-center md:items-start gap-">
                                    <h2 className="text-3xl text-center md:text-left">FEATURE ACTIVITY</h2>
                                    <h1 className="uppercase text-center md:text-left">Teresa Part Homes</h1>
                                    <h3 className="text-orange-500 text-center md:text-left">Monday, July 07,2025</h3>
                                </div>
                                <p className="text-center md:text-left">Plant and Gardening program headed by our Kalinga ng Kababaihan Ms. Beavin Soriano along with our volunteer mommies preparing our community garden in Teresa Park Homes.
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
            <Footer />
            
            <ChatButton />
        </div>
    );
}

export default Home;
