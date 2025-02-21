import React, { useState } from 'react';
import './App.css';
import TicketList from './TicketList';
import ConfigView from './ConfigView';
import TicketDialog from './dialogs/TicketDialog';
import CategoryDialog from './dialogs/CategoryDialog';
import SubCategoryDialog from './dialogs/SubCategoryDialog';

import axios from 'axios';

function App() {
  const [showConfig, setShowConfig] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [dialogResource, setDialogResource] = useState('ticket');

  const toggleConfigView = () => {
    setShowConfig(!showConfig);
  };

  const openDialog = (mode, resource) => {
    setDialogMode(mode);
    setDialogResource(resource);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const addNewTicket = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/tickets/', data);
      console.log('Ticket created:', response.data);
      // Optionally, refresh the ticket list or update the state
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const addNewCategory = (data) => {
    console.log('Add New Category:', data);
    // Add logic to create a new category
  };

  const addNewSubcategory = (data) => {
    console.log('Add New Subcategory:', data);
    // Add logic to create a new subcategory
  };

  const handleCreate = (data, resource) => {
    if (!resource) {
      console.error('Resource is undefined');
      return;
    }
    const [resourceType] = resource.split('|');
    switch (resourceType) {
      case 'ticket':
        addNewTicket(data);
        break;
      case 'category':
        addNewCategory(data);
        break;
      case 'subcategory':
        addNewSubcategory(data);
        break;
      default:
        console.error('Unknown resource type:', resourceType);
    }
    closeDialog();
  };

  const handleUpdate = (data, resource) => {
    if (!resource) {
      console.error('Resource is undefined');
      return;
    }
    console.log(`Update ${resource}:`, data);
    closeDialog();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Support Tickets Management</h2>
      </header>
      <div className="app-controls">
        <button onClick={toggleConfigView}>
          {showConfig ? 'Hide Configuration' : 'Show Configuration'}
        </button>
        <button onClick={() => openDialog('create', 'ticket')}>Add New Ticket</button>
        <button onClick={() => openDialog('create', 'category')}>Add New Category</button>
        <button onClick={() => openDialog('create', 'subcategory')}>Add New Subcategory</button>
      </div>
      {showConfig && <ConfigView />}
      {!showConfig && <TicketList />}
      {showDialog && dialogResource === 'ticket' && (
        <TicketDialog
          mode={dialogMode}
          onCancel={closeDialog}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
      {showDialog && dialogResource === 'category' && (
        <CategoryDialog
          mode={dialogMode}
          onCancel={closeDialog}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
      {showDialog && dialogResource === 'subcategory' && (
        <SubCategoryDialog
          mode={dialogMode}
          onCancel={closeDialog}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default App;
