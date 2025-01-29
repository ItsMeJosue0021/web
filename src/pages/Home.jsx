import React from "react";
import Header from "../components/headers/Header";
import banner from "../assets/img/banner.png";
import activity1 from "../assets/img/activity1.png";
import activity2 from "../assets/img/activity2.png";
import { useState, useEffect } from "react";

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
        <div className="bg-gray-50 w-screen h-auto min-h-screen overflow-x-hidden">
            <Header />

            <section className="bg-gradient-to-tl from-orange to-white py-20">
                <div className="px-4 pt-20 flex justify-center items-start ">
                    <div className="flex flex-col space-y-14 text-center">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-6xl font-bold chewy">Welcome to the <span className="text-orange-600">Kalinga ng Kababaihan</span></h1>
                            <p className="text-gray-600 text-lg poppins-regular">We are a non-profit organization that is dedicated to helping the less fortunate.</p>
                        </div>
                        
                        <div className="relative w-full  mt-5 overflow-hidden rounded-3xl shadow-xl">
                            {/* Image and Text */}
                            <div className="relative">
                                <img
                                    src={images[currentIndex].src}
                                    alt={`Slide ${currentIndex + 1}`}
                                    className="w-[1350px] h-[600px] rounded-3xl object-cover transition-transform duration-500 ease-in-out"
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-3xl"></div>
                                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white text-4xl font-bold text-center px-5">
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
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-3 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-gray-400"
                                            }`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-screen max-w-screen-2xl mx-auto px-4">
                <div className="px-4 py-20 flex flex-col space-y-8 items-center">
                    <h1 className="text-4xl chewy">Recent Projects</h1>
                </div>
                <div className="w-full flex items-center justify-center flex-wrap gap-4">
                    <div data-aos="fade-down" className="relative w-[700px] h-96 rounded-lg overflow-hidden group">
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
                    <div data-aos="fade-up" className="relative w-[700px] h-96 rounded-lg overflow-hidden group">
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
                <div className="max-w-screen-2xl mx-auto px-4">
                    <div className="max-w-screen-2xl mx-auto px-4">
                        <div className="flex flex-wrap justify-center gap-6">
                            <div data-aos="fade-left" data-aos-delay="100" className="w-full md:w-96 p-5 rounded-lg bg-white/60 backdrop-blur-md  shadow-lg ">
                                <p className="text-lg italic">"I don’t think you ever stop giving. I really don’t. I think it’s an on-going process. And it’s not just about being able to write a check. It’s being able to touch somebody’s life."</p>
                                <p className="pt-4 text-right text-xl chewy">-Oprah Winfrey</p>
                            </div>
                            <div data-aos="fade-left" data-aos-delay="2-00" className="w-full md:w-96 p-5 rounded-lg bg-white/60 backdrop-blur-md shadow-lg ">
                                <p className="text-lg italic">"At the end of the day it’s not about what you have or even what you’ve accomplished… it’s about who you’ve lifted up, who you’ve made better. It’s about what you’ve given back."</p>
                                <p className="pt-4 text-right text-xl chewy">-Denzel Washington</p>
                            </div>
                            <div data-aos="fade-left" data-aos-delay="300" className="w-full md:w-96 p-5 rounded-lg bg-white/60 backdrop-blur-md shadow-lg ">
                                <p className="text-lg italic">"Volunteers are the only human beings on the face of the earth who reflect this nation’s compassion, unselfish caring, patience, and just plain loving one another."</p>
                                <p className="pt-4 text-right text-xl chewy">-Erma Bombeck</p>
                            </div>
                        </div>
                    </div>

                </div>

            </section>

            <section className=" w-full py-20">
                <div className="max-w-screen-2xl mx-auto px-4">
                    <div className="flex flex-col space-y-6 items-center text-center">
                        <h1 className="text-4xl chewy">Get Involved</h1>
                        <p className="text-lg poppins-regular">We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us.</p>
                        <button className="px-8 py-4 rounded-md text-white bg-orange-600 border-0 hover:outline-none active:outline-none">Contact Us</button>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-tl from-orange-500 w-full py-20">
                <div className="max-w-screen-2xl mx-auto px-4">
                    <div className="flex justify-between p-4">
                        <h2 className="text-5xl font-bold chewy">Upcoming Events</h2>
                        <button className="text-sm">See All Events</button>
                    </div>
                    <div>
                        <div className="relative w-[700px] h-[600px] bg-white/50 rounded-xl">
                            <div className="absolute top-1/2 -left-56 bg-white w-64 h-80">
                            hello
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
