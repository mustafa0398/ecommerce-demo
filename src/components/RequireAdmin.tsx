import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { subscribeAuth } from "../services/auth";
import { isAdminEmail } from "../services/auth";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [ready, setReady] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    return subscribeAuth(u => { setUser(u); setReady(true); });
  }, []);

  if (!ready) return null;                 
  if (!user) return <Navigate to="/" state={{ from: loc }} replace />;
  if (!isAdminEmail(user.email)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
