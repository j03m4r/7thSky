'use client';

import useCheckoutModal from "@/hooks/useCheckoutModal";
import useLoadImage from "@/hooks/useLoadImage";
import { Track } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";

interface CheckoutItemInterface {
    track: Track;
    isLoading: boolean;
};

const CheckoutItem: React.FC<CheckoutItemInterface> = ({ track, isLoading }) => {
    const router = useRouter();
    const checkoutModal = useCheckoutModal();
    const { supabaseClient } = useSessionContext();
    const { user } = useUser();
    const [isPurchased, setIsPurchased] = useState(false);

    const imageUrl = useLoadImage(track);

    useEffect(() => {
        const getIsPurchased = async () => {
            const { data, error } = await supabaseClient.from('purchased_tracks').select('*').eq('user_id', user?.id)
            .eq('track_id', track.id);

            if (error) console.log(error);

            if (data?.length) setIsPurchased(true);
        }

        getIsPurchased();
    }, [user?.id, track.id, supabaseClient]);

    const handleDownload = async () => {
        const { data, error } = await supabaseClient.storage.from('tracks').download(track.track_path);
        var link = document.createElement('a')  // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
        link.href = window.URL.createObjectURL(data!);
        link.download = track.title
        link.click()
        link.remove();
    };

    const updateCart = async (track: Track) => {
        let localCart = [];
        if (checkoutModal.products.includes(track)) {
            localCart = checkoutModal.products.filter(function (otherTrack: Track) { return otherTrack.id !== track.id});
            checkoutModal.setProducts(localCart);

            const { error } = await supabaseClient.from('cart_tracks').delete().eq('user_id', user?.id).eq('track_id', track.id);

            if (error) {
                toast.error(error.message);
            }
        } else {
            checkoutModal.setProducts([...checkoutModal.products, track]);

            const { error } = await supabaseClient.from('cart_tracks').insert({user_id: user?.id, track_id: track.id});
    
            if (error) {
                toast.error(error.message);
            }
        }

        router.refresh();
    };

    return (
        <div className={twMerge(`flex justify-between w-full`, isLoading&&'cursor-not-allowed')}>
            <div className="flex gap-x-4 items-center">
                <div className="relative min-h-[64px] min-w-[64px] overflow-hidden">
                    <Image fill src={imageUrl || '/images/liked.png'} alt="Media Item" className="object-cover" />
                </div>
                <div className="flex flex-col">
                    <p onClick={() => !isLoading&&router.push(`/track/${track.id}`)} className={twMerge(`font-semibold max-w-full text-lg truncate cursor-pointer hover:underline transition`,
                    isLoading&&'cursor-not-allowed')}>
                        {track.title}
                    </p>
                    <p onClick={() => !isLoading&&router.push(`/profile/${track.users?.id}`)} className={twMerge(`text-neutral-500 text-sm cursor-pointer max-w-full hover:underline transition`,
                    isLoading&&'cursor-not-allowed')}>
                        {track.users?.full_name}
                    </p>
                </div>
            </div>
            <div className="flex justify-center items-center gap-x-2">
                {isPurchased&&(<AiOutlineDownload size={25} onClick={handleDownload} className="cursor-pointer text-blue-600 hover:text-blue-500 transition" />)}
                <IoMdClose onClick={() => !isLoading&&updateCart(track)} size={25} className={twMerge(`text-black hover:text-red-700 transition cursor-pointer`, 
                isLoading&&'cursor-not-allowed opacity-40')} />
            </div>
        </div>
    );
}

export default CheckoutItem;