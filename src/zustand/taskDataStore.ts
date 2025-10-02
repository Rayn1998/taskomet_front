import { create } from "zustand";
import type { ITaskData } from "@shared/types/EntityData";
import type ITask from "@shared/types/Task";

interface ITaskDataStore {
    taskData: ITaskData[];
    relatedTask: ITask | null;
    setTaskData: (data: ITaskData[], task: ITask) => void;
    removeOneTaskData: (id: number) => void;
    addTaskData: (data: ITaskData) => void;
    resetTaskData: () => void;
}

export const useTaskDataStore = create<ITaskDataStore>((set) => ({
    taskData: [],
    relatedTask: null,
    setTaskData: (data, task) =>
        set({
            taskData: data,
            relatedTask: task,
        }),
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
    resetTaskData: () => set({ taskData: [], relatedTask: null }),
}));
