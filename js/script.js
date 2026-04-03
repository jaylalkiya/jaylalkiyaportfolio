// js/script.js — JayLalkiya v3

/* ═══════════════════════════════
   CURSOR
═══════════════════════════════ */
function initCursor() {
  const ring = document.getElementById('custom-cursor');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring trails slightly behind
  function lerpCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  // Hover scale
  document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '40px';
      ring.style.height = '40px';
      ring.style.borderColor = 'var(--purple)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '18px';
      ring.style.height = '18px';
      ring.style.borderColor = 'var(--blue)';
    });
  });
}

/* ═══════════════════════════════
   CLOCK
═══════════════════════════════ */
function initClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const tick = () => {
    const n = new Date();
    el.textContent = n.getHours().toString().padStart(2,'0') + ':' + n.getMinutes().toString().padStart(2,'0');
  };
  tick();
  setInterval(tick, 1000);
}

/* ═══════════════════════════════
   TERMINAL
═══════════════════════════════ */
function toggleTerminal() {
  const term = document.getElementById('global-terminal');
  if (!term) return;
  term.classList.toggle('hidden');
  if (!term.classList.contains('hidden')) {
    setTimeout(() => {
      const inp = document.getElementById('terminal-input');
      if (inp) inp.focus();
    }, 80);
  }
}
window.toggleTerminal = toggleTerminal;

function initTerminal() {
  const input  = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const nav = page => () => { window.location.href = page; return ''; };

  const cmds = {
    help:       () => `<span style="color:var(--muted)">commands:</span> about · skills · projects · experience · contact · clear · whoami`,
    whoami:     () => `<span style="color:var(--green)">jay lalkiya</span> — full stack dev · BCA '26 · ahmedabad`,
    about:      nav('about.html'),
    skills:     nav('skills.html'),
    projects:   nav('projects.html'),
    experience: nav('experience.html'),
    contact:    nav('contact.html'),
    clear:      () => { output.innerHTML = ''; return ''; }
  };

  function writeLine(html) {
    output.innerHTML += `<div style="margin:2px 0;">${html}</div>`;
    output.scrollTop = output.scrollHeight;
  }

  // Welcome
  writeLine(`<span style="color:var(--blue)">JayLalkiya v3.0</span> — type <span style="color:var(--purple)">help</span> for commands`);

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim();
    if (!raw) return;
    const cmd = raw.toLowerCase();

    writeLine(`<span style="color:var(--purple)">&gt;</span> ${raw}`);

    if (cmds[cmd]) {
      const res = cmds[cmd]();
      if (res) writeLine(res);
    } else {
      writeLine(`<span style="color:var(--pink)">command not found:</span> ${raw} · try <span style="color:var(--purple)">help</span>`);
    }

    input.value = '';
  });
}

/* ═══════════════════════════════
   KEYBOARD SHORTCUTS
═══════════════════════════════ */
function initKeys() {
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      toggleTerminal();
    }
  });
}

/* ═══════════════════════════════
   COMMON INIT (all inner pages)
═══════════════════════════════ */
function initCommonFeatures() {
  initCursor();
  initClock();
  initTerminal();
  initKeys();
}
window.initCommonFeatures = initCommonFeatures;

/* ═══════════════════════════════
   BOOT SEQUENCE (index only)
═══════════════════════════════ */
function bootSequence() {
  const screen   = document.getElementById('boot-screen');
  const fill     = document.getElementById('boot-fill');
  const lines    = document.querySelectorAll('.boot-line');
  const dashboard = document.getElementById('dashboard');

  const msgs = [
    'INITIALIZING NEURAL CORE',
    'LOADING GLASSMORPHIC UI',
    'CONNECTING TO DEVNET',
    'AUTHENTICATING JAY LALKIYA',
    'ALL SYSTEMS NOMINAL ✓'
  ];

  // Show lines staggered
  lines.forEach((line, i) => {
    setTimeout(() => {
      line.textContent = '> ' + (msgs[i] || '');
      if (i === lines.length - 1) line.querySelector && null; // last
      line.classList.add('show');
    }, i * 420);
  });

  // Progress bar
  setTimeout(() => {
    if (fill) fill.style.width = '100%';
  }, 200);

  // Transition to dashboard
  setTimeout(() => {
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
      dashboard.classList.remove('hidden');
      initCommonFeatures();
      // Stagger card entrance
      document.querySelectorAll('.module-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        setTimeout(() => {
          card.style.transition = `opacity 0.5s var(--ease) ${i * 80}ms, transform 0.5s var(--ease) ${i * 80}ms`;
          card.style.opacity = '1';
          card.style.transform = 'none';
        }, i * 80 + 100);
      });
    }, 900);
  }, 2800);
}
window.bootSequence = bootSequence;

/* ═══════════════════════════════
   AUTO-BOOT
═══════════════════════════════ */
window.addEventListener('load', () => {
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path === '/' || path === '') {
    bootSequence();
  } else {
    initCommonFeatures();
  }
});
