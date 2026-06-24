import { useState, useContext } from 'react';
import { AuthContext } from '../AuthProvider';
import Logout from './Logout';
import { resolveStorageImageUrl } from '../utils/resolveStorageImageUrl';

const HeaderProfile = () => {

    const { user } = useContext(AuthContext);
    const avatarUrl = resolveStorageImageUrl(user?.image);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const normalizedRole = typeof user?.role === 'string' ? user.role : user?.role?.name;
    const isSuperAdmin = normalizedRole === 'super-admin';
    // For super admins, display the name without the leading "Super" (e.g. "Super Admin" -> "Admin").
    const displayName = isSuperAdmin
        ? ((user?.fullName || '').replace(/^\s*super\s+/i, '').trim() || user?.fullName)
        : user?.fullName;

    return (
        <div >
            <h1 className="text-2xl font-medium"></h1>
            <div className="relative flex items-center space-x-3">
                <p className='text-xs text-white'>{displayName}</p>
                <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center justify-center min-w-9 w-9 min-h-9 h-9 rounded-full bg-orange-100 cursor-pointer">
                    {user?.image ? (
                        <img
                            src={avatarUrl}
                            alt="Admin"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <p className="text-xs font-medium text-orange-500">{displayName?.charAt(0) || ''}</p>
                    )}
                </div>

            {isProfileOpen && (
                <div className="absolute top-14 right-0 w-52 bg-white border border-gray-200 rounded-md shadow-md z-[999]">
                    <div className="flex flex-col items-center justify-start p-4 gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
                            {user?.image ? (
                                <img
                                    src={avatarUrl}
                                    alt="Admin"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <p className="text-lg font-medium text-orange-500">{displayName?.charAt(0) || ''}</p>
                            )}
                        </div>
                        <p className='text-sm'>{displayName}</p>
                        <Logout/>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default HeaderProfile;
