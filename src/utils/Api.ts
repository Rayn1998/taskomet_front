import type IProject from "@shared/types/Project";
import type IEntityProgress from "@shared/types/EntityProgress";
import type IScene from "@shared/types/Scene";
import type ITask from "@shared/types/Task";
import type {
    ITaskData,
    TaskDataMin,
    IProjectData,
    ISceneData,
} from "@shared/types/EntityData";
import type IArtist from "@shared/types/Artist";

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

    async createArtist(props: Omit<IArtist, "id">): Promise<IArtist> {
        return this._request<IArtist>(`${this.url}/create-artist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...props }),
        });
    }

    async getArtists(): Promise<IArtist[]> {
        return this._request<IArtist[]>(`${this.url}/get-artist`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async getArtist(user_name: string): Promise<IArtist> {
        return this._request<IArtist>(`${this.url}/get-artist/${user_name}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async deleteArtist(artistId: number): Promise<IArtist> {
        return this._request<IArtist>(
            `${this.url}/delete-artist?artistId=${artistId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    async updateArtistRole(artistId: number, role: number): Promise<IArtist> {
        return this._request<IArtist>(`${this.url}/artist-role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ artistId, role }),
        });
    }

    async updateArtistAfterRegister(
        data: Omit<IArtist, "id" | "role" | "name">,
    ): Promise<IArtist> {
        const { photo_url, tg_id, user_name } = data;
        return this._request<IArtist>(`${this.url}/update-new-artist`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ photo_url, tg_id, user_name }),
        });
    }

    async getProjects(): Promise<[IProject[], IEntityProgress[]]> {
        return this._request<[IProject[], IEntityProgress[]]>(
            `${this.url}/projects`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    async getProjectData(projectId: number): Promise<IProjectData[]> {
        return this._request<IProjectData[]>(
            `${this.url}/projects/project-data?id=${projectId}`,
            {
                method: "GET",
            },
        );
    }

    async sendProjectMedia(media: FormData): Promise<IProjectData> {
        const data = await fetch(`${this.url}/projects/project-media`, {
            method: "POST",
            body: media,
        });
        return data.json() as unknown as IProjectData;
    }

    async deleteProjectMedia(mediaId: number): Promise<boolean> {
        const res = await fetch(
            `${this.url}/projects/project-media/${mediaId}`,
            {
                method: "DELETE",
            },
        );

        return res.ok ? true : false;
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

    async getScenes(
        projectName: string,
    ): Promise<[IScene[], IEntityProgress[]]> {
        return this._request<[IScene[], IEntityProgress[]]>(
            `${this.url}/projects/${projectName}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    async getSceneData(sceneId: number): Promise<ISceneData[]> {
        return this._request<ISceneData[]>(
            `${this.url}/projects/scene-data?id=${sceneId}`,
            {
                method: "GET",
            },
        );
    }

    async sendSceneMedia(media: FormData): Promise<ISceneData> {
        const data = await fetch(`${this.url}/projects/scene-media`, {
            method: "POST",
            body: media,
        });
        return data.json() as unknown as ISceneData;
    }

    async deleteSceneMedia(mediaId: number): Promise<boolean> {
        const res = await fetch(`${this.url}/projects/scene-media/${mediaId}`, {
            method: "DELETE",
        });

        return res.ok ? true : false;
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

    async getTasks(projectName: string, sceneName: string): Promise<ITask[]> {
        return this._request<ITask[]>(
            `${this.url}/projects/${projectName}/${sceneName}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    async getTaskData(taskId: number): Promise<ITaskData[]> {
        return this._request<ITaskData[]>(
            `${this.url}/task/task-data?id=${taskId}`,
            {
                method: "GET",
            },
        );
    }

    async getAllTasks(projectId: number): Promise<ITask[]> {
        return this._request<ITask[]>(
            `${this.url}/projects/get-all-tasks/${projectId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    async getMyTasks(executorId: number): Promise<ITask[]> {
        return this._request<ITask[]>(`${this.url}/my-tasks/${executorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
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

    async download(fileName: string) {
        return await fetch(`${this.url}/download/${fileName}`);
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

export const api = new Api(`${process.env.REACT_APP_SERVER_DOMAIN}`);
