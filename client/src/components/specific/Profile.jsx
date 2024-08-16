import { useFileHandler } from "6pp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transformImage } from "@/lib/features";
import { userExists } from "@/redux/reducers/auth";
import { setIsProfile } from "@/redux/reducers/misc";
import axios from "axios";
import {
  ArrowLeft,
  AtSign,
  Calendar,
  CameraIcon,
  CheckIcon,
  MessageSquareText,
  PenBoxIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { server } from "@/constants/config";
import { useNavigate } from "react-router-dom";

const Profile = ({ user, otherUser, chatId }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const avatar = useFileHandler("single");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isGroup = otherUser?.groupChat;

  const mainUser = otherUser ? otherUser : user;
  const edit = otherUser ? false : true;

  const { register, handleSubmit } = useForm();

  const [userData, setUserData] = useState({
    name: mainUser?.name,
    bio: mainUser?.bio,
    username: mainUser?.username,
  });

  const handleEditProfile = async (data) => {
    setIsEdit(false);
    const toastId = toast.loading("Updating Profile...");
    setIsLoading(true);


    const formData = new FormData();
    if (avatar.file) {
      formData.append("avatar", avatar.file);
    } else {
      formData.append("avatar", mainUser?.avatar);
    }
    formData.append("name", data.name);
    formData.append("bio", data.bio);
    formData.append("username", data.username);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.put(
        `${server}/api/v1/user/me/editprofile`,
        formData,
        config
      );
      toast.success(response.data.message, { id: toastId });
      dispatch(userExists(response.data.user));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      {isEdit ? (
        <Card className="h-[100svh] md:h-[calc(100vh-8rem)] md:m-3">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleEditProfile)}
          >
            <CardHeader>
              <CardTitle>
                {edit ? (
                  <div className="flex justify-between">
                    Edit Profile
                    <Button type="submit" variant="icon" disabled={isLoading}>
                      <CheckIcon />
                    </Button>
                  </div>
                ) : (
                  <>Profile</>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 xl:gap-8 items-center mt-4">
                <div className="flex flex-col items-center justify-center relative">
                  {avatar.preview ? (
                    <img
                      className="h-[10rem] w-[10rem] rounded-full object-cover"
                      src={avatar.preview}
                      alt="Avatar Preview"
                    />
                  ) : (
                    <Avatar className="w-[180px] h-[180px] object-cover my-4 shadow-lg">
                      <AvatarImage
                        className="object-cover"
                        src={transformImage(mainUser?.avatar?.url, 500)}
                      />
                    </Avatar>
                  )}
                  <Button
                    className="absolute bottom-13 px-9 py-12 right-13 bg-slate-700 rounded-full bg-opacity-60 cursor-pointer hover:bg-gray-300"
                    variant="icon"
                  >
                    <CameraIcon className="font-bold" />
                    <input
                      className="cursor-pointer px-20 py-24 border-none h-[1px] p-[10px] overflow-hidden whitespace-nowrap w-[1px] absolute opacity-0"
                      id="picture"
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </Button>
                </div>
                <ProfileCard
                  heading={"Username"}
                  element={
                    <input
                      className={"border mx-2 rounded-sm py-1 text-center dark:bg-neutral-900 dark:text-white dark:border-neutral-700bg-neutral-100"}
                      type="text"
                      {...register("username")}
                      defaultValue={userData.username}
                      onChange={(e) =>
                        setUserData({ ...userData, username: e.target.value })
                      }
                    />
                  }
                  Icon={<AtSign />}
                />
                <ProfileCard
                  heading={"Name"}
                  element={
                    <input
                      className={"border mx-2 rounded-sm py-1 text-center dark:bg-neutral-900 dark:text-white dark:border-neutral-700 bg-neutral-100"}
                      type="text"
                      {...register("name")}
                      defaultValue={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                    />
                  }
                  Icon={<UserIcon />}
                />
                <ProfileCard
                  heading={"Bio"}
                  element={
                    <input
                      className={"border mx-2 rounded-sm py-1 text-center dark:bg-neutral-900 dark:text-white dark:border-neutral-700 bg-neutral-100"}
                      type="text"
                      {...register("bio")}
                      defaultValue={userData.bio}
                      onChange={(e) =>
                        setUserData({ ...userData, bio: e.target.value })
                      }
                    />
                  }
                  Icon={<MessageSquareText />}
                />
                <ProfileCard
                  heading={"Joined"}
                  element={moment(mainUser?.createdAt).fromNow()}
                  Icon={<Calendar />}
                />
              </div>
            </CardContent>
          </form>
        </Card>
      ) : isGroup ? (
        <>
          <Card className=" h-[100svh] md:h-[calc(100vh-8rem)] md:m-3">
            <CardHeader>
              <CardTitle>
                <div className="flex gap-2 items-center">
                  <Button
                    className="rounded-full px-2 md:hidden block"
                    variant="icons"
                    onClick={()=>{dispatch(setIsProfile(false));}}
                  >
                    <ArrowLeft />
                  </Button>
                  Group Profile
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 xl:gap-8 items-center mt-4">
                <Avatar className="w-[180px] h-[180px] object-cover my-4 shadow-lg">
                  <a href={mainUser?.avatar?.url} target="blank">
                    <AvatarImage
                      className="object-cover"
                      src={transformImage(mainUser?.avatar?.url, 500)}
                    />
                  </a>
                </Avatar>
                <ProfileCard heading={"Group Name"} element={mainUser?.name} />
                <ProfileCard
                  heading={"Admin"}
                  element={mainUser?.creator?.username}
                  Icon={
                    <Avatar className="h-[40px] w-[40px]">
                      <AvatarImage
                        className="object-cover"
                        src={transformImage(
                          mainUser?.creator?.avatar?.url,
                          500
                        )}
                      />
                    </Avatar>
                  }
                />
                <ProfileCard
                  heading={"Participiants"}
                  element={`${mainUser?.members?.length} Members`}
                  Icon={<UsersIcon />}
                />
                <ProfileCard
                  heading={"Created"}
                  element={moment(mainUser?.createdAt).fromNow()}
                  Icon={<Calendar />}
                />
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card className="h-[100svh] md:h-[calc(100vh-8rem)] md:m-3">
            <CardHeader>
              <CardTitle>
                <div className="flex gap-2 items-center">
                  
                  {edit ? (
                    <>
                    <Button
                    className="rounded-full px-2 md:hidden block"
                    variant="icons"
                    onClick={()=>{navigate("/")}}
                  >
                    <ArrowLeft />
                  </Button>
                    <div className="flex justify-between items-center">
                      Profile
                      <Button variant="icon" onClick={() => setIsEdit(true)}>
                        <PenBoxIcon />
                      </Button>
                    </div>
                    </>
                  ) : (
                    <>
                    <Button
                    className="rounded-full px-2 md:hidden block"
                    variant="icons"
                    onClick={()=>{dispatch(setIsProfile(false));}}
                  >
                    <ArrowLeft />
                  </Button>
                      Profile
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 xl:gap-8 items-center mt-4">
                <Avatar className="w-[180px] h-[180px] object-cover my-4 shadow-lg">
                  <a href={mainUser?.avatar?.url} target="blank">
                    <AvatarImage
                      className="object-cover"
                      src={transformImage(mainUser?.avatar?.url, 500)}
                    />
                  </a>
                </Avatar>
                <ProfileCard
                  heading={"Username"}
                  element={mainUser?.username}
                  Icon={<AtSign />}
                />
                <ProfileCard
                  heading={"Name"}
                  element={mainUser?.name}
                  Icon={<UserIcon />}
                />
                <ProfileCard
                  heading={"Bio"}
                  element={mainUser?.bio}
                  Icon={<MessageSquareText />}
                />
                <ProfileCard
                  heading={"Joined"}
                  element={moment(mainUser?.createdAt).fromNow()}
                  Icon={<Calendar />}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

const ProfileCard = ({ element, Icon, heading }) => (
  <div className="flex items-center gap-4 text-center md:mt-0 mt-8">
    {Icon && Icon}
    <div className="flex flex-col">
      <p className="text-lg">{element}</p>
      <p className="text-sm text-neutral-400">{heading}</p>
    </div>
  </div>
);

export default Profile;
