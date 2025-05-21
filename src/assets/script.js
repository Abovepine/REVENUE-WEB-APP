// This file contains JavaScript functionality for the application.
// It handles the logic for selecting multiple rows using Shift + Click,
// navigating through rows using arrow keys, and updating the revenue tab for each row.

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("revenue-table");
  const addRowBtn = document.getElementById("add-row-btn");
  const deleteRowBtn = document.getElementById("delete-row-btn");
  const helpSection = document.getElementById("help-section");

  let lastSelectedRow = null;
  const undoStack = [];
  const redoStack = [];

  // Helper function to save actions to the undo stack
  function saveAction(action) {
    undoStack.push(action);
    redoStack.length = 0; // Clear redo stack on new action
  }

  // Shift-click selection logic
  table.addEventListener("click", (e) => {
    if (e.target.tagName === "TD") {
      const rows = Array.from(table.querySelectorAll("tbody tr"));
      const clickedRow = e.target.parentElement;

      if (e.shiftKey && lastSelectedRow) {
        const start = rows.indexOf(lastSelectedRow);
        const end = rows.indexOf(clickedRow);
        rows
          .slice(Math.min(start, end), Math.max(start, end) + 1)
          .forEach((row) => row.classList.add("selected"));
      } else {
        if (!e.ctrlKey && !e.metaKey) {
          rows.forEach((row) => row.classList.remove("selected"));
        }
        clickedRow.classList.toggle("selected");
      }

      lastSelectedRow = clickedRow;
    }
  });

  // Add row logic
  addRowBtn.addEventListener("click", () => {
    const tbody = table.querySelector("tbody");
    const rowCount = tbody.rows.length + 1;
    const newRow = tbody.insertRow();
    newRow.innerHTML = `
            <td>${rowCount}</td>
            <td contenteditable="true">New Company</td>
            <td contenteditable="true">$0</td>
        `;
    saveAction({ type: "add", row: newRow });
  });

  // Delete selected rows logic
  deleteRowBtn.addEventListener("click", () => {
    const selectedRows = Array.from(
      table.querySelectorAll("tbody tr.selected")
    );
    selectedRows.forEach((row) => {
      saveAction({
        type: "delete",
        row: row.cloneNode(true),
        index: row.rowIndex,
      });
      row.remove();
    });
  });

  // Enable inline editing for existing rows
  table.addEventListener("dblclick", (e) => {
    if (e.target.tagName === "TD") {
      const originalContent = e.target.textContent;
      e.target.setAttribute("contenteditable", "true");
      e.target.focus();

      e.target.addEventListener("blur", function onBlur() {
        e.target.removeAttribute("contenteditable");
        if (e.target.textContent !== originalContent) {
          saveAction({
            type: "edit",
            cell: e.target,
            oldValue: originalContent,
            newValue: e.target.textContent,
          });
        }
        e.target.removeEventListener("blur", onBlur);
      });
    }
  });

  // Undo and Redo logic
  document.addEventListener("keydown", (e) => {
    const isUndo = (e.ctrlKey || e.metaKey) && e.key === "z";
    const isRedo = (e.ctrlKey || e.metaKey) && e.key === "x";

    if (isUndo) {
      const action = undoStack.pop();
      if (action) {
        redoStack.push(action);
        handleUndoRedo(action, "undo");
      }
    } else if (isRedo) {
      const action = redoStack.pop();
      if (action) {
        undoStack.push(action);
        handleUndoRedo(action, "redo");
      }
    }
  });

  function handleUndoRedo(action, type) {
    const tbody = table.querySelector("tbody");
    if (action.type === "add") {
      if (type === "undo") {
        action.row.remove();
      } else {
        tbody.appendChild(action.row);
      }
    } else if (action.type === "delete") {
      if (type === "undo") {
        tbody.insertBefore(action.row, tbody.rows[action.index - 1] || null);
      } else {
        action.row.remove();
      }
    } else if (action.type === "edit") {
      action.cell.textContent =
        type === "undo" ? action.oldValue : action.newValue;
    }
  }

  // Add help section content
  helpSection.innerHTML = `
        <h3>How to Use</h3>
        <ul>
            <li><strong>Shift + Click:</strong> Select multiple rows.</li>
            <li><strong>Double-click:</strong> Edit a cell.</li>
            <li><strong>Ctrl+Z / Cmd+Z:</strong> Undo the last action.</li>
            <li><strong>Ctrl+X / Cmd+X:</strong> Redo the last undone action.</li>
            <li><strong>Add Row:</strong> Adds a new row to the table.</li>
            <li><strong>Delete Selected Rows:</strong> Deletes all selected rows.</li>
        </ul>
    `;
});
