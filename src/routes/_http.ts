const BASE_URL = process.env.REACT_APP_SERVER_DOMAIN;

type ApiResponse<T> = T & { status: number; message?: string };

const getResponse = async <T>(res: Response): Promise<ApiResponse<T>> => {
    const data = (await res.json()) as T & { message?: string };
    const result: ApiResponse<T> = { ...data, status: res.status };
    if (!res.ok) {
        throw new Error(data?.message || `HTTP ${res.status}`);
    }
    return result;
};

export const request = async <T>(
    url: string,
    options: RequestInit,
): Promise<ApiResponse<T>> => {
    try {
        const responseData = await fetch(`${BASE_URL}/${url}`, options);
        return getResponse<T>(responseData);
    } catch (err) {
        if (err instanceof Error) throw err;
        return Promise.reject(new Error("Backend isn't replying"));
    }
};

export const download = (fileName: string) => {
    return request(`download/${fileName}`, {});
};

export const checkServerConnection = async (): Promise<boolean> => {
    const response = (await request("check-server", {
        method: "GET",
    })) as Response;
    return response.ok;
};
