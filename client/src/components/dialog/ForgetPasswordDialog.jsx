
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInputValidation } from '6pp'
import { PasswordInput } from '../ui/password-input'
import { useAsyncMutation } from '@/hooks/hooks'
import { useForgotPasswordMutation, useResetPasswordMutation } from '@/redux/api/api'
import toast from 'react-hot-toast'

const ForgetPasswordDialog = () => {
    
    const email = useInputValidation("");
    const [openDialog, setOpenDialog] = useState(false)
    const [open, setOpen] = useState(false);

    const [ forgetPassword, isLoading, data] = useAsyncMutation(useForgotPasswordMutation)



  const submitHandler = async () => {
    await forgetPassword("Sending OTP...", {email: email.value})  
};

useEffect(()=>{
    if(data){
        setOpenDialog(true)
        setOpen(false)
    }
}, [data])

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='text-[13px] ml-2 underline text-indigo-500 dark:text-neutral-400'>
            Forgot Password?
      </DialogTrigger>
      <DialogContent className="min-h-[15rem] max-h-[20rem] mx w-full">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <div className="gap-4 py-4 flex-col flex items-center">
            <h5 className='text-base dark:text-neutral-300'>Please enter your email address registered with your Convocube account to reset you password.</h5>
          <div className="w-full">
            <Input
            id="oldPassword"
            placeholder="Enter your email"
            className="mt-2"
            value={email.value}
            onChange={email.changeHandler}
            />
          </div>
          <Button className="w-1/2 mt-5" onClick={submitHandler} disabled={isLoading}>Send OTP</Button>
        </div>
      </DialogContent>
    </Dialog>
    <ResetPasswordDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
    </>
  )
}

const ResetPasswordDialog = ({openDialog, setOpenDialog}) =>{

    const [ resetPassword, isLoading, data] = useAsyncMutation(useResetPasswordMutation)



  const newPassword = useInputValidation("");
  const cPassword = useInputValidation("");
  const otp = useInputValidation("");


    const closeHandler = () =>{
        setOpenDialog(false)
    }

    const submitHandler = () => {
        if(cPassword.value !== newPassword.value){
            toast.error("Passwords did not match.")
            return
        }
        resetPassword("Changing Password...", {otp: otp.value, newPassword: newPassword.value})
    }

    useEffect(()=>{
        if(data){
            setOpenDialog(false)
            otp.clear()
            newPassword.clear()
            cPassword.clear()
          }
        }, [data])

    return (
        <Dialog open={openDialog} onOpenChange={closeHandler}>
          <DialogContent className="max-h-[30rem] min-h-[25rem] w-full">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
            </DialogHeader>
            <div className="w-full">
            <Label htmlFor="username" className="text-right ml-2">
              OTP
            </Label>
            <Input
            id="otp"
            placeholder="Enter OTP"
            className="mt-2"
            value={otp.value}
            onChange={otp.changeHandler}
            maxLength={6}
            />
            <h5 className='text-sm mt-2 dark:text-neutral-300'>Please enter OTP you recived in your email and New Password.</h5>
            </div>
            <div className="gap-4 flex-col flex items-center">
              <div className="w-full">
              <div>
            <Label htmlFor="username" className="text-right ml-2">
              New Password
            </Label>
            <PasswordInput
              id="newPassword"
              placeholder="Enter password"
              className="mt-2"
              value={newPassword.value}
            onChange={newPassword.changeHandler}
            />
          </div>
          <div>
            <Label htmlFor="username" className="text-right ml-2 mt-2">
              Confirm Password
            </Label>
            <PasswordInput
              id="cPassword"
              placeholder="Enter password"
              className="mt-2"
              value={cPassword.value}
            onChange={cPassword.changeHandler}
            />
          </div>
                
              </div>
              <h4 className="text-red-600 text-left text-[13px]">If you didn't receive the code, please check your email inbox and <b>spam</b> folder.</h4>
              <Button className="w-1/2 mt-2" onClick={submitHandler} disabled={isLoading || !otp.value || !newPassword.value || !cPassword.value}>Change Password</Button>
            </div>
          </DialogContent>
        </Dialog>
      )
}

export default ForgetPasswordDialog
