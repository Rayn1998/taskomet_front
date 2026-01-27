import { request } from "./_http";
import type IScene from "@shared/types/Scene";
import type IEntityProgress from "@shared/types/EntityProgress";
import type { ISceneData } from "@shared/types/EntityData";

type Response = Awaited<ReturnType<typeof fetch>>;

export const scenesApi = {
    getAll(projectName: string): Promise<[IScene[], IEntityProgress[]]> {
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

    getData(sceneId: number): Promise<ISceneData[]> {
        return request<ISceneData[]>(`projects/scene-data?id=${sceneId}`, {
            method: "GET",
        });
    },

    async sendMedia(media: FormData): Promise<ISceneData> {
        const data = (await request("projects/scene-media", {
            method: "POST",
            body: media,
        })) as Response;
        return data.json() as unknown as ISceneData;
    },

    async deleteMedia(mediaId: number): Promise<boolean> {
        const res = (await request(`projects/scene-media/${mediaId}`, {
            method: "DELETE",
        })) as Response;

        return res.ok ? true : false;
    },

    create(
        name: string,
        description: string,
        projectName: string,
    ): Promise<IScene> {
        return request<IScene>(`projects/${projectName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description }),
        });
    },

    delete(sceneId: number) {
        return request(`projects/:projectId/${sceneId}`, {
            method: "DELETE",
        });
    },
};
