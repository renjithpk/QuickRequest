import React, { useEffect, useState } from 'react';
import { fetchTickets } from './utils/backend.ts';
import TableView from './TableView';

const TicketList = ({ onRowClick }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const getTickets = async () => {
      try {
        const data = await fetchTickets();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    getTickets();
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