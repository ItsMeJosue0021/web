import Admin from "../../../layouts/Admin";

const WebEvents = () => {
   const header = {
        title: "Events",
        subTitle: "This page is currently not available"
    }

    const breadcrumbs = [
        { name: "Events", link: "/web-content/events" }
    ];
    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full h-96 flex items-center justify-center"> 
                <p className="text-lg font-medium text-gray-600">Temporarily Unavailable</p>
            </div>
        </Admin>
        
    )
}

export default WebEvents;