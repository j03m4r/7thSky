import { create } from "zustand";

interface PlayerStore {
    ids: string[];
    activeId?: string;
    isPlaying: boolean;
    setId: (id: string) => void;
    setIds: (ids: string[]) => void;
    setIsPlaying: (playing: boolean) => void;
    reset: () => void;
};

const usePlayer = create<PlayerStore>((set) => ({
    ids: [],
    activeId: undefined,
    isPlaying: false,
    setId: (id: string) => set({ activeId: id }),
    setIds: (ids: string[]) => set({ ids: ids }),
    setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
    reset: () => set({ ids: [], activeId: undefined })
}));

export default usePlayer;