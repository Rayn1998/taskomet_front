import { create } from 'zustand';

interface IErrorDataStore {
    data: object | null;
    setData: (data: object) => void;
}

export const errorDataStore = create<IErrorDataStore>((set) => ({
    data: null,
    setData: (data) => set((state) => ({ data })),
}));
