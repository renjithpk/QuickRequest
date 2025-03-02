import React, { useState, useEffect } from "react";
import { fetchCategories, Category } from "../utils/backend.ts";
import TableView from "../base/Table.tsx";



interface CategoryTableProps {
  onRowClick?: (id: number) => void;
  reloadTrigger?: boolean;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ onRowClick, reloadTrigger }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [reloadTrigger]);

  const columns = [
    { id: "id", header: "ID", accessorKey: "id" },
    { id: "name", header: "Category Name", accessorKey: "name" },
  ];

  return (
    <div>
      <h3>Categories</h3>
      <TableView
        columns={columns}
        data={categories}
        onRowClick={onRowClick ? (row) => onRowClick(row.id) : undefined}
      />
    </div>
  );
};

export default CategoryTable;
