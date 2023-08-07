'use client';

import { Price, ProductWithPrice, Track } from "@/types";
import Modal from "./Modal";
import useCheckoutModal from "@/hooks/useCheckoutModal";
import CheckoutItem from "../items/CheckoutItem";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { twMerge } from "tailwind-merge";

interface CheckoutModalProps {
    price?: Price;
    cartItems: Track[];
};

const formatPrice = (numTracks: number) => {
    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'usd',
        minimumFractionDigits: 0
    }).format(numTracks*25);

    return priceString;
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ price, cartItems }) => {
    const checkoutModal = useCheckoutModal();
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        checkoutModal.setProducts(cartItems);
    }, [cartItems.length,]);

    const onChange = (open: boolean) => {
        if (!open) {
            checkoutModal.onClose();
        }
    };

    const handleCheckout = async () => {
        setLoading(true);

        if (!user) {
            setLoading(false);
            return toast.error('Must be logged in');
        }

        if (!price) {
            setLoading(false);
            return toast.error('Price error');
        }

        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price, quantity: checkoutModal.products.length }
            });

            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            toast.error((error as Error)?.message);
        } finally {
            setLoading(false);
        }
    };

    let content = (
        <div className="text-center font-semibold text-xl m-16">
            No Items in Cart
        </div>
    );

    let footer = (<div></div>);

    if (checkoutModal.products.length) {
        footer = (
            <div className="flex flex-col gap-y-6 mt-6">
                <hr />
                <div className="flex justify-end">
                    <div className="flex gap-x-4">
                        <div className="flex flex-col gap-y-1 justify-center">
                            <p className="text-sm text-neutral-500">Total:</p>
                            <p className="text-lg font-medium">{checkoutModal.products.length ? formatPrice(checkoutModal.products.length) : '$0.00'}</p>
                        </div>
                        <div onClick={checkoutModal.products.length ? handleCheckout : () => {}} // START CHECKOUT
                        className={twMerge(`text-center p-4 rounded-lg bg-blue-600 text-white hover:bg-blue-500`, 
                        checkoutModal.products.length?'cursor-pointer':'cursor-not-allowed', loading&&'cursor-not-allowed opacity-40')}>
                            Checkout
                        </div> 
                    </div>
                </div>
            </div>
        );
    }
    

    if (checkoutModal.products.length) {
        content = (
            <div className="flex gap-y-4 flex-col">
                <div className="flex">
                    <div className="flex gap-x-1 px-2 py-1 border border-neutral-300 rounded-full 
                    justify-center items-center text-sm text-center">
                            Track<div>x{checkoutModal.products.length}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-y-4 justify-start items-start max-h-[60vh] overflow-y-auto">
                    {checkoutModal.products.map((product) => (
                        <CheckoutItem key={product.id} track={product} isLoading={loading} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Modal title="Checkout" description="Preview products" isOpen={checkoutModal.isOpen} onChange={onChange}>
            {content}
            {footer}
        </Modal>
    );
};

export default CheckoutModal;