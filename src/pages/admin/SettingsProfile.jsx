import { useContext, useEffect, useMemo, useState } from "react";
import Admin from "../../layouts/Admin";
import { AuthContext } from "../../AuthProvider";
import { _post } from "../../api";
import { toast } from "react-toastify";
import CircularLoading from "../../components/CircularLoading";
import { resolveStorageImageUrl } from "../../utils/resolveStorageImageUrl";

const SettingsProfile = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        email: "",
        contactNo: "",
    });
    const [profileErrors, setProfileErrors] = useState({});
    const [savingProfile, setSavingProfile] = useState(false);

    const [profileFile, setProfileFile] = useState(null);
    const [photoErrors, setPhotoErrors] = useState("");
    const [savingPhoto, setSavingPhoto] = useState(false);

    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        newPassword_confirmation: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [savingPassword, setSavingPassword] = useState(false);

    const fullName = useMemo(() => {
        const firstName = user?.firstName || formData.first_name || "";
        const middleName = user?.middleName || formData.middle_name || "";
        const lastName = user?.lastName || formData.last_name || "";

        return `${firstName} ${middleName} ${lastName}`.trim();
    }, [user?.firstName, user?.middleName, user?.lastName, formData.first_name, formData.middle_name, formData.last_name]);

    const profileImage = useMemo(() => {
        if (profileFile) {
            return URL.createObjectURL(profileFile);
        }
        return resolveStorageImageUrl(user?.image);
    }, [user?.image, profileFile]);

    useEffect(() => {
        if (!user) return;
        setFormData({
            first_name: user.firstName || "",
            middle_name: user.middleName || "",
            last_name: user.lastName || "",
            username: user.username || "",
            email: user.email || "",
            contactNo: user.contactNumber || "",
        });
    }, [user?.id]);

    const handleProfileInput = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoPick = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setPhotoErrors("");
        setProfileFile(file);
    };

    const saveProfileInfo = async () => {
        if (!user?.id) return;
        setSavingProfile(true);
        setProfileErrors({});

        try {
            const payload = {
                first_name: formData.first_name.trim(),
                middle_name: formData.middle_name.trim(),
                last_name: formData.last_name.trim(),
                username: formData.username.trim(),
                email: formData.email.trim(),
                contactNo: formData.contactNo.trim(),
            };

            await _post(`/users/profile-update/${user.id}`, payload);
            await refreshUser();
            toast.success("Profile updated successfully.");
        } catch (error) {
            if (error?.response?.data?.errors) {
                setProfileErrors(error.response.data.errors);
            } else {
                toast.error("Unable to update profile.");
            }
        } finally {
            setSavingProfile(false);
        }
    };

    const saveProfilePhoto = async () => {
        if (!user?.id) return;
        if (!profileFile) {
            setPhotoErrors("Please select a photo first.");
            return;
        }

        setSavingPhoto(true);
        setPhotoErrors("");
        try {
            const data = new FormData();
            data.append("image", profileFile);

            await _post(`/users/profile-picture/${user.id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await refreshUser();
            setProfileFile(null);
            toast.success("Profile photo updated successfully.");
        } catch (error) {
            setPhotoErrors("Unable to upload photo.");
        } finally {
            setSavingPhoto(false);
        }
    };

    const savePassword = async () => {
        if (!user?.id) return;
        setSavingPassword(true);
        setPasswordErrors({});
        try {
            await _post(`/users/change-password/${user.id}`, password);
            setPassword({
                oldPassword: "",
                newPassword: "",
                newPassword_confirmation: "",
            });
            toast.success("Password changed successfully.");
        } catch (error) {
            if (error?.response?.data?.errors) {
                setPasswordErrors(error.response.data.errors);
            } else if (error?.response?.data?.error) {
                setPasswordErrors({ oldPassword: [error.response.data.error] });
            } else {
                toast.error("Unable to change password.");
            }
        } finally {
            setSavingPassword(false);
        }
    };

    useEffect(() => {
        return () => {
            if (profileFile && profileImage.startsWith("blob:")) {
                URL.revokeObjectURL(profileImage);
            }
        };
    }, [profileFile, profileImage]);

    const header = {
        title: "Profile Settings",
        subTitle: "Update your name, photo and password",
    };

    const breadcrumbs = [
        { name: "Settings", link: "/settings/profile" },
        { name: "Profile", link: "/settings/profile" },
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4">
                <section className="w-full rounded-lg border border-gray-200 bg-white p-4 md:p-6">
                    <div className="w-full flex flex-col md:flex-row items-start gap-4">
                        <div className="w-full md:w-48 flex flex-col items-center gap-3">
                            <div className="w-28 h-28 rounded-full border border-gray-200 shadow-sm overflow-hidden bg-gray-100">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label className="w-full">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoPick}
                                />
                                <span className="w-full block text-center text-xs text-gray-600 border border-gray-200 rounded px-3 py-2 cursor-pointer hover:bg-gray-50">
                                    {savingPhoto ? "Uploading..." : "Upload New Photo"}
                                </span>
                            </label>
                            {photoErrors && <p className="text-[11px] text-red-500">{photoErrors}</p>}
                            <button
                                type="button"
                                onClick={saveProfilePhoto}
                                className="w-full text-xs px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={savingPhoto || !profileFile}
                            >
                                {savingPhoto ? "Saving Photo..." : "Save Photo"}
                            </button>
                        </div>

                        <div className="w-full">
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Display name</p>
                                <p className="text-xl font-semibold text-gray-800">
                                    {fullName || "Admin"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-600">First Name</label>
                                    <input
                                        type="text"
                                        className="text-xs rounded border border-gray-200 px-4 py-2"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleProfileInput}
                                    />
                                    {profileErrors.first_name && <p className="text-red-500 text-[11px]">{profileErrors.first_name[0]}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-600">Middle Name</label>
                                    <input
                                        type="text"
                                        className="text-xs rounded border border-gray-200 px-4 py-2"
                                        name="middle_name"
                                        value={formData.middle_name}
                                        onChange={handleProfileInput}
                                    />
                                    {profileErrors.middle_name && <p className="text-red-500 text-[11px]">{profileErrors.middle_name[0]}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-600">Last Name</label>
                                    <input
                                        type="text"
                                        className="text-xs rounded border border-gray-200 px-4 py-2"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleProfileInput}
                                    />
                                    {profileErrors.last_name && <p className="text-red-500 text-[11px]">{profileErrors.last_name[0]}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-600">Username</label>
                                    <input
                                        type="text"
                                        className="text-xs rounded border border-gray-200 px-4 py-2"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleProfileInput}
                                    />
                                    {profileErrors.username && <p className="text-red-500 text-[11px]">{profileErrors.username[0]}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        className="text-xs rounded border border-gray-200 px-4 py-2"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleProfileInput}
                                    />
                                    {profileErrors.email && <p className="text-red-500 text-[11px]">{profileErrors.email[0]}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-600">Contact No.</label>
                                    <input
                                        type="text"
                                        className="text-xs rounded border border-gray-200 px-4 py-2"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleProfileInput}
                                    />
                                    {profileErrors.contactNo && <p className="text-red-500 text-[11px]">{profileErrors.contactNo[0]}</p>}
                                    {profileErrors.contact_number && <p className="text-red-500 text-[11px]">{profileErrors.contact_number[0]}</p>}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={saveProfileInfo}
                                    className="px-4 py-2 text-xs rounded-md bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={savingProfile || !user}
                                >
                                    {savingProfile ? (
                                        <div className="flex items-center gap-2">
                                            <CircularLoading customClass="w-4 h-4 text-white" />
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        "Save Profile"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full rounded-lg border border-gray-200 bg-white p-4 md:p-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Security</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">Old Password</label>
                            <input
                                type="password"
                                className="text-xs rounded border border-gray-200 px-4 py-2"
                                name="oldPassword"
                                value={password.oldPassword}
                                onChange={(e) => setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            />
                            {passwordErrors.oldPassword && <p className="text-red-500 text-[11px]">{passwordErrors.oldPassword[0]}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">New Password</label>
                            <input
                                type="password"
                                className="text-xs rounded border border-gray-200 px-4 py-2"
                                name="newPassword"
                                value={password.newPassword}
                                onChange={(e) => setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            />
                            {passwordErrors.newPassword && <p className="text-red-500 text-[11px]">{passwordErrors.newPassword[0]}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">Confirm Password</label>
                            <input
                                type="password"
                                className="text-xs rounded border border-gray-200 px-4 py-2"
                                name="newPassword_confirmation"
                                value={password.newPassword_confirmation}
                                onChange={(e) => setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={savePassword}
                            className="px-4 py-2 text-xs rounded-md bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={savingPassword || !user}
                        >
                            {savingPassword ? (
                                <div className="flex items-center gap-2">
                                    <CircularLoading customClass="w-4 h-4 text-white" />
                                    <span>Updating...</span>
                                </div>
                            ) : (
                                "Update Password"
                            )}
                        </button>
                    </div>
                </section>
            </div>
        </Admin>
    );
};

export default SettingsProfile;
