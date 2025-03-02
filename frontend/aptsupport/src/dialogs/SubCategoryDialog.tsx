import React, { useState, useEffect } from "react";
import { Dialog, Field } from "../base/Dialog.tsx";
import { 
  Subcategory, 
  createSubcategory, 
  updateSubcategory, 
  deleteSubcategory, 
  fetchCategories, 
  Category 
} from "../utils/backend.ts";

// Define props interface
interface SubCategoryDialogProps {
  action: "create" | "update";
  onClose: () => void;
  defaultValues?: Partial<Subcategory>;
  onSuccess?: () => void;  // Optional success callback
}

const SubCategoryDialog: React.FC<SubCategoryDialogProps> = ({ action, onClose, defaultValues, onSuccess }) => {
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: number }[]>([]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        const categories: Category[] = await fetchCategories();
        const options = categories.map((cat) => ({ label: cat.name, value: cat.id }));
        setCategoryOptions(options);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategoryOptions();
  }, []);

  // Handle subcategory creation
  const handleCreate = async (data: Record<string, any>) => {
    try {
      await createSubcategory(data.name, parseInt(data.category_id, 10));
      console.log("Subcategory Created:", data);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create subcategory:", error);
    }
  };

  // Handle subcategory update
  const handleUpdate = async (data: Record<string, any>) => {
    if (!defaultValues?.id) return;
    try {
      await updateSubcategory(defaultValues.id, data.name, parseInt(data.category_id, 10));
      console.log("Subcategory Updated:", data);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update subcategory:", error);
    }
  };

  // Handle subcategory deletion
  const handleDelete = async () => {
    if (!defaultValues?.id) return;
    try {
      await deleteSubcategory(defaultValues.id);
      console.log("Subcategory Deleted:", defaultValues);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
  };

  // Define dialog fields with category dropdown
  const dialogFields: Field[] = [
    { name: "name", label: "Name", type: "text", required: true, default: defaultValues?.name },
    { 
      name: "category_id", 
      label: "Category", 
      type: "select", 
      required: true, 
      default: defaultValues?.category_id,
      options: categoryOptions  // Dropdown options for category
    },
  ];

  return (
    <Dialog
      title={action === "create" ? "Create Subcategory" : "Update Subcategory"}
      fields={dialogFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      action={action}
      onCancel={onClose}
    />
  );
};

export default SubCategoryDialog;
