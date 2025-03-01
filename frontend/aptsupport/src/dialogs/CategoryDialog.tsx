import React from "react";
import { Dialog, Field } from "../base/Dialog.tsx";
import { Category } from "../utils/backend.ts";

// CategoryDialog Component
interface CategoryDialogProps {
  action: "create" | "update";
  onCancel: () => void;
  defaultValues?: Partial<Category>;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ action, onCancel, defaultValues }) => {
  const handleCreate = (data: Record<string, any>) => {
    console.log("Add New Category:", data);
  };

  const handleUpdate = (data: Record<string, any>) => {
    console.log("Update Category:", data);
    onCancel()
  };

  const handleDelete = (data: Record<string, any>) => {
    console.log("Delete Category:", data);
    onCancel()
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
      onCancel={onCancel}
      action={action}
    />
  );
};

export default CategoryDialog;
