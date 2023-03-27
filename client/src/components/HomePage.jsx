import React, { useState, useEffect } from 'react'
import io from "socket.io-client"
import IssueTable from './IssueTable'
import ReturnTable from './ReturnTable'
import Sidebar from './Sidebar'
import './HomePage.css'

let endPoint = "http://localhost:5000"
let socket = io.connect(`${endPoint}`)

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showIssueTable, setShowIssueTable] = useState(false);
    const [showReturnTable, setShowReturnTable] = useState(false);

    const onLogout = () => {
        socket.emit('logout')
        setShowSidebar(false)
        setShowIssueTable(false)
        setShowReturnTable(false)
    }

    useEffect(() => {
        let isMounted = true;
        socket.on('user', user => {
            if (isMounted) {
                setUser(user)
                if (user.books.length > 0) {
                    setShowReturnTable(true)
                }
                setShowIssueTable(true)
                setShowSidebar(true)
            }
        })
        return () => {
            isMounted = false;
            // socket.disconnect()
        }
    }, [])

    return (
        <div className="page-wrapper">
            <div className="sidebar-wrapper">
                {showSidebar && <Sidebar user={user} onLogout={onLogout}/>}
            </div>
            <div className="main-content">
                <div className="container">
                    {showReturnTable && <ReturnTable user={user} socket={socket}/>}
                </div>

                <div className="container">
                    {showIssueTable && <IssueTable user={user} socket={socket}/>}
                </div>
            </div>
        </div>
    )
}

export default HomePage;
