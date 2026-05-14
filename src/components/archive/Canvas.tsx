/**
 * Canvas.tsx
 * Espacio 2D libre estilo Figma/Miro para /archivo.
 *
 * Performance: el transform del world se aplica directo al style del elemento
 * (sin re-render React) para mantener 60fps en pan/zoom. React solo re-renderea
 * en cambios discretos (hint visibility, zoomDisplay).
 *
 * Interacciones:
 *  - Pan: pointerdown + pointermove sobre el viewport
 *  - Zoom: wheel sobre el viewport (zoom-toward-cursor), pinch en touch
 *  - Click en card vs drag: si pointer movió >5px, se cancela el click
 *  - Bounds: pan limitado para que siempre quede al menos 200px de world visible
 */
import { useEffect, useRef, useState } from 'react';
import { canvasProjects, canvasArtifacts } from '../../config/projects';
import ProjectCard from './ProjectCard';
import Artifact from './Artifact';
import styles from './Canvas.module.css';

const WORLD_W = 3000;
const WORLD_H = 2200;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const MIN_VISIBLE = 200;
const DRAG_THRESHOLD = 5;
const HINT_DURATION = 3000;

/* Centro inicial sobre LDP (1400, 800) — un poco arriba-izquierda del viewport */
const INITIAL_TARGET_X = 1400;
const INITIAL_TARGET_Y = 800;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

interface PinchState {
  initialDist: number;
  initialZoom: number;
  centerX: number;
  centerY: number;
}

export default function Canvas() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef({ x: 0, y: 0, zoom: 1 });
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const panStartRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const pinchRef = useRef<PinchState | null>(null);

  const [zoomDisplay, setZoomDisplay] = useState(100);
  const [hintVisible, setHintVisible] = useState(false);
  const [panning, setPanning] = useState(false);

  /* Aplica el transform del world directamente al DOM (sin re-render) */
  const applyTransform = () => {
    const world = worldRef.current;
    if (!world) return;
    const { x, y, zoom } = transformRef.current;
    world.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
  };

  /* Clamping suave para no perderse en el vacío */
  const clampPan = (x: number, y: number, zoom: number) => {
    const view = viewportRef.current;
    if (!view) return { x, y };
    const viewW = view.clientWidth;
    const viewH = view.clientHeight;
    const minX = -(WORLD_W * zoom) + MIN_VISIBLE;
    const maxX = viewW - MIN_VISIBLE;
    const minY = -(WORLD_H * zoom) + MIN_VISIBLE;
    const maxY = viewH - MIN_VISIBLE;
    return {
      x: clamp(x, minX, maxX),
      y: clamp(y, minY, maxY),
    };
  };

  /* Inicialización: centrar sobre LDP */
  useEffect(() => {
    const view = viewportRef.current;
    if (!view) return;
    const vw = view.clientWidth;
    const vh = view.clientHeight;
    /* Posicionar LDP a 35% horizontal, 40% vertical del viewport */
    const targetVx = vw * 0.35;
    const targetVy = vh * 0.4;
    transformRef.current = {
      x: targetVx - INITIAL_TARGET_X,
      y: targetVy - INITIAL_TARGET_Y,
      zoom: 1,
    };
    applyTransform();

    /* Mostrar hint */
    setHintVisible(true);
    const hintTimer = window.setTimeout(() => setHintVisible(false), HINT_DURATION);
    return () => clearTimeout(hintTimer);
  }, []);

  /* Pointer handlers (mouse + touch unificado via Pointer Events API) */
  useEffect(() => {
    const view = viewportRef.current;
    if (!view) return;

    const onPointerDown = (e: PointerEvent) => {
      view.setPointerCapture(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      hasDraggedRef.current = false;

      if (pointersRef.current.size === 1) {
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          tx: transformRef.current.x,
          ty: transformRef.current.y,
        };
        setPanning(true);
      } else if (pointersRef.current.size === 2) {
        /* Iniciar pinch */
        const pts = Array.from(pointersRef.current.values());
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        const dist = Math.hypot(dx, dy);
        const rect = view.getBoundingClientRect();
        pinchRef.current = {
          initialDist: dist,
          initialZoom: transformRef.current.zoom,
          centerX: (pts[0].x + pts[1].x) / 2 - rect.left,
          centerY: (pts[0].y + pts[1].y) / 2 - rect.top,
        };
        panStartRef.current = null;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      /* Pinch zoom */
      if (pointersRef.current.size === 2 && pinchRef.current) {
        const pts = Array.from(pointersRef.current.values());
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        const dist = Math.hypot(dx, dy);
        const newZoom = clamp(
          pinchRef.current.initialZoom * (dist / pinchRef.current.initialDist),
          ZOOM_MIN,
          ZOOM_MAX
        );
        applyZoom(newZoom, pinchRef.current.centerX, pinchRef.current.centerY);
        hasDraggedRef.current = true;
        return;
      }

      /* Pan con un solo pointer */
      if (panStartRef.current && pointersRef.current.size === 1) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          hasDraggedRef.current = true;
          setHintVisible(false);
        }
        const next = clampPan(
          panStartRef.current.tx + dx,
          panStartRef.current.ty + dy,
          transformRef.current.zoom
        );
        transformRef.current.x = next.x;
        transformRef.current.y = next.y;
        applyTransform();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) {
        pinchRef.current = null;
      }
      if (pointersRef.current.size === 0) {
        panStartRef.current = null;
        setPanning(false);
      }
    };

    /* Click capture: si fue drag, cancelar click en cards/links */
    const onClickCapture = (e: MouseEvent) => {
      if (hasDraggedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        hasDraggedRef.current = false;
      }
    };

    view.addEventListener('pointerdown', onPointerDown);
    view.addEventListener('pointermove', onPointerMove);
    view.addEventListener('pointerup', onPointerUp);
    view.addEventListener('pointercancel', onPointerUp);
    view.addEventListener('click', onClickCapture, true);

    return () => {
      view.removeEventListener('pointerdown', onPointerDown);
      view.removeEventListener('pointermove', onPointerMove);
      view.removeEventListener('pointerup', onPointerUp);
      view.removeEventListener('pointercancel', onPointerUp);
      view.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  /* Wheel zoom — zoom toward cursor */
  const applyZoom = (newZoom: number, cursorVx: number, cursorVy: number) => {
    const { x, y, zoom: oldZoom } = transformRef.current;
    /* Coord mundo bajo el cursor */
    const worldX = (cursorVx - x) / oldZoom;
    const worldY = (cursorVy - y) / oldZoom;
    /* Nuevo pan para mantener ese punto mundo bajo el cursor */
    let newX = cursorVx - worldX * newZoom;
    let newY = cursorVy - worldY * newZoom;
    const clamped = clampPan(newX, newY, newZoom);
    transformRef.current = { x: clamped.x, y: clamped.y, zoom: newZoom };
    applyTransform();
    setZoomDisplay(Math.round(newZoom * 100));
  };

  useEffect(() => {
    const view = viewportRef.current;
    if (!view) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = view.getBoundingClientRect();
      const cursorVx = e.clientX - rect.left;
      const cursorVy = e.clientY - rect.top;
      const { zoom } = transformRef.current;
      const delta = -e.deltaY * 0.0015;
      const newZoom = clamp(zoom * (1 + delta), ZOOM_MIN, ZOOM_MAX);
      applyZoom(newZoom, cursorVx, cursorVy);
      setHintVisible(false);
    };

    view.addEventListener('wheel', onWheel, { passive: false });
    return () => view.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      ref={viewportRef}
      className={styles.viewport}
      data-panning={panning}
      role="application"
      aria-label="Canvas navegable del archivo de proyectos"
    >
      <div ref={worldRef} className={styles.world}>
        {canvasProjects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
        {canvasArtifacts.map((a) => (
          <Artifact key={a.id} artifact={a} />
        ))}
      </div>

      <div className={styles.hint} data-visible={hintVisible} aria-hidden="true">
        <span className={styles.hintIcon}>✥</span>
        <span>Explorá el archivo</span>
      </div>

      <div className={styles.zoomBadge} aria-hidden="true">
        {zoomDisplay}%
      </div>
    </div>
  );
}
