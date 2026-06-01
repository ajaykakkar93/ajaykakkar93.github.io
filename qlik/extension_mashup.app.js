/* ============================================================
   Qlik Dev Training Ground — app logic
   - renders 5 mode panes from MODES
   - mode toggle, sticky TOC + scroll-spy
   - code-block headers + copy buttons
   - fuzzy search with suggestions + keyboard nav
   - URL hash sync (#mode/section)
   ============================================================ */
(function () {
  "use strict";

  var content   = document.getElementById("content");
  var tocNav    = document.getElementById("tocNav");
  var tocTitle  = document.getElementById("tocTitle");
  var modeBar   = document.getElementById("modeBar");
  var searchBox = document.getElementById("searchBox");
  var suggest   = document.getElementById("suggestBox");
  var backTop   = document.getElementById("backTop");

  var LVL = { f:["lvl-f","Fresher"], i:["lvl-i","Intermediate"], a:["lvl-a","Advanced"] };
  var ICON_BG = {
    extension:"background:rgba(59,130,246,.15);color:#93c5fd",
    mashup:"background:rgba(168,85,247,.15);color:#d8b4fe",
    javascript:"background:rgba(6,182,212,.15);color:#67e8f9",
    jquery:"background:rgba(245,158,11,.15);color:#fcd34d",
    html:"background:rgba(239,68,68,.15);color:#fca5a5",
    css:"background:rgba(34,197,94,.15);color:#6ee7b7"
  };

  var currentMode = "html";
  var searchIndex = [];   // flat index for search

  /* ---------- escape for attribute use ---------- */
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }

  /* ---------- build all panes + TOC data + search index ---------- */
  function buildAll() {
    var html = "";
    Object.keys(MODES).forEach(function (mode) {
      var m = MODES[mode];
      html += '<div class="mode-pane" id="pane-' + mode + '" data-mode="' + mode + '">';
      m.sections.forEach(function (s) {
        var lvl = s.level && LVL[s.level]
          ? '<span class="lvl ' + LVL[s.level][0] + '">' + LVL[s.level][1] + '</span>' : "";
        html +=
          '<section id="' + s.id + '" class="card rounded-2xl p-6 mb-5 topic-card" data-mode="' + mode + '">' +
            '<div class="flex items-center justify-between gap-3 mb-2 flex-wrap">' +
              '<h2 class="font-display font-bold text-lg sm:text-xl flex items-center gap-2">' +
                '<a href="#' + s.id + '" class="text-slate-600 hover:text-blue-400 text-sm" title="Link to section">#</a>' +
                esc(s.title) +
              '</h2>' +
              '<div class="flex items-center gap-2">' +
                (s.tag ? '<span class="tag tag-slate">' + esc(s.tag) + '</span>' : "") + lvl +
              '</div>' +
            '</div>' +
            '<div class="topic-body">' + s.body + '</div>' +
          '</section>';

        // search index entry — title + tag + stripped body text
        var plain = s.body.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
        searchIndex.push({
          mode: mode, id: s.id, title: s.title, tag: s.tag || "",
          level: s.level, hay: (s.title + " " + (s.tag||"") + " " + plain).toLowerCase()
        });
      });
      html += "</div>";
    });
    content.innerHTML = html;
    enhanceCode();
  }

  /* ---------- wrap every <pre> with header + copy button ---------- */
  function enhanceCode() {
    content.querySelectorAll("pre").forEach(function (pre) {
      if (pre.closest(".code-wrap")) return;
      var code = pre.querySelector("code");
      var lang = "code";
      if (code) {
        var cls = (code.className.match(/language-(\w+)/) || [])[1];
        if (cls) lang = ({ markup:"html", js:"javascript" }[cls] || cls);
      }
      var wrap = document.createElement("div");
      wrap.className = "code-wrap";
      var head = document.createElement("div");
      head.className = "code-head";
      head.innerHTML =
        '<span class="code-lang">' + lang + '</span>' +
        '<button class="copy-btn" type="button"><i class="far fa-copy"></i>Copy</button>';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(head);
      wrap.appendChild(pre);

      head.querySelector(".copy-btn").addEventListener("click", function () {
        var btn = this;
        var text = code ? code.textContent : pre.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.classList.add("done");
          btn.innerHTML = '<i class="fas fa-check"></i>Copied';
          setTimeout(function () {
            btn.classList.remove("done");
            btn.innerHTML = '<i class="far fa-copy"></i>Copy';
          }, 1600);
        });
      });
    });
    if (window.Prism) Prism.highlightAllUnder(content);
  }

  /* ---------- TOC for active mode ---------- */
  function buildToc(mode) {
    var m = MODES[mode];
    tocTitle.textContent = m.label;
    tocNav.innerHTML = m.sections.map(function (s) {
      var dot = s.level && LVL[s.level]
        ? '<span class="lvl ' + LVL[s.level][0] + '" style="margin-right:.4rem;padding:.05rem .35rem;font-size:.55rem">' + s.level.toUpperCase() + '</span>' : "";
      return '<a class="toc-link" href="#' + s.id + '" data-id="' + s.id + '">' + dot + esc(s.title) + '</a>';
    }).join("");
  }

  /* ---------- switch mode ---------- */
  function setMode(mode, scrollTo) {
    if (!MODES[mode]) mode = "html";
    currentMode = mode;

    Array.prototype.forEach.call(modeBar.children, function (b) {
      b.classList.toggle("active", b.dataset.mode === mode);
    });
    content.querySelectorAll(".mode-pane").forEach(function (p) {
      p.classList.toggle("active", p.dataset.mode === mode);
    });
    buildToc(mode);
    updateHash(mode, scrollTo || "");
    if (scrollTo) {
      setTimeout(function () { jumpTo(scrollTo, false); }, 30);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    syncSpy();
  }

  /* ---------- jump to a section (optionally crossing modes) ---------- */
  function jumpTo(id, pulse) {
    var entry = searchIndex.find(function (e) { return e.id === id; });
    if (!entry) return;
    if (entry.mode !== currentMode) { setMode(entry.mode, id); return; }
    var el = document.getElementById(id);
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
    updateHash(currentMode, id);
    if (pulse !== false) { el.classList.add("pulse"); setTimeout(function(){ el.classList.remove("pulse"); }, 1500); }
  }

  /* ---------- URL hash: #mode or #mode/section ---------- */
  function updateHash(mode, id) {
    var h = "#" + mode + (id ? "/" + id : "");
    if (location.hash !== h) history.replaceState(null, "", h);
  }
  function readHash() {
    var raw = location.hash.replace(/^#/, "");
    if (!raw) return null;
    var parts = raw.split("/");
    return { mode: parts[0], id: parts[1] || "" };
  }

  /* ---------- scroll-spy: highlight TOC + persist mode in hash ---------- */
  var spyTicking = false;
  function syncSpy() {
    var pane = document.getElementById("pane-" + currentMode);
    if (!pane) return;
    var secs = pane.querySelectorAll(".topic-card");
    var pos = window.pageYOffset + 160;
    var activeId = null;
    secs.forEach(function (s) { if (s.offsetTop <= pos) activeId = s.id; });
    tocNav.querySelectorAll(".toc-link").forEach(function (l) {
      l.classList.toggle("active", l.dataset.id === activeId);
    });
  }
  window.addEventListener("scroll", function () {
    if (!spyTicking) {
      window.requestAnimationFrame(function () { syncSpy(); spyTicking = false; });
      spyTicking = true;
    }
    backTop.classList.toggle("show", window.pageYOffset > 500);
  });

  /* ---------- SEARCH ---------- */
  var selIdx = -1, curResults = [];

  function modeBadge(mode) {
    return '<span class="sug-icon" style="' + ICON_BG[mode] + '"><i class="fas ' + MODES[mode].icon + '"></i></span>';
  }

  function renderSuggest(results, isPopular) {
    curResults = results; selIdx = -1;
    if (!results.length) {
      suggest.innerHTML = '<div class="sug-item" style="cursor:default;color:#64748b"><i class="fas fa-circle-info"></i>No matches — try “field”, “variable”, “grid”, “ajax”…</div>';
      suggest.classList.remove("hidden"); return;
    }
    var head = isPopular
      ? '<div style="padding:.5rem 1rem;font-size:.65rem;text-transform:uppercase;letter-spacing:.08em;color:#64748b;border-bottom:1px solid rgba(71,85,105,.2)">Popular</div>' : "";
    suggest.innerHTML = head + results.map(function (r, i) {
      var lvl = r.level && LVL[r.level]
        ? '<span class="lvl ' + LVL[r.level][0] + '" style="font-size:.55rem;padding:.05rem .35rem">' + LVL[r.level][1] + '</span>' : "";
      return '<div class="sug-item" data-i="' + i + '">' +
        modeBadge(r.mode) +
        '<div style="flex:1;min-width:0">' +
          '<div style="color:#e2e8f0;font-size:.88rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(r.title) + '</div>' +
          '<div style="color:#64748b;font-size:.72rem">' + MODES[r.mode].label + (r.tag ? ' · ' + esc(r.tag) : '') + '</div>' +
        '</div>' + lvl +
      '</div>';
    }).join("");
    suggest.classList.remove("hidden");

    suggest.querySelectorAll(".sug-item[data-i]").forEach(function (el) {
      el.addEventListener("click", function () { choose(curResults[+el.dataset.i]); });
    });
  }

  function popular() {
    return POPULAR.map(function (p) {
      var e = searchIndex.find(function (x) { return x.id === p[1]; }) || {};
      return { mode: p[0], id: p[1], title: p[2], tag: e.tag || "", level: e.level || "" };
    });
  }

  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { renderSuggest(popular(), true); return; }
    var terms = q.split(/\s+/);
    var scored = [];
    searchIndex.forEach(function (e) {
      var score = 0, ok = true;
      terms.forEach(function (t) {
        var ti = e.title.toLowerCase().indexOf(t);
        var hi = e.hay.indexOf(t);
        if (hi === -1) { ok = false; return; }
        if (ti === 0) score += 50; else if (ti > -1) score += 30; else score += 8;
        if (e.tag.toLowerCase().indexOf(t) > -1) score += 12;
      });
      if (ok) scored.push({ e: e, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    renderSuggest(scored.slice(0, 8).map(function (s) { return s.e; }), false);
  }

  function choose(r) {
    if (!r) return;
    suggest.classList.add("hidden");
    searchBox.blur();
    jumpTo(r.id, true);
  }

  function moveSel(d) {
    var items = suggest.querySelectorAll(".sug-item[data-i]");
    if (!items.length) return;
    selIdx = (selIdx + d + items.length) % items.length;
    items.forEach(function (el, i) {
      el.classList.toggle("sel", i === selIdx);
      if (i === selIdx) el.scrollIntoView({ block: "nearest" });
    });
  }

  searchBox.addEventListener("focus", function () { runSearch(searchBox.value); });
  searchBox.addEventListener("input", function () { runSearch(searchBox.value); });
  searchBox.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); moveSel(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveSel(-1); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (selIdx > -1 && curResults[selIdx]) choose(curResults[selIdx]);
      else if (curResults[0]) choose(curResults[0]);
    } else if (e.key === "Escape") { suggest.classList.add("hidden"); searchBox.blur(); }
  });

  // close suggestions on outside click
  document.addEventListener("click", function (e) {
    if (!suggest.contains(e.target) && e.target !== searchBox) suggest.classList.add("hidden");
  });

  // global "/" focuses search
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== searchBox &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); searchBox.focus();
    }
  });

  /* ---------- wiring ---------- */
  modeBar.addEventListener("click", function (e) {
    var b = e.target.closest(".mode-btn");
    if (b) setMode(b.dataset.mode);
  });

  // delegate TOC + in-content anchor clicks
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (id.indexOf("/") > -1 || MODES[id]) return; // mode hash, let it be
    if (searchIndex.find(function (x) { return x.id === id; })) {
      e.preventDefault(); jumpTo(id, true);
    }
  });

  backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  window.addEventListener("hashchange", function () {
    var h = readHash();
    if (h && h.mode !== currentMode && MODES[h.mode]) setMode(h.mode, h.id);
  });

  /* ---------- boot ---------- */
  buildAll();
  var h = readHash();
  if (h && MODES[h.mode]) setMode(h.mode, h.id);
  else setMode("html");
})();
