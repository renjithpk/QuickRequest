import React from 'react';
import './Dialog.css';

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  default?: string | number;
  helpText?: string;
}

interface DialogProps {
  action: 'create' | 'update';
  onCancel: () => void;
  onCreate?: (data: Record<string, any>, resource: string) => void;
  onUpdate?: (data: Record<string, any>, resource: string) => void;
  onDelete?: (resource: string) => void;
  title: string;
  fields: Field[];
  resource: string;
}

const Dialog: React.FC<DialogProps> = ({ action, onCancel, onCreate, onUpdate, onDelete, title, fields, resource }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
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
            {action === 'update' && onDelete && (
              <button type="button" onClick={() => onDelete(resource)} className="delete-button">Delete</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dialog;