import { create } from "zustand";

interface ICreateScenePopupStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useCreateScenePopupStore = create<ICreateScenePopupStore>(
    (set) => ({
        isOpen: false,
        setOpenClose: () =>
            set((state) => ({
                isOpen: !state.isOpen,
            })),
        setClose: () => set(() => ({ isOpen: false })),
    }),
);
