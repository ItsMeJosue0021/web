import { useState, useContext } from 'react';
import { AuthContext } from '../AuthProvider';
import Logout from './Logout';

const HeaderProfile = () => {

    const { user } = useContext(AuthContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div >
            <h1 className="text-2xl font-medium"></h1>
            <div className="relative flex items-center space-x-3">
                <p className='text-xs text-black'>{user.fullName }</p>
                <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 cursor-pointer">
                    <p className="text-xs font-medium text-orange-500">{user?.fullName?.charAt(0) || ''}</p>
                </div>

            {isProfileOpen && (
                <div className="absolute top-14 right-0 w-52 bg-white border border-gray-200 rounded-md shadow-md z-[999]">
                    <div className="flex flex-col items-center justify-start p-4 gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
                            <p className="text-lg font-medium text-orange-500">{user?.fullName?.charAt(0) || ''}</p>
                        </div>
                        <p className='text-sm'>{user.fullName }</p>
                        <Logout/>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default HeaderProfile;