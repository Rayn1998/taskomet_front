import { create } from "zustand";
import type {
    IProjectData,
    ISceneData,
    ITaskData,
} from "@shared/types/EntityData";

interface ICommentDataStore {
    commentData: IProjectData | ISceneData | ITaskData | null;
    relatedEntityId: number | null;
    setCommentData: (
        data: IProjectData | ISceneData | ITaskData,
        relatedEntityId: number,
    ) => void;
    resetCommentData: () => void;
}

export const useCommentDataStore = create<ICommentDataStore>((set) => ({
    commentData: null,
    relatedEntityId: null,
    setCommentData: (data, relatedEntityId) =>
        set({ commentData: data, relatedEntityId }),
    resetCommentData: () => set({ commentData: null, relatedEntityId: null }),
}));
