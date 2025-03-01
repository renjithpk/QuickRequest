import React, { useEffect, useState } from "react";
import { fetchTickets, Ticket } from "../utils/backend.ts";
import TableView from "../base/Table.tsx";


// Define column type
interface Column {
  id: string;
  header: string;
  accessorKey: keyof Ticket;
}

// Define component props
interface TicketsTableProps {
  onRowClick?: (ticket: Ticket) => void;
}

const TicketsTable: React.FC<TicketsTableProps> = ({ onRowClick }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const getTickets = async () => {
      try {
        const data: Ticket[] = await fetchTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    getTickets();
  }, []);

  const columns: Column[] = [
    { id: "title", header: "Title", accessorKey: "title" },
    { id: "description", header: "Description", accessorKey: "description" },
    { id: "category_id", header: "Category ID", accessorKey: "category_id" },
    { id: "subcategory_id", header: "Subcategory ID", accessorKey: "subcategory_id" },
    { id: "deadline", header: "Deadline", accessorKey: "deadline" },
  ];

  return (
    <div>
      <TableView
        columns={columns}
        data={tickets}
        onRowClick={onRowClick ? (row) => onRowClick(row as Ticket) : undefined}
      />
    </div>
  );
};

export default TicketsTable;
