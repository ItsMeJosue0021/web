import { Link } from "react-router-dom";
import Logout from "../components/Logout";

const Home = () => {
    return (
        <div className="w-screen h-auto min-h-screen flex items-center justify-center">
            Home
            <Logout />
        </div>
    );
}

export default Home;
