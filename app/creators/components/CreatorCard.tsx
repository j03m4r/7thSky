'use client';

import SquareAvatar from "@/components/Avatars/SquareAvatar";
import useLoadAvatar from "@/hooks/useLoadAvatar";
import { UserDetails } from "@/types";
import { useRouter } from "next/navigation";

interface CreatorCardProps {
    data: UserDetails;
};

const CreatorCard: React.FC<CreatorCardProps> = ({ data }) => {
    const router = useRouter();

    return (
        <div onClick={() => router.push(`/profile/${data.id}`)} className="group flex flex-col justify-between py-10
        items-center shadow-md hover:-translate-y-1 transition cursor-pointer hover:shadow-lg">
            <div className="flex flex-col gap-y-4 justify-center items-start">
                <SquareAvatar size={300} src={data.avatar_url?.indexOf('avatar')===0 ? useLoadAvatar(data.avatar_url) : data.avatar_url} />
                <div className="font-bold text-6xl max-w-[300px]">{data.full_name}</div>
            </div>
        </div>
    );
};

export default CreatorCard;