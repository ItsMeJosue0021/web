import Admin from "../../layouts/Admin";

const Dashboard = () => {
    const header = {
        title: "Dashboard",
        subTitle: "Get a quick overview of donations, activities, and key metrics to help you monitor and manage your initiatives efficiently."
    };

    const breadcrumbs = [
        { name: "Dashboard", link: "/dashboard" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full h-full flex items-center justify-center p-1 mt-4">
                <div className="w-full h-full flex flex-col gap-5">
                    <div className="w-full h-full flex items-start justify-between ">
                        <div className="relative w-60 h-24 rounded-xl bg-gray-100 animate-pulse p-4">
                            <div className="w-20 h-4  mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-full h-3 mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="absolute bottom-4 right-5 w-8 h-3 rounded-xl bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="relative w-60 h-24 rounded-xl bg-gray-100 animate-pulse p-4">
                            <div className="w-20 h-4  mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-full h-3 mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="absolute bottom-4 right-5 w-8 h-3 rounded-xl bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="relative w-60 h-24 rounded-xl bg-gray-100 animate-pulse p-4">
                            <div className="w-20 h-4  mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-full h-3 mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="absolute bottom-4 right-5 w-8 h-3 rounded-xl bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="relative w-60 h-24 rounded-xl bg-gray-100 animate-pulse p-4">
                            <div className="w-20 h-4  mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-full h-3 mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="absolute bottom-4 right-5 w-8 h-3 rounded-xl bg-gray-200 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="w-full flex items-start gap-5">
                        <div className="relative w-[60%] h-80 rounded-xl bg-gray-100 animate-pulse p-4">
                            <div className="w-56 h-4  mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-full h-3 mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-full h-3 mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-[90%] h-3 rounded-xl bg-gray-200 animate-pulse"></div>
                             <div className="absolute bottom-5 right-5 w-8 h-5 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="absolute bottom-5 left-5 w-16 h-5 rounded-xl bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="relative w-[40%] h-80 rounded-xl bg-gray-100 animate-pulse p-4">
                            <div className="w-40 h-4  mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-full h-3 mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-full h-3 mb-2 rounded-xl bg-gray-200  animate-pulse"></div>
                            <div className="w-[90%] h-3 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="absolute bottom-5 right-5 w-8 h-5 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="absolute bottom-5 left-5 w-16 h-5 rounded-xl bg-gray-200 animate-pulse"></div>
                        </div>
                    </div>

                </div>
            </div>
        </Admin>
    )
}

export default Dashboard;