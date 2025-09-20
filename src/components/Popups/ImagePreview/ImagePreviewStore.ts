import { create } from "zustand";

interface IimagePreviewPopup {
    open: boolean;
    src: string;
    setOpenClose: () => void;
    setSrc: (src: string) => void;
}

export const useImagePreviewPopup = create<IimagePreviewPopup>((set) => ({
    open: false,
    src: "",
    setOpenClose: () =>
        set((state) => ({
            open: !state.open,
        })),
    setSrc: (src) => set({ src }),
}));
