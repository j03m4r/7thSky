'use client';

import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface AvatarProps {
    src?: string | null | undefined;
    size?: number;
}

const Avatar: React.FC<AvatarProps> = ({
    src, size
}) => {
    return (
        <Image className={twMerge(`rounded-full`, size ? `max-w-[${size}px] max-h-[${size}px]` : 'max-w-[30px] max-h-[30px]')} height={size || 30} width={size || 30} alt="Avatar" src={src ||"/images/placeholder.jpg"} />
    );
}

export default Avatar;