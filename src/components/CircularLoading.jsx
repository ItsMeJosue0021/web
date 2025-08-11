import { BiLoaderAlt } from "react-icons/bi";

const CircularLoading = ({customClass}) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <BiLoaderAlt className={`animate-spin ${customClass} `} />
    </div>
  );
}

export default CircularLoading;