import { Track, SearchParams } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";
import getTracks from "./getTracks";

const getTrackByParams = async (params: SearchParams): Promise<Track[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    if (!params.title && !params.min && !params.max && !params.genres && !params.key) {
        const allSongs = await getTracks();
        return allSongs;
    }

    let query = supabase.from('tracks').select('*, users!tracks_user_id_fkey(id, full_name), genres(title), keys(title)')

    if (params.title) { query = query.ilike('title', `%${params.title}%`) }
    if (params.min || params.max) { query = query.gte('bpm', params.min).lte('bpm', params.max) }
    if (params.key) { query = query.eq('key', params.key) }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.log(error);
    }

    if (params.genres) { // Here I'm filtering by genres locally because supabase stupid
        return (data?.filter((track) => track.genres.some((genre: any) => params.genres.includes(genre.title))) as any) || [];
    }

    return (data as any) || [];
};

export default getTrackByParams;