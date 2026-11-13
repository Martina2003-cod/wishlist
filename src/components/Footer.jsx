/** 05 — Footer: identidad de marca y créditos. */
export default function Footer({ mode }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <p className="eyebrow eyebrow-light">
            <span className="eyebrow-num">05</span> Colophon
          </p>
          <p className="footer-tagline">
            Save it. Style it. <em>Make it yours.</em>
          </p>
        </div>

        <p className="footer-wordmark" aria-hidden="true">WISHLIST</p>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} WISHLIST — Fashion Wishlist</p>
          <p>Desarrollo Frontend II · TP2 · React + Vite + Firebase</p>
          <p className="footer-mode">
            <span className={`status-dot ${mode === 'firebase' ? 'on' : ''}`} aria-hidden="true" />
            {mode === 'firebase' ? 'Sincronizado con Firebase' : 'Modo demo · datos guardados en este navegador'}
          </p>
        </div>
      </div>
    </footer>
  );
}
