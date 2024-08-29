import { useInputValidation } from "6pp";
import { useAsyncMutation } from "@/hooks/hooks";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "@/redux/api/api";
import { setIsSearch } from "@/redux/reducers/misc";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserItem from "../shared/UserItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ChatListSkeleton } from "../ui/chatListSkeleton";
import { ScrollArea } from "../ui/scroll-area";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();

  const search = useInputValidation("");

  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
  };

  useEffect(() => {
    if (!search.value.trim()) return setUsers([]);

    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog open={isSearch} onOpenChange={searchCloseHandler}>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col items-center w-full ">
            <DialogTitle className="text-center text-3xl py-5">
              Find People
            </DialogTitle>
            <div className="relative w-full max-w-md my-2">
              <input
                className="border border-black rounded-full w-full py-2 pl-12 dark:bg-neutral-800 dark:border-neutral-600"
                type="text"
                value={search.value}
                onChange={search.changeHandler}
                placeholder="Search..."
              />
              <SearchIcon className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5" />
            </div>
            <DialogDescription className="w-full list-none ">
              {isLoadingSendFriendRequest ? (
                <ChatListSkeleton />
              ) : (
                <ScrollArea className="h-[47svh] 2xl:h-[50svh] scroll-smooth w-full px-3">
                  {users.length === 0
                    ? <p className="text-center mt-20 text-lg">No results found</p>
                    : users.map((i) => (
                        <UserItem
                          user={i}
                          key={i._id}
                          handler={addFriendHandler}
                          handlerIsLoading={isLoadingSendFriendRequest}
                          usern={true}
                        />
                      ))}
                </ScrollArea>
              )}
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Search;
