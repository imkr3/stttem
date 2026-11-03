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
    const compileEdge = (e) => e && { at: e.at, L: e.L, to: resolve(e.to), silent: !!e.silent, cast: !!e.cast };
    const c = {
      n, idOf, defs: materials, resolve,
      state: new Uint8Array(n), rho: new Float32Array(n), cp: new Float32Array(n),
      heatCap: new Float32Array(n), k: new Float32Array(n), flow: new Uint8Array(n),
      fixed: new Uint8Array(n), lifetime: new Uint16Array(n), t0: new Float32Array(n), rise: new Float32Array(n), misc: new Uint8Array(n),
      up: [], down: [], decay: [], explicit: new Map(), cache: new Map(), reactive: new Uint8Array(n), base: new Uint16Array(n),
      fast: new Float32Array(n), thermal: new Float32Array(n), spont: new Float32Array(n), emitter: new Uint8Array(n),
      moder: new Uint8Array(n), absorb: new Float32Array(n), heat: new Float32Array(n), armor: new Uint8Array(n),
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
    });
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
      this.reset();
    }

    reset() {
      this.tick = 0; this.time = 0; this.fq = []; this.slowAvg = 0;
      this.bodies = []; this.selected = null; this.probe = null; this.nextBodyId = 1;
      for (let i = 0; i < this.mat.length; i++) this.setCell(i, this.AIR, this.ambient);
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
      this.mat[i] = m;
      this.T[i] = T;
      this.store[i] = 0;
      this.vy[i] = 0;
      this.anchor[i] = 0;
      const lt = this.data.lifetime[m];
      this.life[i] = lt ? lt * (0.6 + 0.8 * Math.random()) : 0;
      this.shade[i] = (Math.random() * 25 - 12) | 0;
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
      this.stamp[i] = this.stamp[j] = this.tick;
    }

    effRho(i) {
      const m = this.mat[i], s = this.data.state[m], r = this.data.rho[m];
      if (s === GAS) return r * 293 / (Math.max(this.T[i], -200) + 273); // 이상 기체
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
        if (anchored) this.anchor[i] = 1;
      }
    }

    // ---- 한 틱 ----
    step() {
      this.tick++;
      this.time += this.dt;
      this.boomBudget = 40;
      this.stepMotion();
      this.stepHeat();
      this.stepNuclear();
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
      if (sj === GAS) return si === GAS ? Math.min(1, 1.2 * (ri - rj) / (ri + rj)) * gs * d.rise[mj] : 1;
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
        if (this.data.state[this.mat[cur]] === LIQUID) v = Math.min(v, 1.5); // 액체 속에서는 끌림
        cur = below; cy++;
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

    phase(i, m) {
      const d = this.data, T = this.T, c = d.cp[m], up = d.up[m], down = d.down[m];
      if (up && T[i] > up.at) {
        this.store[i] += (T[i] - up.at) * c;
        T[i] = up.at;
        if (this.store[i] >= up.L) this.transform(i, m, up);
      } else if (down && T[i] < down.at) {
        this.store[i] -= (down.at - T[i]) * c;
        T[i] = down.at;
        if (-this.store[i] >= down.L) this.transform(i, m, down);
      } else if (this.store[i] > 0 && up && T[i] < up.at) {
        const give = Math.min(this.store[i], (up.at - T[i]) * c); // 다시 식으면 잠열을 돌려준다.
        this.store[i] -= give; T[i] += give / c;
      } else if (this.store[i] < 0 && down && T[i] > down.at) {
        const give = Math.min(-this.store[i], (T[i] - down.at) * c);
        this.store[i] += give; T[i] -= give / c;
      }
    }

    transform(i, m, edge) {
      const T = edge.at, id = pick(edge.to);
      this.setCell(i, id, T);
      if (edge.cast) this.anchor[i] = 1; // 쇳물이나 용암은 굳은 자리에 그대로 남는다.
      if (edge.silent) return;
      this.note('phase:' + m + ':' + id, () => ({
        type: 'phase', id: 'phase:' + this.data.defs[m].id + ':' + this.data.defs[id].id,
        name: this.data.defs[m].name + ' → ' + this.data.defs[id].name,
        eq: T + '°C에서 상태 변화', kind: 'physical', note: '상변화가 끝날 때까지 온도가 일정하게 유지됩니다.',
      }));
    }

    react(i, j, list) {
      const T = this.T, hi = Math.max(T[i], T[j]);
      for (const e of list) {
        const r = e.r;
        if (r.minT != null && hi < r.minT) continue;
        if (r.maxT != null && hi > r.maxT) continue; // 낮은 온도에서만 일어나는 반응(수화, 부동태)
        if (Math.random() > r.prob) continue;
        if (e.near && !this.hasNear(i, e.near) && !this.hasNear(j, e.near)) continue;
        if (e.far && (this.hasNear(i, e.far) || this.hasNear(j, e.far))) continue; // 이 물질이 옆에 있으면 일어나지 않음
        const dT = r.dT || 0;
        const apply = (cell, to) => {
          let t = T[cell] + dT;
          if (r.T != null) t = Math.max(t, r.T);
          if (to == null) { if (!this.data.fixed[this.mat[cell]]) T[cell] = t; return; }
          this.setCell(cell, pick(to), t);
        };
        apply(i, e.toSelf);
        apply(j, e.toOther);
        if (r.explode && (r.explodeP == null || Math.random() < r.explodeP)) this.explode(j, r.explode, r.T != null ? Math.max(r.T, 1500) : 1500);
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
      const fire = fallout && d.idOf.fireball != null ? d.idOf.fireball : d.idOf.fire, ash = d.idOf.fallout;
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
          } else if (Tm[i] < heat) Tm[i] = heat;
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
            if (to >= 0) this.swap(i, to);
          }
        }
      }
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
        p.log.push({ t: this.time, T: this.T[this.index(p.x, p.y)], m: this.mat[this.index(p.x, p.y)] });
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
      return { def, T: this.T[i], rho: this.effRho(i) };
    }

    // ---- 저장/복원 (포함될 사이트에서 서버에 저장할 수 있도록 순수 JSON) ----
    toJSON() {
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
      for (let i = 0; i < mats.length; i++) { this.setCell(i, remap[mats[i]], temps[i]); this.anchor[i] = anchors[i]; }
      this.g = o.g; this.vacuum = o.vacuum; this.setHeatBoost(o.heatBoost);
      o.bodies.forEach((b) => this.addBody(b));
    }
  }

  SL.World = World;
})(globalThis.SandLab = globalThis.SandLab || {});
