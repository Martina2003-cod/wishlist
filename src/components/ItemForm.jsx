import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import SmartImage from './SmartImage.jsx';
import { CATEGORIES, EMPTY_ITEM, PRIORITIES } from '../lib/constants.js';
import { formatPrice, isValidUrl } from '../lib/format.js';

export function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Ingresá el nombre de la prenda.';
  else if (v.name.trim().length > 120) e.name = 'Máximo 120 caracteres.';
  if (!v.brand.trim()) e.brand = 'Ingresá la marca.';
  else if (v.brand.trim().length > 80) e.brand = 'Máximo 80 caracteres.';
  const price = Number(v.price);
  if (v.price === '' || Number.isNaN(price) || price <= 0) e.price = 'Ingresá un precio mayor a 0.';
  else if (price > 100_000_000) e.price = 'El precio parece demasiado alto.';
  if (!v.category) e.category = 'Elegí una categoría.';
  if (v.imageUrl.trim() && !isValidUrl(v.imageUrl.trim())) e.imageUrl = 'Pegá una URL válida (https://…).';
  if (v.link.trim() && !isValidUrl(v.link.trim())) e.link = 'Pegá un enlace válido (https://…).';
  return e;
}

/** Pantalla Add Item / Edit Item, presentada como panel modal. */
export default function ItemForm({ open, item, saving, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY_ITEM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const editing = Boolean(item);

  useEffect(() => {
    if (!open) return;
    setValues(
      item
        ? {
            name: item.name,
            brand: item.brand,
            price: String(item.price),
            category: item.category,
            imageUrl: item.imageUrl || '',
            link: item.link || '',
            priority: item.priority,
          }
        : EMPTY_ITEM
    );
    setErrors({});
    setTouched(false);
  }, [open, item]);

  const update = (key) => (e) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched(true);
    if (Object.keys(found).length) {
      document.getElementById(`f-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    onSubmit(values);
  }

  const previewUrl = isValidUrl(values.imageUrl.trim()) ? values.imageUrl.trim() : '';

  return (
    <Modal open={open} onClose={onClose} labelledBy="form-title" size="lg">
      <div className="form-layout">
        <aside className="form-preview">
          <div className="form-preview-media">
            <SmartImage src={previewUrl} alt="Vista previa" label={values.category || 'Preview'} />
          </div>
          <p className="card-brand">{values.brand || 'Marca'}</p>
          <p className="form-preview-name">{values.name || 'Nombre de la prenda'}</p>
          <p className="card-price">{values.price ? formatPrice(values.price) : '$ —'}</p>
        </aside>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <p className="eyebrow">{editing ? 'Edit item' : 'Add item'}</p>
          <h2 id="form-title" className="modal-title">
            {editing ? <>Editar <em>pieza</em></> : <>Nueva <em>pieza</em></>}
          </h2>

          <Field id="name" label="Nombre" error={errors.name}>
            <input id="f-name" value={values.name} onChange={update('name')} placeholder="Blazer Oversized" maxLength={120} autoComplete="off" />
          </Field>

          <div className="form-row">
            <Field id="brand" label="Marca" error={errors.brand}>
              <input id="f-brand" value={values.brand} onChange={update('brand')} placeholder="Zara" maxLength={80} autoComplete="off" />
            </Field>
            <Field id="price" label="Precio (ARS)" error={errors.price}>
              <input id="f-price" type="number" inputMode="numeric" min="1" step="1" value={values.price} onChange={update('price')} placeholder="129900" />
            </Field>
          </div>

          <Field id="category" label="Categoría" error={errors.category}>
            <select id="f-category" value={values.category} onChange={update('category')}>
              <option value="">Elegí una categoría</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field id="imageUrl" label="URL de la imagen" hint="Opcional · pegá el link de la foto del producto" error={errors.imageUrl}>
            <input id="f-imageUrl" type="url" value={values.imageUrl} onChange={update('imageUrl')} placeholder="https://…" />
          </Field>

          <Field id="link" label="Enlace a la tienda" hint="Opcional" error={errors.link}>
            <input id="f-link" type="url" value={values.link} onChange={update('link')} placeholder="https://…" />
          </Field>

          <fieldset className="field">
            <legend className="field-label">Prioridad</legend>
            <div className="segmented">
              {PRIORITIES.map((p) => (
                <label key={p.value} className={values.priority === p.value ? 'is-active' : ''}>
                  <input type="radio" name="priority" value={p.value} checked={values.priority === p.value} onChange={update('priority')} />
                  <span className={`dot priority-${p.value}`} aria-hidden="true" />
                  {p.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-dark" disabled={saving}>
              {saving ? <span className="spinner" aria-hidden="true" /> : null}
              {saving ? 'Guardando…' : editing ? 'Save changes' : 'Save to Wishlist'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function Field({ id, label, hint, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field-label" htmlFor={`f-${id}`}>{label}</label>
      {children}
      {error ? (
        <p className="field-error" role="alert">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}
