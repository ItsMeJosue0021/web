import Admin from "../../../layouts/Admin";

const WebContactUs = () => {
    const header = {
        title: "Contact Us",
        subTitle: "This page is currently not available"
    }

    const breadcrumbs = [
        { name: "Contact Us", link: "/web-content/contact-us" }
    ];
    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full h-96 flex items-center justify-center"> 
                <p className="text-lg font-medium text-gray-600">Temporarily Unavailable</p>
            </div>
        </Admin>
        
    )
}

export default WebContactUs;