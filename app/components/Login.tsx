"use client"

import React, {FormEvent, useState, useEffect} from 'react'
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Notification from './Notification';
import { AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState<{ error: boolean; text: string } | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!searchParams) return;

        if (searchParams.get("registered")) {
            setNotification({error: false, text: "Registration successful! You can now login."});
        }
        if (searchParams.get("updated") === "true") {
            setNotification({error: false, text: "Password updated successfully! Please login again."});
        }
    }, [searchParams])

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000); 

            return () => clearTimeout(timer); 
        }
    }, [notification]);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const form = new FormData(e.target as HTMLFormElement);
        const body = JSON.stringify({
            username: form.get("username"),
            password: form.get("password"),
        });

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        const data = await res.json();
        if (!data.user) {
            setNotification({error: true, text: data.message || "An error occurred during login"});
            return;
        }

        await signIn(
            "credentials",
            {
                username: data.user.username,
                password: form.get("password"),
                callbackUrl: "/home"
            },
        );
    }

  return (
    <div className="w-screen h-screen bg-pink-50 flex flex-col justify-center items-center overflow-hidden">
        <AnimatePresence>
                {notification && (
                    <Notification error={notification.error} text={notification.text} />
                )}
        </AnimatePresence>

        <img src="/logo.png" alt="logo" className='w-1/5 -mt-16'/>
        <form className="w-1/4 bg-gray-50 px-8 py-4 rounded-xl -mt-8 shadow-md" onSubmit={handleSubmit}>
            <div className="mt-5 font-exo">
                <label className="block">Username</label>
                <input type="text" name="username" id="username" className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
            </div>
            <div className="mt-5 font-exo relative">
                <label className="block">Password</label>
                <input
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    id="password"
                    className="w-full border border-gray-300 bg-white rounded-lg p-2 pr-10 focus:outline-none focus:ring-violet-500 focus:border-violet-500" 
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
                <button className="w-full cursor-pointer font-exo bg-pink-500 text-white rounded-lg p-2 hover:bg-pink-600 transition duration-300">Login</button>
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