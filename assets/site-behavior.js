(() => {
  'use strict';
  const root = document.documentElement;
  const key = 'yoonsang-color-mode-v1';
  const system = matchMedia('(prefers-color-scheme: dark)');
  let chosen = null;
  try { chosen = localStorage.getItem(key); } catch { /* Storage may be disabled. */ }
  if (!['light', 'dark'].includes(chosen)) chosen = null;

  function apply(mode) {
    root.dataset.theme = mode;
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    const dark = mode === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.title = button.getAttribute('aria-label');
    button.querySelector('span').textContent = dark ? '🌙' : '☀️';
  }
  apply(chosen || (system.matches ? 'dark' : 'light'));
  system.addEventListener('change', () => {
    if (!chosen) apply(system.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    chosen = ['light', 'dark'].includes(event.newValue) ? event.newValue : null;
    apply(chosen || (system.matches ? 'dark' : 'light'));
  });

  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      chosen = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(chosen);
      try { localStorage.setItem(key, chosen); } catch { /* Still works for this visit. */ }
    });

    const video = document.querySelector('.paper-video');
    if (video) {
      video.muted = true;
      // Also request playback explicitly for embedded preview browsers.
      video.play().catch(() => {});
    }
  });
})();
