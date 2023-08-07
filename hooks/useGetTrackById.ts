import { Track } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast";

const useGetTrackById = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [track, setTrack] = useState<Track | undefined>(undefined);
    const { supabaseClient } = useSessionContext();

    useEffect(() => {
        if (!id) {
            return;
        }

        setIsLoading(true);

        const fetchSong = async () => {
            const { data, error } = await supabaseClient.from('tracks').select('*, users!tracks_user_id_fkey(id, full_name)').eq('id', id).single();

            if (error) {
                setIsLoading(false);
                return toast.error(error.message);
            }

            setTrack(data as Track);
            setIsLoading(false);
        }

        fetchSong();
    }, [id, supabaseClient]);

    return useMemo(() => ({
        isLoading, track
    }), [isLoading, track])
};

export default useGetTrackById;