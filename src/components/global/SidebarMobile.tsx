/**
 * SidebarMobile.tsx
 * React island — controla apertura del sidebar como drawer en mobile.
 *
 * El sidebar real está en DOM siempre (Sidebar.astro). En mobile (≤1023px)
 * está oculto por CSS hasta que body.sidebar-open lo muestra como drawer
 * slide-in desde la izquierda.
 *
 * Esta isla:
 *  - Renderiza botón JCL fijo top-left
 *  - Toggle body.sidebar-open
 *  - Cierra con: ESC, click backdrop, navegación astro
 */
import { useEffect, useState } from 'react';
import styles from './SidebarMobile.module.css';

export default function SidebarMobile() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onNav = () => setOpen(false);

    window.addEventListener('keydown', onKey);
    document.addEventListener('astro:before-swap', onNav);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('astro:before-swap', onNav);
      document.body.classList.remove('sidebar-open');
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="site-sidebar"
        aria-label={open ? 'Cerrar navegación' : 'Abrir navegación'}
      >
        JCL
      </button>
      <div
        className={styles.backdrop}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
