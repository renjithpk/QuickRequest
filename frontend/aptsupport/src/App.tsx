import React, { useState } from "react";
import "./App.css";
import TicketsTable from "./tables/TicketsTable.tsx";
import CategoryTable from "./tables/CategoryTable.tsx";
import SubCategoryTable from "./tables/SubcategoryTable.tsx";
import TicketDialog from "./dialogs/TicketDialog.tsx";
import CategoryDialog from "./dialogs/CategoryDialog.tsx";
import SubCategoryDialog from "./dialogs/SubCategoryDialog.tsx";
import { Category, Subcategory, Ticket } from "./utils/backend.ts";

// Define types for dialogs
type DialogType = "ticket" | "category" | "subcategory";
type DialogAction = "create" | "update";

type DialogDefaultValues = Partial<Ticket> | Partial<Category> | Partial<Subcategory>;

interface DialogData {
  type: DialogType;
  action: DialogAction;
  defaultValues?: DialogDefaultValues;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tickets" | "categories">("tickets");
  const [dialogData, setDialogData] = useState<DialogData | null>(null);
  const [reloadTickets, setReloadTickets] = useState(false);
  const [reloadCategories, setReloadCategories] = useState(false);
  const [reloadSubCategories, setReloadSubCategories] = useState(false);

  const openDialog = (action: DialogAction, type: DialogType, defaultValues?: DialogDefaultValues) => {
    setDialogData({ type, action, defaultValues });
  };

  const handleDialogClose = () => {
    setDialogData(null);
    if (dialogData?.type === "ticket") {
      setReloadTickets(prev => !prev);
    }
    if (dialogData?.type === "category") {
      setReloadCategories(prev => !prev);
    }
    if (dialogData?.type === "subcategory") {
      setReloadSubCategories(prev => !prev);
    }

  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Support Tickets Management</h2>
      </header>

      <div className="tabs">
        <button className={`tab-button ${activeTab === "tickets" ? "active" : ""}`} onClick={() => setActiveTab("tickets")}>Tickets</button>
        <button className={`tab-button ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>Configs</button>
      </div>

      <div className="app-controls">
        <label>Actions:</label>
        <div>
          {activeTab === "tickets" && (
            <button onClick={() => openDialog("create", "ticket")}> New Ticket</button>
          )}
          {activeTab === "categories" && (
            <>
              <button onClick={() => openDialog("create", "category")}> New Category</button>
              <button onClick={() => openDialog("create", "subcategory")}> New Subcategory</button>
            </>
          )}
        </div>
      </div>

      {activeTab === "tickets" && (
        <TicketsTable
          onRowClick={(ticket) => openDialog("update", "ticket", ticket)}
          reloadTrigger={reloadTickets}   // Step 3: Pass reload state as a prop
        />
      )}
      {activeTab === "categories" && (
        <>
          <CategoryTable onRowClick={(category) => openDialog("update", "category", category)} reloadTrigger={reloadCategories} />
          <SubCategoryTable onRowClick={(subCategory) => openDialog("update", "subcategory", subCategory)} reloadTrigger={reloadSubCategories} />
        </>
      )}

      {dialogData && dialogData.type === "ticket" && (
        <TicketDialog action={dialogData.action} onClose={handleDialogClose} defaultValues={dialogData.defaultValues as Partial<Ticket>} />
      )}
      {dialogData && dialogData.type === "category" && (
        <CategoryDialog action={dialogData.action} onClose={handleDialogClose} defaultValues={dialogData.defaultValues as Partial<Category>} />
      )}
      {dialogData && dialogData.type === "subcategory" && (
        <SubCategoryDialog action={dialogData.action} onClose={handleDialogClose} defaultValues={dialogData.defaultValues as Partial<Subcategory>} />
      )}
    </div>
  );
};

export default App;
