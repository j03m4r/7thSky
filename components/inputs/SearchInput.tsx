'use client';

import qs from 'query-string';

import useDebounce from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import Input from './Input';
import useSearchModal from '@/hooks/useSearchModal';

const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState<string>("");
    const debounecedValue = useDebounce<string>(value, 500);
    const searchModal = useSearchModal();

    useEffect(() => {
        if (!searchModal.isOpen) { return; }
        let query = {
            title: debounecedValue,
        };

        searchParams.forEach((value, key) => {
            if (key!=='title') {
                query = {...query, [key]: value}
            }
        })

        const url = qs.stringifyUrl({
            url: '/tracks',
            query: query
        });

        router.push(url);
    }, [debounecedValue, router, searchModal, searchParams]);

    return (
        <>
        <Input placeholder='Search by key word' value={value} onChange={(e) => setValue(e.target.value)} />
        <IoMdClose onClick={() => setValue("")} className='absolute right-10 top-11 text-neutral-300 hover:text-neutral-500 transition cursor-pointer' />
        </>
    );
}

export default SearchInput;