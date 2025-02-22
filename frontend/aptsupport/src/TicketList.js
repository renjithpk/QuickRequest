import React, { useEffect, useState } from 'react';
import axios from "axios";
import TableView from './TableView';

const TicketList = ({onRowClick}) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/tickets/").then((response) => {
      setTickets(response.data);
    });
  }, []);

  const columns = [
    { id: 'title', header: 'Title', accessorKey: 'title' },
    { id: 'description', header: 'Description', accessorKey: 'description' },
    { id: 'category_id', header: 'Category ID', accessorKey: 'category_id' },
    { id: 'subcategory_id', header: 'Subcategory ID', accessorKey: 'subcategory_id' },
    { id: 'deadline', header: 'Deadline', accessorKey: 'deadline' },
  ];

  return (
    <div>
      <TableView columns={columns} data={tickets} onRowClick={onRowClick} />
    </div>
  );
};

export default TicketList;