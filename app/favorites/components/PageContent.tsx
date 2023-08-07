'use client';

import MediaItem from "@/components/items/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import { Track } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface PageContentProps {
    tracks: Track[];
};

const PageContent: React.FC<PageContentProps> = ({ tracks }) => {
    const router = useRouter();
    const { isLoading, user } = useUser();
    const onPlay = useOnPlay(tracks);
    const player = usePlayer();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    if (tracks.length===0) {
        return (
            <div className="flex pt-48 font-semibold text-lg h-full w-full justify-center text-center">No favorited tracks :(</div>
        )
    }

    return (
        <div className={twMerge(`pt-24 flex flex-col gap-y-4 pb-4`, player.ids.length>0 && 'pb-28')}>
            {tracks.map((track) => (
                <MediaItem data={track} onClick={(id: string) => onPlay(id)} />
            ))}
        </div>
    );
}

export default PageContent;