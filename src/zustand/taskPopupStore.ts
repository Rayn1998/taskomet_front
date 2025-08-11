import { create } from 'zustand';

interface ITaskPopupStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useTaskPopupStore = create<ITaskPopupStore>((set) => ({
    isOpen: false,
    setOpenClose: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),
    setClose: () => set(() => ({isOpen: false}))
}));
