import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../AuthProvider";
import Guest from "../../layouts/Guest";

import banner from "../../assets/img/banner.png";
import activity1 from "../../assets/img/activity1.png";
import activity2 from "../../assets/img/activity2.png";

const images = [
    {
        src: banner,
        quote: "Think of giving not as a duty, but as a privilege.",
        alt: "Volunteers gathered during a community program",
    },
    {
        src: activity1,
        quote: "Lose yourself in the service of others.",
        alt: "Community volunteers assisting in an activity",
    },
    {
        src: activity2,
        quote: "No act of kindness, no matter how small, is ever wasted.",
        alt: "Volunteers smiling during an outreach event",
    },
];

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const activeSlide = images[currentIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await login(credentials, navigate);

            if (!response) {
                setError("Invalid credentials");
            }
        } catch (loginError) {
            setError("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <Guest>
            <section className="relative min-h-screen overflow-y-auto bg-white pt-16 lg:h-screen lg:overflow-hidden lg:pt-0">
                <div className="relative flex min-h-screen w-full flex-col bg-white lg:h-full lg:min-h-0 lg:flex-row lg:overflow-hidden">
                    <aside className="relative hidden h-full lg:flex lg:w-1/2">
                        <img
                            src={activeSlide.src}
                            alt={activeSlide.alt}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/78 to-orange-700/55" />

                        <div className="relative z-10 flex h-full flex-col justify-between px-10 pb-8 pt-24 text-white xl:px-12 xl:pb-10">
                            <div className="max-w-md space-y-5">
                                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-white/85 backdrop-blur-sm">
                                    KNK Community
                                </span>
                                <div className="space-y-3">
                                    <h1 className="text-3xl font-semibold leading-tight xl:text-[40px]">
                                        Welcome back to the community portal.
                                    </h1>
                                    <p className="max-w-md text-sm leading-6 text-white/78">
                                        Sign in to manage your profile, review project activity, and stay
                                        connected to ongoing outreach work.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                                        Volunteer updates
                                    </span>
                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                                        Event access
                                    </span>
                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                                        Secure sign in
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-[20px] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">
                                        Featured Reflection
                                    </p>
                                    <p className="mt-3 text-[28px] font-semibold leading-snug">
                                        "{activeSlide.quote}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={prevSlide}
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                                            aria-label="Previous slide"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextSlide}
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                                            aria-label="Next slide"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {images.map((image, index) => (
                                            <button
                                                key={image.quote}
                                                type="button"
                                                onClick={() => setCurrentIndex(index)}
                                                aria-label={`View slide ${index + 1}`}
                                                className={`h-2.5 rounded-full transition-all ${
                                                    index === currentIndex
                                                        ? "w-10 bg-white"
                                                        : "w-2.5 bg-white/40"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex w-full flex-col bg-white lg:h-full lg:w-1/2 lg:border-l lg:border-gray-200">
                        <div className="relative h-48 overflow-hidden sm:h-56 lg:hidden">
                            <img
                                src={activeSlide.src}
                                alt={activeSlide.alt}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                            <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white sm:p-6">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">
                                    Featured Reflection
                                </p>
                                <p className="mt-2 max-w-sm text-lg font-semibold leading-snug sm:text-xl">
                                    "{activeSlide.quote}"
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col px-4 pb-6 pt-5 sm:px-8 lg:h-full lg:overflow-hidden lg:px-10 lg:pb-6 lg:pt-10">
                            <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-600">
                                            Welcome Back
                                        </p>
                                        <h2 className="text-lg font-semibold text-gray-900 sm:text-2xl lg:text-[26px]">
                                            Sign in to your account
                                        </h2>
                                        <p className="max-w-xl text-[13px] leading-5 text-gray-500">
                                            Access your volunteer account, project updates, and community
                                            activity in one place.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-4 flex flex-1 flex-col gap-4 lg:min-h-0 lg:justify-between"
                            >
                                <div className="bg-white py-4 sm:py-5">
                                    <div className="flex flex-col gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:items-end sm:justify-between">
                                        <p className="max-w-md text-[13px] leading-5 text-gray-500">
                                            Use your registered email address and password to continue.
                                        </p>
                                    </div>

                                    <div className="mt-4 grid gap-3">
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="mb-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500"
                                            >
                                                Email
                                            </label>
                                            <div className="w-full rounded-md border border-gray-100 bg-white transition-colors hover:border-orange-500 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100/80">
                                                <input
                                                    onChange={handleChange}
                                                    value={credentials.email}
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    autoComplete="email"
                                                    className="w-full border-0 bg-transparent px-3 py-2.5 text-xs text-gray-900 outline-none placeholder:text-xs"
                                                    placeholder="sample@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-1 flex items-center justify-between gap-3">
                                                <label
                                                    htmlFor="password"
                                                    className="block text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500"
                                                >
                                                    Password
                                                </label>
                                                <Link
                                                    to="/forgot-password"
                                                    className="text-[11px] font-medium text-orange-600 hover:underline"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>

                                            <div className="relative w-full rounded-md border border-gray-100 bg-white transition-colors hover:border-orange-500 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100/80">
                                                <input
                                                    onChange={handleChange}
                                                    value={credentials.password}
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    id="password"
                                                    autoComplete="current-password"
                                                    className="w-full border-0 bg-transparent px-3 py-2.5 pr-11 text-xs text-gray-900 outline-none placeholder:text-xs"
                                                    placeholder="Enter your password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-900"
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff size={16} />
                                                    ) : (
                                                        <Eye size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {error && <p className="text-xs text-red-500">{error}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-[11px] text-gray-500">
                                        Don&apos;t have an account yet?{" "}
                                        <Link to="/register" className="font-medium text-orange-600 hover:underline">
                                            Sign up
                                        </Link>
                                    </p>

                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-md bg-orange-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
                                    >
                                        {submitting ? "Signing in..." : "Sign in"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Guest>
    );
};

export default Login;
