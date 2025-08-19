import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../lib/firebase";       
import { v4 as uuid } from "uuid";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024;

function getExt(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

export async function uploadImage(file: File, folder = "products"): Promise<string> {
  validateFile(file);

  const ext = getExt(file.name) || guessExt(file.type) || "jpg";
  const filename = `${uuid()}.${ext}`;
  const path = `${folder}/${filename}`;

  const objectRef = ref(storage, path);
  await uploadBytes(objectRef, file, { contentType: file.type });
  return getDownloadURL(objectRef);
}

export async function uploadImageWithPath(
  file: File,
  folder = "products"
): Promise<{ url: string; path: string }> {
  validateFile(file);

  const ext = getExt(file.name) || guessExt(file.type) || "jpg";
  const filename = `${uuid()}.${ext}`;
  const path = `${folder}/${filename}`;

  const objectRef = ref(storage, path);
  await uploadBytes(objectRef, file, { contentType: file.type });
  const url = await getDownloadURL(objectRef);
  return { url, path };
}

export async function deleteByPath(storagePath: string): Promise<void> {
  const objectRef = ref(storage, storagePath);
  await deleteObject(objectRef);
}


function validateFile(file: File) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Nur PNG, JPEG, WEBP oder GIF sind erlaubt.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Datei ist größer als 5 MB.");
  }
}

function guessExt(mime: string): string | undefined {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return undefined;
}
