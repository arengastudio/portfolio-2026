/**
 * HeroWords.tsx
 * Char-by-char entrance animation for the hero display statement.
 * Single React island — handles all three words (BUILD / BREAK / SHIP)
 * in one GSAP context to avoid hydration race conditions.
 *
 * Effect: chars slide up from y:40 + fade in, per-char stagger 0.022s.
 * Words cascade: BUILD at 0.2s → BREAK at 0.45s → SHIP at 0.65s.
 *
 * Why no overflow:hidden wrapper:
 * - PP Formula at line-height:0.85 has cap-height > line box.
 *   overflow:hidden on the wrapper clips the ascenders of capital letters.
 * - Chars start at opacity:0 (set by GSAP fromTo), so the y:40 offset is
 *   invisible — no clipping wrapper needed.
 *
 * Pre-hide via CSS (global.css [data-hero-word] { opacity:0 }) prevents
 * flash-of-visible-content before GSAP loads. GSAP's fromTo with
 * { opacity:0 } as the 'from' state overrides the CSS as soon as it runs.
 */
import { useRef, useEffect } from 'react';

const WORDS = ['BUILD.', 'BREAK.', 'SHIP.'] as const;
const DELAYS = [0.2, 0.45, 0.65];

interface Props {
  /** CSS class applied to each word element. Must supply full type styles. */
  wordClass?: string;
}

export default function HeroWords({ wordClass }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wordEls = Array.from(
      container.querySelectorAll<HTMLElement>('[data-hero-word]')
    );

    /* Reduced-motion: reveal all words immediately, skip animation */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wordEls.forEach((el) => { el.style.opacity = '1'; });
      return;
    }

    let ctx: { revert: () => void } | null = null;
    const splits: Array<{ revert: () => void }> = [];

    // Fallback: if GSAP/SplitText hasn't loaded within 1.5s (slow mobile),
    // reveal words immediately so the hero doesn't look blank.
    // fallbackFired prevents GSAP from re-hiding and re-animating if it loads after the fallback.
    let gsapReady = false;
    let fallbackFired = false;
    const fallbackTimer = setTimeout(() => {
      if (!gsapReady) {
        fallbackFired = true;
        wordEls.forEach((el) => { el.style.opacity = '1'; });
      }
    }, 1500);

    void (async () => {
      try {
        const { gsap } = await import('gsap');
        const { SplitText } = await import('gsap/SplitText');
        gsap.registerPlugin(SplitText);

        if (!containerRef.current) return; /* unmounted during async import */
        if (fallbackFired) return; // fallback already revealed words — don't re-hide and re-animate

        gsapReady = true;
        clearTimeout(fallbackTimer);

        // On first visit the Loader covers the screen for ~3.5s.
        // Glitch fires after loader clears so user actually sees it.
        const isFirstVisit = !sessionStorage.getItem('jcl-loaded');
        const loaderOffset = isFirstVisit ? 3.2 : 0;

        // Cursor blink element for SHIP's period — appended after SHIP animates in
        let cursorEl: HTMLSpanElement | null = null;

        ctx = gsap.context(() => {
          wordEls.forEach((el, i) => {
            /*
             * SplitText wraps each char in an inline <span>.
             * fromTo immediately sets chars to { y:40, opacity:0 }
             * so the parent's CSS opacity:0 never causes a visible gap.
             */
            const split = new SplitText(el, { type: 'chars' });
            splits.push(split);
            const chars = (split as unknown as { chars: HTMLElement[] }).chars;

            /* Reveal the word div (removes CSS opacity:0). Chars start at
               opacity:0 via fromTo below — no visible flash between the two. */
            gsap.set(el, { opacity: 1 });

            gsap.fromTo(
              chars,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: DELAYS[i] ?? 0,
                stagger: 0.022,
                ease: 'power4.out',
              }
            );

            // Glitch: rapid skew + shift then snap back (80ms total)
            const glitchDelay = loaderOffset + (DELAYS[i] ?? 0) + 0.75 + chars.length * 0.022 + 0.15;
            const tl = gsap.timeline({ delay: glitchDelay });
            tl.to(el, { skewX: 1.8, x: 3, duration: 0.04, ease: 'none' })
              .to(el, { skewX: -1.2, x: -2, duration: 0.03, ease: 'none' })
              .to(el, { skewX: 0, x: 0, duration: 0.04, ease: 'none' });

            // Terminal cursor blink on the period of SHIP (last word)
            if (i === WORDS.length - 1) {
              const shipDelay = loaderOffset + (DELAYS[i] ?? 0) + 0.75 + chars.length * 0.022 + 0.3;
              gsap.delayedCall(shipDelay, () => {
                if (!containerRef.current) return;
                cursorEl = document.createElement('span');
                cursorEl.setAttribute('data-cursor-blink', '');
                cursorEl.setAttribute('aria-hidden', 'true');
                el.appendChild(cursorEl);
              });
            }
          });
        }, container);
      } catch {
        /* GSAP/SplitText unavailable — fall back to instant reveal */
        wordEls.forEach((el) => { el.style.opacity = '1'; });
      }
    })();

    return () => {
      clearTimeout(fallbackTimer);
      ctx?.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  /*
   * display:contents on the container — words become direct flex children
   * of the leftPanel, so gap and justify-content on leftPanel apply directly.
   * No extra wrapper box means no unexpected height or overflow.
   */
  return (
    <div ref={containerRef} style={{ display: 'contents' }}>
      {WORDS.map((word) => (
        <div key={word} data-hero-word className={wordClass}>
          {word}
        </div>
      ))}
    </div>
  );
}
