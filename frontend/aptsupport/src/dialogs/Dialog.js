import React from 'react';
import './Dialog.css';

// Usage
// The Dialog component can be used to create or update a resource.
// Props:
// - mode: 'create' or 'update' to specify the mode of the dialog.
// - onCreate: function to call when creating a new resource.
// - onUpdate: function to call when updating an existing resource.
// - onCancel: function to call when the dialog is canceled.
// - title: the title of the dialog.
// - fields: an array of field objects to render in the form. Each field object should have the following properties:
//   - name: the name of the field.
//   - label: the label of the field.
//   - type: the type of the input (e.g., 'text', 'number').
//   - required: whether the field is required.
//   - default: the default value of the field.
//   - helpText: optional help text to display below the field.
// - data: the data to pass to the onCreate or onUpdate function.
// - resource: the resource type (e.g., 'category', 'subcategory').

const Dialog = ({ mode, onCancel, onCreate, onUpdate, title, fields, data, resource }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === 'create' && onCreate) {
      onCreate(data, resource);
    } else if (mode === 'update' && onUpdate) {
      onUpdate(data, resource);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index} className="dialog-field">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                defaultValue={field.default || ''}
                required={field.required}
              />
              {field.helpText && <small>{field.helpText}</small>}
            </div>
          ))}
          <div className="dialog-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            {mode === 'create' && <button type="submit">Create</button>}
            {mode === 'update' && <button type="submit">Update</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dialog;