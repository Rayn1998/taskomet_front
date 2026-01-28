// Используется только в Task!!!

import { create } from "zustand";

interface ITaskRedirectStore {
    redirectedTaskId: number | null;
    setRedirectedTaskId: (id: number | null) => void;
}

export const useTaskRedirectStore = create<ITaskRedirectStore>((set) => ({
    redirectedTaskId: null,
    setRedirectedTaskId: (id) => set({ redirectedTaskId: id }),
}));
