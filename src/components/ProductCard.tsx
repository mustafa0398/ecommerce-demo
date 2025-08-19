import type { Product } from "../services/products";
import { useCart } from "../store/cart";
import GlassCard from "./GlassCard";

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);

  return (
    <GlassCard
      className="
        group relative overflow-hidden h-full
        transition duration-300
        hover:scale-[1.02] hover:shadow-2xl hover:z-10
        will-change-transform
      "
    >
      <div className="flex h-full flex-col">
        <div className="relative">
          <div className="aspect-[4/3] bg-gray-100">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            )}
          </div>
          {product.category && (
            <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-2 py-0.5 text-xs font-medium">
              {product.category}
            </span>
          )}
        </div>

        <div className="flex grow flex-col p-4 gap-2">
          <h3 className="font-semibold text-[15px] leading-tight line-clamp-1">
            {product.title}
          </h3>

          {product.description && (
            <p
              className="
      text-sm text-gray-700
      overflow-hidden
      line-clamp-2
      min-h-[40px]                   /* reserviert Platz für ~2 Zeilen */
      transition-[max-height] duration-300 ease-out
      group-hover:line-clamp-none group-hover:max-h-96
    "
            >
              {product.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-1">
            <div className="text-base font-semibold">
              {(product.price / 100).toFixed(2)} €
            </div>
            <button
              onClick={() =>
                add(
                  {
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    imageUrl: product.imageUrl,
                  },
                  1
                )
              }
              className="rounded-full bg-black text-white px-4 py-1.5 text-sm font-medium shadow hover:opacity-90 active:scale-[0.98] transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
