/* eslint-disable @typescript-eslint/no-explicit-any */
import {create} from 'zustand';

interface EntryListState {
  entries: {
    [entryId: string]: {
      data: any[];
    };
  };
  initData: (entryId: string) => void;
  setData: (entryId: string, data: any[]) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  selectedRow: number;
  setSelectedRow: (rowId: number) => void;
}

const useEntryListStore = create<EntryListState>((set) => ({
  entries: {},
  initData: (entryId) =>
    set((state) => ({
      entries: {
        ...state.entries,
        [entryId]: {
          data: [],
        },
      },
    })),
  setData: (entryId, data) =>
    set((state) => ({
      entries: {
        ...state.entries,
        [entryId]: {
          data: data,
        },
      },
    })),
  isLoading: true,
  setLoading: (isLoading) => set(() => ({ isLoading })),
  selectedRow: -1,
  setSelectedRow: (rowId) => set(() => ({ selectedRow: rowId })),
}));

export default useEntryListStore;
