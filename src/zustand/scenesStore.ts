import { create } from "zustand";

import IScene from "@shared/types/Scene";

interface IScenesStore {
    scenes: IScene[] | null;
    setScenes: (scenes: IScene[]) => void;
    addScene: (scene: IScene) => void;
    removeScene: (id: number) => void;
    resetScenes: () => void;
}

export const useScenesStore = create<IScenesStore>((set) => ({
    scenes: null,
    setScenes: (scenes) => set({ scenes }),
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
}));
