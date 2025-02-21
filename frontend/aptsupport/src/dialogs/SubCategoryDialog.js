import React from 'react';
import Dialog from './Dialog';

const SubCategoryDialog = ({ mode, onCancel, onCreate, onUpdate }) => {
  const handleCreate = (data) => {
    console.log('Add New Subcategory:', data);
    onCreate();
  };

  const handleUpdate = (data) => {
    console.log('Update Subcategory:', data);
    onUpdate();
  };

  const dialogFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
  ];

  return (
    <Dialog
      title={mode === 'create' ? 'Create Subcategory' : 'Update Subcategory'}
      fields={dialogFields}
      onCancel={onCancel}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      mode={mode}
      resource="subcategory"
    />
  );
};

export default SubCategoryDialog;