import React, { useState, useEffect } from "react";
import { fetchCategories, Category } from "../utils/backend.ts";
import TableView from "../base/Table.tsx";



interface CategoryTableProps {
  onRowClick?: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ onRowClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

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
        onRowClick={onRowClick ? (row) => onRowClick(row as Category) : undefined}
      />
    </div>
  );
};

export default CategoryTable;
