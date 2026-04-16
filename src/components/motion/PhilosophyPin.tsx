/**
 * PhilosophyPin.tsx
 * Scroll-pinned reveal for the Philosophy section.
 *
 * Desktop (≥768px, not reduced-motion):
 *   Pins the section [data-philosophy-section] at the viewport top
 *   (offset by nav height). Principles 2 and 3 start at opacity 0 and
 *   scrub into view as the user scrolls through ~200% extra viewport height.
 *   Principle 1 is always visible — it anchors the pinned view.
 *
 * Mobile (<768px) or reduced-motion:
 *   Simple per-principle fade-in on scroll enter. No pin.
 *
 * Requires Lenis + ScrollTrigger integration in SmoothScroll.tsx.
 * Requires data-philosophy-section on <section>, data-principle="N" on each <article>.
 *
 * Cleanup: gsap.context().revert() removes all ScrollTriggers and inline styles.
 */
import { useEffect } from 'react';

export default function PhilosophyPin() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile       = window.innerWidth < 768;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapCtx: any    = null;
    let destroyed        = false;

    void (async () => {
      const { gsap }        = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      if (destroyed) return;

      gsap.registerPlugin(ScrollTrigger);

      const section = document.querySelector('[data-philosophy-section]');
      const p1      = document.querySelector('[data-principle="1"]') as HTMLElement | null;
      const p2      = document.querySelector('[data-principle="2"]') as HTMLElement | null;
      const p3      = document.querySelector('[data-principle="3"]') as HTMLElement | null;

      if (!section || !p1 || !p2 || !p3) return;

      gsapCtx = gsap.context(() => {

        if (prefersReduced || isMobile) {
          // ── Mobile / reduced-motion: fade each principle in on enter ──
          [p1, p2, p3].forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              }
            );
          });
          return;
        }

        // ── Desktop: pin section, scrub principles 2 + 3 in ──
        // Principle 1 is visible immediately. 2 and 3 start hidden.
        gsap.set([p2, p3], { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top+=56',   // 56px = nav height
            end: '+=200%',          // 2 extra viewport-heights of scroll
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        tl.to(p2, { opacity: 1, duration: 1, ease: 'power2.out' }, 0.15)
          .to(p3, { opacity: 1, duration: 1, ease: 'power2.out' }, 0.85);
      });
    })();

    return () => {
      destroyed = true;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      gsapCtx?.revert();
    };
  }, []);

  return null;
}
