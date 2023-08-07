'use client';

import AuthModal from "@/components/modals/AuthModal";
import CheckoutModal from "@/components/modals/CheckoutModal";
import SearchModal from "@/components/modals/SearchModal";
import UpdateProfileModal from "@/components/modals/UpdateProfileModal";
import UploadModal from "@/components/modals/UploadModal";
import { Genre, Key, Price, ProductWithPrice, Track } from "@/types";
import { useEffect, useState } from "react";

interface ModalProviderProps {
    genres: Genre[];
    keys: Key[];
    products: ProductWithPrice[];
    cartItems: Track[];
};

const ModalProvider: React.FC<ModalProviderProps> = ({
    genres, keys, products, cartItems
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [price, setPrice] = useState<Price>();

    useEffect(() => {
        setIsMounted(true);
        if (products[0].prices?.length) {
            setPrice(products[0].prices[0]);
        }
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AuthModal />
            <UpdateProfileModal />
            <CheckoutModal price={price} cartItems={cartItems} />
            <UploadModal allGenres={genres} keys={keys} />
            <SearchModal genres={genres} keys={keys} />
        </>
    );
}

export default ModalProvider;