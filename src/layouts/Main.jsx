import { Outlet, Link } from "react-router-dom";

const Main = () => {
    return (
        <div className="w-screen h-auto min-h-screen">
           <header className="w-full flex items-center gap-6">
                <h1>Home</h1>
                <nav>
                    <ul className="flex items-center justify-between ">
                        <li className="px-4 py-2 rounded-md">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="px-4 py-2 rounded-md">
                            <Link to="/roles">Roles</Link>
                        </li>
                        <li className="px-4 py-2 rounded-md">
                            <Link to="/registration">Registration</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <Outlet />
        </div>
    );
}

export default Main;

