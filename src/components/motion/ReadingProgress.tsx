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
 * CSS transitions smooth micro-jitter from scroll events.
 * prefers-reduced-motion: instant transform updates.
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
    let rafId: number | null = null;

    if (prefersReduced) {
      bar.style.transition = 'none';
    }

    const getProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      return total > 0 ? Math.min(window.scrollY / total, 1) : 0;
    };

    const renderProgress = () => {
      rafId = null;
      bar.style.transform = `scaleX(${getProgress()})`;
    };

    const updateProgress = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(renderProgress);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    renderProgress();

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateProgress);
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
