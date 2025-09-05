import { create } from "zustand";

interface ICreateArtistPopupStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useCreateArtistPopupStore = create<ICreateArtistPopupStore>(
    (set) => ({
        isOpen: false,
        setOpenClose: () =>
            set((state) => ({
                isOpen: !state.isOpen,
            })),
        setClose: () => set(() => ({ isOpen: false })),
    }),
);
