"use client"

import { useFileHandler } from '6pp';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from '@/components/ui/password-input';
import { server } from '@/constants/config';
import { userExists } from '@/redux/reducers/auth';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { AtSign, CameraIcon, MessageSquareTextIcon, UserCircle, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(6, { message: "Username must be at least 6 characters." }),
  password: z.string().min(6, { message: "Password must be at least 8 characters." }),
  name: z.string().optional(),
  bio: z.string().optional()
});

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const avatar = useFileHandler("single");
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      bio: "",
    },
  });

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const handleLogin = async (data) => {
    const toastId = toast.loading("Logging In...");
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(`${server}/api/v1/user/login`, data, config);
      dispatch(userExists(response.data.user));
      toast.success(response.data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginHandler = (e) => {
    e.preventDefault();
    toggleLogin();
  }

  const handleSignup = async (data) => {
    if (!avatar.file) {
      toast.error("Avatar is required.");
      return;
    }

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", data.name);
    formData.append("bio", data.bio);
    formData.append("username", data.username);
    formData.append("password", data.password);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.post(`${server}/api/v1/user/new`, formData, config);
      dispatch(userExists(response.data.user));
      toast.success(response.data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-blue-500">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(isLogin ? handleLogin : handleSignup)}
          className={"flex flex-col justify-center items-center md:w-2/6 shadow-2xl p-16 border rounded-xl dark:bg-neutral-800 dark:text-white bg-slate-50 text-black"}
        >
          <h5 className="text-3xl font-bold">{isLogin ? "Login" : "SignUp"}</h5>

          {!isLogin && (
            <>
              <div className="flex flex-col items-center justify-center relative">
                {avatar.preview ? (
                  <img className="h-[10rem] w-[10rem] rounded-full object-cover" src={avatar.preview} alt="Avatar Preview" />
                ) : (
                  <UserCircle className="h-[8rem] w-[8rem]" />
                )}
                <Button
                  className="absolute bottom-0 right-0 bg-slate-300 rounded-full bg-opacity-80 px-2 cursor-pointer hover:bg-gray-300"
                  variant="icon"
                >
                  <CameraIcon className="font-bold" />
                  <input
                    className="cursor-pointer border-none h-[1px] p-[10px] overflow-hidden whitespace-nowrap w-[1px] absolute opacity-0"
                    id="picture"
                    type="file"
                    onChange={avatar.changeHandler}
                  />
                </Button>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} suffix={<UserRound/>}/>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="Bio" {...field} suffix={<MessageSquareTextIcon/>}/>
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} suffix={<AtSign/>}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="md:w-2/5 w-3/4 rounded-full mt-10 mb-1" disabled={isLoading}>
            {isLogin ? "Login" : "SignUp"}
          </Button>

          <p>Or</p>
          <Button
            className="rounded-full md:w-2/5 w-3/4 border-2 border-[#7b39ed] mt-1 text-[#7b39ed] font-bold dark:bg-neutral-800"
            variant="outline"
            onClick={toggleLoginHandler}
            disabled={isLoading}
          >
            {isLogin ? "SignUp" : "Back To Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
