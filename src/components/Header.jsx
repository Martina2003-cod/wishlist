import { issueDate } from '../lib/format.js';

/** 01 — Header / Navegación: Logo · My Wishlist · Purchased · Add Item */
export default function Header({ activeTab, onNavigate, onAdd }) {
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span>N° 01 — The Wishlist Issue</span>
          <span className="topbar-mid">{issueDate()}</span>
          <span className="topbar-right">Save it. Style it. Make it yours.</span>
        </div>
      </div>

      <div className="container nav">
        <a href="#top" className="logo" aria-label="WISHLIST, volver al inicio">
          WISHLIST
        </a>

        <nav className="nav-links" aria-label="Principal">
          <button
            type="button"
            className={`nav-link ${activeTab !== 'purchased' ? 'is-active' : ''}`}
            onClick={() => onNavigate('pending')}
          >
            My Wishlist
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'purchased' ? 'is-active' : ''}`}
            onClick={() => onNavigate('purchased')}
          >
            Purchased
          </button>
        </nav>

        <button type="button" className="btn btn-dark btn-sm" onClick={onAdd}>
          <span aria-hidden="true">+</span> Add Item
        </button>
      </div>
    </header>
  );
}
