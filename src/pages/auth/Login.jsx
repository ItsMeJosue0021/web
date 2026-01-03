import { useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../AuthProvider'
import Guest from '../../layouts/Guest'
import { Link } from 'react-router-dom'
import Logo from '../../components/Logo'
import { Eye, EyeOff } from "lucide-react";

const Login = () => {

    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }



    return (
        <Guest>
             <section className="w-screen bg-gray-50">
                <div className="flex flex-col items-center justify-center p-4 mx-auto h-screen lg:py-0">
                    <div className="w-full md:w-[340px] bg-gary-50 md:bg-white md:border rounded-lg  md:mt-0 xl:p-0">
                        <div className="text-sm px-6 py-4 space-y-4">
                            <Logo/>
                            <form onSubmit={handleSubmit} className="space-y-4" action="#">
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-900 ">Email</label>
                                    <input 
                                    onChange={handleChange} 
                                    value={credentials.email} 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    className="bg-transparent bg-gray-50 border border-gray-300 text-[12px] text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 " placeholder="sample@email.com" required="" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-900 ">Password</label>
                                    <div className='flex items-center relative'>
                                        <input 
                                        onChange={handleChange} 
                                        value={credentials.password} 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        id="password" 
                                        placeholder="••••••••"
                                        className="text-[12px] bg-gray-50 border border-gray-300 text-gray-900 rounded  w-full px-4 py-2" required="" />
                                        <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOff size={16} className='text-gray-500 hover:text-gray-900' /> : <Eye size={16} className='text-gray-500 hover:text-gray-900'/>}
                                        </span>
                                    </div>
                                    
                                    {error && <p className='text-red-500 text-xs pt-2'>{error}</p>}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input 
                                                id="remember" 
                                                type="checkbox" 
                                                className="appearance-none w-3 h-3 bg-white border border-gray-300 rounded checked:bg-orange-500 checked:border-orange-500 focus:ring-2 focus:ring-orange-300 cursor-pointer accent-white"
                                                style={{ accentColor: '#fff' }}
                                                required="" 
                                            />
                                        </div>
                                        <div className="ml-1 text-sm">
                                            <label className="text-gray-500 text-[10px]">Remember me</label>
                                        </div>
                                    </div>
                                    <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-[10px]">Forgot password?</a>
                                </div>
                                <button disabled={submitting} type="submit" className="w-full text-white bg-orange-600 hover:bg-orange-700  font-medium rounded text-xs px-4 py-2 text-center ">
                                    { submitting ? "Signing in.." : "Sign in"}
                                </button>
                                <p className="text-[10px] font-light text-gray-500 dark:text-gray-400">
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
