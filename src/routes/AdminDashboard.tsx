import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "../services/adminStats";
import { formatPrice } from "../utils/format";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const s = await getDashboardStats();
      setStats(s);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Dashboard konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Admin · Dashboard</h1>
        <button
          onClick={load}
          className="ml-auto border rounded px-3 py-1 text-sm"
          aria-label="Aktualisieren"
        >
          Aktualisieren
        </button>
        <Link to="/admin/products" className="border rounded px-3 py-1 text-sm">
          Produkte (Admin)
        </Link>
      </div>

      {loading ? (
        <div>Lade…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !stats ? (
        <div className="text-gray-600">Keine Daten.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi title="Bestellungen gesamt" value={stats.totalOrders.toString()} />
            <Kpi title="Offen (pending)" value={stats.pendingOrders.toString()} />
            <Kpi title="Umsatz heute" value={formatPrice(stats.revenueToday)} />
            <Kpi title="Umsatz 30 Tage" value={formatPrice(stats.revenue30d)} />
          </div>

          <section className="bg-white border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Top-Produkte (30 Tage)</h2>
            {stats.topProducts30d.length === 0 ? (
              <div className="text-gray-600 text-sm">Keine Daten.</div>
            ) : (
              <ul className="space-y-2">
                {stats.topProducts30d.map((p) => (
                  <li key={p.title} className="flex justify-between">
                    <span>{p.title}</span>
                    <span className="font-medium">× {p.qty}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Letzte Bestellungen</h2>
            <div className="divide-y">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">#{o.id.slice(0, 6)}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      {new Date(o.createdAt).toLocaleString()}
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                  <div className="font-semibold">{formatPrice(o.total)}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "paid" | "shipped" | "cancelled" }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    cancelled: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${map[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
