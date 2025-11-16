import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Guest from "../layouts/Guest";
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(prevIndex => prevIndex === index ? null : index);
    };

    const faqs1 = [
        {
            "question": "Who is in charge of Kalinga ng Kababaihan Women’s League?",
            "answer": "The community is led by President Beavin Soriano and Vice President Juliet Eronico."
        },
        {
            "question": "What would I gain from becoming a member?",
            "answer": "Kalinga ng Kababaihan Women’s League Las Piñas is a group that helps people who need it the most. When you become a member, it’s easier to give and help others. You get tools to track your donations, join a friendly group (like a private Facebook group), and be part of our official member list. Many members feel happy knowing their help goes to the right places and makes a big difference in people’s lives."
        },
        {
            "question": "What is the Kalinga ng Kababaihan Women’s League community like?",
            "answer": "Kalinga ng Kababaihan Women’s League Las Piñas is a global community of individuals dedicated to using a meaningful part of their income to support others. Our members come from diverse backgrounds and professions such as teaching, healthcare, manual work, and more. Despite their differences, they share one goal: to make a positive impact by helping those in greatest need. The community is known for being warm and supportive. Members are always willing to share advice and answer questions. There's a strong bond among them, and they often connect through social events, volunteering activities, and shared causes. We also provide various resources and host events to help members build connections and learn about impactful, meaningful giving."
        },
        {
            "question": "How do I join Kalinga ng Kababaihan Women’s League?",
            "answer": "To become a member of Kalinga ng Kababaihan Women’s League, there are many ways to get involved, such as volunteering or following us on social media (Facebook)."
        },
        {
            "question": "What are the services you provide and how often do you provide your services?",
            "answer": "We offer a variety of community services to support those in need, including: Food Pack Distribution: We regularly provide essential food packs to families experiencing hardship. Feeding Programs: We organize feeding initiatives, especially for children and the elderly, to help fight hunger in local communities. Basketball League Program: We run a basketball league to promote youth engagement, physical fitness, and community building."
        },
        {
            "question": "How many of each area do you support?",
            "answer": "We support the entire area of Las Piñas. Our programs and services are available across all barangays, ensuring that help reaches those who need it most. We work closely with local leaders and volunteers to identify communities in need and provide consistent support throughout the city."
        },
        {
            "question": "As for the volunteers, do you also collect their details or information?",
            "answer": "Yes of course, we ask our volunteers to provide some basic information. This helps us organize activities better and match people with the right tasks. We usually ask for things like your name, contact number, availability, and any skills you’d like to share. We keep your information private and use it only to help with our volunteer work."
        }
    ]

    const faqs2 = [
        {
            "question": "What is your donation process?",
            "answer": "You can support us by making a cash donation to our program. Your donation helps us continue our mission of serving the community, especially those who need it most. Any amount—big or small—goes directly to funding our charity activities, including food distribution, feeding programs, and youth development efforts. By giving, you become part of a meaningful cause that brings hope and help to others."
        },
        {
            "question": "Do you accept donations online?",
            "answer": "No, we are not able to accept online donations yet because we don’t have a registered bank account or official permit for our community. We know that offering easy ways to donate is important, and we are working hard to get the proper permits and set up the financial systems needed to accept online donations. We really appreciate your patience and support while we work on this."
        },
        {
            "question": "Did you also ask those who donated for their information?",
            "answer": "Yes, some donors prefer to remain anonymous and we fully respect that choice. If you wish to donate without sharing your name, you can do so, and we will ensure your privacy is maintained. We value all donations, regardless of whether they are made anonymously or with identification, as they all contribute to our mission of helping those in need. Your generosity is greatly appreciated, and we strive to make the donation process comfortable and respectful for all."
        }
    ]



    return (
        <Guest>
            <div className="w-screen h-auto pt-32 px-4 pb-12">
                <div className="flex items-center justify-center flex-col gap-2 text-center">
                    <h1 className="text-2xl font-semibold">Frequently Asked Questions</h1>
                    <p className="text-sm hidden md:block">We often get questions about our work. Here are answers to some of the most frequently asked questions.</p>
                    <div className="w-full min-w-80 max-w-[500px] flex items-center mt-4">
                        <div className="bg-orange-500 px-4 py-2 rounded-l">
                            <Search size={21} className="text-white" />
                        </div>
                        <input type="text" className="bg-white placeholder:text-xs px-4 py-2 rounded-r border border-gray-200 text-sm w-full" placeholder="Search for something.." />
                    </div>
                    <p className='text-sm font-semibold'>Still have question? <span className='text-orange-500'>Contact Us</span></p>
                </div>

                <div className="w-full max-w-[1000px] mx-auto mt-8">
                    <h2 className='text-xl font-semibold'>Our Community</h2>
                    {faqs1.map((faq, index) => (
                        <div key={index} className="w-full my-2">
                            <div className="border border-gray-200 rounded-md overflow-hidden">
                                <button
                                    className="w-full flex justify-between items-center p-4 py-3 text-left bg-gray-100 hover:bg-gray-200 transition-colors"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <p className="text-xs font-medium">{faq.question}</p>
                                    <span>
                                        {openIndex === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </span>
                                </button>

                                {openIndex === index && (
                                    <div className="p-4 border-t text-xs text-gray-700 bg-white">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-[1000px] mx-auto mt-8">
                    <h2 className='text-xl font-semibold'>Donation Platform</h2>
                    {faqs2.map((faq, index) => (
                        <div key={index} className="w-full my-2">
                            <div className="border border-gray-200 rounded-md overflow-hidden">
                                <button
                                    className="w-full flex justify-between items-center p-4 py-3 text-left bg-gray-100 hover:bg-gray-200 transition-colors"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <p className="text-xs font-medium">{faq.question}</p>
                                    <span>
                                        {openIndex === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </span>
                                </button>

                                {openIndex === index && (
                                    <div className="p-4 border-t text-xs text-gray-700 bg-white">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='flex flex-col gap-1 w-full items-center justify-center py-12'>
                    <p className='text-xl font-semibold'>Still have questions?</p>
                    <Link to="/contact-us" className="w-fit text-orange-600 bg-white hover:text-orange-700 border border-orange-600 hover:border-text-700 px-4 py-2 rounded-md">Contact Us!</Link>
                </div>

                <Footer />
            </div>
        </Guest>
    );
};

export default Faqs;
