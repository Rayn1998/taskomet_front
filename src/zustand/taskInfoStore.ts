import { create } from "zustand";

interface ITaskInfoStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useTaskInfoStore = create<ITaskInfoStore>((set) => ({
    isOpen: false,
    setOpenClose: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),
    setClose: () => set(() => ({ isOpen: false })),
}));
