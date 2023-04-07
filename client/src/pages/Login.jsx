import React from "react"
import "./Login.css"

function Login() {
  return (
    <div className="page-wrapper">
      <div className="box">
        <img src='assets/logo.png' alt="react logo" style={{ marginTop: '10px', width: '100px', height: '100px' }}/>
        <h4 style={{ marginTop: '20px', color: 'gray' }}>OUTR</h4>
        <h4 style={{ color: 'gray' }}>Library Management System</h4>
        <p style={{ marginTop: '20px', fontSize: '14px', color: 'lightslategray' }}>Please scan your ID card to continue</p>
        <div className="image-wrapper">
          <img src='assets/idcard.png' alt="react logo"/>
        </div>
      </div>
    </div>
  )
}

export default Login
