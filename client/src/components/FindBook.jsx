import React from 'react'
import DataTable from 'react-data-table-component'
import 'bootstrap/dist/css/bootstrap.css'

const FindBook = ({ bookList, query }) => {
  const filteredData = bookList.filter((item) => {
    return item.title.toLowerCase().includes(query.toLowerCase()) || 
           item.author.toLowerCase().includes(query.toLowerCase()) || 
           item.publisher.toLowerCase().includes(query.toLowerCase()) || 
           item.publication_year.toString().toLowerCase().includes(query.toLowerCase()) || 
           item.shelf.toLowerCase().includes(query.toLowerCase())
  });

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
      name: 'Publisher',
      selector: (row) => row.publisher,
      sortable: true,
      wrap: true,
      width: '12vw'
    },
    {
      name: 'Publication Year',
      selector: (row) => row.publication_year,
      sortable: true,
      width: '10vw'
    },
    {
      name: 'Shelf',
      selector: (row) => row.shelf,
      sortable: true,
      wrap: true,
      width: '8vw'
    },
    {
      name: 'Available',
      selector: (row) => `${row.available} / ${row.total}`,
      sortable: true,
      wrap: true,
      width: '8vw'
    }
  ]

  return (
    <DataTable
      title="Search Books"
      columns={columns}
      data={filteredData}
      fixedHeader
      fixedHeaderScrollHeight="600px"
      highlightOnHover
    />
  )
}

export default FindBook