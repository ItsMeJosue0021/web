import React from 'react';
import { AuthContext } from '../AuthProvider';
import { useContext } from 'react';
import logoutIcon from '../assets/icons/logout.png';


const Logout = () => {

    const { logout } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await logout();
    }

    return (
        <form onSubmit={handleSubmit} className='w-full'>
            <button type="submit" className="w-full rounded-md hover:bg-gray-100 bg-gray-50 border border-gray-200 flex items-center space-x-2 cursor-pointer h-14 px-2">
                <div className="flex justify-center w-10">
                    <img src={logoutIcon} alt="icon" className="w-7 h-7 opacity-80" />
                </div>
                <p className="text-base font-semibold">Logout</p>
            </button>
        </form>
        
    );
}

export default Logout;