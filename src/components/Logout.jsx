import React from 'react';
import { AuthContext } from '../AuthProvider';
import { useContext } from 'react';

const Logout = () => {

    const { logout } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await logout();
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit" className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Logout</button>
        </form>
    );
}

export default Logout;