'use client';

import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import { Price, ProductWithPrice, Track } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import useOnPlay from "@/hooks/useOnPlay";
import RelativeLikeButton from "@/components/buttons/RelativeLikeButton";
import useCheckoutModal from "@/hooks/useCheckoutModal";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import useAuthModal from "@/hooks/useAuthModal";
import Link from "next/link";
import { AiOutlineDownload } from "react-icons/ai";

interface PageContentProps {
    track: Track;
    products: ProductWithPrice[];
};

const formatPrice = (price: Price) => {
    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency,
        minimumFractionDigits: 0
    }).format((price?.unit_amount || 0 ) / 100);

    return priceString;
};

const PageContent: React.FC<PageContentProps> = ({ track, products }) => {
    const checkoutModal = useCheckoutModal();
    const { supabaseClient } = useSessionContext();

    const router = useRouter();
    const { user } = useUser();
    const player = usePlayer();
    const onPlay = useOnPlay([track]);
    const authModal = useAuthModal();

    const imageUrl = useLoadImage(track);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLocalTrack, setIsLocalTrack] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);

    const { activeId, isPlaying: GLOBAL_isPlaying, setIsPlaying: GLOBAL_setIsPlaying } = usePlayer();
    
    useEffect(() => {
        const getIsPurchased = async () => {
            const { data, error } = await supabaseClient.from('purchased_tracks').select('*').eq('user_id', user?.id)
            .eq('track_id', track.id);

            if (error) console.log(error);

            if (data?.length) setIsPurchased(true);
        }

        getIsPurchased();
    }, [track.id,user?.id,]);

    useEffect(() => {
        setIsLocalTrack(activeId===track.id);
        setIsPlaying(activeId===track.id&&GLOBAL_isPlaying);
    }, [activeId, GLOBAL_isPlaying, track.id]);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const fetchData = async () => {
            const { data, error } = await supabaseClient.from('cart_tracks').select('*')
            .eq('user_id', user.id).eq('track_id', track.id).single();

            if (!error && data) {
                setIsInCart(true);
            }
        };

        fetchData();
    }, [track.id, supabaseClient, user?.id]);

    if (!track) {
        return (
            <div className="pt-28 flex flex-col h-full justify-center items-center">
                <div className="font-semibold">Uh oh. No track!</div>
                <Link href='/tracks' className="text-blue-600 hover:text-blue-500">Explore Tracks</Link>
            </div>
        );
    }

    let priceContent = (
        <div className="text-center p-12 font-medium">No prices available.</div>
    );

    const updateCart = async () => {
        if (!user) {
            return authModal.onOpen();
        }

        let localCart = [];
        if (isInCart) {
            setIsInCart(false);
            localCart = checkoutModal.products.filter(function (otherTrack: Track) { return otherTrack.id !== track.id});
            checkoutModal.setProducts(localCart);

            const { error } = await supabaseClient.from('cart_tracks').delete().eq('user_id', user?.id).eq('track_id', track.id);

            if (error) {
                toast.error(error.message);
            }
        } else {
            setIsInCart(true);
            checkoutModal.setProducts([...checkoutModal.products, track]);

            const { error } = await supabaseClient.from('cart_tracks').insert({user_id: user?.id, track_id: track.id});
    
            if (error) {
                toast.error(error.message);
            } else {
                toast.success('Track added to cart');
            }
        }
    };

    const handleDownload = async () => {
        const { data, error } = await supabaseClient.storage.from('tracks').download(track.track_path);
        var link = document.createElement('a')  // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
        link.href = window.URL.createObjectURL(data!);
        link.download = track.title
        link.click()
        link.remove();
    };

    if (products.length) {
        priceContent = (
            <div>
                {products.map((product) => {
                    if (!product.prices?.length) {
                        return (
                            <div key={product.id}>
                                No prices available
                            </div>
                        );
                    }

                    return product.prices.map((price) => (
                        <div key={price.id} className="flex group shadow-md py-5 px-5 flex-col justify-between items-center h-[50vh]">
                            <div className="flex flex-col gap-y-2">
                                <div className="font-normal text-xl">Basic</div>
                                <div className="font-semibold text-3xl">{formatPrice(price)}</div>
                            </div>
                            <div className="text-neutral-500 text-lg">WAV</div>
                            <div onClick={updateCart} className={twMerge(`transition duration-150 p-4 border rounded-md font-normal w-full text-white
                            cursor-pointer bg-blue-600 hover:bg-blue-500 text-sm flex justify-center items-center`, isInCart&&'hover:bg-red-500 bg-red-600')}>
                                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                            </div>
                        </div>
                    ))
                })}
            </div>
            
        );
    };

    return (
        <div className={twMerge(`pt-28 pb-4 flex gap-x-8 w-full h-full`, player.ids.length>0 && 'pb-28')}>
            <div className="flex flex-col gap-y-4 p-4 shadow-md h-full">
                <div className="group relative aspect-square min-w-[300px] min-h-[300px] overflow-hidden flex justify-center items-center">
                    <Image className="object-cover" src={imageUrl || '/images/placeholder.jpg'} fill alt="image" />
                    <Icon onClick={() => isPlaying ? GLOBAL_setIsPlaying(false) : isLocalTrack ? GLOBAL_setIsPlaying(true) : onPlay(track.id)} size={60} 
                    className="absolute cursor-pointer text-blue-600 hover:scale-110 transition"/>
                </div>
                <div className="flex flex-wrap gap-y-2 gap-x-3 max-w-[300px]">
                    {track.genres?.map((genre) => (
                        <div key={genre.title} className="flex gap-x-2 px-2 py-1 border border-neutral-300 rounded-full 
                        justify-center items-center text-sm text-center w-auto">
                            {genre.title}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    <div className="font-medium text-xl">BPM</div>
                    <div>{track.bpm}</div>
                </div>
                <div className="flex flex-col">
                    <div className="font-medium text-xl">Key</div>
                    <div>{track.keys?.title}</div>
                </div>
            </div>
            <div className="flex flex-col gap-y-8 w-full">
                <div className="flex items-center justify-between p-5 shadow-md w-full">
                    <div className="flex flex-col gap-y-5">
                        <div className="font-semibold text-5xl w-full">{track.title}</div>
                        <div onClick={() => router.push(`/profile/${track.users?.id}`)} className="text-3xl text-neutral-500 cursor-pointer hover:underline transition truncate">
                            {track.users?.full_name}
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-x-2">
                        {isPurchased&&(<AiOutlineDownload size={40} onClick={handleDownload} className="cursor-pointer text-blue-600 hover:text-blue-500 transition" />)}
                        <RelativeLikeButton trackId={track.id} size={40} />
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-y-2">
                    {priceContent}
                </div>
            </div>
        </div>
    );
}

export default PageContent;