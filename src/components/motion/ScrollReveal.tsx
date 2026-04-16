/**
 * ScrollReveal.tsx
 * Scroll-driven entrance animation wrapper (client:load).
 *
 * Renders display:contents so the wrapper has zero layout impact —
 * children participate directly in the parent's formatting context
 * (grid, flex, block). No CLS: transforms/opacity don't affect layout.
 *
 * The wrapper's children become the GSAP targets. For stagger > 0,
 * each child animates with the stagger offset. For stagger = 0,
 * all children animate simultaneously.
 *
 * Trigger: the first child's entry into the viewport (display:contents
 * has no box, so the container itself can't be measured by ScrollTrigger).
 *
 * Respects prefers-reduced-motion: skips animation entirely, children
 * render at their final visible state.
 */
import { useRef, useEffect, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'fade-up' | 'fade' | 'slide-left' | 'clip' | 'clip-up';
  /** Initial delay before animation starts (seconds). */
  delay?: number;
  /** Animation duration (seconds). */
  duration?: number;
  /** 0–1: fraction of element visible before trigger fires (default 0.15). */
  threshold?: number;
  /** If > 0, staggers each child by this many seconds. */
  stagger?: number;
  /** Animate only once, don't reverse on scroll back. */
  once?: boolean;
}

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.8,
  threshold = 0.15,
  stagger = 0,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const el = ref.current;
    if (!el || el.children.length === 0) return;

    let ctx: { revert: () => void } | null = null;

    void (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!ref.current) return; // unmounted during async import

      const targets = Array.from(el.children) as HTMLElement[];
      const trigger = targets[0]; // first child as trigger (display:contents has no box)

      const fromVars: gsap.TweenVars = {};
      const toVars: gsap.TweenVars = {
        duration,
        delay,
        ease: 'power3.out',
        stagger: stagger > 0 ? stagger : undefined,
        scrollTrigger: {
          trigger,
          start: `top ${Math.round((1 - threshold) * 100)}%`,
          once,
        },
      };

      if (variant === 'fade-up') {
        fromVars.opacity = 0;
        fromVars.y = 40;
        toVars.opacity = 1;
        toVars.y = 0;
      } else if (variant === 'fade') {
        fromVars.opacity = 0;
        toVars.opacity = 1;
      } else if (variant === 'slide-left') {
        fromVars.opacity = 0;
        fromVars.x = -60;
        toVars.opacity = 1;
        toVars.x = 0;
      } else if (variant === 'clip') {
        fromVars.clipPath = 'inset(0 0 100% 0)';
        toVars.clipPath = 'inset(0 0 0% 0)';
      } else if (variant === 'clip-up') {
        // Reveals bottom-to-top: text appears to slide up from behind a clip.
        // inset(100% 0 0 0) = entire element clipped from top (nothing visible).
        // As T reduces to 0%, the element reveals from bottom edge upward.
        fromVars.clipPath = 'inset(100% 0 0 0)';
        toVars.clipPath = 'inset(0% 0 0% 0)';
        toVars.ease = 'power4.out';   // sharper snap for the editorial feel
      }

      ctx = gsap.context(() => {
        gsap.fromTo(targets, fromVars, toVars);
      }, el);
    })();

    return () => {
      ctx?.revert();
    };
  }, [variant, delay, duration, threshold, stagger, once]);

  // data-scroll-reveal triggers the CSS initial-hidden-state rules in global.css.
  // display:contents — no layout box, children slot directly into parent context.
  return (
    <div ref={ref} style={{ display: 'contents' }} data-scroll-reveal={variant}>
      {children}
    </div>
  );
}
