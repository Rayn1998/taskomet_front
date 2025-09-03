import { create } from "zustand";

import IProject from "@shared/types/Project";

interface IProjectData {
    name: string;
    description: string;
}

interface IProjectDataStore {
    data: IProjectData | null;
    project: IProject | null;
    setData: (data: IProjectData) => void;
    resetData: () => void;
    setProject: (project: IProject) => void;
}

export const useProjectDataStore = create<IProjectDataStore>((set) => ({
    data: null,
    project: null,
    setData: (data) => set({ data }),
    resetData: () => set({ data: null }),
    setProject: (project) => set({ project }),
}));
