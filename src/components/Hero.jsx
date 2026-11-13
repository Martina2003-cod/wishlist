import SmartImage from './SmartImage.jsx';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80';

/** 02 — Hero editorial: título protagonista, bajada e imagen de moda. */
export default function Hero({ onAdd, total }) {
  return (
    <section className="hero container" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-num">02</span> Editor’s Letter
        </p>
        <h1 id="hero-title" className="hero-title">
          The art of <em>wanting</em> well.
        </h1>
        <p className="hero-lede">
          Tu archivo personal de deseos. Guardá las prendas que te enamoran, ordenalas por
          prioridad y planificá cada compra con intención — todo en un solo lugar.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn btn-red" onClick={onAdd}>
            + Add item
          </button>
          <a className="link-arrow" href="#collection">
            Ver mi colección <span aria-hidden="true">→</span>
          </a>
        </div>
        <dl className="hero-meta">
          <div>
            <dt>Piezas en archivo</dt>
            <dd>{String(total).padStart(2, '0')}</dd>
          </div>
          <div>
            <dt>Temporada</dt>
            <dd>FW / 26</dd>
          </div>
        </dl>
      </div>

      <figure className="hero-figure">
        <div className="hero-image-wrap">
          <SmartImage src={HERO_IMAGE} alt="Perchero con prendas en tonos neutros" label="The Edit" eager />
          <span className="hero-stamp" aria-hidden="true">
            Save it.<br />Style it.<br /><em>Make it yours.</em>
          </span>
        </div>
        <figcaption>
          <span>Fig. 01</span> Soft neutrals, sharp intentions.
        </figcaption>
      </figure>
    </section>
  );
}
