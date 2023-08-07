import { UserDetails } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getCreators = async (): Promise<UserDetails[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase.from('users')
    .select('*').eq('is_admin', true);

    if (error) {
        console.log(error);
    }

    if (!data) {
        return [];
    }
    
    return (data as any) || [];
};

export default getCreators;