import { db } from "../lib/firebase";
import {
  addDoc, collection, serverTimestamp,
  getDocs, orderBy, query, where
} from "firebase/firestore";
import type { CartItem } from "../store/cart";

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;               
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: number;            
};

const col = collection(db, "orders");

export async function createOrder(input: {
  userId: string;
  items: CartItem[];
  total: number;
  status?: Order["status"];
}) {
  const doc = await addDoc(col, {
    userId: input.userId,
    items: input.items,
    total: input.total,
    status: input.status ?? "pending",
    createdAt: Date.now(),
    createdAtTs: serverTimestamp()
  });
  return doc.id;
}

export async function listMyOrders(userId: string): Promise<Order[]> {
  const q = query(col,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Order[];
}
