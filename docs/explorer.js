'use strict';

/**
 * A tiny, dependency-free API explorer ("Swagger-lite").
 *
 * It fetches /openapi.json at runtime and renders a simple "try it" form for
 * every endpoint — no external packages, no CDN, ~5 KB of inline HTML/CSS/JS.
 */
const explorerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Hub — Explorer</title>
  <style>
    :root { --bg:#fafafa; --card:#fff; --line:#e8e8e8; --ink:#3b4151; --muted:#7d8492; --get:#61affe; --get-bg:#ebf3fb; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:var(--bg); color:var(--ink); }
    header { max-width:820px; margin:0 auto; padding:28px 16px 8px; }
    header h1 { margin:0; font-size:22px; font-weight:700; }
    header p { margin:6px 0 0; color:var(--muted); font-size:14px; }
    main { max-width:820px; margin:12px auto 48px; padding:0 16px; }
    .ep { border:1px solid var(--get); background:var(--get-bg); border-radius:6px; margin-bottom:10px; }
    .ep-head { display:flex; align-items:center; gap:12px; padding:8px 12px; cursor:pointer; user-select:none; }
    .method { font-weight:700; font-size:13px; padding:6px 0; border-radius:4px; color:#fff; background:var(--get); min-width:64px; text-align:center; }
    .path { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:15px; font-weight:600; color:#3b4151; }
    .summary { color:var(--muted); font-size:13px; margin-left:auto; }
    .ep-body { display:none; padding:14px 16px 18px; background:var(--card); border-top:1px solid var(--get); border-radius:0 0 6px 6px; }
    .ep.open .ep-body { display:block; }
    label { display:block; font-size:12px; font-weight:600; color:var(--ink); margin:14px 0 4px; }
    label small { color:var(--muted); font-weight:400; }
    input { width:100%; padding:8px 10px; border:1px solid #d9d9d9; border-radius:4px; font-size:14px; }
    input:focus { outline:none; border-color:var(--get); }
    .req { color:#dc2626; }
    button.send { margin-top:16px; background:#4990e2; color:#fff; border:0; padding:9px 22px; border-radius:4px; font-size:14px; font-weight:600; cursor:pointer; }
    button.send:hover { background:#357ae8; }
    .meta { font-family: ui-monospace, Menlo, monospace; font-size:12px; color:var(--muted); margin:14px 0 0; word-break:break-all; }
    pre { background:#41444e; color:#fff; padding:14px; border-radius:4px; overflow:auto; font-size:13px; line-height:1.5; max-height:380px; margin:6px 0 0; }
    .status { display:inline-block; padding:3px 10px; border-radius:4px; font-size:12px; font-weight:700; }
    .ok { background:#dcfce7; color:#166534; }
    .err { background:#fee2e2; color:#991b1b; }
  </style>
</head>
<body>
  <header>
    <h1>API Hub — Explorer</h1>
    <p>Lightweight API tester. Click an endpoint, fill in params, and hit Send.</p>
  </header>
  <main id="app">Loading endpoints…</main>

  <script>
    const app = document.getElementById('app');

    function field(p) {
      const req = p.required ? '<span class="req">*</span>' : '';
      const ph = p.example != null ? p.example : (p.schema && p.schema.default != null ? p.schema.default : '');
      return \`<label>\${p.name} <small>(\${p.in})</small> \${req}</label>
        <input data-name="\${p.name}" data-in="\${p.in}" placeholder="\${ph}" value="\${ph}">\`;
    }

    function endpointCard(path, method, op) {
      const params = op.parameters || [];
      const id = (method + path).replace(/[^a-z0-9]/gi, '_');
      return \`<div class="ep" id="\${id}">
        <div class="ep-head" onclick="this.parentElement.classList.toggle('open')">
          <span class="method">\${method.toUpperCase()}</span>
          <span class="path">\${path}</span>
          <span class="summary">\${op.summary || ''}</span>
        </div>
        <div class="ep-body">
          <form onsubmit="return send(event, '\${path}', this)">
            \${params.map(field).join('')}
            <button class="send" type="submit">Send</button>
            <div class="meta" data-url></div>
            <div data-result></div>
          </form>
        </div>
      </div>\`;
    }

    async function send(e, pathTemplate, form) {
      e.preventDefault();
      let path = pathTemplate;
      const query = new URLSearchParams();
      form.querySelectorAll('input').forEach((el) => {
        const v = el.value.trim();
        if (el.dataset.in === 'path') {
          path = path.replace('{' + el.dataset.name + '}', encodeURIComponent(v || ''));
        } else if (el.dataset.in === 'query' && v !== '') {
          query.set(el.dataset.name, v);
        }
      });
      const url = path + (query.toString() ? '?' + query.toString() : '');
      form.querySelector('[data-url]').textContent = 'GET ' + url;
      const resultEl = form.querySelector('[data-result]');
      resultEl.innerHTML = '<pre>Loading…</pre>';
      try {
        const res = await fetch(url);
        const text = await res.text();
        let body = text;
        try { body = JSON.stringify(JSON.parse(text), null, 2); } catch (_) {}
        const cls = res.ok ? 'ok' : 'err';
        resultEl.innerHTML = '<div style="margin-top:12px"><span class="status ' + cls + '">'
          + res.status + ' ' + res.statusText + '</span></div><pre>' + escapeHtml(body) + '</pre>';
      } catch (err) {
        resultEl.innerHTML = '<pre>Request failed: ' + escapeHtml(String(err)) + '</pre>';
      }
      return false;
    }

    function escapeHtml(s) {
      return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    }

    fetch('/openapi.json')
      .then((r) => r.json())
      .then((spec) => {
        const cards = [];
        for (const [path, methods] of Object.entries(spec.paths)) {
          for (const [method, op] of Object.entries(methods)) {
            cards.push(endpointCard(path, method, op));
          }
        }
        app.innerHTML = cards.join('');
      })
      .catch((err) => { app.textContent = 'Failed to load spec: ' + err; });
  </script>
</body>
</html>`;

module.exports = explorerHtml;
