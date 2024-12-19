import { create } from "zustand";

interface FormState {
  entries: { 
    [key: string]: { 
      metadata: { [key: string]: string | number }; 
      selectedValues: { [key: string]: { id: string | number; name: string } }; 
      rows: { [key: string]: string | number }[] 
    } 
  };
  addEntry: (id: string) => void;
  setFormData: (id: string, name: string, value: string | number) => void;
  setSelectedValues: (id: string, name: string, value: { id: string | number; name: string }) => void;
  setRows: (id: string, row: { [key: string]: string | number }) => void;
}

export const useStore = create<FormState>((set) => ({
  entries: {},

  addEntry: (id) =>
    set((state) => ({
      entries: {
        ...state.entries,
        [id]: { metadata: {}, selectedValues: {}, rows: [] },
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

  setRows: (id, row) =>
    set((state) => ({
      entries: {
        ...state.entries,
        [id]: {
          ...state.entries[id],
          rows: [...(state.entries[id]?.rows || []), row],
        },
      },
    })),
}));
