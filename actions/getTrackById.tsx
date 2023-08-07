import { Track } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getTrackById = async (id: string): Promise<Track> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase.from('tracks').select('*, users!tracks_user_id_fkey(id, full_name), genres(title), keys(title)')
    .eq('id', id).order('created_at', { ascending: false });

    if (error) {
        console.log(error);
    }

    if (!data) {
        return null as any;
    }

    return data[0] as any;
};

export default getTrackById;