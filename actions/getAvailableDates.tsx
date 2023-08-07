import { AvailableDate } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getAvailableDates = async (id: string): Promise<AvailableDate[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase.from('available_dates')
    .select('id, service_id, users!available_dates_user_id_fkey(id, full_name, avatar_url), start_time, end_time').eq('service_id', id).is('customer_id', null)
    .order('start_time', { ascending: true });

    if (error) {
        console.log(error);
    }

    if (!data) {
        return [];
    }
    
    return (data as any) || [];
};

export default getAvailableDates;