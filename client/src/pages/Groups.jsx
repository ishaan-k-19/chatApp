import { useFileHandler } from "6pp";
import UserItem from "@/components/shared/UserItem";
import { Link } from "@/components/styles/StyledComponents";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LayoutSkeleton } from "@/components/ui/layoutSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/ui/theme-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { server } from "@/constants/config";
import { useAsyncMutation, useErrors } from "@/hooks/hooks";
import { transformImage } from "@/lib/features";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation
} from "@/redux/api/api";
import { setIsAddMember } from "@/redux/reducers/misc";
import { getSocket } from "@/socket";
import axios from "axios";
import {
  ArrowLeft,
  CameraIcon,
  CheckIcon,
  MenuIcon,
  PencilIcon,
  PlusIcon,
  Trash2
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";


import { Suspense, lazy, memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const ConfirmDeleteDialog = lazy(() =>
  import("@/components/dialog/ConfirmDeleteDialog")
);
const AddMember = lazy(() => import("@/components/dialog/AddMemberDialog"));

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const { theme, systemTheme } = useTheme();
  const avatar = useFileHandler("single");
  const ui = theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? "dark" : "light";

  const dispatch = useDispatch();
  const socket = getSocket();

  const { isAddMember } = useSelector((state) => state.misc);
  
  const myGroups = useMyGroupsQuery("");
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );


  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroupName] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteHandler, setConfirmDeleteHandler] = useState(false);

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];
  useErrors(errors);

  const groupData = groupDetails.data;
  useEffect(() => {
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);


  const navigateBack = () => {
    navigate("/");
  };
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const updateGroupName = async () => {
    setIsEdit(false);
    const toastId = toast.loading("Updating Group Details...");
    setIsLoading(true);
    const formData = new FormData();
    if (avatar.file) {
      formData.append("avatar", avatar.file);
    } else {
      formData.append("avatar", groupData?.chat?.avatar);
    }
    formData.append("name", groupNameUpdatedValue);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  
    try {
      const response = await axios.put(`${server}/api/v1/chat/${chatId}`, formData, config);
      toast.success(response.data.message, { id: toastId });
      // Update the local state with the new group name and avatar
      myGroups.refetch()
      groupDetails.refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteHandler(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteHandler(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };
  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };
  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <Button
        className="px-2 rounded-full m-3 fixed right-4 block md:hidden top-4 md:top-2"
        onClick={handleMobile}
      >
        <MenuIcon />
      </Button>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              className={`px-2 rounded-full fixed  m-3 top-4 md:top-2 md:relative ${
                theme === "dark" ||
                (theme === "system" && systemTheme === "dark")
                  ? "bg-neutral-700 hover:bg-neutral-600"
                  : "bg-slate-200 hover:bg-slate-300"
              }`}
              variant="icon"
              onClick={navigateBack}
            >
              <ArrowLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="hidden md:block">back</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );

  const GroupName = (
    <div className="flex justify-center items-center overflow-hidden flex-col">
      {isEdit ? (
        <>
          <div className="flex flex-col items-center justify-center relative">
            {avatar.preview ? (
              <img
                className="h-[130px] w-[130px] rounded-full object-cover my-2"
                src={avatar.preview}
                alt="Avatar Preview"
              />
            ) : (
              <Avatar className="w-[130px] h-[130px] object-cover my-4 shadow-lg">
                <AvatarImage
                  className="object-cover"
                  src={transformImage(groupData?.chat?.avatar?.url, 500)}
                />
              </Avatar>
            )}
            <Button
              className="absolute bottom-13 px-9 py-12 right-13 bg-slate-700 rounded-full bg-opacity-60 cursor-pointer hover:bg-gray-300"
              variant="icon"
            >
              <CameraIcon className="font-bold" />
              <input
                className="cursor-pointer px-20 py-24 border-none h-[1px] overflow-hidden whitespace-nowrap w-[1px] absolute opacity-0"
                id="picture"
                type="file"
                onChange={avatar.changeHandler}
              />
            </Button>
          </div>
          <div className="flex items-center">

        <input
            className={"border md:text-4xl text-2xl mx-2 rounded-sm py-2 text-center dark:bg-neutral-900 dark:text-white dark:border-neutral-700 bg-neutral-100"}
            type="text"
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <Button
          className="rounded-full px-2"
            onClick={updateGroupName}
            variant="outlined"
            disabled={isLoading}
          >
            <CheckIcon size={28}/>
          </Button>
          </div>
        </>
      ) : (
        <>
          <Avatar className="w-[130px] h-[130px] object-cover my-4 shadow-lg">
            <a href={groupData?.chat?.avatar?.url} target="blank">
              <AvatarImage
                className="object-cover"
                src={transformImage(groupData?.chat?.avatar?.url, 500)}
              />
            </a>
          </Avatar>
          <div className="flex ml-10">
            <h4 className="md:text-4xl text-2xl font-bold">{groupName}</h4>
            <Button
              variant="outlined"
              onClick={() => setIsEdit(true)}
              disabled={isLoading}
            >
              <div
                className={"dark:bg-neutral-700 dark:hover:bg-neutral-600 bg-slate-100 hover:bg-slate-300 p-2 rounded-lg"}
              >
                <PencilIcon size={24}/>
              </div>
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const ButtonGroup = (
    <div className="flex gap-4 justify-center my-3">
      <Button
        className="text-red-500 border border-neutral-200 dark:border-red-500"
        variant="outlined"
        onClick={openConfirmDeleteHandler}
      >
        <Trash2 className="w-5 mx-1" /> Delete Group
      </Button>
      <Button onClick={openAddMemberHandler}>
        {" "}
        <PlusIcon className="w-5 mx-1" />
        Add Member
      </Button>
    </div>
  );

  return myGroups.isLoading ? (
    <LayoutSkeleton />
  ) : (
    <div className="relative h-[100vh]">
      <div className="grid grid-cols-12 h-full gap-4 md:p-4">
        <Card className={`h-full md:py-3 md:block col-span-12 md:col-span-4 ${chatId ? "hidden md:block" : "block"}`}>
          <div className="md:hidden block">
          <Button
              className={"px-2 rounded-full fixed  m-3 top-4 md:top-2 md:relative dark:bg-neutral-700 dark:hover:bg-neutral-600 bg-slate-200 hover:bg-slate-300"}
              variant="icon"
              onClick={navigateBack}
            >
              <ArrowLeft />
            </Button>
          </div>
          <CardHeader>
            <CardTitle className={"text-3xl text-center font-bold mt-8"}>
              Manage Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 md:px-0">
            <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
          </CardContent>
        </Card>
        <Card className={`col-span-12 md:col-span-8 h-full block ${chatId ? "block" : "hidden md:block"}`}>
          {IconBtns}
          {groupName && (
            <>
              <CardHeader className="block p-3">{GroupName}</CardHeader>
              <CardContent>
                  <ScrollArea className="h-[53vh] md:h-[50vh]">
                <div className="flex w-full justify-center">
                  <div className="flex flex-col list-none md:max-w-[45rem] w-full box-border p-4 gap-4 md:mx-4">
                    {isLoadingRemoveMember ? (
                      <Skeleton />
                    ) : (
                      members?.map((i) => (
                        <UserItem
                          key={i._id}
                          user={i}
                          isAdded
                          styling={
                            theme === "light" ||
                            (theme === "system" && systemTheme === "light")
                              ? {
                                  boxShadow: "0 0 0.5rem rgba(0, 0, 0, 0.2)",
                                  padding: "0.1rem 2.5rem",
                                  borderRadius: "1rem",
                                  gap: "0",
                                  justifyContent: "space-between",
                                  
                                }
                              : {
                                  backgroundColor: `#262626`,
                                  boxShadow: "0 0 0.5rem rgba(0, 0, 0, 0.2)",
                                  padding: "0.1rem 2.5rem",
                                  borderRadius: "1rem",
                                  gap: "0",
                                  justifyContent: "space-between",
                                }
                          }
                          handler={removeMemberHandler}
                          usern={true}
                        />
                      ))
                    )}
                  </div>
                </div>
                  </ScrollArea>
              </CardContent>
              <CardFooter>{ButtonGroup}</CardFooter>
            </>
          )}
        </Card>
      </div>

      {isAddMember && (
        <Suspense fallback={<div>Loading...</div>}>
          <AddMember chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteHandler && (
        <>
          <Suspense fallback={<div>Loading</div>}>
            <ConfirmDeleteDialog
              open={confirmDeleteHandler}
              handleClose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        </>
      )}

      <Sheet
        open={isMobileMenuOpen}
        onOpenChange={() => setIsMobileMenuOpen(false)}
      >
        <SheetContent className="shadow-lg block md:hidden">
          <SheetHeader>
            <SheetTitle className="text-white mt-8 text-3xl mb-10">
              Manage Gropus
            </SheetTitle>
            <SheetDescription>
              <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const GroupList = ({ myGroups = [], chatId }) => {
  return (
    <div className="flex flex-col">
      {myGroups.length > 0 ? (
      <ScrollArea className="h-[80svh]">
        {myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))}
      </ScrollArea>
      ) : (
        <h6 className="text-center text-white md:text-2xl text-lg mt-20">No Groups</h6>
      )}
    </div>
  );
};

const GroupListItem = memo(({ group, chatId }) => {
  const { theme, systemTheme } = useTheme();
  const { _id, name, avatar } = group;
  return (
    <>
    <Link
      className="rounded-lg md:mx-2 my-1 md:my-0  hover:bg-[#7b39ed] hover:bg-opacity-45"
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) {
          e.preventDefault();
        }
      }}
    >
      <div
        className="p-2 md:p-0 md:px-10"
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: chatId === _id ? "#7b39ed" : "unset",
          color:
            chatId === _id ||
            theme === "dark" ||
            (theme === "system" && systemTheme === "dark")
              ? "white"
              : "unset",
          borderRadius: "0.7rem",
          boxShadow: chatId === _id ? "0 0 0.5rem rgba(0, 0, 0, 0.2)" : "unset",
        }}
      >
        <Avatar className="object-cover md:my-3 shadow-lg border">
          <AvatarImage className="object-cover" src={transformImage(avatar)} />
        </Avatar>
        <h5 className="font-bold md:text-xl text-base">{name}</h5>
      </div>
    </Link>
    
    </>
  );
});

export default Groups;
