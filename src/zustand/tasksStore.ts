import { create } from "zustand";
import ITask from "@shared/types/Task";

interface ITaskStore {
    tasks: ITask[] | null;
    lastPath: string | null;
    setTasks: (tasks: ITask[], path: string) => void;
    addTask: (task: ITask) => void;
    getTask: (id: number) => ITask | undefined;
    removeTask: (id: number) => void;
    updateTask: (task: ITask) => void;
    resetTasks: () => void;
}

export const useTasksStore = create<ITaskStore>((set, get) => ({
    tasks: null,
    lastPath: null,
    setTasks: (tasks, path) => set({ tasks, lastPath: path }),
    addTask: (task) =>
        set((state) => ({
            tasks: state.tasks ? [...state.tasks, task] : [task],
        })),
    getTask: (id) => {
        const { tasks } = get();
        if (tasks === null) return;
        return tasks.find((task) => task.id === id);
    },
    removeTask: (id) =>
        set((state) => ({
            tasks: state.tasks?.filter((task) => task.id !== id),
        })),
    updateTask: (updatedTask) => {
        set((state) => ({
            tasks: state.tasks?.map((task) =>
                task.id === updatedTask.id ? updatedTask : task,
            ),
        }));
    },
    resetTasks: () => set({ tasks: null }),
}));
