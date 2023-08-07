import { Track } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImage = (track: Track) => {
    const supabaseClient = useSupabaseClient();

    if (!track) {
        return null;
    }

    const { data: imageData } = supabaseClient.storage.from('images').getPublicUrl(track.image_path);

    return imageData.publicUrl;
};

export default useLoadImage;