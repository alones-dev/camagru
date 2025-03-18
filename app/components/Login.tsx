"use client"

import React, {useState} from 'react'
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

  return (
    <div className="w-screen h-screen bg-pink-50 flex flex-col justify-center items-center overflow-hidden">
        <img src="/logo.png" alt="logo" className='w-1/5 -mt-16'/>
        <form className="w-1/4 bg-gray-50 px-8 py-4 rounded-xl -mt-8 shadow-md">
            <div className="mt-5 font-exo">
                <label className="block">Username</label>
                <input type="text" className="w-full border border-gray-300 bg-white rounded-lg p-2" />
            </div>
            <div className="mt-5 font-exo relative">
                <label className="block">Password</label>
                <input
                    type={showPassword ? "text" : "password"} 
                    className="w-full border border-gray-300 bg-white rounded-lg p-2 pr-10" 
                />
                <button
                    type="button" 
                    onClick={handleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer mt-7"
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            <div className="mt-5">
                <button className="w-full font-exo bg-pink-500 text-white rounded-lg p-2 hover:bg-pink-600 transition duration-300">Login</button>
            </div>
            <div className="mt-5 text-center">
                <a href="#" className="text-pink-500 hover:text-pink-600 font-exo">Forgot password?</a>
            </div>
            <div className='mt-5 bg-gray-300 p-[0.5px] rounded-lg'></div>
            <div className="mt-5">
                <Link href="/register" className="w-full font-exo bg-violet-500 text-white rounded-lg p-2 hover:bg-violet-600 transition duration-300 block text-center">
                    Register
                </Link>
            </div>
        </form>
    </div>
  )
}

export default Login