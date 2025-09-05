import React, { useState } from "react";
import { LoginPhoto } from "../photo";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Orb from "../../reactBits/Orb/Orb";
import ShinyText from "../../reactBits/ShinyText/ShinyText";


function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);

    await axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        navigate("/home");
        console.log(res);
      })
      .catch((err) => {
        alert("New User Please Register First");
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col sm:flex-row w-full h-screen bg-[#6A89A7]">
      {/* Left Side Photo (Hidden on xs) */}
      <div className="hidden sm:flex w-1/2 h-full">
        <img
          src={LoginPhoto}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Login Form */}
      <div className="w-full sm:w-1/2 h-screen flex flex-col justify-center items-center px-6 py-8 relative">
        {/* Orb Behind */}
        <div className="absolute inset-0 flex justify-center items-center z-0">
          <div className="w-[400px] h-[400px]">
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={200}
              forceHoverState={false}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="relative z-10 w-full max-w-md flex flex-col overflow-hidden justify-center items-center gap-5 p-6  rounded-xl hover:translate-y-2 hover:translate-x-2 transition-transform duration-300">
          <h1 className="text-2xl font-medium text-gray-800">
            Welcome to Zero-GPT
          </h1>
          <ShinyText
              text="Login Page"
              disabled={false}
              speed={3}
              className="custom-class text-4xl text-black font-bold"
            />

          <form onSubmit={handelSubmit} className="flex flex-col gap-4 w-full">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-black">Email:</label>
              <input
                type="email"
                name="email"
                onChange={handelChange}
                placeholder="Enter your Email"
                className=" border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/50"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-black">
                Password:
              </label>
              <input
                type="password"
                name="password"
                onChange={handelChange}
                placeholder="Enter your Password"
                className=" border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/50"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Login
            </button>
          </form>

          <h1
            onClick={() => navigate("/register")}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            New User? Please Register
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Login;
