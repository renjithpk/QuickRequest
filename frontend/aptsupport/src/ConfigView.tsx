import React, { useState, useEffect } from "react";
import { fetchCategories, fetchSubcategories } from "./utils/backend.ts";
import TableView from "./listView/TableView.tsx";

// Define category and subcategory types
interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

// Define merged data type for table
interface MergedData {
  id: number;
  subcategory_name: string;
  category_name: string;
  category_id: number;
}

// Define props to handle row clicks
interface ConfigViewProps {
  onRowClick?: (row: MergedData) => void;
}

const ConfigView: React.FC<ConfigViewProps> = ({ onRowClick }) => {
  const [data, setData] = useState<MergedData[]>([]);

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const [categories, subcategories]: [Category[], Subcategory[]] = await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
        ]);

        const mergedData: MergedData[] = subcategories.map((subcategory) => {
          const category = categories.find((cat) => cat.id === subcategory.category_id);
          return {
            id: subcategory.id,
            subcategory_name: subcategory.name,
            category_name: category ? category.name : "Unknown",
            category_id: subcategory.category_id,
          };
        });

        setData(mergedData);
      } catch (error) {
        console.error("Error fetching categories and subcategories:", error);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const columns = [
    { id: "id", header: "ID", accessorKey: "id" },
    { id: "subcategory_name", header: "Subcategory Name", accessorKey: "subcategory_name" },
    { id: "category_name", header: "Category Name", accessorKey: "category_name" },
    { id: "category_id", header: "Category ID", accessorKey: "category_id" },
  ];

  return (
    <div>
      <h3>Subcategories</h3>
      <TableView
        columns={columns}
        data={data}
        onRowClick={onRowClick ? (row) => onRowClick(row as MergedData) : undefined}
      />
    </div>
  );
};

export default ConfigView;
