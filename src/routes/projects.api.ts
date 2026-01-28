import { request } from "./_http";
import type { ApiResponse } from "./_http";
import type IProject from "@shared/types/Project";
import type { IProjectData } from "@shared/types/EntityData";
import type IEntityProgress from "@shared/types/EntityProgress";

type Response = Awaited<ReturnType<typeof fetch>>;

export const projectsApi = {
    getAll(): Promise<ApiResponse<[IProject[], IEntityProgress[]]>> {
        return request<[IProject[], IEntityProgress[]]>("projects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
    },

    getData(projectId: number): Promise<ApiResponse<IProjectData[]>> {
        return request<IProjectData[]>(
            `projects/project-data?id=${projectId}`,
            {
                method: "GET",
                credentials: "include",
            },
        );
    },

    async sendMedia(media: FormData): Promise<IProjectData> {
        const data = (await request("projects/project-media", {
            method: "POST",
            body: media,
            credentials: "include",
        })) as ApiResponse<Response>;
        return data.data.json() as unknown as IProjectData;
    },

    async deleteMedia(mediaId: number): Promise<boolean> {
        const res = (await request(`projects/project-media/${mediaId}`, {
            method: "DELETE",
            credentials: "include",
        })) as ApiResponse<Response>;

        return res.data.ok ? true : false;
    },

    create(name: string, description: string): Promise<ApiResponse<IProject>> {
        return request<IProject>("projects/create-project", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description }),
            credentials: "include",
        });
    },

    delete(id: number) {
        return request(`projects/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
    },
};
