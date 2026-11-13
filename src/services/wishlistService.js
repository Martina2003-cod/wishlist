/**
 * Capa de datos de WISHLIST.
 * - Con Firebase configurado: Cloud Firestore en users/{uid}/items/{itemId}.
 * - Sin configuración: modo demo con localStorage (misma interfaz), útil para desarrollar.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { SEED_ITEMS } from './seed';

/** Normaliza los valores del formulario a lo que se guarda en la base. */
export function toRecord(values) {
  return {
    name: values.name.trim(),
    brand: values.brand.trim(),
    price: Math.round(Number(values.price)),
    category: values.category,
    imageUrl: values.imageUrl.trim(),
    link: values.link.trim(),
    priority: values.priority,
  };
}

/* ───────────── Firestore ───────────── */

const itemsCol = (uid) => collection(db, 'users', uid, 'items');

function fromSnapshot(snap) {
  return snap.docs.map((d) => {
    const data = d.data({ serverTimestamps: 'estimate' });
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
      purchasedAt: data.purchasedAt?.toMillis?.() ?? null,
    };
  });
}

/* ───────────── Modo demo (localStorage) ───────────── */

const LS_KEY = 'wishlist:items:v1';
const listeners = new Set();

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw === null) {
      localStorage.setItem(LS_KEY, JSON.stringify(SEED_ITEMS));
      return SEED_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ITEMS;
  }
}

function writeLocal(items) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {
    /* almacenamiento no disponible: seguimos en memoria */
  }
  const sorted = sortByRecent(items);
  listeners.forEach((fn) => fn(sorted));
}

const sortByRecent = (items) => [...items].sort((a, b) => b.createdAt - a.createdAt);
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
let memory = null;
const getLocal = () => (memory ??= readLocal());
const setLocal = (items) => {
  memory = items;
  writeLocal(items);
};

/* ───────────── API pública ───────────── */

export function subscribeItems(uid, onData, onError) {
  if (!isFirebaseConfigured) {
    listeners.add(onData);
    onData(sortByRecent(getLocal()));
    return () => listeners.delete(onData);
  }
  const q = query(itemsCol(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => onData(fromSnapshot(snap)), onError);
}

export async function createItem(uid, values) {
  const record = { ...toRecord(values), status: 'pending', purchasedAt: null };
  if (!isFirebaseConfigured) {
    await delay();
    const item = { ...record, id: crypto.randomUUID(), createdAt: Date.now() };
    setLocal([item, ...getLocal()]);
    return item.id;
  }
  const ref = await addDoc(itemsCol(uid), { ...record, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateItem(uid, id, values) {
  return patchItem(uid, id, toRecord(values));
}

export async function setItemStatus(uid, id, status) {
  const purchased = status === 'purchased';
  if (!isFirebaseConfigured) {
    return patchItem(uid, id, { status, purchasedAt: purchased ? Date.now() : null });
  }
  return patchItem(uid, id, { status, purchasedAt: purchased ? serverTimestamp() : null });
}

async function patchItem(uid, id, patch) {
  if (!isFirebaseConfigured) {
    await delay();
    setLocal(getLocal().map((it) => (it.id === id ? { ...it, ...patch } : it)));
    return;
  }
  await updateDoc(doc(db, 'users', uid, 'items', id), patch);
}

/** Carga las prendas de ejemplo en la wishlist del usuario (útil para una primera visita). */
export async function seedSampleItems(uid) {
  const now = Date.now();
  const offset = (item) => now - (SEED_ITEMS.length - SEED_ITEMS.indexOf(item)) * 60_000;
  if (!isFirebaseConfigured) {
    await delay();
    const fresh = SEED_ITEMS.map((it) => ({
      ...it,
      id: crypto.randomUUID(),
      createdAt: offset(it),
      purchasedAt: it.purchasedAt ? now : null,
    }));
    setLocal([...fresh, ...getLocal()]);
    return;
  }
  const batch = writeBatch(db);
  SEED_ITEMS.forEach((it) => {
    const { id, createdAt, purchasedAt, ...data } = it;
    batch.set(doc(itemsCol(uid)), {
      ...data,
      createdAt: Timestamp.fromMillis(offset(it)),
      purchasedAt: purchasedAt ? Timestamp.fromMillis(now) : null,
    });
  });
  await batch.commit();
}

export async function deleteItem(uid, id) {
  if (!isFirebaseConfigured) {
    await delay();
    setLocal(getLocal().filter((it) => it.id !== id));
    return;
  }
  await deleteDoc(doc(db, 'users', uid, 'items', id));
}
