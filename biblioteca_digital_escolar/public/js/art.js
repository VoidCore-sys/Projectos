/**
 * Ilustraciones vectoriales originales: escenas para portadas y capítulos,
 * avatares e íconos. Todo se dibuja en SVG, sin imágenes externas.
 */
let uidCounter = 0;
const uid = () => `a${(++uidCounter).toString(36)}`;

const stars = (n, seed = 1, area = [0, 0, 200, 150], color = '#fff') => {
  let s = seed * 9301;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = area[0] + rnd() * area[2];
    const y = area[1] + rnd() * area[3];
    const r = 0.5 + rnd() * 1.3;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
  }
  return out;
};

const cloud = (x, y, s = 1, o = 0.85) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${o}"><ellipse cx="0" cy="0" rx="18" ry="9"/><ellipse cx="12" cy="-6" rx="12" ry="10"/><ellipse cx="-10" cy="-4" rx="10" ry="8"/></g>`;

const bird = (x, y, s = 1, c = '#1d1b3a') =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M-6 0 Q-3 -4 0 0 Q3 -4 6 0" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>`;

/** Escenas: cada una recibe un id único y devuelve el contenido SVG (viewBox 0 0 200 280). */
const SCENES = {
  dragon: () => `
    <circle cx="160" cy="58" r="24" fill="#fff6c2" opacity=".95"/>
    ${cloud(45, 70, 1.1)}${cloud(120, 100, .8, .7)}
    <path d="M0 205 Q50 175 100 200 T200 190 V280 H0Z" fill="#6cc17a"/>
    <path d="M0 232 Q60 210 120 236 T200 228 V280 H0Z" fill="#3f9a5b"/>
    <g transform="translate(62 132)">
      <path d="M8 70 q-34 12 -40 -12 q12 10 24 0" fill="#ff8c42"/>
      <ellipse cx="30" cy="55" rx="34" ry="30" fill="#ff8c42"/>
      <ellipse cx="33" cy="62" rx="20" ry="18" fill="#ffd8a8"/>
      <path d="M14 36 L-12 4 L26 20Z" fill="#ff6b81"/>
      <path d="M20 30 L4 6 L32 20Z" fill="#ff8fa3"/>
      <circle cx="60" cy="24" r="22" fill="#ff8c42"/>
      <path d="M48 6 l4 -13 l7 11z M63 3 l6 -12 l4 13z" fill="#ffc14d"/>
      <circle cx="66" cy="20" r="5.5" fill="#fff"/><circle cx="67.5" cy="20.5" r="2.8" fill="#2b2140"/>
      <ellipse cx="78" cy="31" rx="7" ry="5" fill="#ffa463"/>
      <circle cx="81" cy="30" r="1.3" fill="#a04a1a"/>
      <path d="M58 36 q6 5 12 1" stroke="#a04a1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <ellipse cx="20" cy="84" rx="9" ry="5" fill="#e8702d"/><ellipse cx="44" cy="84" rx="9" ry="5" fill="#e8702d"/>
    </g>
    <g fill="#fff" fill-opacity=".22" stroke="#fff" stroke-opacity=".9" stroke-width="1.3">
      <circle cx="158" cy="150" r="9"/><circle cx="172" cy="124" r="12"/><circle cx="150" cy="112" r="6"/><circle cx="182" cy="92" r="8"/><circle cx="160" cy="80" r="4"/>
    </g>
    <g fill="#fff" opacity=".85"><circle cx="168" cy="119" r="2.5"/><circle cx="155" cy="146" r="2"/></g>`,

  luna: (id) => `
    ${stars(46, 3, [0, 0, 200, 190])}
    <mask id="${id}m"><rect width="200" height="280" fill="#fff"/><circle cx="152" cy="66" r="31" fill="#000"/></mask>
    <circle cx="136" cy="78" r="38" fill="#fff4c9" mask="url(#${id}m)"/>
    <circle cx="136" cy="78" r="52" fill="#fff4c9" opacity=".08"/>
    <g transform="translate(40 112) rotate(-8)">
      <path d="M0 0 L46 0 L38 12 L8 12Z" fill="#fff"/><path d="M23 0 L23 -24 L38 0Z" fill="#e9e6ff"/><path d="M23 -24 L23 0 L10 0Z" fill="#fff"/>
    </g>
    ${cloud(64, 130, 1, .25)}
    <path d="M0 220 L30 220 L30 200 L60 182 L90 200 L90 214 L120 214 L120 190 L150 172 L182 190 L182 220 L200 220 V280 H0Z" fill="#1c1840"/>
    <rect x="44" y="200" width="12" height="12" fill="#ffd36e"/><rect x="140" y="194" width="10" height="12" fill="#ffd36e"/>
    <g fill="#1c1840"><ellipse cx="104" cy="208" rx="9" ry="7"/><circle cx="104" cy="198" r="6"/><path d="M99 194 l1 -6 l4 4z M109 194 l-1 -6 l-4 4z"/><path d="M112 210 q12 -2 10 -14" stroke="#1c1840" stroke-width="3" fill="none" stroke-linecap="round"/></g>`,

  huerta: () => `
    <circle cx="44" cy="54" r="22" fill="#fff3a6"/>
    <g stroke="#fff3a6" stroke-width="3" stroke-linecap="round" opacity=".8">
      <line x1="44" y1="18" x2="44" y2="26"/><line x1="44" y1="82" x2="44" y2="90"/><line x1="8" y1="54" x2="16" y2="54"/><line x1="72" y1="54" x2="80" y2="54"/>
      <line x1="19" y1="29" x2="24" y2="34"/><line x1="64" y1="74" x2="69" y2="79"/><line x1="69" y1="29" x2="64" y2="34"/><line x1="19" y1="79" x2="24" y2="74"/>
    </g>
    <path d="M0 214 Q100 196 200 214 V280 H0Z" fill="#8b5a3c"/>
    <path d="M0 236 Q100 222 200 236 V280 H0Z" fill="#6f4430"/>
    <path d="M128 214 C126 170 132 140 130 108" stroke="#3f9a5b" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M129 170 q-26 -6 -34 -24 q24 0 34 18z" fill="#4fb36b"/><path d="M131 150 q26 -8 32 -28 q-24 4 -32 22z" fill="#4fb36b"/>
    <g transform="translate(130 92)">
      ${Array.from({ length: 14 }, (_, i) => `<ellipse cx="0" cy="-27" rx="7" ry="16" fill="${i % 2 ? '#ffc93c' : '#ffb000'}" transform="rotate(${i * 360 / 14})"/>`).join('')}
      <circle r="18" fill="#7a4a24"/><circle r="12" fill="#5c3418"/>
      ${stars(12, 7, [-12, -12, 24, 24], '#3a1f0c')}
    </g>
    <path d="M56 214 q-2 -14 0 -22" stroke="#3f9a5b" stroke-width="3" fill="none"/>
    <path d="M56 196 q-12 -4 -14 -12 q10 0 14 8z M56 198 q12 -6 14 -14 q-10 2 -14 10z" fill="#6cc17a"/>
    <g transform="translate(88 236)"><path d="M-14 0 q7 -12 14 0 q7 12 14 0" stroke="#ff8fb1" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="14" cy="-1" r="1.4" fill="#3a1f0c"/></g>
    <g transform="translate(166 150)"><ellipse rx="8" ry="6" fill="#ffd23f"/><path d="M-3 -6 v12 M2 -6 v12" stroke="#2b2140" stroke-width="2"/><ellipse cx="-2" cy="-8" rx="5" ry="3" fill="#fff" opacity=".8"/><ellipse cx="4" cy="-8" rx="5" ry="3" fill="#fff" opacity=".8"/></g>`,

  tortuga: (id) => `
    <defs><linearGradient id="${id}r" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <path d="M40 0 L70 0 L110 280 L60 280Z M120 0 L140 0 L170 280 L140 280Z" fill="url(#${id}r)"/>
    <g fill="#fff" fill-opacity=".25" stroke="#fff" stroke-opacity=".7"><circle cx="150" cy="70" r="5"/><circle cx="158" cy="52" r="3.5"/><circle cx="146" cy="38" r="2.5"/><circle cx="40" cy="150" r="4"/></g>
    <path d="M0 250 Q30 240 60 250 T120 248 T200 246 V280 H0Z" fill="#f4dfa8"/>
    <path d="M22 250 q-4 -30 6 -56 M30 250 q8 -26 0 -48 M176 248 q-6 -34 4 -62 M186 248 q6 -20 -2 -40" stroke="#2f9e6e" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g transform="translate(100 150) rotate(-14)">
      <path d="M-30 8 q-26 4 -34 22 q22 -2 36 -14z" fill="#5cc28a"/><path d="M30 8 q26 4 34 22 q-22 -2 -36 -14z" fill="#5cc28a"/>
      <path d="M-22 -22 q-24 -10 -30 -28 q22 4 32 18z" fill="#5cc28a"/><path d="M22 -22 q24 -10 30 -28 q-22 4 -32 18z" fill="#5cc28a"/>
      <ellipse cx="0" cy="-48" rx="13" ry="15" fill="#6fd39a"/>
      <circle cx="-6" cy="-52" r="3" fill="#1d1b3a"/><circle cx="6" cy="-52" r="3" fill="#1d1b3a"/><circle cx="-5" cy="-53" r="1" fill="#fff"/><circle cx="7" cy="-53" r="1" fill="#fff"/>
      <path d="M-4 -42 q4 3 8 0" stroke="#1d1b3a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="0" cy="0" rx="34" ry="38" fill="#2e8b57"/>
      <ellipse cx="0" cy="0" rx="28" ry="32" fill="#3fae6f"/>
      <path d="M0 -32 L0 32 M-28 -8 L28 -8 M-24 14 L24 14 M-12 -30 L-14 30 M12 -30 L14 30" stroke="#2e8b57" stroke-width="2.4" opacity=".8"/>
    </g>
    ${bird(60, 40, 1, '#fff')}${bird(78, 52, .8, '#fff')}`,

  reloj: () => `
    ${cloud(40, 60, 1.2)}${cloud(160, 40, .9, .7)}
    <rect x="62" y="96" width="76" height="160" fill="#f3e3c3"/>
    <rect x="62" y="96" width="76" height="160" fill="#c98b5e" opacity=".25"/>
    <path d="M54 98 L100 52 L146 98Z" fill="#b5523b"/>
    <rect x="96" y="34" width="8" height="20" fill="#b5523b"/>
    <circle cx="100" cy="134" r="26" fill="#fffaf0" stroke="#7a4a24" stroke-width="4"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="100" y1="112" x2="100" y2="116" stroke="#7a4a24" stroke-width="2" transform="rotate(${i * 30} 100 134)"/>`).join('')}
    <line x1="100" y1="134" x2="114" y2="134" stroke="#2b2140" stroke-width="3.4" stroke-linecap="round" transform="rotate(7 100 134)"/>
    <line x1="100" y1="134" x2="122" y2="134" stroke="#2b2140" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="100" cy="134" r="3" fill="#2b2140"/>
    <rect x="76" y="176" width="16" height="24" rx="8" fill="#7a4a24" opacity=".7"/><rect x="108" y="176" width="16" height="24" rx="8" fill="#7a4a24" opacity=".7"/>
    <path d="M86 256 v-30 a14 14 0 0 1 28 0 v30z" fill="#7a4a24"/>
    <path d="M0 252 H200 V280 H0Z" fill="#5b8e7d"/>
    <g transform="translate(152 108)"><ellipse rx="9" ry="6" fill="#6cc04a"/><circle cx="8" cy="-4" r="5" fill="#8fd16a"/><path d="M12 -4 l5 2 l-5 2z" fill="#ffb347"/><path d="M-8 0 l-12 6 l12 -1z" fill="#4e9a36"/><path d="M-2 -4 q-6 -12 -16 -10 q6 8 14 12z" fill="#57ad3e"/></g>
    <g transform="translate(36 150) scale(-.8 .8)"><ellipse rx="9" ry="6" fill="#6cc04a"/><circle cx="8" cy="-4" r="5" fill="#8fd16a"/><path d="M12 -4 l5 2 l-5 2z" fill="#ffb347"/><path d="M-2 -4 q-6 -12 -16 -10 q6 8 14 12z" fill="#57ad3e"/></g>
    <g transform="translate(160 212)"><circle r="14" fill="#fff" fill-opacity=".25" stroke="#2b2140" stroke-width="4"/><line x1="10" y1="10" x2="24" y2="24" stroke="#2b2140" stroke-width="6" stroke-linecap="round"/></g>`,

  cohete: () => `
    ${stars(50, 11, [0, 0, 200, 280])}
    <circle cx="40" cy="250" r="86" fill="#d4643f"/>
    <circle cx="40" cy="250" r="86" fill="#000" opacity=".12"/>
    <path d="M-30 210 q40 -20 90 -6 q40 10 70 0" stroke="#b44d2e" stroke-width="10" fill="none" opacity=".6"/>
    <circle cx="20" cy="190" r="9" fill="#b44d2e"/><circle cx="70" cy="226" r="6" fill="#b44d2e"/><circle cx="96" cy="196" r="4" fill="#b44d2e"/>
    <ellipse cx="160" cy="70" rx="11" ry="8" fill="#a99a8a" transform="rotate(-20 160 70)"/>
    <g transform="translate(128 150) rotate(35)">
      <path d="M-7 40 q7 26 0 40 q-7 -14 0 -40z" fill="#ffb347" transform="translate(7 0)"/>
      <path d="M0 44 q6 18 0 28 q-6 -10 0 -28z" fill="#fff3b0"/>
      <path d="M-14 -20 Q0 -66 14 -20 V36 H-14Z" fill="#f4f4fb"/>
      <path d="M-14 10 L-28 40 L-14 36Z M14 10 L28 40 L14 36Z" fill="#ff6b6b"/>
      <circle cx="0" cy="-6" r="8" fill="#5ec8f2" stroke="#8a90b8" stroke-width="3"/>
      <path d="M-14 22 H14" stroke="#ff6b6b" stroke-width="4"/>
    </g>`,

  pinguino: (id) => `
    <defs><linearGradient id="${id}a" x1="0" x2="1"><stop offset="0" stop-color="#7cf5c4" stop-opacity="0"/><stop offset=".5" stop-color="#7cf5c4" stop-opacity=".55"/><stop offset="1" stop-color="#9b8cff" stop-opacity="0"/></linearGradient></defs>
    <path d="M-10 60 Q60 20 110 60 T210 40 L210 80 Q140 100 100 80 T-10 100Z" fill="url(#${id}a)"/>
    ${stars(16, 5, [0, 0, 200, 60])}
    <path d="M0 168 L30 120 L52 140 L80 96 L118 168Z" fill="#eaf7ff"/><path d="M80 96 L118 168 L92 168Z" fill="#c3e4f5"/>
    <path d="M110 168 L146 126 L176 150 L200 136 V168Z" fill="#f4fbff"/>
    <rect y="166" width="200" height="40" fill="#3d7fb0" opacity=".85"/>
    <path d="M0 196 Q100 180 200 196 V280 H0Z" fill="#f4fbff"/>
    <path d="M0 230 Q100 214 200 232 V280 H0Z" fill="#dcefff"/>
    ${[[74, 210, 1], [124, 222, .82]].map(([x, y, s]) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="0" cy="0" rx="20" ry="30" fill="#1d2433"/><ellipse cx="0" cy="6" rx="13" ry="22" fill="#fff"/>
      <circle cx="0" cy="-28" r="14" fill="#1d2433"/><circle cx="-5" cy="-30" r="4" fill="#fff"/><circle cx="5" cy="-30" r="4" fill="#fff"/>
      <circle cx="-5" cy="-30" r="1.8" fill="#1d2433"/><circle cx="5" cy="-30" r="1.8" fill="#1d2433"/>
      <path d="M-4 -24 L0 -18 L4 -24Z" fill="#ff9f1c"/>
      <path d="M-19 -6 q-12 14 -6 24 q4 -10 8 -14z M19 -6 q12 14 6 24 q-4 -10 -8 -14z" fill="#1d2433"/>
      <ellipse cx="-7" cy="30" rx="7" ry="3" fill="#ff9f1c"/><ellipse cx="7" cy="30" rx="7" ry="3" fill="#ff9f1c"/>
    </g>`).join('')}`,

  cabildo: () => `
    <g transform="translate(160 54)">
      <circle r="16" fill="#ffd166"/>
      ${Array.from({ length: 16 }, (_, i) => `<path d="M0 -20 L3 -30 L-3 -30Z" fill="#ffd166" transform="rotate(${i * 22.5})"/>`).join('')}
      <circle cx="-5" cy="-3" r="1.6" fill="#a86b00"/><circle cx="5" cy="-3" r="1.6" fill="#a86b00"/><path d="M-5 5 q5 4 10 0" stroke="#a86b00" stroke-width="1.5" fill="none"/>
    </g>
    ${cloud(40, 54, 1)}
    <rect x="88" y="78" width="24" height="40" fill="#fbf6ea"/><path d="M84 80 L100 58 L116 80Z" fill="#d9c9a8"/><rect x="96" y="86" width="8" height="12" rx="4" fill="#b9a988"/>
    <rect x="16" y="116" width="168" height="80" fill="#fbf6ea"/>
    <rect x="16" y="112" width="168" height="8" fill="#d9c9a8"/>
    <rect x="16" y="154" width="168" height="5" fill="#e8dcc4"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${24 + i * 23} 152 v-20 a8 8 0 0 1 16 0 v20z" fill="#c9b89a"/><path d="M${24 + i * 23} 196 v-26 a8 8 0 0 1 16 0 v26z" fill="#9c8a6b"/>`).join('')}
    <path d="M0 196 H200 V280 H0Z" fill="#d8c3a0"/>
    <path d="M0 214 H200" stroke="#c4ad87" stroke-width="2"/>
    <g transform="translate(46 232)"><path d="M-14 0 a14 10 0 0 1 28 0z" fill="#2b2140"/><line x1="0" y1="0" x2="0" y2="16" stroke="#2b2140" stroke-width="2"/></g>
    <g transform="translate(150 240)"><path d="M-14 0 a14 10 0 0 1 28 0z" fill="#4a3f6b"/><line x1="0" y1="0" x2="0" y2="16" stroke="#4a3f6b" stroke-width="2"/></g>
    <g transform="translate(100 236)"><path d="M0 0 q-10 6 -6 18 M0 0 q10 6 6 18" stroke="#75aadb" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M0 0 q-10 6 -6 18" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><circle r="5" fill="#75aadb"/><circle r="2.4" fill="#fff"/></g>`,

  casona: () => `
    ${stars(30, 9, [0, 0, 200, 140])}
    <circle cx="140" cy="70" r="34" fill="#f5ecd0"/><circle cx="130" cy="62" r="6" fill="#e6dab8"/><circle cx="150" cy="82" r="4" fill="#e6dab8"/>
    <g fill="#1a1024"><path d="M40 60 q4 -4 8 0 q4 -4 8 0 q-4 1 -8 5 q-4 -4 -8 -5z"/><path d="M164 120 q3 -3 6 0 q3 -3 6 0 q-3 1 -6 4 q-3 -3 -6 -4z"/></g>
    <path d="M18 250 V150 L50 120 L82 150 V250Z" fill="#241634"/>
    <path d="M70 250 V130 L108 96 L146 130 V250Z" fill="#1d1129"/>
    <rect x="126" y="100" width="10" height="26" fill="#1d1129"/>
    <rect x="92" y="140" width="14" height="20" fill="#ffcc4d"/><rect x="112" y="140" width="14" height="20" fill="#3a2650"/>
    <rect x="92" y="176" width="14" height="20" fill="#3a2650"/><rect x="112" y="176" width="14" height="20" fill="#3a2650"/>
    <rect x="36" y="160" width="12" height="16" fill="#3a2650"/>
    <path d="M96 160 v-8 a3 3 0 0 1 6 0 v8z" fill="#1d1129"/>
    <path d="M100 250 v-22 a8 8 0 0 1 16 0 v22z" fill="#0f0818"/>
    <path d="M170 250 V176 M170 200 l-14 -14 M170 192 l12 -16 M170 214 l16 -10" stroke="#120a1c" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M0 244 Q100 232 200 246 V280 H0Z" fill="#120a1c"/>`,

  llave: () => `
    <g opacity=".35" fill="#fff" font-family="monospace" font-size="14" font-weight="700">
      <text x="14" y="40">A→D</text><text x="140" y="34">B→E</text><text x="24" y="250">X</text><text x="160" y="262">Q</text><text x="150" y="210">R</text>
    </g>
    <g transform="translate(100 182)">
      <rect x="-62" y="10" width="124" height="22" rx="3" fill="#7a3e2b"/><rect x="-58" y="13" width="116" height="16" fill="#f3e6c8"/>
      <rect x="-56" y="-14" width="112" height="22" rx="3" fill="#2f5d62"/><rect x="-52" y="-11" width="104" height="16" fill="#efe1c0"/>
      <rect x="-60" y="-38" width="120" height="22" rx="3" fill="#8c2f39"/><rect x="-56" y="-35" width="112" height="16" fill="#f6ead0"/>
      <path d="M-60 -38 h8 v22 h-8z M-62 10 h8 v22 h-8z" fill="#d4a54a"/>
    </g>
    <g transform="translate(100 104) rotate(-24)">
      <circle cx="-44" cy="0" r="22" fill="none" stroke="#e8b84a" stroke-width="9"/>
      <circle cx="-44" cy="0" r="8" fill="none" stroke="#e8b84a" stroke-width="4"/>
      <rect x="-22" y="-5" width="80" height="10" rx="3" fill="#e8b84a"/>
      <path d="M40 5 v14 h8 v-8 h6 v12 h6 v-18z" fill="#e8b84a"/>
      <rect x="-22" y="-5" width="80" height="3" fill="#fff3c4" opacity=".7"/>
    </g>`,

  robot: (id) => `
    <defs><radialGradient id="${id}g"><stop offset="0" stop-color="#7ff6ff" stop-opacity=".7"/><stop offset="1" stop-color="#7ff6ff" stop-opacity="0"/></radialGradient></defs>
    <g stroke="#7ff6ff" stroke-opacity=".5" stroke-width="2" fill="none">
      <path d="M0 60 H40 L60 80 H70"/><path d="M200 70 H160 L146 90"/><path d="M0 210 H30 L50 190 H62"/><path d="M200 220 H170 L150 200 H140"/><path d="M100 40 V10"/><path d="M60 250 L80 230"/>
    </g>
    <g fill="#7ff6ff"><circle cx="70" cy="80" r="3"/><circle cx="146" cy="90" r="3"/><circle cx="62" cy="190" r="3"/><circle cx="140" cy="200" r="3"/><circle cx="100" cy="10" r="3"/><circle cx="80" cy="230" r="3"/></g>
    <circle cx="100" cy="140" r="80" fill="url(#${id}g)"/>
    <rect x="52" y="86" width="96" height="84" rx="26" fill="#e9f6f7"/>
    <rect x="62" y="98" width="76" height="58" rx="18" fill="#10283a"/>
    <ellipse cx="84" cy="124" rx="8" ry="10" fill="#7ff6ff"/><ellipse cx="116" cy="124" rx="8" ry="10" fill="#7ff6ff"/>
    <path d="M86 142 q14 8 28 0" stroke="#7ff6ff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <line x1="100" y1="86" x2="100" y2="66" stroke="#e9f6f7" stroke-width="4"/><circle cx="100" cy="62" r="7" fill="#ff8fa3"/>
    <rect x="40" y="114" width="12" height="28" rx="6" fill="#bfe3e6"/><rect x="148" y="114" width="12" height="28" rx="6" fill="#bfe3e6"/>
    <path d="M72 170 h56 l10 40 h-76z" fill="#bfe3e6"/><circle cx="100" cy="190" r="7" fill="#7ff6ff"/>`,

  faro: () => `
    <circle cx="60" cy="150" r="40" fill="#ffd27a" opacity=".9"/>
    <path d="M116 66 L200 30 L200 100Z" fill="#fff7c9" opacity=".45"/><path d="M104 66 L0 36 L0 96Z" fill="#fff7c9" opacity=".25"/>
    ${bird(40, 60, 1.2)}${bird(62, 76, .9)}${bird(160, 140, 1)}
    <path d="M90 200 L96 76 H124 L130 200Z" fill="#fff"/>
    <path d="M93 140 H127 L128 162 H92Z M95 98 H125 L126 118 H94Z M91 180 H129 L130 200 H90Z" fill="#e2483d"/>
    <rect x="92" y="70" width="36" height="8" fill="#2b2140"/>
    <rect x="98" y="52" width="24" height="18" fill="#fff3a6"/><path d="M96 52 L110 38 L124 52Z" fill="#e2483d"/>
    <path d="M60 208 Q80 190 110 196 T170 206 L180 230 H50Z" fill="#4a3b47"/>
    <path d="M0 226 Q25 218 50 226 T100 226 T150 226 T200 226 V280 H0Z" fill="#2a4d69"/>
    <path d="M0 246 Q25 238 50 246 T100 246 T150 246 T200 246 V280 H0Z" fill="#1d3a52"/>
    <path d="M10 232 q10 -6 20 0 M120 236 q10 -6 20 0 M150 252 q10 -6 20 0" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round"/>`,

  bosque: () => `
    <circle cx="150" cy="64" r="22" fill="#fff3b0"/>
    ${cloud(50, 50, 1)}
    ${[[30, 230, 1.1, '#2e7d4f'], [90, 236, 1.4, '#256b43'], [150, 228, 1.2, '#2e7d4f'], [190, 240, .9, '#1f5c3a'], [60, 250, .9, '#3a9a60'], [126, 252, 1, '#3a9a60']].map(([x, y, s, c]) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-6" width="8" height="18" fill="#6b4226"/><path d="M0 -80 L26 -30 H14 L32 -4 H-32 L-14 -30 H-26Z" fill="${c}"/></g>`).join('')}
    <path d="M0 254 Q100 244 200 256 V280 H0Z" fill="#4c8c3f"/>
    <g transform="translate(108 262)"><rect x="-3" y="-8" width="6" height="10" fill="#fff4e0"/><path d="M-11 -8 a11 9 0 0 1 22 0z" fill="#e2483d"/><circle cx="-4" cy="-12" r="1.6" fill="#fff"/><circle cx="4" cy="-11" r="1.4" fill="#fff"/></g>`,

  castillo: () => `
    ${cloud(40, 60, 1.1)}${cloud(150, 44, .9, .75)}
    <path d="M0 230 Q100 180 200 230 V280 H0Z" fill="#7fc97f"/>
    <rect x="58" y="120" width="84" height="94" fill="#e9e3f5"/>
    ${[58, 74, 90, 106, 122].map((x) => `<rect x="${x}" y="112" width="10" height="10" fill="#e9e3f5"/>`).join('')}
    <rect x="40" y="96" width="28" height="118" fill="#d8d0ec"/><path d="M36 98 L54 64 L72 98Z" fill="#7b5ea7"/>
    <rect x="132" y="96" width="28" height="118" fill="#d8d0ec"/><path d="M128 98 L146 64 L164 98Z" fill="#7b5ea7"/>
    <line x1="54" y1="64" x2="54" y2="46" stroke="#2b2140" stroke-width="2"/><path d="M54 46 h14 l-4 5 l4 5 h-14z" fill="#ff6b81"/>
    <line x1="146" y1="64" x2="146" y2="46" stroke="#2b2140" stroke-width="2"/><path d="M146 46 h14 l-4 5 l4 5 h-14z" fill="#ffd166"/>
    <path d="M86 214 v-30 a14 14 0 0 1 28 0 v30z" fill="#7b5ea7"/>
    <rect x="49" y="120" width="10" height="16" rx="5" fill="#7b5ea7"/><rect x="141" y="120" width="10" height="16" rx="5" fill="#7b5ea7"/>
    <rect x="94" y="140" width="12" height="18" rx="6" fill="#7b5ea7"/>
    <path d="M90 214 L80 280 H120 L110 214Z" fill="#e6d3a3"/>`,

  montanas: () => `
    <circle cx="148" cy="70" r="20" fill="#fff6c2"/>
    ${bird(50, 60, 1.2, '#fff')}${bird(70, 72, .8, '#fff')}
    <path d="M-10 210 L50 100 L90 160 L130 80 L210 210Z" fill="#5a5f8f"/>
    <path d="M50 100 L66 130 L56 124 L46 134 L38 122Z M130 80 L150 114 L138 108 L128 118 L116 106Z" fill="#fff"/>
    <path d="M-10 230 L40 160 L80 200 L120 150 L170 200 L210 170 V240 H-10Z" fill="#3e4372"/>
    <path d="M0 230 H200 V280 H0Z" fill="#6ec3d6"/>
    <path d="M20 244 h40 M110 254 h50 M70 266 h30" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>`,

  oceano: () => `
    <circle cx="60" cy="56" r="20" fill="#fff6c2"/>
    ${cloud(150, 50, 1)}
    <path d="M0 120 Q25 110 50 120 T100 120 T150 120 T200 120 V280 H0Z" fill="#3aa0d8"/>
    <g transform="translate(130 112)"><path d="M0 0 q-8 -22 -26 -26 q12 14 14 28z M0 0 q8 -22 26 -26 q-12 14 -14 28z" fill="#24557a"/></g>
    <path d="M0 160 Q25 150 50 160 T100 160 T150 160 T200 160 V280 H0Z" fill="#2584c2"/>
    <path d="M0 210 Q25 200 50 210 T100 210 T150 210 T200 210 V280 H0Z" fill="#1d6aa3"/>
    <g transform="translate(60 192)"><ellipse rx="14" ry="8" fill="#ffb347"/><path d="M12 0 l10 -8 v16z" fill="#ffb347"/><circle cx="-7" cy="-2" r="2" fill="#2b2140"/></g>
    <g transform="translate(140 240) scale(-1 1)"><ellipse rx="12" ry="7" fill="#ff6b81"/><path d="M10 0 l9 -7 v14z" fill="#ff6b81"/><circle cx="-6" cy="-2" r="1.8" fill="#2b2140"/></g>
    <g fill="#fff" fill-opacity=".3" stroke="#fff" stroke-opacity=".7"><circle cx="40" cy="176" r="3"/><circle cx="46" cy="168" r="2"/><circle cx="160" cy="226" r="3"/></g>`,

  escuela: () => `
    ${cloud(40, 54, 1)}${cloud(160, 70, .8, .7)}
    <path d="M0 236 H200 V280 H0Z" fill="#7fc97f"/>
    <rect x="30" y="120" width="140" height="116" fill="#fff4e0"/>
    <path d="M20 124 L100 76 L180 124Z" fill="#e2483d"/>
    <rect x="96" y="40" width="3" height="40" fill="#5c5470"/><path d="M99 40 h26 v6 h-26z" fill="#75aadb"/><path d="M99 46 h26 v6 h-26z" fill="#fff"/><path d="M99 52 h26 v6 h-26z" fill="#75aadb"/>
    <circle cx="100" cy="104" r="10" fill="#fff" stroke="#5c5470" stroke-width="2"/><path d="M100 98 v6 h5" stroke="#5c5470" stroke-width="2" fill="none"/>
    ${[44, 74, 112, 142].map((x) => `<rect x="${x}" y="136" width="16" height="18" fill="#9ad3f0" stroke="#fff" stroke-width="2"/><rect x="${x}" y="170" width="16" height="18" fill="#9ad3f0" stroke="#fff" stroke-width="2"/>`).join('')}
    <path d="M88 236 v-36 h24 v36z" fill="#7a4a24"/>
    <g transform="translate(184 236)"><rect x="-4" y="-40" width="8" height="40" fill="#6b4226"/><circle cx="0" cy="-50" r="18" fill="#3f9a5b"/></g>`,

  barco: () => `
    ${cloud(40, 60, 1.2, .8)}${cloud(160, 44, 1, .6)}
    <g transform="translate(100 186)">
      <path d="M2 -6 V-128 L64 -18Z" fill="#fff"/><path d="M-4 -12 V-108 L-52 -16Z" fill="#f4f1ff"/>
      <line x1="0" y1="-132" x2="0" y2="0" stroke="#5c5470" stroke-width="3"/>
      <path d="M0 -132 h14 l-4 4 l4 4 h-14z" fill="#ff6b6b"/>
      <path d="M-66 -2 H70 L54 22 H-52Z" fill="#e2483d"/><path d="M-60 6 H64" stroke="#fff" stroke-width="3"/>
    </g>
    <path d="M0 206 Q25 196 50 206 T100 206 T150 206 T200 206 V280 H0Z" fill="#2d7fb8"/>
    <path d="M0 226 Q25 216 50 226 T100 226 T150 226 T200 226 V280 H0Z" fill="#1d5f91"/>
    <path d="M14 214 q10 -6 20 0 M130 232 q10 -6 20 0 M80 250 q10 -6 20 0" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${bird(150, 90, 1, '#fff')}${bird(166, 102, .8, '#fff')}`,

  ciudad: () => `
    ${stars(24, 13, [0, 0, 200, 100])}
    <circle cx="150" cy="56" r="16" fill="#fff4c9"/>
    ${[[0, 150, 30], [26, 110, 34], [56, 170, 26], [80, 96, 30], [108, 140, 28], [134, 120, 34], [166, 160, 34]].map(([x, h, w], i) =>
    `<rect x="${x}" y="${250 - h}" width="${w}" height="${h}" fill="${i % 2 ? '#2a2550' : '#352f63'}"/>` +
    Array.from({ length: Math.floor(h / 22) }, (_, r) => `<rect x="${x + 6}" y="${256 - h + r * 22}" width="6" height="8" fill="${(r + i) % 3 ? '#ffd36e' : '#4a4380'}"/><rect x="${x + w - 12}" y="${256 - h + r * 22}" width="6" height="8" fill="${(r + i) % 2 ? '#4a4380' : '#ffd36e'}"/>`).join('')).join('')}
    <path d="M0 250 H200 V280 H0Z" fill="#1a1636"/>`,

  isla: () => `
    <circle cx="150" cy="70" r="24" fill="#ffe8a3"/>
    ${cloud(50, 60, 1)}${bird(110, 50, 1)}${bird(124, 60, .8)}
    <path d="M30 196 Q60 140 110 150 Q150 158 172 196Z" fill="#9c8a6b"/>
    <path d="M44 196 Q70 156 108 162 Q140 168 160 196Z" fill="#8bb174"/>
    <path d="M120 158 v-30 h10 v30z" fill="#fff"/><path d="M118 128 h14 l-7 -10z" fill="#e2483d"/>
    <path d="M0 190 Q25 182 50 190 T100 190 T150 190 T200 190 V280 H0Z" fill="#3e8fc2"/>
    <path d="M0 220 Q25 212 50 220 T100 220 T150 220 T200 220 V280 H0Z" fill="#2b6f9e"/>
    <path d="M20 204 q10 -6 20 0 M150 236 q10 -6 20 0" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>`
};

export const SCENE_NAMES = {
  dragon: 'Dragón', luna: 'Noche de luna', huerta: 'Huerta y girasol', tortuga: 'Tortuga marina', reloj: 'Torre del reloj',
  cohete: 'Cohete y Marte', pinguino: 'Antártida', cabildo: 'Cabildo', casona: 'Casona misteriosa', llave: 'Llave y libros',
  robot: 'Robot', faro: 'Faro', bosque: 'Bosque', castillo: 'Castillo', montanas: 'Montañas', oceano: 'Océano',
  escuela: 'Escuela', barco: 'Velero', ciudad: 'Ciudad de noche', isla: 'Isla'
};

/** SVG completo de una escena con fondo degradado. */
export function sceneSVG(scene, c1 = '#7b5ea7', c2 = '#2b2f77', { className = '', crop = false } = {}) {
  const id = uid();
  const draw = SCENES[scene] || SCENES.bosque;
  return `<svg class="${className}" viewBox="0 0 200 280" preserveAspectRatio="${crop ? 'xMidYMid slice' : 'xMidYMid meet'}" aria-hidden="true" focusable="false">
    <defs><linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <rect width="200" height="280" fill="url(#${id}bg)"/>${draw(id)}</svg>`;
}

/** Portada ilustrada de un libro. */
export function coverHTML(book, { size = 'md' } = {}) {
  const c = book.cover || {};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  return `<div class="cover cover--s${book.section} cover--${size}" style="--c1:${c.c1};--c2:${c.c2}">
    ${sceneSVG(c.scene, c.c1, c.c2, { className: 'cover__art', crop: true })}
    <div class="cover__shade"></div>
    <div class="cover__text">
      <span class="cover__title">${esc(book.title)}</span>
      <span class="cover__author">${esc(String(book.author || '').replace(/\s*\(adaptaci[oó]n[^)]*\)/i, ''))}</span>
    </div>
    <div class="cover__spine"></div>
  </div>`;
}

/* ------------------------------- Avatares ------------------------------- */
const AVATARS = {
  zorro: { bg: '#ffe1cc', svg: `<path d="M14 18 L24 40 L8 40Z M50 18 L40 40 L56 40Z" fill="#e8702d"/><path d="M12 30 Q32 8 52 30 Q54 50 32 56 Q10 50 12 30Z" fill="#ff8c42"/><path d="M18 40 Q32 62 46 40 Q40 50 32 50 Q24 50 18 40Z" fill="#fff"/><circle cx="24" cy="34" r="3" fill="#2b2140"/><circle cx="40" cy="34" r="3" fill="#2b2140"/><circle cx="32" cy="46" r="3" fill="#2b2140"/>` },
  buho: { bg: '#e8dcff', svg: `<path d="M14 16 L22 26 M50 16 L42 26" stroke="#7a4a24" stroke-width="5" stroke-linecap="round"/><ellipse cx="32" cy="36" rx="20" ry="20" fill="#9c6b45"/><circle cx="24" cy="32" r="8" fill="#fff"/><circle cx="40" cy="32" r="8" fill="#fff"/><circle cx="24" cy="32" r="4" fill="#2b2140"/><circle cx="40" cy="32" r="4" fill="#2b2140"/><path d="M29 40 L32 46 L35 40Z" fill="#ffb000"/><path d="M20 48 q12 6 24 0" stroke="#c99a72" stroke-width="2" fill="none"/>` },
  gato: { bg: '#dff3ff', svg: `<path d="M14 14 L22 30 L10 32Z M50 14 L42 30 L54 32Z" fill="#8a90a8"/><ellipse cx="32" cy="38" rx="21" ry="18" fill="#a5abc3"/><circle cx="24" cy="36" r="3" fill="#2b2140"/><circle cx="40" cy="36" r="3" fill="#2b2140"/><path d="M30 42 h4 l-2 2z" fill="#ff8fa3"/><path d="M10 42 h12 M10 46 h12 M42 42 h12 M42 46 h12" stroke="#6b7088" stroke-width="1.4"/>` },
  oso: { bg: '#ffeccc', svg: `<circle cx="16" cy="18" r="8" fill="#8b5a3c"/><circle cx="48" cy="18" r="8" fill="#8b5a3c"/><circle cx="32" cy="36" r="21" fill="#a8724c"/><ellipse cx="32" cy="44" rx="10" ry="8" fill="#e8c4a0"/><circle cx="24" cy="32" r="3" fill="#2b2140"/><circle cx="40" cy="32" r="3" fill="#2b2140"/><ellipse cx="32" cy="41" rx="4" ry="3" fill="#2b2140"/>` },
  conejo: { bg: '#ffe3ee', svg: `<ellipse cx="22" cy="14" rx="6" ry="16" fill="#fff"/><ellipse cx="42" cy="14" rx="6" ry="16" fill="#fff"/><ellipse cx="22" cy="14" rx="3" ry="11" fill="#ffb3c8"/><ellipse cx="42" cy="14" rx="3" ry="11" fill="#ffb3c8"/><circle cx="32" cy="40" r="19" fill="#fff"/><circle cx="25" cy="38" r="3" fill="#2b2140"/><circle cx="39" cy="38" r="3" fill="#2b2140"/><path d="M30 44 h4 l-2 3z" fill="#ff8fa3"/><circle cx="20" cy="46" r="3" fill="#ffd0dc"/><circle cx="44" cy="46" r="3" fill="#ffd0dc"/>` },
  pinguino: { bg: '#d9f2ff', svg: `<ellipse cx="32" cy="36" rx="22" ry="22" fill="#1d2433"/><ellipse cx="32" cy="40" rx="15" ry="16" fill="#fff"/><circle cx="26" cy="34" r="3" fill="#1d2433"/><circle cx="38" cy="34" r="3" fill="#1d2433"/><path d="M28 40 L32 46 L36 40Z" fill="#ff9f1c"/>` },
  leon: { bg: '#fff3c4', svg: `<circle cx="32" cy="34" r="25" fill="#e08a1e"/><circle cx="32" cy="36" r="17" fill="#ffc14d"/><circle cx="26" cy="32" r="2.6" fill="#2b2140"/><circle cx="38" cy="32" r="2.6" fill="#2b2140"/><path d="M29 40 h6 l-3 3z" fill="#7a4a24"/><path d="M26 46 q6 4 12 0" stroke="#7a4a24" stroke-width="2" fill="none"/>` },
  rana: { bg: '#dcf8d8', svg: `<circle cx="20" cy="22" r="9" fill="#5cc26a"/><circle cx="44" cy="22" r="9" fill="#5cc26a"/><ellipse cx="32" cy="40" rx="24" ry="17" fill="#5cc26a"/><circle cx="20" cy="22" r="5" fill="#fff"/><circle cx="44" cy="22" r="5" fill="#fff"/><circle cx="20" cy="22" r="2.6" fill="#2b2140"/><circle cx="44" cy="22" r="2.6" fill="#2b2140"/><path d="M20 44 q12 8 24 0" stroke="#2b6a35" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="16" cy="40" r="3" fill="#ff9db0" opacity=".7"/><circle cx="48" cy="40" r="3" fill="#ff9db0" opacity=".7"/>` }
};
export const AVATAR_NAMES = { zorro: 'Zorro', buho: 'Búho', gato: 'Gato', oso: 'Oso', conejo: 'Conejo', pinguino: 'Pingüino', leon: 'León', rana: 'Rana' };

export function avatarSVG(name, size = 40) {
  const a = AVATARS[name] || AVATARS.zorro;
  return `<svg class="avatar" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="${a.bg}"/>${a.svg}</svg>`;
}

/* -------------------------------- Íconos -------------------------------- */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  search: '<circle cx="11" cy="11" r="7.5"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  library: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="16" y2="7"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  left: '<polyline points="15 18 9 12 15 6"/>',
  right: '<polyline points="9 18 15 12 9 6"/>',
  back: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r=".6"/><circle cx="3.5" cy="12" r=".6"/><circle cx="3.5" cy="18" r=".6"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  trending: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  crown: '<path d="M3 18h18l-2-11-5 5-2-7-2 7-5-5z"/><line x1="3" y1="21" x2="21" y2="21"/>',
  map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  flame: '<path d="M12 22c4.4 0 7-3 7-7 0-4.5-3.5-7-4.5-11-2 1.5-3 3.5-3 6-1.2-1-2-2.5-2-4C6.5 8 5 11 5 15c0 4 2.6 7 7 7z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  edit: '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  restart: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="M11.5 11.5 21 2m-4 4 3 3m-6 0 2 2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  up: '<polyline points="18 15 12 9 6 15"/>',
  down: '<polyline points="6 9 12 15 18 9"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  sparkle: '<path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>',
  maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>'
};

export function icon(name, { size = 20, className = '' } = {}) {
  return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.star}</svg>`;
}

export const LOGO = `<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb36b"/><stop offset="1" stop-color="#ff6f91"/></linearGradient><linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b6cff"/><stop offset="1" stop-color="#4a3fd1"/></linearGradient></defs><rect x="2" y="2" width="44" height="44" rx="14" fill="url(#lg2)"/><path d="M10 15c5-2 9-1 13 2v19c-4-3-8-4-13-2z" fill="#fff"/><path d="M38 15c-5-2-9-1-13 2v19c4-3 8-4 13-2z" fill="#fff" opacity=".85"/><circle cx="35" cy="11" r="5" fill="url(#lg1)"/></svg>`;
