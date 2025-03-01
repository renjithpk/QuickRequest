import React from "react";
import { Dialog, Field } from "../base/Dialog.tsx";
import { createTicket, updateTicket, deleteTicket, Ticket } from "../utils/backend.ts";

// Define props interface
interface TicketDialogProps {
  action: "create" | "update";
  onClose: () => void;
  defaultValues?: Partial<Ticket>;
}

// Component
const TicketDialog: React.FC<TicketDialogProps> = ({ action, onClose, defaultValues }) => {
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
    onClose();
  };

  const handleUpdate = async (data: Record<string, any>) => {
    if (!data.id) {
      console.error("Missing ticket ID!");
      return;
    }

    console.log("Ticket ID:", data.id);  // Debug log

    try {
      const response = await updateTicket(
        data.id,
        data.status ?? undefined,
        data.resolved ?? undefined,
        data.title ?? undefined,
        data.description ?? undefined,
        data.category_id ?? undefined,
        data.subcategory_id ?? undefined,
        data.deadline ?? undefined
      );
      console.log("Ticket updated:", response);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
    onClose();
  };


  // Function to handle ticket deletion (if needed)
  // Function to handle ticket deletion (with improved error handling and logging)
  const handleDelete = async (data: Record<string, any>) => {
    console.log("Attempting to delete ticket:", data);  // Log the input data

    if (!data.id) {
      console.error("Missing ticket ID!");
      return;
    }

    try {
      console.log(`Sending DELETE request for ticket ID: ${data.id}`);
      await deleteTicket(data.id);
      console.log(`Successfully deleted ticket ID: ${data.id}`);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    } finally {
      onClose();  // Close the modal or reset UI state
    }
  };
  // Fields for dialog form
  const dialogFields: Field[] = [
    { name: "id", label: "ID", type: "number", required: true, default: defaultValues?.id },
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
      onCancel={onClose}
    />
  );
};

export default TicketDialog;