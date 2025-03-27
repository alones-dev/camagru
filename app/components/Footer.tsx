"use client"

import { useRouter } from 'next/navigation';
import React from 'react';
import { FaPlus, FaCog, FaImages } from 'react-icons/fa';

const Footer = () => {
  const router = useRouter();

  const handleRouting = () => {
    router.push('/create');
  }

  return (
    <div className="w-full bg-gray-50 fixed bottom-0 left-0 right-0 shadow-[0_-2px_10px_-2px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between relative">
        <div className="flex items-center">
          <a href="/home">
            <img src="/logo3.png" alt="logo" className="h-6 w-auto" /> 
          </a>
        </div>

        <div className="absolute -ml-2 left-1/2 transform -translate-x-1/2">
          <button className="p-2 cursor-pointer bg-violet-500 text-white rounded-full hover:bg-violet-600 transition duration-300" onClick={handleRouting}>
            <FaPlus size={24} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 cursor-pointer text-gray-700 hover:text-violet-500 transition duration-300">
            <FaImages size={24} /> 
          </button>
          <a href="/settings" className="p-2 cursor-pointer text-gray-700 hover:text-violet-500 transition duration-300">
            <FaCog size={24} /> 
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;