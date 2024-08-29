import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { zodResolver } from "@hookform/resolvers/zod"
  import { useForm } from "react-hook-form"
  import { z } from "zod"
  
  import { Button } from "@/components/ui/button"
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import toast from "react-hot-toast";
import { useAsyncMutation } from "@/hooks/hooks";
import { useVerifyUserMutation } from "@/redux/api/api";
import { useDispatch } from "react-redux";
  
 
const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})


const OtpDialog = ({ verfied }) => {

    const [openDialog, setOpenDialog] = useState(verfied)

    const [verifyUser, isLoading, userData] = useAsyncMutation(useVerifyUserMutation)

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          otp: "",
        },
      })
    
      const onSubmit = async(data) =>{
        await verifyUser("Verfying OTP...", {data: data})
    }

    useEffect(()=>{
        if(userData?.user?.verified){
            setOpenDialog(true)
        }
    },[verifyUser])

  return (
    <Dialog open={!openDialog}>
      <DialogContent className="h-1/2">
        <DialogHeader>
          <DialogTitle className="mb-10 text-2xl">Verify Your Account</DialogTitle>
          <DialogDescription>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center w-full flex-col items-center gap-10">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.<span className="text-red-500"> If you didn't receive the code, please check your email inbox and <b>spam</b> folder.</span> 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
    <Button type="submit" className="w-1/2">Verify</Button>
        </form>
    </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialog;
