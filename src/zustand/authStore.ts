import { create } from "zustand";

import type IArtist from "@shared/types/Artist";
import type ITelegramAuthData from "@shared/types/TgAuthData";

interface IAuthState {
    auth: IArtist | null;
    tgAuth: ITelegramAuthData | null;
    loggedIn: boolean;
    setAuth: (auth: IArtist) => void;
    setTgAuth: (tgAuth: ITelegramAuthData) => void;
    setLoggedIn: (loggedIn: boolean) => void;
    resetAuth: () => void;
    resetTgAuth: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
    auth: null,
    tgAuth: null,
    loggedIn: false,
    setAuth: (auth) => set({ auth }),
    setTgAuth: (tgAuth) => set({ tgAuth }),
    setLoggedIn: (loggedIn) => set({ loggedIn }),
    resetAuth: () => set({ auth: null }),
    resetTgAuth: () => set({ tgAuth: null }),
}));
