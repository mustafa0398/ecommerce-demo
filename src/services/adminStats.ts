import { db } from "../lib/firebase";
import {
  collection, getCountFromServer, getDocs, orderBy,
  query, where, limit
} from "firebase/firestore";
import type { Order } from "./orders";

export type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  revenue30d: number;           
  revenueToday: number;         
  topProducts30d: { title: string; qty: number }[];
  recentOrders: Order[];        
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const col = collection(db, "orders");
  const now = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const t30 = now - 30 * 24 * 60 * 60 * 1000;

  const [totalCntSnap, pendingCntSnap] = await Promise.all([
    getCountFromServer(col),
    getCountFromServer(query(col, where("status", "==", "pending"))),
  ]);

  const recentSnap = await getDocs(query(col, orderBy("createdAt", "desc"), limit(5)));
  const recentOrders = recentSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Order[];

  const last30Snap = await getDocs(query(col, where("createdAt", ">=", t30)));
  const last30 = last30Snap.docs.map((d) => d.data() as any) as Order[];

  let revenue30d = 0;
  let revenueToday = 0;
  const topMap = new Map<string, number>(); 

  for (const o of last30) {
    revenue30d += o.total || 0;
    if (o.createdAt >= startOfToday.getTime()) revenueToday += o.total || 0;
    for (const it of o.items || []) {
      topMap.set(it.title, (topMap.get(it.title) || 0) + (it.qty || 0));
    }
  }

  const topProducts30d = Array.from(topMap.entries())
    .map(([title, qty]) => ({ title, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return {
    totalOrders: totalCntSnap.data().count,
    pendingOrders: pendingCntSnap.data().count,
    revenue30d,
    revenueToday,
    topProducts30d,
    recentOrders,
  };
}
