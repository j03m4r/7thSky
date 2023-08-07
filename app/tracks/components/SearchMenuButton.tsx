'use client';

import useSearchModal from "@/hooks/useSearchModal";
import { AiOutlineMenu } from "react-icons/ai";

const SearchMenuButton = () => {
    const searchModal = useSearchModal();

    return (
        <div onClick={searchModal.isOpen ? searchModal.onClose : searchModal.onOpen} className={`fixed cursor-pointer z-20 -left-5 
        top-1/2 p-3 rounded-full bg-blue-600 hover:bg-blue-500 transition duration-300 ${searchModal.isOpen && 'md:translate-x-8'}`}>
            <AiOutlineMenu size={20} className="text-white" />
        </div>
    );
}

export default SearchMenuButton;