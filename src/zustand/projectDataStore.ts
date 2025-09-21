import { create } from "zustand";

import IProject from "@shared/types/Project";

interface IProjectDataStore {
    projectData: IProject | null;
    setProjectData: (data: IProject) => void;
    resetProjectData: () => void;
}

export const useProjectDataStore = create<IProjectDataStore>((set) => ({
    projectData: null,
    setProjectData: (data) => set({ projectData: data }),
    resetProjectData: () => set({ projectData: null }),
}));
