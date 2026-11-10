// PENALTY LEGENDS build: concatenates the modular sources into a single self-contained HTML file
// (penalty_legends.html) and an Artifact-ready page fragment (artifact.html). Same code in both.
const fs = require('fs'), path = require('path');
const root = __dirname;
const srcDir = path.join(root, 'src');
const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.js')).sort();
const js = files.map((f) => `/* ==== ${f} ==== */\n` + fs.readFileSync(path.join(srcDir, f), 'utf8')).join('\n');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Teko:wght@500;600;700&display=swap">';
const body = `<div id="app">
  <div id="stage"><canvas id="game" width="480" height="270" aria-label="Campo de juego de Penalty Legends"></canvas><div id="hud" hidden></div></div>
  <div id="screens"></div>
  <div id="toast" aria-live="polite"></div>
</div>
<noscript><p style="color:#fff;padding:20px;font-family:sans-serif">Penalty Legends necesita JavaScript.</p></noscript>`;
const scriptTag = `<script>\n${js.replace(/<\/script/gi, '<\\/script')}\n</script>`;
const full = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0a1020">
<title>Penalty Legends</title>
${fonts}
<style>
${css}
</style>
</head>
<body>
${body}
${scriptTag}
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'penalty_legends.html'), full);
const art = `<title>Penalty Legends</title>
${fonts}
<style>
${css}
</style>
${body}
${scriptTag}
`;
fs.writeFileSync(path.join(root, 'artifact.html'), art);
console.log('built', files.length, 'modules,', (full.length / 1024).toFixed(1), 'KB');
