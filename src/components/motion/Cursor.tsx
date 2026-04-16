/**
 * Cursor.tsx
 * Custom 3-layer cursor — dot (8px, fast) + ring (36px, lagging) + label (84px, follow).
 * Only activates on fine-pointer devices (desktop mouse).
 *
 * Layers:
 *   dot   — near-instant follow (0.08s). Replaces system cursor.
 *   ring  — lagging follow (0.4s). Expands on interactive element hover.
 *   label — "VER →" circle that appears on [data-follow-cursor] elements (case cards).
 *           When label is active: ring hides. When label leaves: ring restores.
 *
 * [data-follow-cursor] elements: CaseEntry articles.
 * Interactive elements (ring expand): a, button, [role="button"].
 *   Ring does NOT expand when label mode is active (isFollowMode guard).
 *
 * Cursor.module.css hides system cursor via @media (pointer: fine).
 * Renders null on touch devices — the matchMedia guard returns early.
 */
import { useEffect, useRef } from 'react';
import styles from './Cursor.module.css';

export default function Cursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let destroyed = false;
    let cleanup: (() => void) | null = null;

    // Ref (not state) — avoids re-render, readable inside GSAP callbacks
    const isFollowMode = { current: false };

    void (async () => {
      const { gsap } = await import('gsap');
      if (destroyed) return;

      // Centre all layers — GSAP manages x/y from here
      gsap.set([dot, ring, label], { xPercent: -50, yPercent: -50 });
      // Label starts hidden and slightly scaled down
      gsap.set(label, { autoAlpha: 0, scale: 0.8 });

      // ── Position setters ──────────────────────────────────────
      const setDotX   = gsap.quickTo(dot,   'x', { duration: 0.08, ease: 'none' });
      const setDotY   = gsap.quickTo(dot,   'y', { duration: 0.08, ease: 'none' });
      const setRingX  = gsap.quickTo(ring,  'x', { duration: 0.4,  ease: 'power2.out' });
      const setRingY  = gsap.quickTo(ring,  'y', { duration: 0.4,  ease: 'power2.out' });
      const setLabelX = gsap.quickTo(label, 'x', { duration: 0.08, ease: 'none' });
      const setLabelY = gsap.quickTo(label, 'y', { duration: 0.08, ease: 'none' });

      const onMove = (e: MouseEvent) => {
        setDotX(e.clientX);    setDotY(e.clientY);
        setRingX(e.clientX);   setRingY(e.clientY);
        setLabelX(e.clientX);  setLabelY(e.clientY);
      };

      // ── Ring expand (interactive elements) ────────────────────
      const onEnter = () => {
        // Suppress ring expand when label mode is active
        if (!isFollowMode.current) ring.setAttribute('data-expanded', 'true');
      };
      const onLeave = () => ring.removeAttribute('data-expanded');

      // ── Label mode (case cards) ────────────────────────────────
      const onEnterFollow = () => {
        isFollowMode.current = true;
        ring.removeAttribute('data-expanded');
        gsap.to(ring,  { autoAlpha: 0, scale: 0.5, duration: 0.2, ease: 'power2.in' });
        gsap.to(label, { autoAlpha: 1, scale: 1,   duration: 0.35, ease: 'back.out(1.5)' });
      };
      const onLeaveFollow = () => {
        isFollowMode.current = false;
        gsap.to(ring,  { autoAlpha: 0.45, scale: 1,   duration: 0.3 });
        gsap.to(label, { autoAlpha: 0,    scale: 0.8, duration: 0.2, ease: 'power2.in' });
      };

      // ── Attach listeners ───────────────────────────────────────
      const interactives  = document.querySelectorAll<Element>('a, button, [role="button"]');
      const followTargets = document.querySelectorAll<Element>('[data-follow-cursor]');

      interactives.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
      followTargets.forEach(el => {
        el.addEventListener('mouseenter', onEnterFollow);
        el.addEventListener('mouseleave', onLeaveFollow);
      });

      window.addEventListener('mousemove', onMove);

      cleanup = () => {
        window.removeEventListener('mousemove', onMove);
        interactives.forEach(el => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
        followTargets.forEach(el => {
          el.removeEventListener('mouseenter', onEnterFollow);
          el.removeEventListener('mouseleave', onLeaveFollow);
        });
      };
    })();

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}   className={styles.dot}   aria-hidden="true" />
      <div ref={ringRef}  className={styles.ring}  aria-hidden="true" />
      <div ref={labelRef} className={styles.label} aria-hidden="true">
        <span className={styles.labelText}>VER →</span>
      </div>
    </>
  );
}
