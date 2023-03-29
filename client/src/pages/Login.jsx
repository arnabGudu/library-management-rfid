import React, { useEffect } from "react"
import "./Login.css"
import idCardLogo from "../assets/idcard.png"

function Login({ handleLogin, socket, setUser }) {
  useEffect(() => {
    if (socket) {
      socket.on('user', user => {
        console.log(user)
        setUser(user)
        handleLogin()
      })
    }
    return () => { }
  }, [setUser, handleLogin, socket])

  return (
    <div className="page-wrapper">
      <div className="box">
        <h4 style={{ marginTop: '40px', color: 'gray' }}>Library Management System</h4>
        <p style={{ marginTop: '30px', fontSize: '14px', color: 'lightslategray' }}>Please scan your ID card to continue</p>
        <div className="image-wrapper">
          <img src={idCardLogo} alt="react logo" />
        </div>
      </div>
    </div>
  )
}

export default Login
