import React, { useState, useEffect } from 'react'
import IssueTable from '../components/IssueTable'
import ReturnTable from '../components/ReturnTable'
import Sidebar from '../components/Sidebar'
import Swal from 'sweetalert2'
import './Dashboard.css'

const Dashboard = ({handleLogout, socket, user}) => {
    const [showReturnTable, setShowReturnTable] = useState(false)

    const onLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout()
            }
        })
    }

    useEffect(() => {
        if (user.books.length > 0) {
            setShowReturnTable(true)
        }
        return () => {
        }
    }, [user])

    return (
        <div className="page-wrapper">
            <div className="sidebar-wrapper">
                <Sidebar user={user} onLogout={onLogout} />
            </div>
            <div className="main-content">
                <header className='header'>Library Management System</header>
                <div className="container">
                    {showReturnTable && <ReturnTable user={user} socket={socket} />}
                </div>
                <div className="container">
                    {<IssueTable user={user} socket={socket} onLogout={onLogout} />}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
