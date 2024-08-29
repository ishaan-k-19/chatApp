import { useAsyncMutation, useErrors } from '@/hooks/hooks';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '@/redux/api/api';
import { setIsNotification } from '@/redux/reducers/misc';
import { Check, XIcon } from 'lucide-react';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Skeleton } from '../ui/skeleton';
import { ChatListSkeleton } from '../ui/chatListSkeleton';
import { decrementNotification } from '@/redux/reducers/chat';

const Notifications = () => {

  const dispatch = useDispatch();

  const { isNotification } = useSelector((state) => state.misc);

  const {isLoading, data, error, isError} = useGetNotificationsQuery();

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({_id, accept}) =>{
    dispatch(setIsNotification(false));
    dispatch(decrementNotification());
    await acceptRequest("Accepting...", { requestId: _id, accept: accept });
  }

  const closeHandler = ()=> dispatch(setIsNotification(false));

  useErrors([{ error, isError }])

  return (
    <Dialog open={isNotification} onOpenChange={closeHandler}>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col items-center justify-center w-full">
            <DialogTitle className="text-center text-3xl py-5">
              Notifications
            </DialogTitle>
            <DialogDescription className="w-[90%] overflow-y-auto h-[47svh] 2xl:h-[50svh] scroll-smooth">
              {
                isLoading? (
                  <ChatListSkeleton />
                ): (
                  <>
                  {
                data?.allRequests.length > 0 ? (
                  data?.allRequests?.map((i)=><NotificationItem 
                  sender={i.sender} 
                  _id={i._id} 
                  handler={friendRequestHandler} 
                  key={i._id}/>)
                ) : <p className='text-center'>0 Notifications</p>
              }
                  </>
                )
              }
            </DialogDescription>
          </div>
          
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) =>{
  const {name, avatar} = sender

  return(
  <>
    <ul>
        <div className='flex items-center w-full'>
            <div className='flex gap-2 items-center'>
            <Avatar className='object-cover my-4 border-2 shadow-lg'>
                <AvatarImage className='object-cover' src={avatar}/>
            </Avatar>
            <p className='text-lg grow overflow-hidden' style={{display: "-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical"}}>
              {`${name} sent you a friend request`}
              </p>
            </div>
            <div className=" ml-3 flex gap-2">

            <Button className='px-2 rounded-full' onClick={()=>handler({_id, accept: true})}>
                <Check/>
            </Button>
            <Button className='text-red-400 rounded-full px-2' onClick={()=>handler({_id, accept: false})} variant="secondary">
                <XIcon/>
            </Button>
            </div>
        </div>
    </ul>
  </>)
})

export default Notifications
