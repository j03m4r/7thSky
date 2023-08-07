import { Track } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadSongUrl = (track: Track) => {
    const supabaseClient = useSupabaseClient();

    if (!track) {
        return '';
    }

    const { data: trackData } = supabaseClient.storage.from('tracks').getPublicUrl(track.track_path);

    return trackData.publicUrl;
};

export default useLoadSongUrl;