import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Guest from "../../layouts/Guest";
import Logo from "../../components/Logo";
import { _post } from "../../api";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
    const queryEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);

    const [form, setForm] = useState({
        email: queryEmail,
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setError("This password reset link is invalid or incomplete.");
            return;
        }

        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const response = await _post("/reset-password", {
                email: form.email,
                token,
                password: form.password,
                password_confirmation: form.password_confirmation,
            });

            setSuccess(response.data.message);
            setTimeout(() => navigate("/login"), 1800);
        } catch (err) {
            const validationErrors = err?.response?.data?.errors;
            const firstValidationError = validationErrors
                ? Object.values(validationErrors)?.[0]?.[0]
                : null;

            setError(firstValidationError || err?.response?.data?.message || "Unable to reset password.");
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
                                <h1 className="text-lg font-semibold text-gray-900">Reset password</h1>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    Enter your new password below to finish resetting your account.
                                </p>
                            </div>

                            {!token && (
                                <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                                    This password reset link is invalid or missing its token.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-900">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="block w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-[12px] text-gray-900"
                                        placeholder="sample@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-medium text-gray-900">New Password</label>
                                    <div className="relative flex items-center">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-[12px] text-gray-900"
                                            placeholder="Enter new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-medium text-gray-900">Confirm Password</label>
                                    <div className="relative flex items-center">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            value={form.password_confirmation}
                                            onChange={handleChange}
                                            className="w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-[12px] text-gray-900"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {error && <p className="text-xs text-red-500">{error}</p>}
                                {success && <p className="text-xs text-green-600">{success}</p>}

                                <button
                                    disabled={submitting || !token}
                                    type="submit"
                                    className="w-full rounded bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
                                >
                                    {submitting ? "Resetting password..." : "Reset Password"}
                                </button>
                            </form>

                            <p className="text-[10px] font-light text-gray-500">
                                Back to{" "}
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

export default ResetPassword;
