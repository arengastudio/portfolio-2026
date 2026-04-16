/**
 * SmoothScroll.tsx
 * Lenis smooth scroll + GSAP ticker integration.
 * Renders nothing — pure side-effect island (client:load).
 *
 * Skips entirely if prefers-reduced-motion is set so users who opt out
 * of motion get native browser scroll at full fidelity.
 * Exposes lenis instance as window.__lenis so other components can
 * call lenis.scrollTo() for programmatic scrolling.
 */
import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let destroyed = false;
    let lenisRef: { raf: (t: number) => void; destroy: () => void } | null = null;
    let tickFn: ((time: number) => void) | null = null;

    void (async () => {
      const [{ default: Lenis }, { gsap }] = await Promise.all([
        import('@studio-freight/lenis'),
        import('gsap'),
      ]);

      if (destroyed) return;

      const lenis = new Lenis();
      lenisRef = lenis;
      (window as unknown as Record<string, unknown>).__lenis = lenis;

      tickFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickFn);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      destroyed = true;
      if (lenisRef) {
        lenisRef.destroy();
        delete (window as unknown as Record<string, unknown>).__lenis;
      }
    };
  }, []);

  return null;
}
