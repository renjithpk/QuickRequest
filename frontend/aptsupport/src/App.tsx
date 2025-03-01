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

// Define type for dialog default values
type DialogDefaultValues = Partial<Ticket> | Partial<Category> | Partial<Subcategory>;

// Define interface for dialog data
interface DialogData {
  type: DialogType;
  action: DialogAction;
  defaultValues?: DialogDefaultValues;
}

const App: React.FC = () => {
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<DialogData | null>(null);

  const toggleConfigView = () => {
    setShowConfig((prev) => !prev);
  };

  const openDialog = (action: DialogAction, type: DialogType, defaultValues?: DialogDefaultValues) => {
    setDialogData({ type, action, defaultValues });
  };

  // Handle row selection in TicketList
  const handleTicketSelection = (ticket: Ticket) => {
    console.log("Selected ticket:", ticket);
    openDialog("update", "ticket", ticket);
  };

  const handleCategorySelection = (category: Category) => {
    console.log("Selected category:", category);
    openDialog("update", "category", category);
  };

  const handleSubcategorySelection = (subCategory: Subcategory) => {
    console.log("Selected subCategory:", subCategory);
    openDialog("update", "subcategory", subCategory);
  };

  const handleDialogCancel = () => {
    setDialogData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Support Tickets Management</h2>
      </header>

      
      <div className="app-controls">
        <div>
          <button onClick={toggleConfigView}>
            {showConfig ? "View Tickets" : "View Categories"}
          </button>
        </div>

        <label>Actions :</label>
        <div>
          {!showConfig && (
            <button onClick={() => openDialog("create", "ticket")}>
              Add New Ticket
            </button>
          )}
          {showConfig && (
            <>
              <button onClick={() => openDialog("create", "category")}>
                Add New Category
              </button>
              <button onClick={() => openDialog("create", "subcategory")}>
                Add New Subcategory
              </button>
            </>
          )}
        </div>
      </div>

      {showConfig && <>
        <CategoryTable onRowClick={handleCategorySelection} />
        <SubCategoryTable onRowClick={handleSubcategorySelection} />
      </>}
      {!showConfig && <TicketsTable onRowClick={handleTicketSelection} />}

      {dialogData && dialogData.type === "ticket" && (
        <TicketDialog action={dialogData.action} onCancel={handleDialogCancel} defaultValues={dialogData.defaultValues as Partial<Ticket>} />
      )}
      {dialogData && dialogData.type === "category" && (
        <CategoryDialog action={dialogData.action} onCancel={handleDialogCancel} defaultValues={dialogData.defaultValues as Partial<Category>} />
      )}
      {dialogData && dialogData.type === "subcategory" && (
        <SubCategoryDialog action={dialogData.action} onCancel={handleDialogCancel} defaultValues={dialogData.defaultValues as Partial<Subcategory>} />
      )}
    </div>
  );
};

export default App;
