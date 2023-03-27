import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import 'bootstrap/dist/css/bootstrap.css'

const ReturnTable = ({ user, socket }) => {
    const [books, setBook] = useState([])

    const handleReissue = (row) => {
        setBook(books => books.filter(book => book.id !== row.id));
        socket.emit('reissue', row);
    }

    const handleReturn = (row) => {
        alert('Scan book to return');
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
        let isMounted = true;
        socket.on('return', returnBook => {
            if (isMounted) {
                setBook(books => {
                    const isExisting = books.some(book => book.id === returnBook.id)
                    if (isExisting) {
                        socket.emit('returned', returnBook)
                        alert('Book returned successfully')
                        return books.filter(book => book.id !== returnBook.id)
                    }
                })
            }
        })

        return () => {
            isMounted = false;
            // socket.disconnect()
        }
    }, [socket])

    return (
        <DataTable
            title="Books Issued"
            columns={columns}
            data={books}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            highlightOnHover
        />
    )
}

export default ReturnTable