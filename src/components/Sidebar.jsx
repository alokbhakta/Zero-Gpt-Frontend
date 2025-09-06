import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import './index.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { div } from "motion/react-client";


function Sidebar({isOpen, setisOpen, homeUserId }) {
  const [allChat, setAllChat] = useState([]);
  const navigate = useNavigate();
  const { chatid } = useParams();

  const [openChat,setOpenChat] = useState('');
  const [email,setEmail] = useState('');
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName] = useState('')

  const fetchChats = async () => {
    if (!homeUserId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${homeUserId}`);
      const chats = res.data.AllChat;

    // Reverse (latest first)
    const sortedChats = chats.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setAllChat(sortedChats);

    // ✅ Auto-select the latest chat if none selected
    if (!chatid && sortedChats.length > 0) {
      navigate(`/home/${sortedChats[0]._id}`);
      setOpenChat(sortedChats[0]._id);
    }
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  //UserData Fetching in Sidebar
  const fetchUser = async ()=>{
    if (!homeUserId) return;
    try {
      const userData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,{ withCredentials: true });
      // console.log(userData.data.user.fullName);
      setEmail(userData.data.user.email);
      setFirstName(userData.data.user.fullName.firstName);
      setLastName(userData.data.user.fullName.lastName)
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  }

  useEffect(()=>{
    fetchUser();
  },[])

  useEffect(() => {
    fetchChats();
  }, [homeUserId]); // ✅ re-fetch when user changes

  const handleNewChat = async () => {
    try {
      const title = prompt("Enter Your Chat Title");
      if (!title) return;

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        { title },
        { withCredentials: true }
      );

      console.log(res);

      // ✅ Refresh chat list
      fetchChats();
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  const handelChatId = (id)=>{
    navigate(`/home/${id}`);
  }

  // if (!allChat.length) {
  //   return <p>Loading chats...</p>;
  // }

  const handelLogout = ()=>{
    Cookies.remove('token');
    setTimeout(()=>{
      navigate('/')
    },1000)
  }

  const handelClosebtn = ()=>{
    setisOpen(!isOpen);
  }

  return (
    <div className="w-[100%] h-screen gap-2 flex flex-col">
    <div className="w-[100%] h-[93%] flex flex-col px-4 pt-2">
      <div className="w-[100%] flex justify-between items-center">
        <button
          onClick={handleNewChat}
          className="border border-black-600 px-3 py-1 rounded-2xl bg-amber-50 cursor-pointer"
        >
          New Chat
        </button>
        <button onClick={handelClosebtn} className="border border-red-600 text-amber-50 bg-red-600 px-1 cursor-pointer">
          X
        </button>
      </div>

      {allChat.map((val, index) => (
        <div key={val._id || index} className="mt-2">
          <button onClick={()=> handelChatId(val._id)} className={`w-full text-left px-2 py-1 border rounded-md cursor-pointer 
              ${chatid === val._id 
                ? "bg-amber-300 border-amber-600 font-semibold"   // ✅ highlighted style
                : "hover:bg-amber-100"
              }`}>
            
            {val.title}
            
          </button>
        </div>
      ))}
    </div>
    <div className="w-[100%] flex items-center justify-between self-end px-3 bg-blue-400">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold">{firstName+" "+lastName}</h1>
        <p className="text-white">{email}</p>
      </div>
      <div><button onClick={handelLogout} className="border-2 font-medium cursor-pointer border-solid border-black px-2 rounded-2xl bg-red-600 text-white ">Logout</button></div>
    </div>
    </div>
  );
}

export default Sidebar;