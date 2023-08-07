'use client';

import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface AvatarProps {
    src?: string | null | undefined;
    size?: number;
}

const SquareAvatar: React.FC<AvatarProps> = ({
    src, size
}) => {
    return (
        <Image className={size ? `max-w-[${size}px] max-h-[300px]` : 'max-w-[30px] max-h-[30px]'} height={size || 30} width={size || 30} alt="Avatar" src={src ||"/images/placeholder.jpg"} />
    );
}

export default SquareAvatar;