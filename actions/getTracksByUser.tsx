import { Track } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getTracksByUser = async (id: any): Promise<Track[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase.from('tracks')
    .select('*, users!tracks_user_id_fkey(id, full_name), genres(title), keys(*)')
    .eq('user_id', id).order('created_at', { ascending: false });

    if (error) {
        console.log(error);
    }

    if (!data) {
        return [];
    }
    
    return (data as Track[]) || [];
};

export default getTracksByUser;