import Admin from "../../layouts/Admin";
import { Coins, HandCoins } from "lucide-react";
import { useState, useEffect  } from "react";
import { _get } from "../../api";
import Logo from "../../components/Logo";
import GCashDonationChart from "../../components/charts/GCashDonationChart";
import CashDonationChart from "../../components/charts/CashDonationChart";
import GoodsDonationChart from "../../components/charts/GoodsDonationChart";

const Dashboard = () => {

    const [cashDonationSummary, setCashDonationSummary] = useState();
    const [loadingCashDoSumary, setLoadingCasgDoSummary] = useState(true);

    const [gcashDonationTotalAmmount, setGcashDonationTotalAmmount] = useState(0);
    const [gcashDonationCount, setGcashDonationCount] = useState(0);

    const [cashDonationTotalAmmount, setCashDonationTotalAmmount] = useState(0);
    const [cashDonationCount, setCashDonationCount] = useState(0);

    useEffect(() => {
        fetchCashDonationSummary();
        fetchGcashDonationStats();
        fetchCashDonationStats();
    }, []);

    const fetchCashDonationStats = async () => {
        try {
            const response = await _get('/cash-donations/counts');
            if (response && response.data) {
                setCashDonationTotalAmmount(response.data.total_approved_amount);
                setCashDonationCount(response.data.total_approved_donations);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchGcashDonationStats = async () => {
        try {
            const response = await _get('/gcash-donations/counts');
            if (response && response.data) {
                setGcashDonationTotalAmmount(response.data.total_paid_amount);
                setGcashDonationCount(response.data.total_paid_donations);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCashDonationSummary = async () => {
        try {
            const response = await _get('/dashboard/donations/summary');
            if (response && response.data) {
                setCashDonationSummary(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingCasgDoSummary(false);
        }
    }

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
                    <div className="w-full h-full flex flex-wrap gap-4 items-start justify-between ">
                        <div className="relative w-72 h-24 rounded-xl bg-white p-4 shadow-sm flex flex-col gap-1 items-start justify-center overflow-hidden">
                            <p className="text-2xl text-green-500 font-bold">&#8369; {loadingCashDoSumary ? '...' : (cashDonationTotalAmmount || 0)}</p>
                            <p className="text-xs text-gray-600">Total <span className="text-green-600 font-bold">Cash</span> Donations</p>
                            <HandCoins size={60}  className="bg-green-50 rounded-2xl p-3 absolute -bottom-3 -right-3 text-green-300"/>
                        </div>
                        <div className="relative w-72 h-24 rounded-xl bg-white p-4 shadow-sm flex flex-col gap-1 items-start justify-center overflow-hidden">
                            <p className="text-2xl text-blue-600 font-bold">&#8369; {loadingCashDoSumary ? '...' : (gcashDonationTotalAmmount || 0)}</p>
                            <p className="text-xs text-gray-600">Total <span className="text-blue-600 font-bold">GCash</span> Donations</p>
                            <HandCoins size={60}  className="bg-blue-50 rounded-2xl p-3 absolute -bottom-3 -right-3 text-blue-300"/>
                        </div>
                        <div className="relative w-72 h-24 rounded-xl bg-white p-4 shadow-sm flex flex-col gap-1 items-start justify-center overflow-hidden">
                            <p className="text-2xl text-pink-600 font-bold">{loadingCashDoSumary ? '...' : ((gcashDonationCount + cashDonationCount) || 0)}</p>
                            <p className="text-xs text-gray-600">Total Count of <span className="text-pink-600 font-bold">Monetary</span> Donations</p>
                            <Coins size={60}  className="bg-pink-50 rounded-2xl p-3 absolute -bottom-3 -right-3 text-pink-300"/>
                        </div>
                        <div className="relative w-72 h-24 rounded-xl bg-white p-4 shadow-sm flex flex-col gap-1 items-start justify-center overflow-hidden">
                            <p className="text-2xl text-purple-600 font-bold">{loadingCashDoSumary ? '...' : cashDonationSummary?.goodsDonTotal || 0}</p>
                            <p className="text-xs text-gray-600">Total Cout of <span className="text-purple-600 font-bold">Goods</span> Donations</p>
                            <Coins size={60}  className="bg-purple-50 rounded-2xl p-3 absolute -bottom-3 -right-3 text-purple-300"/>
                        </div>
                    </div>
                    <div className="w-full flex items-start gap-5">
                        <div className="w-[55%] flex flex-col gap-4">
                            <div className="w-full bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-green-500">Monthly GCash Donation Trend</h2>
                                </div>
                                <GCashDonationChart />
                            </div>
                            <div className="w-full bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-blue-600">Monthly Cash Donation Trend</h2>
                                </div>
                                <CashDonationChart />
                            </div>
                        </div>

                        <div className="w-[45%] flex flex-col gap-4">
                            <div className="w-full bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-purple-600">Monthly Goods Donation Comparison</h2>
                                </div>
                                <GoodsDonationChart />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Admin>
    )
}

export default Dashboard;