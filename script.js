(function () {
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  const backupDir = 'backup-20260312-191500';

  const routes = {
    home: {
      title: 'Ms.Kwek',
      html: [
        '<main class="home-shell">',
        '  <section class="home-card">',
        '    <h1 class="home-title">Ms.Kwek</h1>',
        '    <p>Choose an activity:</p>',
        '    <div class="home-links">',
        '      <a class="home-link" href="?app=quiz">Life Fun Quiz</a>',
        '      <a class="home-link" href="?app=grammar">Treasure Grammar Quest</a>',
        '      <a class="home-link" href="?app=phonics">A-Z Voiceboard</a>',
        '    </div>',
        '  </section>',
        '</main>'
      ].join('\n')
    },
    quiz: {
      title: 'Ms.Kwek - Life Fun Quiz (P1-P6)',
      source: `${backupDir}/MISSKWEK.html`
    },
    grammar: {
      title: 'Ms.Kwek: Treasure Grammar Quest',
      source: `${backupDir}/grammar.html`
    },
    phonics: {
      title: 'Ms.Kwek - A-Z Voiceboard',
      source: `${backupDir}/phonics.html`
    }
  };

  function normalizeBranding(text) {
    return text
      .replace(/MISSKWEK/g, 'Ms.Kwek')
      .replace(/MissKwek/g, 'Ms.Kwek')
      .replace(/Miss Kwek/g, 'Ms.Kwek')
      .replace(/MISS KWEK/g, 'Ms.Kwek');
  }

  function normalizeLinks(text) {
    return text
      .replace(/href="index\.html"/g, 'href="?app=quiz"')
      .replace(/href="MISSKWEK\.html"/g, 'href="?app=quiz"')
      .replace(/href="grammar\.html"/g, 'href="?app=grammar"')
      .replace(/href="phonics\.html"/g, 'href="?app=phonics"');
  }

  function replaceInlineStyles(text) {
    return text
      .replace(/style="max-width:900px; display:flex; align-items:center; gap:1rem;"/g, 'class="quiz-intro-wrap"')
      .replace(/style="width:200px;"/g, 'class="quiz-intro-image"')
      .replace(/style="display:flex;gap:10px;justify-content:center;margin-top:8px"/g, 'class="quiz-intro-links"')
      .replace(/style="margin-top:12px"/g, 'class="quiz-intro-more"')
      .replace(/style="width:160px;height:200px;object-fit:contain;"/g, 'class="quiz-mascot-image"')
      .replace(/style="top: 90px; width: 120px; height: 42px; animation-duration: 35s;"/g, 'class="grammar-cloud-1"')
      .replace(/style="top: 190px; width: 160px; height: 52px; animation-duration: 46s;"/g, 'class="grammar-cloud-2"')
      .replace(/style="top: 320px; width: 96px; height: 36px; animation-duration: 31s;"/g, 'class="grammar-cloud-3"')
      .replace(/style="left: 9%; top: 18%; animation-delay: \.1s;"/g, 'class="grammar-star-1"')
      .replace(/style="left: 20%; top: 8%; animation-delay: \.4s;"/g, 'class="grammar-star-2"')
      .replace(/style="left: 78%; top: 22%; animation-delay: \.9s;"/g, 'class="grammar-star-3"')
      .replace(/style="left: 90%; top: 14%; animation-delay: \.2s;"/g, 'class="grammar-star-4"')
      .replace(/style="left: 82%; top: 64%; animation-delay: \.7s;"/g, 'class="grammar-star-5"')
      .replace(/style="font-size:62px"/g, 'class="grammar-guide-icon"')
      .replace(/style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:12px;"/g, 'class="grammar-start-row"')
      .replace(/style="grid-column: span 2;"/g, 'class="grammar-path-pill"')
      .replace(/style="margin-top:14px; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;"/g, 'class="grammar-action-row"')
      .replace(/style="margin-top:14px"/g, 'class="grammar-final-note"')
      .replace(/style="font-size:16px"/g, 'class="phonics-brand-main"')
      .replace(/style="font-size:12px;color:#083d77"/g, 'class="phonics-brand-sub"');
  }

  function normalizeMarkup(text) {
    let out = normalizeBranding(text);
    out = normalizeLinks(out);
    out = replaceInlineStyles(out);
    return out;
  }

  function getRouteKey() {
    return (new URLSearchParams(window.location.search).get('app') || 'home').toLowerCase();
  }

  function extractPageBits(htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const scripts = Array.from(doc.querySelectorAll('script'));
    const scriptCode = scripts.map((s) => s.textContent || '').join('\n\n');
    scripts.forEach((s) => s.remove());

    const bodyHtml = doc.body ? doc.body.innerHTML : '';
    return {
      bodyHtml,
      scriptCode
    };
  }

  function executeScript(code) {
    if (!code || !code.trim()) return;
    try {
      new Function(code)();
    } catch (err) {
      console.error('Route script failed:', err);
    }
  }

  async function loadRoute() {
    const key = getRouteKey();
    const route = routes[key] || routes.home;
    document.title = route.title;

    if (!route.source) {
      appRoot.innerHTML = route.html;
      return;
    }

    try {
      const res = await fetch(route.source, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const normalized = normalizeMarkup(text);
      const { bodyHtml, scriptCode } = extractPageBits(normalized);

      appRoot.innerHTML = bodyHtml;
      executeScript(scriptCode);
    } catch (err) {
      console.error('Failed to load route:', key, err);
      appRoot.innerHTML = [
        '<main class="home-shell">',
        '  <section class="home-card">',
        '    <h1 class="home-title">Ms.Kwek</h1>',
        '    <p>Could not load this activity. Please try again.</p>',
        '    <div class="home-links">',
        '      <a class="home-link" href="?app=home">Back to Home</a>',
        '    </div>',
        '  </section>',
        '</main>'
      ].join('\n');
    }
  }

  loadRoute();
})();
