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

const MessageComponent = ({ message, user, group, previousMessage }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const {isProfile} = useSelector(state => state.misc)

  const dispatch = useDispatch()

  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).format('h:mm A');

  const handleAvatarClick = () => {
    dispatch(setIsProfile(!isProfile))
  }

  const currentMessageDate = moment(createdAt).format("YYYY-MM-DD");
  const previousMessageDate = previousMessage 
    ? moment(previousMessage.createdAt).format("YYYY-MM-DD")
    : null;

  const showDateHeading = currentMessageDate !== previousMessageDate;

  const formattedDateHeading = moment(createdAt).format("ddd, MMM D YYYY");

  return (
    <>
      {showDateHeading && (
        <div className="text-center my-3">
          <span className="bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-[12px]">
            {formattedDateHeading}
          </span>
        </div>
      )}
      <div className={`flex items-start gap-2.5 ${
        sameSender ? "justify-end" : "justify-start"
      }`}>
        {!sameSender && (
          <img
            className="w-8 h-8 rounded-full my-2 object-cover"
            src={sender?.avatar?.url}
            alt={sender?.name}
            onClick={handleAvatarClick}
          />
        )}
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          whileInView={{ opacity: 1, x: 0 }}
          className={`flex flex-col md:max-w-[320px] max-w-[200px] leading-1.5 px-3 py-2 mt-5 border-gray-200 bg-gray-100 dark:bg-neutral-700 ${
            sameSender
              ? "rounded-s-xl rounded-se-xl mx-2 pl-5"
              : "rounded-e-xl rounded-es-xl pr-5"
          }`}
          style={{ alignSelf: sameSender ? "flex-end" : "flex-start" }}
        >
          {!sameSender && (group ? (
            <div className="text-sm text-[#6d28d9] dark:text-indigo-400 font-bold flex items-center gap-[2px]">
              <AtSign size={11}/>
              <h6>{sender?.username}</h6>
            </div>
          ) : (
            <h6 className="text-sm text-[#6d28d9] dark:text-indigo-400 font-bold">{sender?.name}</h6>
          ))}
          <p className="text-sm font-normal pt-1 text-gray-900 dark:text-white md:max-w-[40ch] max-w-[20ch] overflow-hidden whitespace-pre-wrap break-words">
            {content && <>{content}</>}
          </p>
          <div className={`flex ${sameSender ? "justify-end" : "justify-start"}`}>
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
    </>
  );
};

export default MessageComponent;
