import React from "react";
import { useState } from "react";
import axios from "axios";

const Chat = () => {

    const [input, setInput] = useState(""); 
    const [messages, setMessages] = useState([]); 
    const sendMessage = async () => {
        if (!input.trim()) return;
    
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/chat", { message: input });
    
            // Updated to match the Laravel response format
            const botMessage = response.data.message || "I'm sorry, I don't have an answer right now.";
    
            setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
            console.log(response.data);
        } catch (error) {
            setMessages([...newMessages, { text: "Error: Unable to fetch response", sender: "bot" }]);
            console.log(error);
        }
    
        setInput("");
    };


    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <div className="w-[800px] border border-gray-300 rounded-lg p-4">
                <div style={{ border: "1px solid black", padding: "10px", height: "300px", overflowY: "auto" }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                            <strong>{msg.sender === "user" ? "You:" : "Bot:"}</strong> {msg.text}
                        </div>
                    ))}
                </div>
                <div className=" input-box">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something..." />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat;