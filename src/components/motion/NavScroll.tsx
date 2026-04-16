/**
 * NavScroll.tsx
 * Scroll-aware nav visibility (client:load).
 *
 * Home page (isHome=true):
 *   Hides the nav when the hero has scrolled out of view.
 *   Threshold: height of [data-hero] element, or 85vh as fallback.
 *   Shows nav again if user scrolls back to the top.
 *
 * Inner pages (isHome=false):
 *   Hides on scroll-down, shows on scroll-up.
 *   Only hides after scrollY > 80px (prevents false trigger on page load).
 *
 * Mechanism: toggles [data-nav-hidden] attribute on the [data-nav] header.
 * CSS transition on transform: translateY(-100%) handles the animation.
 *
 * Uses native scroll events (not Lenis) since Lenis may not be initialised
 * yet when this effect runs, and nav visibility is critical enough to not
 * depend on the motion layer.
 *
 * Respects prefers-reduced-motion: skips transition (CSS handles it via
 * the global reduced-motion block that collapses transition-duration).
 */
import { useEffect } from 'react';

interface Props {
  isHome: boolean;
}

export default function NavScroll({ isHome }: Props) {
  useEffect(() => {
    const nav = document.querySelector('[data-nav]') as HTMLElement | null;
    if (!nav) return;

    const hide = () => nav.setAttribute('data-nav-hidden', '');
    const show = () => nav.removeAttribute('data-nav-hidden');

    if (isHome) {
      /*
       * Home: hide after hero scrolls out.
       * Hero height from [data-hero] element; fallback 85% of viewport.
       */
      const hero = document.querySelector('[data-hero]') as HTMLElement | null;

      const getThreshold = () =>
        hero ? hero.offsetHeight : Math.round(window.innerHeight * 0.85);

      const onScroll = () => {
        if (window.scrollY > getThreshold()) {
          hide();
        } else {
          show();
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);

    } else {
      /*
       * Inner pages: scroll-direction detection.
       * Hide on down, show on up. Deadzone of 80px prevents trigger at top.
       */
      let lastY = window.scrollY;

      const onScroll = () => {
        const y = window.scrollY;
        if (y > lastY && y > 80) {
          hide();
        } else {
          show();
        }
        lastY = y;
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [isHome]);

  return null;
}
