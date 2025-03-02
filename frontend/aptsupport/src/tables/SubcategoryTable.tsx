import React, { useState, useEffect } from "react";
import { fetchSubcategories, fetchCategories, Subcategory, Category } from "../utils/backend.ts";
import TableView from "../base/Table.tsx";

// Define component props
interface SubCategoryTableProps {
  onRowClick?: (id: number) => void;
  reloadTrigger?: boolean;
}

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({ onRowClick, reloadTrigger }) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Record<number, Category>>({});

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
      const data = await fetchSubcategories();
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    getCategories();        // Fetch categories on mount
    getSubcategories();     // Fetch subcategories on mount
  }, []);

  useEffect(() => {
    if (reloadTrigger !== undefined) {
      getCategories();        // Re-fetch categories when reloadTrigger changes
      getSubcategories();     // Re-fetch subcategories when reloadTrigger changes
    }
  }, [reloadTrigger]);

  // Transform subcategories to include category name
  const subcategoriesWithCategory = subcategories.map((subcategory) => ({
    ...subcategory,
    category: categories[subcategory.category_id]?.name || "Unknown",  // Map category name
  }));

  const columns = [
    { id: "id", header: "ID", accessorKey: "id" },
    { id: "name", header: "Subcategory Name", accessorKey: "name" },
    { id: "category", header: "Category", accessorKey: "category" },  // Updated column for category name
  ];

  return (
    <div>
      <h3>Subcategories</h3>
      <TableView
        columns={columns}
        data={subcategoriesWithCategory}  // Use transformed subcategories
        onRowClick={onRowClick ? (row) => onRowClick(row.id) : undefined}
      />
    </div>
  );
};

export default SubCategoryTable;
