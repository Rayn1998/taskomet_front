import { create } from "zustand";

import IScene from "@shared/types/Scene";

interface ISceneData {
    name: string;
    description: string;
}

interface ISceneDataStore {
    data: ISceneData | null;
    scene: IScene | null;
    setData: (data: ISceneData) => void;
    resetData: () => void;
    setScene: (scene: IScene) => void;
}

export const useSceneDataStore = create<ISceneDataStore>((set) => ({
    data: null,
    scene: null,
    setData: (data) => set({ data }),
    resetData: () => set({ data: null }),
    setScene: (scene) => set({ scene }),
}));
