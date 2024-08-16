import AppLayout from '@/components/layout/AppLayout'
import Profile from '@/components/specific/Profile';
import React from 'react'
import { useSelector } from 'react-redux';

const Home = () => {

  return (
    <div>
      <h5 className='text-xl p-8 text-center'>Select a Person to Chat</h5>
    </div>
  )
}

export default AppLayout()(Home);
