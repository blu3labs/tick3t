import React from 'react'
import { Link } from 'react-router-dom'
import Logo from "@/assets/vite.svg"
import './index.css'

function Header() {
  return (
    <div className='header'>
      <Link to="/" className='headerLogo'>
        <img src={Logo} alt='logo' draggable='false' />
        <span>TICK3T</span>
      </Link>

      <div className='headerRightContent'>
        <button className='connectBtn'>
          Connect
        </button>
      </div>
    </div>
  )
}

export default Header