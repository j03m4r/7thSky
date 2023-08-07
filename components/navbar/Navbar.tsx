'use client';

import { usePathname, useRouter } from "next/navigation";
import Container from "../Container";
import OpenCartButton from "../buttons/OpenCartButton";
import Logo from "./Logo";
import NavOptions from "./NavOptions";
import UserMenu from "./UserMenu";
import { twMerge } from "tailwind-merge";

const Navbar = () => {
    const pathname = usePathname();

    return (
        <div className={twMerge(`fixed w-full bg-white z-10 shadow-sm`, pathname==='/'&&'bg-transparent')}>
            <div className={twMerge(`py-4 border-b-[1px]`, pathname==='/'&&'border-0')}>
                <Container>
                    <div
                        className="
                            flex
                            flex-row
                            items-center
                            justify-between
                            gap-3
                            md:gap-0
                        ">
                            <Logo />
                            <NavOptions />
                            <div className="flex gap-x-4">
                                <OpenCartButton />
                                <UserMenu />
                            </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Navbar;