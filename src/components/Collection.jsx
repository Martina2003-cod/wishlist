import ItemCard from './ItemCard.jsx';
import { CATEGORIES, PRIORITIES, SORTS } from '../lib/constants.js';

const TABS = [
  { value: 'all', label: 'Todo', key: 'total' },
  { value: 'pending', label: 'My Wishlist', key: 'pending' },
  { value: 'purchased', label: 'Purchased', key: 'purchased' },
];

/** 04 — My Collection: filtros, grilla de productos y acciones. */
export default function Collection({
  items,
  allCount,
  stats,
  numbers,
  filters,
  setFilters,
  resetFilters,
  loading,
  error,
  pendingStatusId,
  onOpen,
  onEdit,
  onToggleStatus,
  onAdd,
  onLoadSamples,
  seeding,
}) {
  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target ? e.target.value : e }));
  const hasExtraFilters =
    filters.category !== 'all' || filters.priority !== 'all' || filters.query.trim() !== '';

  return (
    <section className="collection container" id="collection" aria-labelledby="collection-title">
      <header className="collection-head">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-num">04</span> The Archive
          </p>
          <h2 id="collection-title" className="section-title section-title-xl">
            My <em>Collection</em>
          </h2>
        </div>

        <div className="tabs" role="tablist" aria-label="Estado">
          {TABS.map((t) => (
            <button
              key={t.value}
              role="tab"
              type="button"
              aria-selected={filters.tab === t.value}
              className={`tab ${filters.tab === t.value ? 'is-active' : ''}`}
              onClick={() => setFilters((f) => ({ ...f, tab: t.value }))}
            >
              {t.label} <sup>{stats[t.key]}</sup>
            </button>
          ))}
        </div>
      </header>

      <div className="filters">
        <div className="chips" role="group" aria-label="Categoría">
          {['all', ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${filters.category === c ? 'is-active' : ''}`}
              aria-pressed={filters.category === c}
              onClick={() => set('category')(c)}
            >
              {c === 'all' ? 'Todas' : c}
            </button>
          ))}
        </div>

        <div className="filter-controls">
          <label className="field-inline search">
            <span className="sr-only">Buscar por nombre o marca</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input
              type="search"
              placeholder="Buscar prenda o marca"
              value={filters.query}
              onChange={set('query')}
            />
          </label>
          <label className="field-inline">
            <span>Prioridad</span>
            <select value={filters.priority} onChange={set('priority')}>
              <option value="all">Todas</option>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </label>
          <label className="field-inline">
            <span>Ordenar</span>
            <select value={filters.sort} onChange={set('sort')}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="result-line" aria-live="polite">
        {loading ? 'Cargando tu archivo…' : `${items.length} ${items.length === 1 ? 'pieza' : 'piezas'}`}
        {hasExtraFilters && !loading && (
          <button type="button" className="link-btn" onClick={resetFilters}>Limpiar filtros</button>
        )}
      </p>

      {error ? (
        <div className="empty" role="alert">
          <p className="empty-title">Algo no salió como esperábamos.</p>
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div className="grid" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card skeleton">
              <div className="card-media" />
              <div className="sk-line" />
              <div className="sk-line short" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          allCount={allCount}
          tab={filters.tab}
          onAdd={onAdd}
          onReset={resetFilters}
          filtered={hasExtraFilters}
          onLoadSamples={onLoadSamples}
          seeding={seeding}
        />
      ) : (
        <ul className="grid">
          {items.map((item) => (
            <li key={item.id}>
              <ItemCard
                item={item}
                number={numbers[item.id]}
                busy={pendingStatusId === item.id}
                onOpen={() => onOpen(item)}
                onEdit={() => onEdit(item)}
                onToggleStatus={() => onToggleStatus(item)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EmptyState({ allCount, tab, onAdd, onReset, filtered, onLoadSamples, seeding }) {
  if (allCount === 0) {
    return (
      <div className="empty">
        <p className="empty-title">Tu archivo está en blanco.</p>
        <p>Empezá guardando esa prenda que no te podés sacar de la cabeza.</p>
        <div className="empty-actions">
          <button type="button" className="btn btn-dark" onClick={onAdd}>+ Add your first item</button>
          <button type="button" className="btn btn-outline" onClick={onLoadSamples} disabled={seeding}>
            {seeding ? <span className="spinner" aria-hidden="true" /> : null}
            {seeding ? 'Cargando…' : 'Cargar prendas de ejemplo'}
          </button>
        </div>
      </div>
    );
  }
  if (filtered) {
    return (
      <div className="empty">
        <p className="empty-title">Nada por aquí.</p>
        <p>Ninguna pieza coincide con estos filtros.</p>
        <button type="button" className="btn btn-outline" onClick={onReset}>Limpiar filtros</button>
      </div>
    );
  }
  return (
    <div className="empty">
      <p className="empty-title">{tab === 'purchased' ? 'Todavía no hay compras.' : '¡Lista cumplida!'}</p>
      <p>
        {tab === 'purchased'
          ? 'Cuando marques una prenda como comprada, va a aparecer en esta sección.'
          : 'No tenés deseos pendientes. Es momento de buscar inspiración nueva.'}
      </p>
    </div>
  );
}
