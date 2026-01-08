import { create } from "zustand";

interface PremiumModalState {
    open: boolean;
    setOpen: (isOpen: boolean) => void;
}

const usePremiumModal = create<PremiumModalState>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
}));

export default usePremiumModal;