import { useEffect } from "react";
import User from "../layouts/User";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import Logout from "../components/Logout";

const Portal = () => {

    const user = useContext(AuthContext);

    return (
        <User>
            <div className="w-full flex items-center justify-center flex-col p-4 ">
                <div className="w-full max-w-[1200px] flex items-start gap-8" >
                    <div className="min-w-80 h-72 bg-gray-200 rounded flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Your Image Here</p>
                    </div>
                    <div className="w-full flex items-start justify-between py-2 h-fit border-b border-gray-200">
                        <div className="w-full">
                            <h1 className="text-2xl text-gray-700 font-semibold text-left mt-4 ">Welcome {user.user.name}!</h1>
                            <p className="text-left text-orange-500 text-sm">You are now logged in</p>
                        </div>
                        <div className="min-w-32">
                            <Logout/>
                        </div>
                    </div>
                </div>
            </div>
        </User>
    );
}

export default Portal;