export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-mark" aria-hidden="true">{t.type === 'error' ? '!' : '✓'}</span>
          <p>{t.message}</p>
          <button type="button" onClick={() => onDismiss(t.id)} aria-label="Cerrar aviso">×</button>
        </div>
      ))}
    </div>
  );
}
