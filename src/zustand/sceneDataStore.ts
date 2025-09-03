import { create } from "zustand";

import IScene from "@shared/types/Scene";

interface ISceneDataStore {
    scene: null | IScene;
    setScene: (scene: IScene) => void;
}

export const useSceneDataStore = create<ISceneDataStore>((set) => ({
    scene: null,
    setScene: (scene) => set({ scene }),
}));
