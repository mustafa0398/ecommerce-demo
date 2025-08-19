import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProducts, type Product } from "../services/products";
import { useCart } from "../store/cart";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const add = useCart(s => s.add);

  useEffect(() => {
    listProducts().then(p => { setProducts(p); setLoading(false); });
  }, []);

  const featured = products[0]; 

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      <section className="relative overflow-hidden rounded-2xl border shadow-sm">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-400/50 via-orange-300/40 to-amber-300/40" />
          {featured?.imageUrl && (
            <img
              src={featured.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[18px] scale-110"
            />
          )}
        </div>

        <div className="relative p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
          <div className="max-w-xl text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
              {featured?.category ?? "FEATURED"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {(featured?.title ?? "NUPTSE JACKET").toUpperCase()}
            </h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/90">
              {featured?.description ??
                "Built for mountain and city-life. Relaxed fit with a boxy silhouette. Inspired by the iconic 1996 lines."}
            </p>
            <div className="mt-6 text-2xl font-bold">
              {featured ? (featured.price / 100).toFixed(2) + " €" : "—"}
            </div>

            <div className="mt-6 flex items-center gap-3">
              {featured && (
                <button
                  onClick={() =>
                    add({
                      productId: featured.id,
                      title: featured.title,
                      price: featured.price,
                      imageUrl: featured.imageUrl,
                    })
                  }
                  className="rounded-md bg-white text-gray-900 px-4 py-2 text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition"
                >
                  In den Warenkorb
                </button>
              )}
              <Link
                to="/products"
                className="rounded-md border border-white/70 text-white px-4 py-2 text-sm font-medium hover:bg-white/10"
              >
                Jetzt shoppen
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-black/10 blur-2xl rounded-3xl" aria-hidden />
            <img
              src={
                featured?.imageUrl ??
                "https://picsum.photos/seed/jacket/1200/900"
              }
              alt={featured?.title ?? "Featured"}
              className="relative w-full max-w-xl mx-auto rounded-xl shadow-2xl object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Neu im Shop</h2>
          <Link to="/products" className="text-sm underline">Alle Produkte</Link>
        </div>
        {loading ? (
          <div>Lade…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map(p => (
              <article key={p.id} className="rounded-xl border shadow-sm overflow-hidden bg-white">
                <div className="aspect-[4/3] bg-gray-100">
                  {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />}
                </div>
                <div className="p-3">
                  <div className="text-sm text-gray-500">{p.category}</div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
                  <div className="mt-2 font-semibold">{(p.price/100).toFixed(2)} €</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
