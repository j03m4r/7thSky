'use client';

import usePlayer from "@/hooks/usePlayer";
import { UserDetails } from "@/types";
import { twMerge } from "tailwind-merge";
import CreatorCard from "./CreatorCard";

interface PageContentProps {
    creators: UserDetails[];
};

const PageContent: React.FC<PageContentProps> = ({ creators }) => {
    const player = usePlayer();

    return (
        <div className={twMerge(`pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-4 gap-y-10 w-full gap-x-10`, player.ids.length>0 && 'pb-28')}>
            {creators.map((creator) => (
                <CreatorCard key={creator.id} data={creator} />
            ))}
        </div>
    );
};

export default PageContent;