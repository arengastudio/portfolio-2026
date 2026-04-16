/**
 * WorkArchive.tsx
 * All-works list with floating hover image + left-panel description.
 *
 * Effect:
 * - Hovering a row reveals a description in the left panel (fade + slide)
 * - An image floats near the cursor and follows it smoothly via GSAP
 * - The image transitions between projects with a quick fade
 *
 * The floating image is position:fixed, moved via GSAP quickSetter on
 * mousemove. It never blocks interaction (pointer-events: none).
 */
import { useEffect, useRef, useState } from 'react';
import styles from './WorkArchive.module.css';

export interface WorkItem {
  number: string;
  title: string;
  year: string;
  tags: string[];
  description: string;
  image: string;
  href?: string;
}

interface Props {
  items: WorkItem[];
}

export default function WorkArchive({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const floatRef  = useRef<HTMLDivElement>(null);
  const imgRef    = useRef<HTMLImageElement>(null);
  const mousePos  = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);

  useEffect(() => {
    let gsap: typeof import('gsap')['gsap'] | null = null;
    let xSetter: ((v: number) => void) | null = null;
    let ySetter: ((v: number) => void) | null = null;
    let animFrame: number;

    const float = floatRef.current;
    if (!float) return;

    void (async () => {
      const mod = await import('gsap');
      gsap = mod.gsap;

      xSetter = gsap.quickSetter(float, 'x', 'px') as (v: number) => void;
      ySetter = gsap.quickSetter(float, 'y', 'px') as (v: number) => void;

      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      let curX = 0, curY = 0;

      const tick = () => {
        curX = lerp(curX, mousePos.current.x, 0.12);
        curY = lerp(curY, mousePos.current.y, 0.12);
        xSetter!(curX);
        ySetter!(curY);
        animFrame = requestAnimationFrame(tick);
      };
      animFrame = requestAnimationFrame(tick);
    })();

    const onMove = (e: MouseEvent) => {
      // Offset so image doesn't sit directly under the cursor
      mousePos.current = { x: e.clientX + 24, y: e.clientY - 40 };
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const handleEnter = (index: number) => {
    setActiveIndex(index);
    const float = floatRef.current;
    const img   = imgRef.current;
    if (!float || !img) return;

    // Swap image src and fade
    img.style.opacity = '0';
    img.src = items[index].image;
    img.onload = () => { img.style.opacity = '1'; };

    // Show the float
    if (!isVisible.current) {
      isVisible.current = true;
      float.style.opacity = '1';
      float.style.transform = 'scale(1)';
    }
  };

  const handleLeave = () => {
    setActiveIndex(null);
    isVisible.current = false;
    const float = floatRef.current;
    if (float) float.style.opacity = '0';
  };

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div className={styles.archiveWrap}>

      {/* ─── Left description panel ─── */}
      <div className={styles.descPanel}>
        <div
          className={styles.descInner}
          style={{ opacity: activeItem ? 1 : 0, transform: activeItem ? 'translateY(0)' : 'translateY(8px)' }}
        >
          {activeItem && (
            <>
              <p className={styles.descTitle}>{activeItem.title}</p>
              <p className={styles.descText}>{activeItem.description}</p>
            </>
          )}
        </div>
      </div>

      {/* ─── Works list ─── */}
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isActive = activeIndex === i;
          const Tag = item.href ? 'a' : 'span';
          return (
            <li
              key={item.title}
              className={`${styles.row} ${isActive ? styles.rowActive : ''}`}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
            >
              <Tag
                {...(item.href ? { href: item.href } : {})}
                className={styles.rowInner}
              >
                <span className={styles.rowNumber}>{item.number}</span>
                <span className={styles.rowTitle}>{item.title}</span>
                <span className={styles.rowYear}>{item.year}</span>
                <span className={styles.rowTags}>{item.tags.join(' · ')}</span>
                {item.href && <span className={styles.rowArrow} aria-hidden="true">→</span>}
              </Tag>
            </li>
          );
        })}
      </ol>

      {/* ─── Floating image (follows cursor) ─── */}
      <div
        ref={floatRef}
        className={styles.floatImg}
        style={{ opacity: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <img ref={imgRef} src="" alt="" className={styles.floatPhoto} />
      </div>

    </div>
  );
}
