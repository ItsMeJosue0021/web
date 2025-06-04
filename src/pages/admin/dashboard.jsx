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
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-600 font-bold">Dashboard</p>
            </div>
        </Admin>
    )
}

export default Dashboard;