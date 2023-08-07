'use client';

import useSearchModal from "@/hooks/useSearchModal";
import { useCallback, useEffect, useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import SearchModalOption from "../SearchModalOption";
import SearchInput from "../inputs/SearchInput";
import MultipleGenreSelection from "../inputs/MultipleGenreSelection";
import { Genre, Key } from "@/types";
import KeySelection from "../inputs/KeySelection";
import BpmInput from "../inputs/BpmInput";

interface SearchModalProps {
    genres: Genre[];
    keys: Key[];
};

enum TABS {
    GENERAL = 0,
    ADVANCED = 1
};

const SearchModal: React.FC<SearchModalProps> = ({ genres, keys }) => {
    const searchModal = useSearchModal();
    const [showModal, setShowModal] = useState(searchModal.isOpen);
    const [tab, setTab] = useState(TABS.GENERAL);

    useEffect(() => {
        setShowModal(searchModal.isOpen);
    }, [searchModal.isOpen]);

    const handleClose = useCallback(() => {
        setShowModal(false);
        setTimeout(() => {
            searchModal.onClose();
        }, 300);
    }, []);

    let contentTitle = "Find Beats";

    let body = (
        <div className="relative p-6 h-full flex flex-col justify-between items-center">
            <div className="w-full flex flex-col gap-y-4">
                <SearchInput />
                <MultipleGenreSelection genres={genres} />
            </div>
            {/* Tab Selection */}
            <div className="flex flex-row justify-center items-center w-full">
                <SearchModalOption icon={AiOutlineSearch} tab={TABS.GENERAL} onClick={(tab: number) => setTab(tab)} active={tab!==TABS.ADVANCED} />
                <div className="h-6 border-l border-neutral-600 mx-3" />
                <SearchModalOption icon={LuSettings2} tab={TABS.ADVANCED} onClick={(tab: number) => setTab(tab)} active={tab===TABS.ADVANCED} />
            </div>
        </div>
    );

    if (tab===TABS.ADVANCED) {
        contentTitle = "Advanced Filters"
        body = (
            <div className="relative p-6 h-full flex flex-col justify-between items-center">
                <KeySelection keys={keys} />
                <BpmInput />
                <div className="flex flex-row justify-center items-center w-full">
                    <SearchModalOption icon={AiOutlineSearch} tab={TABS.GENERAL} onClick={(tab: number) => setTab(tab)} active={tab!==TABS.ADVANCED} />
                    <div className="h-6 border-l border-neutral-600 mx-3" />
                    <SearchModalOption icon={LuSettings2} tab={TABS.ADVANCED} onClick={(tab: number) => setTab(tab)} active={tab===TABS.ADVANCED} />
                </div>
            </div>
        );
    }

    return (
        <div className={`z-10 fixed top-24 md:left-8 flex justify-start items-center h-full md:h-5/6 w-full md:w-1/3 lg:w-1/4
            ${searchModal.isOpen ? '' : 'hidden'}`}>
            <div className={`translate w-full h-full duration-300
                ${showModal ? 'translate-x-0' : ' -translate-x-10'}
                ${showModal ? 'opacity-100' : 'opacity-0'}`}>
                <div className="translate h-full border-0 rounded-lg shadow-xl relative flex 
                flex-col w-full bg-white outline-none focus:outline-none">
                    {/* HEADER */}
                    <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                        <button onClick={handleClose} className="p-1 border-0 hover:opacity-70 transition absolute left-9">
                            <IoMdClose size={18} />
                        </button>
                        <div className="text-lg font-semibold">
                            {contentTitle}
                        </div>
                    </div>
                    {/* BODY */}
                    {body}
                </div>
            </div>
        </div>
    );
}

export default SearchModal;