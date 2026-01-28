import { request } from "./_http";
import type { ApiResponse } from "./_http";
import type ITask from "@shared/types/Task";
import type { ITaskData } from "@shared/types/EntityData";
import type { TaskDataMin } from "@shared/types/EntityData";

type Response = Awaited<ReturnType<typeof fetch>>;

export const tasksApi = {
    getAllForScene(
        projectName: string,
        sceneName: string,
    ): Promise<ApiResponse<ITask[]>> {
        return request<ITask[]>(`projects/${projectName}/${sceneName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
    },

    getData(taskId: number): Promise<ApiResponse<ITaskData[]>> {
        return request<ITaskData[]>(`task/task-data?id=${taskId}`, {
            method: "GET",
            credentials: "include",
        });
    },

    getAllForProject(projectId: number): Promise<ApiResponse<ITask[]>> {
        return request<ITask[]>(`projects/get-all-tasks/${projectId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
    },

    getMyTasks(executorId: number): Promise<ApiResponse<ITask[]>> {
        return request<ITask[]>(`my-tasks/${executorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
    },

    create(
        name: string,
        description: string,
        projectName: string,
        sceneName: string,
    ): Promise<ApiResponse<ITask>> {
        return request<ITask>(`projects/${projectName}/${sceneName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description }),
            credentials: "include",
        });
    },

    delete(id: number): Promise<ApiResponse<ITask>> {
        return request<ITask>("task/delete-task", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
            credentials: "include",
        });
    },

    updateExecutor(
        taskId: number,
        executorId: number | null,
    ): Promise<ApiResponse<number>> {
        return request<number>("task/task-update-executor", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId, executorId }),
            credentials: "include",
        });
    },

    updateStatus(taskData: TaskDataMin): Promise<ApiResponse<ITaskData>> {
        return request<ITaskData>("task/task-update-status", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskData }),
            credentials: "include",
        });
    },

    updatePriority(
        taskId: number,
        priority: number,
    ): Promise<ApiResponse<number>> {
        return request<number>("task/task-update-priority", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId, priority }),
            credentials: "include",
        });
    },

    async sendComment(comment: FormData): Promise<ITaskData> {
        const data = await request<ITaskData>("task/task-comment", {
            method: "POST",
            body: comment,
            credentials: "include",
        });
        return data.data;
    },

    async deleteComment(commentId: number): Promise<boolean> {
        const res = (await request(`task/task-comment/${commentId}`, {
            method: "DELETE",
            credentials: "include",
        })) as ApiResponse<Response>;
        return res.data.ok ? true : false;
    },
};
