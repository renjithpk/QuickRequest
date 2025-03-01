import React from "react";
import { Dialog, Field } from "../base/Dialog.tsx";
import { 
  Subcategory, 
  createSubcategory, 
  updateSubcategory, 
  deleteSubcategory 
} from "../utils/backend.ts";

// Define props interface
interface SubCategoryDialogProps {
  action: "create" | "update";
  onClose: () => void;
  defaultValues?: Partial<Subcategory>;
  onSuccess?: () => void;  // Optional success callback
}

// Component
const SubCategoryDialog: React.FC<SubCategoryDialogProps> = ({ action, onClose, defaultValues, onSuccess }) => {
  // Function to handle subcategory creation
  const handleCreate = async (data: Record<string, any>) => {
    try {
      await createSubcategory(data.name, data.category_id);
      console.log("Subcategory Created:", data);
      onSuccess?.();  // Trigger success callback if provided
      onClose();
    } catch (error) {
      console.error("Failed to create subcategory:", error);
    }
  };

  // Function to handle subcategory update
  const handleUpdate = async (data: Record<string, any>) => {
    if (!defaultValues?.id) return;
    try {
      await updateSubcategory(defaultValues.id, data.name, data.category_id);
      console.log("Subcategory Updated:", data);
      onSuccess?.();  // Trigger success callback if provided
      onClose();
    } catch (error) {
      console.error("Failed to update subcategory:", error);
    }
  };

  // Function to handle subcategory deletion
  const handleDelete = async () => {
    if (!defaultValues?.id) return;
    try {
      await deleteSubcategory(defaultValues.id);
      console.log("Subcategory Deleted:", defaultValues);
      onSuccess?.();  // Trigger success callback if provided
      onClose();
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
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
      onCancel={onClose}
    />
  );
};

export default SubCategoryDialog;
