import React, { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { setIsDeleteMenu } from '@/redux/reducers/misc';
import { useDispatch, useSelector } from 'react-redux';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useDeleteChatMutation, useLeaveGroupMutation } from '@/redux/api/api';
import { useAsyncMutation } from '@/hooks/hooks';
import { useNavigate } from 'react-router-dom';
  


const DeleteChatMenu = ({chatId, isGroup}) => {

    const {isDeleteMenu } = useSelector((state) => state.misc);

    const [deleteChat,_, deleteChatData] = useAsyncMutation(useDeleteChatMutation);

    const [leaveGroup,__, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);

    const navigate = useNavigate();

    const dispatch = useDispatch();


    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false))
    };

    const leaveGroupHandler = () => {
        closeHandler();
        leaveGroup("Leaving Group...", chatId);
        navigate("/")
    };
    const deleteChatHandler = () =>{
        closeHandler();
        deleteChat("Deleting Chat...", chatId);
    };

    useEffect(()=>{
        if(deleteChatData || leaveGroupData) navigate("/");
    },[deleteChatData, leaveGroupData])



  return (

    <AlertDialog open={isDeleteMenu} onOpenChange={closeHandler}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to {
            isGroup 
           ? <>leave this group?</>
           : <>delete this chat?</>
        }
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={closeHandler}>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={isGroup?leaveGroupHandler:deleteChatHandler}>
        {
            isGroup 
           ? <>Leave Group</>
           : <>Delete Chat</>
        }
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default DeleteChatMenu
