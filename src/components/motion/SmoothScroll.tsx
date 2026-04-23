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
    let lenisRef: { raf: (t: number) => void; destroy: () => void; on: (event: 'scroll', fn: () => void) => void } | null = null;
    let tickFn: ((time: number) => void) | null = null;

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (destroyed) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis();
      lenisRef = lenis;
      (window as unknown as Record<string, unknown>).__lenis = lenis;

      // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
      // Without this, pinned sections and scrub triggers use the native
      // scroll position (always 0 with Lenis) and never fire correctly.
      lenis.on('scroll', () => ScrollTrigger.update());

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
