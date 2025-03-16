import User from "../layouts/User";

const Portal = () => {
    return (
        <User>
            <div className="w-full flex items-center justify-center flex-col p-4 ">
                <div className="h-48 w-full max-w-[1400px] rounded-xl border border-gray-300" >
                    <h1 className="text-2xl font-medium">Portal</h1>
                </div>
            </div>
        </User>
    );
}

export default Portal;