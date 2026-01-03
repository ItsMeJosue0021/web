import logo from "../assets/img/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
       <footer className="bg-gray-900 text-gray-200 mt-4">
            <div className="max-w-[1200px] mx-auto px-4 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="logo" className="w-14 h-14 rounded-full border border-orange-200 bg-white"/>
                            <div>
                                <p className="text-sm font-semibold text-white">Kalinga ng Kababaihan</p>
                                <p className="text-[11px] text-gray-400">Women's League Las Piñas</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 max-w-xs">
                            Uplifting women, families, and communities through relief, livelihood, and safe spaces.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-[#6a76ac] cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 448 512">
                                    <path
                                    d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                                </svg>
                            </span>
                            <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-[#1877f2] cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path
                                    d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                                </svg>
                            </span>
                            <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-[#0084ff] cursor-pointer">
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

                    <div className="flex flex-col gap-3 text-sm">
                        <p className="text-white font-semibold">Explore</p>
                        <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                        <Link to="/about-us" className="text-gray-300 hover:text-white">About Us</Link>
                        <Link to="/volunteers" className="text-gray-300 hover:text-white">Volunteers</Link>
                        <Link to="/our-projects" className="text-gray-300 hover:text-white">Projects</Link>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <p className="text-white font-semibold">Support</p>
                        <Link to="/faqs" className="text-gray-300 hover:text-white">FAQs</Link>
                        <Link to="/donate" className="text-gray-300 hover:text-white">Donate</Link>
                        <Link to="/contact-us" className="text-gray-300 hover:text-white">Contact Us</Link>
                        <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <p className="text-white font-semibold">Contact</p>
                        <p className="text-gray-300">Las Piñas, Philippines</p>
                        <p className="text-gray-300">kalingangkababaihan@gmail.com</p>
                        <p className="text-gray-300">+63 917 123 4567</p>
                        <Link to="/contact-us" className="mt-1 inline-flex items-center gap-2 text-orange-300 hover:text-orange-200 text-xs font-semibold">
                            Get in touch <span className="text-lg leading-none">?</span>
                        </Link>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 mt-8 text-center text-[11px] text-gray-400">
                    <p>@2021 Kalinga ng Kababaihan. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
