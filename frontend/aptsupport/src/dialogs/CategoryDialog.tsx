import React from "react";
import Dialog from "./Dialog.tsx";

// Define props interface
interface CategoryDialogProps {
  mode: "create" | "update";
  onCancel: () => void;
}

// Component
const CategoryDialog: React.FC<CategoryDialogProps> = ({ mode, onCancel }) => {
  // Function to handle category creation
  const handleCreate = (data: Record<string, any>) => {
    console.log("Add New Category:", data);
  };

  // Function to handle category update
  const handleUpdate = (data: Record<string, any>) => {
    console.log("Update Category:", data);
  };

  // Fields for dialog form
  const dialogFields: { name: string; label: string; type: string; required: boolean }[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "description", label: "Description", type: "text", required: true },
  ];

  return (
    <Dialog
      title={mode === "create" ? "Create Category" : "Update Category"}
      fields={dialogFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onCancel={onCancel}
      mode={mode}
      resource="category"
    />
  );
};

export default CategoryDialog;
