import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ElectricBorder from "../../reactBits/ElectricBorder/ElectricBorder";
import ShinyText from "../../reactBits/ShinyText/ShinyText";
import Particles from "../../reactBits/Particles/Particles";


function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      email: formData.email,
      fullName: {
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
      password: formData.password,
    };
    console.log("Form Data:", formData, finalData);
    await axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, finalData, {
        withCredentials: true,
      })
      .then((res) => {
        navigate("/home");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
  {/* Fullscreen Particles Background */}
  <Particles
    particleColors={['#ffffff', '#ffffff']}
    particleCount={200}
    particleSpread={10}
    speed={0.1}
    particleBaseSize={100}
    moveParticlesOnHover={true}
    alphaParticles={false}
    disableRotation={false}
    className="absolute inset-0 w-full h-full z-0"
  />

  {/* Foreground Content */}
  <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
    <ElectricBorder
      color="#FFFF00"
      speed={2}
      chaos={0.5}
      thickness={5}
      style={{ borderRadius: 16 }}
    >
      <div className="w-full max-w-md bg-white/50 p-6 rounded-2xl shadow-lg">
        <ShinyText
          text="Zero-GPT"
          disabled={false}
          speed={3}
          className="custom-class text-3xl text-gray-600 font-bold"
        />
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer mt-4 text-blue-400"
        >
          Old User Please Login
        </h1>
      </div>
    </ElectricBorder>
  </div>
</div>
  );
}

export default Register;
