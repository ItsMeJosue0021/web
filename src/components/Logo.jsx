import { Link } from "react-router-dom";
import { useWebsiteLogo } from "../hooks/useWebsiteLogo";

const Logo = ({
    to = "/",
    wrapperClassName = "flex items-center space-x-2 text-black hover:text-black",
    imageClassName = "w-14 md:w-14 h-14 md:h-14 rounded-full",
    textWrapperClassName = "flex flex-col text-sm font-bold",
    mainTextClassName = "text-xs md:text-sm chewy",
    secondaryTextClassName = "text-[10px] poppins-regular",
}) => {
    const { websiteLogo, logoImageSrc } = useWebsiteLogo();

    return (
        <Link to={to} className={wrapperClassName}>
            <img src={logoImageSrc} alt={websiteLogo.main_text || "logo"} className={imageClassName} />
            <div className={textWrapperClassName}>
                <p className={mainTextClassName}>{websiteLogo.main_text}</p>
                <p className={secondaryTextClassName}>{websiteLogo.secondary_text}</p>
            </div>
        </Link>
    );
};

export default Logo;
