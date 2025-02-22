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

  const toggleConfigView = () => {
    setShowConfig(!showConfig);
  };

  const openDialog = (mode, resource) => {
    setDialogType(resource);
  };

  const handleTicketSelection = (ticket) => {
    console.log('Selected ticket:', ticket);
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
      {dialogType === 'ticket' && (<TicketDialog onCancel={handleDialogCancel} />)}
      {dialogType === 'category' && (<CategoryDialog onCancel={handleDialogCancel} />)}
      {dialogType === 'subcategory' && (<SubCategoryDialog onCancel={handleDialogCancel} />)}
    </div>
  );
}

export default App;
