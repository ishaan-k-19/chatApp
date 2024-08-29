import { useFileHandler } from "6pp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transformImage } from "@/lib/features";
import { userExists } from "@/redux/reducers/auth";
import { setIsProfile } from "@/redux/reducers/misc";
import axios from "axios";
import {
  ArrowLeft,
  AtSign,
  AtSignIcon,
  Calendar,
  CameraIcon,
  CheckIcon,
  MailIcon,
  MessageSquareText,
  PenBoxIcon,
  UserIcon,
  UserRound,
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
import ChangePasswordDialog from "../dialog/ChangePasswordDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserItem from "../shared/UserItem";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const Profile = ({ user, otherUser, chatId }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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

  const membersDialogHandler = () => {
    setOpenDialog(true);
    console.log("clicked");
  };

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
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
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
                    <div className="flex items-center gap-5">
                      <Button type="submit" variant="icon" disabled={isLoading}>
                        <CheckIcon />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>Profile</>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-8 md:gap-10 xl:gap-8 items-center mt-4 justify-center">
                <div className="flex flex-col items-center justify-center relative">
                  {avatar.preview ? (
                    <img
                      className="h-[10rem] w-[10rem] rounded-full object-cover"
                      src={avatar.preview}
                      alt="Avatar Preview"
                    />
                  ) : (
                    <Avatar className="w-[150px] h-[150px] object-cover my-4 shadow-lg">
                      <AvatarImage
                        className="object-cover"
                        src={transformImage(mainUser?.avatar?.url, 500)}
                      />
                    </Avatar>
                  )}
                  <Button
                    className="absolute bottom-13 px-9 py-12 right-13 bg-slate-700 rounded-full bg-opacity-60 cursor-pointer hover:bg-gray-300"
                    variant="icon"
                    type="button" // Change to type="button"
                  >
                    <CameraIcon className="font-bold text-neutral-300" />
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
                  show={true}
                  element={
                    <input
                      className="border mx-2 rounded-sm py-1 text-center dark:bg-neutral-900 dark:text-white dark:border-neutral-700 bg-neutral-100"
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
                  show={true}
                  heading={"Name"}
                  element={
                    <input
                      className="border mx-2 rounded-sm py-1 text-center dark:bg-neutral-900 dark:text-white dark:border-neutral-700 bg-neutral-100"
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
                  show={true}
                  element={
                    <input
                      className="border mx-2 rounded-sm py-1 text-center dark:bg-neutral-900 dark:text-white dark:border-neutral-700 bg-neutral-100"
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
              </div>
            </CardContent>
            <ChangePasswordDialog />
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
                    onClick={() => {
                      dispatch(setIsProfile(false));
                    }}
                  >
                    <ArrowLeft />
                  </Button>
                  Group Profile
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 xl:gap-8 items-center mt-4">
                <Avatar className="w-[150px] h-[150px] object-cover my-4 shadow-lg">
                  <a href={mainUser?.avatar?.url} target="blank">
                    <AvatarImage
                      className="object-cover"
                      src={transformImage(mainUser?.avatar?.url, 500)}
                    />
                  </a>
                </Avatar>
                <ProfileCard
                  heading={"Group Name"}
                  element={mainUser?.name}
                  Icon={<UserRound />}
                />
                <ProfileCard
                  heading={"Admin"}
                  element={mainUser?.creator?.username}
                  Icon={
                    <Avatar className="h-[30px] w-[30px]">
                      <AvatarImage
                        className="object-cover shadow-lg"
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
                  handler={membersDialogHandler}
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
                        onClick={() => {
                          navigate("/");
                        }}
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
                        onClick={() => {
                          dispatch(setIsProfile(false));
                        }}
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
              <div className="flex flex-col gap-10 md:gap-4 xl:gap-6 items-center mt-4">
                <Avatar className="w-[150px] h-[150px] object-cover my-4 shadow-lg">
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
                  show={edit}
                />
                <ProfileCard
                  heading={"Name"}
                  element={mainUser?.name}
                  Icon={<UserIcon />}
                  show={edit}
                />
                <ProfileCard
                  heading={"Bio"}
                  element={mainUser?.bio}
                  Icon={<MessageSquareText />}
                  show={edit}
                />
                {edit && (
                  <ProfileCard
                    heading={"Email"}
                    element={mainUser?.email}
                    Icon={<MailIcon />}
                    show={edit}
                  />
                )}
                <ProfileCard
                  heading={"Joined"}
                  element={moment(mainUser?.createdAt).fromNow()}
                  Icon={<Calendar />}
                  show={edit}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
      <MembersDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        user={mainUser}
      />
    </>
  );
};

const ProfileCard = ({ element, Icon, heading, handler, show = false }) => (
  <Button
    className="grid grid-cols-3 items-center md:w-2/3 cursor-default gap-24 md:gap-5 2xl:gap-0"
    variant="icon"
    onClick={handler}
    type="button"
  >
    <div className="flex justify-center md:justify-center">{Icon && Icon}</div>
    <div className="flex flex-col">
      <div className="flex flex-col items-center">
        <p
          className={`${
            show
              ? "text-lg"
              : "text-lg max-w-none overflow-visible md:max-w-[9ch] md:overflow-hidden md:whitespace-nowrap md:text-ellipsis"
          }`}
        >
          {element}
        </p>
        <p className="text-sm text-neutral-400">{heading}</p>
      </div>
    </div>
  </Button>
);

const MembersDialog = ({ openDialog, setOpenDialog, user }) => {
  const closeHandler = () => {
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={closeHandler}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{user.name} Group</DialogTitle>
        </DialogHeader>
        <div className="text-lg font-bold text-neutral-500">
          Total Members: {user?.members?.length}
        </div>
        <Separator />
        <div className="list-none flex flex-col items-center w-full">
          <ScrollArea className="h-[47svh] 2xl:h-[50svh] scroll-smooth w-full px-3">
            {user?.members
              ?.slice()
              .reverse()
              .map((i) => (
                <>
                  <div className="flex gap-10 items-center p-2 mt-1">
                    <Avatar className="h-[50px] w-[50px]">
                      <AvatarImage
                        className="object-cover shadow-lg"
                        src={transformImage(i?.avatar?.url, 500)}
                      />
                    </Avatar>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-col">
                        <p>{i?.name}</p>
                        <div className="flex gap-[2px] items-center dark:text-neutral-500 text-neutral-400">
                          <AtSignIcon size={13} />
                          <p>{i?.username}</p>
                        </div>
                      </div>
                      {user?.creator?._id === i._id ? (
                        <p className=" dark:text-neutral-400 border px-3 py-1 rounded-sm bg-neutral-200 text-neutral-500 dark:bg-neutral-900 dark:border-neutral-900">
                          Admin
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
              ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;
