import { create } from "zustand";

interface Row {
  originalData: { [key: string]: string | number }; 
  updatedData: { [key: string]: string | number }; 
}

interface Entry {
  metadata: { [key: string]: string | number };
  selectedValues: { [key: string]: { id: string | number; name: string } };
  rows: { [rowId: string]: Row }; 
  rowKeys: string[];
}

interface GridState {
  entries: {
    [entryId: string]: Entry; 
  };
  addEntry: (entryId: string) => void; 
  addRow: (entryId: string, rowData: { [key: string]: string | number }) => void; 
  deleteRow: (entryId: string, rowId: string) => void;
  saveRow: (entryId: string, rowId: string) => void; 
  resetAllRows: (entryId: string) => void;
  setFormData: (id: string, name: string, value: string | number) => void;
  setSelectedValues: (id: string, name: string, value: { id: string | number; name: string }) => void;

  resetRow: (entryId: string, rowId: string) => void; 
  addAfter: (entryId: string,rowData: { [key: string]: string | number }, rowId: string) => void; 
}

export const useStore = create<GridState>((set) => ({
  entries: {},
  addEntry: (entryId) =>
    set((state) => ({
      entries: {
        ...state.entries,
        [entryId]: {
          metadata:{},
          selectedValues:{},
          rows: {},
          rowKeys: [],
        },
      },
    })),

    setFormData: (id, name, value) =>
      set((state) => ({
        entries: {
          ...state.entries,
          [id]: {
            ...state.entries[id],
            metadata: {
              ...state.entries[id]?.metadata,
              [name]: value,
            },
          },
        },
      })),

  addRow: (entryId, rowData) =>
    set((state) => {
        const newRowId = Math.random().toString(36).substring(2, 11);      return {
        entries: {
          ...state.entries,
          [entryId]: {
            ...state.entries[entryId],
            rows: {
              ...state.entries[entryId].rows,
              [newRowId]: {
                originalData: rowData,
                updatedData: rowData, 
              },
            },
            rowKeys: [...state.entries[entryId].rowKeys, newRowId], 
          },
        },
      };
    }),
  deleteRow: (entryId, rowId) =>
    set((state) => {
      const { [rowId]: _, ...remainingRows } = state.entries[entryId].rows;
      console.log(_, "deleted row");
      const updatedRowKeys = state.entries[entryId].rowKeys.filter((key) => key !== rowId);
      return {
        entries: {
          ...state.entries,
          [entryId]: {
            ...state.entries[entryId],
            rows: remainingRows,
            rowKeys: updatedRowKeys,
          },
        },
      };
    }),

    setSelectedValues: (id, name, value) =>
      set((state) => ({
        entries: {
          ...state.entries,
          [id]: {
            ...state.entries[id],
            selectedValues: {
              ...state.entries[id]?.selectedValues,
              [name]: value,
            },
          },
        },
      })),
    saveRow: (entryId, rowId) =>
    set((state) => {
        const { updatedData } = state.entries[entryId].rows[rowId];
        return {
            entries: {
            ...state.entries,
            [entryId]: {
                ...state.entries[entryId],
                rows: {
                ...state.entries[entryId].rows,
                [rowId]: {
                    originalData: updatedData,
                    updatedData: updatedData, 
                },
                },
            },
            },
        };
    }),
  resetRow: (entryId, rowId) =>
    set((state) => {
      const { originalData } = state.entries[entryId].rows[rowId];
      return {
        entries: {
          ...state.entries,
          [entryId]: {
            ...state.entries[entryId],
            rows: {
              ...state.entries[entryId].rows,
              [rowId]: {
                originalData: originalData,
                updatedData: originalData, // Reset the updated data
              },
            },
          },
        },
      };
    }),
    resetAllRows: (entryId) =>
    set((state) => {
        const rows = state.entries[entryId].rows;
        Object.keys(rows).forEach((rowId) => {
            const { originalData } = rows[rowId];
            rows[rowId] = {
                originalData,
                updatedData: originalData,
            };
        });
        return {
            entries: {
            ...state.entries,
            [entryId]: {
                ...state.entries[entryId],
                rows,
            },
            },
        };
    }),
    addAfter:(entryId,rowData, rowId) =>
      set((state) => {
        const newRowId = Math.random().toString(36).substring(2, 11); 
        
        const index = state.entries[entryId].rowKeys.indexOf(rowId);
        if (index !== -1) {
          state.entries[entryId].rowKeys.splice(index + 1, 0, newRowId);
        }

        return {
        entries: {
          ...state.entries,
          [entryId]: {
            ...state.entries[entryId],
            rows: {
              ...state.entries[entryId].rows,
              [newRowId]: {
                originalData: rowData,
                updatedData: rowData, 
              },
            },
            rowKeys: [...state.entries[entryId].rowKeys],
          },
        },
      };
    })
}));