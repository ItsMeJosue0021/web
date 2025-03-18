import React from "react";
import Guest from "../layouts/Guest";
import aboutImage from "../assets/img/about.png";
import supermom from "../assets/img/supermom.png";
import feeding from "../assets/img/feeding.png";
import volunteers from "../assets/img/volunteers.png";
import logo from "../assets/img/logo.png";

const AboutUs = () => {
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
                <section className="bg-gradient-to-tl from-orange-500 w-full py-20 pt-56">
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
                </section>
                <section className=" w-full py-20">
                    <div className="max-w-[1200px] mx-auto px-4">
                        <div className="flex flex-col gap-12 items-center text-center">
                            <h1 className="text-4xl chewy">Our Core Values</h1>
                            <div className="flex w-full flex-col md:flex-row items-center justify-evenly ">
                                <div className="text-xl font-semibold">Leadership</div>
                                <div className="text-xl font-semibold">Collaboration</div>
                                <div className="text-xl font-semibold">Fairness</div>
                                <div className="text-xl font-semibold">Useflness</div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="w-full bg-orange-500 py-16">
                    
                    <div className="w-full max-w-[1200px] mx-auto px-4 flex gap-5 flex-col">
                        <div className="flex items-center flex-col justify-start">
                            <h1 className="text-4xl chewy text-white">Contact Us</h1>
                            <p className="text-white text-lg">Contact our team for inquiries, partnerships, or support.</p>
                        </div>
                        <div className="w-full flex items-center gap-5">
                            <div className="w-full">
                                <img src={aboutImage} alt="" className="w-full h-96 rounded-lg" />
                            </div>
                            <div className="w-full flex flex-col gap-4 bg-white p-5 py-6 rounded-md ">
                                <div className="w-full flex flex-col">
                                    <p className="text-sm">Your Name</p>
                                    <input type="text" name="name" id="name" placeholder="Type sometihng.." className="bg-transparent text-sm w-full border border-gray-300 rounded px-4 py-2 placeholder:text-white"/>
                                </div>
                                <div className="w-full flex flex-col">
                                    <p className="text-sm">Your Email</p>
                                    <input type="email" name="email" id="email" placeholder="Type sometihng.." className="bg-transparent text-sm w-full border border-gray-300 rounded px-4 py-2 placeholder:text-white"/>
                                </div>
                                <div className="w-full flex flex-col">
                                    <p className="text-sm">How can we help you Today?</p>
                                    <textarea name="message" id="message" placeholder="Type sometihng.." className="h-28 w-full bg-transparent border border-gray-300 rounded p-4 placeholder:text-white"></textarea>
                                </div>
                                <button className="w-full text-white rounded-md text-sm bg-orange-500 hover:bg-orange-600 px-5 py-2 text-center shadow">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
        </Guest>
    );
};

export default AboutUs; 