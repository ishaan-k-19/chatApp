import React, { useState, useEffect } from "react";

const TypingBubble = () => {
  const [text, setText] = useState("Typing.");

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) =>
        prev === "Typing."
          ? "Typing.."
          : prev === "Typing.."
          ? "Typing..."
          : "Typing."
      );
    }, 405);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-2.5">
      <div className="flex flex-col w-[100px] max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-neutral-600 opacity-60 text-neutral-500 dark:text-neutral-300 mt-1">
        <p className="text-lg animate-pulse">{text}</p>
      </div>
    </div>
  );
};

export default TypingBubble;
