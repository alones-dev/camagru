"use client"

import React, {useState, useEffect} from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Notification from './Notification';
import { AnimatePresence } from 'framer-motion';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState<{ error: boolean; text: string } | null>(null);

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

    const router = useRouter();
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const form = new FormData(e.target as HTMLFormElement);
        
        const body = JSON.stringify({
            username: form.get("username"),
            password: form.get("password"),
            email: form.get("email")
        });

        console.log("Request body:", body);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        const data = await res.json();

        if (!data.user) {
            setNotification({error: true, text: data.message || "An error occurred during registration"});
            return;
        }

        router.push("/?registered=true");
    }

  return (
    <div className="w-screen h-screen bg-pink-50 flex flex-col justify-center items-center">
        <AnimatePresence>
                {notification && (
                    <Notification error={notification.error} text={notification.text} />
                )}
        </AnimatePresence>

        <img src="/logo.png" alt="logo" className='w-1/5 -mt-16'/>
        <form className="w-1/4 bg-gray-50 px-8 py-4 rounded-xl -mt-8 shadow-md" onSubmit={handleSubmit}>
            <div className="mt-5 font-exo">
                <label className="block">Username</label>
                <input type="text" id="username" name="username" required className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
            </div>
            <div className="mt-5 font-exo">
                <label className="block">Email adress</label>
                <input type="text" id="email" name="email" required className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
            </div>
            <div className="mt-5 font-exo relative">
                <label className="block">Password</label>
                <input
                    type={showPassword ? "text" : "password"} 
                    id="password"
                    name="password"
                    required
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
            <div className="mt-5 text-center">
                <a href="/" className="text-pink-500 hover:text-pink-600 font-exo">Already register?</a>
            </div>
            <div className="mt-5">
                <button className="w-full font-exo cursor-pointer bg-violet-500 text-white rounded-lg p-2 hover:bg-violet-600 transition duration-300">Register</button>
            </div>
        </form>
    </div>
  )
}

export default Register