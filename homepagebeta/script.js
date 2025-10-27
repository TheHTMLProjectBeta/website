document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const toggleButton = document.getElementById('darkModeToggle');
  const toggleIcon = document.getElementById('modeIcon');
  const logo = document.getElementById('site-logo');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const grid = document.querySelector('.main-links-grid');

  function setOsThemeAttr() {
    root.setAttribute('data-os-theme', media.matches ? 'dark' : 'light');
  }

  function effectiveDark() {
    const pref = localStorage.getItem('theme');
    if (pref === 'dark') return true;
    if (pref === 'light') return false;
    return media.matches;
  }

  function applyTheme() {
    const pref = localStorage.getItem('theme');
    if (pref === 'dark') root.setAttribute('data-theme', 'dark');
    else if (pref === 'light') root.setAttribute('data-theme', 'light');
    else root.setAttribute('data-theme', 'auto');
    setOsThemeAttr();
    const isDark = effectiveDark();
    toggleIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    logo.src = isDark
      ? 'https://assets.thehtmlproject.com/img/logodark.png'
      : 'https://assets.thehtmlproject.com/icon.jpeg';
    toggleButton.setAttribute('aria-pressed', String(isDark));
  }

  applyTheme();

  media.addEventListener('change', () => {
    if (!localStorage.getItem('theme')) applyTheme();
    else setOsThemeAttr();
  });

  toggleButton.addEventListener('click', () => {
    const pref = localStorage.getItem('theme');
    if (pref === null) {
      localStorage.setItem('theme', effectiveDark() ? 'light' : 'dark');
    } else if (pref === 'dark') {
      localStorage.setItem('theme', 'light');
    } else if (pref === 'light') {
      localStorage.removeItem('theme');
    }
    applyTheme();
  });

  function visibleButtons() {
    if (!grid) return [];
    return Array.from(grid.querySelectorAll('.link-button')).filter(
      (el) => el.offsetParent !== null
    );
  }

  function setGridState() {
    if (!grid) return;
    grid.classList.remove('even-count', 'odd-count');
    const count = visibleButtons().length;
    grid.classList.add(count % 2 === 0 ? 'even-count' : 'odd-count');
  }

  setGridState();

  const joinBtn = document.getElementById('discordJoinBtn');
  const btnInner = joinBtn ? joinBtn.querySelector('.btn-inner') : null;
  const checkIcon = document.getElementById('discordCheck');
  const text = document.getElementById('discordText');
  const icon = document.getElementById('discordIcon');

  if (localStorage.getItem('joinedDiscord') === 'true' && joinBtn) {
    joinBtn.style.display = 'none';
    setGridState();
  }

  let waitingForReturn = false;

  function startDiscordAnimation() {
    if (!joinBtn) return;
    if (btnInner) btnInner.classList.add('blur');
    waitingForReturn = true;
  }

  function finishDiscordAnimation() {
    if (!joinBtn) return;
    waitingForReturn = false;
    setTimeout(() => {
      if (text) text.style.display = 'none';
      if (icon) icon.style.display = 'none';
      if (checkIcon) checkIcon.classList.add('show');
    }, 800);
    setTimeout(() => joinBtn.classList.add('fadeOut'), 1800);
    setTimeout(() => {
      joinBtn.style.display = 'none';
      localStorage.setItem('joinedDiscord', 'true');
      setGridState();
    }, 3000);
  }

  if (joinBtn) {
    joinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('/discord', '_blank', 'noopener,noreferrer');
      startDiscordAnimation();
    });
  }

  window.addEventListener('focus', () => {
    if (waitingForReturn) finishDiscordAnimation();
  });

  const MESSAGE_VERSION = '2025-07-07-v1';
  const updateIndicator = document.getElementById('updateIndicator');
  const seenVersion = localStorage.getItem('seenMessageVersion');
  if (updateIndicator && seenVersion !== MESSAGE_VERSION)
    updateIndicator.classList.add('show');
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('seenMessageVersion', MESSAGE_VERSION);
  });
});
