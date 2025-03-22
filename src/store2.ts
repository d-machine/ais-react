import { create } from "zustand"

interface Row {
    originalData: { [key: string]: string | number }; 
    updatedData: { [key: string]: string | number }; 
  }
  
  interface Entry {
    rows: { [rowId: string]: Row }; 
    rowKeys: string[];
  }

  interface Enrtystore {
    entries: {
        [entryId: string]: Entry;
  },
    addEntry: (entryId: string) => void;
    addRow: (entryId: string, rowData: { [key: string]: string | number }) => string;
    deleteRow: (entryId: string, rowId: string) => void;
}

export const useStore = create<Enrtystore>((set) => ({
    entries: {},
    addEntry: (entryId) =>
      set((state) => ({
        entries: {
          ...state.entries,
          [entryId]: {
            rows: {},
            rowKeys: [],
          },
        },
      })),
      addRow: (entryId, rowData) => {
        const newRowId = Math.random().toString(36).substring(2, 11); 
        set((state) => ({
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
        }));
        return newRowId; 
      },
      
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
}))