import Admin from "../layouts/Admin";


const ContactInfo = () => {

    const header = {
        title: "Contact Information Settings",
        subTitle: "Update and manage your organization's contact details including address, phone number, and email."
    }

    const breadcrumbs = [
        { name: "Settings", link: "/settings/contact-info" },
        { name: "ContactInfo", link: "/settings/contact-info" }
    ]
    
    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full h-96 flex items-center justify-center">
                <p>Contact infor settings page</p>
            </div>
        </Admin>
    )
}

export default ContactInfo;