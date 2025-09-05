import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import ChatWindow from './components/ChatWindow'


function AppRoutes() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/home" element={<Home/>} />
        <Route path='/home/:chatid' element={<Home />} />
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
