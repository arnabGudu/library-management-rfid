import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.css'

const ReturnTable = ({ user, socket }) => {
    const [books, setBook] = useState([])

    const handleReissue = (row) => {
        const returnDate = new Date(row.returnDate)
        const currentDate = new Date()
        if (returnDate.getTime() > currentDate.getTime()) {
            Swal.fire({
                title: 'Success',
                text: 'Book reissued successfully',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            })
            socket.emit('reissue', row)
        } else {
            Swal.fire({
                title: 'Failure',
                text: 'Due date is over, cannot reissue',
                icon: 'error',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            })
        }
    }

    const handleReturn = (row) => {
        Swal.fire({
            title: 'Return',
            text: 'Please scan book to return',
            icon: 'info',
            timer: 3000,
            timerProgressBar: true,
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
            selector: (row) => formatDate(row.issueDate),
            sortable: true,
        },
        {
            name: 'Return Date',
            selector: (row) => formatDate(row.returnDate),
            sortable: true,
        },
        {
            name: '',
            cell: (row) => (
                <button className='btn btn-outline-primary btn-sm' onClick={() => handleReissue(row)}>Reissue</button>
            ),
        },
        {
            name: '',
            cell: (row) => (
                <button className='btn btn-outline-success btn-sm' onClick={() => handleReturn(row)}>Return</button>
            ),
        }
    ]

    useEffect(() => {
        if (user.books.length !== 0) {
            setBook(user.books)
        }
    }, [user.books])

    useEffect(() => {
        let isMounted = true
        socket.on('return', returnBook => {
            if (isMounted) {
                setBook(books => {
                    const isExisting = books.some(book => book.id === returnBook.id)
                    if (isExisting) {
                        socket.emit('returned', returnBook)
                        Swal.fire(
                            'Return Process [ 1 / 2 ]',
                            'Please keep the book on respective shelf to complete the return process',
                            'success'
                        )
                        return books.filter(book => book.id !== returnBook.id)
                    }
                })
            }
        })

        return () => {
            isMounted = false
        }
    }, [socket])

    return (
        <DataTable
            title="Last Issued Books"
            columns={columns}
            data={books}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            highlightOnHover
        />
    )
}

export default ReturnTable