import { create } from "zustand";

import IProject from "@shared/types/Project";

interface IProjectsStore {
    projects: IProject[] | null;
    setProjects: (data: IProject[]) => void;
    addProject: (data: IProject) => void;
    getProject: (id: number) => IProject | null;
    removeProject: (id: number) => void;
    resetProjects: () => void;
}

export const useProjectsStore = create<IProjectsStore>((set, get) => ({
    projects: null,
    setProjects: (data) => set({ projects: data }),
    addProject: (project) =>
        set((state) => ({
            projects: state.projects ? [...state.projects, project] : [project],
        })),
    getProject: (id) => {
        const { projects } = get();
        return projects?.find((project) => project.id === id) ?? null;
    },
    removeProject: (id) =>
        set((state) => ({
            projects: state.projects
                ? state.projects.filter((project) => project.id !== id)
                : null,
        })),
    resetProjects: () => set({ projects: null }),
}));
