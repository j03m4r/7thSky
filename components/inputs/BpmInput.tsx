'use client';

import { useEffect, useState } from "react";
import Input from "./Input";
import { twMerge } from "tailwind-merge";
import { IoMdCloseCircle } from "react-icons/io";

import qs from 'query-string';
import { useRouter, useSearchParams } from "next/navigation";
import useSearchModal from "@/hooks/useSearchModal";

const BpmInput = () => {
    const [minBpm, setMinBpm] = useState(0);
    const [maxBpm, setMaxBpm] = useState(1000);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (isNaN(minBpm) || isNaN(maxBpm)) { return }
        if (maxBpm < minBpm) { return }

        let query = {
            min: minBpm,
            max: maxBpm
        };

        searchParams.forEach((value, key) => {
            if (key!=='min'&&key!=='max') {
                query = {...query, [key]: value}
            }
        })

        const url = qs.stringifyUrl({
            url: '/tracks',
            query: query
        });

        router.push(url);
    }, [minBpm, maxBpm, router, searchParams]);

    return (
        <div className="flex flex-col gap-y-4 w-full pl-1">
            <div className="flex gap-x-2 text-xl font-semibold">
                BPM
                {(minBpm!==0||maxBpm!==1000)&&(
                    <div onClick={() => { setMinBpm(0), setMaxBpm(1000) }} className={twMerge(`flex gap-x-1 px-2 py-1 border border-transparent rounded-full cursor-pointer 
                    justify-center items-center text-sm font-normal text-center hover:border-neutral-300 hover:text-neutral-600 transition `)}>
                        <IoMdCloseCircle size={18} />Clear
                    </div>
                )}
            </div>
            <div className="flex justify-center items-center gap-x-2">
                <Input value={minBpm} onChange={(e) => setMinBpm(Number(e.target.value))} className="border-t-0 border-b-2 border-l-0 border-r-0 rounded-none w-[30%]" 
                placeholder="Min"/>
                <div className="text-sm font-light text-neutral-300">to</div>
                <Input value={maxBpm} onChange={(e) => setMaxBpm(Number(e.target.value))} className="border-t-0 border-b-2 border-l-0 border-r-0 rounded-none w-[30%]"
                placeholder="Max"/>
            </div>
        </div>
    );
}

export default BpmInput;