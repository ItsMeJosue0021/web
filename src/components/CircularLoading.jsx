import { BiLoaderAlt } from "react-icons/bi";

const CircularLoading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <BiLoaderAlt   className="animate-spin text-blue-500 w-6 h-6" />
    </div>
  );
}

export default CircularLoading;