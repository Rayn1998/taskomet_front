import { create } from "zustand";

interface IProjectData {
    name: string;
    description: string;
}

interface IProjectDataStore {
    data: IProjectData | null;
    setData: (data: IProjectData) => void;
}

export const useProjectDataStore = create<IProjectDataStore>((set) => ({
    data: null,
    setData: (data) => set({ data }),
}));
