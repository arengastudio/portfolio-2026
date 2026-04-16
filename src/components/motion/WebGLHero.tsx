/**
 * WebGLHero.tsx
 * Subtle animated noise shader behind the hero section.
 * Uses OGL (lightweight WebGL) — dynamic import for SSR safety.
 *
 * Effect: slow-drifting fBm (fractional Brownian motion) noise in
 * accent color (#4B53F6) at ~4% max opacity. Adds organic depth to
 * the cream background without competing with the typography.
 *
 * Architecture:
 * - Fullscreen Triangle geometry (single triangle covering clip space)
 * - Fragment shader only — vertex passthrough, no camera/matrix math
 * - ResizeObserver tracks parent dimensions
 * - IntersectionObserver pauses RAF when off-screen
 * - Degrades silently if WebGL context fails
 * - Skips entirely on prefers-reduced-motion
 *
 * Canvas is positioned absolute via the wrapperClass prop (same pattern
 * as HoverParallax). Set position:relative on the parent section.
 */
import { useRef, useEffect } from 'react';

interface Props {
  /** CSS class applied to the <canvas> — handles position:absolute and sizing. */
  wrapperClass?: string;
}

const VERTEX = /* glsl */`
  attribute vec3 position;
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */`
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  /*
   * uScrollVelocity — pixels scrolled since the last frame (smoothed).
   * Boosts the drift speed and opacity when the user is scrolling fast,
   * making the noise feel "reactive" without being distracting at rest.
   * Typical values: 0 (idle) → ~8–20 (moderate scroll) → ~40+ (fast fling).
   */
  uniform float uScrollVelocity;

  /* ── Value noise ─────────────────────────────────────────── */
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  /* ── fBm — 4 octaves ─────────────────────────────────────── */
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p  = p * 2.0 + vec2(31.416, 27.183);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    /*
     * Base drift speed 0.04 — increases with scroll velocity.
     * clamp(uScrollVelocity * 0.0015, 0.0, 0.08) adds up to 2× speed boost.
     */
    float t  = uTime * (0.04 + clamp(uScrollVelocity * 0.0015, 0.0, 0.08));
    float n  = fbm(uv * 1.6 + vec2(t, t * 0.67));
    n = smoothstep(0.3, 0.75, n);

    /* Accent color: #4B53F6 ≈ (0.294, 0.325, 0.965) */
    vec3 accent = vec3(0.294, 0.325, 0.965);
    /* Base opacity 0.04 — rises up to 0.09 at peak scroll velocity */
    float opacity = n * (0.04 + clamp(uScrollVelocity * 0.0012, 0.0, 0.05));
    gl_FragColor = vec4(accent, opacity);
  }
`;

export default function WebGLHero({ wrapperClass }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    let raf = 0;

    void (async () => {
      /* Dynamic import — keeps OGL out of the SSR bundle */
      const { Renderer, Program, Mesh, Triangle } = await import('ogl');
      if (destroyed || !canvas) return;

      /* ── Renderer ─────────────────────────────────────────── */
      let renderer: InstanceType<typeof Renderer>;
      try {
        renderer = new Renderer({
          canvas,
          alpha: true,
          premultipliedAlpha: false,
          antialias: false,
          dpr: Math.min(window.devicePixelRatio, 1.5),
        });
      } catch {
        /* WebGL not supported — degrade silently */
        return;
      }

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      /* ── Geometry: fullscreen triangle ────────────────────── */
      const geometry = new Triangle(gl);

      /* ── Shader program ───────────────────────────────────── */
      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: {
          uTime:           { value: 0 },
          uResolution:     { value: new Float32Array([canvas.offsetWidth, canvas.offsetHeight]) },
          uScrollVelocity: { value: 0 },
        },
        transparent: true,
        depthTest:   false,
        depthWrite:  false,
      });

      const mesh = new Mesh(gl, { geometry, program });

      /* ── Resize ───────────────────────────────────────────── */
      const resize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const w = parent.offsetWidth;
        const h = parent.offsetHeight;
        renderer.setSize(w, h);
        (program.uniforms.uResolution.value as Float32Array).set([w, h]);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(canvas.parentElement ?? canvas);
      resize();

      /* ── Pause when off-screen ────────────────────────────── */
      let visible = true;
      const io = new IntersectionObserver(
        ([e]) => { visible = e.isIntersecting; },
        { threshold: 0 }
      );
      io.observe(canvas);

      /* ── Animation loop ───────────────────────────────────── */
      let lastScrollY = window.scrollY;

      const tick = (t: number) => {
        if (destroyed) return;
        raf = requestAnimationFrame(tick);
        if (!visible) return;

        /*
         * Scroll velocity: pixels scrolled since last frame.
         * Exponential smoothing (0.88 decay) prevents jitter and creates
         * a natural ramp-up / ramp-down feel. Multiplied by 0.12 for blending.
         */
        const currentScrollY = window.scrollY;
        const rawVelocity     = Math.abs(currentScrollY - lastScrollY);
        lastScrollY           = currentScrollY;

        const prev = program.uniforms.uScrollVelocity.value as number;
        program.uniforms.uScrollVelocity.value = prev * 0.88 + rawVelocity * 0.12;

        program.uniforms.uTime.value = t * 0.001;
        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(tick);

      /* ── Cleanup ──────────────────────────────────────────── */
      const origReturn = () => {
        destroyed = true;
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        const ext = gl.getExtension('WEBGL_lose_context');
        ext?.loseContext();
      };
      canvas.addEventListener('__webgl_destroy__', origReturn, { once: true });
    })();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      canvas.dispatchEvent(new Event('__webgl_destroy__'));
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={wrapperClass}
      aria-hidden="true"
    />
  );
}
