/**
 * CountUp.tsx
 * Animates a number from 0 to `value` when the component hydrates
 * (client:visible — island mounts only when element enters the viewport).
 *
 * Renders bare inline spans — no layout box of its own.
 * The parent element in TLDR.astro supplies all typography styling.
 *
 * Accessibility: the outer span has aria-label with the final value so
 * screen readers announce the complete string immediately, not the animating
 * intermediate values.
 *
 * prefers-reduced-motion: skips animation, displays final value immediately.
 */
import { useEffect, useRef } from 'react';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Animation duration in seconds. Default 1.4s. */
  duration?: number;
}

export default function CountUp({ value, prefix = '', suffix = '', duration = 1.4 }: Props) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.textContent = String(value);
      return;
    }

    let destroyed = false;

    void (async () => {
      const { gsap } = await import('gsap');
      if (destroyed) return;

      const counter = { val: 0 };
      gsap.to(counter, {
        val: value,
        duration,
        ease: 'power2.out',
        roundProps: 'val',
        onUpdate() {
          if (el) el.textContent = String(Math.round(counter.val));
        },
      });
    })();

    return () => { destroyed = true; };
  }, [value, duration]);

  return (
    // aria-label = final value so screen readers skip the counting animation
    <span aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden="true">{prefix}</span>
      <span ref={numRef} aria-hidden="true">0</span>
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}
