import Admin from "../../../layouts/Admin";

const WebVolunteers = () => {
    const header = {
        title: "Volunteers",
        subTitle: "This page is currently not available"
    }

    const breadcrumbs = [
        { name: "Volunteers", link: "/web-content/volunteers" }
    ];
    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full h-96 flex items-center justify-center"> 
                <p className="text-lg font-medium text-gray-600">Temporarily Unavailable</p>
            </div>
        </Admin>
        
    )
}

export default WebVolunteers;