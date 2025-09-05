import { create } from "zustand";

interface ICreateProjectPopupStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useCreateProjectPopupStore = create<ICreateProjectPopupStore>(
    (set) => ({
        isOpen: false,
        setOpenClose: () =>
            set((state) => ({
                isOpen: !state.isOpen,
            })),
        setClose: () => set(() => ({ isOpen: false })),
    }),
);
