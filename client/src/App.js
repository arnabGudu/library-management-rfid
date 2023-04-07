import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import Login from './pages/Login'
import Main from './pages/Main'
import { ProSidebarProvider } from 'react-pro-sidebar'
import './App.css'

const ENDPOINT = "http://localhost:5000"

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState(null)
  const [bookList, setBookList] = useState([])

  useEffect(() => {
    setSocket(io(ENDPOINT))
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('booklist', b => {
        setBookList(b)
      })
    }
  })

  useEffect(() => {
    let isMounted = true
    if (socket) {
      socket.on('user', user => {
        if (isMounted) {
          console.log(user)
          setUser(user)
          handleLogin()
        }
      })
    }
    return () => {
      isMounted = false
    }
  })

  const handleLogin = () => {
    setLoggedIn(true)
  }

  const handleLogout = () => {
    setLoggedIn(false)
  }

  return (
    <div className="App">
      {loggedIn ? 
        <ProSidebarProvider>
          <Main handleLogout={handleLogout} user={user} socket={socket} bookList={bookList}/>
        </ProSidebarProvider> : 
        <Login handleLogin={handleLogin} setUser={setUser} socket={socket} />
      }
    </div>
  )
}

export default App