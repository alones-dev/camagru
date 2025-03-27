"use client"

import React, {useState, useEffect} from 'react'
import ChangePassword from '@/app/components/ChangePassword'
import Footer from '@/app/components/Footer'
import { useSearchParams } from 'next/navigation';
import Notification from '@/app/components/Notification';
import { AnimatePresence } from 'framer-motion';

const page = () => {
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<{ error: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!searchParams) return;

    if (searchParams.get("updated") === "false") {
        setNotification({error: true, text: "Password update failed"});
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
        <ChangePassword />
        <Footer />
    </div>
  )
}

export default page