import { request } from "./_http";
import type { ApiResponse } from "./_http";
import type IScene from "@shared/types/Scene";
import type IEntityProgress from "@shared/types/EntityProgress";
import type { ISceneData } from "@shared/types/EntityData";

type Response = Awaited<ReturnType<typeof fetch>>;

export const scenesApi = {
    getAll(
        projectName: string,
    ): Promise<ApiResponse<[IScene[], IEntityProgress[]]>> {
        return request<[IScene[], IEntityProgress[]]>(
            `projects/${projectName}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            },
        );
    },

    getData(sceneId: number): Promise<ApiResponse<ISceneData[]>> {
        return request<ISceneData[]>(`projects/scene-data?id=${sceneId}`, {
            method: "GET",
            credentials: "include",
        });
    },

    async sendMedia(media: FormData): Promise<ISceneData> {
        const res = (await request("projects/scene-media", {
            method: "POST",
            body: media,
            credentials: "include",
        })) as ApiResponse<Response>;
        return res.data.json() as unknown as ISceneData;
    },

    async deleteMedia(mediaId: number): Promise<boolean> {
        const res = (await request(`projects/scene-media/${mediaId}`, {
            method: "DELETE",
            credentials: "include",
        })) as ApiResponse<Response>;

        return res.data.ok ? true : false;
    },

    create(
        name: string,
        description: string,
        projectName: string,
    ): Promise<ApiResponse<IScene>> {
        return request<IScene>(`projects/${projectName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description }),
            credentials: "include",
        });
    },

    // указать типы
    delete(sceneId: number) {
        return request(`projects/:projectId/${sceneId}`, {
            method: "DELETE",
            credentials: "include",
        });
    },
};
