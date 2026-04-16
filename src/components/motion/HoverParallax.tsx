/**
 * HoverParallax.tsx
 * Subtle depth parallax on mouse move (client:visible).
 *
 * The wrapper receives pointer events. On mouse move, the first child
 * element (the case title h3) shifts in the OPPOSITE direction of the
 * cursor — maximum 8px in any direction — creating a layer separation.
 *
 * Uses requestAnimationFrame + lerp for GPU-composited smooth motion.
 * Skipped entirely on coarse-pointer (touch) devices and prefers-reduced-motion.
 *
 * Accepts `class` from Astro (Astro passes 'class', not 'className').
 */
import { useRef, useEffect, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /**
   * CSS class to apply to the wrapper div. Named 'wrapperClass' (not 'class'
   * or 'className') to avoid ambiguity when passed from Astro templates.
   * Pass as wrapperClass={styles.visual} from Astro.
   */
  wrapperClass?: string;
}

export default function HoverParallax({ wrapperClass, children }: Props) {
  const cls = wrapperClass;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices — parallax has no meaning without fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = wrapperRef.current;
    if (!el) return;

    // Target the title (first child element — always the h3 in CaseEntry)
    const titleEl = el.firstElementChild as HTMLElement | null;
    if (!titleEl) return;

    const shift = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let rafId = 0;
    let animating = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      shift.x = lerp(shift.x, target.x, 0.1);
      shift.y = lerp(shift.y, target.y, 0.1);
      titleEl.style.transform = `translate(${shift.x.toFixed(2)}px, ${shift.y.toFixed(2)}px)`;

      const settled =
        Math.abs(shift.x - target.x) < 0.05 &&
        Math.abs(shift.y - target.y) < 0.05;

      if (settled && target.x === 0 && target.y === 0) {
        titleEl.style.transform = '';
        animating = false;
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Normalized -1 to 1, opposite direction, capped at 8px
      target.x = -((e.clientX - cx) / (rect.width / 2)) * 8;
      target.y = -((e.clientY - cy) / (rect.height / 2)) * 8;

      if (!animating) {
        animating = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onMouseLeave = () => {
      target.x = 0;
      target.y = 0;
      // tick continues lerping back to 0
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      if (titleEl) titleEl.style.transform = '';
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cls}>
      {children}
    </div>
  );
}
