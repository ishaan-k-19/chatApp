import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatItem from "../shared/ChatItem";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Header from "../layout/Header";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {

  return (
    <Card className="h-[100svh] md:h-[calc(100vh-8rem)] md:m-3">
      <CardHeader>
        <CardTitle className="md:block flex justify-between">
          <p className="md:hidden block dark:text-white text-[#6d28d9] font-bold text-3xl">ConvoCube</p>
          <p className="hidden md:block">Chats</p>
          <MenuItems/>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col" style={{ width: { w } }}>
          <ScrollArea className="h-[85svh] md:h-[calc(100vh-14rem)] md:mx-3 rounded-md">
            {chats?.map((data, index) => {
              const { avatar, _id, name, groupChat, members } = data;

              const newMessageAlert = newMessagesAlert.find(
                ({ chatId }) => chatId === _id
              );

              const isOnline = members?.some((member) =>
                onlineUsers.includes(member)
              );

              return (
                <ChatItem
                  key={_id}
                  index={index}
                  newMessageAlert={newMessageAlert}
                  isOnline={isOnline}
                  avatar={avatar}
                  name={name}
                  _id={_id}
                  groupChat={groupChat}
                  sameSender={chatId === _id}
                  handleDeleteChat={handleDeleteChat}
                />
              );
            })}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};


const MenuItems = () => {

  return(
  <Sheet >
    <SheetTrigger  className="md:hidden block">
      <Button className="rounded-full px-2" variant="icon">
        <MenuIcon/>
      </Button>
    </SheetTrigger>
    <SheetContent className="dark:bg-neutral-900">
      <SheetHeader>
        <SheetTitle className="text-3xl mt-14">Menu</SheetTitle>
        <SheetDescription>
          <Header/>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
  )
};

export default ChatList;
