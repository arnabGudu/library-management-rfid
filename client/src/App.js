import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

const ENDPOINT = "http://192.168.29.192:3000"

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setSocket(io(ENDPOINT))
  }, [])

  const handleLogin = () => {
    setLoggedIn(true)
  }

  const handleLogout = () => {
    setLoggedIn(false)
  }

  return (
    <div className="App">
      {loggedIn ? 
        <Dashboard handleLogout={handleLogout} user={user} socket={socket}/> : 
        <Login handleLogin={handleLogin} setUser={setUser} socket={socket} />
      }
    </div>
  )
}

export default App