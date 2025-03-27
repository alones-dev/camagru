"use client"

import { on } from 'events';
import React from 'react';
import { FaTimes, FaShare, FaTrash } from 'react-icons/fa';

interface PostProps {
    image: string;
    onClose: () => void;
    onPost: () => void;
}

const Post = ({ image, onClose, onPost }: PostProps) => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div 
                className='absolute inset-0 backdrop-blur-xl'
                onClick={onClose}
            />
            
            <div className='relative bg-gray-50 rounded-xl p-6 w-full max-w-md mx-4 shadow-lg'>
                <button 
                    className='absolute top-4 right-4 text-pink-500 hover:text-pink-700 cursor-pointer'
                    onClick={onClose}
                >
                    <FaTimes size={20} />
                </button>
                
                <div className='mb-6 mt-4 rounded-lg overflow-hidden'>
                    {image && (
                        <img 
                            src={image} 
                            alt="Captured" 
                            className='w-full h-auto object-cover rounded-lg'
                        />
                    )}
                </div>
                
                <div className='flex justify-center gap-4'>
                    <button 
                        className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all'
                        onClick={onClose}
                    >
                        <FaTrash />
                        Delete
                    </button>
                    <button 
                        className='flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all'
                        onClick={onPost}
                    >
                        <FaShare />
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Post;