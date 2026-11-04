// 시뮬레이션 엔진. DOM을 전혀 쓰지 않으므로 어떤 화면에도 붙일 수 있고 단독 테스트가 가능하다.
// 한 칸 = 1cm, 한 틱 = 1/60초. 강체 공은 미터 단위(SI)로 계산한다.
(function (SL) {
  'use strict';

  const SOLID = 0, POWDER = 1, LIQUID = 2, GAS = 3;
  const STATES = { solid: SOLID, powder: POWDER, liquid: LIQUID, gas: GAS };
  const EARTH_G = 9.81;
  const MAX_FALL = 8; // 칸/틱. 터널링 방지용 상한

  // 핵분열 모형(개념 학습용 단순화). 실제 핵물리 값이 아니라 임계 질량·감속재·제어봉의 관계를 보여 주는 값이다.
  // - 핵분열 한 번에 중성자 2~3개가 무작위 방향으로 직진한다(최대 NEUTRON_RANGE칸).
  // - 감속재(물, 흑연, 파라핀)를 지나면 느린 중성자가 되어 핵분열 확률이 커지고, 감속재 안에서는 산란되어 방향이 바뀐다(반사체).
  // - 흡수재(카드뮴, 붕소, 제어봉)는 중성자를 잡아 연쇄 반응을 멈춘다.
  // - 빠른 중성자로만 이어지는 연쇄 반응이 순식간에 커지면 폭발하고, 감속재로 이어지는 연쇄(원자로)는 녹아내릴 뿐 핵폭발하지 않는다.
  const NEUTRON_RANGE = 20;
  const FISSION_HEAT = 500; // 핵분열 한 번에 오르는 칸의 온도(°C)
  const FISSION_BURNUP = 0.03; // 핵분열 후 그 칸이 핵분열 생성물이 될 확률
  const NUKE_T = 3000; // 빠른 연쇄 반응에서 이 온도를 넘으면 폭발
  const MAX_FISSIONS = 3000; // 틱당 처리할 최대 핵분열 수

  // 압력(이상 기체 PV = nRT). 한 칸의 기체량 n은 보통 1이고, 액체·고체가 끓거나 반응해 기체가 되면 훨씬 많다
  // (실제로 물 1cm³가 수증기가 되면 약 1700배로 늘어나지만, 칸이 고정되어 있으므로 갇힌 공간의 압력으로 나타낸다).
  const GAS_FROM_CONDENSED = 6;
  const SIGMA = 5.67e-8, EMISSIVITY = 0.8; // 슈테판-볼츠만 상수, 복사율

  // 물질 표를 엔진이 빠르게 읽을 수 있는 배열로 바꾼다.
  const compiled = new Map(); // 같은 표를 쓰는 세계는 컴파일 결과와 반응 캐시를 공유한다.

  function compile(materials, reactions, aliases) {
    if (compiled.has(materials)) return compiled.get(materials);
    const n = materials.length;
    const idOf = Object.assign({}, aliases);
    for (const k in idOf) idOf[k] = -1;
    materials.forEach((d, i) => { idOf[d.id] = i; });
    for (const k in aliases) if (idOf[k] === -1) idOf[k] = idOf[aliases[k]];
    const need = (id) => {
      if (idOf[id] == null) throw new Error('알 수 없는 물질: ' + id);
      return idOf[id];
    };
    const resolve = (to) => (Array.isArray(to) ? to.map(([id, p]) => [need(id), p]) : need(to));
    const compileEdge = (e) => e && { at: e.at, L: e.L, to: resolve(e.to), silent: !!e.silent, cast: !!e.cast, boil: false };
    const c = {
      n, idOf, defs: materials, resolve,
      state: new Uint8Array(n), rho: new Float32Array(n), cp: new Float32Array(n),
      heatCap: new Float32Array(n), k: new Float32Array(n), flow: new Uint8Array(n),
      fixed: new Uint8Array(n), lifetime: new Uint16Array(n), t0: new Float32Array(n), rise: new Float32Array(n), misc: new Uint8Array(n),
      up: [], down: [], decay: [], explicit: new Map(), cache: new Map(), reactive: new Uint8Array(n), base: new Uint16Array(n),
      fast: new Float32Array(n), thermal: new Float32Array(n), spont: new Float32Array(n), emitter: new Uint8Array(n),
      moder: new Uint8Array(n), absorb: new Float32Array(n), heat: new Float32Array(n), armor: new Uint8Array(n),
      electrode: new Uint8Array(n), conductor: new Uint8Array(n), shatter: new Int16Array(n).fill(-1), grain: new Uint8Array(n), load: new Uint8Array(n), strength: new Float32Array(n), pump: new Uint8Array(n), elyte: new Int8Array(n).fill(-1), anyElectrode: false,
    };
    materials.forEach((d, i) => {
      c.state[i] = STATES[d.state];
      c.rho[i] = d.density; c.cp[i] = d.c; c.heatCap[i] = d.density * d.c; c.k[i] = d.k;
      c.flow[i] = d.flow || 0; c.fixed[i] = d.fixed ? 1 : 0; c.lifetime[i] = d.lifetime || 0; c.t0[i] = d.T0;
      c.rise[i] = d.rise == null ? 1 : d.rise; c.misc[i] = d.misc ? 1 : 0;
      c.up[i] = compileEdge(d.up); c.down[i] = compileEdge(d.down);
      c.decay[i] = d.decay ? resolve(d.decay) : null;
      c.reactive[i] = d.inert ? 0 : 1;
      c.base[i] = d.aliasOf ? need(d.aliasOf) : i; // 색만 다른 불꽃은 불꽃과 같은 반응을 한다.
      if (d.fissile) { c.fast[i] = d.fissile.fast; c.thermal[i] = d.fissile.thermal; }
      c.spont[i] = d.spont || 0; c.emitter[i] = d.spont && !d.fissile ? 1 : 0;
      c.moder[i] = d.moderator ? 1 : 0;
      c.absorb[i] = d.absorb != null ? d.absorb : d.state === 'gas' ? 0 : 0.01;
      c.heat[i] = d.decayHeat || 0; // 방사성 붕괴열 W/kg
      c.armor[i] = d.fixed || d.armor ? 1 : 0; // 폭발에도 부서지지 않는 벽
      c.electrode[i] = d.electrode || 0;
      if (d.shatter) c.shatter[i] = need(d.shatter); // 폭발에 부서지면 되는 물질
      // 칸마다 밝기를 조금씩 달리하는 정도(질감): 액체는 매끈하게, 금속은 고르게, 가루와 바위는 거칠게.
      c.grain[i] = d.grain != null ? d.grain : d.state === 'liquid' ? 5 : d.state === 'gas' ? 7 : d.metal ? 7 : d.state === 'solid' ? 16 : 13;
      if (d.electrode) c.anyElectrode = true;
      c.pump[i] = d.pump ? 1 : 0;
      c.conductor[i] = d.electrode || d.wire || (d.metal && d.state !== 'gas') ? 1 : 0; // 전기가 통하는 고체·액체 금속, 도선
      c.load[i] = d.load ? 1 : 0; // 전구처럼 전류가 지나가며 일을 하는 것
      // 갇힌 기체의 압력을 견디는 정도(기압). 액체는 밀려날 뿐 터지지 않으므로 경계로 치지 않는다.
      c.strength[i] = d.strength != null ? d.strength : d.fixed || d.armor ? 1e9 : d.state === 'liquid' ? 1e9 : d.state === 'powder' ? (d.metal ? 30 : 3) : d.metal ? 40 : 12;
    });
    // 끓음·응결 경계(액체 → 기체, 기체 → 액체)는 압력에 따라 온도가 바뀐다.
    const isGasTarget = (to) => (Array.isArray(to) ? to.some(([k]) => c.state[k] === GAS) : c.state[to] === GAS);
    for (let i = 0; i < n; i++) {
      if (c.up[i] && c.state[i] === LIQUID && isGasTarget(c.up[i].to)) c.up[i].boil = true;
      if (c.down[i] && c.state[i] === GAS) c.down[i].boil = true;
    }
    const add = (a, b, entry) => {
      const key = a * n + b;
      if (!c.explicit.has(key)) c.explicit.set(key, []);
      c.explicit.get(key).push(entry);
    };
    reactions.forEach((r) => {
      const a = need(r.a), b = need(r.b);
      const toA = r.toA == null ? null : resolve(r.toA);
      const toB = r.toB == null ? null : resolve(r.toB);
      const near = r.near ? r.near.map(need) : null;
      const far = r.farFrom ? r.farFrom.map(need) : null;
      add(a, b, { r, toSelf: toA, toOther: toB, near, far });
      add(b, a, { r, toSelf: toB, toOther: toA, near, far });
    });
    compiled.set(materials, c);
    return c;
  }

  // 두 물질이 처음 만날 때 표와 일반 규칙에서 반응을 찾아 저장한다. 물질이 많아 미리 전부 만들지 않는다.
  function reactionsBetween(c, a, b) {
    const key = a * c.n + b;
    let list = c.cache.get(key);
    if (list !== undefined) return list;
    list = (c.explicit.get(c.base[a] * c.n + c.base[b]) || []).slice();
    if (SL.CHEM) {
      const res = (to) => (to == null ? null : c.resolve(to));
      for (const r of SL.CHEM.rulesFor(c.defs[a], c.defs[b])) list.push({ r, toSelf: res(r.toA), toOther: res(r.toB), near: null });
      for (const r of SL.CHEM.rulesFor(c.defs[b], c.defs[a])) list.push({ r, toSelf: res(r.toB), toOther: res(r.toA), near: null });
    }
    if (!list.length) list = null;
    c.cache.set(key, list);
    return list;
  }

  function pick(to) {
    if (!Array.isArray(to)) return to;
    let x = Math.random();
    for (const [id, p] of to) { if ((x -= p) <= 0) return id; }
    return to[to.length - 1][0];
  }

  class World {
    constructor(opts) {
      const o = opts || {};
      this.w = o.width || 240;
      this.h = o.height || 150;
      this.dx = 0.01;
      this.dt = 1 / 60;
      this.data = compile(o.materials || SL.MATERIALS, o.reactions || SL.REACTIONS, SL.MATERIAL_ALIAS || {});
      this.AIR = this.data.idOf.air;
      const size = this.w * this.h;
      this.mat = new Uint16Array(size);
      this.anchor = new Uint8Array(size); // 고정된 덩어리 칸. 가루처럼 흘러내리지 않는다.
      this.T = new Float32Array(size);
      this.store = new Float32Array(size); // 상변화 중 축적된 잠열 J/kg (+가열, -냉각)
      this.gas = new Float32Array(size); // 기체 칸의 기체량(보통 1)
      this.vy = new Float32Array(size);
      this.life = new Uint16Array(size);
      this.shade = new Int8Array(size);
      this.stamp = new Uint32Array(size);
      this.g = EARTH_G;
      this.heatBoost = 200;
      this.vacuum = false;
      this.ambient = 20;
      this.openTop = true;
      this.discovered = new Set();
      this.events = [];
      this.fq = []; // 다음 틱에 일어날 핵분열(칸 번호*2 + 느린 중성자 여부)
      this.prompt = false; // 이번 세대가 빠른 중성자 연쇄인지
      this.boomBudget = 40;
      this.slowAvg = 0;
      this.flyers = []; // 튀어 날아가는 칸(폭발 파편, 물보라). 떨어지면 다시 칸이 된다.
      this.fx = []; // 화면 효과 요청(섬광, 불티). 물리에는 영향이 없다.
      this.reset();
    }

    reset() {
      this.tick = 0; this.time = 0; this.fq = []; this.slowAvg = 0; this.pRegions = null; this.flyers = []; this.fx = [];
      this.bodies = []; this.selected = null; this.probe = null; this.nextBodyId = 1;
      for (let i = 0; i < this.mat.length; i++) { this.setCell(i, this.AIR, this.ambient); this.gas[i] = 1; }
    }

    setHeatBoost(v) { this.heatBoost = v; }

    // 두 칸 사이의 열 전달 계수. 안정성을 위해 칸 열용량의 20%로 제한한다(에너지는 항상 보존).
    // 기체는 가속을 제한한다. 그러지 않으면 공기가 비현실적인 도체가 되어 방 전체가 달아오른다.
    conductance(a, b, scale, gasScale) {
      const d = this.data, ka = d.k[a], kb = d.k[b];
      const keff = 2 * ka * kb / (ka + kb);
      const g = keff * (d.state[a] === GAS || d.state[b] === GAS ? gasScale : scale);
      const ca = d.heatCap[a], cb = d.heatCap[b];
      const limit = 0.2 * (ca < cb ? ca : cb);
      return g < limit ? g : limit;
    }

    index(x, y) { return y * this.w + x; }
    inside(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }

    setCell(i, m, T) {
      const st = this.data.state;
      this.gas[i] = st[m] === GAS ? (st[this.mat[i]] === GAS ? 1 : GAS_FROM_CONDENSED) : 0;
      this.mat[i] = m;
      this.T[i] = T;
      this.store[i] = 0;
      this.vy[i] = 0;
      this.anchor[i] = 0;
      const lt = this.data.lifetime[m];
      this.life[i] = lt ? lt * (0.6 + 0.8 * Math.random()) : 0;
      const g = this.data.grain[m];
      this.shade[i] = ((Math.random() * 2 - 1) * g) | 0;
    }

    swap(i, j) {
      const { mat, T, store, vy, life, shade, anchor } = this;
      let t;
      t = mat[i]; mat[i] = mat[j]; mat[j] = t;
      t = anchor[i]; anchor[i] = anchor[j]; anchor[j] = t;
      t = T[i]; T[i] = T[j]; T[j] = t;
      t = store[i]; store[i] = store[j]; store[j] = t;
      t = vy[i]; vy[i] = vy[j]; vy[j] = t;
      t = life[i]; life[i] = life[j]; life[j] = t;
      t = shade[i]; shade[i] = shade[j]; shade[j] = t;
      t = this.gas[i]; this.gas[i] = this.gas[j]; this.gas[j] = t;
      this.stamp[i] = this.stamp[j] = this.tick;
    }

    effRho(i) {
      const m = this.mat[i], s = this.data.state[m], r = this.data.rho[m];
      if (s === GAS) return r * (this.gas[i] || 1) * 293 / (Math.max(this.T[i], -200) + 273); // 이상 기체: 압축된 기체는 더 무겁다
      if (s === LIQUID) return r * (1 - 2e-4 * (this.T[i] - 20)); // 열팽창
      return r;
    }

    // ---- 그리기 도구 ----
    paint(cx, cy, r, m, onlyEmpty, anchored) {
      const s = this.data.state[m];
      const density = s === SOLID || anchored ? 1 : s === GAS ? 0.5 : 0.7;
      this.forDisc(cx, cy, r, (i) => {
        if (m !== this.AIR && Math.random() > density) return;
        if (onlyEmpty && this.mat[i] !== this.AIR) return;
        this.setCell(i, m, m === this.AIR ? this.ambient : this.data.t0[m]);
        if (s === GAS) this.gas[i] = 1; // 사람이 놓은 기체는 1기압
        if (anchored && s === POWDER) this.anchor[i] = 1;
      });
    }
    addHeat(cx, cy, r, dT) {
      this.forDisc(cx, cy, r, (i) => { if (!this.data.fixed[this.mat[i]]) this.T[i] = Math.max(-273.15, Math.min(6000, this.T[i] + dT)); });
    }
    forDisc(cx, cy, r, fn) {
      for (let y = Math.max(0, cy - r); y <= Math.min(this.h - 1, cy + r); y++) {
        for (let x = Math.max(0, cx - r); x <= Math.min(this.w - 1, cx + r); x++) {
          if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) fn(this.index(x, y));
        }
      }
    }
    rect(id, x0, y0, x1, y1, T, anchored) {
      const m = this.data.idOf[id];
      if (m == null) throw new Error('알 수 없는 물질: ' + id);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (!this.inside(x, y)) continue;
        const i = this.index(x, y);
        this.setCell(i, m, T == null ? this.data.t0[m] : T);
        if (this.data.state[m] === GAS) this.gas[i] = 1;
        if (anchored) this.anchor[i] = 1;
      }
    }

    // ---- 한 틱 ----
    step() {
      this.tick++;
      this.time += this.dt;
      this.boomBudget = 40;
      this.stepMotion();
      this.stepFlyers();
      this.stepHeat();
      this.stepNuclear();
      this.stepElectro();
      if (this.tick % 20 === 0) this.stepPressure();
      this.stepCells();
      this.stepBodies();
      this.record();
    }

    stepMotion() {
      const { w, h } = this;
      const flip = this.tick & 1;
      for (let y = h - 1; y >= 0; y--) {
        for (let k = 0; k < w; k++) {
          const x = flip ? k : w - 1 - k;
          const i = y * w + x;
          if (this.stamp[i] === this.tick) continue;
          const s = this.data.state[this.mat[i]];
          if (s === SOLID) continue;
          if (s === GAS) this.moveGas(i, x, y);
          else this.moveDense(i, x, y, s);
        }
      }
      if (this.openTop) {
        for (let x = 0; x < w; x++) {
          const m = this.mat[x];
          if (this.data.state[m] === GAS && Math.random() < 0.2) this.setCell(x, this.AIR, this.ambient);
        }
      }
    }

    // i 칸의 물질이 바로 아래 j 칸으로 가라앉을 수 있는지 판단한다. 부력은 여기서 나온다.
    sinkChance(i, j) {
      const d = this.data, mi = this.mat[i], mj = this.mat[j];
      const si = d.state[mi], sj = d.state[mj];
      const gs = Math.min(2, this.g / EARTH_G);
      if (sj === SOLID || this.anchor[j]) return 0;
      if (sj === POWDER) return si === LIQUID && d.rho[mi] > d.rho[mj] ? 0.3 * gs : 0;
      if (mi === mj) {
        const hotter = this.T[j] - this.T[i]; // 아래쪽이 뜨거우면 위로 뜨는 대류
        return hotter > 2 ? Math.min(0.5, hotter * 0.01) * gs : 0;
      }
      const ri = this.effRho(i), rj = this.effRho(j);
      if (ri <= rj) return 0;
      if (sj === GAS) {
        if (si !== GAS) return 1;
        // 무거운 기체 덩어리(위 칸도 같은 기체)는 한꺼번에 흘러내리지만, 이미 섞인 기체는 확산이 분리를 상쇄해 아주 천천히 갈라진다.
        const bulk = i >= this.w && this.mat[i - this.w] === mi ? 1.2 : 0.25;
        return Math.min(1, bulk * (ri - rj) / (ri + rj)) * gs * d.rise[mj];
      }
      return (si === POWDER ? 0.5 : 0.3) * gs;
    }

    moveDense(i, x, y, s) {
      if (this.anchor[i]) return;
      const { w, h } = this;
      // 서로 섞이는 액체는 맞닿은 면에서 천천히 섞인다.
      if (s === LIQUID && this.data.misc[this.mat[i]] && Math.random() < 0.03) {
        const r = Math.random();
        const j = r < 0.4 ? (x > 0 ? i - 1 : -1) : r < 0.8 ? (x < w - 1 ? i + 1 : -1) : r < 0.9 ? (y > 0 ? i - w : -1) : (y < h - 1 ? i + w : -1);
        if (j >= 0 && this.mat[j] !== this.mat[i] && this.data.misc[this.mat[j]]) { this.swap(i, j); return; }
      }
      const gCells = this.g * this.dt * this.dt / this.dx;
      let v = Math.min(MAX_FALL, this.vy[i] + gCells);
      let steps = Math.floor(v);
      if (Math.random() < v - steps) steps++;
      let cy = y, cur = i, blocked = false;
      for (let n = 0; n < steps; n++) {
        if (cy + 1 >= h) { blocked = true; break; }
        const below = cur + w;
        const chance = this.sinkChance(cur, below);
        if (chance <= 0) { blocked = true; break; }
        if (chance < 1 && Math.random() > chance) break;
        this.swap(cur, below);
        if (this.data.state[this.mat[cur]] === LIQUID) {
          // 빠르게 떨어진 물체가 액체에 들어가면 물보라가 튄다.
          if (v >= 3 && cur >= w && this.data.state[this.mat[cur - w]] === GAS && Math.random() < 0.5) this.launch(cur, (Math.random() - 0.5) * v * 0.8, -v * (0.35 + Math.random() * 0.25));
          v = Math.min(v, 1.5); // 액체 속에서는 끌림
        }
        cur = below; cy++;
      }
      // 높은 곳에서 떨어진 액체는 바닥에 부딪혀 튄다.
      if (blocked && s === LIQUID && v >= 3.5 && Math.random() < 0.3) {
        this.launch(cur, (Math.random() < 0.5 ? -1 : 1) * v * (0.2 + Math.random() * 0.3), -v * (0.2 + Math.random() * 0.2));
        return;
      }
      this.vy[cur] = blocked ? 0 : v;
      if (cy !== y || !blocked || this.g <= 0) return;

      if (s === POWDER) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        for (const d of [dir, -dir]) {
          const nx = x + d;
          if (nx < 0 || nx >= w || y + 1 >= h) continue;
          const diag = i + w + d;
          if (this.sinkChance(i, i + d) > 0 && this.data.state[this.mat[i + d]] !== POWDER && this.sinkChance(i, diag) > 0) {
            this.swap(i, diag);
            return;
          }
        }
        return;
      }
      this.spread(i, x, y);
    }

    spread(i, x, y) {
      const { w, h } = this;
      const d = this.data, dir = Math.random() < 0.5 ? 1 : -1;
      const reach = d.flow[this.mat[i]] || 2;
      for (const sign of [dir, -dir]) {
        let px = x, pi = i, drop = -1;
        const path = [];
        for (let n = 1; n <= reach; n++) {
          const nx = x + sign * n;
          if (nx < 0 || nx >= w) break;
          const ni = y * w + nx;
          const ms = d.state[this.mat[ni]];
          if (this.mat[ni] === this.mat[i] || ms === SOLID || ms === POWDER || this.effRho(i) <= this.effRho(ni)) break;
          path.push(ni); px = nx; pi = ni;
          if (y + 1 < h && this.sinkChance(i, ni + w) > 0) { drop = n; break; }
        }
        if (!path.length) continue;
        // 평평한 수면에서 떨지 않도록, 떨어질 곳이 없으면 가끔만 움직인다.
        if (drop < 0 && Math.random() > 0.25) return;
        let cur = i;
        for (const ni of path) { this.swap(cur, ni); cur = ni; }
        return;
      }
    }

    moveGas(i, x, y) {
      const { w, h } = this;
      if (y + 1 < h) {
        const below = i + w;
        const chance = this.sinkChance(i, below);
        if (chance > 0 && Math.random() < chance) { this.swap(i, below); return; }
      }
      if (this.mat[i] === this.AIR) return;
      // 공기가 아닌 기체는 무작위로 확산한다.
      if (Math.random() < 0.4) {
        const r = Math.random();
        const j = r < 0.25 ? (x > 0 ? i - 1 : -1) : r < 0.5 ? (x < w - 1 ? i + 1 : -1) : r < 0.75 ? (y > 0 ? i - w : -1) : (y < h - 1 ? i + w : -1);
        if (j >= 0 && this.data.state[this.mat[j]] === GAS && this.mat[j] !== this.mat[i]) this.swap(i, j);
      }
    }

    // ---- 튀는 칸 ----
    // 칸을 격자에서 떼어 포물선 운동을 시킨다(단위: 칸/틱). 닿을 곳이 막히면 마지막 빈 칸에 내려앉는다.
    launch(i, vx, vy) {
      const m = this.mat[i], s = this.data.state[m];
      if (s === GAS || s === SOLID || this.anchor[i] || this.flyers.length >= 2500) return false;
      const w = this.w;
      this.flyers.push({ x: i % w + 0.5, y: ((i / w) | 0) + 0.5, vx, vy, m, T: this.T[i], store: this.store[i], shade: this.shade[i] });
      // 빈자리는 바로 위의 기체로 채운다(이산화탄소 덮개 속에 공기가 새로 생기지 않도록).
      const up = i >= w && this.data.state[this.mat[i - w]] === GAS ? i - w : -1;
      this.setCell(i, up >= 0 ? this.mat[up] : this.AIR, up >= 0 ? this.T[up] : this.ambient);
      this.gas[i] = 1;
      return true;
    }
    stepFlyers() {
      if (!this.flyers.length) return;
      const { w, h, mat } = this, st = this.data.state, gC = this.g * this.dt * this.dt / this.dx;
      const keep = [];
      for (const f of this.flyers) {
        f.vy += gC; f.vx *= 0.99; f.vy *= 0.99; // 공기 저항
        const n = Math.max(1, Math.ceil(Math.max(Math.abs(f.vx), Math.abs(f.vy))));
        let last = -1, landed = false;
        for (let k = 0; k < n; k++) {
          let nx = f.x + f.vx / n, ny = f.y + f.vy / n;
          if (ny < 0) { ny = 0; f.vy = 0; }
          if (nx < 0 || nx >= w) { f.vx = -f.vx * 0.3; nx = f.x; }
          const ix = nx | 0, iy = ny | 0;
          if (iy >= h) { landed = true; break; }
          const j = iy * w + ix;
          if (st[mat[j]] !== GAS || this.anchor[j]) { landed = true; break; }
          f.x = nx; f.y = ny; last = j;
        }
        if (!landed) { keep.push(f); continue; }
        const at = last >= 0 ? last : (f.y | 0) * w + (f.x | 0);
        if (st[mat[at]] !== GAS) { f.vx = 0; f.vy = 0; f.y -= 1; if (f.y >= 0) keep.push(f); continue; } // 자리가 찼으면 한 칸 위에서 다시
        this.setCell(at, f.m, f.T);
        this.store[at] = f.store; this.shade[at] = f.shade; this.vy[at] = Math.max(0, Math.min(2, f.vy));
        this.stamp[at] = this.tick;
      }
      this.flyers = keep;
    }
    // 날고 있는 칸을 모두 바로 내려놓는다(저장·되돌리기 전에).
    settleFlyers() {
      const { w, h, mat } = this, st = this.data.state;
      for (const f of this.flyers) {
        let x = Math.min(w - 1, Math.max(0, f.x | 0)), y = Math.min(h - 1, Math.max(0, f.y | 0));
        while (y > 0 && st[mat[y * w + x]] !== GAS) y--;
        const i = y * w + x;
        if (st[mat[i]] === GAS) { this.setCell(i, f.m, f.T); this.shade[i] = f.shade; }
      }
      this.flyers = [];
    }

    // ---- 섞기 도구 ----
    // 원 안의 움직일 수 있는 칸(가루·액체·기체)을 무작위로 바꿔 섞는다. 고정된 칸과 고체는 그대로.
    stir(cx, cy, r, amount) {
      const cells = [];
      const st = this.data.state;
      this.forDisc(cx, cy, r, (i) => { if (st[this.mat[i]] !== SOLID && !this.anchor[i] && !this.data.armor[this.mat[i]]) cells.push(i); });
      const n = Math.round(cells.length * (amount == null ? 0.35 : amount));
      for (let k = 0; k < n; k++) {
        const a = cells[(Math.random() * cells.length) | 0], b = cells[(Math.random() * cells.length) | 0];
        if (a !== b && this.mat[a] !== this.mat[b]) this.swap(a, b);
      }
      return cells.length;
    }

    stepHeat() {
      const { w, h, mat, T } = this;
      const cap = this.data.heatCap;
      const scale = this.dt * this.heatBoost / (this.dx * this.dx);
      const gasScale = scale * Math.min(1, 50 / this.heatBoost);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x, a = mat[i];
          if (x + 1 < w) {
            const b = mat[i + 1], dT = T[i + 1] - T[i];
            if (dT > 0.01 || dT < -0.01) {
              const q = this.conductance(a, b, scale, gasScale) * dT;
              T[i] += q / cap[a]; T[i + 1] -= q / cap[b];
            }
          }
          if (y + 1 < h) {
            const j = i + w, b = mat[j], dT = T[j] - T[i];
            if (dT > 0.01 || dT < -0.01) {
              const q = this.conductance(a, b, scale, gasScale) * dT;
              T[i] += q / cap[a]; T[j] -= q / cap[b];
            }
          }
        }
      }
    }

    // 상변화, 수명, 화학 반응을 칸 단위로 처리한다.
    stepCells() {
      const { w, h, mat, T } = this;
      const d = this.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          const m = mat[i];
          if (d.fixed[m]) { T[i] = d.t0[m]; continue; }
          if (m === this.AIR) { T[i] += (this.ambient - T[i]) * 0.002; continue; } // 외부로의 열 손실
          // 방사성 붕괴열. 열이 주로 공기로 빠져나가므로, 공기 쪽 열전도 가속 배율(최대 50)과 같은 배율을 써야 실제와 비슷한 평형 온도가 된다.
          if (d.heat[m]) T[i] += d.heat[m] * this.dt * Math.min(this.heatBoost, 50) / d.cp[m];
          // 열복사(슈테판-볼츠만): 아주 뜨거운 물체는 공기와 닿은 면으로 T⁴에 비례하는 열을 빛으로 내보낸다. 1cm 칸 한 면은 1cm².
          if (T[i] > 500 && d.state[m] !== GAS) {
            let f = 0;
            if (x > 0 && d.state[mat[i - 1]] === GAS) f++;
            if (x < w - 1 && d.state[mat[i + 1]] === GAS) f++;
            if (y > 0 && d.state[mat[i - w]] === GAS) f++;
            if (y < h - 1 && d.state[mat[i + w]] === GAS) f++;
            if (f) {
              const k = T[i] + 273.15, a = this.ambient + 273.15;
              T[i] -= EMISSIVITY * SIGMA * (k * k * k * k - a * a * a * a) * f * 1e-4 * this.dt / (d.heatCap[m] * 1e-6);
            }
          }
          if (d.spont[m] && Math.random() < d.spont[m]) { // 자발 핵분열·중성자원
            if (d.emitter[m]) this.emitNeutrons(i, 2, false); else this.fq.push(i * 2);
          }
          if (d.up[m] || d.down[m]) this.phase(i, m);
          if (d.lifetime[mat[i]] && mat[i] === m) {
            if (this.life[i] <= 1) {
              const to = d.decay[m] ? pick(d.decay[m]) : this.AIR;
              this.setCell(i, to, to === this.AIR ? Math.min(T[i], 200) : T[i]);
              continue;
            }
            this.life[i]--;
          }
          const cur = mat[i];
          if (!d.reactive[cur]) continue;
          const r = Math.random();
          const j = r < 0.25 ? (x > 0 ? i - 1 : -1) : r < 0.5 ? (x < w - 1 ? i + 1 : -1) : r < 0.75 ? (y > 0 ? i - w : -1) : (y < h - 1 ? i + w : -1);
          if (j < 0 || mat[j] === cur) continue;
          const list = reactionsBetween(d, cur, mat[j]);
          if (list) this.react(i, j, list);
        }
      }
    }

    // 끓는점은 압력에 따라 바뀐다(클라우지우스-클라페이론 식과 트루턴 규칙 ΔH ≈ 88 J/mol·K × Tb):
    // 1/T = 1/Tb − R·ln(P)/ΔH  →  T = Tb / (1 − 0.0945·ln P). 2기압이면 물은 약 126°C, 0.03기압이면 약 20°C에서 끓는다.
    boilAt(at, i) {
      const b0 = this.boilP(at, this.regionP(i));
      // 깊은 곳은 물기둥 무게(수압)만큼 압력이 높아 끓는점이 조금 높다. 끓을 만큼 뜨거울 때만 계산한다.
      if (this.T[i] < b0 || this.data.state[this.mat[i]] !== LIQUID) return b0;
      return this.boilP(at, this.regionP(i) + this.hydroP(i));
    }
    boilP(at, P) {
      if (P === 1) return at;
      const f = 1 - 0.0945 * Math.log(Math.max(0.005, Math.min(100, P)));
      return (at + 273.15) / Math.max(0.2, f) - 273.15;
    }
    // 이 칸 위에 쌓인 액체·가루의 무게에 의한 압력(기압). P = ρgh
    hydroP(i) {
      const { w, mat } = this, st = this.data.state;
      let sum = 0;
      for (let j = i - w; j >= 0; j -= w) {
        const s = st[mat[j]];
        if (s === GAS || s === SOLID) break;
        sum += this.effRho(j);
      }
      return sum * this.dx * this.g / 101325;
    }
    phase(i, m) {
      const d = this.data, T = this.T, c = d.cp[m], up = d.up[m], down = d.down[m];
      const upAt = up && up.boil && this.pRegions ? this.boilAt(up.at, i) : up && up.at;
      const downAt = down && down.boil && this.pRegions ? this.boilAt(down.at, i) : down && down.at;
      if (up && T[i] > upAt) {
        this.store[i] += (T[i] - upAt) * c;
        T[i] = upAt;
        if (this.store[i] >= up.L) this.transform(i, m, up, upAt);
      } else if (down && T[i] < downAt) {
        this.store[i] -= (downAt - T[i]) * c;
        T[i] = downAt;
        if (-this.store[i] >= down.L) this.transform(i, m, down, downAt);
      } else if (this.store[i] > 0 && up && T[i] < upAt) {
        const give = Math.min(this.store[i], (upAt - T[i]) * c); // 다시 식으면 잠열을 돌려준다.
        this.store[i] -= give; T[i] += give / c;
      } else if (this.store[i] < 0 && down && T[i] > downAt) {
        const give = Math.min(-this.store[i], (T[i] - downAt) * c);
        this.store[i] += give; T[i] -= give / c;
      }
    }

    transform(i, m, edge, at) {
      const T = at != null ? at : edge.at, id = pick(edge.to);
      this.setCell(i, id, T);
      if (edge.cast) this.anchor[i] = 1; // 쇳물이나 용암은 굳은 자리에 그대로 남는다.
      if (edge.silent) return;
      this.note('phase:' + m + ':' + id, () => ({
        type: 'phase', id: 'phase:' + this.data.defs[m].id + ':' + this.data.defs[id].id,
        name: this.data.defs[m].name + ' → ' + this.data.defs[id].name,
        eq: Math.round(T * 10) / 10 + '°C에서 상태 변화', kind: 'physical', note: '상변화가 끝날 때까지 온도가 일정하게 유지됩니다. 끓는점은 압력이 높으면 올라가고 낮으면 내려갑니다.',
      }));
    }

    react(i, j, list) {
      const T = this.T, hi = Math.max(T[i], T[j]);
      for (const e of list) {
        const r = e.r;
        if (r.minT != null && hi < r.minT) continue;
        if (r.maxT != null && hi > r.maxT) continue; // 낮은 온도에서만 일어나는 반응(수화, 부동태)
        if (r.minP != null && Math.max(this.regionP(i), this.regionP(j)) < r.minP) continue; // 높은 압력이 필요한 반응
        if (Math.random() > r.prob) continue;
        if (e.near && !this.hasNear(i, e.near) && !this.hasNear(j, e.near)) continue;
        if (e.far && (this.hasNear(i, e.far) || this.hasNear(j, e.far))) continue; // 이 물질이 옆에 있으면 일어나지 않음
        const dT = r.dT || 0;
        const apply = (cell, to) => {
          let t = T[cell] + dT;
          if (r.T != null) t = Math.max(t, r.T);
          if (to == null) { if (!this.data.fixed[this.mat[cell]]) T[cell] = t; return; }
          const next = pick(to);
          if (next === this.mat[cell]) { T[cell] = t; return; } // 그대로 남는 칸은 고정 상태·잠열을 지킨다.
          this.setCell(cell, next, t);
        };
        apply(i, e.toSelf);
        apply(j, e.toOther);
        if (r.explode && (r.explodeP == null || Math.random() < r.explodeP)) this.explode(j, r.explode, r.T != null ? Math.max(r.T, 1500) : 1500);
        else if ((dT >= 250 || (r.T != null && r.T >= 900)) && this.fx.length < 200 && Math.random() < 0.2) this.fx.push({ type: 'spark', x: j % this.w, y: (j / this.w) | 0, hot: Math.max(r.T || 0, T[j]) });
        if (!r.silent) this.note(r.id, () => ({ type: 'reaction', id: r.id, name: r.name, eq: SL.CHEM ? SL.CHEM.equation(r) : r.eq, kind: r.kind || 'chemical', note: r.note }));
        return;
      }
    }

    // ---- 폭발 ----
    // 중심 근처의 기체는 불꽃이 되고, 주변은 뜨거워지며, 가루·액체·기체는 바깥으로 밀려난다. 반지름 4 이상이면 고체도 부서진다.
    explode(ci, r, T, fallout) {
      if (this.boomBudget <= 0) return;
      this.boomBudget -= r >= 4 ? 8 : 1;
      const { w, h, mat } = this, d = this.data, Tm = this.T;
      const cx = ci % w, cy = (ci / w) | 0, R = Math.ceil(r);
      const fire = fallout && d.idOf.fireball != null ? d.idOf.fireball : d.idOf['fire:clean'] != null ? d.idOf['fire:clean'] : d.idOf.fire, ash = d.idOf.fallout;
      for (let y = Math.max(0, cy - R); y <= Math.min(h - 1, cy + R); y++) {
        for (let x = Math.max(0, cx - R); x <= Math.min(w - 1, cx + R); x++) {
          const dist = Math.hypot(x - cx, y - cy);
          if (dist > r) continue;
          const i = y * w + x, m = mat[i];
          if (d.armor[m]) continue;
          const f = 1 - dist / (r + 0.5), s = d.state[m];
          const heat = this.ambient + (T - this.ambient) * f;
          if (f > (fallout ? 0.3 : 0.45) && (s === GAS || r >= 4)) {
            const to = fallout && ash != null && Math.random() < 0.2 ? ash : fire;
            this.setCell(i, to, Math.max(heat, Tm[i]));
          } else {
            if (Tm[i] < heat) Tm[i] = heat;
            if (d.shatter[m] >= 0 && f > 0.15 && r >= 2.5) this.setCell(i, d.shatter[m], Tm[i]); // 바위·유리는 조각난다
          }
        }
      }
      // 바깥쪽부터 밀어내어 칸이 겹치지 않게 한다.
      for (let ring = R; ring >= 1; ring--) {
        for (let y = Math.max(0, cy - ring); y <= Math.min(h - 1, cy + ring); y++) {
          for (let x = Math.max(0, cx - ring); x <= Math.min(w - 1, cx + ring); x++) {
            const dist = Math.hypot(x - cx, y - cy);
            if (dist > ring || dist <= ring - 1 || dist < 0.5) continue;
            const i = y * w + x, s = d.state[mat[i]];
            if (s === GAS || s === SOLID || this.anchor[i] || d.armor[mat[i]]) continue;
            const ux = (x - cx) / dist, uy = (y - cy) / dist;
            const reach = Math.max(1, Math.round((1 - dist / (r + 1)) * r * (fallout ? 3 : 1.5)));
            let to = -1;
            for (let k = 1; k <= reach; k++) {
              const nx = Math.round(x + ux * k), ny = Math.round(y + uy * k);
              if (!this.inside(nx, ny)) break;
              const j = ny * w + nx;
              if (d.state[mat[j]] !== GAS) break;
              to = j;
            }
            // 가까운 가루·액체 일부는 파편으로 날아간다.
            if (dist < r * 0.9 && Math.random() < (fallout ? 0.5 : 0.3)) {
              const sp = Math.min(6, 0.5 + r * 0.45 * (1 - dist / (r + 1))) * (0.6 + Math.random() * 0.6);
              if (this.launch(i, ux * sp, uy * sp - sp * 0.4)) continue;
            }
            if (to >= 0) this.swap(i, to);
          }
        }
      }
      if (this.fx.length < 200) this.fx.push({ type: 'boom', x: cx, y: cy, r, nuke: !!fallout });
      const kick = 1.5 * r;
      for (const b of this.bodies) {
        const bx = b.x / this.dx - cx, by = b.y / this.dx - cy, dist = Math.hypot(bx, by);
        if (dist > r * 3 || dist < 1e-6) continue;
        const v = kick * (1 - dist / (r * 3)) * Math.min(1, 2000 / b.density);
        b.vx += bx / dist * v; b.vy += by / dist * v;
      }
      this.note('explosion:' + (r >= 6 ? 'big' : 'small'), () => ({
        type: 'reaction', id: 'explosion:' + (r >= 6 ? 'big' : 'small'), name: r >= 6 ? '큰 폭발' : '폭발', kind: 'physical',
        eq: '빠른 반응 → 짧은 시간에 많은 열과 기체 → 충격파', note: '반응이 아주 빠르면 생긴 열과 기체가 빠져나갈 틈이 없어 주변을 밀어냅니다.',
      }));
    }

    // ---- 전기 분해 ----
    // 20틱마다 회로를 찾는다: 각 전극에서 닿은 금속을 따라 도체를 넓히고, (−)극 도체에 닿은 전해질에서 시작해
    // 이어진 전해질을 따라가 (+)극 도체에 닿으면 전류가 흐른다. 두 극이 금속으로 바로 이어지면 합선이다.
    isElectrolyte(m) {
      const d = this.data;
      if (d.elyte[m] < 0) d.elyte[m] = SL.CHEM && SL.CHEM.electrolyteIons(d.defs[m]) ? 1 : 0;
      return d.elyte[m] === 1;
    }

    findCircuit() {
      const { w, h, mat } = this, d = this.data, size = w * h;
      if (!this.role || this.role.length !== size) this.role = new Uint8Array(size);
      const role = this.role;
      role.fill(0);
      this.cathodes = []; this.anodes = []; this.circuit = false;
      const nb = (i, f) => { const x = i % w; if (x > 0) f(i - 1); if (x < w - 1) f(i + 1); if (i >= w) f(i - w); if (i + w < size) f(i + w); };
      const flood = (kind, bit, list) => {
        const stack = [];
        for (let i = 0; i < size; i++) if (d.electrode[mat[i]] === kind) { role[i] |= bit; stack.push(i); }
        while (stack.length) {
          const i = stack.pop();
          list.push(i);
          nb(i, (j) => { if (!(role[j] & bit) && d.conductor[mat[j]] && !d.electrode[mat[j]]) { role[j] |= bit; stack.push(j); } });
        }
      };
      flood(1, 1, this.anodes);
      flood(2, 2, this.cathodes);
      // 전구는 도체가 아니라 짐(부하)이다. 한쪽은 (+)극 쪽, 다른 쪽은 (−)극 쪽 도체에 닿으면 전류가 흘러 켜진다.
      const seen = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        if (seen[i] || !d.load[mat[i]]) continue;
        const group = [], st = [i];
        let a = false, c = false;
        seen[i] = 1;
        while (st.length) {
          const k = st.pop();
          group.push(k);
          nb(k, (j) => { if (role[j] & 1) a = true; if (role[j] & 2) c = true; if (!seen[j] && d.load[mat[j]]) { seen[j] = 1; st.push(j); } });
        }
        if (a && c) for (const k of group) this.lit.add(k);
      }
      if (!this.anodes.length || !this.cathodes.length) return;
      if (this.anodes.some((i) => role[i] & 2)) { // 합선
        this.note('short', () => ({ type: 'reaction', id: 'short', name: '합선', kind: 'physical', eq: '(+)극 ─ 금속 ─ (−)극', note: '두 전극이 금속으로 바로 이어지면 전류가 용액을 지나지 않아 전기 분해가 일어나지 않습니다. 큰 전류가 흘러 도선이 뜨거워지고 불꽃이 튑니다.' }));
        // 줄열: 합선된 도선이 달아오른다. 전극 근처에서 불꽃이 튄다.
        for (let k = 0; k < role.length; k++) if ((role[k] & 3) === 3 && !this.data.electrode[mat[k]]) this.T[k] += 4;
        const at = this.anodes[(Math.random() * this.anodes.length) | 0];
        if (this.fx.length < 200) this.fx.push({ type: 'spark', x: at % w, y: (at / w) | 0, hot: 2000 });
        return;
      }
      const stack = [];
      for (const i of this.cathodes) nb(i, (j) => { if (!(role[j] & 4) && this.isElectrolyte(mat[j])) { role[j] |= 4; stack.push(j); } });
      while (stack.length) {
        const i = stack.pop();
        nb(i, (j) => { if (!(role[j] & 4) && this.isElectrolyte(mat[j])) { role[j] |= 4; stack.push(j); } });
      }
      this.circuit = this.anodes.some((i) => { let ok = false; nb(i, (j) => { if (role[j] & 4) ok = true; }); return ok; });
    }

    // 화학 전지: 도선이나 금속끼리 이어진 덩어리 안에 반응성이 다른 두 금속이 같은 전해질에 잠겨 있으면 전류가 흐른다.
    // 반응성이 큰 금속이 녹아 전자를 내놓고(−극), 작은 금속 표면에서 수소가 나오거나 금속이 석출된다(+극).
    findGalvanic() {
      const { w, h, mat } = this, d = this.data, size = w * h, role = this.role;
      this.cells = [];
      const nb = (i, f) => { const x = i % w; if (x > 0) f(i - 1); if (x < w - 1) f(i + 1); if (i >= w) f(i - w); if (i + w < size) f(i + w); };
      const elab = this.elab && this.elab.length === size ? this.elab.fill(0) : (this.elab = new Int32Array(size));
      const clab = this.clab && this.clab.length === size ? this.clab.fill(0) : (this.clab = new Int32Array(size));
      let regions = 0, clusters = 0;
      for (let i = 0; i < size; i++) {
        if (elab[i] || !this.isElectrolyte(mat[i])) continue;
        const r = ++regions, st = [i]; elab[i] = r;
        while (st.length) { const k = st.pop(); nb(k, (j) => { if (!elab[j] && this.isElectrolyte(mat[j])) { elab[j] = r; st.push(j); } }); }
      }
      if (!regions) return;
      const rank = (el) => SL.CHEM.SERIES.indexOf(el);
      for (let i = 0; i < size; i++) {
        const m0 = mat[i];
        if (clab[i] || !(d.conductor[m0] || d.load[m0]) || d.electrode[m0] || (role && role[i] & 3)) continue;
        const id = ++clusters, st = [i], wet = new Map(), bulbs = [];
        clab[i] = id;
        while (st.length) {
          const k = st.pop(), def = d.defs[mat[k]];
          if (d.load[mat[k]]) bulbs.push(k);
          if (def.metal && rank(def.metal) >= 0) nb(k, (j) => { if (elab[j]) { const key = def.metal + '|' + elab[j]; if (!wet.has(key)) wet.set(key, []); wet.get(key).push(k); } });
          nb(k, (j) => { const mj = mat[j]; if (!clab[j] && (d.conductor[mj] || d.load[mj]) && !d.electrode[mj] && !(role && role[j] & 3)) { clab[j] = id; st.push(j); } });
        }
        // 전해질 영역마다 가장 활발한 금속(−극)과 가장 덜 활발한 금속(+극)을 고른다.
        const byRegion = new Map();
        for (const [key, list] of wet) { const [el, r] = key.split('|'); if (!byRegion.has(r)) byRegion.set(r, []); byRegion.get(r).push([el, list]); }
        for (const metals of byRegion.values()) {
          if (metals.length < 2) continue;
          metals.sort((a, b) => rank(a[0]) - rank(b[0]));
          const [aEl, anode] = metals[0], [cEl, cathode] = metals[metals.length - 1];
          const diff = rank(cEl) - rank(aEl);
          if (diff <= 0 || !SL.CHEM.METALS[aEl] || !SL.CHEM.METALS[aEl].cat) continue;
          this.cells.push({ anode, cathode, rate: Math.min(3, 0.12 * diff), bulbs, aEl, cEl, ea: 0, ec: 0 });
          for (const b of bulbs) this.lit.add(b);
        }
      }
    }

    // 회로 상태에 따라 전구를 켜고 끈다.
    updateBulbs() {
      const d = this.data, on = d.idOf['bulb:on'], off = d.idOf.bulb, mat = this.mat;
      if (on == null) return;
      for (let i = 0; i < mat.length; i++) {
        if (mat[i] === on && !this.lit.has(i)) { const T = this.T[i]; this.setCell(i, off, T); this.anchor[i] = 1; }
        else if (mat[i] === off && this.lit.has(i)) {
          const T = this.T[i]; this.setCell(i, on, T + 5); this.anchor[i] = 1;
          this.note('bulb', () => ({ type: 'reaction', id: 'bulb', name: '전구에 불이 들어옴', kind: 'physical', eq: '전류 → 필라멘트가 뜨거워져 빛남', note: '회로가 닫혀 전류가 흐르면 전구가 켜집니다. 전류가 흐르려면 전원이나 화학 전지와, 끊기지 않은 길이 필요합니다.' }));
        }
      }
    }

    stepGalvanic() {
      if (!this.cells || !this.cells.length) return;
      const { w, mat } = this, d = this.data, size = mat.length;
      const pickNb = (i) => { const r = Math.random(), x = i % w; return r < 0.25 ? (x > 0 ? i - 1 : -1) : r < 0.5 ? (x < w - 1 ? i + 1 : -1) : r < 0.75 ? (i >= w ? i - w : -1) : (i + w < size ? i + w : -1); };
      const apply = (j, res) => {
        this.setCell(j, pick(d.resolve(res.to)), this.T[j] + 1);
        this.note(res.key, () => ({ type: 'reaction', id: res.key, name: res.name, kind: 'chemical', eq: res.eq, note: res.note }));
      };
      for (const cell of this.cells) {
        cell.ec += cell.rate; cell.ea += cell.rate;
        let did = false;
        for (let t = 0; t < 20 && cell.ec > 0; t++) {
          const i = cell.cathode[(Math.random() * cell.cathode.length) | 0], j = pickNb(i);
          if (j < 0 || d.defs[mat[i]].metal !== cell.cEl || !this.isElectrolyte(mat[j])) continue;
          const res = SL.CHEM.electrolysis(d.defs[mat[j]], 'cathode');
          if (!res) continue;
          apply(j, res); cell.ec -= res.e; did = true;
          if (res.deposit) this.anchor[j] = 1;
        }
        for (let t = 0; t < 20 && cell.ea > 0; t++) {
          const i = cell.anode[(Math.random() * cell.anode.length) | 0], j = pickNb(i);
          if (j < 0 || d.defs[mat[i]].metal !== cell.aEl || !this.isElectrolyte(mat[j])) continue;
          const res = SL.CHEM.anodeDissolve(d.defs[mat[i]], d.defs[mat[j]]);
          if (!res) continue;
          // 금속 한 칸에는 이온이 수십 배 많으므로, 녹아 나온 이온은 대개 옆 용액으로 들어가고 금속 칸은 가끔만 사라진다.
          apply(Math.random() < 0.12 ? i : j, res); cell.ea -= res.e; did = true;
        }
        cell.ea = Math.min(cell.ea, cell.rate); cell.ec = Math.min(cell.ec, cell.rate);
        if (did) this.note('galvanic', () => ({ type: 'reaction', id: 'galvanic', name: '화학 전지', kind: 'chemical', eq: `${cell.aEl} → ${cell.aEl}ⁿ⁺ + ne⁻ (−극) │ 전자가 도선을 따라 ${cell.cEl}(+극)으로`, note: '반응성이 다른 두 금속을 전해질에 담그고 도선으로 이으면, 반응성이 큰 금속이 녹으며 내놓은 전자가 도선으로 흘러 전류가 됩니다. 볼타 전지·다니엘 전지·레몬 전지의 원리입니다.' }));
      }
    }

    stepElectro() {
      const d = this.data;
      if (!SL.CHEM || !SL.CHEM.electrolysis) return;
      if (this.tick % 20 === 1 || !this.lit) {
        this.lit = new Set();
        if (d.anyElectrode) this.findCircuit(); else { this.role = null; this.circuit = false; }
        this.findGalvanic();
        this.updateBulbs();
      }
      this.stepGalvanic();
      if (!d.anyElectrode || !this.circuit) return;
      const { w, mat, role } = this, size = mat.length;
      const pickNb = (i) => { const r = Math.random(), x = i % w; return r < 0.25 ? (x > 0 ? i - 1 : -1) : r < 0.5 ? (x < w - 1 ? i + 1 : -1) : r < 0.75 ? (i >= w ? i - w : -1) : (i + w < size ? i + w : -1); };
      // 패러데이 법칙: 전류가 일정하므로 한 틱에 오가는 전자 수가 정해져 있다. 두 극에서 같은 수의 전자가 오간다.
      // 수소·구리 이온은 전자 2개, 산소는 4개, 은 이온은 1개가 드므로 수소가 산소의 두 배 나온다.
      const ELECTRONS = 4; // 틱당 전자 수(전류). 모자라거나 남은 몫은 다음 틱으로 넘겨 평균이 정확하도록 한다.
      this.eCath = (this.eCath || 0) + ELECTRONS;
      this.eAnod = (this.eAnod || 0) + ELECTRONS;
      const apply = (j, res, hostT) => {
        this.setCell(j, pick(d.resolve(res.to)), Math.max(this.T[j], hostT) + 1); // 전류가 흐르며 조금 데워진다(줄열)
        this.note(res.key, () => ({ type: 'reaction', id: res.key, name: res.name, kind: 'chemical', eq: res.eq, note: res.note }));
      };
      const cathodes = this.cathodes, anodes = this.anodes;
      for (let tries = 0; tries < 30 && this.eCath > 0; tries++) {
        const i = cathodes[(Math.random() * cathodes.length) | 0], j = pickNb(i);
        if (j < 0 || !(role[j] & 4) || !this.isElectrolyte(mat[j])) continue;
        const res = SL.CHEM.electrolysis(d.defs[mat[j]], 'cathode');
        if (!res) continue;
        apply(j, res, this.T[i]);
        this.eCath -= res.e;
        if (res.deposit) { this.anchor[j] = 1; role[j] = 2; cathodes.push(j); } // 석출된 금속도 전극이 된다
      }
      for (let tries = 0; tries < 30 && this.eAnod > 0; tries++) {
        const i = anodes[(Math.random() * anodes.length) | 0], j = pickNb(i);
        if (j < 0 || !(role[j] & 4) || !this.isElectrolyte(mat[j])) continue;
        if (!d.electrode[mat[i]]) { // 금속 (+)극은 스스로 녹는다
          const res = SL.CHEM.anodeDissolve(d.defs[mat[i]], d.defs[mat[j]]);
          if (res) {
            if (Math.random() < 0.12) { apply(i, res, this.T[i]); role[i] = 4; } else apply(j, res, this.T[i]); // 금속 칸은 가끔만 사라진다
            this.eAnod -= res.e; continue;
          }
        }
        const res = SL.CHEM.electrolysis(d.defs[mat[j]], 'anode');
        if (!res) continue;
        apply(j, res, this.T[i]);
        this.eAnod -= res.e;
      }
      // 반응할 자리가 없어 못 쓴 전자는 쌓아 두지 않는다.
      this.eCath = Math.min(this.eCath, ELECTRONS); this.eAnod = Math.min(this.eAnod, ELECTRONS);
    }

    // ---- 압력 ----
    // 이어진 기체 칸을 한 공간으로 묶는다. 액체는 압력을 그대로 전하므로(파스칼 원리) 액체로 이어진 기체도 같은 공간이다.
    // 맨 위가 열려 있으면 대기와 통하므로 1기압으로 풀린다.
    // 닫힌 공간은 P = Σ n·T / (V·293K)로 압력을 구하고, 가장 약한 벽이 견디는 압력을 넘으면 그곳이 터진다.
    stepPressure() {
      const { w, h, mat, T, anchor } = this, d = this.data, size = w * h, gas = this.gas, st = d.state, str = d.strength;
      const lab = this.plab && this.plab.length === size ? this.plab.fill(0) : (this.plab = new Int32Array(size));
      const stack = this.pstack && this.pstack.length === size ? this.pstack : (this.pstack = new Int32Array(size));
      const regions = [null];
      // 기체·액체·고정되지 않은 가루는 공간에 포함하고, 나머지(고체, 고정한 가루)는 벽이다.
      const inside = (j) => { const s2 = st[mat[j]]; return s2 === GAS || s2 === LIQUID || (s2 === POWDER && !anchor[j]); };
      const pumpArr = d.pump;
      let pumped = false;
      for (let s0 = 0; s0 < size; s0++) {
        if (lab[s0] || st[mat[s0]] !== GAS) continue;
        const id = regions.length;
        let top = 0, V = 0, nT = 0, Tsum = 0, open = false, weak = -1, weakS = Infinity;
        pumped = false;
        stack[top++] = s0; lab[s0] = id;
        const first = s0;
        while (top) {
          const i = stack[--top];
          if (st[mat[i]] === GAS) { V++; nT += gas[i] * (T[i] + 273.15); Tsum += T[i]; }
          if (i < w) { if (this.openTop) open = true; } else { const j = i - w; if (!lab[j]) { if (inside(j)) { lab[j] = id; stack[top++] = j; } else { if (pumpArr[mat[j]]) pumped = true; else if (str[mat[j]] < weakS) { weakS = str[mat[j]]; weak = j; } } } }
          if (i + w < size) { const j = i + w; if (!lab[j]) { if (inside(j)) { lab[j] = id; stack[top++] = j; } else { if (pumpArr[mat[j]]) pumped = true; else if (str[mat[j]] < weakS) { weakS = str[mat[j]]; weak = j; } } } }
          const x = i % w;
          if (x > 0) { const j = i - 1; if (!lab[j]) { if (inside(j)) { lab[j] = id; stack[top++] = j; } else { if (pumpArr[mat[j]]) pumped = true; else if (str[mat[j]] < weakS) { weakS = str[mat[j]]; weak = j; } } } }
          if (x < w - 1) { const j = i + 1; if (!lab[j]) { if (inside(j)) { lab[j] = id; stack[top++] = j; } else { if (pumpArr[mat[j]]) pumped = true; else if (str[mat[j]] < weakS) { weakS = str[mat[j]]; weak = j; } } } }
        }
        if (!V) { regions.push({ P: 1, V: 0, open, T: 20 }); continue; }
        const big = V > 6000; // 아주 큰 공간은 방 전체의 공기로 보고 대기와 통한다고 본다.
        const P = open || big ? 1 : nT / 293.15 / V;
        regions.push({ P, V, open: open || big, T: Tsum / V, first });
        if (open || big) continue;
        // 진공 펌프에 닿은 닫힌 공간은 기체가 조금씩 빠져나간다.
        if (pumped) {
          for (let k = 0; k < size; k++) if (lab[k] === id && st[mat[k]] === GAS) gas[k] = Math.max(0.01, gas[k] * 0.85);
          this.note('vacuum', () => ({ type: 'reaction', id: 'vacuum', name: '진공 펌프', kind: 'physical', eq: `기체를 빼냄 → 압력 ${P.toFixed(2)}기압`, note: '닫힌 용기의 기체를 빼내면 압력이 내려갑니다. 압력이 낮으면 물이 낮은 온도에서도 끓습니다.' }));
        }
        // 바깥 공기(1기압)가 누르는 힘이 얇은 벽이 견디는 정도를 넘으면 안쪽으로 찌그러진다.
        if (weak >= 0 && (1 - P) * 2 > weakS) {
          this.note('implode', () => ({ type: 'reaction', id: 'implode', name: '대기압에 찌그러짐', kind: 'physical', eq: `바깥 1기압 − 안쪽 ${P.toFixed(2)}기압`, note: '안쪽 압력이 낮아지면 바깥 공기가 용기를 누르는 힘이 커져 얇은 용기가 찌그러집니다. 공기도 무게가 있어 큰 힘으로 누르고 있다는 증거입니다.' }));
          this.setCell(weak, d.shatter[mat[weak]] >= 0 ? d.shatter[mat[weak]] : this.AIR, T[weak]);
          continue;
        }
        if (weak >= 0 && P > weakS) {
          const r = Math.max(2, Math.min(8, 1.5 + (P - weakS) * 0.6));
          this.note('burst', () => ({ type: 'reaction', id: 'burst', name: '밀폐 용기 파열', kind: 'physical', eq: `압력 ${P.toFixed(1)}기압 > 용기가 견디는 압력 ${weakS}기압`, note: '갇힌 기체를 데우거나 액체가 끓어 기체가 생기면 압력이 커집니다(PV = nRT). 용기가 견딜 수 있는 압력을 넘으면 가장 약한 곳이 터집니다. 압력솥에 안전밸브가 있는 이유입니다.' }));
          this.explode(weak, r, Math.max(200, Tsum / V));
          for (let k = 0; k < size; k++) if (lab[k] === id && gas[k] > 1) gas[k] = 1;
        }
      }
      // 열린 공간으로 나온 압축 기체는 대기 속으로 퍼져 1기압이 된다.
      for (let k = 0; k < size; k++) if (gas[k] !== 1 && gas[k] > 0) { const r = regions[lab[k]]; if (!r || r.open) gas[k] = 1 + (gas[k] - 1) * 0.5; }
      this.pRegions = regions;
    }
    // 그 칸이 속한 기체 공간의 압력(기압). 기체가 아니거나 열린 공간이면 1.
    pressureAt(i) {
      if (!this.pRegions || !this.plab || this.data.state[this.mat[i]] !== GAS) return 1;
      const r = this.pRegions[this.plab[i]];
      return r ? r.P : 1;
    }
    // 기체·액체·가루 칸이 속한 공간의 압력(액체는 위의 기체와 같은 압력을 받는다).
    regionP(i) {
      if (!this.pRegions || !this.plab) return 1;
      const r = this.pRegions[this.plab[i]];
      return r ? r.P : 1;
    }

    // ---- 핵분열 ----
    stepNuclear() {
      if (!this.fq.length) return;
      const list = this.fq;
      this.fq = [];
      const n = Math.min(list.length, MAX_FISSIONS);
      if (list.length > 30) this.note('chain', () => ({ type: 'reaction', id: 'chain', name: '핵분열 연쇄 반응', kind: 'nuclear', eq: '중성자 1개 → 핵분열 → 중성자 2~3개 → …', note: '핵분열에서 나온 중성자가 다른 원자핵을 쪼개면 반응이 기하급수적으로 늘어납니다. 덩어리가 작으면 중성자가 밖으로 빠져나가 이어지지 않습니다(임계 질량).' }));
      // 이번 세대가 거의 빠른 중성자로만 이어질 때만 폭발할 수 있다. 감속된 연쇄 반응은 세대가 느려서 폭발 전에 녹거나 물이 끓어 멈춘다.
      let slow = 0;
      for (let k = 0; k < n; k++) slow += list[k] & 1;
      this.slowAvg = 0.8 * this.slowAvg + 0.2 * (slow / n); // 느린 중성자 비율의 이동 평균
      this.prompt = n >= 40 && this.slowAvg < 0.05;
      this.genSize = n;
      for (let k = 0; k < n; k++) this.fission(list[k] >> 1, (list[k] & 1) === 1);
    }

    fission(i, thermal) {
      const d = this.data, m = this.mat[i];
      if (!d.fast[m] && !d.thermal[m]) return; // 이미 다른 물질이 되었다.
      this.note('fission', () => ({ type: 'reaction', id: 'fission', name: '핵분열', kind: 'nuclear', eq: '²³⁵U + n → 핵분열 생성물 + 2~3n + 에너지', note: '무거운 원자핵이 중성자를 흡수해 둘로 쪼개지며 화학 반응보다 수백만 배 많은 에너지를 냅니다.' }));
      this.T[i] += FISSION_HEAT;
      if (Math.random() < FISSION_BURNUP && d.idOf.fallout != null) this.setCell(i, d.idOf.fallout, this.T[i]);
      this.emitNeutrons(i, Math.random() < 0.5 ? 2 : 3, thermal);
      if (!thermal && this.prompt && this.T[i] > NUKE_T) {
        this.note('nuke', () => ({ type: 'reaction', id: 'nuke', name: '핵폭발', kind: 'nuclear', eq: '빠른 중성자 연쇄 반응 → 순식간에 막대한 에너지', note: '임계 질량을 넘은 핵분열 물질에서 빠른 중성자로 연쇄 반응이 폭주하면 폭발합니다. 폭발로 덩어리가 흩어지면 연쇄 반응은 멈추고 방사성 낙진이 남습니다.' }));
        this.explode(i, Math.min(24, 8 + this.genSize / 30), 6000, true); // 한 세대의 핵분열이 많을수록 폭발이 크다.
      } else if (thermal && this.T[i] > 1100) {
        this.note('meltdown', () => ({ type: 'reaction', id: 'meltdown', name: '노심 용융', kind: 'nuclear', eq: '감속된 연쇄 반응의 열 > 냉각', note: '감속재로 이어지는 연쇄 반응은 핵폭탄처럼 터지지 않지만, 열을 식히지 못하면 연료가 녹아내립니다. 물이 끓어 수증기가 되면 감속이 줄어 반응이 약해집니다.' }));
      }
    }

    emitNeutrons(i, count, thermal0) {
      const { w, h, mat } = this, d = this.data;
      const x0 = i % w, y0 = (i / w) | 0;
      for (let c = 0; c < count; c++) {
        let a = Math.random() * Math.PI * 2, ux = Math.cos(a), uy = Math.sin(a);
        let x = x0 + 0.5, y = y0 + 0.5, thermal = thermal0 && d.moder[mat[i]] === 1, last = i;
        for (let step = 0; step < NEUTRON_RANGE; step++) {
          x += ux; y += uy;
          const cx = x | 0, cy = y | 0;
          if (cx < 0 || cy < 0 || cx >= w || cy >= h) break;
          const j = cy * w + cx;
          if (j === last) continue;
          last = j;
          const m = mat[j];
          if (Math.random() < d.absorb[m]) break; // 흡수
          if (d.moder[m]) {
            thermal = true;
            if (Math.random() < 0.2) { a = Math.random() * Math.PI * 2; ux = Math.cos(a); uy = Math.sin(a); } // 산란
            continue;
          }
          const p = thermal ? d.thermal[m] : d.fast[m];
          if (p && Math.random() < p) { this.fq.push(j * 2 + (thermal ? 1 : 0)); break; }
        }
      }
    }

    // 이 물질과 반응하는 재료 목록(화면의 힌트용). 재료 목록에 보이는 물질과 공기만 본다.
    partnersOf(a) {
      const d = this.data, out = [];
      const water = d.idOf.water;
      // 다른 용액에 그냥 녹거나 섞이기만 하는 것은 힌트에서 뺀다. 녹은 뒤 반응한다면 그 반응을 보여 준다.
      const generic = /^(dissolve:|ice-melt:liquid|nh3-dissolve|hcl-dissolve)/;
      const meaningful = (x, y) => {
        const list = reactionsBetween(d, x, y);
        return list ? list.filter((e) => !e.r.silent && (y === water || !generic.test(e.r.id))) : [];
      };
      const def = d.defs[a];
      const aq = def.salt && SL.SALTS && SL.SALTS[def.salt.c] && SL.SALTS[def.salt.c][def.salt.a] && SL.SALTS[def.salt.c][def.salt.a].aq;
      const aqId = aq && aq !== def.id ? d.idOf[aq] : null;
      for (let b = 0; b < d.n; b++) {
        if (b === a || (!d.defs[b].cat && b !== this.AIR)) continue;
        let real = meaningful(a, b);
        if (!real.length && aqId != null && d.defs[b].aq && b !== aqId) real = meaningful(aqId, b); // 녹은 다음의 반응
        if (!real.length) continue;
        const minT = Math.min(...real.map((e) => (e.r.minT == null ? -273 : e.r.minT)));
        const near = real.every((e) => e.near) ? real[0].near.map((k) => d.defs[k].name) : null;
        out.push({ id: d.defs[b].id, name: d.defs[b].name, cat: d.defs[b].cat, color: d.defs[b].color, reaction: real[0].r.name, minT: minT > 25 ? minT : null, near });
      }
      return out;
    }

    hasNear(i, ids) {
      const { w, mat } = this, x = i % w;
      return (x > 0 && ids.includes(mat[i - 1])) || (x < w - 1 && ids.includes(mat[i + 1])) ||
        (i >= w && ids.includes(mat[i - w])) || (i + w < mat.length && ids.includes(mat[i + w]));
    }

    note(key, build) {
      if (this.discovered.has(key)) return;
      this.discovered.add(key);
      this.events.push(build());
    }
    drainEvents() { const e = this.events; this.events = []; return e; }
    drainFx() { const e = this.fx; this.fx = []; return e; }

    // ---- 강체 공 (SI 단위, y는 아래로 증가) ----
    addBody(o) {
      const def = SL.BALLS[o.type];
      const r = o.r || 0.04;
      const volume = 4 / 3 * Math.PI * r ** 3;
      const b = {
        id: this.nextBodyId++, type: o.type, r, x: o.x, y: o.y, vx: o.vx || 0, vy: o.vy || 0, e: def.e, color: def.color,
        density: def.density, volume, area: Math.PI * r * r, mass: def.density * volume,
        rhoFluid: 0, trail: [], born: this.time, firstHit: null, x0: o.x, y0: o.y, vy0: o.vy || 0, log: [],
      };
      this.bodies.push(b);
      return b;
    }
    select(b) { this.selected = b; }
    floorY() { return this.h * this.dx; }
    heightOf(b) { return this.floorY() - b.y - b.r; }
    energyOf(b) {
      return { ke: 0.5 * b.mass * (b.vx * b.vx + b.vy * b.vy), pe: b.mass * this.g * this.heightOf(b) };
    }

    // 공이 잠긴 유체의 평균 밀도(진공 모드에서는 기체를 0으로 본다).
    sampleFluid(b) {
      let sum = 0;
      for (let n = 0; n < 9; n++) {
        const a = n / 8 * Math.PI * 2;
        const rr = n === 8 ? 0 : b.r * 0.7;
        const cx = Math.floor((b.x + Math.cos(a) * rr) / this.dx);
        const cy = Math.floor((b.y + Math.sin(a) * rr) / this.dx);
        if (!this.inside(cx, cy)) continue;
        const i = this.index(cx, cy), s = this.data.state[this.mat[i]];
        if (s === LIQUID || (s === GAS && !this.vacuum)) sum += this.effRho(i);
      }
      return sum / 9;
    }

    stepBodies() {
      if (!this.bodies.length) return;
      const sub = 4, h = this.dt / sub;
      for (let s = 0; s < sub; s++) {
        for (const b of this.bodies) {
          const rho = b.rhoFluid = this.sampleFluid(b);
          b.vy += this.g * (1 - rho / b.density) * h; // 중력 + 아르키메데스 부력
          const k = 0.5 * rho * 0.47 * b.area / b.mass; // 항력 ½ρCdAv²
          const sp = Math.hypot(b.vx, b.vy);
          const damp = 1 / (1 + k * sp * h); // 암시적 적분으로 안정성 확보
          b.vx *= damp; b.vy *= damp;
          b.x += b.vx * h; b.y += b.vy * h;
          this.collideGrid(b);
        }
        this.collideBodies();
      }
      for (const b of this.bodies) {
        if (this.tick % 2 === 0) {
          b.trail.push(b.x, b.y);
          if (b.trail.length > 400) b.trail.splice(0, 2);
        }
      }
    }

    bounce(b, nx, ny) {
      const vn = b.vx * nx + b.vy * ny;
      if (vn >= 0) return;
      const e = -vn < 0.12 ? 0 : b.e; // 아주 느리면 튀지 않고 멈춘다.
      if (b.firstHit == null && -vn > 0.01) b.firstHit = this.time;
      b.vx -= (1 + e) * vn * nx; b.vy -= (1 + e) * vn * ny;
      const tx = -ny, ty = nx, vt = b.vx * tx + b.vy * ty;
      const f = 0.02 * vt; // 접선 마찰
      b.vx -= f * tx; b.vy -= f * ty;
    }

    collideGrid(b) {
      const dx = this.dx, rc = b.r / dx, cx = b.x / dx, cy = b.y / dx, lim = rc + 0.5;
      let nx = 0, ny = 0, maxPen = 0;
      const x0 = Math.max(0, Math.floor(cx - lim)), x1 = Math.min(this.w - 1, Math.ceil(cx + lim));
      const y0 = Math.max(0, Math.floor(cy - lim)), y1 = Math.min(this.h - 1, Math.ceil(cy + lim));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (this.data.state[this.mat[y * this.w + x]] > POWDER) continue;
        const ox = cx - (x + 0.5), oy = cy - (y + 0.5), d = Math.hypot(ox, oy);
        if (d >= lim || d < 1e-6) continue;
        const pen = lim - d;
        nx += ox / d * pen; ny += oy / d * pen;
        if (pen > maxPen) maxPen = pen;
      }
      const len = Math.hypot(nx, ny);
      if (maxPen > 0 && len > 1e-6) {
        nx /= len; ny /= len;
        b.x += nx * maxPen * dx; b.y += ny * maxPen * dx;
        this.bounce(b, nx, ny);
      }
      const W = this.w * dx, H = this.h * dx;
      if (b.y + b.r > H) { b.y = H - b.r; this.bounce(b, 0, -1); }
      if (b.y - b.r < 0) { b.y = b.r; this.bounce(b, 0, 1); }
      if (b.x + b.r > W) { b.x = W - b.r; this.bounce(b, -1, 0); }
      if (b.x - b.r < 0) { b.x = b.r; this.bounce(b, 1, 0); }
    }

    collideBodies() {
      const list = this.bodies;
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        const ox = b.x - a.x, oy = b.y - a.y, d = Math.hypot(ox, oy), lim = a.r + b.r;
        if (d >= lim || d < 1e-9) continue;
        const nx = ox / d, ny = oy / d, total = a.mass + b.mass, pen = lim - d;
        a.x -= nx * pen * b.mass / total; a.y -= ny * pen * b.mass / total;
        b.x += nx * pen * a.mass / total; b.y += ny * pen * a.mass / total;
        const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (vn >= 0) continue;
        const imp = -(1 + Math.min(a.e, b.e)) * vn / (1 / a.mass + 1 / b.mass); // 운동량 보존
        a.vx -= imp / a.mass * nx; a.vy -= imp / a.mass * ny;
        b.vx += imp / b.mass * nx; b.vy += imp / b.mass * ny;
        if (a.firstHit == null) a.firstHit = this.time;
        if (b.firstHit == null) b.firstHit = this.time;
      }
    }

    // ---- 계측 ----
    setProbe(x, y) { this.probe = { x, y, log: [] }; }
    record() {
      const b = this.selected;
      if (b) {
        const { ke, pe } = this.energyOf(b);
        b.log.push({ t: this.time - b.born, h: this.heightOf(b), v: b.vy, E: ke + pe });
        if (b.log.length > 1800) b.log.shift();
      }
      const p = this.probe;
      if (p && this.tick % 6 === 0) {
        const pi = this.index(p.x, p.y);
        p.log.push({ t: this.time, T: this.T[pi], m: this.mat[pi], P: this.pressureAt(pi) });
        if (p.log.length > 1200) p.log.shift();
      }
    }

    // 최소제곱으로 구한 첫 충돌 전의 가속도. 진공이면 설정한 g와 일치해야 한다.
    measuredAccel(b) {
      const end = b.firstHit == null ? Infinity : b.firstHit - b.born;
      const pts = b.log.filter((s) => s.t < end - 2 * this.dt);
      if (pts.length < 6) return null;
      let st = 0, sv = 0, stt = 0, stv = 0;
      for (const s of pts) { st += s.t; sv += s.v; stt += s.t * s.t; stv += s.t * s.v; }
      const n = pts.length, den = n * stt - st * st;
      return den ? (n * stv - st * sv) / den : null;
    }

    inspect(x, y) {
      if (!this.inside(x, y)) return null;
      const i = this.index(x, y), def = this.data.defs[this.mat[i]];
      const s = this.data.state[this.mat[i]];
      return { def, T: this.T[i], rho: this.effRho(i), P: s === LIQUID || s === POWDER ? this.regionP(i) + this.hydroP(i) : this.pressureAt(i) };
    }

    // ---- 되돌리기용 스냅숏 (메모리 안에서만, 빠르게) ----
    snapshot() {
      this.settleFlyers();
      return {
        mat: this.mat.slice(), T: this.T.slice(), gas: this.gas.slice(), anchor: this.anchor.slice(), store: this.store.slice(), vy: this.vy.slice(), life: this.life.slice(), shade: this.shade.slice(),
        bodies: this.bodies.map((b) => Object.assign({}, b, { trail: [], log: [] })), probe: this.probe && { x: this.probe.x, y: this.probe.y },
      };
    }
    restoreSnapshot(s) {
      this.mat.set(s.mat); this.T.set(s.T); if (s.gas) this.gas.set(s.gas); this.anchor.set(s.anchor); this.store.set(s.store); this.vy.set(s.vy); this.life.set(s.life); this.shade.set(s.shade);
      this.bodies = s.bodies.map((b) => Object.assign({}, b, { trail: [], log: [] }));
      this.selected = null; this.fq = []; this.flyers = [];
      if (s.probe) this.setProbe(s.probe.x, s.probe.y); else this.probe = null;
      this.role = null; this.lit = null; // 전기 회로를 다시 찾는다.
    }

    // ---- 저장/복원 (포함될 사이트에서 서버에 저장할 수 있도록 순수 JSON) ----
    toJSON() {
      this.settleFlyers();
      const enc = (arr) => {
        const u8 = new Uint8Array(arr.buffer);
        let s = '';
        for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192));
        return btoa(s);
      };
      return {
        version: 2, w: this.w, h: this.h, g: this.g, vacuum: this.vacuum, heatBoost: this.heatBoost,
        materials: this.data.defs.map((d) => d.id), mat: enc(this.mat), T: enc(this.T), anchor: enc(this.anchor),
        bodies: this.bodies.map((b) => ({ type: b.type, r: b.r, x: b.x, y: b.y, vx: b.vx, vy: b.vy })),
      };
    }
    fromJSON(o) {
      if (o.version !== 2 || o.w !== this.w || o.h !== this.h) throw new Error('호환되지 않는 저장 데이터입니다.');
      const dec = (s, Type) => {
        const raw = atob(s), u8 = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) u8[i] = raw.charCodeAt(i);
        return new Type(u8.buffer);
      };
      this.reset();
      const mats = dec(o.mat, Uint16Array), temps = dec(o.T, Float32Array), anchors = dec(o.anchor, Uint8Array);
      // 물질 목록이 나중에 바뀌어도 복원되도록 저장된 이름으로 다시 찾는다.
      const remap = o.materials.map((id) => (id in this.data.idOf ? this.data.idOf[id] : this.AIR));
      for (let i = 0; i < mats.length; i++) { this.setCell(i, remap[mats[i]], temps[i]); this.anchor[i] = anchors[i]; if (this.data.state[this.mat[i]] === GAS) this.gas[i] = 1; }
      this.g = o.g; this.vacuum = o.vacuum; this.setHeatBoost(o.heatBoost);
      o.bodies.forEach((b) => this.addBody(b));
    }
  }

  SL.World = World;
})(globalThis.SandLab = globalThis.SandLab || {});
