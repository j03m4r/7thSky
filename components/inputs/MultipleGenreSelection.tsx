'use client';

import { Genre } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import qs from 'query-string';
import { IoMdClose, IoMdCloseCircle } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import useSearchModal from "@/hooks/useSearchModal";

interface GenreSelectionProps {
    genres: Genre[];
};

const MultipleGenreSelection: React.FC<GenreSelectionProps> = ({ genres } ) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [unselectedGenres, setUnselectedGenres] = useState<Genre[]>(genres);
    const selectedGenresTitles = selectedGenres.map((genre) => genre.title);
    const searchModal = useSearchModal();

    useEffect(() => {
        if (!searchModal.isOpen) { return; }
        let query = {
            genres: selectedGenresTitles,
        };

        searchParams.forEach((value, key) => {
            if (key!=='genres') {
                query = {...query, [key]: value}
            }
        })

        const url = qs.stringifyUrl({
            url: '/tracks',
            query: query
        });

        router.push(url);
    }, [selectedGenresTitles, router, searchModal.isOpen, searchParams]);

    const updateSelectedGenres = (genre: Genre) => {
        let localGenres = [];
        if (selectedGenres.includes(genre)) {
            localGenres = selectedGenres.filter(function (otherGenre: Genre) { return otherGenre.id !== genre.id});
            setSelectedGenres(localGenres);
            setUnselectedGenres([...unselectedGenres, genre]);
        } else {
            localGenres = unselectedGenres.filter(function (otherGenre: Genre) { return otherGenre.id !== genre.id});
            setUnselectedGenres(localGenres);
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    return (
        <>
        {selectedGenres.length>0&&(
            <>
            <div className="flex flex-wrap gap-y-2 gap-x-3">
                {selectedGenres.map((genre) => (
                    <div key={genre.id} onClick={() => updateSelectedGenres(genre)} className="flex gap-x-2 px-2 py-1 border border-neutral-300 rounded-full cursor-pointer 
                    justify-center items-center text-sm text-center hover:bg-neutral-300 hover:text-white transition">
                        {genre.title}
                        <IoMdClose />
                    </div>
                    ))
                }
                <div onClick={() => { setSelectedGenres([]), setUnselectedGenres(genres) }} className={twMerge(`flex gap-x-1 px-2 py-1 border border-transparent rounded-full cursor-pointer 
                justify-center items-center text-sm text-center hover:border-neutral-300 hover:text-neutral-600 transition `)}>
                    <IoMdCloseCircle size={18} />Clear all
                </div>
            </div>
            <hr />
            </>
        )}
        <div className="flex flex-wrap gap-y-2 gap-x-3">
            {unselectedGenres.map((genre) => (
                <div key={genre.id} onClick={() => updateSelectedGenres(genre)} className="flex gap-x-2 px-2 py-1 border border-neutral-300 rounded-full cursor-pointer 
                justify-center items-center text-sm text-center hover:bg-neutral-300 hover:text-white transition">
                    {genre.title}
                </div>
            ))}
        </div>
        {genres.length===0&&(
            <div className="flex justify-center items-center font-light text-sm">
                That&apos;s all the genres!
            </div>
        )}
        </>
    );
}

export default MultipleGenreSelection;