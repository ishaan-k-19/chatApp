import { useInfiniteScrollTop } from "6pp";
import DeleteChatMenu from "@/components/dialog/DeleteChatMenu";
import FileMenu from "@/components/dialog/FileMenu";
import ProfileDropMenu from "@/components/dialog/ProfileDropMenu";
import AppLayout from "@/components/layout/AppLayout";
import { TypingLoader } from "@/components/layout/Loaders";
import MessageComponent from "@/components/shared/MessageComponent";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import TypingBubble from "@/components/ui/typingBubble";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVE,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "@/constants/events";
import { useErrors, useSocketEvents } from "@/hooks/hooks";
import { transformImage } from "@/lib/features";
import {
  useChatDetailsQuery,
  useGetMessagesQuery,
  useMyChatsQuery,
} from "@/redux/api/api";
import { removeNewMessagesAlert } from "@/redux/reducers/chat";
import { setIsFileMenu } from "@/redux/reducers/misc";
import { getSocket } from "@/socket";
import {
  ArrowLeft,
  AtSignIcon,
  EllipsisVertical,
  SendIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user, otherUser }) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const socket = getSocket();
  const navigate = useNavigate();

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [senderTyping, setSenderTyping] = useState("");

  const typingTimeout = useRef(null);

  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  const chatDetails = useChatDetailsQuery({
    chatId,
    skip: !chatId,
  });

  const { refetch } = useMyChatsQuery("");

  const isGroup = chatDetails?.data?.chat?.groupChat;

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId, user });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [3000]);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Emitting messages to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [0]);
  };

  const navigateBack = () => {
    navigate("/");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVE, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const handleFileOpen = (e) => {
    if (e.type === "click" || (e.type === "keydown" && e.key !== "Enter")) {
      dispatch(setIsFileMenu(true));
    }
  };

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
      refetch();
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
      setSenderTyping(data?.user);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
      setSenderTyping("");
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "dsadasdasdasdasdas",
          name: "Admin",
          avatar: "https://example.com/admin-avatar.jpg",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitHandler(e);
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [submitHandler]);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Card className="h-[100svh] md:h-[calc(100vh-8rem)] md:my-3 py-2 md:ml-0 overflow-hidden">
        <CardHeader className="shadow-md pb-2 pt-0">
          <CardTitle className=" flex items-center justify-between pt-2 md:pt-0">
            <div className="flex items-center gap-3 text-base">
              <ArrowLeft onClick={navigateBack} />
              <Avatar className="object-cover shadow-lg border">
                <AvatarImage
                  className="object-cover"
                  src={transformImage(otherUser?.avatar?.url)}
                />
              </Avatar>
              <div>
                {otherUser?.name}
                {!isGroup && (
                  <div className="flex text-[12px] items-center gap-[2px] -mt-1 text-neutral-400">
                    <AtSignIcon size={12} />
                    {otherUser?.username}
                  </div>
                )}
              </div>
            </div>
            <ProfileDropMenu
              toggle={<EllipsisVertical size={21} />}
              isGroup={isGroup}
              chatId={chatId}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 md:px-2">
          <div
            ref={containerRef}
            className="flex flex-col overflow-y-scroll overscroll-y-auto overflow-x-hidden h-[calc(100svh-8.5rem)] md:h-[calc(100vh-15.5rem)] md:px-3 py-1 pb-5"
          >
            {allMessages.map((message, index) => {
              const previousMessage = index > 0 ? allMessages[index - 1] : null;
              return (
                <MessageComponent
                  key={message._id}
                  message={message}
                  user={user}
                  group={isGroup}
                  previousMessage={previousMessage}
                />
              );
            })}
            <div ref={bottomRef} />
          </div>
          {userTyping && <TypingBubble user={senderTyping} group={isGroup} />}
        </CardContent>

        <CardFooter className="px-4">
          <form
            className="flex items-center gap-6 relative w-full pt-1"
            onSubmit={submitHandler}
          >
            <Button
              className="absolute left-2"
              variant="icon"
              onClick={handleFileOpen}
            >
              <FileMenu chatId={chatId} />
            </Button>
            <input
              className={
                "w-[100%] rounded-full py-3 px-14 dark:bg-neutral-700 dark:text-white bg-neutral-100 text-black"
              }
              placeholder="Type Message here..."
              value={message}
              onChange={messageOnChange}
              ref={inputRef}
            />
            <Button className="px-2 rounded-full mr-2" type="submit">
              <SendIcon />
            </Button>
          </form>
        </CardFooter>
      </Card>
      <DeleteChatMenu chatId={chatId} isGroup={isGroup} />
    </>
  );
};

export default AppLayout()(Chat);
