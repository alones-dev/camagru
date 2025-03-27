"use client"

import React, {useState} from 'react'
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const ChangePassword = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();
    if (!session) {
        return null;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!session) {
            return;
        }

        const form = new FormData(e.target as HTMLFormElement);
        const body = JSON.stringify({
            id: session.user.id,
            oldPassword: form.get("lastPassword"),
            newPassword: form.get("newPassword"),
            confirmPassword: form.get("confirmPassword"),
        });

        const res = await fetch("/api/updatePassword", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        if (res.ok) {
            await signOut({ redirect: false });
            router.push("/?updated=true");
        } else {
            router.push("/settings/changePassword?updated=false");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-1/4 bg-gray-50 px-8 py-4 rounded-xl -mt-8 shadow-md">
            <h1 className="text-2xl font-exo font-semibold text-center">Change password</h1>

            <div className="mt-5 font-exo relative">
                <label className="block text-sm font-medium text-gray-700">Last password</label>
                <div className="relative">
                    <input
                        type={showOldPassword ? "text" : "password"}
                        name="lastPassword"
                        id="lastPassword"
                        className="w-full border border-gray-300 bg-white rounded-lg p-2 pr-10 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                    />
                    <button
                        type="button"
                        className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-600"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            <div className="mt-5 font-exo relative">
                <label className="block text-sm font-medium text-gray-700">New password</label>
                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        id="newPassword"
                        className="w-full border border-gray-300 bg-white rounded-lg p-2 pr-10 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                    />
                    <button
                        type="button"
                        className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            <div className="mt-5 font-exo relative">
                <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        className="w-full border border-gray-300 bg-white rounded-lg p-2 pr-10 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                    />
                    <button
                        type="button"
                        className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            <div className="mt-5">
                <button type="submit" className="w-full cursor-pointer bg-violet-500 text-white font-exo py-2 px-4 rounded-lg hover:bg-violet-600 transition duration-300">
                    Save
                </button>
            </div>
        </form>
    )
}

export default ChangePassword