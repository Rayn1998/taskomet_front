import { create } from "zustand";
import ITaskData from "@shared/types/TaskData";

interface ICommentDataStore {
    commentData: ITaskData | null;
    setCommentData: (data: ITaskData) => void;
    resetCommentData: () => void;
}

export const useCommentDataStore = create<ICommentDataStore>((set) => ({
    commentData: null,
    setCommentData: (data) => set({ commentData: data }),
    resetCommentData: () => set({ commentData: null }),
}));
