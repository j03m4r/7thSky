'use client';

import useSearchModal from "@/hooks/useSearchModal";
import { Key } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import qs from 'query-string';
import { useEffect, useState } from "react";
import { IoMdClose, IoMdCloseCircle } from "react-icons/io";
import { twMerge } from "tailwind-merge";

interface KeySelectionProps {
    keys: Key[];
};

const KeySelection: React.FC<KeySelectionProps> = ({ keys }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [key, setKey] = useState<Key>();
    const searchModal = useSearchModal();

    useEffect(() => {
        if (!searchModal.isOpen) { return; }
        let query = {
            key: key?.id,
        };

        searchParams.forEach((value, key) => {
            if (key!=='key') {
                query = {...query, [key]: value}
            }
        })

        const url = qs.stringifyUrl({
            url: '/tracks',
            query: query
        });

        router.push(url);
    }, [key?.id, router]);

    return (
        <div className="flex flex-col gap-y-4 w-full pl-1">
            <div className="flex gap-x-2 text-xl font-semibold">
                Key
                {key&&(
                    <div onClick={() => setKey(undefined)} className={twMerge(`flex gap-x-1 px-2 py-1 border border-transparent rounded-full cursor-pointer 
                    justify-center items-center text-sm font-normal text-center hover:border-neutral-300 hover:text-neutral-600 transition `)}>
                        <IoMdCloseCircle size={18} />Clear
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-3">
                {keys.map((localKey) => (
                    <div key={localKey.id} onClick={() => key?.id===localKey.id ? setKey(undefined) : setKey(localKey)} className={twMerge(`group flex gap-x-2 px-2 py-1 border border-neutral-300 rounded-full cursor-pointer 
                    justify-center items-center text-sm text-center hover:bg-neutral-300 hover:text-white transition`, key?.id===localKey.id&&`bg-neutral-300 text-white
                    hover:bg-white hover:text-black`)}>
                        {localKey.title}
                        {key?.id===localKey.id&&(
                            <IoMdClose />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KeySelection;