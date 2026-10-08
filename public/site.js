(() => {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const page = path === '/about' ? 'about' : path === '/projects' ? 'projects' : 'home';
  for (const name of ['home', 'about', 'projects']) {
    document.getElementById(`${name}-page`).hidden = name !== page;
  }
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const active = link.dataset.nav === page;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
  });
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  const titles = { home: 'Nathaniel Mann — Electrical engineering student', about: 'About Me — Nathaniel Mann', projects: 'Projects — Nathaniel Mann' };
  document.title = titles[page];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const slides = [...gallery.querySelectorAll('.gallery-slide')];
    if (slides.length < 2) return;
    const controls = gallery.querySelector('.gallery-controls');
    const toggle = gallery.querySelector('[data-toggle]');
    const count = gallery.querySelector('.gallery-count');
    const viewport = gallery.querySelector('.gallery-slides');
    const previous = gallery.querySelector('[data-prev]');
    const next = gallery.querySelector('[data-next]');
    gallery.append(previous, next);
    previous.classList.add('gallery-arrow', 'gallery-prev');
    next.classList.add('gallery-arrow', 'gallery-next');
    let current = 0;
    let paused = reducedMotion.matches;
    let visible = false;
    let timer;
    let transitioning = false;
    controls.hidden = false;

    const updateToggle = () => {
      const label = paused ? 'Resume slideshow' : 'Pause slideshow';
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
      toggle.innerHTML = paused
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
    };
    const schedule = () => {
      clearTimeout(timer);
      const video = slides[current].querySelector('video');
      if (transitioning || paused || !visible || document.hidden || gallery.matches(':hover') || gallery.contains(document.activeElement) || (video && !video.paused && !video.hasAttribute('data-silent'))) return;
      timer = setTimeout(() => show(current + 1), video ? 20000 : 10000);
    };
    const positionArrows = () => {
      const media = slides[current].querySelector('img, video');
      gallery.style.setProperty('--arrow-top', `${media.getBoundingClientRect().height / 2}px`);
    };
    const playSilent = () => {
      const video = slides[current].querySelector('video[data-silent]');
      if (video && visible && !document.hidden) video.play().catch(() => {});
    };
    new ResizeObserver(positionArrows).observe(viewport);
    const show = async (index) => {
      if (transitioning) return;
      transitioning = true;
      clearTimeout(timer);
      const outgoing = slides[current];
      outgoing.querySelector('video')?.pause();
      const direction = index > current ? 1 : -1;
      const oldHeight = viewport.getBoundingClientRect().height;
      current = (index + slides.length) % slides.length;
      const incoming = slides[current];
      outgoing.classList.add('gallery-outgoing');
      outgoing.setAttribute('aria-hidden', 'true');
      outgoing.inert = true;
      incoming.hidden = false;
      playSilent();
      count.textContent = `${current + 1} / ${slides.length}`;
      positionArrows();
      if (!reducedMotion.matches) {
        const options = { duration: 550, easing: 'cubic-bezier(.22,.61,.36,1)' };
        const animations = [
          outgoing.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-direction * 100}%)` }], options),
          incoming.animate([{ transform: `translateX(${direction * 100}%)` }, { transform: 'translateX(0)' }], options),
          viewport.animate([{ height: `${oldHeight}px` }, { height: `${incoming.getBoundingClientRect().height}px` }], options)
        ];
        await Promise.allSettled(animations.map(animation => animation.finished));
      }
      outgoing.hidden = true;
      outgoing.classList.remove('gallery-outgoing');
      outgoing.removeAttribute('aria-hidden');
      outgoing.inert = false;
      transitioning = false;
      positionArrows();
      schedule();
    };
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    toggle.addEventListener('click', () => {
      paused = !paused;
      updateToggle();
      schedule();
    });
    gallery.addEventListener('mouseenter', schedule);
    gallery.addEventListener('mouseleave', schedule);
    gallery.addEventListener('focusin', schedule);
    gallery.addEventListener('focusout', () => setTimeout(schedule, 0));
    gallery.querySelectorAll('video[data-silent]').forEach((video) => {
      video.muted = true;
      video.addEventListener('volumechange', () => { if (!video.muted || video.volume) { video.muted = true; video.volume = 0; } });
    });
    gallery.querySelectorAll('video').forEach((video) => {
      video.addEventListener('play', schedule);
      video.addEventListener('pause', schedule);
      video.addEventListener('ended', schedule);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) slides[current].querySelector('video')?.pause();
      else playSilent();
      schedule();
    });
    reducedMotion.addEventListener('change', () => {
      paused = reducedMotion.matches;
      updateToggle();
      schedule();
    });
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) slides[current].querySelector('video')?.pause();
      else playSilent();
      schedule();
    }, { threshold: 0.2 }).observe(gallery);
    updateToggle();
  });

  const form = document.getElementById('feedback-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('feedback-status');
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form));
    status.classList.remove('error');
    status.textContent = 'Sending…';
    button.disabled = true;
    try {
      const origin = window.SQUARE_GAME_API_ORIGIN;
      if (!origin) throw new Error('Feedback is temporarily unavailable. Please try again later.');
      const response = await fetch(new URL('/square-game/api/feedback', origin), {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send feedback.');
      form.reset();
      status.textContent = 'Thanks — your feedback was sent.';
    } catch (error) {
      status.classList.add('error');
      status.textContent = error.message || 'Could not send feedback. Please try again.';
    } finally { button.disabled = false; }
  });
})();
