import IProject from '@shared/types/Project';

class Api {
    url: string;

    constructor(url: string) {
        this.url = url;
    }

    private _getResponse = async <T>(res: Response): Promise<T> => {
        if (!res.ok) {
            const msg = await res.json();
            return msg as T;
        } else {
            return res.json() as Promise<T>;
        }
    };

    async _request<T>(url: string, options: RequestInit): Promise<T> {
        return await fetch(url, options)
            .then((res) => this._getResponse<T>(res))
            .catch(() => Promise.reject(new Error(`Backend isn't replying`)));
    }

    async getProjects(): Promise<IProject[]> {
        return await this._request<IProject[]>(`${this.url}/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export const api = new Api('http://127.0.0.1:3001');
