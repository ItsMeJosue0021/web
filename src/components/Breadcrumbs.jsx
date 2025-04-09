import { Link } from "lucide-react";

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <div className="flex items-center">
        <Link className="w-4 h-4 text-blue-300 text-xs font-light hover:text-blue-500 hover:underline mr-1"/>
        {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-1 text-xs">/</span>}
                <a href={crumb.link} className="text-black font-light hover:text-blue-500 text-xs hover:underline">
                    {crumb.name}
                </a>
            </div>
        ))}
    </div>
  );
}

export default Breadcrumbs;

