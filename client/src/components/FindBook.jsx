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
    },
    {
      name: 'Book Name',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Author',
      selector: (row) => row.author,
      sortable: true,
    },
    {
      name: 'Publisher',
      selector: (row) => row.publisher,
      sortable: true,
    },
    {
      name: 'Publication Year',
      selector: (row) => row.publication_year,
      sortable: true,
    },
    {
      name: 'Shelf',
      selector: (row) => row.shelf,
      sortable: true,
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