import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from "@/constants/events";
import { useErrors, useSocketEvents } from "@/hooks/hooks";
import { getOrSaveFromStorage } from "@/lib/features";
import { useChatDetailsQuery, useMyChatsQuery } from "@/redux/api/api";
import { incrementNotification, setNewMessagesAlert } from "@/redux/reducers/chat";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "@/redux/reducers/misc";
import { getSocket } from "@/socket";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import OtpDialog from "../dialog/OtpDialog";


const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = getSocket();

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [otherUser, setOtherUser] = useState();

    const { isMobile, isProfile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth)
    const { newMessagesAlert } = useSelector((state) => state.chat)
    
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");


    const chatDetails = useChatDetailsQuery(
      { chatId, populate: true },
      { skip: !chatId}
    )

    const chatInfo = chatDetails?.data?.chat

    useErrors([{ isError, error }]);

    useEffect (() => {
      getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert})
    }, [newMessagesAlert])

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true))
      dispatch(setSelectedDeleteChat({chatId, groupChat}))
    };

    
    const newRequestListener = useCallback(()=> {
      dispatch(incrementNotification());
      
    }, [dispatch]);

    const refetchListener = useCallback(()=> {
      refetch();
      navigate("/")
    }, [refetch, navigate]);

    const newMessagesAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const onlineUsersListener = useCallback((data)=> {
      setOnlineUsers(data)
  
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessagesAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useEffect(() => {
      if (chatInfo && chatInfo.groupChat === false) {
        const result = chatInfo.members.filter(
          (member) => member._id.toString()!== user._id.toString()
        )
        setOtherUser(result[0]);
        }
        else{
          setOtherUser(chatInfo)
        }
    }, [chatInfo, chatId]);
    
    useSocketEvents(socket, eventHandlers);

    return (
      <>
      <OtpDialog verfied={user.verified}/>
        <Title />
        <div className="hidden md:block">
        <Header/>
        </div>
        <div className="grid grid-cols-12 ">
          {/* Chat List */}
          <div className={`
          ${chatId ? `col-span-12 md:col-span-3 lg:col-span-3 md:block hidden` : `col-span-12 md:col-span-6 lg:col-span-6 md:block`}
          `}>
              <ChatList
              chats={data?.chats}
              chatId={chatId}
              onlineUsers={onlineUsers}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              />
            {/* <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor.current}/> */}
          </div>
          {/* Main Content */}
          {
           chatId ? <div className={`
          ${isProfile ? `md:col-span-5 lg:col-span-6 md:block hidden` : `col-span-12 md:col-span-9 md:mr-3`}
            `}>
            <WrappedComponent {...props} chatId={chatId} user= {user} otherUser={otherUser} chats={data}/>
          </div> : 
          <div className="md:col-span-6 md:block hidden">
            <Profile user={user}/>
          </div>
          }
          {/* Profile */}
          <div className={`
          ${isProfile ? "col-span-12 md:col-span-4 lg:col-span-3 block" : "hidden"}
          ${chatId ? `block col-span-12` : `hidden`}
          `}>
              <Profile user={user} otherUser={otherUser} chatId={chatId}/>
          </div>
        </div>
      </>
    );
  };
};



export default AppLayout;
