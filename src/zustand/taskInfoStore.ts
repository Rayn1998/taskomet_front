import { create } from "zustand";

interface ITaskInfoStore {
    isOpen: boolean;
    setOpenClose: (value: boolean) => void;
}

export const useTaskInfoStore = create<ITaskInfoStore>((set) => ({
    isOpen: false,
    setOpenClose: (value) =>
        set({
            isOpen: value,
        }),
}));
