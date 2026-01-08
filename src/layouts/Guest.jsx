import Header from '../components/headers/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Guest = ({children}) => {
  return (
    <div className="bg-gray-50 w-full h-auto min-h-screen text-gray-700 overflow-x-hidden">
      <ToastContainer />
      <Header />
      {children}
    </div>
  );
}

export default Guest;
