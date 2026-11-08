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
  .root:focus { outline:none; }
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
  .zoomreset { position:absolute; right:8px; top:8px; min-height:30px; font-size:12px; background:#000b; }
  .frame { transform-origin:0 0; }
  .starthint { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; color:var(--sl-muted); font-size:14px; text-align:center; padding:16px; transition:opacity .4s; }
  .starthint[hidden] { display:none; }
  .starthint b { color:var(--sl-ink); }
  .toast small { display:block; color:var(--sl-muted); }
  .status { grid-area:status; padding:6px 10px; min-height:32px; font-size:13px; color:var(--sl-muted); border-top:1px solid var(--sl-line); background:var(--sl-panel); font-variant-numeric:tabular-nums; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
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
  .challenges summary { cursor:pointer; list-style:none; }
  .challenges summary::-webkit-details-marker { display:none; }
  .challenges summary h3 { display:inline-block; margin:0 0 6px; }
  .challenges ul { list-style:none; margin:0 0 10px; padding:0; }
  .challenges li { padding:4px 0; font-size:13px; border-bottom:1px solid var(--sl-line); }
  .challenges li span { display:inline-block; width:18px; color:var(--sl-muted); }
  .challenges li.ok { color:var(--sl-muted); }
  .challenges li.ok span { color:var(--sl-accent); }
  .challenges li small { display:block; margin-left:18px; color:var(--sl-muted); font-size:12px; }
  .partner-list summary { cursor:pointer; color:var(--sl-muted); font-size:13px; padding:4px 0; min-height:28px; }
  .partner-list .chips { margin:4px 0 8px; }
  .partners:not(:empty) { border-bottom:1px solid var(--sl-line); margin-bottom:6px; }
  .scenes { display:grid; grid-template-columns:1fr 1fr; gap:5px; }
  .scene { display:block; width:100%; text-align:left; padding:6px 9px; font-size:13px; line-height:1.3; }
  .picked { display:flex; flex-wrap:wrap; align-items:center; gap:8px; padding:6px 8px; margin:6px 0 8px; background:var(--sl-raised); border-radius:6px; min-height:38px; }
  .picked i { width:14px; height:14px; border-radius:3px; flex:none; box-shadow:0 0 0 1px #fff3; }
  .picked .nm { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .picked small { color:var(--sl-muted); margin-left:4px; }
  .picked button { min-height:30px; font-size:12px; }
  .info dl { display:grid; grid-template-columns:auto 1fr; gap:3px 10px; margin:6px 0; font-size:13px; }
  .info dt { color:var(--sl-muted); }
  .info dd { margin:0; font-variant-numeric:tabular-nums; }
  .info p { margin:6px 0; line-height:1.55; }
  .compact { margin:4px 0; }
  .graph { position:relative; height:170px; margin-top:6px; background:var(--sl-bg); border:1px solid var(--sl-line); border-radius:6px; }
  .graph canvas { position:absolute; inset:0; width:100%; height:100%; touch-action:none; }
  .legend { display:flex; gap:12px; font-size:12px; color:var(--sl-muted); margin-top:5px; min-height:16px; }
  .legend span::before { content:""; display:inline-block; width:16px; margin-right:5px; vertical-align:middle; border-top:2px solid var(--c); }
  .legend span.dash::before { border-top-style:dashed; }
  .stats { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; }
  .stat { background:var(--sl-raised); border-radius:6px; padding:6px 8px; font-variant-numeric:tabular-nums; }
  .stat small { display:block; color:var(--sl-muted); font-size:12px; }
  .entry { border-bottom:1px solid var(--sl-line); padding:6px 0; }
  .entry summary { cursor:pointer; list-style:none; }
  .entry summary::-webkit-details-marker { display:none; }
  .search { flex:1; min-width:0; width:100%; min-height:36px; padding:0 10px; font:inherit; color:inherit; background:var(--sl-bg); border:1px solid var(--sl-line); border-radius:6px; }
  .cats { flex-wrap:nowrap; overflow-x:auto; padding-bottom:4px; margin-bottom:2px; scrollbar-width:thin; }
  .cats .chip { min-height:30px; font-size:12px; padding:0 8px; flex:none; white-space:nowrap; }
  .tools { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:4px; }
  .tools .chip { min-height:32px; font-size:12px; padding:0 2px; justify-content:center; white-space:nowrap; }
  .favs { margin:2px 0 8px; }
  .favs .chip { min-height:30px; font-size:12px; padding:0 7px; }
  .grp { border-bottom:1px solid var(--sl-line); }
  .grp summary { cursor:pointer; padding:7px 2px; min-height:32px; font-size:13px; }
  .grp summary small { color:var(--sl-muted); margin-left:4px; }
  .grp .chips { padding:0 0 8px; }
  .chip small { opacity:.7; font-size:11px; }
  .table-scroll { overflow-x:auto; padding-bottom:6px; }
  .ptable { display:grid; grid-template-columns:repeat(18,minmax(15px,1fr)); gap:1px; width:100%; min-width:max-content; }
  .el { min-height:0; aspect-ratio:1; padding:0; font-size:9.5px; letter-spacing:-.3px; overflow:hidden; font-weight:600; border-radius:4px; border:1px solid transparent; color:#e8edf2; background:#2a323c; }
  .el-alkali { background:#6a2f2f; } .el-alkaline { background:#6a4a2a; } .el-tm { background:#34506a; } .el-post { background:#2f5a5a; } .el-metalloid { background:#4a5a2f; }
  .el-nonmetal { background:#3a6a3a; } .el-halogen { background:#5a6a22; } .el-noble { background:#5a3a6a; } .el-ln { background:#2f4a7a; } .el-an { background:#6a3a5a; }
  .el.on { outline:2px solid var(--sl-accent); outline-offset:0; }
  .el-off { background:transparent; border-color:var(--sl-line); color:var(--sl-muted); opacity:.45; cursor:default; }
  .entry b { display:block; font-size:13px; }
  .entry code { font-family:inherit; color:var(--sl-accent); display:block; margin:2px 0; font-size:12px; }
  .entry span { color:var(--sl-muted); font-size:13px; line-height:1.45; }
  `;

  const TABS = [['materials', '재료'], ['scenes', '실험'], ['physics', '측정'], ['codex', '도감'], ['info', '정보']];
  const STATE_NAME = { solid: '고체', powder: '고체(가루)', liquid: '액체', gas: '기체' };
  // 예전 문서에 쓰인 실험 이름도 받아 준다.
  const SCENE_ALIAS = { sodium: 'alkali', boil: 'water' };
  const TOOLS = [['inspect', '관찰'], ['pick', '스포이트'], ['fill', '채우기'], ['vessel', '그릇'], ['stir', '섞기'], ['heat', '가열'], ['cool', '냉각'], ['erase', '지우개'], ['ball', '공'], ['probe', '온도계']];
  const BRUSH_TOOLS = ['mat', 'erase', 'heat', 'cool', 'stir', 'gasin', 'gasout', 'push', 'pull'];
  // 누르고 있는 동안 계속 작동하는 도구
  const HOLD_TOOLS = ['heat', 'cool', 'stir', 'gasin', 'gasout'];
  // 측정 탭의 압력·진공 도구
  const PROBE_COLORS = ['#6aa9ff', '#f2a34c', '#7ad08a'];
  const PRESSURE_TOOLS = [['toggle', '켜기·끄기'], ['box', '밀폐 용기'], ['gasin', '기체 넣기'], ['gasout', '기체 빼기'], ['push', '피스톤 밀기'], ['pull', '피스톤 빼기']];
  const BOX_MATS = [['glass', '유리 (6기압에서 깨짐)'], ['can', '얇은 캔 (안이 0.5기압 아래면 찌그러짐)'], ['wall', '튼튼한 벽 (깨지지 않음)']];
  // 자주 쓰는 재료. 재료 탭 맨 위에 늘 보인다.
  const FAVORITES = ['water', 'ice', 'fire', 'salt', 'hcl', 'naoh', 'vinegar', 'S:NaHCO3', 'Na:s', 'Mg:s', 'iron', 'copper', 'H2O2', 'sugar', 'oil', 'wood'];
  const TOOL_HINT = { inspect: '칸을 누르면 정보 탭에 자세히 나옵니다', erase: '공기로 지웁니다', heat: '누르고 있는 동안 데웁니다', cool: '누르고 있는 동안 식힙니다', ball: '끌었다 놓으면 던집니다', probe: '누른 곳의 온도를 측정 탭에 그립니다', stir: '누르고 문지르면 가루·액체·기체가 섞입니다(고체·고정 칸은 그대로)',
    pick: '실험 공간의 칸을 누르면 그 물질을 재료로 고릅니다',
    box: '끌어서 사방이 막힌 용기를 만듭니다', toggle: '스위치를 누르면 켜짐↔꺼짐, 밸브를 누르면 열림↔닫힘(장치 분류에서 스위치·밸브를 골라 그려 두세요)', gasin: '닫힌 용기 안을 누르고 있으면 기체를 밀어 넣습니다(자전거 펌프). 열린 곳에서는 바로 빠져나갑니다', gasout: '닫힌 용기 안을 누르고 있으면 기체를 빼냅니다(진공 펌프)',
    push: '밀폐 용기 안에 피스톤 판을 밀어 넣습니다. 기체 양은 그대로, 부피만 줄어듭니다', pull: '피스톤 판을 빼냅니다. 기체 양은 그대로, 부피만 늘어납니다', fill: '그릇 안을 누르면 마지막으로 고른 재료를 누른 높이까지 채웁니다', vessel: '끌어서 유리 그릇(바닥과 양쪽 벽)을 만듭니다' };
  const GRAVITY = [['무중력', 0], ['달', 1.62], ['화성', 3.71], ['지구', 9.81], ['목성', 24.79]];
  const fmt = (v, d) => (v == null || !isFinite(v) ? '-' : v.toFixed(d));

  // ---- 공유 코드: 저장 데이터를 압축해 글자로 바꾼다(대부분 공기라 아주 작아진다) ----
  const b64 = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64 = (str) => { const s = atob(str.replace(/-/g, '+').replace(/_/g, '/')); const u8 = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i); return u8; };
  const pipe = async (u8, Stream) => new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new Stream('gzip'))).arrayBuffer());
  async function encodeWorld(world) {
    const json = new TextEncoder().encode(JSON.stringify(world.toJSON()));
    if (typeof CompressionStream === 'function') return 'SL1.' + b64(await pipe(json, CompressionStream));
    return 'SL0.' + b64(json);
  }
  async function decodeCode(code) {
    const c = String(code || '').trim(), kind = c.slice(0, 4), body = c.slice(4);
    if (kind === 'SL1.') { if (typeof DecompressionStream !== 'function') throw new Error('이 브라우저는 압축 코드를 풀 수 없습니다.'); return JSON.parse(new TextDecoder().decode(await pipe(unb64(body), DecompressionStream))); }
    if (kind === 'SL0.') return JSON.parse(new TextDecoder().decode(unb64(body)));
    throw new Error('실험 코드가 아닙니다.');
  }

  // 효과음. 파일 없이 Web Audio로 그때그때 만든다. 기본은 꺼짐(사이트에 넣었을 때 갑자기 소리가 나지 않도록).
  class Sound {
    constructor() { this.on = false; this.ctx = null; this.last = {}; }
    enable(v) {
      this.on = !!v;
      if (this.on && !this.ctx) { try { const AC = globalThis.AudioContext || globalThis.webkitAudioContext; if (AC) this.ctx = new AC(); } catch (e) { this.ctx = null; } }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }
    noise() {
      if (this.buf) return this.buf;
      const n = this.ctx.sampleRate, b = this.ctx.createBuffer(1, n, n), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      return (this.buf = b);
    }
    play(kind, amt) {
      if (!this.on || !this.ctx) return;
      const c = this.ctx, now = c.currentTime;
      if (this.last[kind] && now - this.last[kind] < (kind === 'boom' ? 0.12 : 0.06)) return; // 너무 잦으면 건너뜀
      this.last[kind] = now;
      const out = c.createGain(); out.connect(c.destination);
      const env = (g, a, d, peak) => { g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(peak, now + a); g.gain.exponentialRampToValueAtTime(0.0001, now + a + d); };
      const tone = (f, type, a, d, peak, f2) => { const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, now); if (f2) o.frequency.exponentialRampToValueAtTime(f2, now + a + d); env(g, a, d, peak); o.connect(g); g.connect(out); o.start(now); o.stop(now + a + d + 0.05); };
      const hiss = (type, f, a, d, peak) => { const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = this.noise(); fl.type = type; fl.frequency.value = f; env(g, a, d, peak); s.connect(fl); fl.connect(g); g.connect(out); s.start(now); s.stop(now + a + d + 0.05); };
      if (kind === 'boom') { const k = Math.min(1, (amt || 3) / 8); hiss('lowpass', 300 + 500 * k, 0.005, 0.5 + 0.8 * k, 0.25 + 0.5 * k); tone(70, 'sine', 0.005, 0.4 + 0.4 * k, 0.3 * k + 0.1, 35); }
      else if (kind === 'crack') hiss('highpass', 2500, 0.002, 0.18, 0.25);
      else if (kind === 'fizz') hiss('bandpass', 3500, 0.01, 0.15, 0.05);
      else if (kind === 'click') tone(1400, 'square', 0.002, 0.04, 0.06);
      else if (kind === 'click2') tone(320, 'square', 0.002, 0.07, 0.08);
      else if (kind === 'chime') { tone(880, 'sine', 0.01, 0.35, 0.08); tone(1320, 'sine', 0.01, 0.3, 0.05); }
      else if (kind === 'chime2') { tone(660, 'triangle', 0.01, 0.25, 0.1); setTimeout(() => this.on && tone(990, 'triangle', 0.01, 0.4, 0.1), 0); }
    }
  }

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
      this.matId = 'Na:s'; // 채우기 도구가 쓸 마지막 재료
      // 사이트에서 쓸 재료를 정해 주면(materials 옵션) 그 재료만 고를 수 있다.
      this.allowed = Array.isArray(opts.materials) ? new Set(opts.materials.map((id) => { const k = this.world.data.idOf[id]; return k == null ? id : this.world.data.defs[k].id; })) : null;
      if (this.allowed && !this.allowed.has(this.tool.id)) { const first = [...this.allowed][0]; this.tool = { kind: 'mat', id: first }; this.matId = first; }
      this.boxMat = 'glass';
      this.paintConc = 1; // 용액을 그릴 때의 농도
      this.paletteCat = 'element';
      this.query = '';
      this.anchored = false;
      this.brush = 4;
      this.ballType = 'iron';
      this.ballR = 0.05;
      this.tab = 'materials';
      this.partnersOpen = true; // 정보 탭의 "함께 떨어뜨려 볼 재료"는 처음부터 펼친다.
      this.graphMode = 'v';
      this.codex = new Map((this.storage.load('codex') || []).map((e) => [e.id, e]));
      this.done = new Set(this.storage.load('challenges') || []);
      this.predicted = this.storage.load('predictions') || {}; // 예측 문제 결과 {id: {choice, correct}}
      this.pointer = null;
      this.hover = null;
      this.cleanups = [];
      this.stepMs = 2; this.drawMs = 2; this.budget = 12; this.dirty = true;
      this.touch = typeof matchMedia === 'function' && matchMedia('(hover: none)').matches;
      this.buildDom();
      this.renderer = new SL.Renderer(this.$('.grid'), this.world);
      this.sound = new Sound();
      this.renderer.onFx = (e) => this.sound.play(e.type === 'boom' ? 'boom' : e.dust ? 'crack' : 'fizz', e.r);
      this.zoom = { s: 1, x: 0, y: 0 };
      this.touches = new Map();
      this.setEffects(opts.effects !== false);
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
      <div class="wrap"><div class="root" tabindex="-1">
        <div class="bar">
          <button class="play" title="일시정지/재생">일시정지</button>
          <button class="stepone" title="한 틱만 진행">1틱</button>
          <button class="restart" title="현재 실험을 처음부터">다시</button>
          <button class="undo" title="마지막으로 그린 것 되돌리기 (Ctrl+Z)" disabled>되돌리기</button>
          <label>속도 <select class="speed">
            <option value="0.1">0.1배</option><option value="0.25">0.25배</option><option value="0.5">0.5배</option><option value="1" selected>1배</option><option value="2">2배</option>
          </select></label>
          <label>보기 <select class="view"><option value="normal">일반</option><option value="heat">온도</option><option value="density">밀도</option><option value="pressure">압력</option></select></label>
          <label title="불티·섬광·빛 번짐 같은 화면 효과 (물리 결과에는 영향 없음)"><input type="checkbox" class="fxon" checked> 효과</label>
          <label title="폭발음·깨지는 소리·발견 알림음"><input type="checkbox" class="sndon"> 소리</label>
          <label title="화면의 물질 덩어리마다 이름을 붙여 보여 줍니다(색을 구분하기 어려울 때)"><input type="checkbox" class="labelon"> 이름표</label>
          <span class="clock">0.00초</span>
        </div>
        <div class="stage"><div class="frame"><canvas class="grid"></canvas><canvas class="over" aria-label="실험 공간"></canvas></div>
          <div class="scale" hidden></div><div class="toast" role="status" aria-live="polite"></div><button class="zoomreset" hidden title="확대 초기화 (0)">원래 크기</button>
          <div class="starthint" hidden><div><b>재료를 고른 뒤 여기에 그려 보세요.</b><br>두 물질을 맞닿게 놓거나 섞기 도구로 문지르면 반응이 일어납니다.<br>가열·냉각 도구로 온도를 바꿀 수 있습니다.<br>공중에 그린 고체는 떨어집니다. 그 자리에 두려면 '고정'을 켜세요.</div></div></div>
        <div class="status">&nbsp;</div>
        <div class="side">
          <div class="tabs" role="tablist">${TABS.map(([id, n]) => `<button role="tab" data-tab="${id}">${n}</button>`).join('')}</div>
          <div class="pane"></div>
        </div>
      </div></div>`;
    }

    bindEvents() {
      this.listen(this.$('.play'), 'click', () => this.setRunning(!this.running));
      this.listen(this.$('.stepone'), 'click', () => { this.setRunning(false); this.world.step(); this.afterStep(); this.dirty = true; });
      this.listen(this.$('.restart'), 'click', () => this.loadScene(this.currentScene.id));
      this.listen(this.$('.undo'), 'click', () => this.undo());
      // 단축키는 실험실 안을 누른 뒤에만 받는다(사이트의 다른 단축키를 가로채지 않도록).
      this.listen(this.$('.root'), 'keydown', (e) => {
        const typing = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); this.undo(); return; }
        if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
        // 스페이스: 일시정지, [ ]: 붓 크기, 0: 확대 초기화
        if (e.key === ' ') { e.preventDefault(); this.setRunning(!this.running); }
        else if (e.key === '[' || e.key === ']') { this.brush = Math.max(1, Math.min(16, this.brush + (e.key === ']' ? 1 : -1))); const r = this.$('.brush'); if (r) { r.value = this.brush; const v = r.closest('.row').querySelector('.val'); if (v) v.textContent = this.brush + '칸'; } this.dirty = true; }
        else if (e.key === '0') this.resetZoom();
      });
      this.listen(this.$('.speed'), 'change', (e) => { this.speed = +e.target.value; });
      this.listen(this.$('.view'), 'change', (e) => this.setView(e.target.value));
      this.listen(this.$('.fxon'), 'change', (e) => this.setEffects(e.target.checked));
      this.listen(this.$('.sndon'), 'change', (e) => this.sound.enable(e.target.checked));
      this.listen(this.$('.labelon'), 'change', (e) => { this.labels = e.target.checked; this.labelCache = null; this.dirty = true; });
      this.listen(this.$('.zoomreset'), 'click', () => this.resetZoom());
      // 데스크톱: Ctrl(⌘)+휠로 확대. 그냥 휠은 페이지 스크롤에 양보한다.
      this.listen(this.$('.over'), 'wheel', (e) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        this.zoomAt(e.clientX, e.clientY, this.zoom.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
      }, { passive: false });
      this.listen(this.$('.tabs'), 'click', (e) => { const t = e.target.closest('[data-tab]'); if (t) this.setTab(t.dataset.tab); });

      const over = this.$('.over');
      this.listen(over, 'pointerdown', (e) => this.onDown(e));
      this.listen(over, 'pointermove', (e) => this.onMove(e));
      this.listen(over, 'pointerup', (e) => this.onUp(e));
      this.listen(over, 'pointercancel', (e) => { this.pointer = null; this.touches.delete(e.pointerId); if (!this.touches.size) this.gesture = null; });
      this.listen(over, 'pointerleave', () => { this.hover = null; this.hoverMoved = true; });

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
      // 덮개 캔버스는 선·불티만 그리므로 터치 기기에서는 해상도를 낮춰 부담을 줄인다.
      const over = this.$('.over'), dpr = Math.min(this.touch ? 1.25 : 2, devicePixelRatio || 1);
      this.dirty = true;
      over.width = Math.floor(this.world.w * s * dpr);
      over.height = Math.floor(this.world.h * s * dpr);
    }

    setEffects(v) {
      this.renderer.effects = !!v;
      if (!v) { this.renderer.particles = []; this.renderer.flashes = []; this.renderer.shake = 0; }
      const cb = this.$('.fxon');
      if (cb) cb.checked = !!v;
    }

    setRunning(v) { this.running = v; this.dirty = true; this.$('.play').textContent = v ? '일시정지' : '재생'; }

    setView(v) {
      this.renderer.mode = v; this.dirty = true;
      this.$('.view').value = v;
      const sc = this.$('.scale');
      sc.hidden = v === 'normal';
      if (v !== 'normal') {
        const stops = v === 'heat' ? SL.HEAT_STOPS : v === 'pressure' ? SL.PRESSURE_STOPS : SL.DENSITY_STOPS;
        const grad = stops.map((c) => `rgb(${c.join(',')})`).join(',');
        const [lo, hi] = v === 'heat' ? ['-60°C', '1600°C'] : v === 'pressure' ? ['진공 0.01', '1기압(회색) · 50기압'] : ['0.05', '10000 kg/m³'];
        sc.innerHTML = `<span>${lo}</span><i style="background:linear-gradient(90deg,${grad})"></i><span>${hi}</span>`;
      }
    }

    loadScene(id) {
      const want = SCENE_ALIAS[id] || id;
      const sc = SL.SCENES.find((s) => s.id === want) || SL.SCENES[0];
      if (id && sc.id !== want) console.warn(`[SandLab] 알 수 없는 실험 "${id}". 빈 실험실을 엽니다. 사용할 수 있는 이름: ${SL.SCENES.map((s) => s.id).join(', ')}`);
      this.currentScene = sc;
      this.world.reset();
      sc.setup(this.world);
      this.history = [];
      this.prediction = null; // 다른 실험을 열면 진행 중인 예측은 취소
      if (this.$('.undo')) this.$('.undo').disabled = true;
      this.$('.starthint').hidden = sc.id !== 'free';
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
      else if (this.tab === 'info') this.paneInfo(pane);
      else this.paneCodex(pane);
    }

    paneMaterials(pane) {
      const count = this.world.data.defs.length;
      pane.innerHTML = `<div class="chips tools">${TOOLS.map(([k, n]) => `<button class="chip" data-tool="${k}" title="${TOOL_HINT[k]}">${n}</button>`).join('')}</div>
        <div class="row compact"><label>붓 <input type="range" class="brush" min="1" max="16" value="${this.brush}"></label><span class="val">${this.brush}칸</span>
          <label title="끄면: 가루는 쌓이고, 나무·유리·돌 같은 고체는 한 덩어리로 떨어져 물에 뜨거나 가라앉습니다(높이 떨어진 유리는 깨짐). 켜면: 그린 자리에 그대로 고정됩니다. 공중에 그릇이나 벽을 만들 때 켜세요." style="flex:none"><input type="checkbox" class="anchor" ${this.anchored ? 'checked' : ''}> 고정</label></div>
        <input type="search" class="search" placeholder="물질 ${count}종 검색 (예: 황산, Cu, 소금)" aria-label="물질 검색" value="${this.query}">
        <div class="chips cats" style="margin-top:6px">${SL.CATEGORIES.map(([k, n]) => `<button class="chip" data-cat="${k}">${n}</button>`).join('')}</div>
        <div class="picked"></div>
        <div class="palette"></div>`;
      pane.querySelector('.search').insertAdjacentHTML('beforebegin', `<div class="chips favs" aria-label="자주 쓰는 재료">${FAVORITES.map((id) => this.world.data.idOf[id]).filter((k) => k != null && this.isAllowed(this.world.data.defs[k].id)).map((k) => { const d = this.world.data.defs[k]; return `<button class="chip" data-mat="${d.id}" title="${d.formula}"><i style="background:${d.color}"></i>${(d.name.match(/\(([^)]+)\)$/) || [0, d.name])[1]}</button>`; }).join('')}</div>`);
      pane.onclick = (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.classList.contains('more')) { this.setTab('info'); return; }
        if (b.dataset.conc) { this.paintConc = +b.dataset.conc; this.markSelection(); return; }
        if (b.dataset.mat) { this.tool = { kind: 'mat', id: b.dataset.mat }; this.matId = b.dataset.mat; }
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
      const on = pane.querySelector('.cats .on');
      if (on) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    // 목록 다시 그리기는 재료 목록 부분만 한다. 물질이 많아 패널 전체를 다시 만들지 않는다.
    isAllowed(id) { return !this.allowed || this.allowed.has(id); }
    renderPalette() {
      const box = this.$('.palette');
      if (!box) return;
      const defs = this.world.data.defs.filter((d) => this.isAllowed(d.id));
      const q = this.query.toLowerCase();
      const chip = (d) => `<button class="chip" data-mat="${d.id}" title="${d.formula}: ${d.desc || ''}"><i style="background:${d.color}"></i>${d.name}${d.cat === 'salt' || d.cat === 'solution' ? ` <small>${d.formula}</small>` : ''}</button>`;
      if (q) {
        const hits = defs.filter((d) => (d.cat || d.state !== 'gas') && d.id !== 'air' && (d.name.toLowerCase().includes(q) || (d.fx || '').toLowerCase().includes(q) || d.id.toLowerCase() === q));
        box.innerHTML = hits.length ? `<div class="chips">${hits.slice(0, 120).map(chip).join('')}</div>` : '<p class="hint">찾는 물질이 없습니다. 다른 이름이나 화학식으로 검색해 보세요.</p>';
      } else if (this.paletteCat === 'element') {
        const idOf = this.world.data.idOf;
        const cells = SL.ELEMENTS.map((e) => {
          const [row, col] = SL.elementCell(e.z);
          if (idOf[e.sym] == null || !this.isAllowed(this.world.data.defs[idOf[e.sym]].id)) return `<button class="el el-off" style="grid-row:${row};grid-column:${col}" disabled title="${e.z} ${e.name}: 반응이 거의 없거나 성질이 알려지지 않아 넣지 않았습니다">${e.sym}</button>`;
          const id = this.world.data.defs[idOf[e.sym]].id;
          return `<button class="el el-${e.cat}" style="grid-row:${row};grid-column:${col}" data-mat="${id}" title="${e.z} ${e.name}">${e.sym}</button>`;
        }).join('');
        box.innerHTML = `<div class="table-scroll"><div class="ptable">${cells}</div></div>`;
      } else if (this.paletteCat === 'salt' || this.paletteCat === 'solution') {
        // 염과 용액은 수백 종이라 금속 이온별로 묶어 접어 둔다.
        const groups = new Map();
        for (const d of defs) {
          if (d.cat !== this.paletteCat) continue;
          const key = d.salt && SL.CATION[d.salt.c] ? SL.CATION[d.salt.c].name : '그 밖의 것';
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push(d);
        }
        this.openGroups = this.openGroups || new Set();
        box.innerHTML = [...groups].map(([k, list]) => `<details class="grp" data-grp="${k}"${this.openGroups.has(k) ? ' open' : ''}><summary>${k} <small>${list.length}</small></summary><div class="chips">${list.map(chip).join('')}</div></details>`).join('');
        box.querySelectorAll('.grp').forEach((g) => { g.ontoggle = () => { if (g.open) this.openGroups.add(g.dataset.grp); else this.openGroups.delete(g.dataset.grp); }; });
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
      const picked = pane.querySelector('.picked');
      if (!picked) return;
      if (this.tool.kind === 'mat') {
        const d = this.world.data.defs[this.world.data.idOf[this.tool.id]];
        const sol = this.world.data.solute[this.world.data.idOf[d.id]];
        picked.innerHTML = `<i style="background:${d.color}"></i><span class="nm"><b>${d.name}</b><small>${d.formula}</small></span><button class="more" title="설명과 함께 떨어뜨려 볼 재료">정보 ›</button>` +
          (sol ? `<div class="concs" role="group" aria-label="농도" style="flex-basis:100%;display:flex;gap:4px;align-items:center;margin-top:6px"><small class="hint" style="margin:0">농도</small>${[[1, '기준'], [0.1, '×0.1'], [0.01, '×0.01'], [0.001, '×0.001']].map(([c, n]) => `<button class="chip${this.paintConc === c ? ' on' : ''}" data-conc="${c}" style="min-height:26px">${n}</button>`).join('')}</div>` : '');
      } else {
        const t = TOOLS.find(([k]) => k === this.tool.kind);
        const fillMat = this.tool.kind === 'fill' ? this.world.data.defs[this.world.data.idOf[this.matId]] : null;
        picked.innerHTML = `${fillMat ? `<i style="background:${fillMat.color}"></i>` : ''}<span class="nm"><b>${t ? t[1] : ''}${fillMat ? ' · ' + fillMat.name : ''}</b><small>${TOOL_HINT[this.tool.kind] || ''}</small></span>`;
      }
    }

    // 긴 설명은 정보 탭에 모은다. 고른 재료, 관찰한 칸, 지금 실험, 최근 발견을 한곳에서 본다.
    paneInfo(pane) {
      const data = this.world.data;
      const mat = this.tool.kind === 'mat' ? data.defs[data.idOf[this.tool.id]] : null;
      const ins = this.inspected;
      const props = (d, T) => {
        const rows = [['화학식', d.formula], ['상태', STATE_NAME[d.state] || d.state], ['밀도', `${fmt(d.density, d.density < 10 ? 2 : 0)} kg/m³`]];
        if (T != null) rows.push(['온도', fmt(T, 1) + '°C']);
        if (d.pH != null) rows.push(['pH', String(d.pH)]);
        if (d.mp != null && d.state !== 'gas') rows.push(['녹는점', d.mp + '°C']);
        if (d.bp != null) rows.push([d.subl ? '승화점' : '끓는점', d.bp + '°C']);
        return `<dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
      };
      const last = [...this.codex.values()].pop();
      pane.innerHTML = `<div class="info">
        ${mat ? `<h3>고른 재료</h3><b>${mat.name}</b>${props(mat)}<p>${mat.desc || ''}</p><div class="partners"></div>` : ''}
        ${ins ? `<h3>관찰한 칸</h3><b>${ins.def.name}</b>${props(ins.def, ins.T)}<p>${ins.def.desc || ''}</p>` : ''}
        <h3>지금 실험: ${this.currentScene.name}</h3><p class="hint">${this.currentScene.desc}</p>
        ${last ? `<h3>최근 발견</h3><b>${last.name}</b><div class="entry"><code>${last.eq}</code><span>${last.note || ''}</span></div>` : ''}
        <p class="hint">모의 실험입니다. 유독하거나 위험한 물질이 많으니 실제로 따라 하지 마세요.</p></div>`;
      if (mat) this.renderPartners(mat);
      pane.onclick = (e) => {
        const b = e.target.closest('[data-mat]');
        if (!b) return;
        this.tool = { kind: 'mat', id: b.dataset.mat }; this.matId = b.dataset.mat;
        this.renderPane();
      };
    }

    // 고른 물질과 반응하는 재료를 보여 준다. 누르면 그 재료를 고른다.
    renderPartners(d) {
      const box = this.$('.pane .partners');
      if (!box) return;
      if (!d) { box.innerHTML = ''; return; }
      this.partnerCache = this.partnerCache || new Map();
      if (!this.partnerCache.has(d.id)) this.partnerCache.set(d.id, this.world.partnersOf(this.world.data.idOf[d.id]));
      const all = this.partnerCache.get(d.id);
      const air = all.find((p) => p.id === 'air');
      const order = ['basic', 'acid', 'base', 'gas', 'solution', 'indicator', 'organic', 'salt', 'element', 'rock', 'alloy', 'chem', 'cryo', 'nuclear', 'device'];
      const rank = (p) => { const k = order.indexOf(p.cat); return k < 0 ? 99 : k; };
      const list = all.filter((p) => p.id !== 'air').sort((x, y) => rank(x) - rank(y) || x.name.localeCompare(y.name, 'ko'));
      const cond = (p) => (p.minT != null ? ` · ${Math.round(p.minT)}°C 이상` : '') + (p.near ? ` · 옆에 ${p.near.join('/')} 필요` : '');
      const chip = (p) => `<button class="chip" data-mat="${p.id}" title="${p.reaction}${cond(p)}"><i style="background:${p.color}"></i>${p.name}${p.minT != null ? ' <small>가열</small>' : ''}</button>`;
      box.innerHTML = (air ? `<p class="hint">공기 중에서: ${air.reaction}${cond(air)}</p>` : '') +
        (list.length ? `<details class="partner-list"${this.partnersOpen ? ' open' : ''}><summary>함께 떨어뜨려 볼 재료 ${list.length}종</summary><div class="chips">${list.slice(0, 40).map(chip).join('')}</div>${list.length > 40 ? `<p class="hint">외 ${list.length - 40}종</p>` : ''}</details>` : '<p class="hint">재료 목록에서 이 물질과 반응하는 것이 없습니다. 가열·냉각하면 상태가 바뀝니다.</p>');
      const det = box.querySelector('details');
      if (det) det.ontoggle = () => { this.partnersOpen = det.open; };
    }

    paneScenes(pane) {
      const slot = (k) => { const v = this.storage.load('slot' + k); return v && v.code ? new Date(v.t).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '비어 있음'; };
      pane.innerHTML = `<div class="scenes">${SL.SCENES.map((s) => `<button class="scene${s.id === this.currentScene.id ? ' on' : ''}" data-scene="${s.id}" title="${s.desc}">${s.name}</button>`).join('')}</div>
        <p class="hint">실험을 고르면 설명은 정보 탭에서 볼 수 있습니다.</p>
        <h3>내가 만든 실험 저장</h3>
        ${[1, 2, 3].map((k) => `<div class="row compact"><span style="flex:1">칸 ${k} <small class="hint">${slot(k)}</small></span><button class="chip" data-save="${k}">저장</button><button class="chip" data-load="${k}">불러오기</button></div>`).join('')}
        <h3>공유 코드</h3>
        <div class="row compact"><button class="chip copycode">지금 실험을 코드로 복사</button><button class="chip loadcode">아래 코드 불러오기</button></div>
        <textarea class="code" rows="3" placeholder="다른 사람이 보낸 실험 코드를 붙여 넣으세요 (SL1.로 시작)" aria-label="실험 코드" style="width:100%;font:12px monospace;background:var(--sl-raised);color:var(--sl-ink);border:1px solid var(--sl-line);border-radius:6px;padding:6px"></textarea>`;
      pane.onclick = async (e) => {
        const sv = e.target.closest('[data-save]'), ld = e.target.closest('[data-load]');
        try {
          if (sv) { this.storage.save('slot' + sv.dataset.save, { t: Date.now(), code: await encodeWorld(this.world) }); this.toast({ name: '칸 ' + sv.dataset.save + '에 저장함', eq: '같은 브라우저에서 다시 불러올 수 있습니다.' }, ''); this.renderPane(); return; }
          if (ld) { const v = this.storage.load('slot' + ld.dataset.load); if (!v || !v.code) { this.toast({ name: '빈 칸', eq: '먼저 저장해 주세요.' }, ''); return; } await this.importCode(v.code); return; }
          if (e.target.closest('.copycode')) {
            const code = await encodeWorld(this.world), ta = pane.querySelector('.code');
            ta.value = code;
            try { await navigator.clipboard.writeText(code); this.toast({ name: '코드를 복사함', eq: `${code.length.toLocaleString()}자 · 붙여 넣어 보내면 같은 실험을 열 수 있습니다.` }, ''); }
            catch (err) { ta.select(); this.toast({ name: '코드를 아래 칸에 넣었습니다', eq: '직접 복사해 주세요.' }, ''); }
            return;
          }
          if (e.target.closest('.loadcode')) { await this.importCode(pane.querySelector('.code').value); return; }
        } catch (err) { this.toast({ name: '불러오지 못함', eq: err.message }, ''); return; }
        const b = e.target.closest('[data-scene]');
        if (!b) return;
        this.loadScene(b.dataset.scene);
        const next = this.currentScene.tab;
        this.setTab(next === 'materials' ? 'materials' : next);
      };
    }

    panePhysics(pane) {
      const w = this.world;
      pane.innerHTML = `<h3>측정</h3>
        <div class="chips">${[['v', '수직 속도'], ['h', '높이'], ['E', '역학적 에너지'], ['T', '온도계'], ['P', '압력계'], ['pH', 'pH계']].map(([k, n]) => `<button class="chip${this.graphMode === k ? ' on' : ''}" data-graph="${k}">${n}</button>`).join('')}</div>
        <div class="graph"><canvas class="plot"></canvas></div><div class="legend"></div><div class="stats"></div>
        <div class="chips" style="margin-top:6px"><button class="chip csv" title="지금 그래프의 측정값을 표 파일(CSV)로 저장">CSV로 저장</button><button class="chip clearprobes">온도계 모두 지우기</button></div>
        <h3>중력</h3><div class="chips">${GRAVITY.map(([n, g]) => `<button class="chip${Math.abs(w.g - g) < 0.005 ? ' on' : ''}" data-g="${g}">${n}</button>`).join('')}</div>
        <div class="row"><label>g <input type="range" class="grav" min="0" max="25" step="0.01" value="${w.g}"></label><span class="val gval">${fmt(w.g, 2)} m/s²</span></div>
        <div class="row"><label><input type="checkbox" class="vac" ${w.vacuum ? 'checked' : ''}> 공기 저항 없음(진공)</label></div>
        <div class="row"><label>열전달 가속 <input type="range" class="boost" min="1" max="1000" value="${w.heatBoost}"></label><span class="val bval">×${w.heatBoost}</span></div>
        <h3>압력·진공·장치</h3>
        <div class="chips">${PRESSURE_TOOLS.map(([k, n]) => `<button class="chip${this.tool.kind === k ? ' on' : ''}" data-ptool="${k}" title="${TOOL_HINT[k]}">${n}</button>`).join('')}</div>
        <div class="row"><label>용기 <select class="boxmat">${BOX_MATS.map(([k, n]) => `<option value="${k}" ${k === this.boxMat ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>
        <div class="row"><label><input type="checkbox" class="pview" ${this.renderer.mode === 'pressure' ? 'checked' : ''}> 압력 보기</label><button class="chip pgraph">압력계로 재기</button></div>
        <p class="hint">${this.tool.kind && TOOL_HINT[this.tool.kind] && PRESSURE_TOOLS.some(([k]) => k === this.tool.kind) ? '<b>' + TOOL_HINT[this.tool.kind] + '</b><br>' : ''}밀폐 용기를 만든 뒤 안에서 기체를 넣거나 빼고, 피스톤으로 부피를 바꿔 보세요. 압력은 PV = nRT를 따릅니다. 진공에 가까우면 물이 상온에서 끓고, 너무 높으면 용기가 터집니다. 온도계 도구로 용기 안을 누른 뒤 '압력계로 재기'를 누르면 그래프가 나옵니다.</p>
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
        else if (b.dataset.ptool) { this.tool = { kind: b.dataset.ptool }; this.renderPane(); }
        else if (b.classList.contains('csv')) this.exportCSV();
        else if (b.classList.contains('clearprobes')) { w.probe = null; this.renderPane(); }
        else if (b.classList.contains('pgraph')) { this.graphMode = 'P'; if (!w.probe) this.tool = { kind: 'probe' }; this.renderPane(); }
        else if (b.classList.contains('clearballs')) { w.bodies = []; w.select(null); }
      };
      pane.querySelector('.grav').oninput = (e) => { w.g = +e.target.value; pane.querySelector('.gval').textContent = fmt(w.g, 2) + ' m/s²'; };
      pane.querySelector('.vac').onchange = (e) => { w.vacuum = e.target.checked; };
      pane.querySelector('.boost').oninput = (e) => { w.setHeatBoost(+e.target.value); pane.querySelector('.bval').textContent = '×' + e.target.value; };
      pane.querySelector('.boxmat').onchange = (e) => { this.boxMat = e.target.value; };
      pane.querySelector('.pview').onchange = (e) => this.setView(e.target.checked ? 'pressure' : 'normal');
      pane.querySelector('.balltype').onchange = (e) => { this.ballType = e.target.value; };
      pane.querySelector('.ballr').oninput = (e) => { this.ballR = e.target.value / 100; pane.querySelector('.rval').textContent = e.target.value + ' cm'; };
      const plot = pane.querySelector('.plot');
      plot.onpointermove = (e) => { const r = plot.getBoundingClientRect(); this.plotHover = (e.clientX - r.left) / r.width; };
      plot.onpointerleave = () => { this.plotHover = null; };
    }

    // ---- 예측 → 실험 → 비교 ----
    predictionsHtml() {
      const list = SL.PREDICTIONS || [];
      if (!list.length) return '';
      const right = list.filter((p) => this.predicted[p.id] && this.predicted[p.id].correct).length;
      const item = (p) => {
        const r = this.predicted[p.id], run = this.prediction && this.prediction.id === p.id;
        const btns = p.choices.map((c, k) => `<button class="chip${r && r.choice === k ? ' on' : ''}" data-pred="${p.id}" data-choice="${k}" ${run ? 'disabled' : ''}>${c}</button>`).join('');
        const res = run ? '<small class="hint">실험 중… 지켜보세요</small>' : r ? `<small class="hint">${r.correct ? '✓ 맞았습니다.' : '✗ 정답: ' + p.choices[p.answer] + '.'} ${p.explain}</small>` : '';
        return `<div class="entry" style="margin:8px 0"><b>${p.q}</b><div class="chips" style="margin:4px 0">${btns}</div>${res}</div>`;
      };
      return `<details class="predictions"${this.predOpen === false ? '' : ' open'}><summary><h3>예측하고 확인하기 ${right} / ${list.length}</h3></summary><p class="hint">먼저 결과를 골라 보세요. 그러면 실험이 열리고, 잠시 뒤 정답과 이유가 나옵니다.</p>${list.map(item).join('')}</details>`;
    }
    startPrediction(id, choice) {
      const p = (SL.PREDICTIONS || []).find((q) => q.id === id);
      if (!p) return;
      this.loadScene(p.scene);
      if (p.act) p.act(this.world);
      this.prediction = { id, choice, until: this.world.time + p.seconds };
      this.predOpen = true;
      this.toast({ name: '내 예측: ' + p.choices[choice], eq: `${p.seconds}초 동안 실험을 지켜보세요.` }, '');
      this.renderPane();
    }
    checkPrediction() {
      const pr = this.prediction;
      if (!pr || this.world.time < pr.until) return;
      const p = SL.PREDICTIONS.find((q) => q.id === pr.id);
      this.prediction = null;
      const correct = pr.choice === p.answer;
      this.predicted[p.id] = { choice: pr.choice, correct };
      this.storage.save('predictions', this.predicted);
      this.toast({ name: correct ? '예측이 맞았습니다' : '정답: ' + p.choices[p.answer], eq: p.explain.length > 60 ? p.explain.slice(0, 58) + '…' : p.explain }, correct ? '✓ ' : '✗ ');
      this.sound.play(correct ? 'chime2' : 'click2');
      this.emit('prediction', { id: p.id, choice: pr.choice, correct });
      if (this.tab === 'codex') this.renderPane();
    }

    // 아직 못 찾은 대표 반응 몇 개를 이름으로만 귀띔한다(무엇과 무엇인지는 직접 찾게).
    codexHints() {
      const named = new Map();
      for (const r of SL.REACTIONS) if (!r.silent && r.name && !named.has(r.id)) named.set(r.id, r.name);
      const total = named.size, got = [...named.keys()].filter((k) => this.codex.has(k)).length;
      const left = [...named].filter(([k]) => !this.codex.has(k));
      this.hintSeed = this.hintSeed || 1;
      const pick = [];
      for (let k = 0; k < 3 && left.length; k++) pick.push(left.splice((this.hintSeed * 7919 + k * 104729) % left.length, 1)[0][1]);
      const pct = total ? Math.round(got / total * 100) : 0;
      return `<div class="row compact"><div style="flex:1;height:8px;border-radius:4px;background:var(--sl-raised);overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:var(--sl-accent)"></i></div><small class="hint">대표 반응 ${got} / ${total}</small></div>` +
        (pick.length ? `<p class="hint">아직 못 찾은 반응: <b>${pick.join('</b>, <b>')}</b> <button class="chip morehint" style="min-height:26px">다른 힌트</button></p>` : '');
    }

    paneCodex(pane) {
      const entries = [...this.codex.values()];
      const found = entries.filter((e) => e.type === 'reaction').length;
      const ch = SL.CHALLENGES || [];
      pane.innerHTML = this.predictionsHtml() + `<details class="challenges"${this.challengesOpen ? ' open' : ''}><summary><h3>도전 과제 ${this.done.size} / ${ch.length}</h3></summary><ul>${ch.map((c) => `<li class="${this.done.has(c.id) ? 'ok' : ''}" title="${c.hint}"><span>${this.done.has(c.id) ? '✓' : '○'}</span>${c.name}${this.done.has(c.id) ? '' : `<small>${c.hint}</small>`}</li>`).join('')}</ul></details>` +
        `<h3>발견한 반응 ${found}개, 상태 변화 ${entries.length - found}개</h3>` + this.codexHints() +
        (entries.length ? entries.slice().reverse().map((e) => `<details class="entry"><summary><b>${e.name}</b><code>${e.eq}</code></summary><span>${e.note || ''}</span></details>`).join('')
          : '<p class="hint">아직 발견한 반응이 없습니다. 물질들을 만나게 해 보세요.</p>');
      pane.onclick = (e) => {
        if (e.target.closest('.morehint')) { this.hintSeed = (this.hintSeed || 1) + 1; this.renderPane(); return; }
        const b = e.target.closest('[data-pred]');
        if (b) this.startPrediction(b.dataset.pred, +b.dataset.choice);
      };
      const pd = pane.querySelector('.predictions');
      if (pd) pd.ontoggle = () => { this.predOpen = pd.open; };
      const det = pane.querySelector('.challenges');
      det.ontoggle = () => { this.challengesOpen = det.open; };
    }

    // ---- 입력 ----
    // ---- 확대·이동 (두 손가락, Ctrl+휠) ----
    applyTransform(sx, sy) {
      const z = this.zoom, f = this.$('.frame');
      const t = (z.s !== 1 || z.x || z.y ? `translate(${z.x.toFixed(1)}px,${z.y.toFixed(1)}px) scale(${z.s.toFixed(3)})` : '') + (sx || sy ? ` translate(${(sx || 0).toFixed(1)}px,${(sy || 0).toFixed(1)}px)` : '');
      f.style.transform = t;
      this.$('.zoomreset').hidden = z.s === 1;
    }
    clampZoom() {
      const z = this.zoom, f = this.$('.frame'), W = f.offsetWidth, H = f.offsetHeight;
      z.s = Math.max(1, Math.min(6, z.s));
      z.x = Math.max(W * (1 - z.s), Math.min(0, z.x)); z.y = Math.max(H * (1 - z.s), Math.min(0, z.y));
      if (z.s === 1) { z.x = 0; z.y = 0; }
    }
    // 화면 좌표 (cx, cy)가 제자리에 있도록 확대 배율을 s로 바꾼다.
    zoomAt(cx, cy, s) {
      const z = this.zoom, f = this.$('.frame').getBoundingClientRect();
      const fx = f.left - z.x, fy = f.top - z.y; // 변환 전 틀의 왼쪽 위
      const lx = (cx - fx - z.x) / z.s, ly = (cy - fy - z.y) / z.s; // 틀 안의 점(변환 전)
      z.s = Math.max(1, Math.min(6, s));
      z.x = cx - fx - lx * z.s; z.y = cy - fy - ly * z.s;
      this.clampZoom(); this.applyTransform(); this.dirty = true;
    }
    resetZoom() { this.zoom = { s: 1, x: 0, y: 0 }; this.applyTransform(); this.dirty = true; }
    gestureStart() {
      const [a, b] = [...this.touches.values()];
      this.gesture = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, s: this.zoom.s, x: this.zoom.x, y: this.zoom.y };
    }
    gestureMove() {
      const g = this.gesture, [a, b] = [...this.touches.values()];
      if (!g || !b) return;
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const s = Math.max(1, Math.min(6, g.s * d / g.d));
      const f = this.$('.frame').getBoundingClientRect(), ox = f.left - this.zoom.x, oy = f.top - this.zoom.y;
      // 처음 두 손가락 가운데에 있던 점이 지금 가운데로 오도록
      const lx = (g.mx - ox - g.x) / g.s, ly = (g.my - oy - g.y) / g.s;
      this.zoom = { s, x: mx - ox - lx * s, y: my - oy - ly * s };
      this.clampZoom(); this.applyTransform(); this.dirty = true;
    }

    cellAt(e) {
      const r = this.$('.over').getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left) / r.width * this.world.w), y = Math.floor((e.clientY - r.top) / r.height * this.world.h);
      return { x: Math.max(0, Math.min(this.world.w - 1, x)), y: Math.max(0, Math.min(this.world.h - 1, y)) };
    }
    bodyAt(c) {
      const dx = this.world.dx;
      return this.world.bodies.find((b) => Math.hypot(b.x / dx - c.x, b.y / dx - c.y) <= b.r / dx + 2);
    }
    // 그리기 직전 상태를 기억해 두었다가 되돌린다.
    remember() {
      this.history = this.history || [];
      this.history.push(this.world.snapshot());
      if (this.history.length > 20) this.history.shift();
      this.$('.undo').disabled = false;
    }
    undo() {
      if (!this.history || !this.history.length) return;
      this.world.restoreSnapshot(this.history.pop());
      this.dirty = true;
      this.$('.undo').disabled = !this.history.length;
    }
    onDown(e) {
      if (e.pointerType === 'touch') {
        this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (this.touches.size === 2) {
          // 두 번째 손가락: 그리던 것을 취소하고 확대·이동으로 바꾼다.
          if (this.pointer && performance.now() - this.downAt < 400 && this.history && this.history.length) this.undo();
          this.pointer = null; this.gestureStart();
          return;
        }
        if (this.touches.size > 2) return;
      }
      this.downAt = performance.now();
      e.currentTarget.setPointerCapture(e.pointerId);
      this.$('.starthint').hidden = true;
      this.$('.root').focus({ preventScroll: true });
      if (BRUSH_TOOLS.includes(this.tool.kind) || ['ball', 'vessel', 'box'].includes(this.tool.kind)) this.remember();
      const c = this.cellAt(e);
      this.hover = c;
      const hit = this.bodyAt(c);
      if (hit && this.tool.kind !== 'erase') { // 공 선택이 다른 도구보다 우선한다.
        this.world.select(hit);
        hit.log = []; hit.born = this.world.time; hit.firstHit = null; hit.vy0 = hit.vy; hit.y0 = hit.y;
        return;
      }
      this.pointer = { start: c, last: c, cur: c };
      if (this.tool.kind === 'pick') {
        const info = this.world.inspect(c.x, c.y);
        this.pointer = null;
        if (info && info.def.id !== 'air' && this.isAllowed(info.def.id)) { this.tool = { kind: 'mat', id: info.def.id }; this.matId = info.def.id; this.setTab('materials'); }
        return;
      }
      if (this.tool.kind === 'fill') {
        this.pointer = null;
        this.remember();
        const n = this.world.fillLevel(c.x, c.y, this.world.data.idOf[this.matId], null, this.paintConc);
        this.dirty = true;
        if (!n) { this.history.pop(); this.toast({ name: '채울 수 없음', eq: '벽으로 둘러싸인 그릇 안을 눌러 주세요(너무 넓으면 채우지 않습니다).' }, ''); }
        return;
      }
      if (this.tool.kind === 'inspect') { this.inspected = this.world.inspect(c.x, c.y); this.pointer = null; this.setTab('info'); return; }
      if (this.tool.kind === 'probe') { this.world.addProbe(c.x, c.y); if (this.graphMode !== 'P') this.graphMode = 'T'; this.pointer = null; if (this.tab === 'physics') this.renderPane(); return; }
      if (this.tool.kind === 'toggle') {
        this.pointer = null; this.remember();
        const r = this.world.toggleDevice(c.x, c.y);
        if (!r) { this.history.pop(); this.toast({ name: '켜고 끌 장치가 없음', eq: '스위치나 밸브(장치 분류)를 그린 뒤 그 위를 눌러 주세요.' }, ''); }
        else this.sound.play(r.startsWith('valve') ? 'click2' : 'click');
        this.dirty = true;
        return;
      }
      if (!['ball', 'vessel', 'box'].includes(this.tool.kind)) this.applyBrush(c.x, c.y);
    }
    onMove(e) {
      if (e.pointerType === 'touch' && this.touches.has(e.pointerId)) {
        this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (this.touches.size >= 2) { this.gestureMove(); return; }
      }
      const c = this.cellAt(e);
      this.hoverMoved = true;
      this.hover = c;
      const p = this.pointer;
      if (!p) return;
      p.cur = c;
      if (['ball', 'vessel', 'box'].includes(this.tool.kind)) return;
      // 빠르게 그어도 끊기지 않도록 사이 칸을 채운다.
      const steps = Math.max(1, Math.max(Math.abs(c.x - p.last.x), Math.abs(c.y - p.last.y)));
      for (let n = 1; n <= steps; n++) {
        this.applyBrush(Math.round(p.last.x + (c.x - p.last.x) * n / steps), Math.round(p.last.y + (c.y - p.last.y) * n / steps));
      }
      p.last = c;
    }
    onUp(e) {
      if (e.pointerType === 'touch') {
        const wasGesture = this.touches.size >= 2;
        this.touches.delete(e.pointerId);
        if (wasGesture || this.gesture) { if (!this.touches.size) this.gesture = null; this.pointer = null; return; }
      }
      const p = this.pointer;
      this.pointer = null;
      if (e.pointerType !== 'mouse') this.hover = null;
      if (p && (this.tool.kind === 'vessel' || this.tool.kind === 'box')) {
        const c = this.cellAt(e), box = this.tool.kind === 'box';
        if (!this.world.vessel(p.start.x, p.start.y, c.x, c.y, box ? this.boxMat : 'glass', box)) this.history.pop();
        this.dirty = true;
        return;
      }
      if (!p || this.tool.kind !== 'ball') return;
      const w = this.world, dx = w.dx, c = this.cellAt(e);
      const b = w.addBody({
        type: this.ballType, r: this.ballR, x: (p.start.x + 0.5) * dx, y: (p.start.y + 0.5) * dx,
        vx: (c.x - p.start.x) * dx * 4, vy: (c.y - p.start.y) * dx * 4, // 1m 끌면 4 m/s
      });
      w.select(b);
    }
    applyBrush(x, y) {
      this.dirty = true;
      const w = this.world, t = this.tool, r = this.brush - 1;
      if (t.kind === 'mat') w.paint(x, y, r, w.data.idOf[t.id], true, this.anchored, this.paintConc);
      else if (t.kind === 'erase') {
        w.paint(x, y, r, w.AIR, false);
        const hit = this.bodyAt({ x, y });
        if (hit) { w.bodies.splice(w.bodies.indexOf(hit), 1); if (w.selected === hit) w.select(null); }
      } else if (t.kind === 'heat') w.addHeat(x, y, r, 60);
      else if (t.kind === 'cool') w.addHeat(x, y, r, -40);
      else if (t.kind === 'stir') w.stir(x, y, Math.max(2, r + 1));
      else if (t.kind === 'gasin') w.pumpGas(x, y, r, 1.01);
      else if (t.kind === 'gasout') w.pumpGas(x, y, r, 0.985);
      else if (t.kind === 'push') w.pistonPush(x, y, r);
      else if (t.kind === 'pull') w.pistonPull(x, y, r);
    }

    // ---- 루프 ----
    loop(now) {
      this.raf = requestAnimationFrame(this.loop);
      const real = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      if (!this.visible) return;
      // 누르고 있는 동안 가열/냉각을 계속한다.
      if (this.pointer && HOLD_TOOLS.includes(this.tool.kind)) this.applyBrush(this.pointer.cur.x, this.pointer.cur.y);
      let n = 0;
      if (this.running) {
        this.acc += real * this.speed;
        // 한 프레임에 쓸 계산 시간을 정해 두고, 그 안에서만 틱을 돌린다. 느린 기기에서는 몰아서 계산하다
        // 화면이 멈추는 대신 시뮬레이션이 조금 느리게 흐른다.
        const maxSteps = Math.max(1, Math.min(4, Math.floor(this.budget / Math.max(0.3, this.stepMs))));
        while (this.acc >= this.world.dt && n < maxSteps) {
          const t0 = performance.now();
          this.world.step();
          this.stepMs = this.stepMs * 0.9 + (performance.now() - t0) * 0.1;
          this.acc -= this.world.dt; n++;
        }
        if (n === maxSteps && this.acc >= this.world.dt) this.acc = 0;
        if (n) this.afterStep();
      }
      // 바뀐 것이 없으면 다시 그리지 않는다(120Hz 화면, 일시정지 중).
      const fxBusy = this.renderer.particles.length || this.renderer.flashes.length || this.renderer.shake;
      if (!n && !this.dirty && !this.pointer && !fxBusy && !this.hoverMoved) return;
      if (n && this.labels && this.labelCache && this.world.time - this.labelCache.t > 0.5) this.labelCache = null;
      this.dirty = false; this.hoverMoved = false;
      const t1 = performance.now();
      this.renderer.draw();
      this.drawOverlay();
      const clock = fmt(this.world.time, 2) + '초';
      if (clock !== this.clockText) { this.$('.clock').textContent = clock; this.clockText = clock; }
      this.updateStatus();
      if (this.tab === 'physics') this.drawPlot();
      // 그리기가 계속 오래 걸리면 빛 번짐처럼 무거운 효과를 줄인다.
      this.drawMs = this.drawMs * 0.95 + (performance.now() - t1) * 0.05;
      this.renderer.lite = this.drawMs + this.stepMs * n > 22;
    }

    afterStep() {
      let found = false;
      for (const e of this.world.drainEvents()) {
        if (this.codex.has(e.id)) continue;
        this.codex.set(e.id, e);
        this.storage.save('codex', [...this.codex.values()]);
        this.toast(e);
        this.emit('discover', e);
        this.sound.play(e.id === 'shatter_fall' || e.id === 'glass_shock' ? 'crack' : 'chime');
        found = true;
        if (this.tab === 'codex' || this.tab === 'info') this.renderPane();
      }
      // 새 발견이 있을 때와 가끔(온도처럼 상태로 판정하는 과제) 도전 과제를 확인한다.
      if (found || this.world.tick % 120 === 0) this.checkChallenges();
      this.checkPrediction();
    }

    checkChallenges() {
      const w = this.world, d = w.data;
      // 칸 수는 한 번만 세어 둔다(과제마다 격자 전체를 다시 돌지 않도록).
      const hist = new Uint32Array(d.defs.length);
      for (let i = 0; i < w.mat.length; i++) hist[w.mat[i]]++;
      const count = (id) => { const k = d.idOf[id]; return k == null ? 0 : hist[k]; };
      const ctx = {
        has: (id) => this.codex.has(id), ids: () => [...this.codex.keys()], any: (re) => [...this.codex.keys()].some((k) => re.test(k)),
        count, cells: (id, f) => { const k = d.idOf[id]; let n = 0; for (let i = 0; i < w.mat.length; i++) if (w.mat[i] === k && f(w.T[i])) n++; return n; },
      };
      for (const c of SL.CHALLENGES || []) {
        if (this.done.has(c.id) || !c.check(ctx)) continue;
        this.done.add(c.id);
        this.storage.save('challenges', [...this.done]);
        this.toast({ name: c.name, eq: `${this.done.size} / ${SL.CHALLENGES.length}` }, '도전 과제 완료: ');
        this.sound.play('chime2');
        this.emit('challenge', { id: c.id, name: c.name, done: this.done.size, total: SL.CHALLENGES.length });
        if (this.tab === 'codex') this.renderPane();
      }
    }

    toast(e, prefix) {
      const t = this.$('.toast');
      t.innerHTML = `${prefix == null ? '새 발견: ' : prefix}<b>${e.name}</b><small>${e.eq}</small>`;
      t.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
    }

    updateStatus() {
      const el = this.$('.status');
      const c = this.hover;
      const info = c && this.world.inspect(c.x, c.y);
      const html = info
        ? `<b>${info.def.name}</b> ${info.def.formula} · ${fmt(info.T, 1)}°C · ${info.rho >= 10 ? fmt(info.rho, 0) : fmt(info.rho, 2)} kg/m³${Math.abs(info.P - 1) > 0.02 ? ` · <b>${fmt(info.P, 2)}기압</b>` : ''}${info.pH != null && info.def.state === 'liquid' ? ` · <b>pH ${fmt(info.pH, 1)}</b>` : ''}${info.conc != null && info.conc < 0.995 ? ` · 농도 ×${info.conc < 0.1 ? info.conc.toFixed(3) : info.conc.toFixed(2)}` : ''}`
        : this.touch ? '손가락으로 그리면 고른 재료가 떨어집니다. 관찰 도구로 누르면 그 칸의 정보가 나옵니다.' : '실험 공간 위에 커서를 올리면 그 칸의 물질과 온도가 보입니다. 관찰 도구로 누르면 정보 탭에 자세히 나옵니다.';
      if (html !== this.statusHtml) { el.innerHTML = html; this.statusHtml = html; }
    }

    drawOverlay() {
      const over = this.$('.over'), ctx = over.getContext('2d'), w = this.world;
      const s = over.width / (w.w * w.dx); // m → 픽셀
      const cell = over.width / w.w;
      ctx.clearRect(0, 0, over.width, over.height);
      this.renderer.drawFx(ctx, cell);
      const sh = this.renderer.shake;
      if (sh || this.shaking) { this.applyTransform(sh ? (Math.random() - 0.5) * sh : 0, sh ? (Math.random() - 0.5) * sh : 0); this.shaking = !!sh; }
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
      (w.probes || []).forEach((pr, k) => {
        const x = (pr.x + 0.5) * cell, y = (pr.y + 0.5) * cell, col = w.probes.length > 1 ? PROBE_COLORS[k] : '#fff';
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, Math.max(4, cell), 0, 7); ctx.stroke();
        ctx.font = `${Math.max(12, cell * 3)}px system-ui,sans-serif`; ctx.fillStyle = col;
        const i = w.index(pr.x, pr.y), P = w.pressureAt(i);
        ctx.fillText((w.probes.length > 1 ? (k + 1) + ': ' : '') + fmt(w.T[i], 1) + '°C' + (Math.abs(P - 1) > 0.02 ? ' · ' + fmt(P, 2) + '기압' : ''), x + Math.max(8, cell * 2), y + 4);
      });
      // 열린 밸브 자리는 점선으로 보여 준다.
      for (const v of w.valves || []) {
        ctx.strokeStyle = '#ff8a8a'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
        for (const i of v.cells) ctx.strokeRect((i % w.w) * cell + 0.5, ((i / w.w) | 0) * cell + 0.5, cell - 1, cell - 1);
        ctx.setLineDash([]);
      }
      if (this.labels) this.drawLabels(ctx, cell);
      const p = this.pointer;
      if (p && this.tool.kind === 'ball') {
        const sx = (p.start.x + 0.5) * cell, sy = (p.start.y + 0.5) * cell;
        ctx.strokeStyle = '#5cc8b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(sx, sy, this.ballR * s, 0, 7); ctx.moveTo(sx, sy); ctx.lineTo((p.cur.x + 0.5) * cell, (p.cur.y + 0.5) * cell); ctx.stroke();
      } else if (p && (this.tool.kind === 'vessel' || this.tool.kind === 'box')) {
        const x0 = Math.min(p.start.x, p.cur.x), x1 = Math.max(p.start.x, p.cur.x) + 1, y0 = Math.min(p.start.y, p.cur.y), y1 = Math.max(p.start.y, p.cur.y) + 1;
        ctx.strokeStyle = '#9fd6d8'; ctx.lineWidth = Math.max(2, cell * 2); ctx.beginPath();
        ctx.moveTo(x0 * cell, y0 * cell); ctx.lineTo(x0 * cell, y1 * cell); ctx.lineTo(x1 * cell, y1 * cell); ctx.lineTo(x1 * cell, y0 * cell);
        if (this.tool.kind === 'box') ctx.closePath();
        ctx.stroke();
      } else if (this.hover && BRUSH_TOOLS.includes(this.tool.kind)) {
        ctx.strokeStyle = { heat: '#ff9a5c', cool: '#7cc4ff', stir: '#c9a8ff', erase: '#ff7a7a', gasin: '#ffb347', gasout: '#6ad1ff', push: '#a8b8c8', pull: '#a8b8c8' }[this.tool.kind] || '#ffffff99'; ctx.lineWidth = 1;
        if (this.tool.kind === 'stir') ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.arc((this.hover.x + 0.5) * cell, (this.hover.y + 0.5) * cell, Math.max(this.brush - 0.5, 0.5) * cell, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      }
    }

    // 이름표: 12칸 격자마다 가장 많은 물질을 찾아, 같은 물질이 이웃 칸에 이미 이름표가 있으면 건너뛴다(0.5초마다 다시 계산).
    drawLabels(ctx, cell) {
      const w = this.world, B = 12;
      if (!this.labelCache || w.time - this.labelCache.t > 0.5 || this.labelCache.tick > w.tick) {
        const out = [], nx = Math.ceil(w.w / B), ny = Math.ceil(w.h / B), grid = new Int32Array(nx * ny).fill(-1);
        for (let by = 0; by < ny; by++) for (let bx = 0; bx < nx; bx++) {
          const cnt = new Map();
          for (let y = by * B; y < Math.min(w.h, by * B + B); y += 2) for (let x = bx * B; x < Math.min(w.w, bx * B + B); x += 2) {
            const m = w.mat[w.index(x, y)];
            if (m === w.AIR) continue;
            cnt.set(m, (cnt.get(m) || 0) + 1);
          }
          let best = -1, bn = 0;
          for (const [m, n] of cnt) if (n > bn) { bn = n; best = m; }
          if (best < 0 || bn < 10) continue;
          let near = false;
          for (let dy = -2; dy <= 0 && !near; dy++) for (let dx = -2; dx <= 2; dx++) { const gx = bx + dx, gy = by + dy; if ((dy < 0 || dx < 0) && gx >= 0 && gy >= 0 && gx < nx && grid[gy * nx + gx] === best) { near = true; break; } }
          grid[by * nx + bx] = best;
          if (!near) out.push({ x: (bx + 0.5) * B, y: (by + 0.5) * B, name: w.data.defs[best].name.replace(/\s*\(.*\)$/, '') });
        }
        this.labelCache = { t: w.time, tick: w.tick, out };
      }
      ctx.save();
      ctx.font = `600 ${Math.max(11, Math.min(15, cell * 3))}px system-ui,sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 3; ctx.strokeStyle = '#000c'; ctx.fillStyle = '#fff';
      for (const l of this.labelCache.out) { ctx.strokeText(l.name, l.x * cell, l.y * cell); ctx.fillText(l.name, l.x * cell, l.y * cell); }
      ctx.restore();
    }

    // 그래프 하나, 축 하나. 측정값은 실선, 이론값은 점선으로 구분한다.
    plotData() {
      const w = this.world, m = this.graphMode;
      if (m === 'T' || m === 'P' || m === 'pH') {
        const ps = w.probes || [];
        if (!ps.length) return { empty: '온도계 도구로 측정할 곳을 눌러 주세요(최대 3곳). 압력은 밀폐 용기 안의 기체에서 잽니다.' };
        const t0 = Math.min(...ps.map((p) => (p.log.length ? p.log[0].t : Infinity)));
        const val = (s) => (m === 'P' ? s.P || 1 : m === 'pH' ? (s.pH == null ? null : s.pH) : s.T);
        const p = ps[0], unit = m === 'P' ? '기압' : m === 'pH' ? 'pH' : '°C', label = m === 'P' ? '압력' : m === 'pH' ? 'pH' : '온도';
        const more = ps.slice(1).map((q, k) => ({ xs: q.log.map((s) => s.t - t0), ys: q.log.map(val), color: PROBE_COLORS[k + 1], label: `${label} ${k + 2}` }));
        return { unit, xs: p.log.map((s) => s.t - (isFinite(t0) ? t0 : 0)), ys: p.log.map(val), label: ps.length > 1 ? label + ' 1' : label, more };
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
      const more = d.more || [];
      const xMax = Math.max(1, d.xs[d.xs.length - 1], ...more.map((q) => q.xs[q.xs.length - 1] || 0));
      const theoryPts = d.theory ? d.xs.map((t) => d.theory(t)) : [];
      const all = d.ys.concat(theoryPts, ...more.map((q) => q.ys)).filter((v) => v != null && isFinite(v));
      if (!all.length) { ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.fillText('측정할 액체가 없습니다', W / 2, H / 2); return; }
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
      for (const q of more) {
        ctx.strokeStyle = q.color; ctx.lineWidth = 2; ctx.beginPath();
        let open = false;
        q.ys.forEach((v, i) => { if (v == null) { open = false; return; } if (open) ctx.lineTo(X(q.xs[i]), Y(v)); else { ctx.moveTo(X(q.xs[i]), Y(v)); open = true; } });
        ctx.stroke();
      }
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
      const leg = `<span style="--c:${c1}">${d.label} (${d.unit})</span>` + more.map((q) => `<span style="--c:${q.color}">${q.label}</span>`).join('') + (d.theory ? `<span class="dash" style="--c:${c2}">진공 이론값</span>` : '');
      if (leg !== this.legendHtml) { this.$('.legend').innerHTML = leg; this.legendHtml = leg; }
    }

    async importCode(code) {
      const data = await decodeCode(code);
      this.remember();
      this.world.fromJSON(data);
      this.dirty = true;
      this.toast({ name: '실험을 불러옴', eq: '되돌리기로 이전 상태로 돌아갈 수 있습니다.' }, '');
    }

    // 그래프에 보이는 측정값을 CSV 파일로 내려받는다(엑셀·구글 시트에서 열 수 있음).
    exportCSV() {
      const d = this.plotData();
      if (d.empty || !d.xs.length) { this.toast({ name: '저장할 측정값이 없음', eq: '먼저 측정을 시작해 주세요.' }, ''); return; }
      const series = [{ label: d.label, xs: d.xs, ys: d.ys }].concat(d.more || []);
      if (d.theory) series.push({ label: '이론값', xs: d.xs, ys: d.xs.map((t) => d.theory(t)) });
      const rows = ['시간(초),' + series.map((q) => `${q.label}(${d.unit})`).join(',')];
      const n = Math.max(...series.map((q) => q.xs.length));
      for (let i = 0; i < n; i++) rows.push([series[0].xs[i] != null ? series[0].xs[i].toFixed(3) : (series.find((q) => q.xs[i] != null) || { xs: [] }).xs[i]].concat(series.map((q) => (q.ys[i] == null ? '' : (+q.ys[i]).toFixed(4)))).join(','));
      const blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `sandlab-${this.graphMode}-${Date.now()}.csv`;
      this.shadow.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      this.emit('export', { kind: 'csv', rows: n });
    }

    updateStats(d) {
      const w = this.world, box = this.$('.stats');
      if (!box) return;
      const stat = (n, v) => `<div class="stat"><small>${n}</small>${v}</div>`;
      let html = '';
      if (this.graphMode === 'pH') {
        if (w.probe) {
          const pH = w.pHMeter(w.probe.x, w.probe.y), here = w.inspect(w.probe.x, w.probe.y);
          html = stat('현재 pH', pH == null ? '액체 없음' : fmt(pH, 2)) + stat('성질', pH == null ? '-' : pH < 6.5 ? '산성' : pH > 7.5 ? '염기성' : '중성') +
            stat('그 칸', here.def.name + (here.conc != null && here.conc < 0.995 ? ` ×${fmt(here.conc, 3)}` : '')) + stat('도움말', '둘레 액체의 평균 pH');
        }
      } else if (this.graphMode === 'P') {
        if (w.probe) {
          const i = w.index(w.probe.x, w.probe.y), P = w.pressureAt(i), T = w.T[i];
          // 게이뤼삭 법칙: 부피가 일정하면 P/T(절대 온도)가 일정하다.
          html = stat('현재 압력', fmt(P, 2) + ' 기압') + stat('그 칸의 온도', fmt(T, 1) + ' °C') + stat('P ÷ T(K)', fmt(P / (T + 273.15) * 1000, 3) + ' ×10⁻³') +
            stat('도움말', P === 1 ? '열린 곳은 1기압' : '닫힌 용기 안');
        }
      } else if (this.graphMode === 'T') {
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
   * @param {{scene?:string,width?:number,height?:number,effects?:boolean,sound?:boolean,materials?:string[],storage?:{load:Function,save:Function}}} [options]
   */
  SL.version = '0.21.0'; // 저장 데이터·공개 API가 바뀌면 올린다. 사이트에서 호환성을 확인할 때 쓴다.

  SL.create = function create(el, options) {
    const opts = Object.assign({ width: 240, height: 150 }, options);
    opts.storage = opts.storage || localStorageAdapter('sandlab:');
    const shadow = el.shadowRoot || el.attachShadow({ mode: 'open' });
    const app = new App(el, shadow, opts);
    if (opts.sound) { app.sound.enable(true); app.$('.sndon').checked = true; }
    return {
      world: app.world,
      loadScene: (id) => app.loadScene(id),
      undo: () => app.undo(),
      challenges: () => (SL.CHALLENGES || []).map((c) => ({ id: c.id, name: c.name, hint: c.hint, done: app.done.has(c.id) })),
      pause: () => app.setRunning(false),
      resume: () => app.setRunning(true),
      setView: (v) => app.setView(v),
      setEffects: (on) => app.setEffects(on),
      setSound: (on) => { app.sound.enable(on); const c = app.$('.sndon'); if (c) c.checked = !!on; },
      exportCode: () => encodeWorld(app.world),
      importCode: (code) => app.importCode(code),
      addProbe: (x, y) => app.world.addProbe(x, y),
      save: () => app.world.toJSON(),
      restore: (data) => { app.world.fromJSON(data); app.dirty = true; },
      discoveries: () => [...app.codex.values()],
      scenes: () => SL.SCENES.map((s) => ({ id: s.id, name: s.name, desc: s.desc })),
      destroy: () => app.destroy(),
    };
  };

  if (globalThis.customElements && !customElements.get('sand-lab')) {
    customElements.define('sand-lab', class extends HTMLElement {
      connectedCallback() {
        const mats = this.getAttribute('materials');
        this.lab = SL.create(this, { scene: this.getAttribute('scene') || undefined, effects: this.getAttribute('effects') !== 'off', sound: this.getAttribute('sound') === 'on', materials: mats ? mats.split(',').map((m) => m.trim()).filter(Boolean) : undefined });
      }
      disconnectedCallback() { if (this.lab) this.lab.destroy(); this.lab = null; }
    });
  }
})(globalThis.SandLab = globalThis.SandLab || {});
