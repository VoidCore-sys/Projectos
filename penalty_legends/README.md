# PENALTY LEGENDS

Juego de tandas de penales en pixel art. Abrí `penalty_legends.html` en cualquier navegador moderno: no necesita instalación, servidor ni internet. Las fuentes Teko y Barlow Condensed se cargan desde Google Fonts si hay conexión; sin conexión se usan fuentes del sistema.

## Archivos
- `penalty_legends.html`: el juego completo en un solo archivo (CSS y JS incluidos).
- `artifact.html`: la misma build en formato fragmento para Claude Artifacts (mismo código).
- `src/*.js`: código fuente modular. `styles.css`: interfaz. `build.js`: `node build.js` regenera los dos HTML.

## Arquitectura (src/)
00 núcleo y matemática · 01 guardado (localStorage, migración por merge, exportar/importar con código) · 02 framebuffer de píxeles y fuente 3x5 · 03 datos (personajes, porteros, equipos, estadios, objetos, torneos, desafíos, carrera) · 04 cámara en perspectiva · 05 personajes esqueléticos (cinemática directa y rasterizado píxel a píxel con sombreado y contorno) · 06 físicas del balón · 07 portero (IA, estiradas, hitboxes) · 08 lanzador y su IA · 09 modelo de tiro · 10 estadio con raycasting, público, carteles y marcador · 11 escena y efectos · 12 audio procedural · 13 entrada · 14 penal, tanda, entrenamiento y modo demo · 15 progresión, simulación, torneos, carrera y desafíos · 16 interfaz y HUD · 17 bucle principal y flujo de modos.

## Ampliar el audio
Todo el sonido se sintetiza en tiempo real. Para usar archivos con licencia: `PL.Audio.registerSample('kick', 'sonidos/kick.ogg')` (también `post`, `net`, `save`, `whistle`, etc.).
