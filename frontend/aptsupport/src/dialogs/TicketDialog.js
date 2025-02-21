import React from 'react';
import Dialog from './Dialog';
import axios from 'axios';

const TicketDialog = ({ mode, onCancel, onCreate, onUpdate }) => {
  const handleCreate = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/tickets/', data);
      console.log('Ticket created:', response.data);
      onCreate();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleUpdate = (data) => {
    console.log('Update Ticket:', data);
    onUpdate();
  };

  const dialogFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
  ];

  return (
    <Dialog
      title={mode === 'create' ? 'Create Ticket' : 'Update Ticket'}
      fields={dialogFields}
      onCancel={onCancel}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      mode={mode}
      resource="ticket"
    />
  );
};

export default TicketDialog;