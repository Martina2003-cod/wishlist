import { formatPrice, pad } from '../lib/format.js';

/** 03 — Resumen personal: guardados · pendientes · comprados · total. */
export default function Summary({ stats, loading }) {
  const progress = stats.total ? Math.round((stats.purchased / stats.total) * 100) : 0;
  const cells = [
    { label: 'Guardados', value: pad(stats.total), note: 'piezas en tu archivo' },
    { label: 'Pendientes', value: pad(stats.pending), note: 'esperando su momento' },
    {
      label: 'Comprados',
      value: pad(stats.purchased),
      note: `${formatPrice(stats.purchasedValue)} invertidos · ${progress}% cumplido`,
    },
    { label: 'Total pendiente', value: formatPrice(stats.pendingValue), note: 'presupuesto por planificar', wide: true },
  ];

  return (
    <section className="summary container" aria-labelledby="summary-title">
      <header className="section-head">
        <p className="eyebrow">
          <span className="eyebrow-num">03</span> Your Edit
        </p>
        <h2 id="summary-title" className="section-title">
          Resumen <em>personal</em>
        </h2>
      </header>

      <dl className={`summary-grid ${loading ? 'is-loading' : ''}`}>
        {cells.map((c) => (
          <div key={c.label} className={`summary-cell ${c.wide ? 'is-money' : ''}`}>
            <dt>{c.label}</dt>
            <dd className="summary-value">{loading ? '—' : c.value}</dd>
            <dd className="summary-note">{c.note}</dd>
          </div>
        ))}
      </dl>

      <div className="progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
