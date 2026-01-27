import { create } from "zustand";
import IArtist from "@shared/types/Artist";

interface IArtistsStore {
    artists: IArtist[] | null;
    setArtists: (data: IArtist[]) => void;
    getArtist: (id: number) => IArtist | undefined;
    addArtist: (data: IArtist) => void;
    deleteArtist: (id: number) => void;
    updateArtist: (data: IArtist) => void;
}

export const useArtistStore = create<IArtistsStore>((set, get) => ({
    artists: null,
    setArtists: (data) => set({ artists: data }),
    getArtist: (id) => {
        const { artists } = get();
        return artists?.find((artist) => artist.id === id);
    },
    addArtist: (data) =>
        set((state) => ({
            artists: state.artists ? [...state.artists, data] : [data],
        })),
    deleteArtist: (id) =>
        set((state) => ({
            artists: state.artists
                ? state.artists.filter((artist) => artist.id !== id)
                : null,
        })),
    updateArtist: (data) =>
        set((state) => ({
            artists: state.artists?.map((artist) =>
                artist.id === data.id ? data : artist,
            ),
        })),
}));
