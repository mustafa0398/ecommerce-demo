import { useEffect, useState } from "react";
import { useCart } from "../store/cart";
import { subscribeAuth } from "../services/auth";
import { createOrder } from "../services/orders";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/format";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => subscribeAuth(setUser), []);

  async function handleTestOrder() {
    if (!user) return alert("Bitte zuerst einloggen.");
    if (!items.length) return alert("Warenkorb ist leer.");

    await createOrder({
      userId: user.uid,
      items,
      total: total(),          
      status: "pending",       
    });

    clear();
    alert("Testbestellung erstellt!");
    navigate("/orders");       
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Kasse</h1>
      <div>Artikel: {items.reduce((s,i)=>s+i.qty,0)} — Summe: {formatPrice(total())}</div>

      <button onClick={handleTestOrder} className="border px-3 py-2 rounded">
        Testbestellung anlegen (ohne Zahlung)
      </button>
    </main>
  );
}