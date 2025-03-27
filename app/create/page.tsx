import React from 'react'
import Footer from '../components/Footer'
import Create from '../components/Create'
import LastPictures from '../components/LastPictures'

const page = () => {
  return (
    <div className="bg-pink-50 w-screen h-screen flex flex-col">
        <div className="flex w-full h-screen p-6 gap-6">
          <Create />
          <LastPictures />
        </div>
        <Footer />
    </div>
  )
}

export default page