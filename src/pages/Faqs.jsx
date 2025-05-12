import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Guest from "../layouts/Guest";

const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(prevIndex => prevIndex === index ? null : index);
    };

    const faqs = [
        { question: "Name of Charity?", answer: "Kalinga ng kababaihan Women’s League Las Piñas." },
        { question: "How many volunteers do you have?", answer: "The total is over 1,000, but the active count is over 600 above." },
        { question: "What are the services you provide and how often do you provide your services?", answer: "Our community services include providing food packs, organizing feeding programs, and running a basketball league program." },
        { question: "How many of each area do you support?", answer: "The entire area of Las Piñas." },
        { question: "What is the donation process you are using?", answer: "Support us by making a cash donation to our program." },
        { question: "Do you accept donations online?", answer: "No, because we are not yet able to accommodate online donations, and we don’t have a permit or a bank account in the name of our community." },
        { question: "As for the volunteers, do you also collect their details or information?", answer: "Yes, we need to gather their information to support our charity program effectively." },
        { question: "Did you also ask those who donated for their information?", answer: "Yes, but some donors prefer not to mention their names, they would like to remain anonymous." },
        { question: "How often do you review and update the payroll details for your staff?", answer: "No, we haven’t the payroll." },
        { question: "What is your method for recruiting members? Is it through a membership process or an outreach program?", answer: "We're working on the Women's Care Program, Women's League Las Piñas, to support those in need." },
        { question: "Every time you have an event, how many volunteers attend that event?", answer: "15 to 30 volunteers every time we have an event." }
    ];

    return (
        <Guest>
            <div className="w-screen h-auto pt-32 px-4">
                <div className="flex items-center justify-center flex-col gap-2 text-center">
                    <h1 className="text-2xl font-semibold">Frequently Asked Questions</h1>
                    <p className="text-sm">We often get questions about our work. Here are answers to some of the most frequently asked questions.</p>
                    <div className="w-full min-w-80 max-w-[500px] flex items-center mt-4">
                        <div className="bg-orange-500 px-4 py-2 rounded-l">
                            <Search size={21} className="text-white" />
                        </div>
                        <input type="text" className="placeholder:text-xs px-4 py-2 rounded-r border border-gray-200 text-sm w-full" placeholder="Search for something.." />
                    </div>
                    <p className='text-sm font-semibold'>Still have question? <span className='text-orange-500'>Contact Us</span></p>
                </div>

                <div className="w-full max-w-[1000px] mx-auto mt-8">
                    {faqs.map((faq, index) => (
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
            </div>
        </Guest>
    );
};

export default Faqs;
