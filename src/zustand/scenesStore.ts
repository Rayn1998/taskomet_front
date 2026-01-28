import { create } from "zustand";

import type IScene from "@shared/types/Scene";
import type IEntityProgress from "@shared/types/EntityProgress";

interface IScenesStore {
    scenes: IScene[];
    scenesProgress: IEntityProgress[];
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
    scenes: [],
    scenesProgress: [],
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
            scenesProgress: state.scenesProgress
                ? [
                      ...state.scenesProgress,
                      {
                          entityId: scene.id,
                          progress: [],
                          priority: [],
                          executorsCount: 0,
                          spentHours: 0,
                      } as IEntityProgress,
                  ]
                : [
                      {
                          entityId: scene.id,
                          progress: [],
                          priority: [],
                          executorsCount: 0,
                          spentHours: 0,
                      } as IEntityProgress,
                  ],
        })),
    removeScene: (id) =>
        set((state) => ({
            scenes: state.scenes
                ? state.scenes.filter((scene) => scene.id !== id)
                : [],
            scenesProgress: state.scenesProgress
                ? state.scenesProgress.filter(
                      (progress) => progress.entityId !== id,
                  )
                : [],
        })),
    resetScenes: () => set({ scenes: [], scenesProgress: [] }),
    resetLastProject: () => set({ lastProject: null }),
}));
