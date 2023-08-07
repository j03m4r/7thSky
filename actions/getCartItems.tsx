import { Track } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getCartItems = async (): Promise<Track[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    if (!session) { return [] }

    const { data, error } = await supabase.from('cart_tracks').select('*, tracks(*, users!tracks_user_id_fkey(id, full_name))')
    .eq('user_id', session?.user?.id).order('created_at', { ascending: false });

    if (error) {
        console.log(error);
        return [];
    }

    if (!data) {
        return [];
    }

    return data.map((item) => ({
        ...item.tracks
    }));
};

export default getCartItems;