/* PENALTY LEGENDS — game content: characters, keepers, teams, stadiums, items, competitions, challenges, career */
(function (G) {
  'use strict';
  const PL = G.PL;
  const U = PL.U;
  const D = (PL.Data = {});

  const SKIN = ['#f3cfb0', '#e3b088', '#c98d60', '#a06a43', '#734a2c', '#4c2f1d'];
  D.SKIN = SKIN;
  D.HAIR_STYLES = ['short', 'buzz', 'long', 'afro', 'mohawk', 'bald', 'ponytail', 'curly', 'bun'];
  D.HAIR_NAMES = { short: 'Corto', buzz: 'Rapado', long: 'Largo', afro: 'Afro', mohawk: 'Cresta', bald: 'Calvo', ponytail: 'Coleta', curly: 'Rizado', bun: 'Moño' };
  D.HAIR_COLORS = ['#1b1410', '#3a2414', '#6b4423', '#a8743a', '#d8b260', '#e6e0d0', '#8c2f1c', '#2c2c3a'];

  D.NATIONS = ['Argentina', 'Brasil', 'Uruguay', 'México', 'Colombia', 'Chile', 'España', 'Francia', 'Italia', 'Portugal', 'Alemania', 'Países Bajos', 'Suecia', 'Croacia', 'Nigeria', 'Ghana', 'Senegal', 'Japón', 'Corea', 'Marruecos'];
  D.FLAGS = {
    'Argentina': ['#74acdf', '#ffffff', '#74acdf'], 'Brasil': ['#1f9c3a', '#f5d100', '#1f9c3a'], 'Uruguay': ['#ffffff', '#4b8fd4', '#ffffff'],
    'México': ['#16784a', '#ffffff', '#c8202f'], 'Colombia': ['#f7d116', '#1a3d8f', '#c8202f'], 'Chile': ['#ffffff', '#ffffff', '#d52b1e'],
    'España': ['#c60b1e', '#ffc400', '#c60b1e'], 'Francia': ['#1e3a8a', '#ffffff', '#d52b1e'], 'Italia': ['#1b8a4a', '#ffffff', '#cd212a'],
    'Portugal': ['#046a38', '#da291c', '#da291c'], 'Alemania': ['#111111', '#dd0000', '#ffce00'], 'Países Bajos': ['#ae1c28', '#ffffff', '#21468b'],
    'Suecia': ['#006aa7', '#fecc00', '#006aa7'], 'Croacia': ['#d52b1e', '#ffffff', '#1a3d8f'], 'Nigeria': ['#008751', '#ffffff', '#008751'],
    'Ghana': ['#ce1126', '#fcd116', '#006b3f'], 'Senegal': ['#00853f', '#fdef42', '#e31b23'], 'Japón': ['#ffffff', '#bc002d', '#ffffff'],
    'Corea': ['#ffffff', '#c60c30', '#003478'], 'Marruecos': ['#c1272d', '#006233', '#c1272d'],
  };

  const FIRST = ['Mateo', 'Joaquín', 'Lucas', 'Iván', 'Bruno', 'Thiago', 'Nico', 'Emilio', 'Santi', 'Marco', 'Leo', 'Dani', 'Hugo', 'Ömer', 'Kofi', 'Amadou', 'Yuto', 'Min-jun', 'Lars', 'Pieter', 'Ezequiel', 'Facundo', 'Rui', 'Tiago', 'Andrés', 'Felipe', 'Gael', 'Íker', 'Omar', 'Samuel', 'Jonas', 'Elías'];
  const LAST = ['Varela', 'Correa', 'Benítez', 'Medina', 'Paredes', 'Acosta', 'Rivas', 'Ortega', 'Castro', 'Navarro', 'Duarte', 'Ibarra', 'Molina', 'Herrera', 'Lozano', 'Mendes', 'Okoro', 'Diallo', 'Tanaka', 'Park', 'Jansen', 'Kowal', 'Petrović', 'Saavedra', 'Quintero', 'Bianchi', 'Fontaine', 'Weber', 'Haddad', 'Nyarko', 'Sandoval', 'Aguirre'];

  D.ABILITIES = {
    rayo: { name: 'Rayo', desc: 'Los tiros potentes salen un 12% más rápido.' },
    colocador: { name: 'Guante de Seda', desc: 'Los tiros colocados tienen un 35% menos de error.' },
    comba: { name: 'Comba Maestra', desc: 'El efecto de sus tiros es un 45% más fuerte.' },
    engano: { name: 'Engaño', desc: 'Su carrera confunde al portero: se adelanta y se equivoca más a menudo.' },
    picadita: { name: 'Picadita', desc: 'Picadas más precisas; los porteros se tiran antes contra él.' },
    ojo: { name: 'Ojo de Halcón', desc: 'Durante la carrera ves hacia qué lado se inclina el portero.' },
    canon: { name: 'Cañón', desc: 'La sobrecarga de potencia apenas eleva el balón.' },
    hielo: { name: 'Sangre de Hielo', desc: 'La presión no afecta su punto de mira.' },
    maestro: { name: 'Metrónomo', desc: 'Su ventana de golpeo perfecto es un 50% más amplia.' },
    mago: { name: 'El Mago', desc: 'Efecto +25%, presión -50% y ventana de golpeo +25%.' },
    none: { name: 'Sin habilidad', desc: 'Todavía no descubrió su talento especial.' },
  };

  // Playable shooters. stats: pre(precision) pow(power) con(control) cur(curl) com(composure)
  D.SHOOTERS = [
    { id: 'ferreyra', name: 'Tomás Ferreyra', nick: 'El Rayo', nat: 'Argentina', num: 9, foot: 'R', stats: { pre: 60, pow: 70, con: 58, cur: 55, com: 55 }, ability: 'rayo', price: 0, celeb: 'jump',
      look: { skin: SKIN[1], hair: 'short', hairC: '#3a2414', beard: false, band: null, height: 1.0 } },
    { id: 'okafor', name: 'Chidi Okafor', nick: 'Seda', nat: 'Nigeria', num: 10, foot: 'R', stats: { pre: 66, pow: 60, con: 62, cur: 56, com: 58 }, ability: 'colocador', price: 0, celeb: 'airplane',
      look: { skin: SKIN[5], hair: 'buzz', hairC: '#1b1410', beard: false, band: null, height: 1.02 } },
    { id: 'valdes', name: 'Rafa Valdés', nick: 'Picante', nat: 'México', num: 11, foot: 'L', stats: { pre: 68, pow: 58, con: 72, cur: 64, com: 62 }, ability: 'picadita', price: 1800, celeb: 'slide',
      look: { skin: SKIN[2], hair: 'mohawk', hairC: '#1b1410', beard: true, band: null, height: 0.97 } },
    { id: 'sato', name: 'Kenji Sato', nick: 'Kaze', nat: 'Japón', num: 8, foot: 'R', stats: { pre: 72, pow: 56, con: 70, cur: 76, com: 62 }, ability: 'comba', price: 2200, celeb: 'point',
      look: { skin: SKIN[0], hair: 'short', hairC: '#111118', beard: false, band: '#e23a3a', height: 0.96 } },
    { id: 'moreau', name: 'Lucas Moreau', nick: 'Le Renard', nat: 'Francia', num: 7, foot: 'R', stats: { pre: 70, pow: 72, con: 66, cur: 60, com: 70 }, ability: 'engano', price: 2800, celeb: 'airplane',
      look: { skin: SKIN[3], hair: 'curly', hairC: '#2a1a10', beard: true, band: null, height: 1.03 } },
    { id: 'lindqvist', name: 'Erik Lindqvist', nick: 'Martillo', nat: 'Suecia', num: 9, foot: 'L', stats: { pre: 62, pow: 88, con: 58, cur: 50, com: 72 }, ability: 'canon', price: 3400, celeb: 'jump',
      look: { skin: SKIN[0], hair: 'ponytail', hairC: '#e2c070', beard: true, band: null, height: 1.08 } },
    { id: 'silva', name: 'Bruno Silva', nick: 'Bruninho', nat: 'Brasil', num: 10, foot: 'R', stats: { pre: 78, pow: 66, con: 82, cur: 78, com: 66 }, ability: 'ojo', price: 4200, celeb: 'slide',
      look: { skin: SKIN[3], hair: 'afro', hairC: '#1b1410', beard: false, band: '#f5d100', height: 0.98 } },
    { id: 'mensah', name: 'Kwame Mensah', nick: 'El Faraón', nat: 'Ghana', num: 14, foot: 'R', stats: { pre: 74, pow: 76, con: 70, cur: 62, com: 86 }, ability: 'hielo', price: 4800, celeb: 'point',
      look: { skin: SKIN[4], hair: 'bald', hairC: '#1b1410', beard: true, band: null, height: 1.05 } },
    { id: 'rossi', name: 'Marco Rossi', nick: 'Il Maestro', nat: 'Italia', num: 21, foot: 'R', stats: { pre: 86, pow: 66, con: 80, cur: 72, com: 80 }, ability: 'maestro', price: 6500, celeb: 'point',
      look: { skin: SKIN[1], hair: 'bun', hairC: '#3a2414', beard: true, band: null, height: 1.0 } },
    { id: 'quiroga', name: 'Aurelio Quiroga', nick: 'El Mago', nat: 'Uruguay', num: 10, foot: 'L', stats: { pre: 90, pow: 84, con: 90, cur: 90, com: 92 }, ability: 'mago', price: 15000, celeb: 'airplane', reqLevel: 12,
      look: { skin: SKIN[2], hair: 'long', hairC: '#1b1410', beard: true, band: '#ffffff', height: 1.0 } },
  ];
  D.shooterById = (id) => D.SHOOTERS.find((s) => s.id === id);

  D.TIERS = [
    { id: 0, name: 'Entrenamiento', color: '#8fa3b8', range: [10, 20] },
    { id: 1, name: 'Principiante', color: '#6fcf5a', range: [26, 42] },
    { id: 2, name: 'Profesional', color: '#3fa7ff', range: [46, 62] },
    { id: 3, name: 'Experto', color: '#c66bff', range: [63, 79] },
    { id: 4, name: 'Legendario', color: '#ffbf2e', range: [82, 97] },
  ];
  D.STYLES = {
    balanced: { name: 'Equilibrado', guessP: 0.35, readW: 0.4, early: 0.25, center: 0.12 },
    guesser: { name: 'Adivinador', guessP: 0.7, readW: 0.2, early: 0.55, center: 0.06 },
    reactor: { name: 'Reactivo', guessP: 0.12, readW: 0.3, early: 0.1, center: 0.2 },
    reader: { name: 'Analista', guessP: 0.45, readW: 0.85, early: 0.2, center: 0.1 },
  };

  // Named AI keepers (shown in quick match / bosses)
  const K = (id, name, nat, tier, style, st, look, kit) => ({ id, name, nat, tier, style, stats: st, look, kit });
  D.KEEPERS = [
    K('gomez', 'Pablo Gómez', 'Argentina', 1, 'balanced', { ref: 34, ant: 30, reach: 38, agi: 36, han: 40, com: 32 }, { skin: SKIN[1], hair: 'short', hairC: '#3a2414', beard: false, height: 1.0 }, { p: '#2fbf71', s: '#0f3d26' }),
    K('etxeberri', 'Iker Etxeberri', 'España', 1, 'guesser', { ref: 30, ant: 38, reach: 42, agi: 40, han: 34, com: 26 }, { skin: SKIN[0], hair: 'long', hairC: '#6b4423', beard: true, height: 1.04 }, { p: '#f28c28', s: '#40210a' }),
    K('haddad', 'Sami Haddad', 'Marruecos', 1, 'reactor', { ref: 42, ant: 26, reach: 36, agi: 38, han: 38, com: 40 }, { skin: SKIN[3], hair: 'buzz', hairC: '#1b1410', beard: true, height: 0.98 }, { p: '#e8e030', s: '#3b3a0a' }),
    K('kovac', 'Dario Kovač', 'Croacia', 2, 'reader', { ref: 52, ant: 62, reach: 54, agi: 50, han: 56, com: 55 }, { skin: SKIN[0], hair: 'short', hairC: '#a8743a', beard: false, height: 1.06 }, { p: '#1d1d24', s: '#e23a3a' }),
    K('lima', 'Joãozinho Lima', 'Brasil', 2, 'guesser', { ref: 50, ant: 54, reach: 60, agi: 60, han: 48, com: 46 }, { skin: SKIN[4], hair: 'afro', hairC: '#1b1410', beard: false, height: 1.0 }, { p: '#ff5fa2', s: '#3a0a22' }),
    K('berg', 'Mats Berg', 'Suecia', 2, 'reactor', { ref: 60, ant: 48, reach: 56, agi: 54, han: 60, com: 58 }, { skin: SKIN[0], hair: 'bald', hairC: '#d8b260', beard: true, height: 1.09 }, { p: '#28c7d8', s: '#0a3238' }),
    K('adebayo', 'Yusuf Adebayo', 'Nigeria', 3, 'reactor', { ref: 78, ant: 64, reach: 72, agi: 74, han: 70, com: 70 }, { skin: SKIN[5], hair: 'short', hairC: '#1b1410', beard: true, height: 1.07 }, { p: '#8a5cff', s: '#1e1040' }),
    K('lenoir', 'Hugo Lenoir', 'Francia', 3, 'reader', { ref: 68, ant: 78, reach: 70, agi: 66, han: 74, com: 74 }, { skin: SKIN[1], hair: 'curly', hairC: '#3a2414', beard: false, height: 1.03 }, { p: '#ff7a1a', s: '#2a1100' }),
    K('novak', 'Aleks Novak', 'Croacia', 3, 'balanced', { ref: 72, ant: 70, reach: 76, agi: 72, han: 68, com: 66 }, { skin: SKIN[0], hair: 'ponytail', hairC: '#1b1410', beard: true, height: 1.1 }, { p: '#36e07a', s: '#0a2a14' }),
    K('strand', 'Viktor Strand', 'Países Bajos', 4, 'reader', { ref: 86, ant: 95, reach: 88, agi: 84, han: 90, com: 92 }, { skin: SKIN[0], hair: 'buzz', hairC: '#d8b260', beard: true, height: 1.12 }, { p: '#ffd23a', s: '#2a2000' }),
    K('oviedo', 'Santiago Oviedo', 'Colombia', 4, 'reactor', { ref: 96, ant: 82, reach: 90, agi: 94, han: 86, com: 86 }, { skin: SKIN[3], hair: 'long', hairC: '#1b1410', beard: false, height: 1.02 }, { p: '#111111', s: '#ff3b3b' }),
    K('mori', 'Kenta Mori', 'Japón', 4, 'balanced', { ref: 90, ant: 90, reach: 86, agi: 90, han: 92, com: 95 }, { skin: SKIN[0], hair: 'mohawk', hairC: '#111118', beard: false, height: 1.0 }, { p: '#e9e9f2', s: '#2a2a3a' }),
  ];
  D.KEEPER_NICK = { strand: 'El Muro', oviedo: 'La Pantera', mori: 'Sombra', adebayo: 'Pulpo', lenoir: 'El Profesor', kovac: 'Ajedrecista' };
  D.keeperById = (id) => D.KEEPERS.find((k) => k.id === id);

  function rollStats(r, tier, keys) {
    const [a, b] = D.TIERS[tier].range;
    const o = {};
    for (const k of keys) o[k] = Math.round(a + r() * (b - a));
    return o;
  }
  function rollLook(r) {
    const hairs = D.HAIR_STYLES;
    return {
      skin: SKIN[Math.floor(r() * SKIN.length)], hair: hairs[Math.floor(r() * hairs.length)],
      hairC: D.HAIR_COLORS[Math.floor(r() * 5)], beard: r() < 0.35, band: null, height: 0.94 + r() * 0.14,
    };
  }
  D.makeKeeper = function (seed, tier, nat, kit) {
    const r = U.rng(seed);
    const styles = Object.keys(D.STYLES);
    return {
      id: 'gk_' + seed, name: FIRST[Math.floor(r() * FIRST.length)] + ' ' + LAST[Math.floor(r() * LAST.length)], nat, tier,
      style: styles[Math.floor(r() * styles.length)], stats: rollStats(r, tier, ['ref', 'ant', 'reach', 'agi', 'han', 'com']),
      look: rollLook(r), kit: kit || { p: '#2fbf71', s: '#0f3d26' },
    };
  };
  D.makeShooter = function (seed, tier, nat) {
    const r = U.rng(seed);
    const st = rollStats(r, tier, ['pre', 'pow', 'con', 'cur', 'com']);
    return {
      id: 'sh_' + seed, name: FIRST[Math.floor(r() * FIRST.length)] + ' ' + LAST[Math.floor(r() * LAST.length)], nat, num: 2 + Math.floor(r() * 22),
      foot: r() < 0.75 ? 'R' : 'L', stats: st, ability: 'none', look: rollLook(r), ai: { cornerBias: 0.4 + r() * 0.5, favSide: r() < 0.5 ? -1 : 1, chipP: r() * 0.08 },
    };
  };

  // Teams
  const T = (id, name, short, p, s, pattern, nat, tier) => ({ id, name, short, kit: { p, s, pattern, shorts: s, socks: p }, nat, tier });
  D.CLUBS = [
    T('rap', 'Real Atlético Pampa', 'RAP', '#d8262e', '#ffffff', 'stripes', 'Argentina', 1),
    T('dco', 'Deportivo Cóndor', 'DCO', '#1b2f6b', '#f2c94c', 'solid', 'Chile', 1),
    T('ups', 'Unión Puerto Sur', 'UPS', '#2a8fd6', '#ffffff', 'hoops', 'Uruguay', 1),
    T('rdv', 'Racing del Valle', 'RDV', '#f2f2f2', '#2f6b3a', 'sash', 'Colombia', 1),
    T('spa', 'Sporting Altamira', 'SPA', '#1f8a4c', '#ffffff', 'hoops', 'España', 2),
    T('ers', 'Estrella Roja del Sur', 'ERS', '#b8121c', '#111111', 'halves', 'México', 2),
    T('atm', 'Atlético Mareas', 'ATM', '#0f6f8f', '#ffd166', 'stripes', 'Portugal', 2),
    T('maz', 'CF Montaña Azul', 'MAZ', '#2b4fd8', '#9fd3ff', 'solid', 'Francia', 2),
    T('oln', 'Olympia Norte', 'OLN', '#111111', '#ffffff', 'stripes', 'Alemania', 3),
    T('tor', 'FC Tormenta', 'TOR', '#5a2ca0', '#ffd23a', 'sash', 'Países Bajos', 3),
    T('jup', 'Juventud Plata', 'JUP', '#c0c6d0', '#1b2f6b', 'solid', 'Argentina', 3),
    T('hal', 'Club Halcones', 'HAL', '#ff7a1a', '#111111', 'chevron', 'Brasil', 3),
    T('cja', 'Ciudad Jardín', 'CJA', '#6fcf5a', '#14381a', 'stripes', 'Colombia', 2),
    T('ibr', 'Inter Brisas', 'IBR', '#26c6da', '#0b2d33', 'halves', 'Italia', 3),
    T('dfa', 'Dínamo Faro', 'DFA', '#ffe14d', '#1d1d24', 'hoops', 'Croacia', 1),
    T('rso', 'Rangers del Sol', 'RSO', '#ffb02e', '#7a1f1f', 'solid', 'Senegal', 2),
  ];
  D.NATION_TEAMS = D.NATIONS.slice(0, 16).map((n, i) => {
    const f = D.FLAGS[n];
    return { id: 'n_' + i, name: n, short: n.slice(0, 3).toUpperCase(), kit: { p: f[0], s: f[1] === f[0] ? '#111111' : f[1], pattern: i % 3 === 0 ? 'solid' : i % 3 === 1 ? 'sash' : 'chevron', shorts: f[2], socks: f[0] }, nat: n, tier: 2 + (i % 3 === 0 ? 1 : 0) };
  });
  D.LEGEND_TEAMS = [
    T('l1', 'Leyendas del Sur', 'LDS', '#74acdf', '#ffffff', 'stripes', 'Argentina', 4),
    T('l2', 'Gigantes Dorados', 'GDO', '#ffcf3a', '#1f6b3a', 'solid', 'Brasil', 4),
    T('l3', 'Inmortales FC', 'INM', '#ffffff', '#111111', 'chevron', 'Italia', 4),
    T('l4', 'Titanes del Norte', 'TDN', '#ff7a1a', '#111111', 'solid', 'Países Bajos', 4),
    T('l5', 'Dinastía Real', 'DIN', '#f2f2f2', '#c9a227', 'sash', 'España', 4),
    T('l6', 'Fénix Eterno', 'FEN', '#c8202f', '#ffd23a', 'halves', 'Ghana', 4),
    T('l7', 'Los Invictos', 'INV', '#1b2f6b', '#ffffff', 'hoops', 'Francia', 4),
    T('l8', 'Olimpo XI', 'OLX', '#5a2ca0', '#ffffff', 'stripes', 'Croacia', 4),
  ];
  // Fill team rosters (deterministic)
  D.buildTeam = function (base, tierOverride) {
    const tier = tierOverride || base.tier;
    const seed = U.hash(base.id + ':' + tier);
    const named = D.KEEPERS.filter((k) => k.tier === tier);
    let keeper;
    if (tier >= 3 && named.length && seed % 3 === 0) keeper = Object.assign({}, named[seed % named.length], { kit: { p: base.kit.s === '#ffffff' ? '#2fbf71' : base.kit.s, s: base.kit.p } });
    else keeper = D.makeKeeper(seed, tier, base.nat, { p: ['#2fbf71', '#f28c28', '#e8e030', '#28c7d8', '#ff5fa2', '#8a5cff'][seed % 6], s: '#14141c' });
    const shooters = [];
    for (let i = 0; i < 5; i++) shooters.push(D.makeShooter(seed + i * 977, tier, base.nat));
    return Object.assign({}, base, { tier, keeper, shooters });
  };
  D.allTeamBases = () => D.CLUBS.concat(D.NATION_TEAMS, D.LEGEND_TEAMS);
  D.teamById = (id) => D.allTeamBases().find((t) => t.id === id);

  // Stadiums
  D.STADIUMS = [
    { id: 'escuela', name: 'Campo Escuela La Cantera', short: 'La Cantera', desc: 'Campo de entrenamiento de barrio. Gradas de chapa, alambrado y árboles.', kind: 'school', time: 'day', capacity: 400, fill: 0.5, price: 0,
      grass: ['#4f9a3a', '#5aa944'], sky: ['#7ec8f2', '#cfeeff'], seats: '#8a97a6', stand: '#5c6670', boards: ['LA CANTERA', 'PANADERIA SOL', 'FERRETERIA'], grade: null, wind: [0, 1.5] },
    { id: 'municipal', name: 'Estadio Municipal El Fortín', short: 'El Fortín', desc: 'Estadio profesional de ciudad. Tarde soleada y una hinchada fiel.', kind: 'pro', time: 'afternoon', capacity: 18000, fill: 0.75, price: 0,
      grass: ['#3f8f34', '#4ca13f'], sky: ['#5ab0ea', '#bfe3fa'], seats: '#c43a3a', stand: '#7a5a52', boards: ['FORTIN', 'VOLTA DRINK', 'NEXO BANK', 'PIXEL TV'], grade: { r: 1.04, g: 1.0, b: 0.94, add: [6, 3, 0] }, wind: [0, 3] },
    { id: 'continental', name: 'Coliseo Continental', short: 'Coliseo', desc: 'Gran estadio internacional de dos anillos y techo, con pantallas gigantes.', kind: 'big', time: 'day', capacity: 85000, fill: 0.95, price: 3000,
      grass: ['#3a8a35', '#47a043'], sky: ['#4aa2e6', '#b4dcfa'], seats: '#2c5fd6', stand: '#3a4250', boards: ['CONTINENTAL', 'AERO+', 'KAIZEN AUTO', 'NOVA', 'GOLAZO'], grade: null, roof: true, tiers: 2, wind: [0, 2] },
    { id: 'luna', name: 'Estadio Luna Azul', short: 'Luna Azul', desc: 'Partido nocturno bajo los focos. Flashes en la grada y cielo estrellado.', kind: 'night', time: 'night', capacity: 45000, fill: 0.9, price: 2500,
      grass: ['#2f7f3a', '#3a9246'], sky: ['#060a1c', '#1b2550'], seats: '#2d3a7a', stand: '#222838', boards: ['LUNA AZUL', 'NEON COLA', 'ORBITA', 'VOLTA DRINK'], grade: { r: 0.82, g: 0.9, b: 1.08, add: [0, 2, 10] }, lights: true, tiers: 2, wind: [0, 2] },
    { id: 'tormenta', name: 'Parque Tormenta', short: 'Tormenta', desc: 'Lluvia intensa: el balón resbala y los porteros sufren para blocar.', kind: 'storm', time: 'storm', capacity: 30000, fill: 0.7, price: 2000, rain: true,
      grass: ['#2f6f36', '#397d3e'], sky: ['#3a4250', '#69737f'], seats: '#3f6f5a', stand: '#3a3f44', boards: ['TORMENTA', 'IMPERMEX', 'NEXO BANK'], grade: { r: 0.84, g: 0.9, b: 0.96, add: [0, 0, 6] }, lights: true, wind: [2, 6] },
    { id: 'templo', name: 'Templo de las Leyendas', short: 'El Templo', desc: 'El escenario de las finales eternas. Atardecer dorado y fuegos artificiales.', kind: 'temple', time: 'sunset', capacity: 100000, fill: 1, price: 8000, reqLevel: 10,
      grass: ['#3d8a33', '#4c9d3c'], sky: ['#ff8a3d', '#ffd27a'], seats: '#c9a227', stand: '#4a3428', boards: ['LEYENDAS', 'ETERNO', 'GOLAZO', 'AERO+'], grade: { r: 1.08, g: 0.98, b: 0.86, add: [12, 4, 0] }, roof: true, tiers: 2, lights: true, wind: [0, 2] },
  ];
  D.stadiumById = (id) => D.STADIUMS.find((s) => s.id === id);

  // Equipment & cosmetics
  D.KITS = [
    { id: 'k_default', name: 'Cantera Azul', p: '#1e5bd8', s: '#ffffff', pattern: 'solid', shorts: '#ffffff', socks: '#1e5bd8', price: 0 },
    { id: 'k_white', name: 'Blanca Clásica', p: '#f4f4f4', s: '#1b2f6b', pattern: 'solid', shorts: '#1b2f6b', socks: '#f4f4f4', price: 0 },
    { id: 'k_red', name: 'Furia Roja', p: '#d8262e', s: '#111111', pattern: 'hoops', shorts: '#111111', socks: '#d8262e', price: 600 },
    { id: 'k_sky', name: 'Celeste Rayada', p: '#74acdf', s: '#ffffff', pattern: 'stripes', shorts: '#111111', socks: '#ffffff', price: 900 },
    { id: 'k_green', name: 'Selva', p: '#1f8a4c', s: '#f5d100', pattern: 'sash', shorts: '#f5d100', socks: '#1f8a4c', price: 800 },
    { id: 'k_sunset', name: 'Atardecer', p: '#ff7a1a', s: '#5a2ca0', pattern: 'halves', shorts: '#5a2ca0', socks: '#ff7a1a', price: 1000 },
    { id: 'k_black', name: 'Noche', p: '#16161c', s: '#e0b84a', pattern: 'pinstripe', shorts: '#16161c', socks: '#e0b84a', price: 1200 },
    { id: 'k_legend', name: 'Dorada Leyenda', p: '#e0b84a', s: '#16161c', pattern: 'chevron', shorts: '#16161c', socks: '#e0b84a', price: 5000 },
  ];
  D.BOOTS = [
    { id: 'b_basic', name: 'Botines Básicos', color: '#202028', accent: '#ffffff', bonus: {}, price: 0 },
    { id: 'b_speed', name: 'Relámpago', color: '#ffe14d', accent: '#111111', bonus: { pow: 4 }, price: 900 },
    { id: 'b_precision', name: 'Bisturí', color: '#26c6da', accent: '#ffffff', bonus: { pre: 4 }, price: 900 },
    { id: 'b_curl', name: 'Remolino', color: '#ff5fa2', accent: '#111111', bonus: { cur: 5 }, price: 1100 },
    { id: 'b_ice', name: 'Glaciar', color: '#e8f4ff', accent: '#3fa7ff', bonus: { com: 5 }, price: 1300 },
    { id: 'b_gold', name: 'Oro Puro', color: '#e0b84a', accent: '#111111', bonus: { pre: 3, pow: 3, con: 3, cur: 3, com: 3 }, price: 4000 },
  ];
  D.GLOVES = [
    { id: 'g_basic', name: 'Guantes Básicos', color: '#f2f2f2', accent: '#2f6bd6', bonus: {}, price: 0 },
    { id: 'g_grip', name: 'Agarre Total', color: '#36e07a', accent: '#111111', bonus: { han: 6 }, price: 800 },
    { id: 'g_reach', name: 'Envergadura', color: '#ff7a1a', accent: '#111111', bonus: { reach: 5 }, price: 1000 },
    { id: 'g_reflex', name: 'Reflejo', color: '#ffe14d', accent: '#5a2ca0', bonus: { ref: 6 }, price: 1200 },
    { id: 'g_legend', name: 'Manos de Leyenda', color: '#e0b84a', accent: '#16161c', bonus: { ref: 4, han: 4, reach: 4, agi: 4 }, price: 4500 },
  ];
  D.EFFECTS = [
    { id: 'fx_none', name: 'Sin estela', colors: [], price: 0 },
    { id: 'fx_fire', name: 'Estela de Fuego', colors: ['#fff27a', '#ffb02e', '#ff5a1f', '#b8121c'], price: 1500 },
    { id: 'fx_lightning', name: 'Rayo Eléctrico', colors: ['#ffffff', '#9fe8ff', '#3fa7ff', '#2b4fd8'], price: 1500, jitter: true },
    { id: 'fx_rainbow', name: 'Arcoíris', colors: ['#ff3b3b', '#ffb02e', '#ffe14d', '#36e07a', '#3fa7ff', '#8a5cff'], price: 2000, cycle: true },
    { id: 'fx_stars', name: 'Polvo de Estrellas', colors: ['#ffffff', '#fff6b0', '#c9d6ff'], price: 2500, sparkle: true },
    { id: 'fx_gold', name: 'Cometa Dorado', colors: ['#ffffff', '#ffe58a', '#e0b84a', '#9a6b10'], price: 5000, sparkle: true },
  ];
  D.BALLS = [
    { id: 'ball_classic', name: 'Clásico', base: '#f6f6f2', patch: '#1d1d24', price: 0 },
    { id: 'ball_retro', name: 'Cuero Retro', base: '#a8743a', patch: '#5c3a18', price: 600 },
    { id: 'ball_winter', name: 'Invierno', base: '#ff7a1a', patch: '#1d1d24', price: 700 },
    { id: 'ball_neon', name: 'Neón', base: '#e8ff4d', patch: '#ff3fa0', price: 900 },
    { id: 'ball_gold', name: 'Balón de Oro', base: '#ffd860', patch: '#9a6b10', price: 3000 },
  ];
  D.CATALOG = { kits: D.KITS, boots: D.BOOTS, gloves: D.GLOVES, effects: D.EFFECTS, balls: D.BALLS };
  D.itemById = (cat, id) => (D.CATALOG[cat] || []).find((i) => i.id === id);

  // Shot techniques
  D.TECH = {
    colocado: { id: 'colocado', name: 'Colocado', key: '1', vmin: 16.5, vmax: 23.5, err: 0.5, spin: 14, top: 0, desc: 'Preciso y controlado. Menos velocidad.' },
    potente: { id: 'potente', name: 'Potente', key: '2', vmin: 22, vmax: 32.5, err: 1.0, spin: 5, top: 18, desc: 'Un cañonazo difícil de blocar. Más riesgo.' },
    rosca: { id: 'rosca', name: 'Rosca', key: '3', vmin: 17.5, vmax: 24.5, err: 0.72, spin: 46, top: 0, desc: 'Mucho efecto: la curva engaña al portero.' },
    picada: { id: 'picada', name: 'Picada', key: '4', vmin: 10.5, vmax: 14.5, err: 0.55, spin: 4, top: -26, desc: 'Vaselina al centro si el portero se tira.' },
  };
  D.TECH_ORDER = ['colocado', 'potente', 'rosca', 'picada'];

  // Competitions. rounds = keeper tier for each round, stadiums per round
  D.TOURNAMENTS = [
    { id: 'copa_nacional', name: 'Copa Nacional', type: 'Copa nacional', pool: 'clubs', size: 8, tiers: [1, 2, 2], stadiums: ['escuela', 'municipal', 'municipal'], reward: { coins: 900, xp: 450 }, unlock: { kits: 'k_red' }, reqLevel: 1, color: '#3fa7ff', desc: 'Ocho clubes del país pelean por la copa más antigua.' },
    { id: 'torneo_clubes', name: 'Torneo Continental de Clubes', type: 'Torneo de clubes', pool: 'clubs', size: 8, tiers: [2, 3, 3], stadiums: ['municipal', 'luna', 'continental'], reward: { coins: 1600, xp: 800 }, unlock: { stadiums: 'luna' }, reqLevel: 4, color: '#36e07a', desc: 'Los mejores clubes del continente. Noches de copa.' },
    { id: 'copa_tormenta', name: 'Copa Tormenta', type: 'Torneo especial', pool: 'clubs', size: 8, tiers: [2, 3, 3], stadiums: ['tormenta', 'tormenta', 'tormenta'], reward: { coins: 1400, xp: 700 }, unlock: { balls: 'ball_winter' }, reqLevel: 5, color: '#9fb4c8', desc: 'Todos los partidos bajo la lluvia. Balón resbaladizo.' },
    { id: 'relampago', name: 'Desafío Relámpago', type: 'Torneo especial', pool: 'clubs', size: 8, tiers: [2, 3, 4], stadiums: ['municipal', 'luna', 'continental'], suddenOnly: true, reward: { coins: 1700, xp: 850 }, unlock: { effects: 'fx_lightning' }, reqLevel: 6, color: '#ffe14d', desc: 'Muerte súbita desde el primer penal. Un error y afuera.' },
    { id: 'copa_internacional', name: 'Copa Internacional', type: 'Copa internacional', pool: 'nations', size: 16, tiers: [2, 3, 3, 4], stadiums: ['municipal', 'luna', 'continental', 'continental'], reward: { coins: 2800, xp: 1400 }, unlock: { stadiums: 'continental' }, reqLevel: 7, color: '#ff7a1a', desc: 'Dieciséis selecciones. Cuatro rondas. Una gloria.' },
    { id: 'noche_estrellas', name: 'Noche de Estrellas', type: 'Torneo especial', pool: 'nations', size: 4, tiers: [3, 4], stadiums: ['luna', 'luna'], kicks: 3, reward: { coins: 2000, xp: 1000 }, unlock: { effects: 'fx_stars' }, reqLevel: 9, color: '#8a5cff', desc: 'Exhibición nocturna a tres penales por equipo.' },
    { id: 'leyendas', name: 'Campeonato de Leyendas', type: 'Campeonato de leyendas', pool: 'legends', size: 8, tiers: [4, 4, 4], stadiums: ['templo', 'templo', 'templo'], reward: { coins: 5000, xp: 2500 }, unlock: { kits: 'k_legend' }, reqLevel: 12, color: '#ffbf2e', desc: 'Solo porteros legendarios. El templo te espera.' },
  ];
  D.tournamentById = (id) => D.TOURNAMENTS.find((t) => t.id === id);

  // Challenges: type 'match' (special shootout) or 'training' (drill). check(stats) => bool
  D.CHALLENGES = [
    { id: 'c_sniper', name: 'Francotirador', desc: 'Acertá 6 dianas en 60 segundos.', type: 'training', drill: 'targets', goal: 6, reward: 400 },
    { id: 'c_misil', name: 'Misil', desc: 'Marcá un gol a 115 km/h o más contra un portero.', type: 'training', drill: 'power', goal: 115, reward: 500 },
    { id: 'c_pleno', name: 'Pleno', desc: 'Ganá marcando tus 5 penales contra porteros profesionales.', type: 'match', tier: 2, stadium: 'municipal', reward: 600, check: (s) => s.won && s.goals >= 5 && s.misses === 0 },
    { id: 'c_curl', name: 'Efecto Imposible', desc: 'Marcá 3 goles con rosca rodeando al muñeco en 60 s.', type: 'training', drill: 'curl', goal: 3, reward: 600 },
    { id: 'c_escuadra', name: 'Escuadra', desc: 'Marcá 3 goles en las escuadras en un mismo partido.', type: 'match', tier: 2, stadium: 'luna', reward: 700, check: (s) => s.topCorners >= 3 },
    { id: 'c_panenka', name: 'Panenka Valiente', desc: 'Marcá 2 picadas en un partido contra un Experto.', type: 'match', tier: 3, stadium: 'municipal', reward: 900, check: (s) => s.panenkas >= 2 },
    { id: 'c_muro', name: 'Manos de Hierro', desc: 'Atajá 2 penales como portero en un mismo partido.', type: 'match', tier: 2, stadium: 'municipal', reward: 700, item: { gloves: 'g_grip' }, check: (s) => s.saves >= 2 },
    { id: 'c_sudden', name: 'Nervios de Acero', desc: 'Ganá una tanda que empieza directamente en muerte súbita.', type: 'match', tier: 3, stadium: 'luna', suddenOnly: true, reward: 800, check: (s) => s.won },
    { id: 'c_lluvia', name: 'Bajo la Lluvia', desc: 'Ganá en Parque Tormenta contra un portero Experto.', type: 'match', tier: 3, stadium: 'tormenta', reward: 900, check: (s) => s.won },
    { id: 'c_remontada', name: 'Remontada', desc: 'Empezás perdiendo 0-2 tras dos rondas. Ganá igual.', type: 'match', tier: 2, stadium: 'continental', preset: { a: ['miss', 'miss'], b: ['goal', 'goal'] }, reward: 1000, check: (s) => s.won },
    { id: 'c_perfect', name: 'Perfeccionista', desc: 'Conseguí 4 golpeos PERFECTOS en un partido.', type: 'match', tier: 2, stadium: 'municipal', reward: 800, item: { boots: 'b_precision' }, check: (s) => s.perfect >= 4 },
    { id: 'c_giant', name: 'Matagigantes', desc: 'Ganale una tanda a un portero Legendario.', type: 'match', tier: 4, stadium: 'templo', reward: 2000, item: { effects: 'fx_fire' }, check: (s) => s.won },
  ];

  // Career structure
  D.REP_RANKS = [
    { rep: 0, name: 'Desconocido' }, { rep: 120, name: 'Promesa' }, { rep: 350, name: 'Profesional' },
    { rep: 750, name: 'Estrella' }, { rep: 1300, name: 'Ídolo' }, { rep: 2100, name: 'Leyenda' },
  ];
  D.CAREER = [
    { name: 'Liga Barrial', desc: 'Nadie te conoce. Demostralo en la cancha del barrio.', events: [
      { id: 'e0a', kind: 'match', team: 'dfa', tier: 1, stadium: 'escuela' }, { id: 'e0b', kind: 'match', team: 'rdv', tier: 1, stadium: 'escuela' },
      { id: 'e0c', kind: 'match', team: 'ups', tier: 1, stadium: 'municipal' }, { id: 'e0d', kind: 'cup', name: 'Copa Barrial', pool: 'clubs', size: 4, tiers: [1, 1], stadiums: ['escuela', 'municipal'] } ] },
    { name: 'Segunda División', desc: 'Firmaste tu primer contrato. Ahora hay que ascender.', events: [
      { id: 'e1a', kind: 'match', team: 'cja', tier: 2, stadium: 'municipal' }, { id: 'e1b', kind: 'match', team: 'rso', tier: 2, stadium: 'tormenta' },
      { id: 'e1c', kind: 'match', team: 'spa', tier: 2, stadium: 'municipal' }, { id: 'e1d', kind: 'cup', name: 'Copa de Ascenso', pool: 'clubs', size: 4, tiers: [2, 2], stadiums: ['municipal', 'luna'] } ] },
    { name: 'Primera División', desc: 'Los focos de la máxima categoría.', events: [
      { id: 'e2a', kind: 'match', team: 'atm', tier: 2, stadium: 'luna' }, { id: 'e2b', kind: 'match', team: 'oln', tier: 3, stadium: 'tormenta' },
      { id: 'e2c', kind: 'match', team: 'hal', tier: 3, stadium: 'continental' }, { id: 'e2d', kind: 'cup', name: 'Copa de la Liga', pool: 'clubs', size: 8, tiers: [2, 3, 3], stadiums: ['municipal', 'luna', 'continental'] } ] },
    { name: 'Escena Internacional', desc: 'Te convocó la selección. El mundo mira.', events: [
      { id: 'e3a', kind: 'match', team: 'n_7', tier: 3, stadium: 'continental' }, { id: 'e3b', kind: 'match', team: 'n_1', tier: 3, stadium: 'luna' },
      { id: 'e3c', kind: 'match', team: 'n_10', tier: 4, stadium: 'continental' }, { id: 'e3d', kind: 'cup', name: 'Copa del Mundo de Penales', pool: 'nations', size: 8, tiers: [3, 3, 4], stadiums: ['luna', 'continental', 'continental'] } ] },
    { name: 'Camino a la Leyenda', desc: 'Solo quedan los inmortales.', events: [
      { id: 'e4a', kind: 'match', team: 'l3', tier: 4, stadium: 'continental' }, { id: 'e4b', kind: 'match', team: 'l1', tier: 4, stadium: 'templo' },
      { id: 'e4c', kind: 'cup', name: 'Campeonato de Leyendas', pool: 'legends', size: 8, tiers: [4, 4, 4], stadiums: ['templo', 'templo', 'templo'] } ] },
  ];

  // Fictional all-time ranking for the leaderboard
  D.LEADERBOARD = [
    { name: 'Aurelio Quiroga', pts: 9800 }, { name: 'Viktor Strand', pts: 8700 }, { name: 'Marco Rossi', pts: 7600 }, { name: 'Bruno Silva', pts: 6400 },
    { name: 'Kwame Mensah', pts: 5200 }, { name: 'Santiago Oviedo', pts: 4300 }, { name: 'Erik Lindqvist', pts: 3300 }, { name: 'Lucas Moreau', pts: 2400 },
    { name: 'Kenji Sato', pts: 1600 }, { name: 'Rafa Valdés', pts: 900 }, { name: 'Iker Etxeberri', pts: 400 }, { name: 'Pablo Gómez', pts: 150 },
  ];

  D.xpToNext = (lvl) => 120 + lvl * 70;
})(typeof window !== 'undefined' ? window : globalThis);
