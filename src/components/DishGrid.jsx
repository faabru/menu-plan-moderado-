import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData } from '../data/menuData';
import Lightbox from './Lightbox';
import './DishList.css';

function DishRow({ dish, index, onOpen }) {
  return (
    <motion.article
      className="dish-row"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
    >
      <button
        type="button"
        className="dish-row-photo"
        onClick={() => onOpen(dish)}
        aria-label={`Ver imagen completa de ${dish.name}`}
      >
        <img src={dish.image} alt={dish.name} loading="lazy" />
        <span className="dish-row-zoom" aria-hidden="true">⤢</span>
      </button>

      <div className="dish-row-body">
        <div className="dish-row-head">
          <h3>{dish.name}</h3>
          <span className="dish-leader" />
          {dish.price ? (
            <span className="dish-row-price">${dish.price}</span>
          ) : (
            <span className="dish-row-price is-note">Precio del día</span>
          )}
        </div>
        <p className="dish-row-ingredients">{dish.ingredients}</p>
      </div>
    </motion.article>
  );
}

export default function DishGrid() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return;

    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null);
    };
    document.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  return (
    <div className="menu-list">
      {menuData.map((cat, ci) => (
        <section key={cat.category} id={cat.category} className="menu-category">
          <motion.div
            className="cat-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <span className="cat-index">{String(ci + 1).padStart(2, '0')}</span>
            <h2>{cat.category}</h2>
            <span className="cat-rule" />
          </motion.div>

          <div className="dish-rows">
            {cat.items.map((dish, i) => (
              <DishRow key={dish.name} dish={dish} index={i} onOpen={setActive} />
            ))}
          </div>
        </section>
      ))}

      <AnimatePresence>
        {active && (
          <Lightbox key={active.name} dish={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
