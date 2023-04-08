import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.css'

const ReturnTable = ({ user, socket }) => {
  const [book, setBook] = useState([])

  const handleReissue = (row) => {
    Swal.fire({
      title: 'Success',
      text: 'Book reissued successfully',
      icon: 'success',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    })
    row.pending = 0
    socket.emit('reissue', row)
  }

  const handleReturn = (row) => {
    Swal.fire({
      title: 'Return',
      text: 'Please scan book to return',
      icon: 'info',
      showConfirmButton: true
    })
  }

  const handlePending = (row) => {
    Swal.fire({
      title: 'Return Pending',
      text: `Please keep the book on shelf ${row.shelf} to complete the return process`,
      icon: 'info',
      showConfirmButton: true
    })
  }

  const handleOverdue = (row) => {
    Swal.fire({
      title: 'Overdue',
      text: 'Please return the book as soon as possible',
      icon: 'info',
      showConfirmButton: true
    })
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  const columns = [
    {
      name: 'Book ID',
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      width: '8vw'
    },
    {
      name: 'Book Name',
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Author',
      selector: (row) => row.author,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Issue Date',
      selector: (row) => formatDate(row.issue_date),
      sortable: true,
      wrap: true,
      width: '10vw'
    },
    {
      name: 'Return Date',
      selector: (row) => formatDate(row.return_date),
      sortable: true,
      wrap: true,
      width: '10vw'
    },
    {
      name: '',
      cell: (row) => (
        <div>
          {new Date(row.return_date).getTime() < new Date().getTime() ? (
            <button className='btn btn-danger btn-sm' onClick={() => handleOverdue(row)} style={{ marginRight: '10px', width: '75px'}} >Overdue</button>) : (
            <button className='btn btn-outline-primary btn-sm' onClick={() => handleReissue(row)} style={{ marginRight: '10px', width: '75px' }}>Reissue</button>
          )
          }
          {row.pending === 1 ?
            <button className='btn btn-warning btn-sm' onClick={() => handlePending(row)} style={{ width: '75px' }}>Pending</button> :
            <button className='btn btn-outline-success btn-sm' onClick={() => handleReturn(row)} style={{ width: '75px' }}>Return</button>
          }
        </div>
      ),
      width: '200px'
    }
  ]

  useEffect(() => {
    setBook(user.book)
  }, [user.book])

  useEffect(() => {
    let isMounted = true
    socket.on('book', returnBook => {
      if (isMounted) {
        if (book.some(b => b.rfid === returnBook.rfid)) {
          socket.emit('pending', returnBook)
          Swal.fire(
            'Return Pending',
            `Please keep the book on shelf ${returnBook.shelf} to complete the return process`,
            'success'
          )
        } else {
          Swal.fire({
            title: 'Return Failed',
            text: 'Book is not issued to you',
            icon: 'error',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true
          })
        }
      }
    })

    return () => {
      isMounted = false
    }
  }, [socket, book])

  return (
    <DataTable
      title="Last Issued Books"
      columns={columns}
      data={book}
      fixedHeader
      fixedHeaderScrollHeight="600px"
      highlightOnHover
    />
  )
}

export default ReturnTable