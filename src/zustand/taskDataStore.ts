import { create } from "zustand";
import ITaskData from "@shared/types/TaskData";
import ITask from "@shared/types/Task";

interface ITaskDataStore {
    data: ITaskData[];
    task: ITask | null;
    setTask: (task: ITask) => void;
    setData: (data: ITaskData[], task: ITask) => void;
    resetData: () => void;
}

export const useTaskDataStore = create<ITaskDataStore>((set) => ({
    data: [],
    task: null,
    setTask: (task) => set({ task }),
    setData: (data, task) => set({ data, task }),
    resetData: () => set({ data: [], task: null }),
}));
