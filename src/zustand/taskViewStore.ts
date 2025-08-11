import { create } from 'zustand';

interface ITaskViewStore {
    change: boolean;
    setChange: () => void;
}

export const useTaskViewStore = create<ITaskViewStore>((set) => ({
    change: false,
    setChange: () => set((state) => ({ change: !state.change })),
}));