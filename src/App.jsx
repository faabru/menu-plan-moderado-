import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';
import MenuPage from './components/MenuPage';
import './styles/global.css';

export default function App() {
  const [view, setView] = useState('home');

  useEffect(() => {
    document.title =
      view === 'menu'
        ? 'Carta · Rosé - Jardín Urbano Gastronómico'
        : 'Rosé - Jardín Urbano Gastronómico';
  }, [view]);

  return (
    <div className="page">
      <div className="page-bg" />
      <div className="page-content">
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <Hero onVerMenu={() => setView('menu')} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <MenuPage onVolver={() => setView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
