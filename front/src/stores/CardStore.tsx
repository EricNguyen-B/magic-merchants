import { create } from 'zustand';

interface Card {
    id: string;
    name: string;
}

interface CardState {
    price: number;
    selectPrice: (by: number) => void;
    cardOptions: Card[];
    selectOptions: (options: Card[]) => void;
    name: string;
    selectName: (name: string) => void;
    imageUrl: string;
    selectImageUrl: (url: string) => void;
    set: string; 
    selectSet: (set: string) => void;
    condition: string;
    selectCondition: (condition: string) => void;
}

export const useCardStore = create<CardState>()((set) => ({
    price: 0,
    selectPrice: (price) => set(() => ({ price })),
    cardOptions: [],
    selectOptions: (cardOptions) => set(() => ({ cardOptions })),
    name: "",
    selectName: (name) => set(() => ({ name })),
    imageUrl: "",
    selectImageUrl: (imageUrl) => set(() => ({ imageUrl })),
    set: "",
    selectSet: (setVal) => set(() => ({ set: setVal })),
    condition: "",
    selectCondition: (condition) => set(() => ({ condition })),
}));
