import { Link } from 'react-router-dom';
import arrowDown from '../assets/icons/down-arrow.png';

const Dropdown = ({ label, icon: Icon, isOpen, toggle, items, onItemClick }) => (
  <div className="w-full">
    <div
      onClick={toggle}
      className="w-full px-4 py-2 flex justify-between items-center 
                 cursor-pointer hover:bg-orange-50"
    >
      <div className="flex items-center gap-3">
        {/* Parent Icon */}
        {Icon && <Icon className="w-5 h-5 text-orange-500" />}

        <p className="text-sm font-medium">{label}</p>
      </div>
      <img
        src={arrowDown}
        alt="arrow"
        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </div>

    {isOpen && (
      <div className="pl-8 py-3 flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className="w-full px-4 py-2 border-l-4 border-orange-500
                       hover:bg-orange-50 group"
          >
            <p className="text-sm text-black group-hover:text-orange-600">
              {item.label}
            </p>
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default Dropdown;