import React from "react";
import "./Table.css"; // Import the CSS file

// Define types for column and data
interface Column {
  id: string;
  header: string;
  accessorKey: string;
}

interface TableViewProps {
  columns: Column[];
  data: Record<string, any>[]; // Array of objects
  onRowClick?: (row: Record<string, any>) => void;
}

const TableView: React.FC<TableViewProps> = ({ columns, data, onRowClick }) => {
  const handleRowClick = (row: Record<string, any>) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div className="table-view-container">
      <table className="table-view">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} onClick={() => handleRowClick(row)}>
              {columns.map((column) => (
                <td key={column.id}>{row[column.accessorKey]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
