/**
 * MagneticEffect.tsx
 * Global magnetic hover — queries all [data-magnetic] elements and applies
 * GSAP-driven translation toward the cursor on hover.
 *
 * Effect:
 *   mousemove inside element → translate 35% of offset from center (power2.out)
 *   mouseleave               → elastic spring back to origin
 *
 * View Transitions: re-queries [data-magnetic] on astro:page-load so newly
 * rendered elements after navigation get the effect attached.
 *
 * Guards: pointer: coarse (touch) and prefers-reduced-motion skip entirely.
 * Renders nothing — pure side-effect island (client:load in BaseLayout).
 */
import { useEffect } from 'react';

export default function MagneticEffect() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapRef: any = null;
    let destroyed = false;
    const cleanups: Array<() => void> = [];

    const attachOne = (el: HTMLElement) => {
      const gsap = gsapRef;
      if (!gsap) return;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        gsap.to(el, {
          x: (e.clientX - cx) * 0.35,
          y: (e.clientY - cy) * 0.35,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);

      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
        // Reset transform on cleanup so no residual offset remains
        gsap.set(el, { x: 0, y: 0, clearProps: 'transform' });
      };
    };

    // Called once on mount and again after each View Transition
    const init = () => {
      cleanups.forEach(fn => fn());
      cleanups.length = 0;
      if (!gsapRef) return;
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el => {
        const cleanup = attachOne(el);
        if (cleanup) cleanups.push(cleanup);
      });
    };

    void (async () => {
      const { gsap } = await import('gsap');
      if (destroyed) return;
      gsapRef = gsap;
      init();
      document.addEventListener('astro:page-load', init);
    })();

    return () => {
      destroyed = true;
      cleanups.forEach(fn => fn());
      document.removeEventListener('astro:page-load', init);
    };
  }, []);

  return null;
}
