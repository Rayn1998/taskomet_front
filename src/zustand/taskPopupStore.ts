import { create } from 'zustand';

interface ITaskPopupStore {
    isOpen: boolean;
    setOpen: () => void;
    setClose: () => void;
}

export const useTaskPopupStore = create<ITaskPopupStore>((set) => ({
    isOpen: false,
    setOpen: () =>
        set(() => ({
            isOpen: true,
        })),
    setClose: () =>
        set(() => ({
            isOpen: false,
        })),
}));
