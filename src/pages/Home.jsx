import { useEffect, useState, useRef } from "react";
import axios from "axios";
import './index.css'
import { useNavigate, useParams } from "react-router-dom";
import { str_obj } from "../utils/common";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import TextCursor from "../../reactBits/TextCursor/TextCursor";
import { div } from "motion/react-client";

function Home() {
  const [homeUserId, setHomeUserId] = useState("");
  const navigate = useNavigate();
  // const closeButton = useRef(null);
  const [isOpen, setisOpen] = useState(true);

  const { chatid } = useParams();

  useEffect(() => {
    console.log(document.cookie);
    const cookieData = str_obj(document.cookie);
    // console.log(cookieData.token);

    const validUser = async () => {
      await axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true })
        .then((res) => {
          // console.log(res.data.user._id);
          console.log(res);
          const str = res.data.user._id;
          setHomeUserId(str);
          if (res.status === 200) {
            navigate("/home");
          }
        })
        .catch((err) => {
          alert("Please Login First");
          navigate("/");
          console.log(err);
        });
    };

    validUser();
  }, []);

  // Select Your last chat autoMaticaly
  useEffect(() => {
  const fetchChats = async () => {
    if (!homeUserId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${homeUserId}`);
      const chats = res.data.AllChat;

      // Sort newest first
      const sortedChats = chats.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

     

      // ✅ Auto-select latest chat if no chatid
      if (!chatid && sortedChats.length > 0) {
        navigate(`/home/${sortedChats[0]._id}`, { replace: true });
      }
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  fetchChats();
}, [homeUserId, chatid, navigate]);

  if (!homeUserId) {
    return <p>Loading data</p>;
  }

  const className = `${
    isOpen ? "xs:absolute xs:z-9" : "xs:absolute xs:left-[-300px] xs:z-[-9]"
  }`;

  // console.log(homeUserId);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen overflow-hidden bg-[#88BDF2] relative">
      
      <div className="flex absolute ">
        <div
          className={`${className} w-[300px] h-screen bg-[#4cb7fab6] flex flex-col`}
        >
          <Sidebar
            isOpen={isOpen}
            setisOpen={setisOpen}
            homeUserId={homeUserId}
          />
        </div>
        <div className="flex-1 z-6">
          <ChatWindow
            isOpen={isOpen}
            setisOpen={setisOpen}
            homeUserId={homeUserId}
          />
          {/* {chatid ? <ChatWindow isOpen={isOpen} setisOpen={setisOpen} homeUserId={homeUserId} /> : <p className="p-4">Select a chat to start messaging</p>} */}
        </div>
      </div>
      <TextCursor
        text="🇦🇮"
        delay={0.01}
        spacing={50}
        followMouseDirection={true}
        randomFloat={true}
        exitDuration={0.3}
        removalInterval={20}
        maxPoints={10}
        className="xs:hidden w-screen h-screen z-0 sm:absolute"
      />
    </div>
  );
}

export default Home;
