'use client';

import { Track } from "@/types";
import TrackItem from "./TrackItem";
import useOnPlay from "@/hooks/useOnPlay";
import useSearchModal from "@/hooks/useSearchModal";

interface PageContentProps {
    tracks: Track[];
};

const PageContent: React.FC<PageContentProps> = ({
    tracks
}) => {
    const onPlay = useOnPlay(tracks);
    const searchModal = useSearchModal();

    return (
        <>
        <div onClick={searchModal.onClose} className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {tracks.map((track) => (
                <TrackItem key={track.id} data={track} onPlay={(id: string) => onPlay(id) } />
            ))}
        </div>
        {tracks.length===0&&(
            <div className="flex items-center justify-center pt-24 font-semibold text-lg w-full h-full">
                No tracks available :(
            </div>
        )}
        </>
        
    );
}

export default PageContent;