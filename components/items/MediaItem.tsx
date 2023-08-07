'use client';

import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Track } from "@/types";
import Image from "next/image";
import RelativeLikeButton from "../buttons/RelativeLikeButton";
import useGetTrackById from "@/hooks/useGetTrackById";
import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import CartButton from "../buttons/CartButton";
import RelativeCartButton from "../buttons/RelativeCartButton";

interface MediaItemProps {
    data: Track;
    onClick: (id: string) => void;
};

const MediaItem: React.FC<MediaItemProps> = ({
    data, onClick
}) => {
    const router = useRouter();

    const imageUrl = useLoadImage(data);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLocalTrack, setIsLocalTrack] = useState(false);

    const { activeId, isPlaying: GLOBAL_isPlaying, setIsPlaying: GLOBAL_setIsPlaying } = usePlayer();
    const { track } = useGetTrackById(activeId);

    useEffect(() => {
        setIsLocalTrack(track?.id===data.id);
        setIsPlaying(track?.id===data.id&&GLOBAL_isPlaying);
    }, [track?.id, GLOBAL_isPlaying, data.id]);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;

    return (
        <div className="flex group cursor-pointer shadow-sm">
            <div className="flex justify-center items-center">
                <div onClick={() => router.push(`/track/${data.id}`)} className="relative min-h-[124px] min-w-[124px] overflow-hidden">
                    <Image onClick={() => router.push(`/track/${data.id}`)} fill src={imageUrl || '/images/liked.png'} alt="Media Item" className="object-cover cursor-pointer" />
                </div>
                <Icon size={45} onClick={() => isPlaying ? GLOBAL_setIsPlaying(false) : isLocalTrack ? GLOBAL_setIsPlaying(true) : onClick(data.id)} 
                className="absolute transition text-blue-600 opacity-0 hover:scale-110 group-hover:opacity-100 cursor-pointer"/>
            </div>
            <div onClick={() => router.push(`/track/${data.id}`)} className="relative rounded-r-md flex group items-center 
            justify-between group-hover:bg-blue-50 w-full pr-2 pl-5">
                <div className="flex items-center justify-start w-3/4 md:w-auto">
                    <div className="flex flex-col gap-y-1 overflow-hidden">
                        <p className="truncate text-2xl font-semibold">
                            {data.title}
                        </p>
                        <p onClick={() => router.push(`/profile/${data.users?.id}`)} className="text-neutral-400 text-sm truncate">
                            {data.users?.full_name}
                        </p>
                    </div>
                </div>
                <div className="flex md:w-3/5 justify-around items-center">
                    <div className="hidden md:flex flex-col justify-between items-center w-1/3">
                        <div className="text-2xl font-semibold">{data.keys?.title}</div>
                        <div className="text-lg text-neutral-400">Key</div>
                    </div>
                    <div className="hidden md:flex flex-col justify-between items-center w-1/3">
                        <div className="text-2xl font-semibold">{data.bpm}</div>
                        <div className="text-lg text-neutral-400">BPM</div>
                    </div>
                </div>
            </div>
            <div className="flex gap-x-4 justify-center items-center w-1/3 group-hover:bg-blue-50">
                <RelativeLikeButton trackId={data.id} size={30} />
                <RelativeCartButton track={data} size={30} />
            </div>
        </div>
    );
}

export default MediaItem;