import { create } from "zustand";

import type IScene from "@shared/types/Scene";
import type { ISceneData } from "@shared/types/EntityData";

interface ISceneDataStore {
    sceneData: ISceneData[];
    relatedScene: IScene | null;
    setSceneData: (data: ISceneData[]) => void;
    setRelatedScene: (scene: IScene) => void;
    removeOneSceneData: (id: number) => void;
    addSceneData: (data: ISceneData) => void;
    resetSceneData: () => void;
}

export const useSceneDataStore = create<ISceneDataStore>((set) => ({
    sceneData: [],
    relatedScene: null,
    setSceneData: (data) => set({ sceneData: data }),
    setRelatedScene: (scene) => set({ relatedScene: scene }),
    removeOneSceneData: (id) =>
        set((state) => ({
            sceneData:
                state.sceneData.length > 0
                    ? state.sceneData.filter((data) => data.id !== id)
                    : [],
        })),
    addSceneData: (data) =>
        set((state) => ({
            sceneData: [...state.sceneData, data],
        })),
    resetSceneData: () => set({ sceneData: [] }),
}));
