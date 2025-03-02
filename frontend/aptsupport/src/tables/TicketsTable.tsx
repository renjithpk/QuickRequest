import React, { useEffect, useState } from "react";
import { fetchTickets, fetchCategories, fetchSubcategories, Ticket, Category, Subcategory } from "../utils/backend.ts";
import TableView from "../base/Table.tsx";

// Define column type
interface Column {
  id: string;
  header: string;
  accessorKey: keyof Ticket | "category" | "subcategory";  // Include "category" and "subcategory" as valid accessors
}

// Define component props
interface TicketsTableProps {
  onRowClick?: (id: number) => void;
  reloadTrigger?: boolean;
}

const TicketsTable: React.FC<TicketsTableProps> = ({ onRowClick, reloadTrigger }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Record<number, Category>>({});
  const [subcategories, setSubcategories] = useState<Record<number, Subcategory>>({});

  // Fetch tickets
  const getTickets = async () => {
    try {
      const data: Ticket[] = await fetchTickets();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  // Fetch categories
  const getCategories = async () => {
    try {
      const data: Category[] = await fetchCategories();
      const categoriesMap = data.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as Record<number, Category>);
      setCategories(categoriesMap);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories
  const getSubcategories = async () => {
    try {
      const data: Subcategory[] = await fetchSubcategories();
      const subcategoriesMap = data.reduce((acc, subcategory) => {
        acc[subcategory.id] = subcategory;
        return acc;
      }, {} as Record<number, Subcategory>);
      setSubcategories(subcategoriesMap);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    getTickets();
    getCategories();      // Fetch categories on mount
    getSubcategories();   // Fetch subcategories on mount
  }, []);

  useEffect(() => {
    if (reloadTrigger !== undefined) {
      getTickets();
      getCategories();      // Re-fetch categories when reloadTrigger changes
      getSubcategories();   // Re-fetch subcategories when reloadTrigger changes
    }
  }, [reloadTrigger]);

  // Transform tickets to include category and subcategory names
  const ticketsWithDetails = tickets.map((ticket) => ({
    ...ticket,
    category: categories[ticket.category_id]?.name || "Unknown",
    subcategory: subcategories[ticket.subcategory_id]?.name || "Unknown",
  }));

  const columns: Column[] = [
    { id: "id", header: "ID", accessorKey: "id" },
    { id: "title", header: "Title", accessorKey: "title" },
    { id: "description", header: "Description", accessorKey: "description" },
    { id: "category", header: "Category", accessorKey: "category" },              // Updated column for category name
    { id: "subcategory", header: "Subcategory", accessorKey: "subcategory" },     // Updated column for subcategory name
    { id: "deadline", header: "Deadline", accessorKey: "deadline" },
  ];

  return (
    <div>
      <TableView
        columns={columns}
        data={ticketsWithDetails}  // Use transformed tickets with category and subcategory names
        onRowClick={onRowClick ? (row) => onRowClick(row.id) : undefined}
      />
    </div>
  );
};

export default TicketsTable;
