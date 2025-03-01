import React, { useState } from 'react';
import './App.css';
import TicketList from './TicketList';
import ConfigView from './ConfigView';
import TicketDialog from './dialogs/TicketDialog';
import CategoryDialog from './dialogs/CategoryDialog';
import SubCategoryDialog from './dialogs/SubCategoryDialog';

function App() {
  const [showConfig, setShowConfig] = useState(false);

  const [dialogType, setDialogType] = useState(null);
  const [dialogAction, setDialogAction] = useState(null);
  const [defaultValues, setDefaultValues] = useState(null)

  const toggleConfigView = () => {
    setShowConfig(!showConfig);
  };

  const openDialog = (action, resource) => {
    if (action !== 'create' && action !== 'update') {
      console.error('Invalid action:', action);
      return;
    }
    setDialogAction(action);
    setDialogType(resource);
  };

  const handleTicketSelection = (ticket) => {
    console.log('Selected ticket:', ticket);
    setDefaultValues(ticket)
    openDialog('update', 'ticket')
  };

  const handleDialogCancel = () => {
    setDialogType(null);
  }

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
      {!showConfig && <TicketList onRowClick={handleTicketSelection} />}
      {dialogType === 'ticket' && (<TicketDialog action = {dialogAction} onCancel={handleDialogCancel} defaultValues={defaultValues}/>)}
      {dialogType === 'category' && (<CategoryDialog action = {dialogAction} onCancel={handleDialogCancel} />)}
      {dialogType === 'subcategory' && (<SubCategoryDialog action = {dialogAction} onCancel={handleDialogCancel} />)}
    </div>
  );
}

export default App;
