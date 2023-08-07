import { Key } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getKeys = async (): Promise<Key[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase.from('keys').select('*').order('created_at', { ascending: true });

    if (error) {
        console.log(error);
    }

    return (data as any) || [];
};

export default getKeys;