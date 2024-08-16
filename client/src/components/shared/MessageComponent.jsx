import { fileFormat } from "@/lib/features";
import moment from "moment";
import React from "react";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";
import { Card } from "../ui/card";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();


  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`flex flex-col max-w-[320px] leading-1.5 px-3 py-2 border-gray-200 bg-gray-100 dark:bg-neutral-700 my-1 ${
        sameSender
          ? "justify-end rounded-s-xl rounded-ee-xl mx-2 pl-5"
          : "justify-start rounded-e-xl rounded-es-xl pr-5"
      }`}
      style={{ alignSelf: sameSender ? "flex-end" : "flex-start" }}
    >
        {!sameSender && (
          <h6 className="text-sm text-[#a07be0] font-bold">{sender.name}</h6>
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
  );
};

const messageBubble = () => {
  <div className="flex items-start gap-2.5">
    <img
      className="w-8 h-8 rounded-full"
      src="/docs/images/people/profile-picture-3.jpg"
      alt="Jese image"
    />
    <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Bonnie Green
        </span>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          11:46
        </span>
      </div>
      <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
        That's awesome. I think our users will really appreciate the
        improvements.
      </p>
    </div>
  </div>;
};

export default MessageComponent;
