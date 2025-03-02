import React, { useEffect, useState } from "react";
import { Dialog, Field } from "../base/Dialog.tsx";
import { 
  createTicket, 
  updateTicket, 
  deleteTicket, 
  fetchCategories, 
  fetchSubcategories, 
  Ticket, 
  Category, 
  Subcategory 
} from "../utils/backend.ts";

// Define props interface
interface TicketDialogProps {
  action: "create" | "update";
  onClose: () => void;
  defaultValues?: Partial<Ticket>;
}

const TicketDialog: React.FC<TicketDialogProps> = ({ action, onClose, defaultValues }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await fetchCategories();
        const subcategoryData = await fetchSubcategories();
        setCategories(categoryData);
        setSubcategories(subcategoryData);
      } catch (error) {
        console.error("Error fetching categories or subcategories:", error);
      }
    };
    fetchData();
  }, []);

  // Combine category and subcategory into a single dropdown option
  const combinedOptions = subcategories.map((subcategory) => {
    const category = categories.find((cat) => cat.id === subcategory.category_id);
    return {
      label: `${category?.name}: ${subcategory.name}`,
      value: `${subcategory.category_id}-${subcategory.id}`
    };
  });

  const handleCreate = async (data: Record<string, any>) => {
    const { title, description, category_and_subcategory, deadline } = data;

    if (!title || !description || !category_and_subcategory || !deadline) {
      console.error("All fields are required");
      return;
    }

    const [category_id, subcategory_id] = category_and_subcategory.split("-");
    
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

    const [category_id, subcategory_id] = data.category_and_subcategory.split("-");

    try {
      const response = await updateTicket(
        data.id,
        data.status ?? undefined,
        data.resolved ?? undefined,
        data.title ?? undefined,
        data.description ?? undefined,
        category_id ?? undefined,
        subcategory_id ?? undefined,
        data.deadline ?? undefined
      );
      console.log("Ticket updated:", response);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
    onClose();
  };

  const handleDelete = async (data: Record<string, any>) => {
    if (!data.id) {
      console.error("Missing ticket ID!");
      return;
    }

    try {
      await deleteTicket(data.id);
      console.log(`Successfully deleted ticket ID: ${data.id}`);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    } finally {
      onClose();
    }
  };

  // Fields for dialog form with a combined dropdown for category and subcategory
  const dialogFields: Field[] = [
    { name: "id", label: "ID", type: "number", required: action === "update", default: defaultValues?.id },
    { name: "title", label: "Title", type: "text", required: true, default: defaultValues?.title },
    { name: "description", label: "Description", type: "text", required: true, default: defaultValues?.description },
    {
      name: "category_and_subcategory",
      label: "Category",
      type: "select",
      required: true,
      default: defaultValues ? `${defaultValues.category_id}-${defaultValues.subcategory_id}` : "",
      options: combinedOptions
    },
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
