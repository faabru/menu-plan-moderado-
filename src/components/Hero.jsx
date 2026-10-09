import { motion } from 'framer-motion';
import './Hero.css';

export default function Hero({ onVerMenu }) {
  return (
    <main className="hero">
      <div className="hero-veil" />

      <motion.div
        className="hero-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="hero-card-info">
          <motion.span
            className="hero-kicker"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Restaurante Boutique
          </motion.span>

          <motion.div
            className="hero-ornament"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <span className="ornament-line" />
            <span className="ornament-mark">✦</span>
            <span className="ornament-line" />
          </motion.div>

          <motion.p
            className="hero-tag"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Jardín Urbano Gastronómico
          </motion.p>

          <motion.p
            className="hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Gastronomía de autor rodeada de naturaleza y luz. Una experiencia
            para desconectar del ruido cotidiano.
          </motion.p>

          <motion.button
            className="hero-action"
            onClick={onVerMenu}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            Ver Menú
            <span className="hero-action-arrow">→</span>
          </motion.button>
        </div>

        <motion.div
          className="hero-card-logo"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          <img src="/imagenes/rose logo.png" alt="Rosé" />
        </motion.div>
      </motion.div>

      <span className="hero-est">Est. 2023</span>
    </main>
  );
}
