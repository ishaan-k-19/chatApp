
import { useFileHandler } from "6pp";
import ForgetPasswordDialog from "@/components/dialog/ForgetPasswordDialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { server } from "@/constants/config";
import { userExists } from "@/redux/reducers/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  AtSign,
  CameraIcon,
  MailIcon,
  MessageSquareTextIcon,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  name: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().optional(),
  cpassword: z.string().optional(),
});

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const defaultAvatarUrl = "/assets/user.png";

  const avatar = useFileHandler("single");
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      bio: "Hey There!",
      email: "",
      cpassword: "",
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
      const response = await axios.post(
        `${server}/api/v1/user/login`,
        data,
        config
      );
      dispatch(userExists(response.data.user));
      toast.success(response.data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginHandler = (e) => {
    e.preventDefault();
    toggleLogin();
  };

  const handleSignup = async (data) => {

    if (data.cpassword !== data.password) {
      toast.error("Passwords do not match.");
      return;
    }

    

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    const formData = new FormData();

    if (avatar.file) {
      formData.append("avatar", avatar.file);
    } else {
      const response = await fetch(defaultAvatarUrl);
      const blob = await response.blob();
      formData.append("avatar", blob, "default-avatar.jpg");
    }

    formData.append("name", data.name);
    formData.append("email", data.email);
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
      const response = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(response.data.user));
      toast.success(response.data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="flex justify-center items-center min-h-screen bg-[url('assets/bgLight.png')]  dark:bg-[url('assets/bgDark.png')] bg-center text-slate-400 bg-[length:400px_400px]">
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-violet-600 to-indigo-600  dark:bg-gradient-to-tr dark:from-violet-600 dark:via-violet-600 dark:to-indigo-900 text-slate-400 h-[100svh]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(isLogin ? handleLogin : handleSignup)}
          className={
            `flex flex-col justify-center items-center xl:gap-0 shadow-2xl px-6 xl:px-10 border rounded-xl dark:bg-neutral-800 dark:text-white bg-slate-50 text-black ${isLogin ? "py-10 md:py-14 xl:py-20 gap-3 md:w-2/5 xl:w-2/6 w-[90%]" : " py-8 xl:gap-5 md:gap-5 gap-2 md:h-[calc(100svh-4rem)] overflow-hidden md:w-[60%] xl:w-1/2 w-[90%]"}`
          }
        >
          <h5 className={`text-2xl font-bold ${isLogin ? "mb-5" : "mb-0"}`}>
            {isLogin ? "Login" : "SignUp"}
          </h5>

          {!isLogin ? (
            <>
              <div className="flex flex-col items-center justify-center relative">
                {avatar.preview ? (
                  <>
                  <img
                    className="h-[8rem] w-[8rem] rounded-full object-cover"
                    src={avatar.preview}
                    alt="Avatar Preview"
                  />
                <Button
                  className="absolute bottom-13 px-5 py-8 right-13 bg-slate-700 rounded-full bg-opacity-40 cursor-pointer hover:bg-gray-300"
                  variant="icon"
                >
                  <CameraIcon className="font-bold text-white" />
                  <input
                    className="cursor-pointer px-20 py-24 border-none h-[1px] p-[10px] overflow-hidden whitespace-nowrap w-[1px] absolute opacity-0"
                    id="picture"
                    type="file"
                    onChange={avatar.changeHandler}
                  />
                </Button>
                  
                  </>
                ) : (
                  <>
                  <img
                    className="xl:h-[8rem] xl:w-[8rem] h-[5rem] w-[5rem] rounded-full object-cover border border-neutral-500"
                    src={defaultAvatarUrl}
                    alt="Default Avatar"
                    />
                <Button
                  className="absolute bottom-13 px-[1.8rem] py-[2.5rem] xl:px-[3.3rem] xl:py-[4.1rem] right-13 bg-slate-700 rounded-full bg-opacity-40 cursor-pointer hover:bg-gray-300"
                  variant="icon"
                  >
                  <CameraIcon className="font-bold text-white" />
                  <input
                    className="cursor-pointer px-20 py-24 border-none h-[1px] p-[10px] overflow-hidden whitespace-nowrap w-[1px] absolute opacity-0"
                    id="picture"
                    type="file"
                    onChange={avatar.changeHandler}
                    />
                </Button>
                    </>
                )
                  }
              </div>
              <div className="flex md:w-[90%] gap-8 flex-col md:flex-row">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  
                  <FormItem>
                    <FormLabel className="hidden xl:block mt-[10px] mb-1">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        suffix={<UserRound size={19} />}
                        />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="hidden xl:block mt-[10px] mb-1">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        suffix={<AtSign size={19} />}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                </div>

                    <div className="flex md:w-[90%] gap-8 flex-col md:flex-row">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="hidden xl:block mt-[10px] mb-1">Bio</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bio"
                        {...field}
                        suffix={<MessageSquareTextIcon size={19} />}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden xl:block mt-[10px] mb-1">Email</FormLabel>
                <FormControl>
                  <Input
                  
                    placeholder="Email"
                    type="email"
                    {...field}
                    suffix={<MailIcon size={19} />}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          </div>
              <div className="flex md:w-[90%] gap-8 flex-col md:flex-row">

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={`${isLogin? "my-4" : "mt-0"}`}>
                  <FormLabel className="hidden xl:block mt-[10px] mb-1">Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} minLength={8}/>
                  </FormControl>
                  {isLogin && <ForgetPasswordDialog/>}
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="cpassword"
                render={({ field }) => (
                  <FormItem className={`${isLogin ? "hidden" : "block"}`}>
                    <FormLabel className="hidden xl:block mt-[10px] mb-1">
                      Confirm Password
                    </FormLabel>
                    <FormControl >
                      <PasswordInput
                        
                        placeholder="Confirm Password"
                        {...field}
                        minLength={8}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                </div>
            </>
          ) : (<>
          
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="hidden xl:block mt-[10px] mb-1">Email</FormLabel>
                <FormControl>
                  <Input
                  
                  placeholder="Email"
                  type="email"
                  {...field}
                  suffix={<MailIcon size={19} />}
                  />
                </FormControl>
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={`${isLogin? "my-4" : "mt-0"}`}>
                  <FormLabel className="hidden xl:block mt-[10px] mb-1">Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} minLength={8}/>
                  </FormControl>
                  {isLogin && <ForgetPasswordDialog/>}
                  <FormMessage />
                </FormItem>
              )}
              />
              </>
            )
            }
            
          <div className={`flex items-center gap-3 flex-col xl:flex-col xl:gap-0 md:mt-2 xl:mt-0 mt-0 ${isLogin? "w-3/4" : "w-1/2"}`}>

          <Button
            type="submit"
            className="xl:w-2/3 md:w-2/5 w-3/4 rounded-full xl:mt-5 xl:mb-2"
            disabled={isLoading}
            >
            {isLogin ? "Login" : "SignUp"}
          </Button>

          <Button
            className="rounded-full xl:w-2/3 md:w-2/5 w-3/4 border-2 border-[#7b39ed] xl:mt-2 text-[#7b39ed] font-bold dark:bg-neutral-800"
            variant="outline"
            onClick={toggleLoginHandler}
            disabled={isLoading}
            >
            {isLogin ? "SignUp" : "Back To Login"}
          </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
