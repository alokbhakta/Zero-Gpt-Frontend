import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import './index.css'
import { MenuBar } from "../photo";
import ReactMarkdown from "react-markdown";
import dotenv from 'dotenv'

function ChatWindow({isOpen, setisOpen, homeUserId}) {
  const { chatid } = useParams(); // chatId from params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);


  // 🔹 Fetch all messages for this chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/message/${chatid}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [chatid]);

  // 🔹 Connect socket.io when component mounts
  useEffect(() => {
    const tempSocket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });

    // Join specific chat room
    tempSocket.emit("join-chat", chatid);

    // Listen for new messages
    tempSocket.on("ai-response", (msg) => {
      console.log("Received new message:", msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: msg.content,
        },
      ]);
    });

    setSocket(tempSocket);

    // Cleanup on unmount
    return () => {
      tempSocket.disconnect();
    };
  }, [chatid]);


  // Auto scroll when new message comes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth",
    });

    }
  }, [messages]);


  // 🔹 Handle sending new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {

      // Emit message via socket to others
      if (socket) {
      socket.emit("ai-message", {
        chat: chatid,
        content: newMessage,
        role: "user",
        user: homeUserId,
      });
      }

      // Update UI instantly
      setMessages((prev) => [
      ...prev,
      { role: "user", content: newMessage }
    ]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handelClick = ()=>{
    setisOpen(!isOpen);
  }

  return (
    <div className="flex flex-col xs:w-screen h-screen max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
  {/* Header */}
  <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <img onClick={handelClick}  className="w-[25px] cursor-pointer" src={MenuBar} alt="" />
      <h2 className="text-lg font-semibold">Zero-Gpt</h2>
    </div>
    <span className="text-xs opacity-80">Chat ID: {chatid}</span>
  </div>

  {/* Messages */}
  <div ref={messagesEndRef}
 className="flex-1 overflow-y-auto p-4 bg-[#BDDDFC] no-scrollbar ">
    {messages.length === 0 ? (
      <p className="text-gray-800 text-center mt-10">No messages yet...</p>
    ) : (
      messages.map((msg) => (
        <div
          key={msg._id || Math.random()}
          className={`flex mb-3 ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs px-4 py-2 overflow-x-auto rounded-2xl text-sm shadow-sm ${
              msg.role === "user"
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-bl-none"
            }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        </div>
      ))
    )}

  </div>

  {/* Input box */}
  <>
  {
    chatid === undefined ? (<div className="text-center text-2xl p-2 bg-[#BDDDFC] text-red-600 font-bold">
      <h1>Please Create a new chat Or Select your previous chat </h1>
      </div>) :

    (<div className=" p-3 bg-[#BDDDFC] flex items-center gap-2">
    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:bg-white/50 focus:ring-blue-400"
      placeholder="Type a message..."
    />
    <button
      onClick={handleSendMessage}
      className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-colors"
    >
      Send
    </button>
  </div>)
  }
  </>
</div>
  );
}

export default ChatWindow;
