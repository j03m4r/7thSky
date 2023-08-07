'use client';

import { HiMusicNote } from 'react-icons/hi';
import { BsMusicPlayerFill } from 'react-icons/bs';
import { GrServices } from 'react-icons/gr';

import { useMemo } from "react";
import { usePathname } from 'next/navigation';
import NavOption from './NavOption';

const NavOptions = () => {
    const pathname = usePathname();

    const routes = useMemo(() => [
        {
            icon: HiMusicNote,
            label: 'Explore Tracks',
            active: pathname === '/tracks',
            href: '/tracks',
        },
        {
            icon: GrServices,
            label: 'Services',
            active: pathname === '/services',
            href: '/services',
        },
        {
            icon: BsMusicPlayerFill,
            label: 'Creators',
            active: pathname === '/creators',
            href: '/creators',
        }
    ], [pathname]);

    return (
        <div className="hidden rounded-full px-4 py-2 md:flex flex-row gap-28">
            {routes.map((item) => (
                <NavOption key={item.label} {...item} />
            ))}
        </div>
    );
}

export default NavOptions;