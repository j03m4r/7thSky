'use client';

import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Track } from "@/types";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import RelativeLikeButton from "../buttons/RelativeLikeButton";
import { useRouter } from "next/navigation";

interface PlayerItemProps {
    data: Track;
    onClick?: (id: string) => void;
};

const PlayerItem: React.FC<PlayerItemProps> = ({
    data, onClick
}) => {
    const router = useRouter();

    const imageUrl = useLoadImage(data);
    const player = usePlayer();

    const handleClick = () => {
        if (onClick) {
            return onClick(data.id);
        }

        player.setId(data.id);
    };

    return (
        <div onClick={handleClick} className="relative flex items-center justify-between w-full p-2 rounded-md gap-x-4">
            <div className="flex items-center gap-x-3">
                <div className="relative min-h-[64px] min-w-[64px] overflow-hidden">
                    <Image fill src={imageUrl || '/images/liked.png'} alt="Media Item" className="object-cover" />
                </div>
                <div className="flex flex-col gap-y-1 overflow-hidden">
                    <p onClick={() => router.push(`/track/${data.id}`)} className="truncate cursor-pointer hover:underline transition">
                        {data.title}
                    </p>
                    <p onClick={() => router.push(`/profile/${data.users?.id}`)} className="text-neutral-400 text-sm truncate cursor-pointer hover:underline transition">
                        {data.users?.full_name}
                    </p>
                </div>
            </div>
            <RelativeLikeButton trackId={data.id} />
        </div>
    );
}

export default PlayerItem;