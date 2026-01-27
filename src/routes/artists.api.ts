import { request } from "./_http";
import type IArtist from "@shared/types/Artist";

export const artitstApi = {
    create(props: Omit<IArtist, "id">): Promise<IArtist> {
        return request<IArtist>("create-artist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...props }),
            credentials: "include",
        });
    },

    getAll(): Promise<IArtist[]> {
        return request<IArtist[]>("get-artist", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
    },

    // getByUsername(user_name: string): Promise<IArtist> {
    //     return request<IArtist>(`get-artist/${user_name}`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     });
    // },

    // delete(artistId: number): Promise<IArtist> {
    //     return request<IArtist>(`delete-artist?artistId=${artistId}`, {
    //         method: "DELETE",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     });
    // },

    // updateRole(artistId: number, role: number): Promise<IArtist> {
    //     return request<IArtist>("artist-role", {
    //         method: "PATCH",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ artistId, role }),
    //     });
    // },

    // updateArtistAfterRegister(
    //     data: Omit<IArtist, "id" | "role" | "name">,
    // ): Promise<IArtist> {
    //     const { photo_url, tg_id, user_name } = data;
    //     return request<IArtist>("update-new-artist", {
    //         method: "PATCH",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ photo_url, tg_id, user_name }),
    //     });
    // },
};
