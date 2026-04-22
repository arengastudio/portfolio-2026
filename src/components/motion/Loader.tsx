/**
 * Loader.tsx
 * Splash screen — home page, first visit per session only.
 *
 * Design:
 * Full dark overlay. "JUAN CRUZ LUNA." in display type slides up from below
 * a clip container (left-aligned, brutalist). Small mono counter at
 * bottom-right counts 000 → 100 while an accent line fills along the bottom
 * edge as a progress indicator.
 *
 * On complete:
 *   1. Content fades out (0.25s)
 *   2. Entire overlay lifts as a single panel — yPercent 0 → -100 (0.75s)
 *      This is more cinematic than a center-split and matches the upward
 *      direction of the ViewTransitions clip-in keyframe.
 *
 * Session behaviour: sessionStorage flag 'jcl-loaded' prevents replay.
 * prefers-reduced-motion: instant skip.
 * Failsafe: 8s timeout in case GSAP fails to load.
 *
 * Timing (~3.5s total):
 *   0.00s — name slides up into view (0.65s)
 *   0.40s — counter + bar begin (1.9s)
 *   2.30s — counter reaches 100 → 0.35s hold
 *   2.65s — content fades (0.25s)
 *   2.75s — overlay lifts (0.75s)
 *   3.50s — loader removed from DOM
 */
import { useEffect, useRef, useState } from 'react';
import styles from './Loader.module.css';

export default function Loader() {
  const [visible, setVisible] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef    = useRef<HTMLSpanElement>(null);
  const numRef     = useRef<HTMLSpanElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Session check ──────────────────────────────────────────
    if (sessionStorage.getItem('jcl-loaded')) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem('jcl-loaded', '1');

    // ── Reduced motion ─────────────────────────────────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = 'hidden';
    let destroyed = false;

    const finish = () => {
      if (failsafe) clearTimeout(failsafe);
      document.body.style.overflow = '';
      setVisible(false);
    };

    // Failsafe: never permanently block the page
    let failsafe: ReturnType<typeof setTimeout> | null = setTimeout(finish, 8000);

    void (async () => {
      const { gsap } = await import('gsap');
      if (destroyed) return;

      const overlay = overlayRef.current;
      const content = contentRef.current;
      const name    = nameRef.current;
      const num     = numRef.current;
      const bar     = barRef.current;
      if (!overlay || !content || !name || !num || !bar) return;

      // ── Phase 1: name slides up ────────────────────────────────
      // gsap.set establishes the starting position synchronously before
      // any animation tick — opacity:1 so it's visible once in position.
      gsap.set(name, { y: '115%', opacity: 1 });
      gsap.to(name, {
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
      });

      // ── Phase 2: counter + bar (starts 0.4s in) ───────────────
      const counter = { val: 0 };

      gsap.to(counter, {
        val: 100,
        duration: 2.8,
        delay: 0.5,
        ease: 'power2.inOut',
        onUpdate() {
          const v = Math.round(counter.val);
          num.textContent = String(v).padStart(3, '0');
          bar.style.transform = `scaleX(${v / 100})`;
        },
        onComplete() {
          if (destroyed) return;

          // ── Phase 3: hold → fade content ──────────────────────
          gsap.delayedCall(0.6, () => {
            if (destroyed) return;

            gsap.to(content, {
              opacity: 0,
              duration: 0.25,
              ease: 'power2.in',
            });

            // ── Phase 4: overlay lifts as single panel ──────────
            gsap.delayedCall(0.1, () => {
              if (destroyed) return;

              gsap.to(overlay, {
                yPercent: -100,
                duration: 0.75,
                ease: 'power3.inOut',
                onComplete: finish,
              });
            });
          });
        },
      });
    })();

    return () => {
      destroyed = true;
      document.body.style.overflow = '';
      if (failsafe) clearTimeout(failsafe);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      aria-hidden="true"
      role="presentation"
    >
      {/* All animated content — fades as a unit before the lift */}
      <div ref={contentRef} className={styles.content}>

        {/* Name — hero element, clips via parent overflow:hidden */}
        <div className={styles.nameWrap}>
          <span ref={nameRef} className={styles.name}>
            JUAN CRUZ LUNA.
          </span>
        </div>

        {/* Bottom strip — label left, counter right */}
        <div className={styles.meta}>
          <span className={styles.label}>PORTFOLIO — 2026</span>
          <span ref={numRef} className={styles.counter}></span>
        </div>

        {/* Accent progress line at the very bottom edge */}
        <div className={styles.progressTrack}>
          <div ref={barRef} className={styles.progressBar} />
        </div>

      </div>
    </div>
  );
}
