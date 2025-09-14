import IProject from "@shared/types/Project";
import IScene from "@shared/types/Scene";
import ITask from "@shared/types/Task";
import ITaskData, { TaskDataMin } from "@shared/types/TaskData";
import IArtist from "@shared/types/Artist";

class Api {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    private _getResponse = async <T>(res: Response): Promise<T> => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.message || "Unknown error");
        }
        return data as T;
    };

    private async _request<T>(url: string, options: RequestInit): Promise<T> {
        try {
            const responseData = await fetch(url, options);
            return this._getResponse<T>(responseData);
        } catch (err) {
            console.log(err);
            return Promise.reject(new Error(`Backend isn't replying`));
        }
    }

    async getArtists(): Promise<IArtist[]> {
        return this._request<IArtist[]>(`${this.url}/get-artist`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async getProjects(): Promise<IProject[]> {
        return this._request<IProject[]>(`${this.url}/projects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async createProject(name: string, description: string): Promise<IProject> {
        return this._request<IProject>(`${this.url}/projects/create-project`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description }),
        });
    }

    async deleteProject(id: number) {
        return await fetch(`${this.url}/projects/${id}`, {
            method: "DELETE",
        });
    }

    async getScenes(projectName: string): Promise<IScene[]> {
        return this._request<IScene[]>(`${this.url}/projects/${projectName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async createScene(
        name: string,
        description: string,
        projectName: string,
    ): Promise<IScene> {
        return this._request<IScene>(`${this.url}/projects/${projectName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description }),
        });
    }

    async deleteScene(sceneId: number) {
        return await fetch(`${this.url}/projects/:projectId/${sceneId}`, {
            method: "DELETE",
        });
    }

    async getTasks(projectId: string, sceneId: string): Promise<ITask[]> {
        return this._request<ITask[]>(
            `${this.url}/projects/${projectId}/${sceneId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    async createTask(
        name: string,
        description: string,
        projectName: string,
        sceneName: string,
    ): Promise<ITask> {
        return this._request<ITask>(
            `${this.url}/projects/${projectName}/${sceneName}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description }),
            },
        );
    }

    async deleteTask(id: number): Promise<ITask> {
        return this._request<ITask>(`${this.url}/task/delete-task`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
    }

    async updateTaskExecutor(
        taskId: number,
        executorId: number | null,
    ): Promise<number> {
        return this._request<number>(`${this.url}/task/task-update-executor`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId, executorId }),
        });
    }

    async updateTaskStatus(taskData: TaskDataMin): Promise<ITaskData> {
        return this._request<ITaskData>(`${this.url}/task/task-update-status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskData }),
        });
    }

    async updateTaskPriority(
        taskId: number,
        priority: number,
    ): Promise<number> {
        return this._request<number>(`${this.url}/task/task-update-priority`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId, priority }),
        });
    }

    async getTaskData(taskId: number): Promise<ITaskData[]> {
        return this._request<ITaskData[]>(
            `${this.url}/task/task-data?id=${taskId}`,
            {
                method: "GET",
            },
        );
    }

    async createArtist(
        name: string,
        role: number,
        tgid: string,
    ): Promise<IArtist> {
        return this._request<IArtist>(`${this.url}/create-artist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, role, tgid }),
        });
    }

    async sendComment(comment: FormData): Promise<ITaskData> {
        const data = await fetch(`${this.url}/task/task-comment`, {
            method: "POST",
            body: comment,
        });
        return data.json() as unknown as ITaskData;
    }

    async deleteComment(commentId: number): Promise<boolean> {
        const res = await fetch(`${this.url}/task/task-comment/${commentId}`, {
            method: "DELETE",
        });

        return res.ok ? true : false;
    }

    async checkServerConnection() {
        const response = await fetch(`${this.url}/check-server`, {
            method: "GET",
        });
        if (response.status === 200) {
            return Promise.resolve(true);
        }
        return Promise.reject(false);
    }
}

export const api = new Api("http://127.0.0.1:3001");
