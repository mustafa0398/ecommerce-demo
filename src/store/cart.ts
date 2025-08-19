import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = { productId:string; title:string; price:number; imageUrl?:string; qty:number };

type CartState = {
  items: CartItem[];
  add: (i: Omit<CartItem,"qty">, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (p, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex(x => x.productId === p.productId);
        if (i >= 0) items[i].qty += qty; else items.push({ ...p, qty });
        set({ items: items.filter(x => x.qty > 0) }); 
      },
      remove: (id) => set({ items: get().items.filter(i => i.productId !== id) }),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: "cart" } 
  )
);
