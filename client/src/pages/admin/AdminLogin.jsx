import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CameraIcon, UserCircle } from 'lucide-react';
import { useFileHandler, useInputValidation } from '6pp';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, getAdmin } from '@/redux/thunks/admin';

const AdminLogin = () => {

  const { isAdmin} = useSelector(state => state.auth)
  const dispatch = useDispatch();

    const secretKey = useInputValidation("")

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(adminLogin(secretKey.value));
    }

    useEffect(() => {
      dispatch(getAdmin());
    }, [dispatch]);

    if(isAdmin) return <Navigate to="/admin/dashboard"></Navigate>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-blue-500">
        <form className="flex flex-col justify-center items-center w-2/6 shadow-2xl p-16 border border-gray-300 rounded-xl bg-white dark:bg-neutral-900 dark:border-none" onSubmit={submitHandler}>
          <h5 className="text-3xl font-bold">Admin Login</h5>
          <input
            className="my-6 w-4/5 border border-neutral-400 dark:bg-neutral-700 dark:border-none p-2 rounded-md"
            type="password"
            placeholder="Secret Key"
            name='secretkey'
            required
            value={secretKey.value}
            onChange={secretKey.changeHandler}
          />
          <Button className="w-1/2 rounded-full my-2" type ="submit">Login</Button>
        </form>
    </div>
  )
}

export default AdminLogin
