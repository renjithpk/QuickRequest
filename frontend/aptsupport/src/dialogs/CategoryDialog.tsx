import React from "react";
import { Dialog, Field } from "../base/Dialog.tsx";
import { Category, createCategory, updateCategory, deleteCategory } from "../utils/backend.ts";

// CategoryDialog Component
interface CategoryDialogProps {
  action: "create" | "update";
  onClose: () => void;
  defaultValues?: Partial<Category>;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ action, onClose, defaultValues }) => {
  const handleCreate = async (data: Record<string, any>) => {
    try {
      await createCategory(data.name);
      console.log("Category Created:", data);
      onClose();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleUpdate = async (data: Record<string, any>) => {
    if (!defaultValues?.id) return;
    try {
      await updateCategory(defaultValues.id, data.name);
      console.log("Category Updated:", data);
      onClose();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDelete = async () => {
    if (!defaultValues?.id) return;
    try {
      await deleteCategory(defaultValues.id);
      console.log("Category Deleted:", defaultValues);
      onClose();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const dialogFields: Field[] = [
    { name: "name", label: "Name", type: "text", required: true, default: defaultValues?.name }
  ];

  return (
    <Dialog
      title={action === "create" ? "Create Category" : "Update Category"}
      fields={dialogFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onCancel={onClose}
      action={action}
    />
  );
};

export default CategoryDialog;
