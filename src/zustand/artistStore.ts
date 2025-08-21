import { create } from "zustand";
import IArtist from "@shared/types/Artist";

interface IArtistStore {
    artists: IArtist[] | null;
    setArtists: (data: IArtist[]) => void;
    getArtist: (id: number) => IArtist | undefined;
}

export const useArtistStore = create<IArtistStore>((set, get) => ({
    artists: null,
    setArtists: (data) => set({ artists: data }),
    getArtist: (id) => {
        const { artists } = get();
        return artists?.find((artist) => artist.id === id);
    },
}));
