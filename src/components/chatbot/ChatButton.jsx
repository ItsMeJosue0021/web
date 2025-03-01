import React, { useState } from "react";
import { MessageCircleMore } from "lucide-react";
import ChatBox from "./ChatBox";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        className="fixed bottom-10 right-5 md:right-20 bg-orange-600 text-white p-4 flex items-center justify-center rounded-full shadow-lg hover:bg-orange-700 transition hover:border-0"
        onClick={toggleChatbot}
      >
        <MessageCircleMore className="w-12 h-12"/>
      </button>

      {/* Chatbot Popup */}
      {isOpen && (
        <ChatBox toggleChatbot={toggleChatbot}/>
      )}
    </>
  );
};

export default ChatButton;
