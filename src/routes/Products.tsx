import { useEffect, useMemo, useState } from "react";
import { listProducts, type Product } from "../services/products";
import ProductCard from "../components/ProductCard";
import GlassCard from "../components/GlassCard";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    listProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const set = new Set(
      products.map((p) => p.category).filter(Boolean) as string[]
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "all" || p.category === cat) &&
          (q.trim() === "" ||
            (p.title + " " + (p.description ?? ""))
              .toLowerCase()
              .includes(q.toLowerCase()))
      ),
    [products, q, cat]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <GlassCard className="px-4 py-2 flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
          />
        </GlassCard>
        <GlassCard className="px-3 py-2 text-sm">
          {filtered.length} Treffer
        </GlassCard>
      </div>

      <div className="flex items-center gap-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              "px-3 py-1.5 rounded-full text-sm border " +
              (cat === c
                ? "bg-black text-white border-black"
                : "bg-white/60 backdrop-blur border-black/10")
            }
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Lade…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
