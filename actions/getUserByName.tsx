import { UserDetails } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getUserByName = async (name: string): Promise<UserDetails> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase.from('users').select('id, full_name, avatar_url, is_admin')
    .eq('id', name);

    if (error) {
        console.log(error);
    }

    if (!data) { // CHECK BUGS WITH NAVIGATING TO A PROFILE/TRACK THAT DOESN"T EXIST
        return null as any;
    }

    return data[0] as UserDetails;
};

export default getUserByName;