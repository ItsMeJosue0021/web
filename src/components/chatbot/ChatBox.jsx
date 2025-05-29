import React from 'react';
import { X } from 'lucide-react';
import { useState } from 'react';
import axios from "axios";
import { Bot } from 'lucide-react';
import '../../css/loading.css'; 
import { motion, AnimatePresence } from 'framer-motion';

const ChatBox = ({toggleChatbot}) => {

    const [input, setInput] = useState(""); 
    const [messages, setMessages] = useState([]); 
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    const handleToggleChatbot = () => {
        toggleChatbot();
    }

    const sendMessage = async (message = input) => {
        message = String(message || "").trim(); // Ensure message is a string and trim whitespace
        if (!message) return;

        setInput("");

        // Append user's message to the conversation history
        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);

        // Show loading message
        setIsLoading(true);

        try {
            const response = await axios.post("https://api.kalingangkababaihan.com/api/chat", {
                message: message,
                history: newMessages.map(msg => ({ text: msg.text, sender: msg.sender })) // Send full chat history
            });

            const botMessage = response.data.message || "I'm sorry, I don't have an answer right now.";

            // Append bot's response to the chat history
            setMessages(prevMessages => [...prevMessages, { text: botMessage, sender: "bot" }]);
        } catch (error) {
            setMessages(prevMessages => [...prevMessages, { text: "Error: Unable to fetch response", sender: "bot" }]);
            console.error(error);
        } finally {
            setIsLoading(false); // Hide loading message
        }
    };

    const sampleQuestions = [
        "What is Kalingang Kababaihan WLLPC?",
        "Where is Kalingang Kababaihan WLLPC located?",
        "What does your organization do?"
    ];
    
    const handleSampleClick = (question) => {
        sendMessage(question);
        console.log(question);
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            sendMessage(input);
        }
    }

    return (
        <AnimatePresence>
            <motion.div 
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 bottom-32 md:right-20 w-80 bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-orange-600 text-white p-3 flex justify-between items-center">
                    <div className='flex items-end gap-2'>
                        <Bot strokeWidth={4} className="w-7 h-7" />
                        <span className="font-semibold chewy">Kalinga ng Kababaihan</span>
                    </div>
                    
                    <button className="bg-transparent text-xm" onClick={handleToggleChatbot}>
                        <X/>
                    </button>
                </div>
                <div className="">
                    <div className="w-full rounded-lg p-4 ">
                        <div className='relative p-4 h-[300px] hide-scrollbar overflow-y-auto w-full flex flex-col rounded-lg space-y-2 bg-white bg-opacity-40'>
                            {messages.map((msg, index) => (
                                <div 
                                key={index} 
                                className={`max-w-[75%] px-3 py-2 border border-gray-300 rounded-md ${
                                    msg.sender === 'user' ? 'bg-orange-50 self-end' : 'bg-gray-50 self-start'
                                }`}
                                >
                                <strong className='text-sm'>{msg.sender === "user" ? "You:" : "Chatbot:"}</strong>
                                <p className='text-xs'>{msg.text}</p>
                                </div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="self-start px-3 py-2 text-sm">
                                    <div className="flex space-x-1">
                                        <div className="dot dot-1 w-2 h-2 bg-gray-500 rounded-full"></div>
                                        <div className="dot dot-2 w-2 h-2 bg-gray-500 rounded-full"></div>
                                        <div className="dot dot-3 w-2 h-2 bg-gray-500 rounded-full"></div>
                                        <div className="dot dot-4 w-2 h-2 bg-gray-500 rounded-full"></div>
                                    </div>
                                </div>
                            )}
                            
                            { messages && messages.length === 0 && (
                                <div className="absolute right-0 bottom-0 w-full flex flex-wrap gap-2 max-w-[800px] p-4">
                                    {sampleQuestions.map((question, index) => (
                                        <button 
                                            key={index} 
                                            className="px-3 py-2 text-xs text-left bg-orange-100 rounded-md hover:bg-orange-100 bg-opacity-50 transition"
                                            onClick={() => handleSampleClick(question)}
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 input-box p-2 rounded-md border">
                            <input type="text" value={input} onKeyDown={handleEnter} onChange={(e) => setInput(e.target.value)} placeholder="Ask something..." className='text-xs outline-none' />
                            <button className='text-xs text-white bg-orange-600 rounded' onClick={() => sendMessage()}>Send</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
       
    )
}

export default ChatBox;