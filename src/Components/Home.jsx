import React from 'react'
import { NavLink } from 'react-router-dom'

function Home() {
  
  return (
    <div className='w-full h-screen flex justify-between'>
      Home
      <NavLink to='/login'>
      Login
      </NavLink>
    </div>
  )
}

export default Home