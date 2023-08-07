'use client';

import useLoadImage from "@/hooks/useLoadImage";
import Image from "next/image";
import { Track } from "@/types";
import LikeButton from "@/components/buttons/LikeButton";
import usePlayer from "@/hooks/usePlayer";
import useGetTrackById from "@/hooks/useGetTrackById";
import { useEffect, useState } from "react";
import { BsCart, BsCartCheckFill, BsPauseFill, BsPlayFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import useCheckoutModal from "@/hooks/useCheckoutModal";
import { toast } from "react-hot-toast";
import CartButton from "@/components/buttons/CartButton";

interface TrackItemProps {
    data: Track;
    onPlay: (id: string) => void;
};

const TrackItem: React.FC<TrackItemProps> = ({
    data, onPlay 
}) => {
    const router = useRouter();

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLocalTrack, setIsLocalTrack] = useState(false);

    const imagePath = useLoadImage(data);

    const { activeId, isPlaying: GLOBAL_isPlaying, setIsPlaying: GLOBAL_setIsPlaying } = usePlayer();
    const { track } = useGetTrackById(activeId);

    useEffect(() => {
        setIsLocalTrack(track?.id===data.id);
        setIsPlaying(track?.id===data.id&&GLOBAL_isPlaying);
    }, [track?.id, GLOBAL_isPlaying]);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;

    return (
        <div className="relative flex flex-col justify-center items-center overflow-hidden">
            <div className="group relative aspect-square w-full h-full overflow-hidden">
                <Image onClick={() => router.push(`/track/${data.id}`)} className="object-cover group-hover:opacity-60 transition cursor-pointer" src={imagePath || '/images/placeholder.jpg'} fill alt="image" />
                <Icon onClick={() => isPlaying ? GLOBAL_setIsPlaying(false) : isLocalTrack ? GLOBAL_setIsPlaying(true) : onPlay(data.id)} size={50} className="absolute top-[40%] left-[40%] cursor-pointer text-blue-600 hover:scale-110 transition opacity-0 group-hover:opacity-100"/>
                <div className="absolute left-2 top-2 opacity-0 transition group-hover:opacity-100 text-md text-white">
                    {data.bpm} bpm
                </div>
                <div className="absolute left-2 bottom-2 opacity-0 transition group-hover:opacity-100 text-md text-white">
                    {data.keys?.title}
                </div>
                <LikeButton trackId={data.id} />
                <CartButton track={data} />
            </div>
            <div className="flex flex-col items-start w-full gap-y-1 mt-2">
                <p onClick={() => router.push(`/track/${data.id}`)} className="font-semibold max-w-full text-lg truncate cursor-pointer hover:underline transition">
                    {data.title}
                </p>
                <p onClick={() => router.push(`/profile/${data.users?.id}`)} className="text-neutral-500 text-sm cursor-pointer max-w-full hover:underline transition">
                    {data.users?.full_name}
                </p>
            </div>
        </div>
    );
}

export default TrackItem;