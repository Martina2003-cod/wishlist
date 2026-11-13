import { useEffect, useState } from 'react';

/** Imagen con placeholder editorial si la URL falta o no carga. */
export default function SmartImage({ src, alt, label, eager = false }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="img-fallback" role="img" aria-label={alt}>
        <span>{label || 'WISHLIST'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      className={loaded ? 'is-loaded' : ''}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );
}
