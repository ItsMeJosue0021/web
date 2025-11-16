
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { _post } from '../../api';
import botAvatar from "../../assets/img/logo.png";
import userAvatar from "../../assets/img/logo.png";
import "../../css/loading.css";

const ChatBox = ({ toggleChatbot }) => {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 🔥 SAMPLE QUESTIONS (restored)
    const sampleQuestions = [
        "What is Kalinga ng Kababaihan WLLPC?",
        "Where is Kalingang Kababaihan WLLPC located?",
        "What does your organization do?"
    ];

    const sendMessage = async (message = input) => {
        message = String(message || "").trim();
        if (!message) return;

        setInput("");

        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await _post("/chat", {
                message,
                history: newMessages.map(m => ({ text: m.text, sender: m.sender }))
            });

            const botMessage = response.data.message || "I'm sorry, I don't have an answer right now.";

            setMessages(prev => [...prev, { text: botMessage, sender: "bot" }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Unable to fetch response right now.", sender: "bot" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                className="fixed bottom-0 md:right-5 md:bottom-28 z-[9999] 
               w-full md:w-[350px] h-full md:h-[550px] bg-white md:rounded-xl shadow-xl flex flex-col"
            >
                {/* HEADER */}
                <div className="bg-orange-600 text-white p-4 flex justify-between items-center rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <img src={botAvatar} className="w-8 h-8 rounded-full" />
                        <span className="font-semibold text-sm chewy">Kalinga ng Kababaihan</span>
                    </div>
                    <button onClick={toggleChatbot} className='bg-transparent'><X /></button>
                </div>

                {/* CHAT BODY */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 relative">

                    {/* 🎯 SAMPLE QUESTIONS (shown when chat is empty) */}
                    {messages.length === 0 && !isLoading && (
                        <div className="absolute bottom-4 left-4 w-fit flex flex-wrap gap-2 p-1 animate-fadeIn">
                            {sampleQuestions.map((q, index) => (
                                <button
                                    key={index}
                                    onClick={() => sendMessage(q)}
                                    className="p-2 text-[10px] text-left bg-white text-gray-800 
                                               rounded-xl shadow-sm hover:bg-orange-300 
                                               transition font-medium"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>

                            {msg.sender === "bot" && (
                                <img src={botAvatar} className="w-7 h-7 rounded-full" />
                            )}

                            <div
                                className={`
                                    max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
                                    ${msg.sender === "user"
                                        ? "bg-orange-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 rounded-bl-none"}
                                `}
                            >
                                {msg.text}
                            </div>

                            {msg.sender === "user" && (
                                <img src={userAvatar} className="w-7 h-7 rounded-full" />
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex items-center gap-2 mt-2">
                            <img src={botAvatar} className="w-6 h-6 rounded-full" />
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* INPUT AREA */}
                <div className="p-3 border-t bg-white flex items-center gap-2 rounded-b-xl">
                    <input
                        type="text"
                        value={input}
                        onKeyDown={handleEnter}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Write a message…"
                        className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded-full outline-none"
                    />
                    <button
                        onClick={() => sendMessage()}
                        className="bg-orange-600 text-white p-2 rounded-full shadow hover:bg-orange-700 transition"
                    >
                        <Send size={18} />
                    </button>
                </div>

            </motion.div>
        </AnimatePresence>
    );
};

export default ChatBox;
