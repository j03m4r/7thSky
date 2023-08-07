'use client';

import useAuthModal from "@/hooks/useAuthModal";
import useCheckoutModal from "@/hooks/useCheckoutModal";
import { useUser } from "@/hooks/useUser";
import { Track } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsCart, BsCartCheckFill } from "react-icons/bs";

interface CartButtonProps {
    track: Track;
};

const CartButton: React.FC<CartButtonProps> = ({
    track
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();

    const checkoutModal = useCheckoutModal();
    const authModal = useAuthModal();
    const { user } = useUser();

    const [isInCart, setIsInCart] = useState(false);

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
    }, [track.id, supabaseClient, user?.id, checkoutModal.products.length]);

    const Icon = isInCart ? BsCartCheckFill : BsCart

    const updateCart = async () => {
        if (!user) {
            return authModal.onOpen();
        }

        let localCart = [];
        if (isInCart) {
            localCart = checkoutModal.products.filter(function (otherTrack: Track) { return otherTrack.id !== track.id});
            checkoutModal.setProducts(localCart);

            const { error } = await supabaseClient.from('cart_tracks').delete().eq('user_id', user?.id).eq('track_id', track.id);

            if (error) {
                toast.error(error.message);
            } else {
                setIsInCart(false);
            }
        } else {
            checkoutModal.setProducts([...checkoutModal.products, track]);

            const { error } = await supabaseClient.from('cart_tracks').insert({user_id: user?.id, track_id: track.id});
    
            if (error) {
                toast.error(error.message);
            } else {
                setIsInCart(true);
                toast.success('Track added to cart');
            }
        }

        router.refresh();
    };

    return (
        <button onClick={updateCart} className="absolute right-2 bottom-2 opacity-0 transition hover:scale-110 group-hover:opacity-100">
            <Icon color={isInCart ? '#2563eb' : 'white'} size={25} />
        </button>
    );
}

export default CartButton;