import { create } from "zustand";
import ITask from "@shared/types/Task";

interface ITaskStore {
    tasks: ITask[];
    setTasks: (data: ITask[]) => void;
    addTask: (data: ITask) => void;
    removeTask: (data: number) => void;
}

export const useTasksStore = create<ITaskStore>((set) => ({
    tasks: [],
    setTasks: (data) => set({ tasks: data }),
    addTask: (data) =>
        set((state) => ({
            tasks: state.tasks ? state.tasks.concat(data) : [data],
        })),
    removeTask: (data) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== data),
        })),
}));
