'use client';

import usePlayer from "@/hooks/usePlayer";
import { Track, UserDetails } from "@/types";
import { twMerge } from "tailwind-merge";
import Avatar from "@/components/Avatars/Avatar";
import Link from "next/link";
import TrackItem from "@/app/tracks/components/TrackItem";
import useOnPlay from "@/hooks/useOnPlay";
import useLoadAvatar from "@/hooks/useLoadAvatar";

interface PageContentProps {
    userDetails: UserDetails | null;
    tracks: Track[];
    favoriteGenres?: any[]
};

const PageContent: React.FC<PageContentProps> = ({ userDetails, tracks, favoriteGenres }) => {
    const player = usePlayer();
    const onPlay = useOnPlay(tracks);
    const avatar_url = useLoadAvatar(userDetails?.avatar_url || '');

    if (!userDetails) {
        return (
            <div className="pt-28 flex flex-col h-full justify-center items-center">
                <div className="font-semibold">Uh oh. No user!</div>
                <Link href='/tracks' className="text-blue-600 hover:text-blue-500">Explore Tracks</Link>
            </div>
        );
    }

    return (
        <div className={twMerge(`pt-28 pb-4 flex gap-x-8 w-full h-full`, player.ids.length>0 && 'pb-28')}>
            <div className="flex flex-col gap-y-8 p-8 shadow-md h-full">
                <Avatar src={avatar_url} size={300} />
                <div className="font-semibold text-5xl w-full max-w-[300px]">{userDetails.full_name}</div>
                <hr />
                <div className="flex flex-col gap-y-4">
                    <div className="font-semibold text-xl">Favorite Genres</div>
                    <div className="flex flex-wrap gap-y-2 gap-x-3 max-w-[300px]">
                        {favoriteGenres?.length!==0 ? (
                            favoriteGenres?.map((genre) => (
                                <div key={genre} className="flex gap-x-2 px-2 py-1 border border-neutral-300 rounded-full 
                                justify-center items-center text-sm text-center w-auto">
                                    {genre}
                                </div>
                            ))
                        ) : (
                            <div className="flex text-md">No favorited tracks</div>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-8">
                {tracks?.map((track) =>
                    <div key={track.id} className="max-w-lg">
                        <TrackItem data={track} onPlay={(id: string) => onPlay(id)} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default PageContent;