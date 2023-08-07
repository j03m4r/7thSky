import { Genre } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getFavoritedGenres = async (id: any): Promise<String[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const { data, error } = await supabase.from('favorited_tracks').select('*, tracks(genres(*)))')
    .eq('user_id', id).order('created_at', { ascending: false }); // TRYING TO GET FAVORITE GENRES UNIQUE

    if (error) {
        console.log(error);
        return [];
    }

    if (!data) {
        return [];
    }

    const parsedData = data.map((item) => ([
        // @ts-ignore
        ...item.tracks.genres
    ]))

    let favoriteGenres: string[] = [];
    parsedData.forEach((track: Genre[]) => {track.forEach((genre: Genre) => !favoriteGenres.includes(genre.title) ? favoriteGenres.push(genre.title) : null)});

    return favoriteGenres as any;
};

export default getFavoritedGenres;