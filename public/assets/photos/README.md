# Photos — homepage real images

Imágenes personales usadas en Timeline + Signals de la homepage.

## Archivos esperados

| Filename                  | Where it shows                       | Photo
|---------------------------|--------------------------------------|----------
| `2021-balcony.jpg`        | Timeline 2021 + Signals POL-02       | Solo balcón al atardecer
| `2022-meet.jpg`           | Timeline 2022                        | Google Meet team review
| `2024-coworking.jpg`      | Timeline 2024                        | Co-working oficina con equipo
| `2025-tablet.jpg`         | Timeline 2025 + Signals POL-03       | Tablet sketching oficina
| `cafe-planning.jpg`       | Signals POL-01                       | Café trabajando con partner

Optimizar antes de subir: resize a ~1200px lado largo, JPEG quality 80–85.
Formato `.jpg` (preferido) o `.webp`. Si cambia el formato, actualizar referencias en:
- `src/components/home2026/Timeline.astro` (array `entries[].image`)
- `src/components/home2026/RecentSignals.astro` (array `signals[].image`)
