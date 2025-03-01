import React from 'react';
import { X } from 'lucide-react';
import { useState } from 'react';
import axios from "axios";
import { Bot } from 'lucide-react';

const ChatBox = ({toggleChatbot}) => {

    const [input, setInput] = useState(""); 
    const [messages, setMessages] = useState([]); 

    const handleToggleChatbot = () => {
        toggleChatbot();
    }

    // const sendMessage = async (message = input) => {
    //     // if (!input.trim()) return;
    //     message = String(message || "").trim();

    //     if (!message) return;

    //     setInput("");
    
    //     const newMessages = [...messages, { text: message, sender: "user" }];
    //     setMessages(newMessages);
    
    //     try {
    //         const response = await axios.post("http://127.0.0.1:8000/api/chat", { message: message });
    
    //         const botMessage = response.data.message || "I'm sorry, I don't have an answer right now.";
    
    //         setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
    //         console.log(response.data);
    //     } catch (error) {
    //         setMessages([...newMessages, { text: "Error: Unable to fetch response", sender: "bot" }]);
    //         console.log(error);
    //     }
    
    // };

    const sendMessage = async (message = input) => {
        message = String(message || "").trim(); // Ensure message is a string and trim whitespace
        if (!message) return;

        setInput("");

        // Append user's message to the conversation history
        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/chat", {
                message: message,
                history: newMessages.map(msg => ({ text: msg.text, sender: msg.sender })) // Send full chat history
            });

            const botMessage = response.data.message || "I'm sorry, I don't have an answer right now.";

            // Append bot's response to the chat history
            setMessages(prevMessages => [...prevMessages, { text: botMessage, sender: "bot" }]);
        } catch (error) {
            setMessages(prevMessages => [...prevMessages, { text: "Error: Unable to fetch response", sender: "bot" }]);
            console.error(error);
        }
    };

    const sampleQuestions = [
        "What is your name?",
        "Tell me about your skills.",
        "What projects have you worked on?",
        "Where did you study?",
        "What programming languages do you know?",
    ];
    
    const handleSampleClick = (question) => {
        sendMessage(question);
        console.log(question);
    };

    return (
        <div className="fixed bottom-40 right-20 w-96 bg-white rounded-xl shadow-lg overflow-hidden">
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
                <div className="w-full rounded-lg p-4">
                    <div className='relative p-4 h-[400px] overflow-y-auto w-full flex flex-col rounded-lg space-y-2 bg-white bg-opacity-40'>
                        {messages.map((msg, index) => (
                        <div 
                        key={index} 
                        className={`max-w-[75%] px-3 py-2 border border-gray-300 rounded-md ${
                            msg.sender === 'user' ? 'bg-orange-50 self-end' : 'bg-gray-50 self-start'
                        }`}
                        >
                        <strong className='text-sm'>{msg.sender === "user" ? "You:" : "Chatbot:"}</strong>
                        <p>{msg.text}</p>
                        </div>
                    ))}
                        { messages && messages.length === 0 && (
                            <div className="absolute right-0 bottom-0 w-full flex flex-wrap gap-2 max-w-[800px] p-4">
                                {sampleQuestions.map((question, index) => (
                                    <button 
                                        key={index} 
                                        className="px-3 py-2 text-sm text-left bg-orange-100 rounded-md hover:bg-orange-100 bg-opacity-50 transition"
                                        onClick={() => handleSampleClick(question)}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 input-box p-2 rounded-md border">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something..." className='outline-none' />
                        <button className='text-white bg-orange-600 rounded' onClick={() => sendMessage()}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBox;