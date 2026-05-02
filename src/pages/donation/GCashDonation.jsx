import { useState } from "react";
import Guest from "../../layouts/Guest";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Check } from "lucide-react";
import { _post } from "../../api";
import CircularLoading from "../../components/CircularLoading";

const initialData = {
    name: "",
    email: "",
    amount: "",
    payment_channel: "gateway",
    payment_reference_number: "",
    proof_of_payment: null,
};

const GCashDonation = () => {
    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [qrSubmitted, setQrSubmitted] = useState(false);
    const [submittedTrackingNumber, setSubmittedTrackingNumber] = useState("");
    const sectionTitleClass = "text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold";
    const panelClass =
        "w-full rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200";
    const fieldBaseClass =
        "w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition";
    const labelClass = "w-full md:w-[40%] text-xs font-medium text-gray-700";
    const methodCardClass =
        "w-full rounded-lg border px-4 py-4 text-left transition-colors duration-200";

    const isQr = data.payment_channel === "qr";
    const isSubmitDisabled =
        data.amount.trim() === "" ||
        data.email.trim() === "" ||
        (isQr && (!data.payment_reference_number.trim() || !data.proof_of_payment));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleProofChange = (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setData((prev) => ({ ...prev, proof_of_payment: file }));
        setErrors((prev) => ({ ...prev, proof_of_payment: undefined }));
    };

    const handleChannelChange = (channel) => {
        setData((prev) => ({
            ...prev,
            payment_channel: channel,
            payment_reference_number: channel === "qr" ? prev.payment_reference_number : "",
            proof_of_payment: channel === "qr" ? prev.proof_of_payment : null,
        }));
        setErrors({});
    };

    const resetForm = () => {
        setData(initialData);
        setErrors({});
        setIsAnonymous(false);
        setLoading(false);
        setQrSubmitted(false);
        setSubmittedTrackingNumber("");
    };

    const buildPayload = () => {
        const name = isAnonymous ? "Anonymous" : data.name;

        if (isQr) {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", data.email);
            formData.append("amount", data.amount);
            formData.append("payment_channel", "qr");
            formData.append("payment_reference_number", data.payment_reference_number);
            if (data.proof_of_payment) {
                formData.append("proof_of_payment", data.proof_of_payment);
            }
            return formData;
        }

        return {
            name,
            email: data.email,
            amount: data.amount,
            payment_channel: "gateway",
        };
    };

    const handlePayment = async () => {
        setLoading(true);
        setErrors({});

        try {
            const response = await _post("/donations/gcash/save", buildPayload());

            if (isQr) {
                setSubmittedTrackingNumber(response.data?.donation?.donation_tracking_number || "");
                setQrSubmitted(true);
                return;
            }

            if (response.status === 200) {
                const source = response.data.data;
                const checkoutUrl = source.attributes.redirect.checkout_url;

                if (checkoutUrl) {
                    window.location.href = checkoutUrl;
                }
            }
        } catch (error) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Guest>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="w-full max-w-[420px] bg-white rounded-lg shadow-xl border border-gray-200/80 p-6 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
                            <img src="/gcashpng.png" alt="GCash" className="w-7 h-7 object-contain" />
                        </div>
                        <CircularLoading customClass="w-6 h-6 text-blue-600" />
                        <p className="text-lg font-semibold text-gray-800">
                            {isQr ? "Submitting QR donation" : "Connecting to GCash"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {isQr
                                ? "Please keep this window open while we submit your proof of payment."
                                : "Please keep this window open while we redirect you to payment."}
                        </p>
                    </div>
                </div>
            )}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen w-full p-4">
                <div className="w-full max-w-[1100px] mx-auto h-full flex flex-col p-2 md:px-4 pt-24">
                    {!qrSubmitted && (
                        <Link to="/donate/monetary" className="md:px-4 py-2 mb-3 rounded w-fit text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <FaArrowLeft size={14} />
                                <span>Back</span>
                            </div>
                        </Link>
                    )}
                    {!qrSubmitted && (
                        <div className="mb-4 w-full max-w-[700px] mx-auto rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                            This site is in development. Donations are not being accepted yet. Please do not submit any donation or payment at this time.
                        </div>
                    )}
                    <div className={`${panelClass} w-full max-w-[700px] mx-auto p-6 md:p-8`}>
                        {qrSubmitted ? (
                            <div className="w-full flex flex-col justify-center items-center gap-6 text-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-28 h-28 flex items-center justify-center rounded-full bg-green-100">
                                        <Check size={55} className="text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-green-700">QR Donation Submitted</h2>
                                    <p className="text-sm text-gray-600 max-w-md">
                                        Your GCash QR donation details have been submitted and are now pending admin verification.
                                    </p>
                                    {submittedTrackingNumber && (
                                        <p className="text-xs text-gray-600">
                                            Tracking number: <span className="font-semibold text-gray-800">{submittedTrackingNumber}</span>
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 max-w-md">
                                        We will send a thank-you email once your payment has been verified.
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-3 mt-6">
                                    <button
                                        type="button"
                                        className="px-6 py-2 text-xs rounded-md bg-orange-500 hover:bg-orange-600 text-white"
                                        onClick={resetForm}
                                    >
                                        Make Another Donation
                                    </button>

                                    <Link to="/" className="text-xs text-gray-600 hover:underline">
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-full flex flex-col items-start justify-start gap-3 mb-6">
                                    <p className={sectionTitleClass}>GCash Donation</p>
                                    <p className="text-2xl text-gray-800 font-semibold">We&apos;d love to say thank you</p>
                                    <p className="text-sm text-gray-600">Share your details so we can properly record your donation and express our gratitude.</p>
                                </div>

                                <div className="w-full flex flex-col gap-5">
                                    <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-7">
                                        <label className={labelClass}>
                                            Name <span className="text-[9px] text-gray-500">(Optional)</span>
                                        </label>
                                        <div className="w-full md:w-[60%] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                            <input
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={handleChange}
                                                className={`${fieldBaseClass} ${isAnonymous ? "bg-gray-200 cursor-not-allowed border-gray-300" : "bg-white"}`}
                                                disabled={isAnonymous}
                                            />
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    value={isAnonymous}
                                                    checked={isAnonymous}
                                                    onChange={() => setIsAnonymous(!isAnonymous)}
                                                    className="h-4 w-4 bg-white border border-gray-300 cursor-pointer accent-white"
                                                    style={{ accentColor: "#fff" }}
                                                />
                                                <span className="text-xs capitalize">Anonymous</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
                                            <label className={labelClass}>Email <span className="text-xs text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`${fieldBaseClass} md:w-[60%]`}
                                                value={data.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.email && <p className="text-[10px] text-red-500 md:ml-[40%] md:pl-4 mt-1">{errors.email[0]}</p>}
                                    </div>

                                    <div className="w-full">
                                        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
                                            <label className={labelClass}>Amount <span className="text-xs text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                name="amount"
                                                className={`${fieldBaseClass} md:w-[60%]`}
                                                value={data.amount}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.amount && <p className="text-[10px] text-red-500 md:ml-[40%] md:pl-4 mt-1">{errors.amount[0]}</p>}
                                    </div>

                                    <div className="w-full flex flex-col gap-3 pt-2">
                                        <p className="text-xs font-medium text-gray-700">Choose how you want to donate through GCash</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleChannelChange("gateway")}
                                                className={`${methodCardClass} ${!isQr ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                                            >
                                                <p className="text-sm font-semibold text-gray-800">GCash Online Payment</p>
                                                <p className="text-xs text-gray-500 mt-1">Proceed with an online GCash payment after submitting this form.</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleChannelChange("qr")}
                                                className={`${methodCardClass} ${isQr ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                                            >
                                                <p className="text-sm font-semibold text-gray-800">GCash via QR</p>
                                                <p className="text-xs text-gray-500 mt-1">Scan the QR code, then submit your proof and reference number for verification.</p>
                                            </button>
                                        </div>
                                    </div>

                                    {isQr ? (
                                        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 flex flex-col gap-4">
                                            <div className="flex flex-col lg:flex-row items-center gap-6">
                                                <div className="w-fit bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                                                    <img
                                                        src="/gcashqrcode.jpg"
                                                        alt="GCash QR code"
                                                        className="w-full max-w-[170px] h-auto object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col gap-2 text-sm text-gray-600">
                                                    <p className="text-sm font-semibold text-gray-800">Pay via GCash QR</p>
                                                    <p>Scan the QR code, complete your payment in GCash, then upload your receipt below.</p>
                                                    <p>Your donation will stay pending until the admin verifies the proof, reference number, and amount received.</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[11px] text-gray-600">Payment Reference Number <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="payment_reference_number"
                                                        value={data.payment_reference_number}
                                                        onChange={handleChange}
                                                        placeholder="Enter your payment reference number"
                                                        className={fieldBaseClass}
                                                    />
                                                    {errors.payment_reference_number && (
                                                        <span className="text-red-500 text-[11px]">{errors.payment_reference_number[0]}</span>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[11px] text-gray-600">Proof of Payment (JPG/PNG, max 5MB) <span className="text-red-500">*</span></label>
                                                    <label className="flex items-center justify-between border border-dashed border-gray-300 rounded-lg px-3 py-3 bg-white hover:bg-gray-100 cursor-pointer text-xs text-gray-600">
                                                        <span className="truncate">
                                                            {data.proof_of_payment ? data.proof_of_payment.name : "Upload receipt"}
                                                        </span>
                                                        <span className="text-blue-500 text-[11px]">Browse</span>
                                                        <input
                                                            type="file"
                                                            name="proof_of_payment"
                                                            accept=".jpg,.jpeg,.png"
                                                            className="hidden"
                                                            onChange={handleProofChange}
                                                        />
                                                    </label>
                                                    {errors.proof_of_payment && (
                                                        <span className="text-red-500 text-[11px]">{errors.proof_of_payment[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="md:pt-4 flex justify-end w-full">
                                        <button
                                            type="button"
                                            onClick={handlePayment}
                                            className={`text-xs px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0 ${isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={isSubmitDisabled}
                                        >
                                            {loading
                                                ? (isQr ? "Submitting QR Donation.." : "Connecting to GCash..")
                                                : (isQr ? "Submit QR Donation" : "Proceed to GCash Payment")}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Guest>
    );
};

export default GCashDonation;
