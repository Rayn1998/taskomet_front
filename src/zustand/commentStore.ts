import { create } from "zustand";
import type ITaskData from "@shared/types/TaskData";

interface ICommentDataStore {
    commentData: ITaskData | null;
    relatedTaskId: number | null;
    setCommentData: (data: ITaskData, relatedTaskId: number) => void;
    resetCommentData: () => void;
}

export const useCommentDataStore = create<ICommentDataStore>((set) => ({
    commentData: null,
    relatedTaskId: null,
    setCommentData: (data, relatedTaskId) =>
        set({ commentData: data, relatedTaskId }),
    resetCommentData: () => set({ commentData: null, relatedTaskId: null }),
}));
