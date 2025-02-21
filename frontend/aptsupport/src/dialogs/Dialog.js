import React from 'react';
import './Dialog.css';

const Dialog = ({ title, fields, onCancel, onCreate, onUpdate, mode, resource }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

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
                defaultValue={field.defaultValue || ''}
                required={field.required}
              />
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