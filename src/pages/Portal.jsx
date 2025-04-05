import { useEffect } from "react";
import User from "../layouts/User";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import Logout from "../components/Logout";

const events = [
    {
        title: "Event 1",
        date: "2023-10-01",
        time: "10:00 AM",
        description: "Description for Event 1",
    },
    {
        title: "Event 2",
        date: "2023-10-02",
        time: "2:00 PM",
        description: "Description for Event 2",
    },
    {
        title: "Event 3",
        date: "2023-10-03",
        time: "4:00 PM",
        description: "Description for Event 3",
    },
    {
        title: "Event 4",
        date: "2023-10-04",
        time: "6:00 PM",
        description: "Description for Event 4",
    },
];

const Portal = () => {

    const {user} = useContext(AuthContext);

    return (
        <User>
            <div className="w-full flex items-center justify-center flex-col p-4 overflow-hidden ">
                <div className="w-full max-w-[1200px] grid grid-cols-7 gap-4" >
                    {/* <div className="min-w-80 h-72 bg-gray-200 rounded flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Your Image Here</p>
                    </div>
                    <div className="w-full flex items-start justify-between py-2 h-fit border-b border-gray-200">
                        <div className="w-full">
                            <h1 className="text-2xl text-gray-700 font-semibold text-left mt-4 ">Welcome {user.fullName}!</h1>
                            <p className="text-left text-orange-500 text-sm">You are now logged in</p>
                        </div>
                        <div className="min-w-32">
                            <Logout/>
                        </div>
                    </div> */}
                    <div className="col-span-2 h-72 bg-gray-200 rounded flex items-center justify-center">

                    </div>

                    <div className="col-span-3 h-auto rounded flex items-start flex-col justify-start gap-2">
                        <div className="w-full pr-5">
                            <input type="text" placeholder="Search.." className="w-full text-sm placeholder:text-sm rounded border px-6 py-2"/>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-2 w-full h-auto max-h-[550px] overflow-y-auto pr-2">
                            {events.map((event, index) => (
                                <div key={index} className="w-full min-h-36 flex items-start justify-start gap-2 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                                    <div className="flex flex-col items-start justify-start gap-1">
                                        <h1 className="text-sm font-semibold text-gray-700">{event.title}</h1>
                                        <p className="text-xs text-gray-500">{event.date} - {event.time}</p>
                                    </div>
                                    <div className="flex-grow"></div>
                                    <p className="text-xs text-gray-500">{event.description}</p>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className="col-span-2 h-fit w-full max-w-sm bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex justify-end px-4 pt-4">
                            <button id="dropdownButton" data-dropdown-toggle="dropdown" class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                                <span className="sr-only">Open dropdown</span>
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                </svg>
                            </button>
                            {/* <!-- Dropdown menu --> */}
                            <div id="dropdown" class="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                                <ul className="py-2" aria-labelledby="dropdownButton">
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                                </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col items-center pb-10">
                            <img className="w-24 h-24 mb-3 rounded-full shadow-lg bg-gray-400 object-center object-cover" src="sampleprofile.jpg" alt="image"/>
                            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Bonnie Green</h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
                            {/* <div className="flex mt-4 md:mt-6">
                                <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add friend</a>
                                <a href="#" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</a>
                            </div> */}
                        </div>
                    </div>

                </div>
            </div>
        </User>
    );
}

export default Portal;