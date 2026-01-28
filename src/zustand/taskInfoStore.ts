import { create } from "zustand";

interface ITaskInfoStore {
    isOpen: boolean;
    toggle: () => void;
    setOpenClose: (value: boolean) => void;
}

export const useTaskInfoStore = create<ITaskInfoStore>((set) => ({
    isOpen: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    setOpenClose: (value: boolean) =>
        set({
            isOpen: value,
        }),
}));
