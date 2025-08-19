import { useEffect, useState } from "react";
import {
  listProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from "../services/products";
import { uploadImageWithPath, deleteByPath } from "../services/storage";
import { auth } from "../lib/firebase";

type ImageMode = "file" | "url";

type FormState = {
  id?: string;
  title: string;
  priceEUR: string;
  description?: string;
  category?: string;

  imageMode: ImageMode;   
  file?: File | null;
  imageUrl?: string;      
  storagePath?: string;   
};

const toEUR = (cents: number) => (cents / 100).toFixed(2);
const toCents = (eur: string) => Math.round(parseFloat(eur.replace(",", ".")) * 100);

export default function Admin() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    priceEUR: "",
    description: "",
    category: "",
    imageMode: "file",
    file: null,
    imageUrl: "",
    storagePath: "",
  });

  useEffect(() => {
    (async () => {
      const p = await listProducts();
      setItems(p);
      setLoading(false);
    })();
  }, []);

  function resetForm() {
    setForm({
      title: "",
      priceEUR: "",
      description: "",
      category: "",
      imageMode: "file",
      file: null,
      imageUrl: "",
      storagePath: "",
    });
  }

  function edit(p: Product) {
    setForm({
      id: p.id,
      title: p.title,
      priceEUR: toEUR(p.price),
      description: p.description ?? "",
      category: p.category ?? "",
      imageMode: (p.imageUrl ? "url" : "file"),
      imageUrl: p.imageUrl ?? "",
      storagePath: (p as any).storagePath ?? "",
      file: null,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!auth.currentUser) {
      setError("Bitte zuerst einloggen.");
      return;
    }

    const title = form.title.trim();
    const cents = toCents(form.priceEUR);
    if (!title || isNaN(cents) || cents <= 0) {
      setError("Titel und ein gültiger Preis (z. B. 19.99) sind Pflicht.");
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = form.imageUrl?.trim() || "";
      let storagePath = form.storagePath || "";

      if (form.imageMode === "file") {
        if (form.file) {
          if (storagePath) {
            try { await deleteByPath(storagePath); } catch { /* ignore */ }
          }
          const uploaded = await uploadImageWithPath(form.file);
          imageUrl = uploaded.url;
          storagePath = uploaded.path;
        }
      } else {
        if (storagePath) {
          try { await deleteByPath(storagePath); } catch { /* ignore */ }
          storagePath = "";
        }
        if (!imageUrl) {
          setError("Bitte eine Bild-URL eingeben oder Datei auswählen.");
          setSubmitting(false);
          return;
        }
      }

      const payload: any = {
        title,
        price: cents,
        description: form.description?.trim() || undefined,
        category: form.category?.trim() || undefined,
        imageUrl: imageUrl || undefined,
        storagePath: storagePath || undefined,
        createdAt: Date.now(),
      };

      if (form.id) {
        await updateProduct(form.id, payload);
      } else {
        await addProduct(payload);
      }

      setItems(await listProducts());
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Fehler beim Speichern/Upload.");
      alert(err?.message ?? "Fehler beim Speichern/Upload.");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string, storagePath?: string) {
    try {
      if (storagePath) {
        try { await deleteByPath(storagePath); } catch { /* ignore */ }
      }
      await deleteProduct(id);
      setItems(await listProducts());
    } catch (err) {
      console.error(err);
      alert("Fehler beim Löschen.");
    }
  }

  const FilePicker = (
    <div>
      <label className="inline-flex items-center gap-3">
        <span className="inline-block border rounded px-3 py-2 cursor-pointer bg-white">
          Datei auswählen
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setForm((f) => ({ ...f, file, imageUrl: f.imageUrl })); 
            }}
          />
        </span>
        <span className="text-sm text-gray-600">
          {form.file ? form.file.name : "Keine Datei ausgewählt"}
        </span>
      </label>
      {form.file && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(form.file)}
            alt="Preview"
            className="w-24 h-24 object-cover rounded"
          />
        </div>
      )}
    </div>
  );

  const UrlInput = (
    <div className="space-y-2">
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="https://... Bild-URL"
        value={form.imageUrl}
        onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
      />
      {form.imageUrl && (
        <img
          src={form.imageUrl}
          alt="Preview"
          className="w-24 h-24 object-cover rounded"
        />
      )}
    </div>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Admin · Produkte</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <form onSubmit={save} className="grid gap-3 bg-white border rounded-lg p-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Titel"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Preis in EUR (z. B. 19.99)"
            value={form.priceEUR}
            onChange={(e) =>
              setForm((f) => ({ ...f, priceEUR: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, imageMode: "file" }))}
            className={`px-3 py-1 rounded border ${
              form.imageMode === "file" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            Bild hochladen
          </button>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, imageMode: "url" }))}
            className={`px-3 py-1 rounded border ${
              form.imageMode === "url" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            Bild-URL verwenden
          </button>
        </div>

        {form.imageMode === "file" ? FilePicker : UrlInput}

        <input
          className="border rounded px-3 py-2"
          placeholder="Kategorie"
          value={form.category}
          onChange={(e) =>
            setForm((f) => ({ ...f, category: e.target.value }))
          }
        />
        <textarea
          className="border rounded px-3 py-2"
          placeholder="Beschreibung"
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <div className="flex gap-2">
          <button
            disabled={submitting}
            className="border rounded px-3 py-2 bg-blue-600 text-white disabled:opacity-60"
          >
            {submitting
              ? "Speichere…"
              : form.id
              ? "Änderungen speichern"
              : "Produkt anlegen"}
          </button>
          {form.id && (
            <button
              type="button"
              className="border rounded px-3 py-2"
              onClick={resetForm}
            >
              Abbrechen
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div>Lade…</div>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Bild</th>
              <th className="text-left p-3">Titel</th>
              <th className="text-left p-3">Preis</th>
              <th className="text-left p-3">Kategorie</th>
              <th className="p-3">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      className="w-16 h-16 object-cover rounded"
                      alt=""
                    />
                  )}
                </td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">{toEUR(p.price)} €</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    className="border rounded px-3 py-1"
                    onClick={() => edit(p)}
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="border rounded px-3 py-1 text-red-600"
                    onClick={() =>
                      remove(
                        p.id,
                        (p as any).storagePath as string | undefined
                      )
                    }
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
