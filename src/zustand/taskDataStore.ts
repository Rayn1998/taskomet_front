import { create } from "zustand";
import ITaskData from "@shared/types/TaskData";
import ITask from "@shared/types/Task";

interface ITaskDataStore {
    taskData: ITaskData[];
    setTaskData: (data: ITaskData[]) => void;
    removeOneTaskData: (id: number) => void;
    addTaskData: (data: ITaskData) => void;
    resetTaskData: () => void;
}

export const useTaskDataStore = create<ITaskDataStore>((set) => ({
    taskData: [],
    setTaskData: (data) => set({ taskData: data }),
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
    resetTaskData: () => set({ taskData: [] }),
}));
