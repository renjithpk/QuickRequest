import React from "react";
import Dialog from "./Dialog.tsx";

// Define props interface
interface SubCategoryDialogProps {
  action: "create" | "update";
  onCancel: () => void;
}

// Component
const SubCategoryDialog: React.FC<SubCategoryDialogProps> = ({ action, onCancel }) => {
  // Function to handle subcategory creation
  const handleCreate = (data: Record<string, any>) => {
    console.log("Add New Subcategory:", data);
  };

  // Function to handle subcategory update
  const handleUpdate = (data: Record<string, any>) => {
    console.log("Update Subcategory:", data);
  };

  // Function to handle subcategory deletion
  const handleDelete = (data: Record<string, any>) => {
    console.log("Delete Subcategory:", data);
  };

  // Fields for dialog form
  const dialogFields: { name: string; label: string; type: string; required: boolean }[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "description", label: "Description", type: "text", required: true },
  ];

  return (
    <Dialog
      title={action === "create" ? "Create Subcategory" : "Update Subcategory"}
      fields={dialogFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      action={action}
      onCancel={onCancel}
    />
  );
};

export default SubCategoryDialog;
