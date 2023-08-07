'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';

const Logo = () => {
    const router = useRouter();

    return (
        <Image
            onClick={() => router.push('/')}
            alt="Logo"
            className="block cursor-pointer"
            height="100"
            width="100"
            src="/images/7thSkyLogo(250x100)_final.png"
        />
    );
}

export default Logo;