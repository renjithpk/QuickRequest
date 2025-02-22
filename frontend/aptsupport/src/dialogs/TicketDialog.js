import React from 'react';
import Dialog from './Dialog';
import axios from 'axios';

const TicketDialog = ({ mode, onCancel }) => {
  const handleCreate = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/tickets/', data);
      console.log('Ticket created:', response.data);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleUpdate = (data) => {
    console.log('Update Ticket:', data);
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
      title={mode === 'create' ? 'Create Ticket' : 'Update Ticket'}
      fields={dialogFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onCancel={onCancel}
      mode={mode}
      resource="ticket"
    />
  );
};

export default TicketDialog;