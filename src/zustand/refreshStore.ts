import { create } from "zustand";

interface IRefreshState {
    delay: number;
    interval: number | null;
    callback: (() => void) | null;
    setDelay: (delay: number) => void;
    startInterval: (callback: () => void) => void;
    stopInterval: () => void;
    reset: () => void;
    triggerNow: () => void;
}

export const useRefreshStore = create<IRefreshState>((set, get) => ({
    delay: 1,
    interval: null,
    callback: null,

    setDelay: (delay) => {
        const { interval, callback, startInterval, stopInterval } = get();
        set({ delay });

        if (interval !== null && callback) {
            stopInterval();
            startInterval(callback);
        }
    },

    startInterval: (callback) => {
        const { delay, stopInterval } = get();
        stopInterval();

        const id = window.setInterval(() => {
            callback();
        }, delay * 1000 * 60);

        set({ interval: id, callback });
    },

    stopInterval: () => {
        const { interval } = get();
        if (interval !== null) {
            clearInterval(interval);
            set({ interval: null });
        }
    },

    reset: () => {
        const { stopInterval } = get();
        stopInterval();
        set({ interval: 1 });
    },

    triggerNow: () => {
        const { callback, startInterval } = get();
        if (!callback) return;
        callback();
        startInterval(callback);
    },
}));
