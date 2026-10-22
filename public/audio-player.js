(function (global) {
  'use strict';

  function initExcerptPlayer(root) {
    const audio = root.getElementById('excerpt-audio');
    const rows = Array.from(root.querySelectorAll('[data-excerpt]'));
    const announcement = root.getElementById('audio-status');
    if (!audio || !rows.length) return null;
    let current = null;
    let request = 0;

    const clock = seconds => {
      const value = Math.max(0, Math.floor(Number(seconds) || 0));
      return Math.floor(value / 60) + ':' + String(value % 60).padStart(2, '0');
    };
    const duration = row => Number(row.dataset.duration);
    const name = row => row.dataset.title;

    function paint(row, mode) {
      row.dataset.state = mode;
      const active = ['playing', 'loading'].includes(mode);
      row.classList.toggle('is-active', active);
      const button = row.querySelector('.excerpt-play');
      const label = mode === 'playing' ? 'Pause' : mode === 'loading' ? 'Cancel' : mode === 'ended' ? 'Replay' : 'Play';
      button.querySelector('.play-label').textContent = label + ' excerpt';
      button.querySelector('.play-icon').textContent = mode === 'playing' ? 'Ⅱ' : mode === 'loading' ? '■' : '▶';
      button.setAttribute('aria-label', label + ' ' + name(row));
      button.setAttribute('aria-pressed', String(active));
      row.querySelector('.clip-progress').hidden = mode === 'idle';
    }

    function updateTime(row) {
      const elapsed = row === current ? Math.min(duration(row), Number(audio.currentTime) || 0) : 0;
      row.querySelector('.clip-time').textContent = clock(elapsed) + ' / ' + clock(duration(row));
      row.querySelector('.clip-progress').value = elapsed;
    }

    function announce(message) { announcement.textContent = message; }
    function showError(row) {
      paint(row, 'error');
      row.querySelector('.track-error').hidden = false;
      announce('Could not play ' + name(row) + '. Use its MP3 link to open the excerpt.');
    }

    async function toggle(row) {
      const token = ++request;
      if (current === row && !audio.error && row.dataset.state !== 'error' && (!audio.paused || row.dataset.state === 'loading')) {
        audio.pause();
        paint(row, 'paused');
        announce('Paused ' + name(row) + '.');
        return;
      }
      if (current !== row) {
        const previous = current;
        audio.pause();
        current = row;
        if (previous) {
          paint(previous, 'idle');
          previous.querySelector('.track-error').hidden = true;
          updateTime(previous);
        }
        audio.src = row.dataset.src;
        audio.load();
      } else if (audio.error) {
        audio.load();
      } else if (audio.ended) {
        audio.currentTime = 0;
      }
      row.querySelector('.track-error').hidden = true;
      paint(row, 'loading');
      updateTime(row);
      try {
        await audio.play();
        if (token !== request || current !== row) return;
        paint(row, 'playing');
        announce('Playing ' + name(row) + '.');
      } catch (error) {
        if (token !== request || current !== row) return;
        if (error.name === 'AbortError') paint(row, 'paused');
        else showError(row);
      }
    }

    rows.forEach(row => {
      const button = row.querySelector('.excerpt-play');
      button.hidden = false;
      row.querySelector('.excerpt-fallback').hidden = true;
      paint(row, 'idle');
      updateTime(row);
      button.addEventListener('click', () => toggle(row));
    });
    audio.addEventListener('play', () => {
      if (!current) return;
      paint(current, 'playing');
      root.dispatchEvent(new global.Event('excerpt-play'));
    });
    audio.addEventListener('pause', () => {
      if (current && !audio.ended && current.dataset.state !== 'error') paint(current, 'paused');
    });
    audio.addEventListener('timeupdate', () => { if (current) updateTime(current); });
    audio.addEventListener('ended', () => {
      if (!current) return;
      ++request;
      paint(current, 'ended');
      updateTime(current);
      announce('Finished ' + name(current) + '.');
    });
    audio.addEventListener('error', () => { if (current) { ++request; showError(current); } });
    return { toggle, audio, get current() { return current; } };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { initExcerptPlayer };
  else initExcerptPlayer(global.document);
})(typeof window === 'undefined' ? globalThis : window);
