import React, { useState } from 'react'
import IssueTable from '../components/IssueTable'
import ReturnTable from '../components/ReturnTable'
import FindBook from '../components/FindBook'
import AboutUs from '../components/AboutUs'

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar"
import { IoMdSpeedometer, IoMdReturnLeft, IoMdLogOut, IoIosSearch, IoMdPeople } from "react-icons/io"
import Swal from 'sweetalert2'

const Main = ({ handleLogout, socket, user, bookList }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('issuebook')
  const [query, setQuery] = useState('')

  const handleMenuItemClick = (menuKey) => {
    console.log(menuKey)
    setSelectedMenuItem(menuKey)
  }

  const handleSearch = (event) => {
    setQuery(event.target.value);
  }

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
        console.log('logout')
        handleLogout()
      }
    })
  }

  let mainContent = null
  switch (selectedMenuItem) {
    case 'issuebook':
      mainContent = <IssueTable user={user} socket={socket} />
      break
    case 'returnbook':
      mainContent = <ReturnTable user={user} socket={socket} />
      break
    case 'aboutus':
      mainContent = <AboutUs />
      break
    default:
      mainContent = <div>404</div>
      break
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar>
        <div style={{ padding: '2vw', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1vh', marginBottom: '0vh', textAlign: 'center' }}>
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', marginBottom: '3vh'}}>
            <img src={`assets/avatars/${user.first_name}.jpg`} alt='Not found' style={{ width: '100%', height: '100%'}} 
                 onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src="assets/user.png"; }}/>
          </div>
          <h4>{user.first_name} {user.last_name}</h4>
          <p>{user.roll}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '-10px' }}>{user.dept}</p>
        </div>
        <Menu>
          <MenuItem icon={<IoMdSpeedometer />} onClick={() => handleMenuItemClick('issuebook')} style={selectedMenuItem === 'issuebook' ? {backgroundColor: '#ECECEC'} : {}}>Issue Book</MenuItem>
          <MenuItem icon={<IoMdReturnLeft />} onClick={() => handleMenuItemClick('returnbook')} style={selectedMenuItem === 'returnbook' ? {backgroundColor: '#ECECEC'} : {}}>Return Book</MenuItem>
          <MenuItem icon={<IoMdPeople />} onClick={() => handleMenuItemClick('aboutus')} style={selectedMenuItem === 'aboutus' ? {backgroundColor: '#ECECEC'} : {}}>About Us</MenuItem>
          <MenuItem icon={<IoMdLogOut />} onClick={() => onLogout()}>Logout</MenuItem>
        </Menu>
      </Sidebar>
      <main style={{ width: '100vw', padding: '2vh', backgroundColor: '#e7ebee' }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative'}}>
          <h2 style={{ color: "#3498db", marginBottom: '2vh', marginTop: '2vh', fontWeight: '300' }}>
            Library Management System
          </h2>
          <div style={{ position: 'absolute', right: '10px' }}>
            <IoIosSearch style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)', color: 'gray' }}/>
            <input type="text" onChange={handleSearch} placeholder="Search..." style={{ padding: '5px', borderRadius: '30px', border: '1px solid gray', paddingLeft: '40px', width: '20vw' }}/>
          </div>
        </div>
        <div style={{ height: '87vh', backgroundColor: 'white', padding: '3vh', borderRadius: '10px', position: 'relative' }}>
          {query.length === 0 ? mainContent : <FindBook bookList={bookList} query={query} />}
        </div>
      </main>
    </div>
  )
}

export default Main
