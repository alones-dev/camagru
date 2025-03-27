"use client"

import React, {useState} from 'react'
import { signOut, signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const Settings = () => {
    const [showPassword, setShowPassword] = useState(false); 

    const { data: session } = useSession();
    const router = useRouter();
    if (!session) {
        return null;
    }

    const handleLogout = async () => {
        await signOut({callbackUrl: '/'});
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };


    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!session) {
            return;
        }

        const form = new FormData(e.target as HTMLFormElement);
        const body = JSON.stringify({
            id: session.user.id,
            username: form.get("username"),
            email: form.get("email"),
            password: form.get("password"),
        });

        const res = await fetch("/api/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        if (res.ok) {
            const data = await res.json();

            await signOut({ redirect: false });
            await signIn("credentials", {
                username: data.user.username,
                password: form.get("password"),
                redirect: false
            });

            router.refresh();
            router.push("/settings?updated=true");
        } else {
            router.push("/settings?updated=false");
        }
    }

    return (
        <form className="w-1/4 bg-gray-50 px-8 py-4 rounded-xl -mt-8 shadow-md" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-exo font-semibold text-center">Settings</h1>
            <div className="mt-5 font-exo">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" name="username" id="username" required defaultValue={session.user?.username} className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
            </div>
            <div className="mt-5 font-exo">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="text" name="email" id="email" required defaultValue={session.user?.email || ""} className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
            </div>
            <div className="mt-5 font-exo">
            <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        id="password"
                        required
                        className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:outline-none focus:ring-violet-500 focus:border-violet-500 pr-10" // Ajoutez `pr-10` pour l'espace de l'icône
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />} 
                    </button>
                </div>
            </div>
            <div className="mt-5 text-center">
                <a href="/settings/changePassword" className="text-pink-500 hover:text-pink-600 font-exo">Change password</a>
            </div>
            <div className="mt-5">
                <button type="submit" className="w-full cursor-pointer bg-violet-500 text-white font-exo py-2 px-4 rounded-lg hover:bg-violet-600 transition duration-300">Save</button>
            </div>
                <div className='mt-5 bg-gray-300 p-[0.5px] rounded-lg'></div>
            <div className="mt-5">
                <button type="button" className="w-full cursor-pointer bg-pink-500 text-white font-exo py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-300" onClick={handleLogout}>Disconnect</button>
            </div>
        </form>
    )
}

export default Settings