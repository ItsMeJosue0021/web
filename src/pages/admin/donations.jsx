import Admin from "../../layouts/Admin";

const Donations = () => {
    const header = { 
        title: "Donations Management",
        subTitle: "Easily manage incoming donations — add new entries, view donor details, or update donation records with ease."
    };

    const breadcrumbs = [
        { name: "Donations", link: "/donations" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-600 font-bold">Donations</p>
            </div>
        </Admin>
    )
}

export default Donations;