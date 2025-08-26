import { create } from "zustand";

interface IScenePopupStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useScenePopupStore = create<IScenePopupStore>((set) => ({
    isOpen: false,
    setOpenClose: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),
    setClose: () => set(() => ({ isOpen: false })),
}));
