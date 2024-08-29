import { fileFormat } from "@/lib/features";
import moment from "moment";
import React from "react";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setIsProfile } from "@/redux/reducers/misc";
import { Link } from "../styles/StyledComponents";
import { AtSign } from "lucide-react";

const MessageComponent = ({ message, user, group }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const {isProfile} = useSelector(state => state.misc)

  const dispatch = useDispatch()

  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();

  const handleAvatarClick = () => {
    dispatch(setIsProfile(!isProfile))
  }



  return (
    <div className={`flex items-start gap-2.5 ${
      sameSender
      ? "justify-end"
      : "justify-start"
    }`}>
    {!sameSender &&
    <img
    className="w-8 h-8 rounded-full my-2"
    src={sender?.avatar?.url}
    alt={sender?.name}
    onClick={handleAvatarClick}
    />
  }
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`flex flex-col max-w-[320px] leading-1.5 px-3 py-2 mt-5 border-gray-200 bg-gray-100 dark:bg-neutral-700 ${
        sameSender
        ? "rounded-s-xl rounded-ee-xl mx-2 pl-5"
        : "rounded-e-xl rounded-es-xl pr-5"
      }`}
      style={{ alignSelf: sameSender ? "flex-end" : "flex-start" }}
      >
        {!sameSender && ( group ? (
          <div className="text-sm text-[#6d28d9] dark:text-indigo-400 font-bold flex items-center gap-[2px]">
            <AtSign size={11}/>
            <h6 >{sender?.username}</h6>
          </div>
        ) : (
        <h6 className="text-sm text-[#6d28d9] dark:text-indigo-400 font-bold">{sender?.name}</h6>
      )
        )}
      <p className="text-sm font-normal pt-1 text-gray-900 dark:text-white">
      {content && <>{content}</>}
      </p>
      <div className="flex items-center rtl:space-x-reverse">
        <p className="text-xs py-1 text-neutral-400">{timeAgo}</p>
      </div>

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          
          return (
            <div className="container px-2" key={index}>
              <a className="text-black" href={url} target="_blank" download>
                {RenderAttachment(file, url)}
              </a>
            </div>
          );
        })}
    </motion.div>
    </div>
  );
};

export default MessageComponent;
