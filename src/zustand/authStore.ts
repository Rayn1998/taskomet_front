import { create } from 'zustand';

interface IAuthState {
    auth: any;
    setAuth: (auth: any) => void;
    hydrateAuth: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
    auth: null,
    setAuth: (auth) => set((state: any) => ({ auth })),
    hydrateAuth: () => {
        const authData = localStorage.getItem('user');
        if (authData) {
            set({ auth: JSON.parse(authData) });
        }
    },
}));
