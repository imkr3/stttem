// 화면 구성. Shadow DOM 안에서만 동작하므로 포함될 사이트의 CSS와 서로 간섭하지 않는다.
(function (SL) {
  'use strict';

  const CSS = `
  :host { display:block; width:100%; height:100%; min-height:480px;
    --sl-bg:#0d1116; --sl-panel:#161c23; --sl-raised:#212934; --sl-line:#2e3844;
    --sl-ink:#e8edf2; --sl-muted:#9aa6b2; --sl-accent:#5cc8b8; --sl-accent-ink:#06211d;
    --sl-series-1:#6aa9ff; --sl-series-2:#f2a34c; }
  * { box-sizing:border-box; }
  .wrap { container-type:inline-size; width:100%; height:100%; }
  .root { font-family:system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif; font-size:14px; line-height:1.35; color:var(--sl-ink); overflow:hidden; display:grid; width:100%; height:100%; background:var(--sl-bg); grid-template-columns:minmax(0,1fr) 340px; grid-template-rows:auto minmax(0,1fr) auto; grid-template-areas:"bar side" "stage side" "status side"; }
  @container (max-width:759px) {
    /* 8:5 비율을 유지하되, 넣은 요소의 높이가 낮으면 패널 자리를 먼저 남긴다. */
    .root { grid-template-columns:minmax(0,1fr); grid-template-rows:auto minmax(0,min(62.5cqw,50%)) auto minmax(0,1fr); grid-template-areas:"bar" "stage" "status" "side"; }
    .side { border-left:0 !important; border-top:1px solid var(--sl-line); }
  }
  button,select { font:inherit; color:inherit; }
  button { background:var(--sl-raised); border:1px solid var(--sl-line); border-radius:6px; min-height:36px; padding:0 10px; cursor:pointer; }
  button:hover { border-color:var(--sl-muted); }
  button:focus-visible,select:focus-visible,input:focus-visible,summary:focus-visible { outline:2px solid var(--sl-accent); outline-offset:1px; }
  button.on { background:var(--sl-accent); color:var(--sl-accent-ink); border-color:var(--sl-accent); font-weight:600; }
  select { background:var(--sl-raised); border:1px solid var(--sl-line); border-radius:6px; min-height:36px; padding:0 6px; }
  .bar { grid-area:bar; display:flex; flex-wrap:wrap; gap:6px; align-items:center; padding:8px; border-bottom:1px solid var(--sl-line); background:var(--sl-panel); }
  .bar label { display:flex; gap:4px; align-items:center; color:var(--sl-muted); font-size:13px; }
  .bar .clock { margin-left:auto; color:var(--sl-muted); font-variant-numeric:tabular-nums; font-size:13px; }
  .stage { grid-area:stage; position:relative; min-height:0; min-width:0; overflow:hidden; display:flex; align-items:center; justify-content:center; background:#000; }
  .frame { position:relative; flex:none; }
  .frame canvas { position:absolute; inset:0; width:100%; height:100%; display:block; }
  .grid { image-rendering:pixelated; }
  .over { touch-action:none; cursor:crosshair; }
  .scale { position:absolute; left:8px; bottom:8px; display:flex; gap:6px; align-items:center; padding:3px 7px; border-radius:6px; background:#000b; font-size:12px; pointer-events:none; }
  .scale i { display:block; width:110px; height:8px; border-radius:2px; }
  .toast { position:absolute; left:50%; top:10px; transform:translateX(-50%); width:max-content; max-width:92%; background:var(--sl-raised); border:1px solid var(--sl-accent); padding:8px 12px; border-radius:8px; pointer-events:none; opacity:0; transition:opacity .25s; }
  .toast.show { opacity:1; }
  .toast small { display:block; color:var(--sl-muted); }
  .status { grid-area:status; padding:6px 10px; min-height:32px; font-size:13px; color:var(--sl-muted); border-top:1px solid var(--sl-line); background:var(--sl-panel); font-variant-numeric:tabular-nums; }
  .status b { color:var(--sl-ink); font-weight:600; }
  .side { grid-area:side; display:flex; flex-direction:column; min-height:0; background:var(--sl-panel); border-left:1px solid var(--sl-line); }
  .tabs { display:flex; gap:2px; padding:6px 6px 0; border-bottom:1px solid var(--sl-line); }
  .tabs button { flex:1; border:0; background:none; border-radius:6px 6px 0 0; color:var(--sl-muted); }
  .tabs button.on { background:var(--sl-raised); color:var(--sl-ink); box-shadow:inset 0 -2px var(--sl-accent); font-weight:600; }
  .pane { flex:1; min-height:0; overflow-y:auto; padding:10px; }
  h3 { margin:12px 0 6px; font-size:13px; color:var(--sl-muted); font-weight:600; }
  h3:first-child { margin-top:0; }
  .chips { display:flex; flex-wrap:wrap; gap:5px; }
  .chip { display:inline-flex; gap:6px; align-items:center; padding:0 8px; font-size:13px; }
  .chip i { width:11px; height:11px; border-radius:3px; flex:none; box-shadow:0 0 0 1px #fff3; }
  .row { display:flex; gap:8px; align-items:center; margin:7px 0; flex-wrap:wrap; }
  .row label { display:flex; gap:7px; align-items:center; flex:1; min-height:32px; }
  input[type=range] { flex:1; min-width:90px; accent-color:var(--sl-accent); }
  input[type=checkbox] { width:18px; height:18px; accent-color:var(--sl-accent); }
  .val { font-variant-numeric:tabular-nums; min-width:62px; text-align:right; }
  .hint { color:var(--sl-muted); font-size:13px; line-height:1.55; margin:6px 0; }
  .scene { display:block; width:100%; text-align:left; padding:8px 10px; margin-bottom:5px; }
  .scene small { display:block; color:inherit; opacity:.8; line-height:1.45; margin-top:2px; font-weight:400; white-space:normal; }
  .graph { position:relative; height:170px; margin-top:6px; background:var(--sl-bg); border:1px solid var(--sl-line); border-radius:6px; }
  .graph canvas { position:absolute; inset:0; width:100%; height:100%; touch-action:none; }
  .legend { display:flex; gap:12px; font-size:12px; color:var(--sl-muted); margin-top:5px; min-height:16px; }
  .legend span::before { content:""; display:inline-block; width:16px; margin-right:5px; vertical-align:middle; border-top:2px solid var(--c); }
  .legend span.dash::before { border-top-style:dashed; }
  .stats { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; }
  .stat { background:var(--sl-raised); border-radius:6px; padding:6px 8px; font-variant-numeric:tabular-nums; }
  .stat small { display:block; color:var(--sl-muted); font-size:12px; }
  .entry { border-bottom:1px solid var(--sl-line); padding:8px 0; }
  .search { flex:1; min-width:0; width:100%; min-height:36px; padding:0 10px; font:inherit; color:inherit; background:var(--sl-bg); border:1px solid var(--sl-line); border-radius:6px; }
  .cats { margin-bottom:8px; }
  .cats .chip { min-height:30px; font-size:12px; padding:0 8px; }
  .chip small { opacity:.7; font-size:11px; }
  .selected { min-height:18px; }
  .selected b { color:var(--sl-ink); }
  .table-scroll { overflow-x:auto; padding-bottom:6px; }
  .ptable { display:grid; grid-template-columns:repeat(18,28px); grid-auto-rows:28px; gap:2px; width:max-content; }
  .el { min-height:0; padding:0; font-size:11px; font-weight:600; border-radius:4px; border:1px solid transparent; color:#e8edf2; background:#2a323c; }
  .el-alkali { background:#6a2f2f; } .el-alkaline { background:#6a4a2a; } .el-tm { background:#34506a; } .el-post { background:#2f5a5a; } .el-metalloid { background:#4a5a2f; }
  .el-nonmetal { background:#3a6a3a; } .el-halogen { background:#5a6a22; } .el-noble { background:#5a3a6a; } .el-ln { background:#2f4a7a; } .el-an { background:#6a3a5a; }
  .el.on { outline:2px solid var(--sl-accent); outline-offset:0; }
  .entry b { display:block; }
  .entry code { font-family:inherit; color:var(--sl-accent); display:block; margin:2px 0; }
  .entry span { color:var(--sl-muted); font-size:13px; line-height:1.45; }
  `;

  const TABS = [['materials', '재료'], ['scenes', '실험'], ['physics', '물리·측정'], ['codex', '도감']];
  const TOOLS = [['inspect', '관찰'], ['erase', '지우개'], ['heat', '가열'], ['cool', '냉각'], ['ball', '공 던지기'], ['probe', '온도계']];
  const GRAVITY = [['무중력', 0], ['달', 1.62], ['화성', 3.71], ['지구', 9.81], ['목성', 24.79]];
  const fmt = (v, d) => (v == null || !isFinite(v) ? '-' : v.toFixed(d));

  class App {
    constructor(host, shadow, opts) {
      this.host = host;
      this.opts = opts;
      this.shadow = shadow;
      this.world = new SL.World({ width: opts.width, height: opts.height });
      this.storage = opts.storage;
      this.running = true;
      this.visible = true;
      this.speed = 1;
      this.acc = 0;
      this.tool = { kind: 'mat', id: 'Na:s' };
      this.paletteCat = 'element';
      this.query = '';
      this.anchored = false;
      this.brush = 4;
      this.ballType = 'iron';
      this.ballR = 0.05;
      this.tab = 'materials';
      this.graphMode = 'v';
      this.codex = new Map((this.storage.load('codex') || []).map((e) => [e.id, e]));
      this.pointer = null;
      this.hover = null;
      this.cleanups = [];
      this.buildDom();
      this.renderer = new SL.Renderer(this.$('.grid'), this.world);
      this.bindEvents();
      this.loadScene(opts.scene || 'free');
      this.setTab(opts.scene ? 'scenes' : 'materials');
      this.last = performance.now();
      this.loop = this.loop.bind(this);
      this.raf = requestAnimationFrame(this.loop);
      this.emit('ready', {});
    }

    $(s) { return this.shadow.querySelector(s); }
    emit(name, detail) { this.host.dispatchEvent(new CustomEvent('sandlab:' + name, { detail, bubbles: true, composed: true })); }
    listen(target, type, fn, o) { target.addEventListener(type, fn, o); this.cleanups.push(() => target.removeEventListener(type, fn, o)); }

    buildDom() {
      this.shadow.innerHTML = `<style>${CSS}</style>
      <div class="wrap"><div class="root">
        <div class="bar">
          <button class="play" title="일시정지/재생">일시정지</button>
          <button class="stepone" title="한 틱만 진행">1틱</button>
          <button class="restart" title="현재 실험을 처음부터">다시</button>
          <label>속도 <select class="speed">
            <option value="0.1">0.1배</option><option value="0.25">0.25배</option><option value="0.5">0.5배</option><option value="1" selected>1배</option><option value="2">2배</option>
          </select></label>
          <label>보기 <select class="view"><option value="normal">일반</option><option value="heat">온도</option><option value="density">밀도</option></select></label>
          <span class="clock">0.00초</span>
        </div>
        <div class="stage"><div class="frame"><canvas class="grid"></canvas><canvas class="over" aria-label="실험 공간"></canvas></div>
          <div class="scale" hidden></div><div class="toast" role="status"></div></div>
        <div class="status">&nbsp;</div>
        <div class="side">
          <div class="tabs" role="tablist">${TABS.map(([id, n]) => `<button role="tab" data-tab="${id}">${n}</button>`).join('')}</div>
          <div class="pane"></div>
        </div>
      </div></div>`;
    }

    bindEvents() {
      this.listen(this.$('.play'), 'click', () => this.setRunning(!this.running));
      this.listen(this.$('.stepone'), 'click', () => { this.setRunning(false); this.world.step(); this.afterStep(); });
      this.listen(this.$('.restart'), 'click', () => this.loadScene(this.currentScene.id));
      this.listen(this.$('.speed'), 'change', (e) => { this.speed = +e.target.value; });
      this.listen(this.$('.view'), 'change', (e) => this.setView(e.target.value));
      this.listen(this.$('.tabs'), 'click', (e) => { const t = e.target.closest('[data-tab]'); if (t) this.setTab(t.dataset.tab); });

      const over = this.$('.over');
      this.listen(over, 'pointerdown', (e) => this.onDown(e));
      this.listen(over, 'pointermove', (e) => this.onMove(e));
      this.listen(over, 'pointerup', (e) => this.onUp(e));
      this.listen(over, 'pointercancel', () => { this.pointer = null; });
      this.listen(over, 'pointerleave', () => { this.hover = null; });

      const ro = new ResizeObserver(() => this.fit());
      ro.observe(this.$('.stage'));
      this.cleanups.push(() => ro.disconnect());
      // 페이지의 다른 기능과 함께 쓰일 때 화면 밖이면 연산을 멈춘다.
      const io = new IntersectionObserver((en) => { this.visible = en[0].isIntersecting; });
      io.observe(this.host);
      this.cleanups.push(() => io.disconnect());
    }

    fit() {
      const st = this.$('.stage'), W = st.clientWidth, H = st.clientHeight;
      if (!W || !H) return;
      const s = Math.min(W / this.world.w, H / this.world.h);
      const f = this.$('.frame');
      f.style.width = Math.floor(this.world.w * s) + 'px';
      f.style.height = Math.floor(this.world.h * s) + 'px';
      const over = this.$('.over'), dpr = Math.min(2, devicePixelRatio || 1);
      over.width = Math.floor(this.world.w * s * dpr);
      over.height = Math.floor(this.world.h * s * dpr);
    }

    setRunning(v) { this.running = v; this.$('.play').textContent = v ? '일시정지' : '재생'; }

    setView(v) {
      this.renderer.mode = v;
      this.$('.view').value = v;
      const sc = this.$('.scale');
      sc.hidden = v === 'normal';
      if (v !== 'normal') {
        const stops = v === 'heat' ? SL.HEAT_STOPS : SL.DENSITY_STOPS;
        const grad = stops.map((c) => `rgb(${c.join(',')})`).join(',');
        const [lo, hi] = v === 'heat' ? ['-60°C', '1600°C'] : ['0.05', '10000 kg/m³'];
        sc.innerHTML = `<span>${lo}</span><i style="background:linear-gradient(90deg,${grad})"></i><span>${hi}</span>`;
      }
    }

    loadScene(id) {
      const sc = SL.SCENES.find((s) => s.id === id) || SL.SCENES[0];
      this.currentScene = sc;
      this.world.reset();
      sc.setup(this.world);
      this.speed = sc.speed || 1;
      this.graphMode = sc.graph || 'v';
      this.$('.speed').value = String(this.speed);
      this.setRunning(true);
      this.renderPane();
      this.emit('scenechange', { id: sc.id });
    }

    setTab(id) {
      this.tab = id;
      this.shadow.querySelectorAll('[data-tab]').forEach((b) => {
        b.classList.toggle('on', b.dataset.tab === id);
        b.setAttribute('aria-selected', b.dataset.tab === id);
      });
      this.renderPane();
    }

    renderPane() {
      const pane = this.$('.pane');
      if (this.tab === 'materials') this.paneMaterials(pane);
      else if (this.tab === 'scenes') this.paneScenes(pane);
      else if (this.tab === 'physics') this.panePhysics(pane);
      else this.paneCodex(pane);
    }

    paneMaterials(pane) {
      const count = this.world.data.defs.length;
      pane.innerHTML = `${this.currentScene.id === 'free' ? '' : `<p class="hint">${this.currentScene.desc}</p>`}
        <h3>도구</h3><div class="chips tools">${TOOLS.map(([k, n]) => `<button class="chip" data-tool="${k}">${n}</button>`).join('')}</div>
        <div class="row"><label>붓 크기 <input type="range" class="brush" min="1" max="16" value="${this.brush}"></label><span class="val">${this.brush}칸</span></div>
        <div class="row"><label title="끄면 가루처럼 쌓이고, 켜면 놓은 자리에 덩어리로 고정됩니다."><input type="checkbox" class="anchor" ${this.anchored ? 'checked' : ''}> 덩어리로 고정해서 놓기</label></div>
        <div class="row"><input type="search" class="search" placeholder="물질 ${count}종 검색 (예: 황산, Cu, 소금)" aria-label="물질 검색" value="${this.query}"></div>
        <div class="chips cats">${SL.CATEGORIES.map(([k, n]) => `<button class="chip" data-cat="${k}">${n}</button>`).join('')}</div>
        <p class="hint selected"></p>
        <div class="palette"></div>
        <p class="hint">모의 실험입니다. 유독하거나 위험한 물질이 많으니 실제로 따라 하지 마세요.</p>`;
      pane.onclick = (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.mat) this.tool = { kind: 'mat', id: b.dataset.mat };
        else if (b.dataset.tool) this.tool = { kind: b.dataset.tool };
        else if (b.dataset.cat) { this.paletteCat = b.dataset.cat; this.query = ''; pane.querySelector('.search').value = ''; this.renderPalette(); }
        this.markSelection();
      };
      pane.querySelector('.brush').oninput = (e) => {
        this.brush = +e.target.value;
        e.target.closest('.row').querySelector('.val').textContent = this.brush + '칸';
      };
      pane.querySelector('.anchor').onchange = (e) => { this.anchored = e.target.checked; };
      pane.querySelector('.search').oninput = (e) => { this.query = e.target.value.trim(); this.renderPalette(); };
      this.renderPalette();
    }

    // 목록 다시 그리기는 재료 목록 부분만 한다. 물질이 많아 패널 전체를 다시 만들지 않는다.
    renderPalette() {
      const box = this.$('.palette');
      if (!box) return;
      const defs = this.world.data.defs;
      const q = this.query.toLowerCase();
      const chip = (d) => `<button class="chip" data-mat="${d.id}" title="${d.formula}: ${d.desc || ''}"><i style="background:${d.color}"></i>${d.name}${d.cat === 'salt' || d.cat === 'solution' ? ` <small>${d.formula}</small>` : ''}</button>`;
      if (q) {
        const hits = defs.filter((d) => (d.cat || d.state !== 'gas') && d.id !== 'air' && (d.name.toLowerCase().includes(q) || (d.fx || '').toLowerCase().includes(q) || d.id.toLowerCase() === q));
        box.innerHTML = hits.length ? `<div class="chips">${hits.slice(0, 120).map(chip).join('')}</div>` : '<p class="hint">찾는 물질이 없습니다. 다른 이름이나 화학식으로 검색해 보세요.</p>';
      } else if (this.paletteCat === 'element') {
        const idOf = this.world.data.idOf;
        const cells = SL.ELEMENTS.map((e) => {
          const [row, col] = SL.elementCell(e.z);
          const id = defs[idOf[e.sym]].id;
          return `<button class="el el-${e.cat}" style="grid-row:${row};grid-column:${col}" data-mat="${id}" title="${e.z} ${e.name}">${e.sym}</button>`;
        }).join('');
        box.innerHTML = `<div class="table-scroll"><div class="ptable">${cells}</div></div>`;
      } else {
        box.innerHTML = `<div class="chips">${defs.filter((d) => d.cat === this.paletteCat).map(chip).join('')}</div>`;
      }
      this.markSelection();
    }

    markSelection() {
      const pane = this.$('.pane');
      pane.querySelectorAll('[data-mat]').forEach((b) => b.classList.toggle('on', this.tool.kind === 'mat' && b.dataset.mat === this.tool.id));
      pane.querySelectorAll('[data-tool]').forEach((b) => b.classList.toggle('on', this.tool.kind === b.dataset.tool));
      pane.querySelectorAll('[data-cat]').forEach((b) => b.classList.toggle('on', !this.query && this.paletteCat === b.dataset.cat));
      const info = pane.querySelector('.selected');
      if (!info) return;
      if (this.tool.kind === 'mat') {
        const d = this.world.data.defs[this.world.data.idOf[this.tool.id]];
        info.innerHTML = `<b>${d.name}</b> ${d.formula} · ${fmt(d.density, d.density < 10 ? 2 : 0)} kg/m³<br>${d.desc || ''}`;
      } else info.textContent = '';
    }

    paneScenes(pane) {
      pane.innerHTML = SL.SCENES.map((s) => `<button class="scene${s.id === this.currentScene.id ? ' on' : ''}" data-scene="${s.id}"><b>${s.name}</b><small>${s.desc}</small></button>`).join('');
      pane.onclick = (e) => {
        const b = e.target.closest('[data-scene]');
        if (!b) return;
        this.loadScene(b.dataset.scene);
        const next = this.currentScene.tab;
        this.setTab(next === 'materials' ? 'materials' : next);
      };
    }

    panePhysics(pane) {
      const w = this.world;
      pane.innerHTML = `<p class="hint">${this.currentScene.desc}</p>
        <h3>측정</h3>
        <div class="chips">${[['v', '수직 속도'], ['h', '높이'], ['E', '역학적 에너지'], ['T', '온도계']].map(([k, n]) => `<button class="chip${this.graphMode === k ? ' on' : ''}" data-graph="${k}">${n}</button>`).join('')}</div>
        <div class="graph"><canvas class="plot"></canvas></div><div class="legend"></div><div class="stats"></div>
        <h3>중력</h3><div class="chips">${GRAVITY.map(([n, g]) => `<button class="chip${Math.abs(w.g - g) < 0.005 ? ' on' : ''}" data-g="${g}">${n}</button>`).join('')}</div>
        <div class="row"><label>g <input type="range" class="grav" min="0" max="25" step="0.01" value="${w.g}"></label><span class="val gval">${fmt(w.g, 2)} m/s²</span></div>
        <div class="row"><label><input type="checkbox" class="vac" ${w.vacuum ? 'checked' : ''}> 공기 저항 없음(진공)</label></div>
        <div class="row"><label>열전달 가속 <input type="range" class="boost" min="1" max="1000" value="${w.heatBoost}"></label><span class="val bval">×${w.heatBoost}</span></div>
        <h3>공 던지기</h3>
        <div class="row"><select class="balltype">${Object.entries(SL.BALLS).map(([k, b]) => `<option value="${k}" ${k === this.ballType ? 'selected' : ''}>${b.name} (${b.density} kg/m³)</option>`).join('')}</select>
        <button class="useball chip${this.tool.kind === 'ball' ? ' on' : ''}">공 도구 선택</button><button class="clearballs chip">공 모두 지우기</button></div>
        <div class="row"><label>반지름 <input type="range" class="ballr" min="2" max="12" value="${this.ballR * 100}"></label><span class="val rval">${(this.ballR * 100).toFixed(0)} cm</span></div>
        <p class="hint">공 도구로 실험 공간을 끌었다 놓으면 끈 방향으로 던집니다. 공을 누르면 측정 대상이 됩니다.</p>
`;
      pane.onclick = (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.g != null) { w.g = +b.dataset.g; this.renderPane(); }
        else if (b.dataset.graph) { this.graphMode = b.dataset.graph; this.renderPane(); }
        else if (b.classList.contains('useball')) { this.tool = { kind: 'ball' }; this.renderPane(); }
        else if (b.classList.contains('clearballs')) { w.bodies = []; w.select(null); }
      };
      pane.querySelector('.grav').oninput = (e) => { w.g = +e.target.value; pane.querySelector('.gval').textContent = fmt(w.g, 2) + ' m/s²'; };
      pane.querySelector('.vac').onchange = (e) => { w.vacuum = e.target.checked; };
      pane.querySelector('.boost').oninput = (e) => { w.setHeatBoost(+e.target.value); pane.querySelector('.bval').textContent = '×' + e.target.value; };
      pane.querySelector('.balltype').onchange = (e) => { this.ballType = e.target.value; };
      pane.querySelector('.ballr').oninput = (e) => { this.ballR = e.target.value / 100; pane.querySelector('.rval').textContent = e.target.value + ' cm'; };
      const plot = pane.querySelector('.plot');
      plot.onpointermove = (e) => { const r = plot.getBoundingClientRect(); this.plotHover = (e.clientX - r.left) / r.width; };
      plot.onpointerleave = () => { this.plotHover = null; };
    }

    paneCodex(pane) {
      const entries = [...this.codex.values()];
      const found = entries.filter((e) => e.type === 'reaction').length;
      pane.innerHTML = `<p class="hint">${this.currentScene.desc}</p><h3>발견한 반응 ${found}개, 상태 변화 ${entries.length - found}개</h3>` +
        (entries.length ? entries.slice().reverse().map((e) => `<div class="entry"><b>${e.name}</b><code>${e.eq}</code><span>${e.note || ''}</span></div>`).join('')
          : '<p class="hint">아직 발견한 반응이 없습니다. 물질들을 만나게 해 보세요.</p>');
      pane.onclick = null;
    }

    // ---- 입력 ----
    cellAt(e) {
      const r = this.$('.over').getBoundingClientRect();
      return { x: Math.floor((e.clientX - r.left) / r.width * this.world.w), y: Math.floor((e.clientY - r.top) / r.height * this.world.h) };
    }
    bodyAt(c) {
      const dx = this.world.dx;
      return this.world.bodies.find((b) => Math.hypot(b.x / dx - c.x, b.y / dx - c.y) <= b.r / dx + 2);
    }
    onDown(e) {
      e.currentTarget.setPointerCapture(e.pointerId);
      const c = this.cellAt(e);
      this.hover = c;
      const hit = this.bodyAt(c);
      if (hit && this.tool.kind !== 'erase') { // 공 선택이 다른 도구보다 우선한다.
        this.world.select(hit);
        hit.log = []; hit.born = this.world.time; hit.firstHit = null; hit.vy0 = hit.vy; hit.y0 = hit.y;
        return;
      }
      this.pointer = { start: c, last: c, cur: c };
      if (this.tool.kind === 'probe') { this.world.setProbe(c.x, c.y); this.graphMode = 'T'; this.pointer = null; if (this.tab === 'physics') this.renderPane(); return; }
      if (this.tool.kind !== 'ball') this.applyBrush(c.x, c.y);
    }
    onMove(e) {
      const c = this.cellAt(e);
      this.hover = c;
      const p = this.pointer;
      if (!p) return;
      p.cur = c;
      if (this.tool.kind === 'ball') return;
      // 빠르게 그어도 끊기지 않도록 사이 칸을 채운다.
      const steps = Math.max(1, Math.max(Math.abs(c.x - p.last.x), Math.abs(c.y - p.last.y)));
      for (let n = 1; n <= steps; n++) {
        this.applyBrush(Math.round(p.last.x + (c.x - p.last.x) * n / steps), Math.round(p.last.y + (c.y - p.last.y) * n / steps));
      }
      p.last = c;
    }
    onUp(e) {
      const p = this.pointer;
      this.pointer = null;
      if (e.pointerType !== 'mouse') this.hover = null;
      if (!p || this.tool.kind !== 'ball') return;
      const w = this.world, dx = w.dx, c = this.cellAt(e);
      const b = w.addBody({
        type: this.ballType, r: this.ballR, x: (p.start.x + 0.5) * dx, y: (p.start.y + 0.5) * dx,
        vx: (c.x - p.start.x) * dx * 4, vy: (c.y - p.start.y) * dx * 4, // 1m 끌면 4 m/s
      });
      w.select(b);
    }
    applyBrush(x, y) {
      const w = this.world, t = this.tool, r = this.brush - 1;
      if (t.kind === 'mat') w.paint(x, y, r, w.data.idOf[t.id], true, this.anchored);
      else if (t.kind === 'erase') {
        w.paint(x, y, r, w.AIR, false);
        const hit = this.bodyAt({ x, y });
        if (hit) { w.bodies.splice(w.bodies.indexOf(hit), 1); if (w.selected === hit) w.select(null); }
      } else if (t.kind === 'heat') w.addHeat(x, y, r, 60);
      else if (t.kind === 'cool') w.addHeat(x, y, r, -40);
    }

    // ---- 루프 ----
    loop(now) {
      this.raf = requestAnimationFrame(this.loop);
      const real = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      if (!this.visible) return;
      // 누르고 있는 동안 가열/냉각을 계속한다.
      if (this.pointer && (this.tool.kind === 'heat' || this.tool.kind === 'cool')) this.applyBrush(this.pointer.cur.x, this.pointer.cur.y);
      if (this.running) {
        this.acc += real * this.speed;
        let n = 0;
        while (this.acc >= this.world.dt && n < 4) { this.world.step(); this.acc -= this.world.dt; n++; }
        if (n === 4) this.acc = 0; // 느린 기기에서는 시간을 늦춘다.
        if (n) this.afterStep();
      }
      this.renderer.draw();
      this.drawOverlay();
      this.$('.clock').textContent = fmt(this.world.time, 2) + '초';
      this.updateStatus();
      if (this.tab === 'physics') this.drawPlot();
    }

    afterStep() {
      for (const e of this.world.drainEvents()) {
        if (this.codex.has(e.id)) continue;
        this.codex.set(e.id, e);
        this.storage.save('codex', [...this.codex.values()]);
        this.toast(e);
        this.emit('discover', e);
        if (this.tab === 'codex') this.renderPane();
      }
    }

    toast(e) {
      const t = this.$('.toast');
      t.innerHTML = `새 발견: <b>${e.name}</b><small>${e.eq}</small>`;
      t.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
    }

    updateStatus() {
      const el = this.$('.status');
      const c = this.hover;
      const info = c && this.world.inspect(c.x, c.y);
      const html = info
        ? `<b>${info.def.name}</b> ${info.def.formula} · ${fmt(info.T, 1)}°C · ${info.rho >= 10 ? fmt(info.rho, 0) : fmt(info.rho, 2)} kg/m³${info.def.desc ? ' · ' + info.def.desc : ''}`
        : '실험 공간 위에 커서를 올리거나 관찰 도구로 눌러 물질 정보를 확인하세요.';
      if (html !== this.statusHtml) { el.innerHTML = html; this.statusHtml = html; }
    }

    drawOverlay() {
      const over = this.$('.over'), ctx = over.getContext('2d'), w = this.world;
      const s = over.width / (w.w * w.dx); // m → 픽셀
      const cell = over.width / w.w;
      ctx.clearRect(0, 0, over.width, over.height);
      for (const b of w.bodies) {
        if (b === w.selected && b.trail.length > 2) {
          ctx.strokeStyle = '#ffffff66'; ctx.lineWidth = 1.5; ctx.beginPath();
          for (let i = 0; i < b.trail.length; i += 2) ctx.lineTo(b.trail[i] * s, b.trail[i + 1] * s);
          ctx.stroke();
        }
        ctx.fillStyle = b.color; ctx.beginPath(); ctx.arc(b.x * s, b.y * s, b.r * s, 0, 7); ctx.fill();
        ctx.lineWidth = b === w.selected ? 2.5 : 1;
        ctx.strokeStyle = b === w.selected ? '#5cc8b8' : '#0008'; ctx.stroke();
      }
      if (w.probe) {
        const x = (w.probe.x + 0.5) * cell, y = (w.probe.y + 0.5) * cell;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, Math.max(4, cell), 0, 7); ctx.stroke();
        ctx.font = `${Math.max(12, cell * 3)}px system-ui,sans-serif`; ctx.fillStyle = '#fff';
        ctx.fillText(fmt(w.T[w.index(w.probe.x, w.probe.y)], 1) + '°C', x + Math.max(8, cell * 2), y + 4);
      }
      const p = this.pointer;
      if (p && this.tool.kind === 'ball') {
        const sx = (p.start.x + 0.5) * cell, sy = (p.start.y + 0.5) * cell;
        ctx.strokeStyle = '#5cc8b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(sx, sy, this.ballR * s, 0, 7); ctx.moveTo(sx, sy); ctx.lineTo((p.cur.x + 0.5) * cell, (p.cur.y + 0.5) * cell); ctx.stroke();
      } else if (this.hover && ['mat', 'erase', 'heat', 'cool'].includes(this.tool.kind)) {
        ctx.strokeStyle = '#ffffff99'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc((this.hover.x + 0.5) * cell, (this.hover.y + 0.5) * cell, Math.max(this.brush - 0.5, 0.5) * cell, 0, 7); ctx.stroke();
      }
    }

    // 그래프 하나, 축 하나. 측정값은 실선, 이론값은 점선으로 구분한다.
    plotData() {
      const w = this.world, m = this.graphMode;
      if (m === 'T') {
        const p = w.probe;
        if (!p) return { empty: '온도계 도구로 측정할 곳을 눌러 주세요.' };
        const t0 = p.log.length ? p.log[0].t : 0;
        return { unit: '°C', xs: p.log.map((s) => s.t - t0), ys: p.log.map((s) => s.T), label: '온도' };
      }
      const b = w.selected;
      if (!b) return { empty: '공을 눌러 측정 대상으로 선택해 주세요.' };
      const xs = b.log.map((s) => s.t), g = w.g;
      const end = b.firstHit == null ? Infinity : b.firstHit - b.born;
      if (m === 'v') return { unit: 'm/s', xs, ys: b.log.map((s) => s.v), label: '측정값', theory: (t) => (t <= end ? b.vy0 + g * t : null) };
      if (m === 'h') {
        const h0 = w.floorY() - b.y0 - b.r;
        return { unit: 'm', xs, ys: b.log.map((s) => s.h), label: '측정값', theory: (t) => (t <= end ? h0 - b.vy0 * t - 0.5 * g * t * t : null) };
      }
      return { unit: 'J', xs, ys: b.log.map((s) => s.E), label: '운동+위치 에너지' };
    }

    drawPlot() {
      const canvas = this.$('.plot');
      if (!canvas) return;
      const box = canvas.parentElement, dpr = Math.min(2, devicePixelRatio || 1);
      const W = box.clientWidth, H = box.clientHeight;
      if (canvas.width !== Math.round(W * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cs = getComputedStyle(this.host);
      const ink = cs.getPropertyValue('--sl-muted').trim() || '#9aa6b2', line = cs.getPropertyValue('--sl-line').trim() || '#2e3844';
      const c1 = cs.getPropertyValue('--sl-series-1').trim() || '#6aa9ff', c2 = cs.getPropertyValue('--sl-series-2').trim() || '#f2a34c';
      ctx.font = '12px system-ui,sans-serif';
      const d = this.plotData();
      this.updateStats(d);
      if (d.empty || !d.xs.length) {
        ctx.fillStyle = ink; ctx.textAlign = 'center';
        ctx.fillText(d.empty || '측정을 기다리는 중', W / 2, H / 2);
        return;
      }
      const L = 46, R = 8, T = 8, B = 22;
      const xMax = Math.max(1, d.xs[d.xs.length - 1]);
      const theoryPts = d.theory ? d.xs.map((t) => d.theory(t)) : [];
      const all = d.ys.concat(theoryPts.filter((v) => v != null));
      let lo = Math.min(...all), hi = Math.max(...all);
      if (hi - lo < 1e-3) { hi += 1; lo -= 1; }
      const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
      const X = (t) => L + t / xMax * (W - L - R), Y = (v) => T + (hi - v) / (hi - lo) * (H - T - B);
      // 눈금
      ctx.strokeStyle = line; ctx.fillStyle = ink; ctx.lineWidth = 1; ctx.textAlign = 'right';
      for (let i = 0; i <= 3; i++) {
        const v = lo + (hi - lo) * i / 3, y = Y(v);
        ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - R, y); ctx.stroke();
        ctx.fillText(Math.abs(hi - lo) < 10 ? v.toFixed(2) : v.toFixed(0), L - 5, y + 4);
      }
      ctx.textAlign = 'center';
      for (let i = 0; i <= 3; i++) ctx.fillText((xMax * i / 3).toFixed(1) + (i === 3 ? '초' : ''), Math.min(W - 16, X(xMax * i / 3)), H - 6);
      const path = (ys, color, dash) => {
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash); ctx.lineJoin = 'round';
        ctx.beginPath();
        let open = false;
        ys.forEach((v, i) => {
          if (v == null) return;
          if (open) ctx.lineTo(X(d.xs[i]), Y(v)); else { ctx.moveTo(X(d.xs[i]), Y(v)); open = true; }
        });
        ctx.stroke(); ctx.setLineDash([]);
      };
      path(d.ys, c1, []);
      if (d.theory) path(theoryPts, c2, [6, 4]);
      // 커서 위치의 값 표시
      if (this.plotHover != null) {
        const tx = (this.plotHover * W - L) / (W - L - R) * xMax;
        let idx = 0;
        d.xs.forEach((t, i) => { if (Math.abs(t - tx) < Math.abs(d.xs[idx] - tx)) idx = i; });
        const x = X(d.xs[idx]);
        ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, H - B); ctx.stroke();
        ctx.fillStyle = c1; ctx.beginPath(); ctx.arc(x, Y(d.ys[idx]), 4, 0, 7); ctx.fill();
        const th = theoryPts[idx];
        const text = `${fmt(d.xs[idx], 2)}초 · ${fmt(d.ys[idx], 2)} ${d.unit}` + (th != null ? ` (이론 ${fmt(th, 2)})` : '');
        const tw = ctx.measureText(text).width + 12;
        const bx = Math.max(L, Math.min(W - R - tw, x - tw / 2));
        ctx.fillStyle = '#000c'; ctx.fillRect(bx, T, tw, 20);
        ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(text, bx + 6, T + 14);
      }
      const leg = `<span style="--c:${c1}">${d.label} (${d.unit})</span>` + (d.theory ? `<span class="dash" style="--c:${c2}">진공 이론값</span>` : '');
      if (leg !== this.legendHtml) { this.$('.legend').innerHTML = leg; this.legendHtml = leg; }
    }

    updateStats(d) {
      const w = this.world, box = this.$('.stats');
      if (!box) return;
      const stat = (n, v) => `<div class="stat"><small>${n}</small>${v}</div>`;
      let html = '';
      if (this.graphMode === 'T') {
        if (w.probe) {
          const log = w.probe.log, here = w.inspect(w.probe.x, w.probe.y);
          html = stat('현재 온도', fmt(here.T, 1) + ' °C') + stat('현재 물질', here.def.name) +
            stat('측정 시간', fmt(log.length ? log[log.length - 1].t - log[0].t : 0, 1) + ' 초') + stat('열전달 가속', '×' + w.heatBoost);
        }
      } else if (w.selected) {
        const b = w.selected, { ke, pe } = w.energyOf(b), a = w.measuredAccel(b);
        html = stat('측정 가속도(첫 충돌 전)', a == null ? '측정 중' : fmt(a, 2) + ' m/s²') + stat('설정한 g', fmt(w.g, 2) + ' m/s²') +
          stat('운동 에너지', fmt(ke, 3) + ' J') + stat('위치 에너지', fmt(pe, 3) + ' J') +
          stat('질량', fmt(b.mass, 3) + ' kg') + stat('주변 유체 밀도', fmt(b.rhoFluid, 1) + ' kg/m³');
      }
      if (html !== this.statsHtml) { box.innerHTML = html; this.statsHtml = html; }
    }

    destroy() {
      cancelAnimationFrame(this.raf);
      clearTimeout(this.toastTimer);
      this.cleanups.forEach((fn) => fn());
      this.shadow.innerHTML = '';
    }
  }

  // 저장소는 교체 가능하다. 포함될 사이트가 서버 저장 함수를 넘기면 그쪽을 쓴다.
  function localStorageAdapter(prefix) {
    return {
      load(key) { try { return JSON.parse(localStorage.getItem(prefix + key)); } catch (e) { return null; } },
      save(key, value) { try { localStorage.setItem(prefix + key, JSON.stringify(value)); } catch (e) { /* 저장 불가 환경에서는 무시 */ } },
    };
  }

  /**
   * 공개 API. 어떤 요소에든 실험실을 붙인다.
   * @param {HTMLElement} el 넣을 요소 (높이가 있어야 함)
   * @param {{scene?:string,width?:number,height?:number,storage?:{load:Function,save:Function}}} [options]
   */
  SL.create = function create(el, options) {
    const opts = Object.assign({ width: 240, height: 150 }, options);
    opts.storage = opts.storage || localStorageAdapter('sandlab:');
    const shadow = el.shadowRoot || el.attachShadow({ mode: 'open' });
    const app = new App(el, shadow, opts);
    return {
      world: app.world,
      loadScene: (id) => app.loadScene(id),
      pause: () => app.setRunning(false),
      resume: () => app.setRunning(true),
      setView: (v) => app.setView(v),
      save: () => app.world.toJSON(),
      restore: (data) => app.world.fromJSON(data),
      discoveries: () => [...app.codex.values()],
      destroy: () => app.destroy(),
    };
  };

  if (globalThis.customElements && !customElements.get('sand-lab')) {
    customElements.define('sand-lab', class extends HTMLElement {
      connectedCallback() {
        this.lab = SL.create(this, { scene: this.getAttribute('scene') || undefined });
      }
      disconnectedCallback() { if (this.lab) this.lab.destroy(); this.lab = null; }
    });
  }
})(globalThis.SandLab = globalThis.SandLab || {});
