import React, { useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AudioLines, FileUpIcon, ImageIcon, Paperclip, VideoIcon } from "lucide-react";
import { Button } from "../ui/button";
import { setIsFileMenu, setUploadingLoader } from "@/redux/reducers/misc";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "@/redux/api/api";
import { ScrollArea } from "../ui/scroll-area";


const FileMenu = ({chatId}) => {

  const imageRef= useRef(null);
  const audioRef= useRef(null);
  const videoRef= useRef(null);
  const fileRef= useRef(null);

  const dispatch = useDispatch();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const [ sendAttachments ] = useSendAttachmentsMutation()

  const fileChangeHandler = async (e, key) => {

    e.preventDefault()

    const files = Array.from(e.target.files);

    if(files.length<=0) return;

    if(files.length > 5) return toast.error(`You can only send 5  ${key} at a time`);

    dispatch(setUploadingLoader(true));
    
    const toastId = toast.loading(`Send ${key}...`);

    closeFileMenu();

    try {

      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach(file => myForm.append("files", file))

      const res = await sendAttachments(myForm)

      if(res.data) toast.success(`${key} sent successfully`, { id:toastId });

      else toast.error(`Failed to send ${key}`, { id:toastId })

    } catch (error) {
      toast.error(error, { id: toastId})
    } finally {
      dispatch(setUploadingLoader(false));
    }


  };

  const isFileMenu = useSelector((state) => state.misc.isFileMenu);

  return (
    <Popover open={isFileMenu} onOpenChange={closeFileMenu}>
      <PopoverTrigger asChild>
        <Paperclip/>
      </PopoverTrigger>
      <PopoverContent className="text-white">
        <Button className="bg-white w-full border-none bg-opacity-0" variant="outline" onClick={selectImage}>
          <ImageIcon />
          <p className="px-2">Image</p>
          <input
            className="hidden"
            type="file"
            multiple
            accept="image/png, image/jpeg, image/gif"
            onChange={(e) => fileChangeHandler(e, "Images")}
            ref={imageRef}
          />
        </Button>
        <Button className="bg-white w-full border-none bg-opacity-0" variant="outline" onClick={selectAudio}>
          <AudioLines/>
          <p className="px-2">Audio</p>
          <input
            className="hidden"
            type="file"
            multiple
            accept="audio/mpeg, audio/wav"
            onChange={(e) => fileChangeHandler(e, "Audios")}
            ref={audioRef}
          />
        </Button>
        <Button className="bg-white w-full border-none bg-opacity-0" variant="outline" onClick={selectVideo}>
          <VideoIcon/>
          <p className="px-2">Video</p>
          <input
            className="hidden"
            type="file"
            multiple
            accept="video/mp4, video/webm, video/ogg"
            onChange={(e) => fileChangeHandler(e, "Videos")}
            ref={videoRef}
          />
        </Button>
        <Button className="bg-white w-full border-none bg-opacity-0" variant="outline" onClick={selectFile}>
          <FileUpIcon/>
          <p className="px-3">Files</p>
          <input
            className="hidden"
            type="file"
            multiple
            accept="*"
            onChange={(e) => fileChangeHandler(e, "Files")}
            ref={fileRef}
          />
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default FileMenu;
