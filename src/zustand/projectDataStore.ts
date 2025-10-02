import { create } from "zustand";

import type IProject from "@shared/types/Project";
import type { IProjectData } from "@shared/types/EntityData";

interface IProjectDataStore {
    projectData: IProjectData[];
    relatedProject: IProject | null;
    setProjectData: (data: IProjectData[]) => void;
    setRelatedProject: (project: IProject) => void;
    removeOneProjectData: (id: number) => void;
    addProjectData: (data: IProjectData) => void;
    resetProjectData: () => void;
}

export const useProjectDataStore = create<IProjectDataStore>((set) => ({
    projectData: [],
    relatedProject: null,
    setProjectData: (data) => set({ projectData: data }),
    setRelatedProject: (project) => set({ relatedProject: project }),
    removeOneProjectData: (id) =>
        set((state) => ({
            projectData:
                state.projectData.length > 0
                    ? state.projectData.filter((data) => data.id !== id)
                    : [],
        })),
    addProjectData: (data) =>
        set((state) => ({
            projectData: [...state.projectData, data],
        })),
    resetProjectData: () => set({ projectData: [] }),
}));
