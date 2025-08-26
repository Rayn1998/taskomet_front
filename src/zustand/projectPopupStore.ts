import { create } from "zustand";

interface IProjectPopupStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useProjectPopupStore = create<IProjectPopupStore>((set) => ({
    isOpen: false,
    setOpenClose: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),
    setClose: () => set(() => ({ isOpen: false })),
}));
