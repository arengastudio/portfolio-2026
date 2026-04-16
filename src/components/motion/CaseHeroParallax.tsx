/**
 * CaseHeroParallax.tsx
 * Parallax depth effect on the case study hero visual block.
 *
 * As the hero section scrolls out of view, [data-case-visual] moves at
 * 70% of the scroll speed (yPercent 0 → 15 over the hero's height).
 * The visual lags behind the page, creating a sense of depth in what would
 * otherwise be a static colored block.
 *
 * Works with Lenis because SmoothScroll registers ScrollTrigger.update()
 * on every Lenis tick (src/components/motion/SmoothScroll.tsx).
 *
 * prefers-reduced-motion: bails out immediately — no transform applied.
 * Renders null — pure side effect island.
 */
import { useEffect } from 'react';

export default function CaseHeroParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: { revert: () => void } | null = null;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const hero   = document.querySelector('[data-case-hero]');
      const visual = document.querySelector<HTMLElement>('[data-case-visual]');
      if (!hero || !visual) return;

      ctx = gsap.context(() => {
        gsap.to(visual, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    })();

    return () => {
      ctx?.revert();
    };
  }, []);

  return null;
}
