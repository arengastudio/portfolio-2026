/**
 * ReadingProgress.tsx
 * Fixed 2px reading progress bar at the top of the viewport.
 * Scales on the X axis from 0 (top of page) to 1 (bottom of page).
 *
 * Positioned at top: 0, z-index 200 — sits atop the nav bar (z ~100)
 * as a thin accent stripe. Unobtrusive at 2px but visible on scroll.
 *
 * Scroll detection: native window scroll event (passive listener).
 * Works with Lenis because Lenis calls window.scrollTo() internally —
 * the native scroll event fires on each Lenis animation frame tick.
 *
 * GSAP quickTo (duration: 0.1s) smooths micro-jitter from scroll events.
 * prefers-reduced-motion: instant set via gsap.set() (no duration).
 *
 * Placed in /work/[slug].astro only — reading progress is for long-form
 * case studies, not for the home or index pages.
 */
import { useRef, useEffect } from 'react';
import styles from './ReadingProgress.module.css';

interface Props {
  lang?: 'es' | 'en';
}

export default function ReadingProgress({ lang = 'es' }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let destroyed = false;
    let cleanup: (() => void) | null = null;

    void (async () => {
      const { gsap } = await import('gsap');
      if (destroyed) return;

      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });

      const getProgress = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        return total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      };

      let updateProgress: () => void;

      if (prefersReduced) {
        updateProgress = () => gsap.set(bar, { scaleX: getProgress() });
      } else {
        const setScaleX = gsap.quickTo(bar, 'scaleX', { duration: 0.1, ease: 'none' });
        updateProgress = () => { setScaleX(getProgress()); };
      }

      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress(); // initialize on mount

      cleanup = () => window.removeEventListener('scroll', updateProgress);
    })();

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={barRef}
      className={styles.bar}
      role="progressbar"
      aria-label={lang === 'en' ? 'Reading progress' : 'Progreso de lectura'}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
