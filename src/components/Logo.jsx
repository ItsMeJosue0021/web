import { Link } from "react-router-dom";
import logopng from "../assets/img/logo.png";

const Logo = () => {
    return (
        <Link to="/" className='flex items-center space-x-2 text-black hover:text-black'>
            <img src={logopng} alt="logo" className='w-14 md:w-14 h-14 md:h-14 rounded-full'/>
            <div className='flex flex-col text-sm font-bold'>
                <p className='text-xs md:text-sm chewy'>Kalinga ng Kababaihan</p>
                <p className='text-[10px]  poppins-regular'>Women's League Las Piñas</p>
            </div>
        </Link>
    )
}

export default Logo;


