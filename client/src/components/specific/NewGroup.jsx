import { useFileHandler, useInputValidation } from "6pp";
import { server } from "@/constants/config";
import { useErrors } from "@/hooks/hooks";
import { setIsNewGroup } from "@/redux/reducers/misc";
import axios from "axios";
import { CameraIcon, CircleIcon, UserCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import UserItem from "../shared/UserItem";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { ChatListSkeleton } from "../ui/chatListSkeleton";
import { ScrollArea } from "../ui/scroll-area";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const avatar = useFileHandler("single");


  const { isError, isLoading, error, data } = useAvailableFriendsQuery();

  const [isLoadingNewGroup, setIsLoadingNewGroup] = useState(false);


  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };


  const submitHandler = async () => {

    if (!avatar.file) return toast.error("Avatar is required");

    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2) {
      return toast.error("Group must have atleast 3 members");
    }

    const toastId = toast.loading("Creating Group...");
    setIsLoadingNewGroup(true);
    const formData = new FormData();
    formData.append("name", groupName.value);
    formData.append("members", JSON.stringify(selectedMembers));
    formData.append("avatar", avatar.file);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.post(`${server}/api/v1/chat/new`, formData, config);
      toast.success(response.data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoadingNewGroup(false);
    }
    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog open={isNewGroup} onOpenChange={closeHandler}>
      <DialogContent className="flex items-center flex-col">
        <DialogHeader className={"w-full"}>
            <DialogTitle className="text-center py-5 flex flex-col">
              <h1 className="text-3xl mb-5">New Group</h1>
              <div className="flex justify-center items-center">
                  <Button
                    className=" relative rounded-full bg-opacity-80 cursor-pointer px-0"
                    variant="icon"
                  >
                <div className="flex flex-col items-center justify-center relative">
                  {avatar.preview ? (
                    <img
                      className="h-[3rem] w-[3rem] rounded-full object-cover"
                      src={avatar.preview}
                      alt="Avatar Preview"
                    />
                  ) : (
                    <CircleIcon size={45} strokeWidth={1} stroke="#a3a3a3"/>
                  )}
                    <CameraIcon className=" absolute dark:bg-slate-900 bg-opacity-70 bg-neutral-400 p-1 rounded-full" />
                    <input
                      className="cursor-pointer border-none h-[1px] p-[10px] overflow-hidden whitespace-nowrap w-[1px] absolute opacity-0"
                      id="picture"
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                </div>
                  </Button>
                <Input
                  className="rounded-full py-2 text-sm w-full mx-3 font-medium"
                  value={groupName.value}
                  type="text"
                  onChange={groupName.changeHandler}
                  placeholder="Group Name"
                />
              </div>
            </DialogTitle>
            <DialogDescription className="w-full list-none flex flex-col">
              {isLoading ? (
                <ChatListSkeleton />
              ) : (
                <ScrollArea className="h-[37svh] 2xl:h-[40svh] scroll-smooth">
                  {data?.friends.map((i) => (
                    <div className="px-4">
                      <UserItem
                        user={i}
                        key={i._id}
                        handler={selectMemberHandler}
                        isAdded={selectedMembers.includes(i._id)}
                      />
                    </div>
                  ))}
                </ScrollArea>
              )}
            <div className="flex gap-16 justify-center mt-3">
              <Button variant="destructive" onClick={closeHandler}>
                Cancel
              </Button>
              <Button onClick={submitHandler} disabled={isLoadingNewGroup}>
                Create
              </Button>
            </div>
            </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroup;
