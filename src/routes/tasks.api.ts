import { request } from "./_http";

import type ITask from "@shared/types/Task";
import type { ITaskData } from "@shared/types/EntityData";
import type { TaskDataMin } from "@shared/types/EntityData";

type Response = Awaited<ReturnType<typeof fetch>>;

export const tasksApi = {
    getAllForScene(projectName: string, sceneName: string): Promise<ITask[]> {
        return request<ITask[]>(`projects/${projectName}/${sceneName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

    getData(taskId: number): Promise<ITaskData[]> {
        return request<ITaskData[]>(`task/task-data?id=${taskId}`, {
            method: "GET",
        });
    },

    getAllForProject(projectId: number): Promise<ITask[]> {
        return request<ITask[]>(`projects/get-all-tasks/${projectId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

    getMyTasks(executorId: number): Promise<ITask[]> {
        return request<ITask[]>(`my-tasks/${executorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

    create(
        name: string,
        description: string,
        projectName: string,
        sceneName: string,
    ): Promise<ITask> {
        return request<ITask>(`projects/${projectName}/${sceneName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description }),
        });
    },

    delete(id: number): Promise<ITask> {
        return request<ITask>("task/delete-task", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
    },

    updateExecutor(taskId: number, executorId: number | null): Promise<number> {
        return request<number>("task/task-update-executor", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId, executorId }),
        });
    },

    updateStatus(taskData: TaskDataMin): Promise<ITaskData> {
        return request<ITaskData>("task/task-update-status", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskData }),
        });
    },

    updatePriority(taskId: number, priority: number): Promise<number> {
        return request<number>("task/task-update-priority", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId, priority }),
        });
    },

    async sendComment(comment: FormData): Promise<ITaskData> {
        const data = (await request("task/task-comment", {
            method: "POST",
            body: comment,
        })) as Response;
        return data.json() as unknown as ITaskData;
    },

    async deleteComment(commentId: number): Promise<boolean> {
        const res = (await request(`task/task-comment/${commentId}`, {
            method: "DELETE",
        })) as Response;

        return res.ok ? true : false;
    },
};
