import Modal from './Modal.jsx';

export default function ConfirmDialog({ open, title, message, confirmLabel, busy, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="confirm-title" size="sm">
      <div className="confirm">
        <p className="eyebrow">Confirmación</p>
        <h2 id="confirm-title" className="modal-title">{title}</h2>
        <p className="confirm-msg">{message}</p>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={busy}>
            Cancelar
          </button>
          <button type="button" className="btn btn-red" onClick={onConfirm} disabled={busy}>
            {busy ? <span className="spinner" aria-hidden="true" /> : null}
            {busy ? 'Eliminando…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
