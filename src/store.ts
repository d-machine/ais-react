import { create } from "zustand"

interface FormState {
  formData: { [key: string]: string | number };
  selectedValues: { [key: string]: { id: string | number; name: string } };
  setFormData: (name: string, value: string | number) => void;
  setSelectedValues: (name: string, value: { id: string | number; name: string }) => void;
}

interface GridState{
  rows: { [key: string]: string | number }[];
  setRows:(row: { [key: string]: string | number }) => void
}

export const useFormStore = create<FormState>((set) => ({
  formData: {},
  selectedValues: {},

  setFormData: (name, value) => set((state) => ({
    formData: { ...state.formData, [name]: value }
  })),
  
  setSelectedValues: (name, value) => set((state) => ({
    selectedValues: { ...state.selectedValues, [name]: value }
  })),
}));


export const useGridStore = create<GridState>((set) => ({
  rows: [],
  setRows: (row) => set((state) => ({
    rows: [...state.rows, row]
  })),
}));
