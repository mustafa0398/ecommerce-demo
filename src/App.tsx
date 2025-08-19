import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  loginWithGoogle,
  logout,
  subscribeAuth,
  isAdminEmail,
} from "./services/auth";
import { useCart } from "./store/cart";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const cartCount = useCart((s) => s.count());
  useEffect(() => subscribeAuth(setUser), []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 bg-white/95 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-4">
          <Link to="/" className="font-semibold">
            E-Commerce
          </Link>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <Link to="/products" className="hover:underline">
              Produkte
            </Link>
            <Link to="/cart" className="hover:underline">
              Warenkorb ({cartCount})
            </Link>
            <Link to="/checkout" className="hover:underline">
              Kasse
            </Link>
            {user && (
              <Link to="/orders" className="hover:underline">
                Bestellungen
              </Link>
            )}

            {user && isAdminEmail(user.email) && (
              <>
                <Link to="/admin" className="hover:underline">
                  Admin
                </Link>
                <Link to="/admin/products" className="hover:underline">
                  Produkte (Admin)
                </Link>
              </>
            )}

            {user ? (
              <>
                <span className="hidden sm:inline text-gray-600">
                  {user.email}
                </span>
                <button onClick={logout} className="border rounded px-3 py-1">
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="border rounded px-3 py-1"
              >
                Login mit Google
              </button>
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
