import Modal from './Modal.jsx';
import SmartImage from './SmartImage.jsx';
import { formatDate, formatPrice, hostname, pad } from '../lib/format.js';
import { PRIORITIES, STATUS } from '../lib/constants.js';

/** Pantalla Item Detail: información completa + editar, eliminar y marcar como comprado. */
export default function ItemDetail({ item, number, busy, onClose, onEdit, onDelete, onToggleStatus }) {
  if (!item) return null;
  const purchased = item.status === 'purchased';
  const priority = PRIORITIES.find((p) => p.value === item.priority)?.label;

  return (
    <Modal open onClose={onClose} labelledBy="detail-title" size="xl">
      <div className="detail">
        <div className="detail-media">
          <SmartImage src={item.imageUrl} alt={item.name} label={item.category} eager />
          <span className="card-number">N° {pad(number)}</span>
        </div>

        <div className="detail-info">
          <p className="eyebrow">{item.category}</p>
          <p className="detail-brand">{item.brand}</p>
          <h2 id="detail-title" className="detail-name">{item.name}</h2>
          <p className="detail-price">{formatPrice(item.price)}</p>

          <dl className="detail-specs">
            <div>
              <dt>Estado</dt>
              <dd className={purchased ? 'is-purchased' : ''}>{STATUS[item.status]}</dd>
            </div>
            <div>
              <dt>Prioridad</dt>
              <dd><span className={`dot priority-${item.priority}`} aria-hidden="true" /> {priority}</dd>
            </div>
            <div>
              <dt>Guardado el</dt>
              <dd>{formatDate(item.createdAt)}</dd>
            </div>
            {purchased && item.purchasedAt && (
              <div>
                <dt>Comprado el</dt>
                <dd>{formatDate(item.purchasedAt)}</dd>
              </div>
            )}
          </dl>

          {item.link ? (
            <a className="btn btn-outline btn-block" href={item.link} target="_blank" rel="noopener noreferrer">
              Ir a la tienda · {hostname(item.link)} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <p className="field-hint">Sin enlace a la tienda.</p>
          )}

          <button
            type="button"
            className={`btn btn-block ${purchased ? 'btn-outline' : 'btn-red'}`}
            onClick={() => onToggleStatus(item)}
            disabled={busy}
          >
            {busy ? <span className="spinner" aria-hidden="true" /> : null}
            {purchased ? 'Volver a pendiente' : '✓ Marcar como comprado'}
          </button>

          <div className="detail-secondary">
            <button type="button" className="link-btn" onClick={() => onEdit(item)}>Editar</button>
            <span aria-hidden="true">·</span>
            <button type="button" className="link-btn danger" onClick={() => onDelete(item)}>Eliminar</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
