import type { Product } from "../services/products";
import GlassCard from "./GlassCard";

export default function ProductMini({ p }: { p: Product }) {
  return (
    <GlassCard className="p-3 flex items-center gap-3">
      {p.imageUrl && <img src={p.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover" />}
      <div className="min-w-0">
        <div className="font-medium truncate">{p.title}</div>
        <div className="text-xs text-gray-500">{(p.price/100).toFixed(2)} €</div>
      </div>
    </GlassCard>
  );
}
