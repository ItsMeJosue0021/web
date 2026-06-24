const NavBadge = ({ count = 0, className = "" }) => {
    if (!count || count <= 0) return null;

    const display = count > 99 ? "99+" : count;

    return (
        <span
            className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none ${className}`}
            aria-label={`${count} new`}
            title={`${count} new`}
        >
            {display}
        </span>
    );
};

export default NavBadge;
