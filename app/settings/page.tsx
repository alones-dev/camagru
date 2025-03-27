"use client"

import React, {useEffect, useState} from 'react'
import Settings from '../components/Settings'
import Footer from '../components/Footer'
import { useSearchParams } from 'next/navigation';
import Notification from '../components/Notification';
import { AnimatePresence } from 'framer-motion';

const page = () => {
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<{ error: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!searchParams) return;

    if (searchParams.get("updated") === "true") {
        setNotification({error: false, text: "User infos updated successfully"});
    }
    else if (searchParams.get("updated") === "false") {
        setNotification({error: true, text: "An error occurred during user infos update"});
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

  return (
    <div className='bg-pink-50 w-screen h-screen flex flex-col justify-center items-center overflow-hidden'>
        <AnimatePresence>
                {notification && (
                    <Notification error={notification.error} text={notification.text} />
                )}
        </AnimatePresence>
        <Settings />
        <Footer />
    </div>
  )
}

export default page