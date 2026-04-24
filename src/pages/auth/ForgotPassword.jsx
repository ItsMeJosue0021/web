import { useState } from "react";
import { Link } from "react-router-dom";
import Guest from "../../layouts/Guest";
import Logo from "../../components/Logo";
import { _post } from "../../api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const response = await _post("/forgot-password", { email });
            setSuccess(response.data.message);
        } catch (err) {
            const message = err?.response?.data?.message || "Unable to send reset link right now.";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Guest>
            <section className="w-screen bg-gray-50">
                <div className="mx-auto flex h-screen flex-col items-center justify-center p-4 lg:py-0">
                    <div className="w-full rounded-lg bg-gary-50 md:w-[360px] md:border md:bg-white xl:p-0">
                        <div className="space-y-4 px-6 py-5 text-sm">
                            <Logo />

                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Forgot your password?</h1>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    Enter your email address and we will send you a password reset link.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-900">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-[12px] text-gray-900"
                                        placeholder="sample@email.com"
                                        required
                                    />
                                </div>

                                {error && <p className="text-xs text-red-500">{error}</p>}
                                {success && <p className="text-xs text-green-600">{success}</p>}

                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full rounded bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
                                >
                                    {submitting ? "Sending reset link..." : "Send Reset Link"}
                                </button>
                            </form>

                            <p className="text-[10px] font-light text-gray-500">
                                Remembered your password?{" "}
                                <Link to="/login" className="font-medium text-primary-600 hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </Guest>
    );
};

export default ForgotPassword;
