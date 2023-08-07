'use client';

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
    trackId: string;
    size?: number;
};

const RelativeLikeButton: React.FC<LikeButtonProps> = ({
    trackId, size
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();

    const authModal = useAuthModal();
    const { user } = useUser();

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const fetchData = async () => {
            const { data, error } = await supabaseClient.from('favorited_tracks').select('*')
            .eq('user_id', user.id).eq('track_id', trackId).single();

            if (!error && data) {
                setIsLiked(true);
            }
        };

        fetchData();
    }, [trackId, supabaseClient, user?.id]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

    const handleLike = async () => {
        if (!user) {
            return authModal.onOpen();
        }

        if (isLiked) {
            const { error } = await supabaseClient.from('favorited_tracks').delete()
            .eq('user_id', user.id).eq('track_id', trackId);

            if (error) {
                toast.error(error.message);
            } else {
                setIsLiked(false);
            }
        } else {
            const { error } = await supabaseClient.from('favorited_tracks').insert({track_id: trackId, user_id: user.id});

            if (error) {
                toast.error(error.message);
            } else {
                setIsLiked(true);
                toast.success('Liked!');
            }
        }

        router.refresh();
    };

    return (
        <button onClick={handleLike} className="transition hover:scale-110">
            <Icon color={isLiked ? '#2563eb' : '#000'} size={size ? size : 25} />
        </button>
    );
}

export default RelativeLikeButton;