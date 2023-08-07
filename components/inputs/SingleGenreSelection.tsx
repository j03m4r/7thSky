'use client';

import { Genre } from "@/types";
import { useState } from "react";

interface GenreInputProps {
    data: Genre;
    onClick: (id: string) => void;
    selected: boolean;
};

const SingleGenreSelection: React.FC<GenreInputProps> = ({
    data, onClick, selected
}) => {
    const [isSelected, setIsSelected] = useState(selected);

    const handleClick = () => {
        setIsSelected(!isSelected);

        return onClick(data.id);
    };

    return (
        <div onClick={handleClick} className={`p-4 transition ${isSelected ? 'shadow-md bg-neutral-100 hover:-translate-y-1' 
        : 'hover:-translate-y-1 hover:shadow-md hover:bg-neutral-100'}`}>
            {data.title}
        </div>
    );
}

export default SingleGenreSelection;