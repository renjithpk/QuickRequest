import React from 'react';
import Dialog from './Dialog';
import { createTicket, updateTicket } from '../utils/backend';

const TicketDialog = ({action, onCancel }) => {
  const handleCreate = async (data, resource) => {
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
    onCancel()
  };
  

  const handleUpdate = async (data) => {
    try {
      const response = await updateTicket(data.id, data.status, data.resolved);
      console.log('Ticket updated:', response);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleDelete = (data) => {
    console.log('Update Subcategory:', data);
  };
  
  const dialogFields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'category_id', label: 'Category ID', type: 'number', required: true },
    { name: 'subcategory_id', label: 'Subcategory ID', type: 'number', required: true },
    { name: 'deadline', label: 'Deadline', type: 'datetime-local', required: true },
  ];

  return (
    <Dialog
      title={action === 'create' ? 'Create Ticket' : 'Update Ticket'}
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