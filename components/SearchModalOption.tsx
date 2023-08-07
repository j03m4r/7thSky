import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface SearchModalProps {
    icon: IconType;
    tab: number;
    onClick: (tab: number) => void;
    active: boolean;
};

const SearchModalOption: React.FC<SearchModalProps> = ({ icon: Icon, onClick, active, tab }) => {
    return (
        <Icon size={24} onClick={() => onClick(tab)} className={twMerge(`transition text-neutral-500 cursor-pointer hover:text-black`, active && ('text-black'))} />
    );
}

export default SearchModalOption;