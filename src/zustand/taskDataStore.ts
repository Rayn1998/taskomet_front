import { create } from "zustand";
import ITaskData from "@shared/types/TaskData";

interface ITaskDataStore {
    taskData: ITaskData[];
    relatedTaskId: number | null;
    setTaskData: (data: ITaskData[], id: number) => void;
    removeOneTaskData: (id: number) => void;
    addTaskData: (data: ITaskData) => void;
    resetTaskData: () => void;
}

export const useTaskDataStore = create<ITaskDataStore>((set) => ({
    taskData: [],
    relatedTaskId: null,
    setTaskData: (data, id) => set({ taskData: data, relatedTaskId: id }),
    removeOneTaskData: (id) =>
        set((state) => ({
            taskData:
                state.taskData.length > 0
                    ? state.taskData.filter((data) => data.id !== id)
                    : [],
        })),
    addTaskData: (data) =>
        set((state) => ({
            taskData: [...state.taskData, data],
        })),
    resetTaskData: () => set({ taskData: [], relatedTaskId: null }),
}));
