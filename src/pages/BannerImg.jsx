import Admin from "../layouts/Admin";

const BannerImg = () => {


    const header = {
        title: "Banner Images Settings",
        subTitle: "Manage homepage banners easily – add new images, update existing ones, or remove outdated banners."
    }

    const breadcrumbs = [
        { name: "Settings", link: "/settings/banner-images" },
        { name: "Banner Images", link: "/settings/banner-images" }
    ]

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full h-96 flex items-center justify-center">
                <p>Banner Images Settings</p>
            </div>
        </Admin>
    )
}

export default BannerImg;