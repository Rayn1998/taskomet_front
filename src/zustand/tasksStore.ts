import { create } from "zustand";
import ITask from "@shared/types/Task";

interface ITaskStore {
    tasks: ITask[];
    setTasks: (tasks: ITask[]) => void;
    addTask: (task: ITask) => void;
    getTask: (id: number) => ITask | undefined;
    removeTask: (id: number) => void;
    updateTask: (task: ITask) => void;
}

export const useTasksStore = create<ITaskStore>((set, get) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) =>
        set((state) => ({
            tasks: state.tasks ? [...state.tasks, task] : [task],
        })),
    getTask: (id) => {
        const { tasks } = get();
        return tasks.find((task) => task.id === id);
    },
    removeTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        })),
    updateTask: (updatedTask) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task,
            ),
        }));
    },
}));
