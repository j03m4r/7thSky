'use client';

import useCheckoutModal from "@/hooks/useCheckoutModal";
import { useUser } from "@/hooks/useUser";
import { BsCartFill } from "react-icons/bs";

const OpenCartButton = () => {
    const checkoutModal = useCheckoutModal();

    const { user, isLoading } = useUser();

    if (!user&&!isLoading) {
        return null;
    }

    return (
        <div className="relative">
            <div onClick={checkoutModal.onOpen} className="p-4 md:py-2 md:px-3 flex flex-row items-center
            gap-3 rounded-full hover:shadow-md transition cursor-pointer">
                {checkoutModal.products.length}
                <BsCartFill size={20} />
            </div>
        </div>
    );
}

export default OpenCartButton;