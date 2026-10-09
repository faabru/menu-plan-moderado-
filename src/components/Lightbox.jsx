import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const MIN_SCALE = 1;
const MAX_SCALE = 4;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function Lightbox({ dish, onClose }) {
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const [smooth, setSmooth] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const moved = useRef(false);

  const centerOf = useCallback(() => {
    const el = imgRef.current;
    if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, []);

  const apply = useCallback((next) => {
    setView((v) => {
      const raw = typeof next === 'function' ? next(v) : next;
      const s = clamp(raw.s, MIN_SCALE, MAX_SCALE);
      if (s === MIN_SCALE) return { s, x: 0, y: 0 };
      const baseW = imgRef.current?.offsetWidth ?? 0;
      const baseH = imgRef.current?.offsetHeight ?? 0;
      const maxX = Math.max(0, (baseW * s - window.innerWidth) / 2);
      const maxY = Math.max(0, (baseH * s - window.innerHeight) / 2);
      return {
        s,
        x: clamp(raw.x, -maxX, maxX),
        y: clamp(raw.y, -maxY, maxY),
      };
    });
  }, []);

  const zoomAt = useCallback(
    (nextScale, clientX, clientY) => {
      apply((v) => {
        const s = clamp(nextScale, MIN_SCALE, MAX_SCALE);
        if (s === v.s) return v;
        const c = centerOf();
        const vx = clientX - c.x;
        const vy = clientY - c.y;
        const qx = (vx - v.x) / v.s;
        const qy = (vy - v.y) / v.s;
        return { s, x: vx - qx * s, y: vy - qy * s };
      });
    },
    [apply, centerOf]
  );

  const zoomBy = useCallback(
    (delta) => {
      setSmooth(true);
      apply((v) => {
        const s = clamp(v.s + delta, MIN_SCALE, MAX_SCALE);
        if (s === v.s) return v;
        const qx = (0 - v.x) / v.s;
        const qy = (0 - v.y) / v.s;
        return { s, x: -qx * s, y: -qy * s };
      });
    },
    [apply]
  );

  const reset = useCallback(() => {
    setSmooth(true);
    setView({ s: 1, x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      setSmooth(false);
      const factor = Math.exp(-e.deltaY * 0.0015);
      apply((v) => {
        const s = clamp(v.s * factor, MIN_SCALE, MAX_SCALE);
        if (s === v.s) return v;
        const c = centerOf();
        const vx = e.clientX - c.x;
        const vy = e.clientY - c.y;
        const qx = (vx - v.x) / v.s;
        const qy = (vy - v.y) / v.s;
        return { s, x: vx - qx * s, y: vy - qy * s };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [apply, centerOf]);

  useEffect(() => {
    const onKey = (e) => {
      const step = 50;
      if (e.key === 'Escape') onClose();
      else if (e.key === '0') reset();
      else if (e.key === '+' || e.key === '=') zoomBy(0.5);
      else if (e.key === '-' || e.key === '_') zoomBy(-0.5);
      else if (e.key === 'ArrowLeft') apply((v) => ({ s: v.s, x: v.x + step, y: v.y }));
      else if (e.key === 'ArrowRight') apply((v) => ({ s: v.s, x: v.x - step, y: v.y }));
      else if (e.key === 'ArrowUp') apply((v) => ({ s: v.s, x: v.x, y: v.y + step }));
      else if (e.key === 'ArrowDown') apply((v) => ({ s: v.s, x: v.x, y: v.y - step }));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [apply, onClose, reset, zoomBy]);

  const onPointerDown = (e) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    moved.current = false;
    setSmooth(false);

    if (pointers.current.size === 1) {
      gesture.current = { type: 'pan', startX: e.clientX, startY: e.clientY, view };
      setGrabbing(true);
    } else if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      gesture.current = {
        type: 'pinch',
        startDist: dist,
        startView: view,
        mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
      };
      setGrabbing(true);
    }
  };

  const onPointerMove = (e) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX;
    p.y = e.clientY;
    const g = gesture.current;
    if (!g) return;

    if (g.type === 'pan' && pointers.current.size === 1) {
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
      apply({ s: g.view.s, x: g.view.x + dx, y: g.view.y + dy });
    } else if (g.type === 'pinch' && pointers.current.size >= 2) {
      moved.current = true;
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      const scale = clamp(g.startView.s * (dist / g.startDist), MIN_SCALE, MAX_SCALE);
      const c = centerOf();
      const qx = (g.mid.x - c.x - g.startView.x) / g.startView.s;
      const qy = (g.mid.y - c.y - g.startView.y) / g.startView.s;
      apply({ s: scale, x: mid.x - c.x - qx * scale, y: mid.y - c.y - qy * scale });
    }
  };

  const endPointer = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 1) {
      const [pt] = pointers.current.values();
      gesture.current = { type: 'pan', startX: pt.x, startY: pt.y, view };
    } else if (pointers.current.size === 0) {
      gesture.current = null;
      setGrabbing(false);
    }
  };

  const onDoubleClick = (e) => {
    e.stopPropagation();
    setSmooth(true);
    if (view.s > 1.01) reset();
    else zoomAt(2.4, e.clientX, e.clientY);
  };

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget && !moved.current) onClose();
  };

  return createPortal(
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${dish.name} — imagen completa`}
      onClick={onBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Cerrar imagen"
      >
        ✕
      </button>

      <figure className="lightbox-figure">
        <div
          ref={stageRef}
          className={`lb-stage${grabbing ? ' is-grabbing' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onDoubleClick={onDoubleClick}
        >
          <img
            ref={imgRef}
            src={dish.image}
            alt={dish.name}
            draggable="false"
            style={{
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
              transition: smooth ? 'transform 0.3s cubic-bezier(.2,.7,.3,1)' : 'none',
            }}
          />
        </div>

        <figcaption>
          <span className="lb-caption-name">{dish.name}</span>
          <span className="lb-hint">
            Arrastrá para acomodar · pellizcá o usá la rueda para acercar
          </span>
        </figcaption>
      </figure>

      <div className="lb-controls" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => zoomBy(-0.5)}
          disabled={view.s <= MIN_SCALE}
          aria-label="Alejar"
        >
          −
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={view.s === 1 && view.x === 0 && view.y === 0}
          aria-label="Restablecer vista"
        >
          ⟲
        </button>
        <button
          type="button"
          onClick={() => zoomBy(0.5)}
          disabled={view.s >= MAX_SCALE}
          aria-label="Acercar"
        >
          +
        </button>
      </div>
    </motion.div>,
    document.body
  );
}
