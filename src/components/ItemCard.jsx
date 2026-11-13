import SmartImage from './SmartImage.jsx';
import { formatPrice, pad } from '../lib/format.js';
import { PRIORITIES } from '../lib/constants.js';

const priorityLabel = (v) => PRIORITIES.find((p) => p.value === v)?.label ?? v;

export default function ItemCard({ item, number, busy, onOpen, onEdit, onToggleStatus }) {
  const purchased = item.status === 'purchased';

  return (
    <article className={`card ${purchased ? 'is-purchased' : ''}`}>
      <div className="card-media">
        <button type="button" className="card-media-btn" onClick={onOpen} aria-label={`Ver detalle de ${item.name}`}>
          <SmartImage src={item.imageUrl} alt={item.name} label={item.category} />
        </button>
        <span className="card-number">N° {pad(number)}</span>
        {purchased && <span className="card-badge">Comprado</span>}

        <div className="card-actions">
          <button type="button" onClick={onOpen}>Ver</button>
          <button type="button" onClick={onEdit}>Editar</button>
          <button type="button" onClick={onToggleStatus} disabled={busy} className="is-accent">
            {busy ? '…' : purchased ? 'Pendiente' : '✓ Comprado'}
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="card-row">
          <p className="card-brand">{item.brand}</p>
          <p className={`priority priority-${item.priority}`}>
            <span className="dot" aria-hidden="true" /> {priorityLabel(item.priority)}
          </p>
        </div>
        <h3 className="card-name">
          <button type="button" onClick={onOpen}>{item.name}</button>
        </h3>
        <div className="card-row card-foot">
          <p className="card-category">{item.category}</p>
          <p className="card-price">{formatPrice(item.price)}</p>
        </div>
      </div>
    </article>
  );
}
