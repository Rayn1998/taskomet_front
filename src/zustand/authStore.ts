import { create } from "zustand";

import type IArtist from "@shared/types/Artist";

interface IAuthState {
    auth: IArtist | null;
    isAuthChecked: boolean;
    setAuth: (auth: IArtist) => void;
    setIsAuthChecked: (checked: boolean) => void;
    resetAuth: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
    auth: null,
    isAuthChecked: false,
    setAuth: (auth) => set({ auth }),
    setIsAuthChecked: (checked) => set({ isAuthChecked: checked }),
    resetAuth: () => set({ auth: null }),
}));
