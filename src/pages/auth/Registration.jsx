import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Guest from "../../layouts/Guest";
import { _post } from "../../api";
import { toast } from "react-toastify";
import Logo from "../../components/Logo";
import TextInput from "../../components/inputs/TextInput";
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";

import banner from "../../assets/img/banner.png";
import activity1 from "../../assets/img/activity1.png";
import activity2 from "../../assets/img/activity2.png";

const initialCredentials = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    block: "",
    lot: "",
    street: "",
    subdivision: "",
    barangay: "",
    city: "",
    province: "",
    code: "",
    username: "",
    password: "",
    confirmPassword: "",
};

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

const steps = [
    {
        id: 1,
        number: "01",
        title: "Personal details",
        description: "Tell us who you are and how we can reach you.",
    },
    {
        id: 2,
        number: "02",
        title: "Address",
        description: "Add your current location details for your profile.",
    },
    {
        id: 3,
        number: "03",
        title: "Account security",
        description: "Create the credentials you will use to sign in.",
    },
];

const Field = ({
    label,
    name,
    value,
    errors,
    onChange,
    className = "",
    inputClassName = "py-2 text-[13px] placeholder:text-[13px]",
    ...props
}) => (
    <div className={className}>
        <label
            htmlFor={name}
            className="mb-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500"
        >
            {label}
        </label>
        <TextInput
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            hasError={Boolean(errors[name])}
            className={inputClassName}
            {...props}
        />
        {errors[name] && <p className="mt-1 text-[11px] text-red-500">{errors[name]}</p>}
    </div>
);

const Registration = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [credentials, setCredentials] = useState(initialCredentials);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const activeSlide = images[currentIndex];
    const activeStep = steps[step - 1];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "contactNumber" || name === "code") {
            const maxLength = name === "contactNumber" ? 11 : 4;
            const sanitizedValue = value.replace(/\D/g, "").slice(0, maxLength);

            setCredentials((prev) => ({ ...prev, [name]: sanitizedValue }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
            return;
        }

        setCredentials((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (credentials.password !== credentials.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Passwords do not match",
            }));
            return;
        }

        setSubmitting(true);

        try {
            await _post("/register", credentials);
            setSuccessAlert(true);
            setStep(1);
            setCredentials(initialCredentials);
            setErrors({});
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error("Registration failed. Please try again.");
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
            {successAlert && (
                <ConfirmationAlert
                    title="Successful Registration"
                    message="You have successfully registered. Would you like to proceed to login?"
                    isDelete={false}
                    onClose={() => setSuccessAlert(false)}
                    onConfirm={() => navigate("/login")}
                />
            )}

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
                                        Register for a cleaner, more focused volunteer experience.
                                    </h1>
                                    <p className="max-w-md text-sm leading-6 text-white/78">
                                        Create your account to join programs, receive updates, and stay
                                        connected to every act of service in one place.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                                        Volunteer access
                                    </span>
                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                                        Project updates
                                    </span>
                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                                        Secure account
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
                            <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-3">
                                    {/* <Logo /> */}
                                    <div className="space-y-1.5">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-600">
                                            Create Account
                                        </p>
                                        <h2 className="text-lg font-semibold text-gray-900 sm:text-2xl lg:text-[26px]">
                                            Register for the community portal
                                        </h2>
                                        <p className="max-w-xl text-[13px] leading-5 text-gray-500">
                                            Complete the three short steps below in one focused screen.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-4 flex flex-1 flex-col gap-4 lg:min-h-0 lg:justify-between">
                                <div className="rounded-xl  bg-white p-4 sm:p-5">
                                    <div className="flex flex-col gap-2 border-b border-gray-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                                                {activeStep.number}
                                            </p>
                                            <h3 className="mt-1 text-[15px] font-semibold text-gray-900 lg:text-[17px]">
                                                {activeStep.title}
                                            </h3>
                                        </div>
                                        <p className="max-w-md text-[13px] leading-5 text-gray-500">
                                            {activeStep.description}
                                        </p>
                                    </div>

                                    {step === 1 && (
                                        <div className="mt-4 grid gap-x-3 gap-y-3 md:grid-cols-2">
                                            <Field
                                                label="First name"
                                                name="firstName"
                                                value={credentials.firstName}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="First name"
                                                autoComplete="given-name"
                                                required
                                            />
                                            <Field
                                                label="Middle name"
                                                name="middleName"
                                                value={credentials.middleName}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Middle name"
                                                autoComplete="additional-name"
                                            />
                                            <Field
                                                label="Last name"
                                                name="lastName"
                                                value={credentials.lastName}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Last name"
                                                autoComplete="family-name"
                                                required
                                            />
                                            <Field
                                                label="Mobile number"
                                                name="contactNumber"
                                                value={credentials.contactNumber}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="09123456789"
                                                autoComplete="tel"
                                                inputMode="numeric"
                                                pattern="[0-9]{11}"
                                                maxLength={11}
                                                required
                                            />
                                            <Field
                                                label="Email address"
                                                name="email"
                                                type="email"
                                                value={credentials.email}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="sample@email.com"
                                                autoComplete="email"
                                                className="md:col-span-2"
                                                required
                                            />
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="mt-4 grid gap-x-3 gap-y-3 md:grid-cols-2">
                                            <Field
                                                label="Block"
                                                name="block"
                                                value={credentials.block}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Block"
                                                autoComplete="address-line1"
                                            />
                                            <Field
                                                label="Lot"
                                                name="lot"
                                                value={credentials.lot}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Lot"
                                            />
                                            <Field
                                                label="Street"
                                                name="street"
                                                value={credentials.street}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Street"
                                                className="md:col-span-2"
                                                autoComplete="street-address"
                                            />
                                            <Field
                                                label="Subdivision"
                                                name="subdivision"
                                                value={credentials.subdivision}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Subdivision"
                                            />
                                            <Field
                                                label="Barangay"
                                                name="barangay"
                                                value={credentials.barangay}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Barangay"
                                                required
                                            />
                                            <Field
                                                label="City / Municipality"
                                                name="city"
                                                value={credentials.city}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="City / Municipality"
                                                autoComplete="address-level2"
                                                required
                                            />
                                            <Field
                                                label="Province"
                                                name="province"
                                                value={credentials.province}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Province"
                                                autoComplete="address-level1"
                                                required
                                            />
                                            <Field
                                                label="Postal code"
                                                name="code"
                                                value={credentials.code}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="0000"
                                                inputMode="numeric"
                                                pattern="[0-9]{4}"
                                                autoComplete="postal-code"
                                                maxLength={4}
                                                required
                                            />
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="mt-4 grid gap-x-3 gap-y-3 md:grid-cols-2">
                                            <Field
                                                label="Username"
                                                name="username"
                                                value={credentials.username}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Username"
                                                className="md:col-span-2"
                                                autoComplete="username"
                                                required
                                            />
                                            <Field
                                                label="Password"
                                                name="password"
                                                type="password"
                                                value={credentials.password}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Password"
                                                autoComplete="new-password"
                                                required
                                            />
                                            <Field
                                                label="Confirm password"
                                                name="confirmPassword"
                                                type="password"
                                                value={credentials.confirmPassword}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Confirm password"
                                                autoComplete="new-password"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-[11px] text-gray-500">
                                        Already have an account?{" "}
                                        <Link to="/login" className="font-medium text-orange-600 hover:underline">
                                            Login
                                        </Link>
                                    </p>

                                    <div className="flex flex-wrap gap-3 sm:justify-end">
                                        {step > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setStep((prev) => prev - 1)}
                                                className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                                            >
                                                Back
                                            </button>
                                        )}

                                        {step < steps.length ? (
                                            <button
                                                type="button"
                                                onClick={() => setStep((prev) => prev + 1)}
                                                className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-700"
                                            >
                                                Continue
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="inline-flex items-center justify-center rounded-md bg-orange-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
                                            >
                                                {submitting ? "Registering..." : "Create account"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Guest>
    );
};

export default Registration;
