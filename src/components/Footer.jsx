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
                                <p className="text-[11px] text-gray-400">Women&apos;s League Las Piñas</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 max-w-xs">
                            Uplifting women, families, and communities through relief, livelihood, and safe spaces.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link to="https://www.facebook.com/share/1BsXu1VV7v/" className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-[#1877f2] cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path
                                    d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <p className="text-white font-semibold">Explore</p>
                        <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                        <Link to="/about-us" className="text-gray-300 hover:text-white">About Us</Link>
                        {/* <Link to="/volunteers" className="text-gray-300 hover:text-white">Volunteers</Link> */}
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
