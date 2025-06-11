import Admin from "../../layouts/Admin";
import { Coins, HandCoins } from "lucide-react";
import { useState, useEffect, useRef  } from "react";
import { _get } from "../../api";
import html2pdf from 'html2pdf.js';
import Logo from "../../components/Logo";

const Dashboard = () => {

    const printRef = useRef();
    const printBtnRef = useRef();
    const logoRef = useRef();

    const print1Ref = useRef();
    const print1BtnRef = useRef();
    const logo1Ref = useRef();

    const print2Ref = useRef();
    const print2BtnRef = useRef();
    const logo2Ref = useRef();

    const [cashDonationSummary, setCashDonationSummary] = useState();
    const [loadingCashDoSumary, setLoadingCasgDoSummary] = useState(true);

    useEffect(() => {
        fetchCashDonationSummary();
    }, []);

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

    const handlePrint = () => {
        const element = printRef.current;
        const printBtn = printBtnRef.current;
        const logo = logoRef.current;
        
        printBtn.classList.add('hidden');
        element.classList.remove('w-[55%]');
        element.classList.add('w-full');
        logo.classList.remove('hidden');

        const opt = {
            margin: 0.5,
            filename: 'Monthly_Donation_Trend.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf()
            .set(opt)
            .from(element)
            .outputPdf('blob') 
            .then((pdfBlob) => {
                const blobUrl = URL.createObjectURL(pdfBlob);
                window.open(blobUrl); 
                printBtn.classList.remove('hidden');
                element.classList.add('w-[55%]');
                element.classList.remove('w-full');
                logo.classList.add('hidden');
            });
    };

    const handlePrint1 = () => {
        const element = print1Ref.current;
        const printBtn = print1BtnRef.current;
        const logo = logo1Ref.current;
        
        printBtn.classList.add('hidden');
        logo.classList.remove('hidden');

        const opt = {
            margin: 0.5,
            filename: 'Monthly_Donation_Trend.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf()
            .set(opt)
            .from(element)
            .outputPdf('blob') 
            .then((pdfBlob) => {
                const blobUrl = URL.createObjectURL(pdfBlob);
                window.open(blobUrl); 
                printBtn.classList.remove('hidden');
                logo.classList.add('hidden');
            });
    };

        const handlePrint2 = () => {
        const element = print2Ref.current;
        const printBtn = print2BtnRef.current;
        const logo = logo2Ref.current;
        
        printBtn.classList.add('hidden');
        logo.classList.remove('hidden');

        const opt = {
            margin: 0.5,
            filename: 'Monthly_Donation_Trend.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf()
            .set(opt)
            .from(element)
            .outputPdf('blob') 
            .then((pdfBlob) => {
                const blobUrl = URL.createObjectURL(pdfBlob);
                window.open(blobUrl); 
                printBtn.classList.remove('hidden');
                logo.classList.add('hidden');
            });
    };

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
                            <p className="text-2xl text-green-500 font-bold">&#8369; {loadingCashDoSumary ? '...' : (cashDonationSummary?.totalCash || 0)}</p>
                            <p className="text-xs text-gray-600">Total <span className="text-green-600 font-bold">Cash</span> Donations</p>
                            <HandCoins size={60}  className="bg-green-50 rounded-2xl p-3 absolute -bottom-3 -right-3 text-green-300"/>
                        </div>
                        <div className="relative w-72 h-24 rounded-xl bg-white p-4 shadow-sm flex flex-col gap-1 items-start justify-center overflow-hidden">
                            <p className="text-2xl text-blue-600 font-bold">&#8369; {loadingCashDoSumary ? '...' : (cashDonationSummary?.totalGcash || 0)}</p>
                            <p className="text-xs text-gray-600">Total <span className="text-blue-600 font-bold">GCash</span> Donations</p>
                            <HandCoins size={60}  className="bg-blue-50 rounded-2xl p-3 absolute -bottom-3 -right-3 text-blue-300"/>
                        </div>
                        <div className="relative w-72 h-24 rounded-xl bg-white p-4 shadow-sm flex flex-col gap-1 items-start justify-center overflow-hidden">
                            <p className="text-2xl text-pink-600 font-bold">{loadingCashDoSumary ? '...' : cashDonationSummary?.totalCount || 0}</p>
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
                        <div className="w-[55%] bg-white rounded-xl shadow-sm p-4" ref={printRef}>
                            <div ref={logoRef} className="hidden mb-5">
                                <Logo/>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold text-gray-600">Monthly Monetary Donation Trend</h2>
                                <button onClick={handlePrint} className="text-[11px] bg-gray-100 hover:bg-gray-200 rounded px-3 py-1.5 print-mode" ref={printBtnRef}>Print</button>
                            </div>
                            <div className="overflow-x-auto rounded-md">
                                <table className="min-w-full table-auto text-sm">
                                    <thead className="bg-blue-400 text-white text-xs">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold align-middle">Month</th>
                                            <th className="px-4 py-2 text-left font-semibold align-middle">Year</th>
                                            <th className="px-4 py-2 text-left font-semibold align-middle">Total</th>
                                            <th className="px-4 py-2 text-left font-semibold align-middle">No. of Donations</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {cashDonationSummary?.monthlyTrend && cashDonationSummary?.monthlyTrend.map((item, index) => (
                                        <tr key={index} className=" border-gray-100 even:bg-gray-50">
                                            <td className="px-4 py-2 text-xs text-gray-500 align-middle">{item.month}</td>
                                            <td className="px-4 py-2 text-xs text-gray-500 align-middle">{item.year}</td>
                                            <td className="px-4 py-2 text-xs text-blue-600 align-middle">₱{item.totalAmount}</td>
                                            <td className="px-4 py-2 text-xs text-gray-500 align-middle">{item.numberOfDonations}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="w-[45%] flex flex-col gap-4">
                            <div className="w-full bg-white rounded-xl shadow-sm p-4" ref={print1Ref}>
                                <div ref={logo1Ref} className="hidden mb-5">
                                    <Logo/>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-gray-600">Yearly Monetary Donation Comparison</h2>
                                    <button onClick={handlePrint1} className="text-[11px] bg-gray-100 hover:bg-gray-200 rounded px-3 py-1.5 print-mode" ref={print1BtnRef}>Print</button>
                                </div>
                                <div className="overflow-x-auto rounded-md">
                                    <table className="min-w-full table-auto text-sm">
                                        <thead className="bg-purple-400 text-white ">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs">Year</th>
                                            <th className="px-4 py-2 text-left text-xs">Cash</th>
                                            <th className="px-4 py-2 text-left text-xs">GCash </th>
                                            <th className="px-4 py-2 text-left text-xs">Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {cashDonationSummary?.yearlyComparison && cashDonationSummary?.yearlyComparison.map((item, index) => (
                                            <tr key={index} className=" border-gray-100 even:bg-gray-50">
                                            <td className="px-4 py-2 text-xs">{item.year}</td>
                                            <td className="px-4 py-2 text-left text-xs">₱{item.cash}</td>
                                            <td className="px-4 py-2 text-left text-xs">₱{item.gcash}</td>
                                            <td className="px-4 py-2 text-left text-xs font-medium">₱{item.total}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="w-full bg-white rounded-xl shadow-sm p-4" ref={print2Ref}>
                                <div ref={logo2Ref} className="hidden mb-5">
                                    <Logo/>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-gray-600">Monthly Goods Donation Trend</h2>
                                    <button onClick={handlePrint2} className="text-[11px] bg-gray-100 hover:bg-gray-200 rounded px-3 py-1.5 print-mode" ref={print2BtnRef}>Print</button>
                                </div>
                                <div className="overflow-x-auto rounded-md">
                                    <table className="min-w-full table-auto text-sm">
                                        <thead className="bg-green-400 text-white text-xs">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-semibold">Month</th>
                                                <th className="px-4 py-2 text-left font-semibold">Year</th>
                                                <th className="px-4 py-2 text-left font-semibold">Type</th>
                                                <th className="px-4 py-2 text-left font-semibold">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {cashDonationSummary?.goodsMonthlyTrend && cashDonationSummary?.goodsMonthlyTrend.map((item, index) => (
                                            <tr key={index} className=" border-gray-100 even:bg-gray-50">
                                                <td className="px-4 py-2 text-xs text-gray-500">{item.month}</td>
                                                <td className="px-4 py-2 text-xs text-gray-500">{item.year}</td>
                                                <td className="px-4 py-2 text-xs text-blue-600">
                                                    {item.type.map((type, idx) => (
                                                        <span key={idx} className={`inline-block ${type === 'food' ? 'text-green-500 bg-green-50' : type === 'clothes' ? 'text-blue-500 bg-blue-50': 'text-pink-500 bg-pink-50'} p-1.5 py-1 rounded text-[9px] mr-1 my-1`}>
                                                            {type}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-500">{item.count}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Admin>
    )
}

export default Dashboard;