import { create } from "zustand";
import ITaskData from "@shared/types/TaskData";

interface ITaskDataStore {
    data: ITaskData[];
    setData: (data: ITaskData[]) => void;
}

export const useTaskDataStore = create<ITaskDataStore>((set) => ({
    data: [],
    setData: (data) => set({ data }),
}));
