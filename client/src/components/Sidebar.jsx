import React from 'react'
import userLogo from "../assets/user.png"
import './Sidebar.css'

const Sidebar = ({ user, onLogout }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-user">
                <img src={userLogo} alt="user" className="sidebar-avatar" />
                <div className="sidebar-user-info">
                    <h4 className="sidebar-user-name">{user.name}</h4>
                    <p className="sidebar-user-roll">Roll: {user.roll}</p>
                    <p className='sidebar-user-dept'>Dept: {user.dept}</p>
                </div>
            </div>
            <ul className="sidebar-nav">
                <li className="sidebar-nav-item">
                    Dashboard
                </li>
                <li className="sidebar-nav-item">
                    Profile
                </li>
                <li className="sidebar-nav-item">
                    <button onClick={() => onLogout()} className="sidebar-logout-button">
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar
