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

const Dialog = ({ action, onCancel, onCreate, onUpdate, onDelete, title, fields, resource }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (action === 'create' && onCreate) {
      onCreate(data, resource);
    } else if (action === 'update' && onUpdate) {
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
              <div className="dialog-field-container">
                <label htmlFor={field.name} className="dialog-label">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  defaultValue={field.default || ''}
                  required={field.required}
                  className="dialog-input"
                />
              </div>
              {field.helpText && <small>{field.helpText}</small>}
            </div>
          ))}
          <div className="dialog-actions">
            <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
            {action === 'create' && <button type="submit" className="create-button">Create</button>}
            {action === 'update' && <button type="submit" className="update-button">Update</button>}
            {action === 'update' && onDelete && <button type="button" onClick={() => onDelete(resource)} className="delete-button">Delete</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dialog;
