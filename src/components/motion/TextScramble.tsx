/**
 * TextScramble.tsx
 * Hover-triggered character scramble on a text element.
 *
 * On mouseenter: each character cycles through random uppercase glyphs
 * for ~30ms per frame. Characters resolve left-to-right — earlier chars
 * settle first, later chars scramble longest. Duration ≈ 0.6s for
 * a 14-char string at 0.5 iterations/frame.
 *
 * Design intent: "Juan Cruz Luna" scrambles briefly on hover, then
 * re-emerges. References the /1985 terminal aesthetic. Subtle Easter egg
 * for users who hover over the name.
 *
 * Renders an <h1>. Typography is supplied by the parent via className
 * (Hero.module.css .name adds the xl font specs after removing Type wrapper).
 *
 * prefers-reduced-motion: no scramble, static text.
 * Fine-pointer only: effect doesn't fire on touch (no mouseenter on mobile).
 */
import { useRef, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!·—';

interface Props {
  text: string;
  /** CSS class for typography/spacing — usually Hero.module.css styles.name */
  className?: string;
}

export default function TextScramble({ text, className }: Props) {
  const elRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const scramble = () => {
      // Clear any in-progress scramble
      if (intervalId) clearInterval(intervalId);

      let iteration = 0;

      intervalId = setInterval(() => {
        if (!el) return;

        el.textContent = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '; // preserve word spacing
            if (i < Math.floor(iteration)) return text[i]; // settled
            return CHARS[Math.floor(Math.random() * CHARS.length)]; // scrambling
          })
          .join('');

        // 0.5 iterations per frame → ~60ms per character resolution
        iteration += 0.5;

        if (iteration > text.length) {
          clearInterval(intervalId!);
          el.textContent = text; // guarantee clean final state
        }
      }, 30);
    };

    el.addEventListener('mouseenter', scramble);

    return () => {
      el.removeEventListener('mouseenter', scramble);
      if (intervalId) clearInterval(intervalId);
      // Restore original text in case scramble was mid-run at unmount
      if (el) el.textContent = text;
    };
  }, [text]);

  return (
    <h1 ref={elRef} className={className}>
      {text}
    </h1>
  );
}
