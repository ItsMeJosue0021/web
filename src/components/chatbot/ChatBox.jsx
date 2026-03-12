import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { _post } from '../../api';
import { useWebsiteLogo } from "../../hooks/useWebsiteLogo";
import "../../css/loading.css";

const ChatBox = ({ toggleChatbot }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { websiteLogo, logoImageSrc } = useWebsiteLogo();
    const displayName = websiteLogo?.main_text || "Kalinga ng Kababaihan";
    const hasMessages = messages.length > 0;

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
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                className="fixed bottom-0 md:bottom-24 right-0 md:right-6 z-[9999] 
                w-[100vw] sm:w-[360px] h-[calc(100vh-72px)] sm:h-[600px] 
                sm:rounded-2xl rounded-none bg-white/95 shadow-2xl border border-orange-200/80 
                flex flex-col overflow-hidden backdrop-blur"
            >
                <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/80 bg-white/20 flex items-center justify-center">
                            {logoImageSrc ? (
                                <img src={logoImageSrc} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm font-semibold text-white">
                                    {displayName?.charAt(0) || "K"}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Support Assistant</p>
                            <p className="text-xs text-white/80">{displayName}</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleChatbot}
                        aria-label="Close chat"
                        className="p-2 rounded-full hover:bg-white/15 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-slate-50 relative">
                    {!hasMessages && !isLoading && (
                        <div className="absolute inset-0 flex flex-col justify-center px-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-3">
                                Quick start
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {sampleQuestions.map((q, index) => (
                                    <button
                                        key={index}
                                        onClick={() => sendMessage(q)}
                                        className="px-3 py-2 text-left text-xs bg-white text-slate-700 
                                                   border border-orange-200 rounded-xl shadow-sm hover:bg-orange-50 
                                                   transition-all hover:-translate-y-0.5 hover:shadow"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.sender === "bot" && (
                                <div className="w-7 h-7 rounded-full overflow-hidden border border-white bg-white shadow">
                                    {logoImageSrc ? (
                                        <img src={logoImageSrc} alt={displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="flex h-full w-full text-[10px] font-semibold text-slate-700 items-center justify-center">
                                            {displayName?.charAt(0) || "K"}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div
                                className={`relative max-w-[78%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                                    msg.sender === "user"
                                        ? "bg-orange-600 text-white rounded-br-none shadow-sm"
                                        : "bg-white text-slate-700 rounded-bl-none border border-slate-200/80 shadow-sm"
                                }`}
                            >
                                <span className="block whitespace-pre-wrap break-words">{msg.text}</span>
                            </div>

                            {msg.sender === "user" && (
                                <div className="w-7 h-7 rounded-full overflow-hidden border border-white bg-orange-50 shadow">
                                    {logoImageSrc ? (
                                        <img src={logoImageSrc} alt={displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="flex h-full w-full text-[10px] font-semibold text-orange-700 items-center justify-center">
                                            {displayName?.charAt(0) || "K"}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-white bg-white shadow">
                                {logoImageSrc ? (
                                    <img src={logoImageSrc} alt={displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="flex h-full w-full text-[10px] font-semibold text-slate-700 items-center justify-center">
                                        {displayName?.charAt(0) || "K"}
                                    </span>
                                )}
                            </div>
                            <div className="typing-indicator px-3 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onKeyDown={handleEnter}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Write a message…"
                            className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-100 border border-slate-200
                                       rounded-full outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>
                    <button
                        onClick={() => sendMessage()}
                        aria-label="Send message"
                        className="h-11 w-11 rounded-full bg-orange-600 text-white flex items-center justify-center shadow
                                   hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isLoading || !input.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>

                <div className="bg-slate-100 text-[10px] text-slate-500 px-3 py-2 border-t border-slate-200">
                    <p className="text-center">
                        Responses are for assistance only. Please call or message us for urgent matters.
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatBox;
