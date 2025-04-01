import { Link } from "react-router-dom";
import logopng from "../assets/img/logo.png";

const Logo = () => {
    return (
        <Link to="/" className='flex items-center space-x-2 text-black hover:text-black'>
            <img src={logopng} alt="logo" className='w-16 md:w-16 h-16 md:h-16 rounded-full'/>
            <div className='flex flex-col text-sm font-bold'>
                <p className='text-sm md:text-base chewy'>Kalinga ng Kababaihan</p>
                <p className='text-[10px]  poppins-regular'>Women's League Las Piñas</p>
            </div>
        </Link>
    )
}

export default Logo;