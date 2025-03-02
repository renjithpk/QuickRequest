import React, { useState, useEffect } from "react";
import { fetchSubcategories, Subcategory } from "../utils/backend.ts";
import TableView from "../base/Table.tsx";



interface SubCategoryTableProps {
  onRowClick?: (id: number) => void;
  reloadTrigger?: boolean;
}

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({ onRowClick, reloadTrigger }) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSubcategories();
        setSubcategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchData();
  }, [reloadTrigger]);

  const columns = [
    { id: "id", header: "ID", accessorKey: "id" },
    { id: "name", header: "Subcategory Name", accessorKey: "name" },
    { id: "category_id", header: "Category ID", accessorKey: "category_id" },
  ];

  return (
    <div>
      <h3>Subcategories</h3>
      <TableView
        columns={columns}
        data={subcategories}
        onRowClick={onRowClick ? (row) => onRowClick(row.id) : undefined}
      />
    </div>
  );
};

export default SubCategoryTable;
