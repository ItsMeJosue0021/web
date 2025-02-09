import React from "react";
import { useState } from "react";
import axios from "axios";

const Chat = () => {

    const [input, setInput] = useState(""); // User input
    const [messages, setMessages] = useState([]); // Chat history

    // const sendMessage = async () => {
    //     if (!input.trim()) return; // Prevent empty messages

    //     // Add user message to chat history
    //     const newMessages = [...messages, { text: input, sender: "user" }];
    //     setMessages(newMessages);

    //     try {
    //         const apiKey = "AIzaSyCe25tFzOTbZ12zy7vW2E3fv9sHPWg5-aY"; // Get API key from .env
    //         const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    //         const response = await axios.post(url, {
    //             contents: [{ parts: [{ text: input }] }],
    //         });

    //         // Extract chatbot response
    //         const geminiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I don't know the answer.";

    //         console.log(response.data);

    //         // Add bot message to chat history
    //         setMessages([...newMessages, { text: geminiResponse, sender: "bot" }]);
    //     } catch (error) {
    //         console.error("Error:", error);
    //         setMessages([...newMessages, { text: "Error: Unable to fetch response", sender: "bot" }]);
    //     }

    //     setInput(""); // Clear input field after sending
    // };



    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/chat", { message: input });
            setMessages([...newMessages, { text: response.data?.candidates?.[0]?.content?.parts?.[0]?.text, sender: "bot" }]);
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