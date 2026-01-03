import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Guest from "../layouts/Guest";
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { _get } from '../api';
import CircularLoading from "../components/CircularLoading";

const Faqs = () => {

    // Fix: separate states for each FAQ section
    const [openCommunity, setOpenCommunity] = useState(null);
    const [openDonation, setOpenDonation] = useState(null);
    const [generalFaqs, setGeneralFaqs] = useState([]);
    const [donationFaqs, setDonationFaqs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchFaqs = useCallback(async (query = '') => {
        setLoading(true);
        try {
            const searchQuery = query ? `?search=${encodeURIComponent(query)}` : '';
            const response = await _get(`/faqs${searchQuery}`);

            const faqs = response.data || [];
            const general = faqs.filter((faq) => faq.category?.toLowerCase() === 'general');
            const donation = faqs.filter((faq) => faq.category?.toLowerCase() === 'donation');

            setGeneralFaqs(general);
            setDonationFaqs(donation);
            setOpenCommunity(null);
            setOpenDonation(null);
        } catch (error) {
            console.log('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFaqs();
    }, [fetchFaqs]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchFaqs(searchTerm);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchTerm, fetchFaqs]);

    const toggleCommunity = (i) => {
        setOpenCommunity(prev => prev === i ? null : i);
    };

    const toggleDonation = (i) => {
        setOpenDonation(prev => prev === i ? null : i);
    };

    return (
        <Guest>
            <div className="w-full h-auto pt-32 px-4 pb-20 bg-gray-50">

                {/* HEADER */}
                <div className="flex flex-col items-center text-center gap-3 max-w-[800px] mx-auto">
                    <p className="text-xs uppercase tracking-[0.25em] text-orange-500 font-semibold">FAQ</p>
                    <h1 className="text-3xl md:text-4xl font-bold chewy text-gray-800">Frequently Asked Questions</h1>
                    <p className="text-sm md:text-base text-gray-600 max-w-[600px]">
                        Quick answers about our community, membership, and donations. Need more help? Reach out anytime.
                    </p>

                    {/* Search bar */}
                    <div className="w-full max-w-[520px] flex items-center mt-4 shadow-sm rounded-lg overflow-hidden border border-gray-200 bg-white">
                        <div className="bg-orange-500 px-4 py-3">
                            <Search size={18} className="text-white" />
                        </div>
                        <input 
                            type="text" 
                            className="bg-white px-4 py-3 text-sm w-full outline-none"
                            placeholder="Type a keyword (e.g., donations, membership, volunteer)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <p className='text-sm font-semibold mt-2 text-gray-700'>
                        Still have questions?  
                        <Link to="/contact-us" className="text-orange-500 ml-1 hover:underline">
                            Contact Us
                        </Link>
                    </p>
                </div>

                {/* FAQ Sections */}
                <div className="w-full max-w-[1100px] mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* COMMUNITY FAQS */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-8 rounded-full bg-orange-500"></div>
                            <h2 className="text-xl font-bold text-gray-800">Our Community</h2>
                        </div>

                        <div className="space-y-3 min-h-[120px]">
                            {loading && (
                                <CircularLoading customClass="text-orange-500 w-6 h-6" />
                            )}
                            {!loading && generalFaqs.length === 0 && (
                                <p className="text-sm text-gray-600 px-2">No general questions found.</p>
                            )}
                            {!loading && generalFaqs.map((faq, i) => (
                                <div key={faq.id ?? i} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

                                    <button
                                        className="bg-white w-full flex justify-between items-center p-4 hover:bg-orange-50 transition"
                                        onClick={() => toggleCommunity(i)}
                                    >
                                        <p className="text-sm md:text-base font-medium text-gray-800 text-left">
                                            {faq.question}
                                        </p>

                                        {openCommunity === i 
                                            ? <ChevronUp className="text-orange-500" size={20} />
                                            : <ChevronDown className="text-gray-500" size={20} />
                                        }
                                    </button>

                                    <div
                                        className={`transition-all duration-300 overflow-hidden ${
                                            openCommunity === i ? "max-h-[500px] p-4 bg-white border-t" : "max-h-0"
                                        }`}
                                    >
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DONATION FAQS */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-8 rounded-full bg-orange-500"></div>
                            <h2 className="text-xl font-bold text-gray-800">Donation Platform</h2>
                        </div>

                        <div className="space-y-3 min-h-[120px]">
                            {loading && (
                                <CircularLoading customClass="text-orange-500 w-6 h-6" />
                            )}
                            {!loading && donationFaqs.length === 0 && (
                                <p className="text-sm text-gray-600 px-2">No donation questions found.</p>
                            )}
                            {!loading && donationFaqs.map((faq, i) => (
                                <div key={faq.id ?? i} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

                                    <button
                                        className="bg-white w-full flex justify-between items-center p-4 hover:bg-orange-50 transition"
                                        onClick={() => toggleDonation(i)}
                                    >
                                        <p className="text-sm md:text-base font-medium text-gray-800 text-left">
                                            {faq.question}
                                        </p>

                                        {openDonation === i 
                                            ? <ChevronUp className="text-orange-500" size={20} />
                                            : <ChevronDown className="text-gray-500" size={20} />
                                        }
                                    </button>

                                    <div
                                        className={`transition-all duration-300 overflow-hidden ${
                                            openDonation === i ? "max-h-[500px] p-4 bg-white border-t" : "max-h-0"
                                        }`}
                                    >
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CONTACT CTA */}
                <div className="flex flex-col items-center justify-center mt-16 bg-white border border-orange-100 rounded-xl p-8 max-w-[900px] mx-auto shadow-sm">
                    <p className="text-lg font-semibold text-gray-800">Still have questions?</p>
                    <p className="text-sm text-gray-600">We&apos;d love to help you find the answers you need.</p>
                    <Link
                        to="/contact-us" 
                        className="mt-3 px-6 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition text-sm font-semibold"
                    >
                        Contact Us
                    </Link>
                </div>

            </div>
            <Footer />
        </Guest>
    );
};

export default Faqs;
