'use strict';

/**
 * -------------------------------------------------------------------
 * File: docs/explorer.js
 *
 * Purpose:
 *   A tiny, built-in "mini Postman / Swagger" page for testing the API
 *   in the browser. It exports ONE big string of HTML + CSS + JavaScript
 *   (no external packages, no CDN, no CSS framework).
 *
 * HOW IT WORKS (step by step):
 *   1. app.js serves this HTML when you open "/" in the browser.
 *   2. On load, the page calls GET /openapi.json (the API "menu") and
 *      GET /dashboard/stats (for the overview counts).
 *   3. It draws one collapsible card per endpoint, with inputs, quick
 *      examples, copy buttons (URL / cURL / Axios / Response) and notes.
 *   4. "Send" calls the real API with fetch() and shows the JSON reply
 *      plus the status code, response time and size.
 *
 * Everything below is plain browser JavaScript written with string
 * concatenation (no template literals) so it stays easy to read and so
 * this file needs no escaping tricks.
 *
 * Used By:
 *   app.js  →  app.get('/', ...) sends this HTML to the browser.
 * -------------------------------------------------------------------
 */
const explorerHtml = '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'<meta charset="UTF-8" />' +
'<meta name="viewport" content="width=device-width, initial-scale=1" />' +
'<title>API Hub - Explorer</title>' +
'<style>' +
':root{--bg:#f4f6f9;--panel:#ffffff;--text:#1f2933;--muted:#6b7280;--border:#e5e7eb;' +
'--accent:#2563eb;--accent-2:#1d4ed8;--code-bg:#1e293b;--code-text:#e2e8f0;' +
'--chip:#eef2ff;--chip-text:#3730a3;--ok-bg:#dcfce7;--ok-text:#166534;' +
'--err-bg:#fee2e2;--err-text:#991b1b;--method:#2563eb;--dot:#22c55e;}' +
'[data-theme="dark"]{--bg:#0f141a;--panel:#1a212b;--text:#e6edf3;--muted:#9aa4b2;' +
'--border:#2a323d;--accent:#3b82f6;--accent-2:#2563eb;--code-bg:#0b1018;--code-text:#d6dee8;' +
'--chip:#1e293b;--chip-text:#93c5fd;--ok-bg:#0f3d23;--ok-text:#86efac;' +
'--err-bg:#4c1d1d;--err-text:#fca5a5;--method:#3b82f6;--dot:#34d399;}' +
'*{box-sizing:border-box;}' +
'body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
'background:var(--bg);color:var(--text);transition:background .2s,color .2s;}' +
'.topbar{display:flex;align-items:center;justify-content:space-between;gap:12px;' +
'padding:16px 20px;background:var(--panel);border-bottom:1px solid var(--border);' +
'position:sticky;top:0;z-index:10;}' +
'.brand{font-size:20px;font-weight:700;}' +
'.brand .ver{font-size:12px;font-weight:500;color:var(--muted);margin-left:6px;}' +
'.theme-btn{background:transparent;color:var(--text);border:1px solid var(--border);' +
'padding:8px 14px;border-radius:8px;font-size:13px;cursor:pointer;}' +
'.theme-btn:hover{border-color:var(--accent);}' +
'.container{max-width:900px;margin:0 auto;padding:20px 16px 60px;}' +
'.overview{background:var(--panel);border:1px solid var(--border);border-radius:12px;' +
'padding:18px 20px;margin-bottom:18px;}' +
'.overview h2{margin:0 0 4px;font-size:18px;}' +
'.ov-status{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--muted);}' +
'.dot{width:9px;height:9px;border-radius:50%;background:var(--dot);display:inline-block;}' +
'.ov-grid{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;}' +
'.ov-item{background:var(--bg);border:1px solid var(--border);border-radius:8px;' +
'padding:10px 14px;min-width:110px;}' +
'.ov-item .k{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;}' +
'.ov-item .v{font-size:18px;font-weight:700;margin-top:2px;}' +
'.search{width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:10px;' +
'font-size:15px;background:var(--panel);color:var(--text);margin-bottom:16px;}' +
'.search:focus{outline:none;border-color:var(--accent);}' +
'.ep{background:var(--panel);border:1px solid var(--border);border-radius:10px;margin-bottom:12px;overflow:hidden;}' +
'.ep-head{display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer;user-select:none;}' +
'.ep-head:hover{background:var(--bg);}' +
'.method{font-weight:700;font-size:12px;padding:5px 0;border-radius:5px;color:#fff;' +
'background:var(--method);min-width:58px;text-align:center;}' +
'.path{font-family:ui-monospace,Menlo,monospace;font-size:14px;font-weight:600;word-break:break-all;}' +
'.summary{color:var(--muted);font-size:13px;margin-left:auto;}' +
'.ep-body{display:none;padding:14px 16px 18px;border-top:1px solid var(--border);}' +
'.ep.open .ep-body{display:block;}' +
'.section-label{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;' +
'letter-spacing:.5px;margin:16px 0 8px;}' +
'.section-label:first-child{margin-top:0;}' +
'.chips{display:flex;flex-wrap:wrap;gap:8px;}' +
'.chip{background:var(--chip);color:var(--chip-text);border:0;border-radius:20px;padding:6px 12px;' +
'font-size:12px;font-family:ui-monospace,Menlo,monospace;cursor:pointer;}' +
'.chip:hover{filter:brightness(0.96);}' +
'label{display:block;font-size:12px;font-weight:600;margin:12px 0 4px;}' +
'label small{color:var(--muted);font-weight:400;}' +
'.req{color:#dc2626;}' +
'input.field{width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:6px;' +
'font-size:14px;background:var(--bg);color:var(--text);}' +
'input.field:focus{outline:none;border-color:var(--accent);}' +
'.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;}' +
'button.btn{border-radius:6px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--border);}' +
'button.primary{background:var(--accent);color:#fff;border-color:var(--accent);}' +
'button.primary:hover{background:var(--accent-2);}' +
'button.ghost{background:transparent;color:var(--text);}' +
'button.ghost:hover{border-color:var(--accent);}' +
'button.btn:disabled{opacity:.5;cursor:not-allowed;}' +
'.req-url{font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--muted);' +
'margin-top:14px;word-break:break-all;}' +
'.resp{display:none;margin-top:12px;}' +
'.resp-meta{display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-size:12px;color:var(--muted);margin-bottom:6px;}' +
'.status{display:inline-block;padding:3px 10px;border-radius:5px;font-weight:700;}' +
'.status.ok{background:var(--ok-bg);color:var(--ok-text);}' +
'.status.err{background:var(--err-bg);color:var(--err-text);}' +
'.copy-resp{margin-left:auto;}' +
'pre{background:var(--code-bg);color:var(--code-text);padding:14px;border-radius:8px;' +
'overflow:auto;font-size:13px;line-height:1.5;max-height:380px;margin:0;}' +
'details.notes{margin-top:16px;border:1px solid var(--border);border-radius:8px;padding:0 12px;}' +
'details.notes summary{cursor:pointer;font-weight:600;font-size:13px;padding:10px 0;}' +
'details.notes[open] summary{border-bottom:1px solid var(--border);margin-bottom:10px;}' +
'.notes-body{font-size:13px;line-height:1.6;padding-bottom:12px;color:var(--text);}' +
'.notes-body code{background:var(--bg);padding:1px 5px;border-radius:4px;' +
'font-family:ui-monospace,Menlo,monospace;}' +
'.toast{position:fixed;bottom:24px;left:50%;' +
'transform:translate(-50%,20px);background:var(--accent);color:#fff;padding:10px 18px;' +
'border-radius:8px;font-size:14px;font-weight:600;opacity:0;pointer-events:none;' +
'transition:opacity .2s,transform .2s;z-index:50;}' +
'.toast.show{opacity:1;transform:translate(-50%,0);}' +
'@media(max-width:600px){.summary{display:none;}.topbar{padding:12px 14px;}.brand{font-size:17px;}}' +
'</style>' +
'</head>' +
'<body>' +
'<header class="topbar">' +
'<div class="brand">API Hub<span class="ver" id="ver"></span></div>' +
'<button id="themeBtn" class="theme-btn">Dark Mode</button>' +
'</header>' +
'<main class="container">' +
'<section id="overview" class="overview">Loading overview...</section>' +
'<input id="searchBox" class="search" type="search" placeholder="Search endpoints..." />' +
'<div id="app">Loading endpoints...</div>' +
'</main>' +
'<div id="toast" class="toast"></div>' +
'<script>' + browserScript() + '</' + 'script>' +
'</body>' +
'</html>';

/**
 * The browser-side JavaScript, returned as a plain string.
 * (Kept in its own function purely to keep the file readable.)
 */
function browserScript() {
  return [
    '(function(){',
    '  var BASE = window.location.origin;',
    '',
    '  /* ---- Dark mode (saved in localStorage so it sticks) ---- */',
    '  var THEME_KEY = "apihub-theme";',
    '  function applyTheme(theme){',
    '    document.documentElement.setAttribute("data-theme", theme);',
    '    var btn = document.getElementById("themeBtn");',
    '    btn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";',
    '  }',
    '  var savedTheme = localStorage.getItem(THEME_KEY) || "light";',
    '  applyTheme(savedTheme);',
    '  document.getElementById("themeBtn").addEventListener("click", function(){',
    '    var current = document.documentElement.getAttribute("data-theme");',
    '    var next = current === "dark" ? "light" : "dark";',
    '    localStorage.setItem(THEME_KEY, next);',
    '    applyTheme(next);',
    '  });',
    '',
    '  /* ---- Small copy-feedback toast ---- */',
    '  var toastEl = document.getElementById("toast");',
    '  function toast(message){',
    '    toastEl.textContent = message;',
    '    toastEl.classList.add("show");',
    '    clearTimeout(toastEl._timer);',
    '    toastEl._timer = setTimeout(function(){ toastEl.classList.remove("show"); }, 1600);',
    '  }',
    '',
    '  /* ---- Copy text to clipboard (with a fallback) ---- */',
    '  function copyText(text, message){',
    '    if (navigator.clipboard && navigator.clipboard.writeText){',
    '      navigator.clipboard.writeText(text).then(function(){ toast(message); }, function(){ fallbackCopy(text, message); });',
    '    } else { fallbackCopy(text, message); }',
    '  }',
    '  function fallbackCopy(text, message){',
    '    var area = document.createElement("textarea");',
    '    area.value = text; document.body.appendChild(area); area.select();',
    '    try { document.execCommand("copy"); toast(message); } catch (e) {}',
    '    document.body.removeChild(area);',
    '  }',
    '',
    '  function escapeHtml(value){',
    '    return String(value).replace(/[&<>"]/g, function(ch){',
    '      return ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : "&quot;";',
    '    });',
    '  }',
    '  function statusText(code){',
    '    var map = {200:"OK",201:"Created",204:"No Content",400:"Bad Request",',
    '      401:"Unauthorized",403:"Forbidden",404:"Not Found",500:"Internal Server Error"};',
    '    return map[code] || "";',
    '  }',
    '  function formatBytes(bytes){',
    '    return bytes < 1024 ? bytes + " B" : (bytes / 1024).toFixed(1) + " KB";',
    '  }',
    '',
    '  /* ---- Read the default value the spec suggests for a parameter ---- */',
    '  function defaultValue(param){',
    '    if (param.example !== undefined && param.example !== null) return param.example;',
    '    if (param.schema && param.schema.default !== undefined) return param.schema.default;',
    '    return "";',
    '  }',
    '',
    '  /* ---- Build the full request URL from the current input values ---- */',
    '  function buildUrl(pathTemplate, inputs){',
    '    var path = pathTemplate;',
    '    var query = [];',
    '    inputs.forEach(function(input){',
    '      var value = input.value.trim();',
    '      if (input.dataset.in === "path"){',
    '        path = path.replace("{" + input.dataset.name + "}", encodeURIComponent(value || ""));',
    '      } else if (input.dataset.in === "query" && value !== ""){',
    '        query.push(encodeURIComponent(input.dataset.name) + "=" + encodeURIComponent(value));',
    '      }',
    '    });',
    '    return BASE + path + (query.length ? "?" + query.join("&") : "");',
    '  }',
    '',
    '  /* ---- Figure out what kind of endpoint this is (for notes/response hints) ---- */',
    '  function endpointKind(path, names){',
    '    if (path.indexOf("{id}") !== -1) return "detail";',
    '    if (path.indexOf("/search") !== -1 || names.indexOf("q") !== -1) return "search";',
    '    if (path.indexOf("/categories") !== -1) return "categories";',
    '    if (path.indexOf("/dashboard") !== -1) return "dashboard";',
    '    if (path.indexOf("/health") !== -1) return "health";',
    '    if (names.indexOf("page") !== -1 && names.indexOf("limit") !== -1) return "list";',
    '    return "other";',
    '  }',
    '',
    '  /* ---- Build the "Developer Notes" content for an endpoint ---- */',
    '  function notesHtml(path, method, params, op){',
    '    var names = params.map(function(p){ return p.name; });',
    '    var kind = endpointKind(path, names);',
    '    var paramText = params.length',
    '      ? params.map(function(p){ return "<code>" + escapeHtml(p.name) + "</code> (" + p.in + (p.required ? ", required" : "") + ")"; }).join(", ")',
    '      : "None";',
    '    var responseText, useCase;',
    '    if (kind === "list"){',
    '      responseText = "<code>{ page, limit, total, totalPages, results: [...] }</code>";',
    '      useCase = "React: load with useEffect/Axios and add Next/Prev buttons, or use React Query useInfiniteQuery for infinite scroll. React Native: render results in a FlatList and fetch the next page on onEndReached.";',
    '    } else if (kind === "search"){',
    '      responseText = "<code>{ query, total, results: [...] }</code>";',
    '      useCase = "Bind the q value to a text input, debounce the typing, then call this endpoint. Great for building a live search box.";',
    '    } else if (kind === "detail"){',
    '      responseText = "A single object for the requested id (or a 404 error if not found).";',
    '      useCase = "Read the id from the route (React Router / React Navigation params) and fetch one record for a details screen.";',
    '    } else if (kind === "categories"){',
    '      responseText = "<code>{ total, results: [ \\"Electronics\\", ... ] }</code>";',
    '      useCase = "Use the list to fill a category filter dropdown or tab bar.";',
    '    } else if (kind === "dashboard"){',
    '      responseText = "An object of counts and/or chart-ready arrays.";',
    '      useCase = "Show the numbers in summary cards and feed the arrays into any chart component.";',
    '    } else {',
    '      responseText = "A small status object.";',
    '      useCase = "Call it to confirm the API is reachable before loading data.";',
    '    }',
    '    return "<div class=\\"notes-body\\">" +',
    '      "<p><b>What it does:</b> " + escapeHtml(op.summary || "") + "</p>" +',
    '      "<p><b>Expected parameters:</b> " + paramText + "</p>" +',
    '      "<p><b>Sample response structure:</b> " + responseText + "</p>" +',
    '      "<p><b>Common use cases:</b> " + escapeHtml(useCase) + "</p>" +',
    '      "</div>";',
    '  }',
    '',
    '  /* ---- Build quick-example value sets for one-click filling ---- */',
    '  function buildExamples(params){',
    '    var base = {};',
    '    params.forEach(function(p){ base[p.name] = defaultValue(p); });',
    '    var names = params.map(function(p){ return p.name; });',
    '    var list = [base];',
    '    if (names.indexOf("page") !== -1 && names.indexOf("limit") !== -1){',
    '      var variant = {}; for (var k in base){ variant[k] = base[k]; } variant.limit = 20;',
    '      list.push(variant);',
    '    }',
    '    return list;',
    '  }',
    '  function exampleLabel(path, method, params, values){',
    '    var p = path; var query = [];',
    '    params.forEach(function(param){',
    '      var value = values[param.name];',
    '      if (value === undefined || value === "") return;',
    '      if (param.in === "path"){ p = p.replace("{" + param.name + "}", value); }',
    '      else { query.push(param.name + "=" + value); }',
    '    });',
    '    return method.toUpperCase() + " " + p + (query.length ? "?" + query.join("&") : "");',
    '  }',
    '',
    '  /* ---- Build one endpoint card (a DOM element) ---- */',
    '  function createCard(path, method, op){',
    '    var params = op.parameters || [];',
    '    var card = document.createElement("div");',
    '    card.className = "ep";',
    '    card.dataset.search = (method + " " + path + " " + (op.summary || "") + " " + (op.tags ? op.tags.join(" ") : "")).toLowerCase();',
    '',
    '    var inputsHtml = params.map(function(p){',
    '      var dv = escapeHtml(String(defaultValue(p)));',
    '      var required = p.required ? " <span class=\\"req\\">*</span>" : "";',
    '      return "<label>" + escapeHtml(p.name) + " <small>(" + p.in + ")</small>" + required + "</label>" +',
    '        "<input class=\\"field\\" data-name=\\"" + escapeHtml(p.name) + "\\" data-in=\\"" + p.in +',
    '        "\\" placeholder=\\"" + dv + "\\" value=\\"" + dv + "\\">";',
    '    }).join("");',
    '',
    '    var paramsSection = params.length ? ("<div class=\\"section-label\\">Parameters</div>" + inputsHtml) : "";',
    '',
    '    card.innerHTML =',
    '      "<div class=\\"ep-head\\">" +',
    '        "<span class=\\"method\\">" + method.toUpperCase() + "</span>" +',
    '        "<span class=\\"path\\">" + escapeHtml(path) + "</span>" +',
    '        "<span class=\\"summary\\">" + escapeHtml(op.summary || "") + "</span>" +',
    '      "</div>" +',
    '      "<div class=\\"ep-body\\">" +',
    '        "<div class=\\"section-label\\">Example Usage</div>" +',
    '        "<div class=\\"chips\\"></div>" +',
    '        paramsSection +',
    '        "<div class=\\"actions\\">" +',
    '          "<button class=\\"btn primary act-send\\">Send</button>" +',
    '          "<button class=\\"btn ghost act-url\\">Copy URL</button>" +',
    '          "<button class=\\"btn ghost act-curl\\">Copy cURL</button>" +',
    '          "<button class=\\"btn ghost act-axios\\">Copy Axios</button>" +',
    '        "</div>" +',
    '        "<div class=\\"req-url\\"></div>" +',
    '        "<div class=\\"resp\\">" +',
    '          "<div class=\\"resp-meta\\"></div>" +',
    '          "<pre></pre>" +',
    '        "</div>" +',
    '        notesHtml(path, method, params, op).replace("<div class=\\"notes-body\\">",',
    '          "<details class=\\"notes\\"><summary>Developer Notes</summary><div class=\\"notes-body\\">") + "</details>" +',
    '      "</div>";',
    '',
    '    var head = card.querySelector(".ep-head");',
    '    head.addEventListener("click", function(){ card.classList.toggle("open"); });',
    '',
    '    var inputs = card.querySelectorAll(".field");',
    '    var urlBox = card.querySelector(".req-url");',
    '    var respBox = card.querySelector(".resp");',
    '    var metaBox = card.querySelector(".resp-meta");',
    '    var preBox = card.querySelector("pre");',
    '    var lastResponse = "";',
    '',
    '    /* Quick example chips */',
    '    var chipsBox = card.querySelector(".chips");',
    '    buildExamples(params).forEach(function(values){',
    '      var chip = document.createElement("button");',
    '      chip.className = "chip";',
    '      chip.textContent = exampleLabel(path, method, params, values);',
    '      chip.addEventListener("click", function(){',
    '        inputs.forEach(function(input){',
    '          if (values[input.dataset.name] !== undefined) input.value = String(values[input.dataset.name]);',
    '        });',
    '        toast("Example loaded");',
    '      });',
    '      chipsBox.appendChild(chip);',
    '    });',
    '',
    '    /* Copy buttons */',
    '    card.querySelector(".act-url").addEventListener("click", function(){',
    '      copyText(buildUrl(path, inputs), "URL copied");',
    '    });',
    '    card.querySelector(".act-curl").addEventListener("click", function(){',
    '      copyText("curl -X GET \\"" + buildUrl(path, inputs) + "\\"", "cURL copied");',
    '    });',
    '    card.querySelector(".act-axios").addEventListener("click", function(){',
    '      var url = buildUrl(path, inputs);',
    '      var code = "const response = await axios.get(\\n  \\"" + url + "\\"\\n);\\n\\nconsole.log(response.data);";',
    '      copyText(code, "Axios example copied");',
    '    });',
    '',
    '    /* Send the request and show status / time / size + JSON */',
    '    card.querySelector(".act-send").addEventListener("click", function(){',
    '      var url = buildUrl(path, inputs);',
    '      urlBox.textContent = "GET " + url;',
    '      respBox.style.display = "block";',
    '      metaBox.innerHTML = "";',
    '      preBox.textContent = "Loading...";',
    '      var startTime = performance.now();',
    '      fetch(url).then(function(res){',
    '        return res.text().then(function(text){',
    '          var ms = Math.round(performance.now() - startTime);',
    '          var bytes = new Blob([text]).size;',
    '          var pretty = text;',
    '          try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch (e) {}',
    '          lastResponse = pretty;',
    '          var ok = res.status >= 200 && res.status < 300;',
    '          metaBox.innerHTML =',
    '            "<span class=\\"status " + (ok ? "ok" : "err") + "\\">" + res.status + " " + statusText(res.status) + "</span>" +',
    '            "<span>Time: " + ms + " ms</span>" +',
    '            "<span>Size: " + formatBytes(bytes) + "</span>" +',
    '            "<button class=\\"btn ghost copy-resp\\">Copy Response</button>";',
    '          metaBox.querySelector(".copy-resp").addEventListener("click", function(){',
    '            copyText(lastResponse, "Response copied");',
    '          });',
    '          preBox.textContent = pretty;',
    '        });',
    '      }).catch(function(err){ preBox.textContent = "Request failed: " + err; });',
    '    });',
    '',
    '    return card;',
    '  }',
    '',
    '  /* ---- Overview card at the top ---- */',
    '  function renderOverview(spec, stats){',
    '    var totalEndpoints = 0;',
    '    for (var p in spec.paths){ totalEndpoints += Object.keys(spec.paths[p]).length; }',
    '    var host = window.location.hostname;',
    '    var isLocal = host === "localhost" || host === "127.0.0.1" || host === "";',
    '    var environment = isLocal ? "Local Development" : "Production";',
    '    document.getElementById("ver").textContent = "v" + (spec.info && spec.info.version ? spec.info.version : "1.0.0");',
    '    function count(value){ return (value === undefined || value === null) ? "-" : value; }',
    '    var s = stats || {};',
    '    var html =',
    '      "<h2>" + escapeHtml(spec.info ? spec.info.title : "API Hub") + "</h2>" +',
    '      "<span class=\\"ov-status\\"><span class=\\"dot\\"></span> Status: Online</span>" +',
    '      "<div class=\\"ov-grid\\">" +',
    '        "<div class=\\"ov-item\\"><div class=\\"k\\">Endpoints</div><div class=\\"v\\">" + totalEndpoints + "</div></div>" +',
    '        "<div class=\\"ov-item\\"><div class=\\"k\\">Movies</div><div class=\\"v\\">" + count(s.movies) + "</div></div>" +',
    '        "<div class=\\"ov-item\\"><div class=\\"k\\">Users</div><div class=\\"v\\">" + count(s.users) + "</div></div>" +',
    '        "<div class=\\"ov-item\\"><div class=\\"k\\">Products</div><div class=\\"v\\">" + count(s.products) + "</div></div>" +',
    '        "<div class=\\"ov-item\\"><div class=\\"k\\">Posts</div><div class=\\"v\\">" + count(s.posts) + "</div></div>" +',
    '        "<div class=\\"ov-item\\"><div class=\\"k\\">Version</div><div class=\\"v\\">" + (spec.info ? spec.info.version : "1.0.0") + "</div></div>" +',
    '        "<div class=\\"ov-item\\"><div class=\\"k\\">Environment</div><div class=\\"v\\" style=\\"font-size:14px\\">" + environment + "</div></div>" +',
    '      "</div>";',
    '    document.getElementById("overview").innerHTML = html;',
    '  }',
    '',
    '  /* ---- Endpoint search box (filters cards in real time) ---- */',
    '  document.getElementById("searchBox").addEventListener("input", function(e){',
    '    var keyword = e.target.value.trim().toLowerCase();',
    '    var cards = document.querySelectorAll(".ep");',
    '    cards.forEach(function(card){',
    '      var matches = card.dataset.search.indexOf(keyword) !== -1;',
    '      card.style.display = matches ? "" : "none";',
    '    });',
    '  });',
    '',
    '  /* ---- Start: load the spec, build cards, then load stats ---- */',
    '  fetch("/openapi.json").then(function(r){ return r.json(); }).then(function(spec){',
    '    var app = document.getElementById("app");',
    '    app.innerHTML = "";',
    '    for (var path in spec.paths){',
    '      var methods = spec.paths[path];',
    '      for (var method in methods){',
    '        app.appendChild(createCard(path, method, methods[method]));',
    '      }',
    '    }',
    '    fetch("/dashboard/stats").then(function(r){ return r.json(); })',
    '      .then(function(stats){ renderOverview(spec, stats); })',
    '      .catch(function(){ renderOverview(spec, null); });',
    '  }).catch(function(err){',
    '    document.getElementById("app").textContent = "Failed to load spec: " + err;',
    '  });',
    '})();'
  ].join('\n');
}

module.exports = explorerHtml;
