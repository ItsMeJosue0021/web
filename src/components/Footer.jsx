import logo from "../assets/img/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
       <footer className="bg-gray-50 border-t mt-4 text-gray-700 text-xs">
            <div className="max-w-[1200px] mx-auto px-4 py-20 ">
                <div className="flex flex-col md:flex-row items-center gap-10 md:items-start md:justify-between">
                    <div className="w-full flex flex-col md:flex-row md:gap-12 items-center md:items-start">
                        <img src={logo} alt="logo" className="w-40 h-40 rounded-full"/>
                        <div className="flex flex-col items-center md:items-start pt-5 text-lg poppins-regular">
                            <Link to="/" className="text-gray-700">Home</Link>
                            <Link to="/about-us" className="text-gray-700">About Us</Link>
                            <Link to="/volunteers" className="text-gray-700">Volunteers</Link>
                        </div>
                        <div className="flex flex-col items-center md:items-start pt-5 text-lg poppins-regular">
                            <Link to="/faqs" className="text-gray-700">FAQs</Link>
                            <Link to="/register" className="text-gray-700">Sign Up</Link>
                            <Link to="/login" className="text-gray-700">Login</Link>
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
    )
}

export default Footer;