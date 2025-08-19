import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  type DocumentData,
} from "firebase/firestore";

export type Product = {
  id: string;
  title: string;
  description?: string;
  price: number;       
  imageUrl?: string;
  category?: string;
  createdAt?: number;
};

const colRef = collection(db, "products");

export async function listProducts(): Promise<Product[]> {
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) })) as Product[];
}

export async function addProduct(p: Omit<Product, "id">) {
  await addDoc(colRef, { ...p, createdAt: Date.now() });
}

export async function updateProduct(id: string, data: Partial<Omit<Product, "id">>) {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, data);
}

export async function deleteProduct(id: string) {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
}
