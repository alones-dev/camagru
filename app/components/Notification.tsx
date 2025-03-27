import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'

interface NotificationProps {
    error: boolean,
    text: string
}

const Notification: React.FC<NotificationProps> = ({error, text}) => {
  return (
    <motion.div 
        initial={{y: -100, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        exit={{y: -100, opacity: 0}}
        transition={{ duration: 0.5 }}
        className={`absolute border-b-2 border-r-2 border-l-2 ${error ? "bg-red-400 border-red-600" : "bg-pink-400 border-pink-600"} top-0 rounded-b-xl text-white font-exo text-lg font-semibold p-2 text-center`}
    >
        {error ? "Error: " : ""} <a className="font-normal">{text}</a>
    </motion.div>
  )
}

export default Notification