import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.css'
import './IssueTable.css'

const IssueTable = ({ user, socket, onLogout}) => {
  const [books, setBook] = useState([])

  const handleDelete = (row) => {
    setBook(books => books.filter(book => book.id !== row.id))
  }

  const handleIssue = () => {
    if (books.length === 0) {
      return
    }
    const newBooks = books.map(book => {
      return { ...book, issuedTo: user.roll }
    })
    setBook([])
    Swal.fire({
      title: 'Success',
      text: 'Books issued successfully',
      icon: 'success',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    })
    socket.emit('issue', newBooks)
  }

  const columns = [
    {
      name: 'Book ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Book Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Author',
      selector: (row) => row.author,
      sortable: true,
    },
    {
      name: 'Issue Date',
      selector: (row) => row.issueDate,
      sortable: true,
    },
    {
        name: 'Return Date',
        selector: (row) => row.returnDate,
        sortable: true,
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
    socket.on('add', newBook => {
      if (isMounted) {
        setBook(books => {
          const isExisting = books.some(book => book.id === newBook.id)
          if (isExisting) {
            return books.filter(book => book.id !== newBook.id)
          }

          newBook.issueDate = new Date().toLocaleDateString().replace(/\//g, '-')
          newBook.returnDate = new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString().replace(/\//g, '-')
          return [...books, newBook]
        })
      }
    })

    return () => {
      isMounted = false
    }
  }, [socket])

  return (
    <div className="table-container">
      <DataTable
        title="Checkout Books"
        columns={columns}
        data={books}
        fixedHeader
        fixedHeaderScrollHeight="600px"
        highlightOnHover
      />
      <button className="btn btn-success issue_button" onClick={() => handleIssue()}>Proceed</button>
      <button className="btn btn-danger cancel_button" onClick={() => onLogout()}>Cancel</button>
    </div>
  )
}

export default IssueTable