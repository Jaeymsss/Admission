import axios from 'axios';
import { useEffect, useState } from 'react';
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { FiCheck } from "react-icons/fi";
import { Link, useNavigate, useParams } from 'react-router-dom';
import image from '../assets/404.svg';

const Verification = () => {
    const [loading, setLoading] = useState(true);
    const [verifyStatus, setVerifyStatus] = useState(null);
    const { token, id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            if (!token || !id) {
                setLoading(false);
                setTimeout(() => {
                    navigate('/');
                }, 10000);
                return;
            }
    
            try {
                setTimeout(async () => {
                    const response = await axios.get(`/api/application/verify/${token}/${id}`);
                    const data = response.data;

                    setVerifyStatus(data);
                    setLoading(false);
                    if (data && data.success) {
                        console.log('Verification success');
                    } else {
                        console.log('Verification failed');
                        setTimeout(() => {
                            navigate('/');
                        }, 3000);
                    }
                }, 1500);
            } catch (e) {
                setVerifyStatus({ success: false, message: 'Error verifying token.' });
                setLoading(false);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        };
    
        verifyToken(); 
    }, [id, token, navigate]);

    return (
        <div className='bg-[#2a2d3e] overflow-y-hidden w-full h-screen flex justify-center items-center'>
            {loading ? (
                <LoadingComponent />
            ) : verifyStatus && verifyStatus.success ? (
                <VerifiedComponent />
            ) : (
                <ErrorComponent />
            )}
        </div>
    )
}

const LoadingComponent = () => (
    <div className='flex items-center justify-center text-gray-600'>
        <CgSpinnerTwoAlt className='animate-spin h-10 w-10 text-white' />
    </div>
);

const VerifiedComponent = () => (
    <div className='flex flex-col items-center shadow rounded-xl bg-[#212332] px-60 py-20'>
        <div className='w-28 h-28 rounded-full flex items-center justify-center bg-[#3B82F6] text-white'>
            <FiCheck size={70} />
        </div>
        <h1 className='text-2xl font-bold mt-10 mb-2 select-none text-white'>Verified!</h1>
        <p className='font-medium text-base text-white mb-10 select-none'>You have successfully verified account.</p>
        <Link to='/' className='btn bg-blue-500 hover:bg-blue-400 text-sm text-white rounded-md border-none shadow capitalize px-5'>Home Page</Link>
    </div>
);

const ErrorComponent = () => (
    <div className='flex flex-col items-center'>
        <img className='object-cover object-center object' src={image} alt='Error' />
    </div>
);

export default Verification
