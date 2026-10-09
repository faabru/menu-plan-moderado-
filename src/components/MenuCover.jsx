import { motion } from 'framer-motion';
import './MenuCover.css';

export default function MenuCover() {
  return (
    <motion.div
      className="menu-head"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
    >
      <img
        src="/imagenes/rose logo.png"
        alt="Rosé"
        className="menu-head-logo"
      />
      <span className="menu-tag">Nuestra Carta</span>
      <h2 className="menu-title">Menú de la Casa</h2>
      <div className="menu-divider" aria-hidden="true">
        <span className="menu-divider-line" />
        <span className="menu-divider-mark">✦</span>
        <span className="menu-divider-line" />
      </div>
      <p className="menu-desc">
        Gastronomía de autor en un elegante jardín urbano. Cada plato es una
        invitación a desconectar del ruido cotidiano y conectar con experiencias
        memorables.
      </p>
    </motion.div>
  );
}
