/** Cuestionario de comprensión lectora: una pregunta por vez, corrección en el servidor. */
import { post } from '../api.js';
import { icon } from '../art.js';
import { esc, modal, showAchievements, errorToast, setBusy } from '../ui.js';

export function openQuiz(book, { onResult } = {}) {
  const qs = book.quiz;
  const answers = new Array(qs.length).fill(null);
  let i = 0;
  const m = modal({ title: `Cuestionario: ${book.title}`, size: 'md', className: `quiz-modal quiz--s${book.section}`, content: '<div class="quiz"></div>' });
  const root = m.node.querySelector('.quiz');

  const dots = () => `<div class="quiz__dots" aria-hidden="true">${qs.map((_, k) => `<span class="${k === i ? 'is-current' : ''} ${answers[k] !== null ? 'is-done' : ''}"></span>`).join('')}</div>`;

  function drawQuestion() {
    const q = qs[i];
    root.innerHTML = `${dots()}
      <p class="quiz__count">Pregunta ${i + 1} de ${qs.length}</p>
      <h3 class="quiz__q" id="quiz-q">${esc(q.question)}</h3>
      <div class="quiz__options" role="radiogroup" aria-labelledby="quiz-q">
        ${q.options.map((o, k) => `<button class="quiz__opt ${answers[i] === k ? 'is-on' : ''}" role="radio" aria-checked="${answers[i] === k}" data-k="${k}"><span class="quiz__letter">${'ABCDE'[k]}</span><span>${esc(o)}</span></button>`).join('')}
      </div>
      <div class="form-actions">
        <button class="btn btn--ghost" data-prev ${i === 0 ? 'disabled' : ''}>${icon('left', { size: 16 })} Anterior</button>
        ${i < qs.length - 1 ? `<button class="btn btn--primary" data-next ${answers[i] === null ? 'disabled' : ''}>Siguiente ${icon('right', { size: 16 })}</button>`
    : `<button class="btn btn--primary" data-send ${answers.includes(null) ? 'disabled' : ''}>${icon('check', { size: 16 })} Ver resultados</button>`}
      </div>`;
    root.querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => {
      answers[i] = Number(b.dataset.k);
      drawQuestion();
      if (i < qs.length - 1) setTimeout(() => { i++; drawQuestion(); }, 320);
    }));
    root.querySelector('[data-prev]').onclick = () => { i--; drawQuestion(); };
    const nx = root.querySelector('[data-next]');
    if (nx) nx.onclick = () => { i++; drawQuestion(); };
    const send = root.querySelector('[data-send]');
    if (send) send.onclick = () => submit(send);
    root.querySelector('.quiz__opt.is-on, .quiz__opt')?.focus();
  }

  async function submit(btn) {
    setBusy(btn, true, 'Corrigiendo…');
    try {
      const r = await post(`/books/${book.id}/quiz`, { answers });
      drawResults(r);
      onResult?.(r);
      showAchievements(r.achievements);
    } catch (err) { setBusy(btn, false); errorToast(err); }
  }

  function drawResults(r) {
    const pct = Math.round((r.score / r.total) * 100);
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
    const msg = pct === 100 ? '¡Perfecto! Leíste con muchísima atención.' : pct >= 60 ? '¡Muy bien! Entendiste la historia.' : '¡Buen intento! Podés releer algunas partes y volver a probar.';
    root.innerHTML = `<div class="quiz__result">
      <div class="quiz__stars" aria-label="${stars} de 3 estrellas">${[0, 1, 2].map((k) => `<span class="${k < stars ? 'is-on' : ''}" style="animation-delay:${k * 0.15}s">${icon('star', { size: 40 })}</span>`).join('')}</div>
      <p class="quiz__score"><strong>${r.score}</strong> de ${r.total} respuestas correctas</p><p class="muted">${msg}</p></div>
      <ol class="quiz__review">${qs.map((q, k) => {
    const res = r.results[k];
    return `<li class="${res.ok ? 'ok' : 'bad'}"><strong>${icon(res.ok ? 'check' : 'x', { size: 16 })} ${esc(q.question)}</strong>
        ${res.ok ? '' : `<span>Tu respuesta: ${esc(q.options[res.given] ?? '—')}</span>`}
        <span>Respuesta correcta: <b>${esc(q.options[res.correct])}</b></span>${res.explanation ? `<em>${esc(res.explanation)}</em>` : ''}</li>`;
  }).join('')}</ol>
      <div class="form-actions"><button class="btn btn--ghost" data-retry>${icon('restart', { size: 16 })} Intentar de nuevo</button><button class="btn btn--primary" data-close>Listo</button></div>`;
    root.querySelector('[data-retry]').onclick = () => { answers.fill(null); i = 0; drawQuestion(); };
    root.querySelector('[data-close]').onclick = () => m.close();
  }

  drawQuestion();
}
