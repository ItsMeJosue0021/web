import { Link } from "react-router-dom";

const NavItem = ({ to, label, icon: Icon, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="w-full px-4 py-2 flex items-center gap-3
               hover:bg-orange-50 group transition-colors"
  >
    {/* Icon */}
    {Icon && (
      <Icon className="w-5 h-5 text-orange-500 group-hover:text-orange-600" />
    )}

    {/* Label */}
    <p className="text-sm text-black group-hover:text-orange-600">
      {label}
    </p>
  </Link>
);

export default NavItem;
