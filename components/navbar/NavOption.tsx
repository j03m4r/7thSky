import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface NavOptionProps {
    icon: IconType;
    label: string;
    active: boolean;
    href: string;
}

const NavOption: React.FC<NavOptionProps> = ({
    icon: Icon, label, active, href
}) => {
    return (
        <Link href={href} className={twMerge(`group flex flex-row h-auto items-center w-full gap-x-3 text-md font-medium cursor-pointer 
        text-neutral-500 hover:text-black transition py-1`, active && 'text-black')}>
            {/* <Icon size={30} className="text-black group-hover:scale-110 transition" /> */}
            <p className={twMerge(`w-full truncate`, active && 'transition scale-105')}>
                {label}
            </p>
        </Link>
    );
}

export default NavOption;