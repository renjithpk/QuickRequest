import React from "react";
import Dialog from "./Dialog.tsx";
import { createTicket, updateTicket } from "../utils/backend.ts";

// Define props interface
interface TicketDialogProps {
  action: "create" | "update";
  onCancel: () => void;
  defaultValues?: {
    title?: string;
    description?: string;
    category_id?: number;
    subcategory_id?: number;
    deadline?: string;
  };
}

// Component
const TicketDialog: React.FC<TicketDialogProps> = ({ action, onCancel, defaultValues }) => {
  // Function to handle ticket creation
  const handleCreate = async (data: Record<string, any>) => {
    const { title, description, category_id, subcategory_id, deadline } = data;

    if (!title || !description || !category_id || !subcategory_id || !deadline) {
      console.error("All fields are required");
      return;
    }

    try {
      const response = await createTicket(title, description, category_id, subcategory_id, deadline);
      console.log("Ticket created successfully:", response);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
    onCancel();
  };

  // Function to handle ticket update
  const handleUpdate = async (data: Record<string, any>) => {
    try {
      const response = await updateTicket(data.id, data.status, data.resolved);
      console.log("Ticket updated:", response);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  // Function to handle ticket deletion (if needed)
  const handleDelete = (data: Record<string, any>) => {
    console.log("Delete Ticket:", data);
  };

  // Fields for dialog form
  const dialogFields: { name: string; label: string; type: string; required: boolean; default?: any }[] = [
    { name: "title", label: "Title", type: "text", required: true, default: defaultValues?.title },
    { name: "description", label: "Description", type: "text", required: true, default: defaultValues?.description },
    { name: "category_id", label: "Category ID", type: "number", required: true, default: defaultValues?.category_id },
    { name: "subcategory_id", label: "Subcategory ID", type: "number", required: true, default: defaultValues?.subcategory_id },
    { name: "deadline", label: "Deadline", type: "datetime-local", required: true, default: defaultValues?.deadline },
  ];

  return (
    <Dialog
      title={action === "create" ? "Create Ticket" : "Update Ticket"}
      action={action}
      fields={dialogFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onCancel={onCancel}
    />
  );
};

export default TicketDialog;
