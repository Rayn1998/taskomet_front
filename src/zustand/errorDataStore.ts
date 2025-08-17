import { create } from "zustand";

interface IErrorDataStore {
    message: string;
    setMessage: (message: string) => void;
}

export const errorDataStore = create<IErrorDataStore>((set) => ({
    message: "",
    setMessage: (message) =>
        set({
            message,
        }),
}));
