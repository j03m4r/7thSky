import { Service } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getServiceById = async (id: string): Promise<Service> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase.from('services').select('*')
    .eq('id', id).order('created_at', { ascending: false });

    if (error) {
        console.log(error);
    }

    if (!data) {
        return null as any;
    }

    return data[0] as any;
};

export default getServiceById;