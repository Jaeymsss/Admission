import React from 'react'
import Sidebar from '../../../components/Sidebar'

const Dashboard = () => {
  return (
    <div className='flex gap-6 bg-[#F4F4F4]'>
      <Sidebar/>
      <div className='m-3 text-xl text-gray-900 font-semibold'></div>
    </div>
  )
}

export default Dashboard