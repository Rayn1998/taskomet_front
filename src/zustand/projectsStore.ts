import { create } from "zustand";

import type IProject from "@shared/types/Project";
import type IProjectProgress from "@shared/types/ProjectProgress";

interface IProjectsStore {
    projects: IProject[] | null;
    projectsProgress: IProjectProgress[] | null;
    setProjects: (data: [IProject[], IProjectProgress[]]) => void;
    addProject: (data: IProject) => void;
    getProject: (id: number) => IProject | null;
    removeProject: (id: number) => void;
    resetProjects: () => void;
}

export const useProjectsStore = create<IProjectsStore>((set, get) => ({
    projects: null,
    projectsProgress: null,
    setProjects: (data) =>
        set({ projects: data[0], projectsProgress: data[1] }),
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
            projectsProgress: state.projectsProgress
                ? state.projectsProgress.filter(
                      (progress) => progress.projectId !== id,
                  )
                : null,
        })),
    resetProjects: () => set({ projects: null }),
}));
