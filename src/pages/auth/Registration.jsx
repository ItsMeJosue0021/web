// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../AuthProvider";
// import Guest from "../../layouts/Guest";
// import { _post } from "../../api";
// import { toast } from 'react-toastify';
// import { Link } from "react-router-dom";
// import Logo from "../../components/Logo";

// const Registration = () => {
//     const navigate = useNavigate();
//     const { register } = useContext(AuthContext); 
//     const [credentials, setCredentials] = useState({
//         email: "",
//         name: "",
//         password: "",
//         confirmPassword: "",
//     });
//     const [error, setError] = useState("");
//     const [errors, setErrors] = useState({});
//     const [submitting, setSubmitting] = useState(false);

//     const handleChange = (e) => {
//         setCredentials({ ...credentials, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");

//         if (credentials.password !== credentials.confirmPassword) {
//             setError("Passwords do not match.");
//             return;
//         }

//         setSubmitting(true);
//         try {
//             const response = await _post('/register', credentials);
//             toast.success("Registration successful. Please login.");
//             setTimeout(() => {}, 3000);
//             navigate("/login"); 
//         } catch (err) {
//             setErrors(err.response?.data?.errors || {});
//             toast.error("Registration failed. Please try again.");
//         } finally {
//             setSubmitting(false);
//             toast.error("Registration failed. Please try again.");
//         }
//     };

//     return (
//         <Guest>
//             <section className="w-screen bg-gray-50 dark:bg-gray-900 pt-20">
//                 <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
//                     <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//                         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//                             <Logo/>
//                             <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
//                                 <div>
//                                     <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                         Name
//                                     </label>
//                                     <input
//                                         onChange={handleChange}
//                                         value={credentials.name}
//                                         type="text"
//                                         name="name"
//                                         className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                         placeholder="Enter your name"
//                                         required
//                                     />
//                                     {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

//                                 </div>
//                                 <div>
//                                     <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                         Your email
//                                     </label>
//                                     <input
//                                         onChange={handleChange}
//                                         value={credentials.email}
//                                         type="email"
//                                         name="email"
//                                         className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                         placeholder="sample@email.com"
//                                         required
//                                     />
//                                     {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                         Password
//                                     </label>
//                                     <input
//                                         onChange={handleChange}
//                                         value={credentials.password}
//                                         type="password"
//                                         name="password"
//                                         className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                         placeholder="••••••••"
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                         Confirm Password
//                                     </label>
//                                     <input
//                                         onChange={handleChange}
//                                         value={credentials.confirmPassword}
//                                         type="password"
//                                         name="confirmPassword"
//                                         className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                         placeholder="••••••••"
//                                         required
//                                     />
//                                     {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
//                                 </div>
//                                 <button
//                                     disabled={submitting}
//                                     type="submit"
//                                     className="w-full text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//                                 >
//                                     {submitting ? "Signing up..." : "Sign up"}
//                                 </button>
//                                 <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//                                     Already have an account?{" "}
//                                     <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
//                                         Login here
//                                     </Link>
//                                 </p>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </Guest>
//     );
// };

// export default Registration;

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import Guest from "../../layouts/Guest";
import { _post } from "../../api";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import TextInput from "../../components/inputs/TextInput";

const Registration = () => {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [credentials, setCredentials] = useState({
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
    });
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (credentials.password !== credentials.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setSubmitting(true);
        try {
            await _post('/register', credentials);
            toast.success("Registration successful. Please login.");
            navigate("/login");
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error("Registration failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Guest>
            <div className="w-full min-h-screen h-auto flex items-center justify-center p-5">
                <div className="w-full md:w-4/6 min-h-[570px] h-auto shadow-sm rounded-xl flex items-start gap-4 bg-white">
                    <div className="hidden lg:block w-[45%] h-full bg-orange-500">
                        <div className="w-full h-full ">
                        </div>
                    </div>
                    <div className="w-full lg:w-[55%] bg-white p-10 rounded-xl">
                        <div className="mb-4">
                            <Logo />
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {step === 1 && (
                                <div className="flex flex-col gap-5">
                                    <div className="border-l-4 border-orange-500 pl-2">
                                        <h2 className="text-base font-semibold">Personal Information</h2>
                                        <p className="text-xs">Welcome! Please fill in the details below to create your account.</p>
                                    </div>
                                    <TextInput label="First Name" type="text" placeholder="First Name" name="firstName" onChange={handleChange} required/>
                                    <TextInput label="Middle Name" type="text" placeholder="Middle Name" name="middleName" onChange={handleChange} />
                                    <TextInput label="Last Name" type="text" placeholder="Last Name" name="lastName" onChange={handleChange} required/>
                                    <TextInput label="Email Address" type="email" placeholder="sample@email.com" name="email" onChange={handleChange} required/>
                                    <TextInput label="Contact Number" type="number" placeholder="0000-000-0000" name="contactNumber" onChange={handleChange} required/>

                                    <div>
                                        <button type="button" onClick={() => setStep(2)} className="text-xs py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded w-fit">Next</button>
                                    </div>
                                    
                                </div>
                            )}
                            {step === 2 && (
                                <div className="flex flex-col gap-5">
                                    <div className="border-l-4 border-orange-500 pl-2">
                                        <h2 className="text-base font-semibold">Address</h2>
                                        <p className="text-xs">Welcome! Please fill in the details below to create your account.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <TextInput label="Block" type="text" placeholder="Block" name="block" onChange={handleChange} />
                                        <TextInput label="Lot" type="text" placeholder="Lot" name="lot" onChange={handleChange} />
                                    </div>
                                    <TextInput label="Street" type="text" placeholder="Street" name="street" onChange={handleChange} />
                                    <div className="flex items-start gap-3">
                                        <TextInput label="Subdivision" type="text" placeholder="Subdivision" name="subdivision" onChange={handleChange} />
                                        <TextInput label="Barangay" type="text" placeholder="Barangay" name="barangay" onChange={handleChange} required/>
                                    </div>
                                    <TextInput label="City/Municipality" type="text" placeholder="City/Municipality" name="city" onChange={handleChange} required/>
                                    <div className="flex items-start gap-3">
                                        <TextInput label="Province" type="text" placeholder="Province" name="province" onChange={handleChange} required/>
                                        <TextInput label="Postal Code" type="number" placeholder="Postal Code" name="code" onChange={handleChange} required/>
                                    </div>

                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setStep(1)} className="text-xs py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded w-fit">Back</button>
                                        <button type="button" onClick={() => setStep(3)} className="text-xs py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded w-fit">Next</button>
                                    </div>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="flex flex-col gap-5">
                                    <div className="border-l-4 border-orange-500 pl-2">
                                        <h2 className="text-base font-semibold">Login Credentials</h2>
                                        <p className="text-xs">Welcome! Please fill in the details below to create your account.</p>
                                    </div>
                                    <TextInput label="Username" type="text" placeholder="Username" name="username" onChange={handleChange} required/>
                                    <TextInput label="Password" type="password" placeholder="Password" name="password" onChange={handleChange} required/>
                                    <TextInput label="Confirm Password" type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} required/>

                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setStep(2)} className="text-xs py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded w-fit">Back</button>
                                        <button type="submit" className="text-xs py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded w-fit" disabled={submitting}>{submitting ? "Registering..." : "Register"}</button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </Guest>
    );
};

export default Registration;

