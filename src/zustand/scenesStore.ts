import { create } from "zustand";

import type IScene from "@shared/types/Scene";
import type IEntityProgress from "@shared/types/EntityProgress";

interface IScenesStore {
    scenes: IScene[] | null;
    scenesProgress: IEntityProgress[] | null;
    lastProject: string | null;
    setScenes: (
        data: [IScene[], IEntityProgress[]],
        projectName: string | undefined,
    ) => void;
    addScene: (scene: IScene) => void;
    removeScene: (id: number) => void;
    resetScenes: () => void;
    resetLastProject: () => void;
}

export const useScenesStore = create<IScenesStore>((set) => ({
    scenes: null,
    scenesProgress: null,
    lastProject: null,
    setScenes: (data, projectName) =>
        set({
            scenes: data[0],
            scenesProgress: data[1],
            lastProject: projectName ?? null,
        }),
    addScene: (scene) =>
        set((state) => ({
            scenes: state.scenes ? [...state.scenes, scene] : [scene],
        })),
    removeScene: (id) =>
        set((state) => ({
            scenes: state.scenes
                ? state.scenes.filter((scene) => scene.id !== id)
                : null,
        })),
    resetScenes: () => set({ scenes: null }),
    resetLastProject: () => set({ lastProject: null }),
}));
