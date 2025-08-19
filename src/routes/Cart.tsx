import { Link } from "react-router-dom";
import { useCart } from "../store/cart";
import { formatPrice } from "../utils/format";

export default function Cart() {
  const { items, remove, clear, total } = useCart();
  const add = useCart((s) => s.add);

  if (!items.length) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Warenkorb</h1>
        <div>Warenkorb ist leer.</div>
        <Link to="/" className="mt-4 inline-block border px-3 py-2 rounded">
          Weiter shoppen
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Warenkorb</h1>

      {items.map((i) => (
        <div key={i.productId} className="flex items-center gap-3 border rounded p-3">
          {i.imageUrl && (
            <img src={i.imageUrl} alt={i.title} className="w-24 h-24 object-cover rounded" />
          )}

          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{i.title}</div>
            <div className="text-sm text-gray-600">{formatPrice(i.price)}</div>

            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() =>
                  add({ productId: i.productId, title: i.title, price: i.price, imageUrl: i.imageUrl }, -1)
                }
                className="border px-2 rounded"
                aria-label="Menge verringern"
              >
                −
              </button>
              <span className="w-6 text-center">{i.qty}</span>
              <button
                onClick={() =>
                  add({ productId: i.productId, title: i.title, price: i.price, imageUrl: i.imageUrl }, 1)
                }
                className="border px-2 rounded"
                aria-label="Menge erhöhen"
              >
                +
              </button>
            </div>
          </div>

          <button onClick={() => remove(i.productId)} className="border px-3 py-1 rounded shrink-0">
            Entfernen
          </button>
        </div>
      ))}

      <div className="text-right font-semibold">Summe: {formatPrice(total())}</div>

      <div className="flex justify-end gap-2">
        <button onClick={clear} className="border px-3 py-2 rounded">Leeren</button>
        <Link to="/checkout" className="border px-3 py-2 rounded">Zur Kasse</Link>
      </div>
    </div>
  );
}
