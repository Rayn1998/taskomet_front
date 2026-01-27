import { create } from "zustand";

import type IArtist from "@shared/types/Artist";

interface IAuthState {
    auth: IArtist | null;
    setAuth: (auth: IArtist) => void;
    resetAuth: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
    auth: null,
    setAuth: (auth) => set({ auth }),
    resetAuth: () => set({ auth: null }),
}));
