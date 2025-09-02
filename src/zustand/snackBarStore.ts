import { create } from "zustand";

interface ISnackBarStore {
    open: boolean;
    message: string;
    setMessage: (message: string) => void;
    setOpen: (state: boolean) => void;
}

export const useSnackBarStore = create<ISnackBarStore>((set) => ({
    open: false,
    message: "",
    setMessage: (message) =>
        set(() => ({
            message,
        })),
    setOpen: (state) => set(() => ({ open: state })),
}));
