import { create } from "zustand";

type TSpentHoursData = {
    commentId: number;
    taskId: number;
    hours: number;
};

interface ITaskSpentHoursStore {
    spentHoursData: TSpentHoursData | null;
    updateHoursData: (data: TSpentHoursData) => void;
    resetHoursData: () => void;
}

export const useTaskSpentHours = create<ITaskSpentHoursStore>((set) => ({
    spentHoursData: null,
    updateHoursData: (data) =>
        set({
            spentHoursData: {
                taskId: data.taskId,
                commentId: data.commentId,
                hours: data.hours,
            },
        }),
    resetHoursData: () => set({ spentHoursData: null }),
}));
