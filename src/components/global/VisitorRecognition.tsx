/**
 * VisitorRecognition.tsx
 * Sistema Global 02 — Reconocimiento del visitante (localStorage, sin backend).
 *
 * Estado A: primera visita — bienvenida + timestamp
 * Estado B: visita siguiente (otro día) — cambios desde last visit (filtrado de changelog.ts)
 * Estado C: misma visita (mismo día) — saludo corto
 *
 * Aparece solo en homepage. Fade-out: 6s o primer scroll. En mobile aparece
 * brevemente y desaparece más rápido (4s).
 *
 * Delay inicial: 1.5s tras carga, para no competir con la animación de entrada
 * del hero.
 */
import { useEffect, useState } from 'react';
import { changelog } from '../../config/changelog';
import styles from './VisitorRecognition.module.css';

const STORAGE_KEY = 'jcl-visitor';

type State =
  | { kind: 'first'; timestamp: string }
  | { kind: 'returning'; lastVisitLabel: string; deltas: string[] }
  | { kind: 'same-day' };

interface Stored {
  firstVisit: number;
  lastVisit: number;
}

function formatTimestamp(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function VisitorRecognition() {
  const [state, setState] = useState<State | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const now = new Date();
    const nowTs = now.getTime();

    let stored: Stored | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as Stored;
    } catch {
      stored = null;
    }

    let computed: State;

    if (!stored) {
      computed = { kind: 'first', timestamp: formatTimestamp(now) };
    } else {
      const lastVisit = new Date(stored.lastVisit);
      if (isSameDay(lastVisit, now)) {
        computed = { kind: 'same-day' };
      } else {
        const deltas = changelog
          .filter((c) => new Date(c.date).getTime() > stored!.lastVisit)
          .slice(0, 4)
          .map((c) => c.text);
        computed = {
          kind: 'returning',
          lastVisitLabel: formatTimestamp(lastVisit),
          deltas,
        };
      }
    }

    /* Persistir nueva visita */
    try {
      const next: Stored = {
        firstVisit: stored?.firstVisit ?? nowTs,
        lastVisit: nowTs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage bloqueado — silenciar */
    }

    setState(computed);

    /* Aparición demorada para no chocar con el hero */
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const showDelay = 1500;
    const hideDelay = isMobile ? 4000 : 6000;

    const showTimer = window.setTimeout(() => setVisible(true), showDelay);
    const hideTimer = window.setTimeout(() => setVisible(false), showDelay + hideDelay);

    /* Cualquier scroll cierra antes */
    const onScroll = () => {
      if (window.scrollY > 80) setVisible(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!state) return null;

  return (
    <div className={styles.recognition} data-visible={visible} role="status">
      {state.kind === 'first' && (
        <>
          <span className={styles.line}>Primera vez por acá.</span>
          <span className={styles.line}>Bienvenido al archivo.</span>
          <span className={styles.meta}>{state.timestamp}</span>
        </>
      )}

      {state.kind === 'returning' && (
        <>
          <span className={styles.line}>Bienvenido de nuevo.</span>
          <span className={styles.meta}>Última visita: {state.lastVisitLabel}</span>
          {state.deltas.length > 0 && (
            <div className={styles.delta}>
              {state.deltas.map((d) => (
                <span key={d} className={styles.deltaItem}>→ {d}</span>
              ))}
            </div>
          )}
        </>
      )}

      {state.kind === 'same-day' && (
        <span className={styles.line}>De vuelta por acá.</span>
      )}
    </div>
  );
}
