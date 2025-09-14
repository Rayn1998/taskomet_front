import { create } from "zustand";

interface ICommentStore {
    commentId: number | null;
    setCommentId: (id: number) => void;
    resetCommentId: () => void;
}

export const useCommentStore = create<ICommentStore>((set) => ({
    commentId: null,
    setCommentId: (id) => set({ commentId: id }),
    resetCommentId: () => set({ commentId: null }),
}));
