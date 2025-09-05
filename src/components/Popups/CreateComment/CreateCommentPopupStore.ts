import { create } from "zustand";

interface ICreateCommentPopupStore {
    isOpen: boolean;
    setOpenClose: () => void;
    setClose: () => void;
}

export const useCreateCommentPopupStore = create<ICreateCommentPopupStore>(
    (set) => ({
        isOpen: false,
        setOpenClose: () =>
            set((state) => ({
                isOpen: !state.isOpen,
            })),
        setClose: () => set(() => ({ isOpen: false })),
    }),
);
