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
            <button type="submit" className="w-full rounded-md hover:bg-gray-100 bg-gray-50 border flex items-center justify-center space-x-2 cursor-pointer py-2 px-2">
                <p className="text-xs font-medium text-center">Logout</p>
            </button>
        </form>
        
    );
}

export default Logout;