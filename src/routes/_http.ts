const BASE_URL = process.env.REACT_APP_SERVER_DOMAIN;

export type ApiResponse<T> = { data: T; status: number; message?: string };

export const request = async <T>(
    url: string,
    options: RequestInit,
): Promise<ApiResponse<T>> => {
    try {
        const responseData = await fetch(`${BASE_URL}/${url}`, options);
        const data = (await responseData.json()) as T & { message?: string };
        if (!responseData.ok) {
            throw new Error(data?.message || `HTTP ${responseData.status}`);
        }
        return { data, status: responseData.status };
    } catch (err) {
        if (err instanceof Error) throw err;
        return Promise.reject(new Error("Backend isn't replying"));
    }
};

export const download = async (fileName: string) => {
    return (await request(`download/${fileName}`, {})).data;
};

export const checkServerConnection = async (): Promise<boolean> => {
    const response = (await request("check-server", {
        method: "GET",
    })) as unknown as ApiResponse<Response>;
    return response.data.ok;
};
