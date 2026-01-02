import Admin from "../../layouts/Admin";
import { Coins, HandCoins, LineChart, Package, TrendingUp } from "lucide-react";
import { useState, useEffect  } from "react";
import { _get } from "../../api";
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

    const [goodsDonationCount, setGoodsDonationCount] = useState(0);

    useEffect(() => {
        fetchCashDonationSummary();
        fetchGcashDonationStats();
        fetchCashDonationStats();
        fetchGoodsDonationStats();
    }, []);

    const fetchGoodsDonationStats = async () => {
        try {
            const response = await _get('/goods-donations/v2/counts');
            if (response && response.data) {
                setGoodsDonationCount(response.data.total_approved_goods_donations);
            }
        } catch (error) {
            console.log(error);
        }
    }

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
            <div className="w-full h-full p-1 mt-4">
                <div className="w-full h-full flex flex-col gap-5">
                    {/* METRIC CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <MetricCard
                            label="Cash donations"
                            value={loadingCashDoSumary ? "..." : `₱ ${cashDonationTotalAmmount || 0}`}
                            accent="green"
                            icon={<HandCoins size={28} />}
                            sub="Approved total"
                        />
                        <MetricCard
                            label="GCash donations"
                            value={loadingCashDoSumary ? "..." : `₱ ${gcashDonationTotalAmmount || 0}`}
                            accent="blue"
                            icon={<HandCoins size={28} />}
                            sub="Paid total"
                        />
                        <MetricCard
                            label="Monetary donations"
                            value={loadingCashDoSumary ? "..." : (gcashDonationCount + cashDonationCount || 0)}
                            accent="pink"
                            icon={<Coins size={28} />}
                            sub="Total counts"
                        />
                        <MetricCard
                            label="Goods donations"
                            value={loadingCashDoSumary ? "..." : goodsDonationCount || 0}
                            accent="purple"
                            icon={<Package size={28} />}
                            sub="Total approved"
                        />
                    </div>

                    {/* CHARTS */}
                    <div className="w-full flex flex-col md:flex-row items-start gap-5">
                        <div className="w-full md:w-[55%] flex flex-col gap-4">
                            <AnalyticsCard title="Monthly GCash Donation Trend" accent="green">
                                <GCashDonationChart />
                            </AnalyticsCard>
                            <AnalyticsCard title="Monthly Cash Donation Trend" accent="blue">
                                <CashDonationChart />
                            </AnalyticsCard>
                        </div>

                        <div className="w-full md:w-[45%] flex flex-col gap-4">
                            <AnalyticsCard title="Monthly Goods Donation Comparison" accent="purple">
                                <GoodsDonationChart />
                            </AnalyticsCard>
                        </div>
                    </div>
                </div>
            </div>
        </Admin>
    )
}

const accentClasses = {
    green: { text: "text-green-600", bg: "bg-green-50", iconBg: "bg-green-100" },
    blue: { text: "text-blue-600", bg: "bg-blue-50", iconBg: "bg-blue-100" },
    pink: { text: "text-pink-600", bg: "bg-pink-50", iconBg: "bg-pink-100" },
    purple: { text: "text-purple-600", bg: "bg-purple-50", iconBg: "bg-purple-100" },
    orange: { text: "text-orange-600", bg: "bg-orange-50", iconBg: "bg-orange-100" },
};

const MetricCard = ({ label, value, sub, icon, accent = "orange" }) => {
    const colors = accentClasses[accent] || accentClasses.orange;
    return (
        <div className="relative w-full rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex items-center gap-3 overflow-hidden min-h-[110px]">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <div className={`${colors.text}`}>{icon}</div>
            </div>
            <div className="flex flex-col">
                <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
                <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
                <p className="text-[11px] text-gray-500">{sub}</p>
            </div>
            <TrendingUp className="absolute -right-3 bottom-2 text-gray-100" size={64} />
        </div>
    );
};

const AnalyticsCard = ({ title, children, accent = "orange" }) => {
    const colors = accentClasses[accent] || accentClasses.orange;
    return (
        <div className="w-full bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h2 className={`text-sm font-semibold ${colors.text}`}>{title}</h2>
                <LineChart className={`${colors.text}`} size={16} />
            </div>
            {children}
        </div>
    );
};

export default Dashboard;
