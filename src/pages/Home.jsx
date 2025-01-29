import React from "react";
import Header from "../components/headers/Header";
import banner from "../assets/img/banner.png";
import activity1 from "../assets/img/activity1.png";
import activity2 from "../assets/img/activity2.png";


const Home = () => {
    return (
        <div className="bg-gray-50 w-screen h-auto min-h-screen overflow-x-hidden">
           <Header />

           <section>
                <div className="px-4 pt-40 flex justify-center items-start ">
                    <div className="flex flex-col space-y-8 text-center">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-6xl font-bold chewy">Welcome to the <span className="text-orange-600">Kalinga ng Kababaihan</span></h1>
                            <p className="text-gray-600 text-lg poppins-regular">We are a non-profit organization that is dedicated to helping the less fortunate.</p>
                        </div>
                        <div className="relative mt-5 group overflow-hidden rounded-3xl shadow-xl">
                            <img src={banner} alt="banner" className="w-full h-[600px] rounded-3xl shadow-xl object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105" />
                            <div>
                                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-3xl"></div>
                                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white text-4xl font-bold">
                                    <p className="poppins-regular">Think of giving not as a duty, but as a previlege.</p>
                                </div>
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
                <div className="relative w-[700px] rounded-lg overflow-hidden group">
                        <img
                            src={activity1}
                            alt="activity1"
                            className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full text-white p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-2xl font-bold">Sample Title</p>
                            <p className="text-lg">Sample description goes here.</p>
                            <p className="text-sm mt-1 underline cursor-pointer">See more..</p>
                        </div>
                    </div>
                    <div className="relative w-[700px] rounded-lg overflow-hidden group">
                        <img
                            src={activity2}
                            alt="activity2"
                            className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full text-white p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-2xl font-bold">Sample Title</p>
                            <p className="text-lg">Sample description goes here.</p>
                            <p className="text-sm mt-1 underline cursor-pointer">See more..</p>
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
                    <div className="flex flex-wrap gap-5">
                        <div className="w-full md:w-96 p-5 rounded-lg bg-white shadow-lg mx-auto">
                            <p className="text-lg italic ">"We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us. We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us."</p>
                            <p className="pt-4 text-right text-xl chewy">-Denzel Washington</p>
                        </div>
                        <div className="w-full md:w-96 p-5 rounded-lg bg-white shadow-lg mx-auto">
                            <p className="text-lg italic ">"We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us. We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us."</p>
                            <p className="pt-4 text-right text-xl chewy">-Denzel Washington</p>
                        </div>
                        <div className="w-full md:w-96 p-5 rounded-lg bg-white shadow-lg mx-auto">
                            <p className="text-lg italic ">"We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us. We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us."</p>
                            <p className="pt-4 text-right text-xl chewy">-Denzel Washington</p>
                        </div>
                    </div>
                    
                </div>
           </section>

           <section className=" w-full py-20">
                <div className="max-w-screen-2xl mx-auto px-4">
                    <div className="flex flex-col space-y-6 items-center text-center">
                        <h1 className="text-4xl chewy">Get Involved</h1>
                        <p className="text-lg poppins-regular">We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us.</p>
                        <button className="px-6 py-3 rounded-md text-white bg-black border-0 hover:outline-none active:outline-none">Contact Us</button>
                    </div>
                </div>
           </section>
        </div>
    );
}

export default Home;
