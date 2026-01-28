import IArtist from "@shared/types/Artist";
import { request } from "./_http";

export const authApi = {
    loginViaEmail(email: string, password: string) {
        return request<IArtist>("login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });
    },

    loginViaUsername(user_name: string, password: string) {
        return request<IArtist>("login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_name, password }),
            credentials: "include",
        });
    },

    getMe() {
        return request<IArtist>("me", {
            method: "GET",
            // headers: {
            //     "Content-Type": "application/json",
            // },
            credentials: "include",
        });
    },

    logout() {
        return request("logout", {
            method: "GET",
            credentials: "include",
        });
    },
};
