import { Track } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadAvatar = (avatar: string) => {
    const supabaseClient = useSupabaseClient();

    if (!avatar) {
        return '';
    }

    const { data: imageData } = supabaseClient.storage.from('images').getPublicUrl(avatar);

    return imageData.publicUrl;
};

export default useLoadAvatar;