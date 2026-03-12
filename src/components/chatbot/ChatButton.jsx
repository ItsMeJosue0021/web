import React, { useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { motion } from "framer-motion";
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
        className="fixed bottom-12 right-5 md:right-10 w-14 h-14 rounded-full shadow-2xl
                   bg-gradient-to-br from-orange-600 to-amber-500 text-white
                   hover:from-orange-500 hover:to-amber-400 transition-all duration-200
                   ring-1 ring-orange-200/70 hover:shadow-orange-300/60 flex items-center justify-center
                   border border-white/20"
        onClick={toggleChatbot}
        aria-label="Open support chat"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
        >
          <MessageCircleMore className="w-6 h-6"/>
        </motion.div>
      </button>

      {/* Chatbot Popup */}
      {isOpen && (
        <ChatBox toggleChatbot={toggleChatbot}/>
      )}
    </>
  );
};

export default ChatButton;
