import React from "react";
import { Dialog, Field } from "../base/Dialog.tsx";
import { Subcategory } from "../utils/backend.ts";

// Define props interface
interface SubCategoryDialogProps {
  action: "create" | "update";
  onCancel: () => void;
  defaultValues?: Partial<Subcategory>;
}

// Component
const SubCategoryDialog: React.FC<SubCategoryDialogProps> = ({ action, onCancel, defaultValues }) => {
  // Function to handle subcategory creation
  const handleCreate = (data: Record<string, any>) => {
    console.log("Add New Subcategory:", data);
    onCancel()
  };

  // Function to handle subcategory update
  const handleUpdate = (data: Record<string, any>) => {
    console.log("Update Subcategory:", data);
    onCancel()
  };

  // Function to handle subcategory deletion
  const handleDelete = (data: Record<string, any>) => {
    console.log("Delete Subcategory:", data);
    onCancel()
  };

  const dialogFields: Field[] = [
    { name: "name", label: "Name", type: "text", required: true, default: defaultValues?.name },
    { name: "category_id", label: "Category ID", type: "number", required: true, default: defaultValues?.category_id },
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
