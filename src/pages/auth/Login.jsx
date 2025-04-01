import {React, useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../AuthProvider'
import Guest from '../../layouts/Guest'
import { Link } from 'react-router-dom'
import Logo from '../../components/Logo'

const Login = () => {

    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await login(credentials, navigate);
            if (!response) {
                setError('Invalid credentials');
            }
            setSubmitting(false);

        } catch (error) {
            setError('An error occurred. Please try again.');
            setSubmitting(false);
        } 
    }


    return (
        <Guest>
             <section className="w-screen bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center p-4 mx-auto h-screen lg:py-0">
                    <div className="w-full md:w-96 bg-gary-50 md:bg-white border rounded-lg dark:border md:mt-0  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="text-sm p-6 space-y-4 md:space-y-6">
                            <Logo/>
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label className="block text-xs font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input onChange={handleChange} value={credentials.email} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="sample@email.com" required="" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-900 dark:text-white">Password</label>
                                    <input onChange={handleChange} value={credentials.password} type="password" name="password" id="password" placeholder="••••••••" className="text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                    {error && <p className='text-red-500 text-xs pt-2'>{error}</p>}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label className="text-gray-500 dark:text-gray-300 text-xs">Remember me</label>
                                        </div>
                                    </div>
                                    <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-xs">Forgot password?</a>
                                </div>
                                <button disabled={submitting} type="submit" className="w-full text-white bg-orange-600 hover:bg-orange-700  font-medium rounded text-xs px-4 py-2 text-center ">
                                    { submitting ? "Signing in.." : "Sign in"}
                                </button>
                                <p className="text-xs font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Guest>
       
    )
}

export default Login