import IProject from "@shared/types/Project";
import IScene from "@shared/types/Scene";
import ITask from "@shared/types/Task";
import IArtist from "@shared/types/Artist";

class Api {
    url: string;

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

    async _request<T>(url: string, options: RequestInit): Promise<T> {
        try {
            const responseData = await fetch(url, options);
            return this._getResponse<T>(responseData);
        } catch (err) {
            return Promise.reject(new Error(`Backend isn't replying`));
        }
    }

    async getArtists(): Promise<IArtist[]> {
        return await this._request<IArtist[]>(`${this.url}/get-artist`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async getProjects(): Promise<IProject[]> {
        return await this._request<IProject[]>(`${this.url}/projects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async getScenes(projectId: string): Promise<IScene[]> {
        return await this._request<IScene[]>(
            `${this.url}/projects/${projectId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    async getTasks(projectId: string, sceneId: string): Promise<ITask[]> {
        return await this._request<ITask[]>(
            `${this.url}/projects/${projectId}/${sceneId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    async getTaskData(taskId: number): Promise<any> {
        return await this._request<ITask[]>(`${this.url}/task-data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId }),
        });
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
