import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.css'

const IssueTable = ({ user, socket }) => {
  const [book, setBook] = useState([])

  const handleDelete = (row) => {
    setBook(book => book.filter(b => b.id !== row.id))
  }

  const onClearAll = () => {
    setBook([])
  }

  const handleIssue = () => {
    socket.emit('issue', book)
    Swal.fire({
      title: 'Success',
      text: 'Books issued successfully',
      icon: 'success',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    })
    setBook([])
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
      selector: (row) => row.issue_date,
      sortable: true,
      wrap: true,
      width: '10vw'
    },
    {
      name: 'Return Date',
      selector: (row) => row.return_date,
      sortable: true,
      wrap: true,
      width: '10vw'
    },
    {
      name: 'Action',
      cell: (row) => (
        <button className='btn btn-outline-danger btn-sm' onClick={() => handleDelete(row)}>Remove</button>
      ),
    }
  ]

  useEffect(() => {
    let isMounted = true
    socket.on('book', newBook => {
      if (isMounted) {
        // if you already have a copy of this book
        if (user.book.some(b => b.id === newBook.id)) {
          Swal.fire({
            title: 'Error',
            text: 'Book already issued to you',
            icon: 'error',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true
          })
        }
        // remove book from issue list if same book is scanned
        else if (book.some(b => b.rfid === newBook.rfid)) {
          setBook(books => {
            return books.filter(book => book.id !== newBook.id)
          })
        }
        // if copy of this book is already added to issue list
        else if (book.some(b => b.id === newBook.id)) {
          Swal.fire({
            title: 'Error',
            text: 'Book already added to issue list',
            icon: 'error',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true
          })
        }
        // if book is available to issue
        else if (newBook.student_id === 'NULL' || newBook.student_id === null) {
          setBook(b => {
            newBook.issue_date = new Date().toLocaleDateString().replace(/\//g, '-')
            newBook.return_date = new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString().replace(/\//g, '-')
            newBook.student_id = user.roll
            return [...b, newBook]
          })
        }
        // if book is issued to someone else 
        else {
          Swal.fire({
            title: 'Error',
            text: 'Book issued to someone else',
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
  }, [socket, user, book])

  return (
    <div className="table-container">
      <DataTable
        title="Checkout Books"
        columns={columns}
        data={book}
        fixedHeader
        fixedHeaderScrollHeight="600px"
        highlightOnHover
      />
      <button className={book.length === 0 ? "btn disabled" : "btn btn-success"}
        style={{ position: 'absolute', right: '2vw', bottom: '3vh', width: '10vw' }}
        disabled={book.length === 0}
        onClick={() => handleIssue()}>Proceed</button>
      <button className={book.length === 0 ? "btn disabled" : "btn btn-danger"}
        style={{ position: 'absolute', right: '13vw', bottom: '3vh', width: '10vw' }}
        onClick={() => onClearAll()}>Clear All</button>
    </div>
  )
}

export default IssueTable