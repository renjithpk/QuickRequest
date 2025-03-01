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
  reloadTrigger?: boolean;
}

const TicketsTable: React.FC<TicketsTableProps> = ({ onRowClick, reloadTrigger }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const getTickets = async () => {    // Extracted getTickets to a separate function
    try {
      const data: Ticket[] = await fetchTickets();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    getTickets();  // Initial fetch
  }, []);

  useEffect(() => {
    if (reloadTrigger !== undefined) {
      getTickets();  // Re-fetch when reloadTrigger changes
    }
  }, [reloadTrigger]);

  const columns: Column[] = [
    { id: "id", header: "ID", accessorKey: "id" },
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
