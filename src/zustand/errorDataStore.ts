import { create } from "zustand";

interface IErrorDataStore {
    errorMessage: string;
    setErrorMessage: (message: string) => void;
}

export const useErrorDataStore = create<IErrorDataStore>((set) => ({
    errorMessage: "",
    setErrorMessage: (message) =>
        set({
            errorMessage: message,
        }),
}));
