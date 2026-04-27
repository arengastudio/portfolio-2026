/**
 * LiveClock.tsx
 * Real-time clock for Buenos Aires (ART = UTC−3, no daylight saving).
 * Used as a React island (client:load) inside the Currently section.
 *
 * Renders a text fragment — styling is handled by the parent wrapper
 * in Currently.module.css so no inline styles or CSS modules needed here.
 *
 * Initial state "--:--:--" avoids hydration mismatch: server renders the
 * placeholder, client updates to real time on mount.
 */

import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          timeZone: 'America/Argentina/Buenos_Aires',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Render nothing until first tick fires (avoids "--:--:--" flash)
  if (!time) return null;
  return <>BUENOS AIRES · {time} ART</>;
}
