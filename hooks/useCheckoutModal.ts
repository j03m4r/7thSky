import { Track } from "@/types";
import { create } from "zustand";

interface CheckoutModalStore {
    isPurchased: boolean;
    isOpen: boolean;
    products: Track[];
    setProducts: (tracks: Track[]) => void;
    setIsPurchased: () => void;
    onOpen: () => void;
    onClose: () => void;
};

const useCheckoutModal = create<CheckoutModalStore>((set) => ({
    isPurchased: false,
    isOpen: false,
    products: [],
    setProducts: (tracks: Track[]) => set({ products: tracks }),
    setIsPurchased: () => set({ isPurchased: true }),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useCheckoutModal;