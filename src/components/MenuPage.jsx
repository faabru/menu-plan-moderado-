import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuCover from './MenuCover';
import DishGrid from './DishGrid';
import { menuData } from '../data/menuData';
import './MenuPage.css';

export default function MenuPage({ onVolver }) {
  const [active, setActive] = useState(menuData[0].category);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const sections = menuData
      .map((c) => document.getElementById(c.category))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));

    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="menu-page">
      <header className="menu-nav">
        <div className="menu-nav-inner">
          <button className="menu-nav-brand" onClick={onVolver}>
            <img src="/imagenes/rose logo.png" alt="" />
            <span>Rosé</span>
          </button>

          <nav className="menu-nav-links" aria-label="Categorías de la carta">
            {menuData.map((cat) => (
              <button
                key={cat.category}
                className={active === cat.category ? 'is-active' : ''}
                aria-current={active === cat.category ? 'true' : undefined}
                onClick={() => goTo(cat.category)}
              >
                {cat.category}
              </button>
            ))}
          </nav>

          <button className="menu-nav-back" onClick={onVolver}>
            <span className="back-arrow" aria-hidden="true">←</span> Volver al inicio
          </button>
        </div>
      </header>

      <main className="menu-page-inner">
        <div className="menu-card">
          <MenuCover />
          <DishGrid />
        </div>

        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-col footer-col-brand">
              <img className="footer-logo" src="/imagenes/rose logo.png" alt="Rosé" />
              <h3 className="footer-brandname">Rosé</h3>
              <p className="footer-tagline">Jardín Urbano Gastronómico</p>
              <p className="footer-blurb">
                Gastronomía de autor rodeada de naturaleza y luz, en el corazón
                de la ciudad.
              </p>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Contacto</h4>
              <ul className="footer-list">
                <li>
                  <span className="footer-label">Dirección</span>
                  Av. del Jardín 1234, Ciudad, Argentina
                </li>
                <li>
                  <span className="footer-label">Email</span>
                  <a href="mailto:reservas@rose.com.ar">reservas@rose.com.ar</a>
                </li>
                <li>
                  <span className="footer-label">Teléfono</span>
                  <a href="tel:+541112345678">+54 11 1234-5678</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Horarios</h4>
              <ul className="footer-list">
                <li>
                  <span className="footer-label">Martes a Domingo</span>
                  12:00 – 23:00
                </li>
                <li>
                  <span className="footer-label">Lunes</span>
                  <span className="footer-closed">Cerrado</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-ornament" aria-hidden="true">✦ ✦ ✦</span>
            <p className="footer-copy">© 2024 Rosé · Jardín Urbano Gastronómico</p>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {showTop && (
          <motion.button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            whileHover={{ y: -3 }}
            aria-label="Volver arriba"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
