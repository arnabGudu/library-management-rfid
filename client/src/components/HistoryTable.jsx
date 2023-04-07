import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import 'bootstrap/dist/css/bootstrap.css'

const HistoryTable = ({ user }) => {
  const [book, setBook] = useState([])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  const StatusLabel = ({ label }) => {
    const labelStyle = {
      color: '#fff',
      padding: '0.2em 0.5em',
      borderRadius: '0.2em',
      display: 'inline-block',
    }
    let color = 'grey'
    if (label === 'RETURNED') {
      color = 'green'
    } else if (label === 'ISSUED') {
      color = 'blue'
    } else if (label === 'OVERDUE') {
      color = 'orange'
    } else if (label === 'LOST') {
      color = 'red'
    }
    return <label style={{ ...labelStyle, backgroundColor: `${color}` }}>{label}</label>
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
      name: 'Status',
      selector: (row) => <StatusLabel label={row.status} />,
      sortable: true,
      wrap: true,
      width: '200px'
    }
  ]

  useEffect(() => {
    setBook(user.history)
  }, [user])

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

export default HistoryTable