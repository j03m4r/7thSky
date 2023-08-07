import { Genre } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getGenres = async (): Promise<Genre[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase.from('genres').select('*').order('title', { ascending: false });

    if (error) {
        console.log(error);
    }

    return (data as any) || [];
};

export default getGenres;