import { create } from "zustand";

interface IArtistPopupStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useArtistPopupStore = create<IArtistPopupStore>((set) => ({
    isOpen: false,
    setOpenClose: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),
    setClose: () => set(() => ({ isOpen: false })),
}));
