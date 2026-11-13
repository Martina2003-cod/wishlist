import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Summary from './components/Summary.jsx';
import Collection from './components/Collection.jsx';
import Footer from './components/Footer.jsx';
import ItemForm from './components/ItemForm.jsx';
import ItemDetail from './components/ItemDetail.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import Toasts from './components/Toasts.jsx';
import { useWishlist } from './hooks/useWishlist.js';
import { useToasts } from './hooks/useToasts.js';
import { PRIORITY_RANK } from './lib/constants.js';

const INITIAL_FILTERS = { tab: 'all', category: 'all', priority: 'all', query: '', sort: 'recent' };

export default function App() {
  const { items, loading, error, mode, addItem, editItem, removeItem, setStatus } = useWishlist();
  const { toasts, push, dismiss } = useToasts();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [form, setForm] = useState({ open: false, item: null });
  const [detailId, setDetailId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState(null);

  /* Número editorial fijo para cada prenda (N° 01, N° 02…) según orden de alta. */
  const numbers = useMemo(() => {
    const map = {};
    [...items].sort((a, b) => a.createdAt - b.createdAt).forEach((it, i) => (map[it.id] = i + 1));
    return map;
  }, [items]);

  const stats = useMemo(() => {
    const pending = items.filter((i) => i.status === 'pending');
    const purchased = items.filter((i) => i.status === 'purchased');
    return {
      total: items.length,
      pending: pending.length,
      purchased: purchased.length,
      pendingValue: pending.reduce((sum, i) => sum + (Number(i.price) || 0), 0),
      purchasedValue: purchased.reduce((sum, i) => sum + (Number(i.price) || 0), 0),
    };
  }, [items]);

  const visibleItems = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const list = items.filter(
      (it) =>
        (filters.tab === 'all' || it.status === filters.tab) &&
        (filters.category === 'all' || it.category === filters.category) &&
        (filters.priority === 'all' || it.priority === filters.priority) &&
        (!q || `${it.name} ${it.brand}`.toLowerCase().includes(q))
    );
    const sorters = {
      recent: (a, b) => b.createdAt - a.createdAt,
      priority: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.createdAt - a.createdAt,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    };
    return list.sort(sorters[filters.sort]);
  }, [items, filters]);

  const detailItem = items.find((i) => i.id === detailId) || null;

  /* ───── Navegación ───── */
  const goToCollection = (tab) => {
    setFilters((f) => ({ ...f, tab }));
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };
  const openAdd = () => setForm({ open: true, item: null });
  const openEdit = (item) => {
    setDetailId(null);
    setForm({ open: true, item });
  };
  const askDelete = (item) => {
    setDetailId(null);
    setToDelete(item);
  };

  /* ───── CRUD ───── */
  async function handleSave(values) {
    setSaving(true);
    try {
      if (form.item) {
        await editItem(form.item.id, values);
        push('Cambios guardados.');
      } else {
        await addItem(values);
        push('Guardado en tu wishlist.');
      }
      setForm({ open: false, item: null });
    } catch (err) {
      console.error(err);
      push('No pudimos guardar la prenda. Intentá de nuevo.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(item) {
    const next = item.status === 'purchased' ? 'pending' : 'purchased';
    setPendingStatusId(item.id);
    try {
      await setStatus(item.id, next);
      push(next === 'purchased' ? `“${item.name}” pasó a Mis compras.` : `“${item.name}” volvió a tu wishlist.`);
    } catch (err) {
      console.error(err);
      push('No pudimos actualizar el estado.', 'error');
    } finally {
      setPendingStatusId(null);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await removeItem(toDelete.id);
      push(`“${toDelete.name}” se eliminó de tu wishlist.`);
      setToDelete(null);
    } catch (err) {
      console.error(err);
      push('No pudimos eliminar la prenda.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <a className="skip-link" href="#collection">Ir a la colección</a>
      <Header activeTab={filters.tab} onNavigate={goToCollection} onAdd={openAdd} />

      <main>
        <Hero onAdd={openAdd} total={stats.total} />
        <Summary stats={stats} loading={loading} />
        <Collection
          items={visibleItems}
          allCount={items.length}
          stats={stats}
          numbers={numbers}
          filters={filters}
          setFilters={setFilters}
          resetFilters={() => setFilters((f) => ({ ...INITIAL_FILTERS, tab: f.tab }))}
          loading={loading}
          error={error}
          pendingStatusId={pendingStatusId}
          onOpen={(item) => setDetailId(item.id)}
          onEdit={openEdit}
          onToggleStatus={handleToggleStatus}
          onAdd={openAdd}
        />
      </main>

      <Footer mode={mode} />

      <ItemForm
        open={form.open}
        item={form.item}
        saving={saving}
        onClose={() => !saving && setForm({ open: false, item: null })}
        onSubmit={handleSave}
      />

      <ItemDetail
        item={detailItem}
        number={detailItem ? numbers[detailItem.id] : null}
        busy={pendingStatusId === detailId}
        onClose={() => setDetailId(null)}
        onEdit={openEdit}
        onDelete={askDelete}
        onToggleStatus={handleToggleStatus}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="¿Eliminar esta prenda?"
        message={toDelete ? `“${toDelete.name}” de ${toDelete.brand} se quitará de tu wishlist. Esta acción no se puede deshacer.` : ''}
        confirmLabel="Eliminar"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setToDelete(null)}
      />

      <Toasts toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
