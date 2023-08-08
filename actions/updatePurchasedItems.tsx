import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const updatePurchasedItems = async () => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    if (!session) { return console.log('No session!') }

    const { data: tracks, error } = await supabase.from('cart_tracks')
    .select('track_id').eq('user_id', session?.user.id);

    if (error) {
        console.log(error);
    }

    if (!tracks) { return; }

    tracks.forEach((track) => {
        const { error } = supabase.from('purchased_tracks').insert({ user_id: session?.user.id})
    })
};

export default updatePurchasedItems;