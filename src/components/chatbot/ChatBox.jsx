import { useEffect, useRef, useState } from "react";
import { ChevronRight, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { _post } from "../../api";
import { useWebsiteLogo } from "../../hooks/useWebsiteLogo";
import "../../css/loading.css";

const ChatBox = ({ toggleChatbot }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { websiteLogo, logoImageSrc } = useWebsiteLogo();
    const displayName = websiteLogo?.main_text || "Kalinga ng Kababaihan";
    const hasMessages = messages.length > 0;
    const messagesContainerRef = useRef(null);
    const assistantInitial = displayName?.trim()?.charAt(0)?.toUpperCase() || "K";

    const sampleQuestions = [
        "What is Kalinga ng Kababaihan WLLPC?",
        "Where is Kalingang Kababaihan WLLPC located?",
        "What does your organization do?",
    ];

    useEffect(() => {
        if (!messagesContainerRef.current) return;

        messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, isLoading]);

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
                history: newMessages.map((msg) => ({ text: msg.text, sender: msg.sender })),
            });

            const botMessage = response.data.message || "I'm sorry, I don't have an answer right now.";

            setMessages((prev) => [...prev, { text: botMessage, sender: "bot" }]);
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setMessages((prev) => [...prev, { text: "Unable to fetch response right now.", sender: "bot" }]);
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

    const renderAssistantAvatar = (sizeClass = "h-10 w-10", textClass = "text-sm") => (
        <div className={`${sizeClass} shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm`}>
            {logoImageSrc ? (
                <img src={logoImageSrc} alt={displayName} className="h-full w-full object-cover" />
            ) : (
                <span className={`flex h-full w-full items-center justify-center font-semibold text-orange-700 ${textClass}`}>
                    {assistantInitial}
                </span>
            )}
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 48 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen min-w-0 flex-col overflow-hidden bg-white lg:inset-auto lg:bottom-6 lg:right-6 lg:h-[620px] lg:max-h-[calc(100vh-3rem)] lg:w-[350px] lg:max-w-[calc(100vw-3rem)] lg:rounded-[24px] lg:border lg:border-slate-200 lg:shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
            >
                <div className="border-b border-slate-200 bg-white px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {renderAssistantAvatar("h-11 w-11", "text-base")}
                            <div className="min-w-0">
                                <p className="text-[15px] font-semibold leading-tight text-slate-900">Support Assistant</p>
                                <p className="truncate text-[13px] text-slate-500">{displayName}</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    <span className="text-[11px] font-medium text-slate-400">Ready to help</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={toggleChatbot}
                            aria-label="Close chat"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto bg-[#f3f5f8] px-3 py-4 md:px-4"
                >
                    {!hasMessages && !isLoading ? (
                        <div className="flex h-full flex-col justify-between gap-5">
                            <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    {renderAssistantAvatar("h-10 w-10", "text-sm")}
                                    <div>
                                        <p className="text-base font-semibold text-slate-900">How can we help today?</p>
                                        <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                                            Ask about our organization, contact details, projects, or ways to get involved.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Quick Start
                                </p>
                                <div className="space-y-2">
                                    {sampleQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => sendMessage(question)}
                                            className="group flex w-full items-center justify-between rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-left text-[13px] font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                                        >
                                            <span className="pr-3 leading-relaxed">{question}</span>
                                            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-slate-600" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.sender === "bot" && renderAssistantAvatar("h-8 w-8", "text-xs")}

                                    <div
                                        className={`max-w-[82%] px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                                            msg.sender === "user"
                                                ? "rounded-[20px] rounded-br-md bg-orange-500 text-white"
                                                : "rounded-[20px] rounded-bl-md border border-slate-200 bg-white text-slate-700"
                                        }`}
                                    >
                                        <span className="block whitespace-pre-wrap break-words">{msg.text}</span>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-center gap-2">
                                    {renderAssistantAvatar("h-8 w-8", "text-xs")}
                                    <div className="typing-indicator rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-200 bg-white px-3 py-3 md:px-4">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                        <input
                            type="text"
                            value={input}
                            onKeyDown={handleEnter}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Write a message..."
                            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                        <button
                            onClick={() => sendMessage()}
                            aria-label="Send message"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                            disabled={isLoading || !input.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-400">
                        Responses are for assistance only. Please call or message us for urgent matters.
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatBox;
