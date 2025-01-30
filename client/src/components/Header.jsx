import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import EAdmitLogo from '../assets/EAdmitLogo.svg';
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
    const location = useLocation();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="navbar px-[1.5%] xl:px-[9%] py-[.7%] bg-white bg-opacity-80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="navbar-start">
                <Link to="/">
                    <img className='w-auto h-[60px] md:h-[80px] object-contain object-center me-3' src={EAdmitLogo} alt="EAdmit Logo" />
                </Link>
            </div>

            <div className="navbar-end max-md:pr-2 max-sm:pr-1">
                {/* Desktop Menu */}
                <div className="hidden md:flex">
                    <Link to="/" className="btn btn-ghost text-lg font-semibold text-[#5D9749]">Home</Link>
                    <Link to="/about" className="btn btn-ghost text-lg font-semibold text-[#5D9749]">About</Link>
                    <div className="relative">
                        <button
                            className="btn btn-md rounded-sm text-lg font-semibold bg-[#ffd700] hover:bg-yellow-400 text-white border-none"
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                        >
                            Apply now!
                        </button>
                        {isDropdownOpen && (
                            <ul className="absolute left-[-20px] mt-2 py-2 shadow bg-[#f6f9ff] rounded-sm w-52 divide-y flex flex-col items-start">
                                <li className="w-full px-4 py-2">
                                    <Link
                                        to='/freshmen'
                                        className='rounded-sm w-full text-base font-medium hover:bg-gray-100'
                                    >
                                        Old Student
                                    </Link>
                                </li>
                                <li className="w-full px-4 py-2">
                                    <Link
                                        to='/transferee'
                                        className='rounded-sm w-full text-base font-medium hover:bg-gray-100'
                                    >
                                        Transferee
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost">
                        <GiHamburgerMenu className="text-2xl" />
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu mt-3 py-2 shadow bg-[#f6f9ff] rounded-sm w-52 divide-y">
                        <li><Link to="/" className='rounded-sm w-full mb-3 text-base font-medium'>Home</Link></li>
                        <li><Link to="/about" className='rounded-sm w-full mb-3 text-base font-medium'>About</Link></li>
                        <li>
                            <button
                                className="rounded-sm w-full mb-3 text-base font-medium bg-[#ffd700] hover:bg-yellow-400 text-white border-none outline-none"
                                onClick={() => setDropdownOpen(!isDropdownOpen)}
                            >
                                Apply now!
                            </button>
                            {isDropdownOpen && (
                                <ul className="mt-2 py-2 shadow bg-[#f6f9ff] rounded-sm w-full divide-y flex flex-col items-start" style={{ marginLeft: '-5px' }}>
                                    <li className="w-full px-4 py-2">
                                        <Link
                                            to='/freshmen'
                                            className='rounded-sm w-full text-base font-medium hover:bg-gray-100'
                                        >
                                            Old Student
                                        </Link>
                                    </li>
                                    <li className="w-full px-4 py-2">
                                        <Link
                                            to='/transferee'
                                            className='rounded-sm w-full text-base font-medium hover:bg-gray-100'
                                        >
                                            Transferee
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
