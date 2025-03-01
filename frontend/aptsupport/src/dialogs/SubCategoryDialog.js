import React from 'react';
import Dialog from './Dialog.tsx';

const SubCategoryDialog = ({ mode,onCancel }) => {
  const handleCreate = (data) => {
    console.log('Add New Subcategory:', data);
  };

  const handleUpdate = (data) => {
    console.log('Update Subcategory:', data);
  };

  const handleDelete = (data) => {
    console.log('Update Subcategory:', data);
  };

  const dialogFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
  ];

  return (
    <Dialog
      title={mode === 'create' ? 'Create Subcategory' : 'Update Subcategory'}
      fields={dialogFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      mode={mode}
      onCancel={onCancel}
      resource="subcategory"
    />
  );
};

export default SubCategoryDialog;