import Admin from "../../../layouts/Admin";

const WebHome = () => {
    const header = {
        title: "Home",
        subTitle: "This page is currently not available"
    }

    const breadcrumbs = [
        { name: "Home", link: "/web-content/home" }
    ];
    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full h-96 flex items-center justify-center"> 
                <p className="text-lg font-medium text-gray-600">Temporarily Unavailable</p>
            </div>
        </Admin>
        
    )
}

export default WebHome;