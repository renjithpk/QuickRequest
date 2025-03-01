import React from 'react';
import Dialog from './Dialog.tsx';

const CategoryDialog = ({mode, onCancel}) => {
  const handleCreate = (data) => {
    console.log('Add New Category:', data);
  };

  const handleUpdate = (data) => {
    console.log('Update Category:', data);
  };

  const dialogFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
  ];

  return (
    <Dialog
      title={mode === 'create' ? 'Create Category' : 'Update Category'}
      fields={dialogFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onCancel={onCancel}
      mode={mode}
      resource="category"
    />
  );
};

export default CategoryDialog;