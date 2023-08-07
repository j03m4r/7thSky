'use client';

import useGetTrackById from "@/hooks/useGetTrackById";
import useLoadSongUrl from "@/hooks/useLoadTrackUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
    const player = usePlayer();

    const { track } = useGetTrackById(player.activeId);

    const trackUrl = useLoadSongUrl(track!);

    if (!track || !trackUrl || !player.activeId) {
        return null;
    }

    return (
        <div className="fixed bottom-0 border-t bg-white w-full py-2 h-[100px] px-4">
            <PlayerContent key={trackUrl} track={track} songUrl={trackUrl} />
        </div>
    );
}

export default Player;