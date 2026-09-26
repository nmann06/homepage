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
