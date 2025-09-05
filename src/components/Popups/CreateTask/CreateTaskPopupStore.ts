import { create } from "zustand";

interface ICreateTaskPopupStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useCreateTaskPopupStore = create<ICreateTaskPopupStore>((set) => ({
    isOpen: false,
    setOpenClose: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),
    setClose: () => set(() => ({ isOpen: false })),
}));
