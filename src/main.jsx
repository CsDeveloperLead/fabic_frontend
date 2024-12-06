import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './Components/Home.jsx'
import Login from './Components/Login.jsx'
import Signup from './Components/Signup.jsx'
import { AuthProvider } from './Components/AuthContext.jsx'
import ForgotPassword from './Components/ForgotPassword.jsx'
import StaffDashboard from './Components/StaffDashboard.jsx'
import AdminLogin from './Components/AdminComponents/AdminLogin.jsx'
import AdminDashboard from './Components/AdminComponents/AdminDashboard.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup-page' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/staff-dashboard' element={<StaffDashboard />} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
      </Route >
    </>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
