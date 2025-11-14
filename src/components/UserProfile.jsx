const UserProfile = ({ name, email, avatarUrl }) => {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200">

      <img
        src={avatarUrl}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover border"
      />

      <div className="flex flex-col">
        <p className="font-semibold text-sm text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>

    </div>
  );
};

export default UserProfile;