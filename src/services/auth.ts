import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export const subscribeAuth = (cb: (u: any) => void) => onAuthStateChanged(auth, cb);

export function isAdminEmail(email?: string | null) {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || "";
  const list = raw
    .split(",")
    .map((s: string) => s.trim().toLowerCase()) 
    .filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}