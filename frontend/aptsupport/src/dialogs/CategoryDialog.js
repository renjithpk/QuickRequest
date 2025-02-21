import React from 'react';
import Dialog from './Dialog';

const CategoryDialog = ({ mode, onCancel, onCreate, onUpdate }) => {
  const handleCreate = (data) => {
    console.log('Add New Category:', data);
    onCreate();
  };

  const handleUpdate = (data) => {
    console.log('Update Category:', data);
    onUpdate();
  };

  const dialogFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
  ];

  return (
    <Dialog
      title={mode === 'create' ? 'Create Category' : 'Update Category'}
      fields={dialogFields}
      onCancel={onCancel}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      mode={mode}
      resource="category"
    />
  );
};

export default CategoryDialog;