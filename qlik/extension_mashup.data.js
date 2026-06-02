/* ============================================================
   Qlik Dev Training Ground — content data
   Each mode: { label, icon, sections:[ {id,title,level,tag,body} ] }
   level: 'f' fresher | 'i' intermediate | 'a' advanced | '' (n/a)
   body: HTML string. Code blocks use <pre><code class="language-x">…</code></pre>
         and are auto-wrapped (header + copy) by the app.
   In code blocks, escape < > & as &lt; &gt; &amp;
   ============================================================ */
const MODES = {

/* ============================================================ EXTENSION */
extension: { label:"Extension", icon:"fa-puzzle-piece", color:"blue", sections:[

  { id:"ext-overview", title:"What Is an Extension", level:"f", tag:"Concept", body:`
    <p class="text-slate-300 text-sm leading-relaxed">An <strong>extension</strong> is a custom visualization widget that runs <em>inside</em> a Qlik Sense sheet. It uses the same Capability APIs as a mashup but is packaged differently and deployed to the Qlik Sense server. It can also be embedded inside a mashup page as an object.</p>
    <table class="ref-table mt-3"><thead><tr><th>Aspect</th><th>Extension</th><th>Mashup</th></tr></thead><tbody>
      <tr><td>What it is</td><td>Custom viz inside Qlik sheets</td><td>External web page embedding Qlik objects</td></tr>
      <tr><td>Files</td><td><code>.js .qext .wbl</code> (+ <code>template.html</code> if AngularJS)</td><td><code>.html .js .css .qext .wbl</code></td></tr>
      <tr><td>Deployment</td><td><code>Documents\\Qlik\\Sense\\Extensions\\</code></td><td>Dev-Hub or web server</td></tr>
      <tr><td>Use case</td><td>New chart types, custom UI in sheets</td><td>Dashboards, portals, embedded analytics</td></tr>
    </tbody></table>
    <div class="secNote tip"><strong>Dev-Hub:</strong> create &amp; manage everything at <span class="ic">http://localhost:4848/dev-hub/</span></div>` },

  { id:"ext-files", title:"File Structure", level:"f", tag:"Setup", body:`
    <table class="ref-table"><thead><tr><th>File</th><th>Required</th><th>Purpose</th></tr></thead><tbody>
      <tr><td><code>extName.js</code></td><td><span class="tag tag-green">Yes</span></td><td>Main logic — paint, properties, API calls</td></tr>
      <tr><td><code>extName.qext</code></td><td><span class="tag tag-green">Yes</span></td><td>Metadata — name, version, type, author</td></tr>
      <tr><td><code>extName.wbl</code></td><td><span class="tag tag-green">Yes</span></td><td>File manifest — lists every file</td></tr>
      <tr><td><code>template.html</code></td><td><span class="tag tag-slate">Optional</span></td><td>HTML template (AngularJS only)</td></tr>
      <tr><td><code>extName.css</code></td><td><span class="tag tag-slate">Optional</span></td><td>Custom styles</td></tr>
      <tr><td><code>Logo.png</code></td><td><span class="tag tag-slate">Optional</span></td><td>Dev-Hub preview (140×140 px)</td></tr>
    </tbody></table>
    <div class="secNote warn"><code>.wbl</code> and <code>.qext</code> are mandatory — the extension will not load without both.</div>` },

  { id:"ext-qext", title:"QEXT File — Metadata", level:"f", tag:"Setup", body:`
    <p class="text-slate-300 text-sm">The <span class="ic">.qext</span> file is JSON. Defines how Qlik recognizes and displays your extension.</p>
    <pre><code class="language-json">{
  "name": "MyExtension",
  "description": "Basic empty visualization template",
  "type": "visualization",
  "version": "1.0.0",
  "icon": "extension",
  "preview": "Logo.png",
  "author": "Ajay.R.Kakkar",
  "keywords": "qlik-sense, visualization",
  "license": "1.0",
  "repository": "https://github.com/yourrepo",
  "dependencies": { "qlik-sense": "&gt;=3.0.x" }
}</code></pre>
    <table class="ref-table"><thead><tr><th>Field</th><th>Description</th></tr></thead><tbody>
      <tr><td><code>type</code></td><td>Always <code>"visualization"</code> for extensions</td></tr>
      <tr><td><code>version</code></td><td>Semantic version, e.g. <code>"1.0.0"</code></td></tr>
      <tr><td><code>icon</code></td><td>Icon class shown in Dev-Hub</td></tr>
      <tr><td><code>preview</code></td><td>Preview image filename (140×140)</td></tr>
      <tr><td><code>dependencies</code></td><td><code>"&gt;=3.0.x"</code> = Qlik Sense 3.0 or higher</td></tr>
    </tbody></table>` },

  { id:"ext-wbl", title:"WBL File — Manifest", level:"f", tag:"Setup", body:`
    <p class="text-slate-300 text-sm">Lists every file in the package, one per line, semicolon-separated.</p>
    <pre><code class="language-markup">extName.js;
extName.qext;
extName.css;
Logo.png</code></pre>` },

  { id:"ext-module", title:"JS Module Skeleton", level:"i", tag:"Core", body:`
    <p class="text-slate-300 text-sm">Main JS uses the AMD (RequireJS) module pattern.</p>
    <pre><code class="language-javascript">define([
    "qlik",
    "jquery",
    "./properties"          // optional separate property file
], function(qlik, $, properties) {
    'use strict';

    return {
        definition: properties,          // property panel
        initialProperties: {
            version: 1.0,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{ qWidth: 10, qHeight: 50 }]
            }
        },
        // Called on every render / data change
        paint: function($element, layout) {
            var app  = qlik.currApp(this);
            var data = layout.qHyperCube.qDataPages[0].qMatrix;

            var html = "&lt;table&gt;";
            data.forEach(function(row) {
                html += "&lt;tr&gt;";
                row.forEach(function(cell) { html += "&lt;td&gt;" + cell.qText + "&lt;/td&gt;"; });
                html += "&lt;/tr&gt;";
            });
            html += "&lt;/table&gt;";

            $element.html(html);
            return qlik.Promise.resolve();
        }
    };
});</code></pre>` },

  { id:"ext-paint", title:"Paint — Reading HyperCube Data", level:"i", tag:"Data", body:`
    <p class="text-slate-300 text-sm"><span class="ic">paint($element, layout)</span> runs each render. Data lives in the HyperCube matrix.</p>
    <pre><code class="language-javascript">paint: function($element, layout) {
    var matrix = layout.qHyperCube.qDataPages[0].qMatrix;

    matrix.forEach(function(row) {
        var dimText  = row[0].qText;        // dimension text
        var dimNum   = row[0].qNum;         // dimension numeric
        var measText = row[1].qText;        // measure text
        var measNum  = row[1].qNum;         // measure numeric
        var elemNum  = row[0].qElemNumber;  // element number (for selections)
        var state    = row[0].qState;       // "S" "O" "A" "X"
    });

    // Custom property panel values
    var myProp = layout.props.myCustomSetting;
}</code></pre>
    <table class="ref-table"><thead><tr><th>Cell prop</th><th>Meaning</th></tr></thead><tbody>
      <tr><td><code>qText</code></td><td>Formatted display value</td></tr>
      <tr><td><code>qNum</code></td><td>Raw numeric value</td></tr>
      <tr><td><code>qElemNumber</code></td><td>Element index — used by <code>.select()</code></td></tr>
      <tr><td><code>qState</code></td><td>S=selected, O=optional, A=alternative, X=excluded</td></tr>
    </tbody></table>` },

  { id:"ext-props", title:"Property Panel", level:"a", tag:"UI", body:`
    <p class="text-slate-300 text-sm">Controls the settings shown in the right panel when the extension is selected on a sheet.</p>
    <pre><code class="language-javascript">// properties.js
define([], function() {
    var dimensions = { uses: "dimensions", min: 1, max: 1 };
    var measures   = { uses: "measures",   min: 1, max: 5 };
    var sorting    = { uses: "sorting" };

    var settings = {
        uses: "settings",
        items: {
            myCustomSetting: {
                type: "string", label: "My Custom Label",
                ref: "props.myCustomSetting", defaultValue: "Default"
            },
            colorPicker: {
                type: "string", label: "Color", ref: "props.color",
                component: "color-picker", defaultValue: { color: "#4477aa" }
            }
        }
    };

    return {
        type: "items", component: "accordion",
        items: { dimensions: dimensions, measures: measures, sorting: sorting, settings: settings }
    };
});</code></pre>
    <table class="ref-table"><thead><tr><th>type</th><th>component</th><th>Renders</th></tr></thead><tbody>
      <tr><td><code>"string"</code></td><td>—</td><td>Text input</td></tr>
      <tr><td><code>"boolean"</code></td><td><code>"switch"</code></td><td>Toggle</td></tr>
      <tr><td><code>"number"</code></td><td>—</td><td>Number input</td></tr>
      <tr><td><code>"string"</code></td><td><code>"dropdown"</code></td><td>Select (needs <code>options</code>)</td></tr>
      <tr><td><code>"string"</code></td><td><code>"color-picker"</code></td><td>Color picker</td></tr>
      <tr><td><code>"string"</code></td><td><code>"expression"</code></td><td>Qlik expression editor</td></tr>
    </tbody></table>` },

  { id:"ext-select", title:"Making Selections", level:"a", tag:"Interaction", body:`
    <p class="text-slate-300 text-sm">Click a rendered element → select its value by element number.</p>
    <pre><code class="language-javascript">paint: function($element, layout) {
    var self = this;
    $element.find(".my-item").on("click", function() {
        var elemNum = parseInt($(this).attr("data-elem"));
        // (dimensionIndex, elemNumbers[], toggle)
        self.selectValues(0, [elemNum], true);
    });
}</code></pre>
    <div class="secNote tip">Use <span class="ic">self.backendApi</span> / <span class="ic">self.selectValues()</span> inside the extension scope — <code>this</code> is the extension object.</div>` },

  { id:"ext-enigma", title:"Enigma Access from Extension", level:"a", tag:"Engine", body:`
    <p class="text-slate-300 text-sm">Drop to the low-level engine when Capability API is not enough (scripts, master items).</p>
    <pre><code class="language-javascript">paint: function($element, layout) {
    var app    = qlik.currApp(this);
    var enigma = app.model.enigmaModel.app;   // the engine handle
    enigma.getScript().then(function(script) { console.log(script); });
}</code></pre>
    <div class="secNote">Full Enigma method list lives in the <strong>Mashup → Enigma.js</strong> section — identical API in both contexts.</div>` },

  { id:"ext-paging", title:"Multi-Dimension &amp; Paging Past 10k Cells", level:"a", tag:"Data", body:`
    <p class="text-slate-300 text-sm">A single data page is capped at <strong>10,000 cells</strong> (<code>qWidth &times; qHeight</code>). With multiple dimensions/measures the column count grows, so the row count per page shrinks. For large tables, fetch extra pages with <span class="ic">backendApi.getData()</span>.</p>
    <p class="text-slate-400 text-sm mt-2">Column count = number of dimensions + number of measures. Read it from <code>qHyperCube.qSize.qcx</code>; total rows from <code>qcy</code>.</p>
    <pre><code class="language-javascript">initialProperties: {
    version: 1.0,
    qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        // 10 cols * 1000 rows = 10000 cells (the per-page max)
        qInitialDataFetch: [{ qTop: 0, qLeft: 0, qWidth: 10, qHeight: 1000 }]
    }
}</code></pre>
    <pre><code class="language-javascript">paint: function($element, layout) {
    var self      = this;
    var cube      = layout.qHyperCube;
    var colCount  = cube.qSize.qcx;                       // dims + measures
    var totalRows = cube.qSize.qcy;
    var pageRows  = Math.floor(10000 / colCount);         // max rows per fetch
    var allRows   = cube.qDataPages[0].qMatrix.slice();   // first page already loaded

    function fetchNext() {
        if (allRows.length &gt;= totalRows) return qlik.Promise.resolve();
        var req = [{
            qTop:    allRows.length,
            qLeft:   0,
            qWidth:  colCount,
            qHeight: Math.min(pageRows, totalRows - allRows.length)
        }];
        return self.backendApi.getData(req).then(function(dataPages) {
            allRows = allRows.concat(dataPages[0].qMatrix);
            return fetchNext();                           // recurse until complete
        });
    }

    return fetchNext().then(function() {
        // allRows now holds every row — render here
        var nDims = cube.qDimensionInfo.length;           // first nDims cells = dimensions
        allRows.forEach(function(row) {
            var dims     = row.slice(0, nDims);
            var measures = row.slice(nDims);
        });
    });
}</code></pre>
    <div class="secNote warn">Never request more than 10,000 cells in one page — the engine rejects it. Always loop with <code>qTop</code> offsets.</div>
    <div class="secNote tip"><code>backendApi.getData()</code> handles offsets for you; <code>backendApi.getRowCount()</code> returns total rows.</div>` },

  { id:"ext-export", title:"Export &amp; Snapshot Support Flags", level:"a", tag:"Ops", body:`
    <p class="text-slate-300 text-sm">Declare what your extension supports so Qlik shows the right context-menu actions (export, snapshot for stories, export data to Excel).</p>
    <pre><code class="language-javascript">return {
    initialProperties: { /* ... */ },
    definition: properties,
    support: {
        snapshot:   true,    // can be used in Storytelling snapshots
        export:     true,    // export to image / PDF
        exportData: true     // export underlying data to .xlsx / .csv
    },
    paint: function($element, layout) { /* ... */ }
};</code></pre>
    <p class="text-slate-400 text-sm mt-2">When <code>snapshot:true</code>, render from <code>layout.snapshotData</code> if present (frozen data) instead of live data:</p>
    <pre><code class="language-javascript">paint: function($element, layout) {
    var isSnapshot = !!layout.snapshotData;
    var matrix = isSnapshot
        ? layout.snapshotData.content.qHyperCube.qDataPages[0].qMatrix
        : layout.qHyperCube.qDataPages[0].qMatrix;
    // reduced data keeps snapshots light — see getHyperCubeReducedData
}</code></pre>
    <pre><code class="language-javascript">// Trigger data export programmatically
this.backendApi.exportData("OOXML", "/qHyperCubeDef", "MyExtensionData")
    .then(function(url) { window.open(url); });</code></pre>
    <table class="ref-table mt-3"><thead><tr><th>Flag</th><th>Effect</th></tr></thead><tbody>
      <tr><td><code>snapshot</code></td><td>Allows use inside Storytelling; pass frozen <code>snapshotData</code></td></tr>
      <tr><td><code>export</code></td><td>Adds "Export to image/PDF" to the context menu</td></tr>
      <tr><td><code>exportData</code></td><td>Adds "Export data" — needs a valid HyperCube path</td></tr>
    </tbody></table>` },

  { id:"ext-theme", title:"Theming — qlik-styles &amp; Theme API", level:"i", tag:"UI", body:`
    <p class="text-slate-300 text-sm">Read the active Qlik theme so your custom UI matches sheet colors and fonts, and re-paint when the user switches theme.</p>
    <pre><code class="language-javascript">define(["qlik", "client.property-panel/components/buttongroup/buttongroup",
        "css!./styles.css"], function(qlik) {

    return {
        paint: function($element, layout) {
            var self = this;
            qlik.theme.getApplied().then(function(theme) {
                // pull resolved values from the active theme
                var fg = theme.getStyle("object", "", "color");
                var bg = theme.getStyle("object", "", "backgroundColor");
                var ff = theme.getStyle("object", "", "fontFamily");
                $element.css({ color: fg, background: bg, fontFamily: ff });
            });
        }
    };
});</code></pre>
    <p class="text-slate-400 text-sm mt-2">Use Qlik's own <strong>qlik-styles</strong> CSS classes instead of hard-coded colors so the extension inherits theme variables:</p>
    <pre><code class="language-markup">&lt;!-- inherits theme typography / spacing --&gt;
&lt;div class="qv-object lui-list"&gt;
  &lt;span class="lui-list__text"&gt;Themed text&lt;/span&gt;
  &lt;button class="lui-button"&gt;Themed button&lt;/button&gt;
&lt;/div&gt;</code></pre>
    <div class="secNote tip">Chart color palettes belong in a Qlik <strong>custom theme</strong> JSON, not in extension CSS — that keeps storytelling/export consistent. See <strong>Mashup &rarr; Theme Switching</strong> for runtime swaps.</div>` },

  { id:"ext-debug", title:"Debugging — Dev-Hub &amp; DevTools", level:"f", tag:"Ops", body:`
    <table class="ref-table"><thead><tr><th>Technique</th><th>How</th></tr></thead><tbody>
      <tr><td>Single Configurator</td><td>Dev-Hub &rarr; build &amp; preview extension live at <span class="ic">localhost:4848/dev-hub/</span></td></tr>
      <tr><td>Source maps</td><td>Chrome F12 &rarr; Sources &rarr; <code>localhost:4848</code> &rarr; <code>extensions/&lt;name&gt;/</code></td></tr>
      <tr><td>Inspect layout</td><td><code>console.log(JSON.stringify(layout.qHyperCube, null, 2))</code> inside <code>paint</code></td></tr>
      <tr><td>Live engine calls</td><td>F12 &rarr; Network &rarr; WS &rarr; watch <code>app.openDoc</code> / <code>GetLayout</code> frames</td></tr>
      <tr><td>Engine API explorer</td><td><span class="ic">localhost:4848/dev-hub/engine-data/</span> — test calls against your app</td></tr>
      <tr><td>Force reload</td><td>Hard refresh (Ctrl+Shift+R) — Qlik caches extension JS aggressively</td></tr>
    </tbody></table>
    <pre><code class="language-javascript">paint: function($element, layout) {
    console.group("Ext debug");
    console.log("rows", layout.qHyperCube.qSize.qcy);
    console.log("props", layout.props);
    console.table(layout.qHyperCube.qDataPages[0].qMatrix.map(function(r) {
        return { dim: r[0].qText, measure: r[1] &amp;&amp; r[1].qNum };
    }));
    console.groupEnd();
}</code></pre>
    <div class="secNote warn">Extension JS is cached hard. After edits, hard-refresh or bump the <code>.qext</code> version to bust the cache.</div>` },

  { id:"ext-deploy", title:"Deployment", level:"i", tag:"Ops", body:`
    <table class="ref-table"><thead><tr><th>Environment</th><th>Path / Method</th></tr></thead><tbody>
      <tr><td>Desktop (Windows)</td><td><code>%USERPROFILE%\\Documents\\Qlik\\Sense\\Extensions\\&lt;Ext&gt;\\</code></td></tr>
      <tr><td>Server</td><td>QMC → Extensions → Import <code>.zip</code></td></tr>
    </tbody></table>
    <div class="secNote tip"><strong>Find loaded extensions in Chrome:</strong> F12 → Sources → <code>localhost:4848</code> → <code>extensions/</code> folder.</div>` },
]},

/* ============================================================ MASHUP */
mashup: { label:"Mashup", icon:"fa-layer-group", color:"purple", sections:[

  { id:"mash-overview", title:"What Is a Mashup", level:"f", tag:"Concept", body:`
    <p class="text-slate-300 text-sm leading-relaxed">A <strong>mashup</strong> is a web page or app that embeds Qlik Sense content (charts, filters, selections) alongside your own HTML/CSS/JS. It talks to the Qlik engine through the <strong>Capability API</strong>.</p>
    <p class="text-slate-400 text-sm mt-2">Prerequisites: a published Qlik Sense app, base UI design, HTML/CSS, and Bootstrap or custom CSS knowledge.</p>
    <div class="secNote tip">Same host/domain → no extra license for dev. Public/external access → license per concurrent user.</div>` },

  { id:"mash-files", title:"File Structure", level:"f", tag:"Setup", body:`
    <table class="ref-table"><thead><tr><th>File</th><th>Required</th><th>Purpose</th></tr></thead><tbody>
      <tr><td><code>mashup.html</code></td><td><span class="tag tag-green">Yes</span></td><td>Page structure — divs, placeholders, buttons</td></tr>
      <tr><td><code>mashup.js</code></td><td><span class="tag tag-green">Yes</span></td><td>App connection, object placement, API calls</td></tr>
      <tr><td><code>mashup.css</code></td><td><span class="tag tag-green">Yes</span></td><td>Page styles</td></tr>
      <tr><td><code>mashup.qext</code></td><td><span class="tag tag-green">Yes</span></td><td>Metadata — <code>"type": "mashup"</code></td></tr>
      <tr><td><code>mashup.wbl</code></td><td><span class="tag tag-green">Yes</span></td><td>File manifest</td></tr>
    </tbody></table>
    <pre><code class="language-json">{ "name": "MyMashup", "type": "mashup", "version": "1.0.0",
  "author": "Ajay Kakkar", "dependencies": { "qlik-sense": "&gt;=2.1.x" } }</code></pre>` },

  { id:"mash-html", title:"HTML Structure", level:"f", tag:"Layout", body:`
    <pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;My Mashup&lt;/title&gt;
  &lt;!-- Qlik styles — REQUIRED --&gt;
  &lt;link rel="stylesheet" href="../../resources/autogenerated/qlik-styles.css"&gt;
  &lt;link rel="stylesheet" href="mashup.css"&gt;
  &lt;base href="/"&gt;
  &lt;script src="../../resources/assets/external/requirejs/require.js"&gt;&lt;/script&gt;
  &lt;script src="mashup.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="toolbar"&gt;&lt;/div&gt;
  &lt;div class="qvplaceholder" id="chart1" style="width:600px;height:400px;"&gt;&lt;/div&gt;
  &lt;div class="qvplaceholder" id="chart2" style="width:600px;height:400px;"&gt;&lt;/div&gt;
  &lt;button id="clearAll"&gt;Clear All&lt;/button&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
    <table class="ref-table"><thead><tr><th>Class</th><th>State</th></tr></thead><tbody>
      <tr><td><code>qvplaceholder</code></td><td>Before object assigned — drop target in Dev-Hub</td></tr>
      <tr><td><code>qvobject</code></td><td>After object assigned — holds rendered viz</td></tr>
    </tbody></table>
    <div class="secNote warn"><code>id</code> must be unique per page — two identical IDs = one blank object.</div>` },

  { id:"mash-js", title:"JS Setup — openApp", level:"i", tag:"Core", body:`
    <pre><code class="language-javascript">require.config({
    baseUrl: (window.location.hostname === "localhost")
        ? "http://localhost:4848/resources"
        : "/resources"
});

require(["js/qlik"], function(qlik) {
    qlik.setOnError(function(error) { console.log(error); });

    var app = qlik.openApp("YOUR-APP-ID", {
        host: window.location.hostname,
        prefix: "/",
        port: window.location.port,
        isSecure: window.location.protocol === "https:"
    });

    app.getObject("chart1", "QLIK-OBJECT-ID");
    app.getObject("toolbar", "CurrentSelections");   // built-in selection bar

    document.getElementById("clearAll")
        .addEventListener("click", function() { app.clearAll(); });
});</code></pre>
    <table class="ref-table"><thead><tr><th>Environment</th><th>appId value</th></tr></thead><tbody>
      <tr><td>Server</td><td>App GUID, e.g. <code>"133dab5d-8f56-4d40-…"</code></td></tr>
      <tr><td>Desktop</td><td>Full QVF path, e.g. <code>"C:/Users/You/…/MyApp.qvf"</code></td></tr>
    </tbody></table>
    <div class="secNote tip"><code>"CurrentSelections"</code> is a built-in object ID for the selection toolbar.</div>` },

  { id:"mash-render", title:"Rendering Objects", level:"i", tag:"Viz", body:`
    <pre><code class="language-javascript">// Method 1 — simple
app.getObject("div-id", "qlik-object-id");

// Method 2 — promise-based, more control
app.visualization.get("qlik-object-id").then(function(model) {
    model.show("div-id");
});

// Create a list object from a field
app.createList({
    qDef: { qFieldDefs: ["Country"] },
    qInitialDataFetch: [{ qTop:0, qLeft:0, qHeight:100, qWidth:1 }]
}, function(reply) { console.log(reply); });</code></pre>` },

  { id:"mash-field", title:"Field API — Selections", level:"i", tag:"Capability API", body:`
    <p class="text-slate-300 text-sm">All selections flow through the associative engine — related fields update automatically.</p>
    <pre><code class="language-javascript">app.field("Country").clear();
app.field("Country").clearOther(true);    // clear all OTHER fields (+ locked)
app.field("Country").lock();
app.field("Country").unlock();
app.field("Country").selectAll();
app.field("Country").selectPossible();    // green values
app.field("Country").selectAlternative();
app.field("Country").selectExcluded();

// (elemNumbers[], toggle, softLock)
app.field("Country").select([0, 1, 2], false, false);
app.field("Country").toggleSelect("Germany", false);
app.field("Country").selectMatch("Ger*", false);

// App-level
app.clearAll();  app.clearAll(true);  app.lockAll();  app.unlockAll();
app.back();      app.forward();</code></pre>
    <table class="ref-table"><thead><tr><th>State</th><th>Color</th><th>Meaning</th></tr></thead><tbody>
      <tr><td><code>"S"</code></td><td>Green</td><td>Selected</td></tr>
      <tr><td><code>"O"</code></td><td>White</td><td>Optional / available</td></tr>
      <tr><td><code>"A"</code></td><td>Light grey</td><td>Alternative</td></tr>
      <tr><td><code>"X"</code></td><td>Dark grey</td><td>Excluded</td></tr>
    </tbody></table>` },

  { id:"mash-variable", title:"Variable API", level:"i", tag:"Capability API", body:`
    <pre><code class="language-javascript">// Read
app.variable.getContent("vPeriod", function(reply) {
    console.log(reply.qContent.qString);   // string value
    console.log(reply.qContent.qNumber);   // numeric value
    console.log(reply.qContent.qIsNum);    // boolean
});

// Write
app.variable.setStringValue("vPeriod", "Month");
app.variable.setNumValue("vThreshold", 100);
app.variable.setContent("vAny", "value");

// Metadata (promise)
app.variable.getByName("vPeriod").then(function(model) {
    model.getProperties().then(function(p) { console.log(p); });
});</code></pre>
    <div class="secNote tip">Changing a variable triggers recalculation across the whole app — great for dynamic measures / set analysis.</div>` },

  { id:"mash-bookmark", title:"Bookmark API", level:"i", tag:"Capability API", body:`
    <pre><code class="language-javascript">// List
app.getList("BookmarkList", function(reply) {
    $.each(reply.qBookmarkList.qItems, function(k, v) {
        console.log(v.qData.title, v.qInfo.qId);
    });
});

// Create — captures current selection state (returns promise)
app.bookmark.create("Q1 2024", "Sales filtered to Q1").then(function() {
    console.log("created");
});

app.bookmark.apply("BOOKMARK-ID");    // restore selection
app.bookmark.remove("BOOKMARK-ID");   // delete permanently</code></pre>` },

  { id:"mash-viz", title:"Visualization &amp; Export", level:"a", tag:"Capability API", body:`
    <p class="text-slate-300 text-sm">Create charts on-the-fly and export data/images/PDF.</p>
    <pre><code class="language-javascript">// On-the-fly chart (temporary — destroyed when page closes)
app.visualization.create(
    "barchart",
    ["Country", "=Sum(Sales)"],
    { "title": "Sales by Country", "showLegend": false }
).then(function(viz) { viz.show("chart-container"); });

// Export data as Excel
app.visualization.get("OBJECT-ID").then(function(model) {
    model.show("salesChart");
    qlik.table(model).exportData({ download: true, format: "OOXML" });
});

// Export image / PDF
model.exportImg({ width:1200, height:800, format:"PNG" }).then(u =&gt; window.open(u));
model.exportPdf({ documentSize:"A4", orientation:"landscape" }).then(u =&gt; window.open(u));</code></pre>
    <table class="ref-table"><thead><tr><th>type string</th><th>Chart</th></tr></thead><tbody>
      <tr><td><code>barchart linechart piechart</code></td><td>Bar / Line / Pie</td></tr>
      <tr><td><code>scatterplot combochart waterfallchart</code></td><td>Scatter / Combo / Waterfall</td></tr>
      <tr><td><code>table pivot-table treemap</code></td><td>Table / Pivot / Treemap</td></tr>
      <tr><td><code>kpi gauge map text-image</code></td><td>KPI / Gauge / Map / Text</td></tr>
    </tbody></table>
    <table class="ref-table"><thead><tr><th>exportData format</th><th>File</th></tr></thead><tbody>
      <tr><td><code>"OOXML"</code></td><td>.xlsx (Excel) — default</td></tr>
      <tr><td><code>"CSV_C"</code></td><td>.csv (comma)</td></tr>
      <tr><td><code>"CSV_T"</code></td><td>.csv (tab)</td></tr>
    </tbody></table>` },

  { id:"mash-getlist", title:"App API — getList &amp; Generic Objects", level:"a", tag:"Capability API", body:`
    <pre><code class="language-javascript">// Subscribe to a list (fires on every update)
app.getList("sheet",        cb);   // reply.qAppObjectList.qItems
app.getList("MasterObject", cb);   // reply.qAppObjectList.qItems
app.getList("story",        cb);   // reply.qAppObjectList.qItems
app.getList("VariableList", cb);   // reply.qVariableList.qItems
app.getList("BookmarkList", cb);   // reply.qBookmarkList.qItems

// App metadata via generic object
app.createGenericObject({
    user:    { qStringExpression: "=QVUser()" },
    version: { qStringExpression: "=QlikViewVersion()" },
    fields:  { qValueExpression:  "=Count(DISTINCT $Field)" }
}, function(reply) {
    $("#info").html("v" + reply.version + " · " + reply.fields + " fields");
});

// Master measures
app.createGenericObject({
    qMeasureListDef: { qType: "measure", qData: { qMeasure: "/qMeasure" } }
}, function(reply) {
    $.each(reply.qMeasureList.qItems, function(k, v) {
        console.log(v.qInfo.qId, v.qData.qMeasure.qLabel);
    });
});</code></pre>` },

  { id:"mash-nav-theme", title:"Navigation &amp; Theme API", level:"i", tag:"Capability API", body:`
    <pre><code class="language-javascript">qlik.navigation.getCurrentSheetId();
qlik.navigation.getMode();                 // "analysis" | "edit"
qlik.navigation.setMode(qlik.navigation.EDIT);
qlik.navigation.gotoSheet("SHEET-ID");
qlik.navigation.nextSheet();
qlik.navigation.prevSheet();
qlik.navigation.gotoStory("STORY-ID");

qlik.getThemeList().then(function(list) {
    list.forEach(v =&gt; console.log(v.name, v.id));
});
qlik.theme.apply("THEME-ID");
qlik.theme.get("THEME-ID").then(t =&gt; console.log(t));

qlik.resize();              // resize all objects
qlik.resize("objectId");    // resize one</code></pre>` },

  { id:"mash-enigma", title:"Enigma.js — Direct Engine", level:"a", tag:"Engine", body:`
    <p class="text-slate-300 text-sm">JSON-RPC over WebSocket to the QIX engine. Use when Capability API can't reach it — load scripts, master item properties, raw objects.</p>
    <pre><code class="language-javascript">// Get the handle
var enigma = app.model.enigmaModel.app;

enigma.getVariableById("id").then(m =&gt; m.getProperties())
    .then(p =&gt; console.log(p.qName, p.qDefinition, p.qIsReserved));

enigma.getMeasure("id").then(m =&gt; m.getProperties());   // .qMeasure.qDef / qLabel
enigma.getDimension("id").then(m =&gt; m.getProperties()); // .qDim.qFieldDefs
enigma.getObject("id").then(m =&gt; m.getProperties());    // any generic object
enigma.getScript().then(s =&gt; console.log(s));           // full load script</code></pre>
    <table class="ref-table"><thead><tr><th>Task</th><th>Capability API</th><th>Enigma.js</th></tr></thead><tbody>
      <tr><td>Select / render / bookmark</td><td>✅</td><td>not needed</td></tr>
      <tr><td>Read load script</td><td>❌</td><td><code>getScript()</code></td></tr>
      <tr><td>Master item properties</td><td>❌</td><td><code>getMeasure/getDimension()</code></td></tr>
      <tr><td>Raw engine ops</td><td>❌</td><td><code>getObject()</code></td></tr>
    </tbody></table>` },

  { id:"mash-qrs", title:"QRS API — Admin REST", level:"a", tag:"Enterprise", body:`
    <p class="text-slate-300 text-sm">Repository Service REST API for admin tasks — reload apps, trigger tasks. <strong>Enterprise only.</strong></p>
    <pre><code class="language-javascript">var app          = qlik.currApp(this);
var random       = Math.random().toString().substr(2).repeat(16).substr(0,16); // 16-char xrfkey
var VirtualProxy = "hdrreload";

var Settings = {
    timeout: 0,
    headers: {
        "X-Qlik-Xrfkey": random,
        "X-Qlik-User":  "UserDirectory=INTERNAL;UserId=sa_api"
    }
};

// Reload current app
$.ajax({ method:"POST",
    url:"/" + VirtualProxy + "/qrs/app/" + app.id + "/reload?xrfkey=" + random,
    ...Settings
}).done(r =&gt; console.log("reload ok")).fail(e =&gt; console.log(e));

// Trigger task / list tasks
$.ajax({ method:"POST", url:"/"+VirtualProxy+"/qrs/task/TASK-ID/start?xrfkey="+random, ...Settings });
$.ajax({ method:"GET",  url:"/"+VirtualProxy+"/qrs/task/full?xrfkey="+random,         ...Settings });</code></pre>
    <table class="ref-table"><thead><tr><th>Endpoint</th><th>Method</th><th>Use</th></tr></thead><tbody>
      <tr><td><code>/qrs/app</code></td><td>GET</td><td>List apps</td></tr>
      <tr><td><code>/qrs/app/{id}/reload</code></td><td>POST</td><td>Reload app</td></tr>
      <tr><td><code>/qrs/task/full</code></td><td>GET</td><td>List tasks</td></tr>
      <tr><td><code>/qrs/task/{id}/start</code></td><td>POST</td><td>Start task</td></tr>
      <tr><td><code>/qrs/about</code></td><td>GET</td><td>Server version</td></tr>
    </tbody></table>
    <div class="secNote warn"><strong>403 Forbidden</strong> = xrfkey mismatch (URL param ≠ header). <strong>401</strong> = wrong <code>X-Qlik-User</code>. Empty <code>[]</code> = wrong filter / app id.</div>` },

  { id:"mash-single", title:"Single Integration API (iframe)", level:"f", tag:"Embed", body:`
    <p class="text-slate-300 text-sm">Simplest embed — no JavaScript. One URL returns a full page with one visualization.</p>
    <pre><code class="language-markup">&lt;iframe
  src="https://your-server/single/?appid=APP-ID&amp;obj=OBJECT-ID&amp;select=Year,2012"
  frameborder="0" width="600" height="400"&gt;
&lt;/iframe&gt;</code></pre>
    <div class="secNote">Not very customizable — use the full mashup approach for custom UI.</div>` },

  { id:"mash-capability", title:"Capability API — Object Map", level:"f", tag:"Capability API", body:`
    <p class="text-slate-300 text-sm">The <strong>Capability API</strong> is the high-level mashup interface loaded from <code>require(["js/qlik"])</code>. Everything hangs off the global <code>qlik</code> object and the per-app <code>app</code> handle.</p>
    <pre><code class="language-javascript">require(["js/qlik"], function(qlik) {
    var app = qlik.openApp("APP-ID", config);
});</code></pre>
    <table class="ref-table"><thead><tr><th>Handle</th><th>What it gives you</th></tr></thead><tbody>
      <tr><td><code>qlik</code></td><td>Global root — <code>openApp</code>, <code>theme</code>, <code>setOnError</code>, <code>getAppList</code></td></tr>
      <tr><td><code>app</code></td><td>One open app — <code>getObject</code>, <code>getList</code>, <code>clearAll</code>, <code>doSave</code></td></tr>
      <tr><td><code>app.field(name)</code></td><td>Selections on a field — <code>selectValues</code>, <code>clear</code>, <code>getData</code></td></tr>
      <tr><td><code>app.variable</code></td><td>Read/write variables — <code>setStringValue</code>, <code>getByName</code></td></tr>
      <tr><td><code>app.bookmark</code></td><td>Bookmarks — <code>apply</code>, <code>create</code>, <code>getList</code></td></tr>
      <tr><td><code>app.selectionState()</code></td><td>Current selections object + clear/back/forward</td></tr>
      <tr><td><code>app.theme</code> / <code>qlik.theme</code></td><td>Apply &amp; read themes at runtime</td></tr>
      <tr><td><code>app.model.enigmaModel</code></td><td>Drop to low-level Enigma engine</td></tr>
    </tbody></table>
    <div class="secNote tip">Capability API is the classic Client-Managed path. For Qlik Cloud, prefer <strong>qlik-embed</strong> (next section).</div>` },

  { id:"mash-embed-compare", title:"qlik-embed vs Capability API", level:"i", tag:"Embed", body:`
    <p class="text-slate-300 text-sm"><strong>qlik-embed</strong> is the modern web-component / iframe approach for Qlik Cloud. The <strong>Capability API</strong> is the older mashup framework. Pick based on platform and control needed.</p>
    <table class="ref-table"><thead><tr><th>Aspect</th><th>qlik-embed</th><th>Capability API</th></tr></thead><tbody>
      <tr><td>Platform</td><td>Qlik Cloud (recommended)</td><td>Client-Managed + Cloud (legacy)</td></tr>
      <tr><td>Load</td><td><code>&lt;script&gt;</code> + <code>&lt;qlik-embed&gt;</code> web component</td><td><code>require(["js/qlik"])</code> RequireJS</td></tr>
      <tr><td>Auth</td><td>OAuth2 / API keys (modern)</td><td>Session cookie / ticket / JWT</td></tr>
      <tr><td>Isolation</td><td>Sandboxed iframe — no CSS leak</td><td>Runs in page DOM — CSS can clash</td></tr>
      <tr><td>Customization</td><td>Attributes + qlik-embed APIs</td><td>Full programmatic control</td></tr>
      <tr><td>Future</td><td>Actively developed</td><td>Maintenance only on Cloud</td></tr>
    </tbody></table>
    <pre><code class="language-markup">&lt;!-- Modern qlik-embed: declarative, sandboxed --&gt;
&lt;script crossorigin="anonymous" type="application/javascript"
  src="https://cdn.qlikcloud.com/qlik-embed/v1/qlik-embed.js"&gt;&lt;/script&gt;

&lt;qlik-embed
  ui="analytics/chart"
  app-id="APP-ID"
  object-id="OBJECT-ID"&gt;
&lt;/qlik-embed&gt;</code></pre>
    <div class="secNote tip">New Cloud projects: start with qlik-embed. Existing Client-Managed mashups: stay on Capability API.</div>` },

  { id:"mash-altstate", title:"Alternate States API", level:"a", tag:"Capability API", body:`
    <p class="text-slate-300 text-sm">Alternate states let one app hold independent selection sets — e.g. compare Region A vs Region B in the same sheet. Create a state, then bind objects or selections to it via <code>qStateName</code>.</p>
    <pre><code class="language-javascript">// 1. Create the state
app.addAlternateState("CompareA");
app.addAlternateState("CompareB");

// 2. Select within a state (independent of default $ state)
app.field("Region", "CompareA").selectValues([{ qText: "EMEA" }], false, true);
app.field("Region", "CompareB").selectValues([{ qText: "APAC" }], false, true);

// 3. Render an object in a given state
app.visualization.get("OBJECT-ID").then(function(viz) {
    viz.setProperties({ qStateName: "CompareA" });
    viz.show("placeholderDiv");
});

// 4. Clean up
app.removeAlternateState("CompareA");</code></pre>
    <table class="ref-table mt-3"><thead><tr><th>Method</th><th>Purpose</th></tr></thead><tbody>
      <tr><td><code>app.addAlternateState(name)</code></td><td>Create a new selection state</td></tr>
      <tr><td><code>app.removeAlternateState(name)</code></td><td>Delete a state</td></tr>
      <tr><td><code>field(name, state)</code></td><td>Target selections at a specific state</td></tr>
      <tr><td><code>qStateName</code></td><td>Property that binds an object to a state</td></tr>
    </tbody></table>
    <div class="secNote">Default state is <code>"$"</code>. Objects with no <code>qStateName</code> follow it.</div>` },

  { id:"mash-selbar", title:"Selection Toolbar &amp; Current Selections", level:"i", tag:"Capability API", body:`
    <p class="text-slate-300 text-sm">Qlik ships two built-in objects you can drop into a mashup: a <strong>current selections</strong> box and a <strong>selection toolbar</strong> (back / forward / clear). No app object IDs needed — use the reserved IDs.</p>
    <pre><code class="language-javascript">// Built-in current selections bar
app.getObject(document.getElementById("currSel"), "CurrentSelections");

// Built-in selection toolbar (back / forward / clear / lock)
app.getObject(document.getElementById("selToolbar"), "SelectionToolbar");</code></pre>
    <pre><code class="language-javascript">// Programmatic equivalents
app.clearAll();      // clear every selection
app.back();          // step selection history back
app.forward();       // step forward
app.lockAll();       // lock current selections

// Read live selections
app.selectionState().selections.forEach(function(sel) {
    console.log(sel.fieldName, sel.selectedCount, sel.qSelected);
});

// React to selection changes
app.selectionState().OnData.bind(function() {
    console.log("selections changed");
});</code></pre>
    <table class="ref-table mt-3"><thead><tr><th>Reserved ID</th><th>Renders</th></tr></thead><tbody>
      <tr><td><code>CurrentSelections</code></td><td>Active selections, per field, with clear buttons</td></tr>
      <tr><td><code>SelectionToolbar</code></td><td>Back / forward / clear-all / lock controls</td></tr>
    </tbody></table>` },

  { id:"mash-errors", title:"Error Handling &amp; Session Reconnect", level:"a", tag:"Engine", body:`
    <p class="text-slate-300 text-sm">Mashups talk to the engine over a WebSocket. Networks drop, sessions time out, and the engine throws. Handle both the Capability-API error hook and the Enigma session lifecycle.</p>
    <pre><code class="language-javascript">// Global Capability API error handler
qlik.setOnError(function(error) {
    console.error("Qlik error", error.code, error.message);
    showBanner("Connection issue: " + error.message);
});

// Watch the engine connection state
app.global.isPersonalMode(function() { /* ... */ });
app.global.session.on("suspended", function() { showBanner("Reconnecting…"); });
app.global.session.on("resumed",   function() { hideBanner(); });
app.global.session.on("closed",    function() { showBanner("Session closed — reload"); });</code></pre>
    <pre><code class="language-javascript">// Enigma.js: auto-reconnect with retry window
var session = enigma.create({
    schema: qixSchema,
    url: "wss://server/app/APP-ID",
    createSocket: function(url) { return new WebSocket(url); },
    suspendOnClose: true,                 // don't kill on transient drop
    responseInterceptors: [{
        onRejected: function(sessionRef, request, error) {
            if (error.code === 15 &amp;&amp; request.tries &lt; 3) {   // ABORTED
                request.tries = (request.tries || 0) + 1;
                return request.retry();
            }
            return this.Promise.reject(error);
        }
    }]
});
session.on("suspended", function() { /* show offline UI */ });
session.on("closed",    function() { /* full reconnect */ });</code></pre>
    <div class="secNote warn"><strong>Workbench</strong> dev pages mask errors — always test reconnect on a real deployed mashup, not just Dev-Hub.</div>` },

  { id:"mash-theme-runtime", title:"Theme Switching at Runtime", level:"i", tag:"Capability API", body:`
    <p class="text-slate-300 text-sm">Swap the Qlik chart theme live — e.g. a light/dark toggle that re-colors every embedded object without reload.</p>
    <pre><code class="language-javascript">// Apply a theme by ID (built-in or custom uploaded theme)
qlik.theme.apply("horizon").then(function() {
    console.log("theme applied — charts recolor automatically");
});

// Read the current theme and its resolved styles
qlik.theme.getApplied().then(function(theme) {
    var accent = theme.getStyle("object", "", "color");
    var palette = theme.properties.scales;        // color scales
});

// Simple dark/light toggle
function toggleTheme(dark) {
    return qlik.theme.apply(dark ? "sense" : "horizon");
}</code></pre>
    <table class="ref-table mt-3"><thead><tr><th>Built-in theme ID</th><th>Look</th></tr></thead><tbody>
      <tr><td><code>horizon</code></td><td>Default modern light theme</td></tr>
      <tr><td><code>sense</code></td><td>Classic Qlik Sense theme</td></tr>
      <tr><td><code>breeze</code> / <code>card</code></td><td>Alternate built-ins</td></tr>
      <tr><td>custom ID</td><td>Your uploaded theme extension</td></tr>
    </tbody></table>
    <div class="secNote tip">Theme changes apply to Qlik objects only. Style your own mashup chrome separately (CSS variables sync nicely with a class toggle on <code>&lt;body&gt;</code>).</div>` },

  { id:"mash-enigma-lifecycle", title:"Enigma.js — Generic Object Lifecycle", level:"a", tag:"Engine", body:`
    <p class="text-slate-300 text-sm">Below the Capability API, the engine speaks <strong>generic objects</strong>. The lifecycle: create a session object with a definition &rarr; subscribe to <code>changed</code> &rarr; pull <code>getLayout</code> &rarr; destroy when done. Enigma needs the QIX <strong>schema</strong> JSON for your engine version.</p>
    <pre><code class="language-javascript">// Schema is version-specific — load the matching enigma.js schema
var qixSchema = require("enigma.js/schemas/12.612.0.json");

var session = enigma.create({
    schema: qixSchema,
    url: "wss://server/app/APP-ID"
});

session.open()
    .then(function(global) { return global.openDoc("APP-ID"); })
    .then(function(doc) {
        // 1. CREATE a session object with a hypercube definition
        return doc.createSessionObject({
            qInfo: { qType: "my-cube" },
            qHyperCubeDef: {
                qDimensions: [{ qDef: { qFieldDefs: ["Country"] } }],
                qMeasures:   [{ qDef: { qDef: "Sum(Sales)" } }],
                qInitialDataFetch: [{ qWidth: 2, qHeight: 50 }]
            }
        });
    })
    .then(function(model) {
        // 2. SUBSCRIBE — fires on every data/selection change
        model.on("changed", function() {
            model.getLayout().then(function(layout) {
                render(layout.qHyperCube.qDataPages[0].qMatrix);
            });
        });
        // 3. INITIAL pull
        model.getLayout().then(function(layout) {
            render(layout.qHyperCube.qDataPages[0].qMatrix);
        });
        // 4. DESTROY when the view unmounts
        // doc.destroySessionObject(model.id);
    });</code></pre>
    <table class="ref-table mt-3"><thead><tr><th>Step</th><th>Call</th></tr></thead><tbody>
      <tr><td>Create</td><td><code>doc.createSessionObject(def)</code> (transient) / <code>createObject</code> (saved)</td></tr>
      <tr><td>Subscribe</td><td><code>model.on("changed", fn)</code> — invalidation signal only</td></tr>
      <tr><td>Read</td><td><code>model.getLayout()</code> or <code>getHyperCubeData</code></td></tr>
      <tr><td>Destroy</td><td><code>doc.destroySessionObject(id)</code> — prevents leaks</td></tr>
    </tbody></table>
    <div class="secNote warn">The <code>changed</code> event carries no data — it just says "re-fetch". Always call <code>getLayout</code>/<code>getHyperCubeData</code> after it. Match the schema JSON to your engine version or calls fail.</div>` },

  { id:"mash-security", title:"Security — CORS, CSP &amp; Content Security", level:"a", tag:"Enterprise", body:`
    <p class="text-slate-300 text-sm">A mashup hosted on a different origin than Qlik must clear cross-origin, websocket, cookie, and framing rules. Most "blank chart / 401 / websocket failed" issues are config, not code.</p>
    <table class="ref-table"><thead><tr><th>Concern</th><th>Fix</th></tr></thead><tbody>
      <tr><td><strong>CORS</strong> (Client-Managed)</td><td>QMC &rarr; Virtual Proxy &rarr; add mashup origin to <em>whitelist host names</em></td></tr>
      <tr><td><strong>CORS</strong> (Cloud)</td><td>Management Console &rarr; Web &rarr; add web-integration origin + use a web-integration ID</td></tr>
      <tr><td><strong>WebSocket origin</strong></td><td>Engine checks <code>Origin</code> header — must match the whitelisted host</td></tr>
      <tr><td><strong>Third-party cookies</strong></td><td>Cross-site session cookie needs <code>SameSite=None; Secure</code> (HTTPS)</td></tr>
      <tr><td><strong>iframe embedding</strong></td><td>Server must allow framing — relax <code>X-Frame-Options</code> / set <code>frame-ancestors</code></td></tr>
    </tbody></table>
    <pre><code class="language-markup">&lt;!-- CSP allowing Qlik engine websocket + scripts --&gt;
&lt;meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src  'self' https://your-qlik-server 'unsafe-inline';
  connect-src 'self' https://your-qlik-server wss://your-qlik-server;
  frame-src   https://your-qlik-server;
  frame-ancestors https://your-portal;
"&gt;</code></pre>
    <pre><code class="language-javascript">// Qlik Cloud: pass the web-integration ID + credentials
var app = qlik.openApp("APP-ID", {
    host: "your-tenant.qlikcloud.com",
    prefix: "/",
    port: 443,
    isSecure: true,
    identity: "web-integration-id"   // from Management Console
});</code></pre>
    <div class="secNote warn">Never embed long-lived API keys in client JS. Use OAuth2 (Cloud) or session tickets (Client-Managed) brokered by a backend.</div>` },
]},

/* ============================================================ JAVASCRIPT */
javascript: { label:"JavaScript", icon:"fa-code", color:"cyan", sections:[

  { id:"js-why", title:"Why Vanilla JS First", level:"f", tag:"Concept", body:`
    <p class="text-slate-300 text-sm leading-relaxed">Every Qlik extension and mashup is <strong>JavaScript</strong>. jQuery and the Capability API are just libraries on top. Knowing core JS — variables, functions, objects, arrays, promises — means you can read any Qlik reply, debug any callback, and not depend on jQuery for everything.</p>
    <div class="secNote tip">Qlik replies are plain JS objects/arrays. <code>qHyperCube.qDataPages[0].qMatrix</code> is just a nested array — pure JS handles it.</div>` },

  { id:"js-vars", title:"Variables &amp; Types", level:"f", tag:"Basics", body:`
    <pre><code class="language-javascript">// Declarations
var  old   = 1;     // function-scoped (legacy, avoid)
let  count = 0;     // block-scoped, reassignable
const APP  = "id";  // block-scoped, cannot reassign

// Primitive types
let s = "text";        // string
let n = 42;            // number (no separate int/float)
let b = true;          // boolean
let u;                 // undefined
let z = null;          // null
let big = 9007199254740991n;  // bigint

typeof s;   // "string"
typeof n;   // "number"

// Truthy / falsy — falsy: 0, "", null, undefined, NaN, false
if (reply.qContent.qString) { /* runs only if non-empty */ }</code></pre>
    <div class="secNote warn">Prefer <code>const</code> by default, <code>let</code> when you must reassign. Avoid <code>var</code>.</div>` },

  { id:"js-operators", title:"Operators &amp; Comparison", level:"f", tag:"Basics", body:`
    <pre><code class="language-javascript">5 + 3; 10 - 2; 4 * 2; 9 / 2; 9 % 2;  // arithmetic, % = remainder

a === b;   // strict equal (type + value) — ALWAYS use this
a == b;    // loose equal (coerces types) — avoid
a !== b;   // strict not equal
a &gt; b; a &lt;= b;

x &amp;&amp; y;    // AND
x || y;    // OR
!x;        // NOT

// Modern helpers
let name = user.name ?? "Guest";     // nullish coalescing (null/undefined only)
let id   = reply?.qInfo?.qId;        // optional chaining (no crash if missing)
let v    = cond ? "yes" : "no";      // ternary</code></pre>
    <div class="secNote tip"><code>?.</code> is gold for Qlik replies — <code>layout?.qHyperCube?.qDataPages?.[0]</code> never throws on a missing branch.</div>` },

  { id:"js-control", title:"Conditionals &amp; Loops", level:"f", tag:"Basics", body:`
    <pre><code class="language-javascript">if (state === "S") { /* selected */ }
else if (state === "X") { /* excluded */ }
else { /* optional */ }

switch (taskType) {
  case 0: console.log("Reload"); break;
  case 1: console.log("External"); break;
  default: console.log("Other");
}

// Loops
for (let i = 0; i &lt; matrix.length; i++) { /* classic */ }
for (const row of matrix) { /* values — best for arrays */ }
for (const key in obj)   { /* keys */ }
let i = 0; while (i &lt; 5) { i++; }</code></pre>` },

  { id:"js-functions", title:"Functions &amp; Arrow Functions", level:"i", tag:"Core", body:`
    <pre><code class="language-javascript">// Declaration
function add(a, b) { return a + b; }

// Expression
const mul = function(a, b) { return a * b; };

// Arrow (short, lexical 'this')
const sq = x =&gt; x * x;
const sum = (a, b) =&gt; a + b;
const greet = name =&gt; { return "Hi " + name; };

// Default + rest params
function build(title, desc = "", ...tags) { /* tags is an array */ }

// Callback — the Qlik pattern
app.getList("BookmarkList", function(reply) {
    console.log(reply.qBookmarkList.qItems.length);
});</code></pre>
    <div class="secNote warn">Arrow functions keep the outer <code>this</code>. Inside an extension <code>paint</code>, that matters — arrows see the extension's <code>this</code>, regular <code>function()</code> callbacks do not.</div>` },

  { id:"js-arrays", title:"Arrays &amp; Methods", level:"i", tag:"Data", body:`
    <p class="text-slate-300 text-sm">The map/filter/reduce trio replaces most loops when transforming Qlik data.</p>
    <pre><code class="language-javascript">const m = layout.qHyperCube.qDataPages[0].qMatrix;

// map — transform each row
const labels = m.map(row =&gt; row[0].qText);

// filter — keep matching rows
const selected = m.filter(row =&gt; row[0].qState === "S");

// reduce — fold to a single value (total)
const total = m.reduce((sum, row) =&gt; sum + row[1].qNum, 0);

// find / some / every
const india = m.find(row =&gt; row[0].qText === "India");
const any   = m.some(row =&gt; row[0].qState === "S");
const all   = m.every(row =&gt; row[1].qNum &gt; 0);

// forEach — side effects (build HTML)
m.forEach(row =&gt; container.append(row[0].qText));

// Mutators
arr.push(x); arr.pop(); arr.shift(); arr.unshift(x);
arr.slice(0, 5);     // copy part (no mutate)
arr.sort((a,b) =&gt; b - a);</code></pre>` },

  { id:"js-objects", title:"Objects &amp; Destructuring", level:"i", tag:"Data", body:`
    <pre><code class="language-javascript">const cfg = {
    host: window.location.hostname,
    prefix: "/",
    port: window.location.port,
    isSecure: window.location.protocol === "https:"
};

cfg.host;            // dot access
cfg["host"];         // bracket access (dynamic key)
Object.keys(cfg);    // ["host","prefix",...]
Object.values(cfg);
Object.entries(cfg).forEach(([k, v]) =&gt; console.log(k, v));

// Destructuring — pull fields out
const { qId, qType } = reply.qInfo;
const [first, second] = matrix;        // array destructuring

// Spread / merge
const merged = { ...cfg, port: 443 };  // override port
const copy   = [...matrix];            // shallow array copy

// Shorthand
const id = "abc"; const o = { id };    // { id: "abc" }</code></pre>
    <div class="secNote tip">QRS <code>$.ajax</code> settings use spread: <code>{ method:"GET", url, ...Settings }</code> merges shared headers.</div>` },

  { id:"js-dom", title:"DOM — Vanilla (no jQuery)", level:"i", tag:"DOM", body:`
    <pre><code class="language-javascript">// Select
const el  = document.getElementById("chart1");
const one = document.querySelector(".filter-item");
const all = document.querySelectorAll(".filter-item");   // NodeList

// Read / write
el.textContent = "safe text";        // escapes — prefer for field values
el.innerHTML   = "&lt;b&gt;markup&lt;/b&gt;";     // parses HTML — XSS risk with user data
el.classList.add("active");
el.classList.toggle("open");
el.dataset.elem;                     // reads data-elem
el.style.height = "400px";
el.setAttribute("title", "Sales");

// Create + insert
const div = document.createElement("div");
div.className = "filter-item";
container.appendChild(div);

// Events
el.addEventListener("click", e =&gt; { console.log(e.target); });

// Delegation (vanilla)
container.addEventListener("click", e =&gt; {
    const item = e.target.closest(".filter-item");
    if (item) app.field("Country").select([+item.dataset.elem], true, false);
});</code></pre>` },

  { id:"js-async", title:"Async — Callbacks, Promises, async/await", level:"a", tag:"Async", body:`
    <p class="text-slate-300 text-sm">Qlik APIs mix callback style (<code>getList</code>) and promise style (<code>visualization.get</code>). Master both.</p>
    <pre><code class="language-javascript">// Promise chaining
app.visualization.get("OBJ")
    .then(model =&gt; model.exportData({ download: true }))
    .then(() =&gt; console.log("done"))
    .catch(err =&gt; console.error(err));

// async / await — flat, readable
async function loadVar(name) {
    try {
        const model = await app.variable.getByName(name);
        const props = await model.getProperties();
        return props.qDefinition;
    } catch (e) {
        console.error("var failed", e);
    }
}

// Run in parallel, wait for all
const [a, b] = await Promise.all([
    app.variable.getByName("vA"),
    app.variable.getByName("vB")
]);

// Wrap a callback API in a promise
function getList(type) {
    return new Promise(resolve =&gt; app.getList(type, resolve));
}
const reply = await getList("BookmarkList");</code></pre>` },

  { id:"js-json", title:"JSON &amp; Error Handling", level:"i", tag:"Core", body:`
    <pre><code class="language-javascript">// JSON — .qext files and QRS payloads are JSON
const obj  = JSON.parse('{"type":"mashup"}');   // string  -&gt; object
const str  = JSON.stringify(obj, null, 2);        // object  -&gt; pretty string

// try / catch
try {
    const data = JSON.parse(maybeBadString);
} catch (e) {
    console.error("Invalid JSON:", e.message);
}

// Guard before deep access
if (reply &amp;&amp; reply.qBookmarkList &amp;&amp; reply.qBookmarkList.qItems) {
    // safe
}
// or modern
const items = reply?.qBookmarkList?.qItems ?? [];</code></pre>
    <div class="secNote tip">Use the browser console: <code>console.log()</code>, <code>console.table(matrix)</code>, and breakpoints (F12 → Sources) are your main Qlik debugging tools.</div>` },

  { id:"js-modern", title:"ES6+ Essentials for Qlik", level:"a", tag:"Modern", body:`
    <pre><code class="language-javascript">// Template literals
const url = \`/\${proxy}/qrs/app/\${app.id}/reload?xrfkey=\${key}\`;

// Default + spread in calls
fn(...argsArray);

// Short object methods
const api = { reload() { /* ... */ }, list() { /* ... */ } };

// Map / Set — unique values, keyed lookups
const seen = new Set();
matrix.forEach(r =&gt; seen.add(r[0].qText));   // unique countries
const byId = new Map();
items.forEach(i =&gt; byId.set(i.qInfo.qId, i));

// Number / string helpers
parseInt("42px", 10);   parseFloat("3.14");
(1234.5).toFixed(2);    "  x ".trim();
"Ger*".replace("*", ""); "abc".includes("b");</code></pre>
    <div class="secNote warn"><strong>RequireJS / AMD:</strong> Qlik loads modules with <code>define([...], fn)</code>, not ES <code>import</code>. Author module bodies in modern JS, but keep the AMD wrapper.</div>` },
]},

/* ============================================================ JQUERY */
jquery: { label:"jQuery", icon:"fa-js", color:"amber", sections:[

  { id:"jq-why", title:"Why jQuery in Qlik Dev", level:"f", tag:"Concept", body:`
    <p class="text-slate-300 text-sm leading-relaxed">Qlik Sense ships <strong>jQuery</strong> as a loadable module (<span class="ic">define([...,"jquery"], function($){...})</span>). Inside <span class="ic">paint()</span> you build HTML and wire events with it; in mashups you drive buttons, filters and AJAX (QRS) with it. Knowing jQuery well makes extension/mashup code shorter and safer.</p>
    <div class="secNote tip">In an extension, never reach for a separate jQuery CDN — require the bundled one so versions match Qlik.</div>` },

  { id:"jq-select", title:"Selectors &amp; the $ Function", level:"f", tag:"Basics", body:`
    <pre><code class="language-javascript">$("#chart1")           // by id
$(".filter-item")      // by class
$("table tr")          // descendant
$("input[type=text]")  // attribute
$(this)                // wrap the current DOM element
$($element)            // wrap the paint() $element (already a jQuery obj)

// Scope a search INSIDE the extension element (best practice)
$element.find(".filter-item")   // not global $(".filter-item")</code></pre>
    <div class="secNote warn">In extensions always scope to <span class="ic">$element.find()</span> — a global <span class="ic">$(".x")</span> can hit other objects on the same sheet.</div>` },

  { id:"jq-dom", title:"Reading &amp; Changing the DOM", level:"f", tag:"Basics", body:`
    <pre><code class="language-javascript">$el.html("&lt;b&gt;Hi&lt;/b&gt;");      // set inner HTML
$el.text("plain");           // set text (auto-escapes)
$el.val();                   // read input value
$el.val("new");              // set input value
$el.attr("data-id");         // read attribute
$el.attr("data-id", "x");    // set attribute
$el.addClass("active");
$el.removeClass("active");
$el.toggleClass("open");
$el.css("color", "#93c5fd"); // single style
$el.css({ color:"#fff", padding:"4px" });
$el.append("&lt;li&gt;row&lt;/li&gt;"); // add to end
$el.empty();                 // remove children
$el.remove();                // remove element itself</code></pre>` },

  { id:"jq-events", title:"Events &amp; Delegation", level:"i", tag:"Events", body:`
    <p class="text-slate-300 text-sm">Direct binding works for static elements. For elements you build dynamically (filter lists in paint), use <strong>delegation</strong>.</p>
    <pre><code class="language-javascript">// Direct
$("#clearAll").on("click", function() { app.clearAll(); });

// Delegation — survives re-render, one handler for many rows
$element.on("click", ".filter-item", function() {
    var elem = parseInt($(this).data("elem"));
    app.field("Country").select([elem], true, false);
});

// Common events
$el.on("change", fn);   // selects, inputs
$el.on("input",  fn);   // live typing / sliders
$el.on("keyup",  fn);

// Remove handlers before re-binding to avoid duplicates
$element.off("click", ".filter-item");</code></pre>
    <div class="secNote warn"><strong>paint() runs many times.</strong> Re-binding each paint stacks duplicate handlers → use <code>.off()</code> first, or delegate once on <code>$element</code>.</div>` },

  { id:"jq-each", title:"Iteration — $.each &amp; .each", level:"i", tag:"Loops", body:`
    <p class="text-slate-300 text-sm">Core pattern for walking Qlik reply lists and matched elements.</p>
    <pre><code class="language-javascript">// Walk an array/object (Qlik replies)
$.each(reply.qBookmarkList.qItems, function(index, value) {
    console.log(index, value.qData.title);
});

// Walk matched DOM elements
$element.find(".filter-item").each(function(i, el) {
    $(el).attr("data-index", i);
});

// Build a list from a Qlik field
app.createList({ qDef:{ qFieldDefs:["Country"] },
    qInitialDataFetch:[{ qTop:0,qLeft:0,qHeight:100,qWidth:1 }]
}, function(reply) {
    var html = "";
    $.each(reply.qListObject.qDataPages[0].qMatrix, function(k, row) {
        html += '&lt;div class="filter-item ' + row[0].qState + '" ' +
                'data-elem="' + row[0].qElemNumber + '"&gt;' + row[0].qText + '&lt;/div&gt;';
    });
    $("#filter-container").html(html);
});</code></pre>` },

  { id:"jq-ajax", title:"AJAX — $.ajax for QRS", level:"a", tag:"Async", body:`
    <p class="text-slate-300 text-sm">The QRS REST API is driven entirely through <span class="ic">$.ajax</span>. Spread settings, handle done/fail.</p>
    <pre><code class="language-javascript">$.ajax({
    method: "GET",
    url: "/hdrreload/qrs/app?xrfkey=" + random,
    timeout: 0,
    headers: {
        "X-Qlik-Xrfkey": random,
        "X-Qlik-User":  "UserDirectory=INTERNAL;UserId=sa_api"
    }
})
.done(function(response, textStatus, xhr) {
    if (xhr.status === 200) console.log("OK", response);
})
.fail(function(err) { console.log("QRS error", err); })
.always(function() { console.log("request finished"); });

// Shorthand GET returning JSON
$.getJSON("/api/data", function(data) { console.log(data); });</code></pre>` },

  { id:"jq-promise", title:"Promises &amp; Deferred", level:"a", tag:"Async", body:`
    <p class="text-slate-300 text-sm">Qlik APIs and <span class="ic">$.ajax</span> return thenables. Chain and parallelise them.</p>
    <pre><code class="language-javascript">// Chain
app.visualization.get("OBJ").then(function(model) {
    return model.exportData({ download:true });
}).then(function() {
    console.log("export done");
}).catch(function(e) { console.log(e); });

// Run several in parallel, wait for all
$.when(
    app.variable.getByName("vA"),
    app.variable.getByName("vB")
).done(function(a, b) {
    console.log("both resolved", a, b);
});

// Build your own deferred
function delay(ms) {
    var d = $.Deferred();
    setTimeout(d.resolve, ms);
    return d.promise();
}
delay(500).then(() =&gt; console.log("0.5s later"));</code></pre>` },

  { id:"jq-traverse", title:"Traversal &amp; Chaining", level:"i", tag:"DOM", body:`
    <pre><code class="language-javascript">$(this).closest(".row");        // nearest ancestor matching
$(this).parent();
$(this).children(".cell");
$(this).siblings();
$(this).next();  $(this).prev();
$(this).find("span");

// Chaining — each call returns a jQuery object
$element.find(".filter-item")
    .removeClass("active")
    .filter("[data-elem='3']")
    .addClass("active")
    .css("font-weight", "600");</code></pre>` },

  { id:"jq-data-anim", title:"Data, Show/Hide &amp; Animation", level:"i", tag:"UI", body:`
    <pre><code class="language-javascript">$el.data("elem");            // read data-elem (cached, typed)
$el.data("elem", 7);         // set in jQuery's data store

$el.show();  $el.hide();  $el.toggle();
$el.fadeIn(200);  $el.fadeOut(200);
$el.slideUp();    $el.slideDown();

// Loading spinner pattern for QRS reload
$("#status").text("Reloading…");
doReload().then(function() {
    $("#status").fadeOut(150).text("Done").fadeIn(150);
});</code></pre>` },

  { id:"jq-pitfalls", title:"Common Pitfalls in Qlik", level:"a", tag:"Gotchas", body:`
    <table class="ref-table"><thead><tr><th>Pitfall</th><th>Fix</th></tr></thead><tbody>
      <tr><td>Duplicate event handlers after re-paint</td><td><code>.off()</code> before <code>.on()</code>, or delegate on <code>$element</code></td></tr>
      <tr><td>Global selectors hit other objects</td><td>Always <code>$element.find(...)</code></td></tr>
      <tr><td>Loading a 2nd jQuery from CDN</td><td>Use Qlik's bundled <code>"jquery"</code> module</td></tr>
      <tr><td>XSS via <code>.html()</code> with field text</td><td>Use <code>.text()</code> for raw values</td></tr>
      <tr><td>paint not returning a promise</td><td><code>return qlik.Promise.resolve();</code></td></tr>
    </tbody></table>` },
]},

/* ============================================================ HTML */
html: { label:"HTML", icon:"fa-html5", color:"red", sections:[

  { id:"html-doc", title:"Document Skeleton", level:"f", tag:"Basics", body:`
    <pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;Page Title&lt;/title&gt;
  &lt;link rel="stylesheet" href="style.css"&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;!-- content --&gt;
  &lt;script src="app.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
    <div class="secNote tip">A Qlik mashup is exactly this skeleton + the <code>qlik-styles.css</code> link + <code>require.js</code>.</div>` },

  { id:"html-text", title:"Text &amp; Common Tags", level:"f", tag:"Basics", body:`
    <pre><code class="language-markup">&lt;h1&gt;…&lt;h6&gt;     Headings (one h1 per page)
&lt;p&gt;            Paragraph
&lt;a href="url"&gt; Link    (add target="_blank" rel="noopener")
&lt;strong&gt;       Important (bold)
&lt;em&gt;           Emphasis (italic)
&lt;br&gt;           Line break (void — no closing tag)
&lt;hr&gt;           Thematic break
&lt;span&gt;         Inline container
&lt;div&gt;          Block container
&lt;ul&gt;&lt;li&gt;       Unordered list
&lt;ol&gt;&lt;li&gt;       Ordered list
&lt;img src="" alt=""&gt;   Image (alt is required for a11y)
&lt;code&gt; &lt;pre&gt;   Inline / preformatted code</code></pre>` },

  { id:"html-attr", title:"Attributes &amp; data-*", level:"f", tag:"Basics", body:`
    <pre><code class="language-markup">&lt;div id="chart1" class="qvplaceholder card"
     data-obj="abc123" data-elem="7"
     style="width:600px;height:400px;"
     title="Sales chart"&gt;
&lt;/div&gt;</code></pre>
    <p class="text-slate-300 text-sm mt-1">Read <span class="ic">data-*</span> back in JS:</p>
    <pre><code class="language-javascript">el.dataset.obj;        // "abc123"   (vanilla)
$(el).data("elem");    // 7          (jQuery, typed)</code></pre>
    <div class="secNote tip"><code>data-elem</code> is the standard way to carry a Qlik <code>qElemNumber</code> from markup into a click handler.</div>` },

  { id:"html-forms", title:"Forms &amp; Inputs", level:"i", tag:"Forms", body:`
    <pre><code class="language-markup">&lt;label for="period"&gt;Period&lt;/label&gt;
&lt;select id="period"&gt;
  &lt;option value="Month"&gt;Month&lt;/option&gt;
  &lt;option value="Year"&gt;Year&lt;/option&gt;
&lt;/select&gt;

&lt;input type="text"   id="name" placeholder="Search…"&gt;
&lt;input type="range"  id="th" min="0" max="100" value="50"&gt;
&lt;input type="checkbox" id="lock"&gt;
&lt;input type="number" min="0" step="10"&gt;
&lt;textarea rows="4"&gt;&lt;/textarea&gt;
&lt;button type="button"&gt;Apply&lt;/button&gt;</code></pre>
    <div class="secNote tip">A <code>&lt;select&gt;</code> bound to <code>app.variable.setStringValue()</code> is the classic mashup variable-driver pattern.</div>` },

  { id:"html-table", title:"Tables", level:"i", tag:"Layout", body:`
    <pre><code class="language-markup">&lt;table&gt;
  &lt;thead&gt;
    &lt;tr&gt;&lt;th&gt;Country&lt;/th&gt;&lt;th&gt;Sales&lt;/th&gt;&lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;&lt;td&gt;India&lt;/td&gt;&lt;td&gt;1,200&lt;/td&gt;&lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</code></pre>
    <div class="secNote">Exactly the structure an extension builds from <code>qHyperCube.qDataPages[0].qMatrix</code> in <code>paint()</code>.</div>` },

  { id:"html-semantic", title:"Semantic Elements", level:"i", tag:"Structure", body:`
    <p class="text-slate-300 text-sm">Use meaning-carrying tags over generic <span class="ic">&lt;div&gt;</span> — better SEO &amp; accessibility.</p>
    <pre><code class="language-markup">&lt;header&gt;  &lt;nav&gt;  &lt;main&gt;  &lt;section&gt;  &lt;article&gt;
&lt;aside&gt;   &lt;figure&gt;&lt;figcaption&gt;  &lt;footer&gt;

&lt;main&gt;
  &lt;section aria-labelledby="kpis"&gt;
    &lt;h2 id="kpis"&gt;KPIs&lt;/h2&gt;
    &lt;div class="qvplaceholder" id="kpi1"&gt;&lt;/div&gt;
  &lt;/section&gt;
&lt;/main&gt;</code></pre>` },

  { id:"html-template", title:"<template> &amp; Cloning", level:"a", tag:"Advanced", body:`
    <p class="text-slate-300 text-sm">Define inert markup once, clone per data row — faster than string concatenation for big lists.</p>
    <pre><code class="language-markup">&lt;template id="rowTpl"&gt;
  &lt;div class="filter-item"&gt;&lt;span class="label"&gt;&lt;/span&gt;&lt;/div&gt;
&lt;/template&gt;</code></pre>
    <pre><code class="language-javascript">var tpl = document.getElementById("rowTpl");
matrix.forEach(function(row) {
    var node = tpl.content.cloneNode(true);
    node.querySelector(".label").textContent = row[0].qText;
    node.querySelector(".filter-item").dataset.elem = row[0].qElemNumber;
    container.appendChild(node);
});</code></pre>` },

  { id:"html-a11y", title:"Accessibility (ARIA)", level:"a", tag:"Advanced", body:`
    <table class="ref-table"><thead><tr><th>Need</th><th>Markup</th></tr></thead><tbody>
      <tr><td>Label an icon button</td><td><code>aria-label="Clear all"</code></td></tr>
      <tr><td>Live status region</td><td><code>aria-live="polite"</code></td></tr>
      <tr><td>Toggle state</td><td><code>aria-pressed="true"</code></td></tr>
      <tr><td>Hide decorative icon</td><td><code>aria-hidden="true"</code></td></tr>
      <tr><td>Associate label/field</td><td><code>&lt;label for&gt;</code> ↔ <code>id</code></td></tr>
    </tbody></table>
    <div class="secNote tip">Mashups embedded in portals are often audited for WCAG — bake ARIA in from the start.</div>` },

  { id:"html-webcomp", title:"qlik-visual Web Component", level:"a", tag:"Qlik", body:`
    <p class="text-slate-300 text-sm">Declarative embedding — drop a custom element, no imperative JS to render.</p>
    <pre><code class="language-markup">&lt;qlik-visual
  appid="APP-ID"
  type="barchart"
  cols='["Country","=Sum(Sales)"]'
  options='{"title":"Sales"}'&gt;
&lt;/qlik-visual&gt;</code></pre>
    <div class="secNote">Requires the qlik-visual component loaded; pairs with the Capability API in modern mashups.</div>` },
]},

/* ============================================================ CSS */
css: { label:"CSS", icon:"fa-css3-alt", color:"green", sections:[

  { id:"css-apply", title:"Three Ways to Apply CSS", level:"f", tag:"Basics", body:`
    <pre><code class="language-markup">&lt;!-- 1. Inline (highest specificity, avoid for scale) --&gt;
&lt;div style="color:#93c5fd;"&gt;

&lt;!-- 2. Internal --&gt;
&lt;style&gt; .card { color:#fff; } &lt;/style&gt;

&lt;!-- 3. External (preferred) --&gt;
&lt;link rel="stylesheet" href="mashup.css"&gt;</code></pre>
    <div class="secNote warn">In Qlik, load <code>qlik-styles.css</code> <strong>before</strong> your own sheet so your rules win on equal specificity.</div>` },

  { id:"css-select", title:"Selectors &amp; Specificity", level:"f", tag:"Basics", body:`
    <pre><code class="language-css">*              { }   /* universal */
.card          { }   /* class      */
#chart1        { }   /* id         */
div            { }   /* element    */
.card .title   { }   /* descendant */
.card &gt; .title  { }   /* direct child */
a:hover        { }   /* pseudo-class */
input[type=text]{ }  /* attribute  */
.a, .b         { }   /* group      */</code></pre>
    <p class="text-slate-300 text-sm mt-1">Specificity (low→high): element &lt; class/attr/pseudo &lt; id &lt; inline &lt; <span class="ic">!important</span>.</p>
    <div class="secNote warn">Overriding Qlik's own classes sometimes needs a slightly higher-specificity selector — prefer that over <code>!important</code>.</div>` },

  { id:"css-box", title:"Box Model &amp; Units", level:"f", tag:"Basics", body:`
    <pre><code class="language-css">.box {
  width: 600px;
  padding: 16px;          /* inside the border */
  border: 1px solid #334155;
  margin: 12px;           /* outside the border */
  box-sizing: border-box; /* width INCLUDES padding+border — use this */
}</code></pre>
    <table class="ref-table"><thead><tr><th>Unit</th><th>Meaning</th></tr></thead><tbody>
      <tr><td><code>px</code></td><td>Absolute pixels</td></tr>
      <tr><td><code>%</code></td><td>Relative to parent</td></tr>
      <tr><td><code>rem</code></td><td>Relative to root font-size</td></tr>
      <tr><td><code>vw / vh</code></td><td>1% of viewport width / height</td></tr>
      <tr><td><code>fr</code></td><td>Grid fraction</td></tr>
    </tbody></table>
    <div class="secNote tip">Qlik object containers need an explicit height (<code>px</code>, <code>vh</code>, or a flex/grid track) or the chart renders 0px tall.</div>` },

  { id:"css-flex", title:"Flexbox", level:"i", tag:"Layout", body:`
    <p class="text-slate-300 text-sm">One-dimensional layout — toolbars, button rows, centering.</p>
    <pre><code class="language-css">.toolbar {
  display: flex;
  justify-content: space-between; /* main axis: start|center|space-between|space-around */
  align-items: center;            /* cross axis */
  gap: 12px;
  flex-wrap: wrap;
}
.toolbar .spacer { flex: 1; }     /* grow to fill */
.item { flex: 0 0 200px; }        /* fixed 200px, no grow/shrink */</code></pre>` },

  { id:"css-grid", title:"CSS Grid", level:"i", tag:"Layout", body:`
    <p class="text-slate-300 text-sm">Two-dimensional layout — dashboard grids of Qlik objects.</p>
    <pre><code class="language-css">.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 320px;
  gap: 16px;
}
.dashboard .wide { grid-column: span 2; }     /* object spans 2 cols */

/* Responsive without media queries */
.auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}</code></pre>` },

  { id:"css-responsive", title:"Responsive &amp; Media Queries", level:"i", tag:"Layout", body:`
    <pre><code class="language-css">/* Mobile-first: base styles, then enhance up */
.grid { grid-template-columns: 1fr; }

@media (min-width: 640px)  { .grid { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3,1fr); } }

/* Honor reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}</code></pre>
    <div class="secNote tip">Call <code>qlik.resize()</code> after a breakpoint reflow so charts re-measure their new container.</div>` },

  { id:"css-vars", title:"Custom Properties (Variables)", level:"a", tag:"Advanced", body:`
    <p class="text-slate-300 text-sm">Theme tokens — change once, cascade everywhere. Readable/writable from JS for live theming.</p>
    <pre><code class="language-css">:root {
  --bg:    #080e1a;
  --card:  rgba(30,41,59,.55);
  --accent:#3b82f6;
  --radius: .75rem;
}
.card {
  background: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--accent);
}</code></pre>
    <pre><code class="language-javascript">// Live theme switch from a mashup control
document.documentElement.style.setProperty("--accent", "#a78bfa");</code></pre>` },

  { id:"css-effects", title:"Transitions, Transforms &amp; Glass", level:"a", tag:"Advanced", body:`
    <pre><code class="language-css">.card {
  transition: border-color .25s ease, transform .2s;
}
.card:hover {
  transform: translateY(-2px);
  border-color: rgba(59,130,246,.4);
}

/* Glassmorphism — the site's card look */
.glass {
  background: rgba(30,41,59,.55);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148,163,184,.1);
}

@keyframes pulse {
  0%   { box-shadow: 0 0 0 0   rgba(59,130,246,.4); }
  100% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
}
.live { animation: pulse 1.4s ease-out infinite; }</code></pre>` },

  { id:"css-modern", title:"Modern Selectors — :has() & more", level:"a", tag:"Advanced", body:`
    <pre><code class="language-css">/* :has() — style a parent based on its children */
.card:has(.error) { border-color: #ef4444; }

/* :is() / :where() — group, reduce repetition */
:is(h1, h2, h3) { font-family: 'Space Grotesk', sans-serif; }

/* Logical props — RTL-safe spacing */
.box { margin-inline: 1rem; padding-block: .5rem; }

/* clamp() — fluid type without media queries */
h1 { font-size: clamp(1.75rem, 4vw, 3rem); }</code></pre>
    <div class="secNote tip">Style Qlik object wrappers without touching their internals: target your own wrapper <code>.qvobject:hover</code> and animate the container, not engine-managed DOM.</div>` },

  { id:"css-qlik", title:"Styling Qlik Objects Safely", level:"a", tag:"Qlik", body:`
    <table class="ref-table"><thead><tr><th>Do</th><th>Avoid</th></tr></thead><tbody>
      <tr><td>Style your own wrapper divs</td><td>Overriding deep Qlik-generated classes (break on upgrade)</td></tr>
      <tr><td>Use Qlik <strong>custom themes</strong> for chart colors</td><td>Hard-coding chart internals via CSS</td></tr>
      <tr><td>Set container size with flex/grid</td><td>Leaving containers height:auto (0px charts)</td></tr>
      <tr><td>Scope styles to your mashup root</td><td>Global resets that leak into Qlik UI</td></tr>
    </tbody></table>
    <div class="secNote">Chart color/font theming belongs in a Qlik <strong>theme</strong> (<code>qlik.theme.apply()</code>), not in mashup CSS.</div>` },
]},

};

/* popular quick-access items for empty search state (mode|sectionId|label) */
const POPULAR = [
  ["mashup","mash-field","app.field().select()"],
  ["mashup","mash-variable","app.variable.setStringValue()"],
  ["mashup","mash-enigma","enigma.getScript()"],
  ["extension","ext-paint","qHyperCube.qMatrix"],
  ["javascript","js-async","Promises &amp; async/await"],
  ["jquery","jq-ajax","$.ajax for QRS"],
];
