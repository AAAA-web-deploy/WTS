(() => {
  'use strict';
  const config = window.WTS_CONFIG || {};
  document.querySelectorAll('[data-link]').forEach(link => {
    const value = config.links && config.links[link.dataset.link];
    if (!value) return;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') return;
      link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled'); link.title = `Open ${link.dataset.link}`;
      if (link.classList.contains('signal-console__cta')) link.textContent = '↗ JOIN THE CONVERSATION';
    } catch (_) { /* Leave unconfigured links inactive. */ }
  });
  const address = typeof config.contractAddress === 'string' ? config.contractAddress.trim() : '';
  const copyBtn = document.getElementById('copy-contract');
  const valueEl = document.getElementById('contract-value');
  const status = document.getElementById('copy-status');
  if (copyBtn) {
    if (address && valueEl) {
      valueEl.textContent = address;
      valueEl.hidden = false;
    }
    copyBtn.addEventListener('click', async () => {
      if (!address) {
        status.textContent = 'Contract address is not published yet.';
        return;
      }
      try {
        await navigator.clipboard.writeText(address);
        status.textContent = 'Contract address copied.';
        copyBtn.classList.add('is-copied');
        copyBtn.querySelector('.ca-copy__label').textContent = 'COPIED';
        setTimeout(() => {
          copyBtn.classList.remove('is-copied');
          copyBtn.querySelector('.ca-copy__label').textContent = 'COPY CA';
        }, 1600);
      } catch (_) {
        status.textContent = 'Clipboard unavailable; select the address to copy it.';
      }
    });
  }
  const elements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold: .12});
    elements.forEach(element => { observer.observe(element); element.classList.add('reveal-ready'); });
  } else elements.forEach(element => element.classList.add('visible'));

  const options = {
    republican: 'Imagine Republicans holding both chambers. How might the relationship between Congress and the White House shape the story?',
    divided: 'Imagine the parties splitting control of the House and Senate. Which negotiations and alliances might shape the next chapter?',
    democratic: 'Imagine Democrats holding both chambers. What might change as Congress and the White House navigate divided government?'
  };
  document.querySelectorAll('.scenario').forEach(button => button.addEventListener('click', () => {
    if (!options[button.dataset.scenario]) return;
    document.querySelectorAll('.scenario').forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', String(active)); });
    document.getElementById('scenario-text').textContent = options[button.dataset.scenario];
  }));

  const button = document.getElementById('western-play');
  let context = null, timer = null;
  const reset = () => { button.textContent = '▶ PLAY THE SIGNAL'; button.setAttribute('aria-pressed', 'false'); };
  button.addEventListener('click', async () => {
    if (context) { clearTimeout(timer); await context.close(); context = null; reset(); return; }
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) { button.textContent = 'AUDIO UNAVAILABLE'; button.disabled = true; return; }
    try {
      context = new AudioClass(); await context.resume(); const start = context.currentTime + .05;
      [110,164.81,220,196,164.81,130.81,146.83,110].forEach((frequency, i) => {
        const oscillator = context.createOscillator(), gain = context.createGain(), t = start + i * .75;
        oscillator.type = 'sine'; oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001,t); gain.gain.exponentialRampToValueAtTime(.055,t+.16); gain.gain.exponentialRampToValueAtTime(.0001,t+.85);
        oscillator.connect(gain); gain.connect(context.destination); oscillator.start(t); oscillator.stop(t+.9);
      });
      button.textContent = '■ STOP THE SIGNAL'; button.setAttribute('aria-pressed','true');
      timer = setTimeout(async () => { if (context) await context.close(); context = null; reset(); },6400);
    } catch (_) { if (context) await context.close(); context = null; button.textContent = 'AUDIO UNAVAILABLE'; }
  });
})();

/* Progressive enhancement: the ship stays visible without JS or when motion is reduced. */
(() => {
  const section = document.getElementById('outro');
  const ship = section && section.querySelector('.departure-ship');
  const button = document.getElementById('departure-replay');
  if (!section || !ship || !button) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let hasStarted = false;
  let inView = false;
  let running = false;

  const pauseIfNeeded = () => {
    section.classList.toggle('flight-paused', running && (document.hidden || !inView));
  };
  const finish = () => {
    running = false;
    section.classList.remove('is-departing', 'flight-paused');
    section.classList.add('has-departed');
    section.dataset.flightState = motion.matches ? 'reduced-motion' : 'complete';
    button.disabled = false;
    button.textContent = '↗ REPLAY DEPARTURE';
  };
  const start = () => {
    if (motion.matches || running) return;
    hasStarted = true;
    running = true;
    section.classList.remove('has-departed', 'is-departing');
    // Flush a single local layout only when restarting this short decorative sequence.
    void ship.offsetWidth;
    section.classList.add('is-departing');
    section.dataset.flightState = 'playing';
    button.disabled = true;
    button.textContent = '↗ DEPARTING…';
    pauseIfNeeded();
  };
  const syncMotion = () => {
    button.hidden = motion.matches;
    if (motion.matches) {
      finish();
    } else if (!hasStarted && inView) {
      start();
    }
  };
  ship.addEventListener('animationend', event => {
    if (event.target === ship && event.animationName === 'pf-departure') finish();
  });
  button.addEventListener('click', start);
  document.addEventListener('visibilitychange', pauseIfNeeded);
  if (motion.addEventListener) motion.addEventListener('change', syncMotion);
  else if (motion.addListener) motion.addListener(syncMotion);
  button.hidden = motion.matches;
  section.dataset.flightState = motion.matches ? 'reduced-motion' : 'ready';
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.35;
      if (inView && !hasStarted && !motion.matches) start();
      pauseIfNeeded();
    }, { threshold: 0.35 });
    observer.observe(section);
  } else {
    // No visibility observer: keep the static illustration and allow user-triggered playback.
    inView = true;
  }
})();

/* Story mosaic lightbox: keep captions off the gallery tiles, available on demand. */
(() => {
  const mosaic = document.querySelector('.story-mosaic');
  const dialog = document.getElementById('story-lightbox');
  if (!mosaic || !dialog || typeof dialog.showModal !== 'function') return;
  const image = document.getElementById('story-lightbox-image');
  const kicker = document.getElementById('story-lightbox-kicker');
  const title = document.getElementById('story-lightbox-title');
  const desc = document.getElementById('story-lightbox-desc');
  const closeBtn = document.getElementById('story-lightbox-close');
  let lastFocus = null;

  const openScene = (scene) => {
    const tileImg = scene.querySelector('img');
    if (!tileImg) return;
    lastFocus = document.activeElement;
    image.src = tileImg.currentSrc || tileImg.src;
    image.width = tileImg.naturalWidth || Number(tileImg.getAttribute('width')) || 1916;
    image.height = tileImg.naturalHeight || Number(tileImg.getAttribute('height')) || 821;
    image.alt = tileImg.alt || '';
    kicker.textContent = scene.dataset.scene || '';
    title.textContent = scene.dataset.title || '';
    desc.textContent = scene.dataset.desc || '';
    dialog.showModal();
    closeBtn.focus();
  };

  mosaic.addEventListener('click', (event) => {
    const button = event.target.closest('.story-scene__tile');
    if (!button) return;
    const scene = button.closest('.story-scene');
    if (scene) openScene(scene);
  });

  const close = () => {
    if (dialog.open) dialog.close();
  };
  closeBtn.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener('close', () => {
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  });
})();
