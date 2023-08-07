'use client';

import usePlayer from "@/hooks/usePlayer";
import { Service } from "@/types";
import { twMerge } from "tailwind-merge";
import ServiceCard from "./ServiceCard";

interface PageContentProps {
    services: Service[];
};

const PageContent: React.FC<PageContentProps> = ({ services }) => {
    const player = usePlayer();

    return (
        <div className={twMerge(`pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-4 gap-y-10`, player.ids.length>0 && 'pb-28')}>
            {services.map((service) => (
                <ServiceCard key={service.id} data={service} />
            ))}
        </div>
    );
}

export default PageContent;