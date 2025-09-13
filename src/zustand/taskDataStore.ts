import { create } from "zustand";
import ITaskData from "@shared/types/TaskData";
import ITask from "@shared/types/Task";

interface ITaskDataStore {
    data: ITaskData[];
    task: ITask | null;
    setTask: (task: ITask) => void;
    setData: (data: ITaskData[], task: ITask) => void;
    addData: (data: ITaskData) => void;
    resetData: () => void;
}

export const useTaskDataStore = create<ITaskDataStore>((set) => ({
    data: [],
    task: null,
    setTask: (task) => set({ task }),
    setData: (data, task) => set({ data, task }),
    addData: (data) =>
        set((state) => ({
            data: [...state.data, data],
        })),
    resetData: () => set({ data: [], task: null }),
}));
