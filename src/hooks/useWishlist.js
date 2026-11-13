import { useCallback, useEffect, useState } from 'react';
import { ensureUser, isFirebaseConfigured } from '../firebase';
import {
  createItem,
  deleteItem,
  setItemStatus,
  subscribeItems,
  updateItem,
} from '../services/wishlistService';

function friendlyError(err) {
  const code = err?.code || '';
  if (code.includes('permission-denied')) return 'No tenés permisos para ver estos datos. Revisá las reglas de Firestore.';
  if (code.includes('operation-not-allowed')) return 'Activá el inicio de sesión anónimo en Firebase Authentication.';
  if (code.includes('unavailable') || code.includes('network')) return 'Sin conexión con Firebase. Revisá tu internet.';
  return 'No pudimos cargar tu wishlist. Intentá recargar la página.';
}

/** Estado global de la wishlist: autenticación, suscripción en tiempo real y operaciones CRUD. */
export function useWishlist() {
  const [uid, setUid] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};
    ensureUser()
      .then((id) => {
        if (cancelled) return;
        setUid(id);
        unsubscribe = subscribeItems(
          id,
          (list) => {
            setItems(list);
            setError(null);
            setLoading(false);
          },
          (err) => {
            console.error(err);
            setError(friendlyError(err));
            setLoading(false);
          }
        );
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setError(friendlyError(err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const requireUid = useCallback(() => {
    if (!uid) throw new Error('Usuario no autenticado');
    return uid;
  }, [uid]);

  return {
    items,
    loading,
    error,
    mode: isFirebaseConfigured ? 'firebase' : 'demo',
    addItem: (values) => createItem(requireUid(), values),
    editItem: (id, values) => updateItem(requireUid(), id, values),
    removeItem: (id) => deleteItem(requireUid(), id),
    setStatus: (id, status) => setItemStatus(requireUid(), id, status),
  };
}
