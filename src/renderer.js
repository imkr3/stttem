// 격자를 픽셀로 그린다. 보기 모드: normal(일반) / heat(온도) / density(밀도)
(function (SL) {
  'use strict';

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const lerp = (a, b, t) => a + (b - a) * t;

  // 단조롭게 밝아지는 색상표(어두움→밝음)를 256단계로 만든다.
  const ramp = (stops) => {
    const lut = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      const p = i / 255 * (stops.length - 1), n = Math.min(stops.length - 2, Math.floor(p)), t = p - n;
      const a = stops[n], b = stops[n + 1];
      lut[i] = rgba(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t));
    }
    return lut;
  };
  function rgba(r, g, b) { return (255 << 24) | (b << 16) | (g << 8) | r; }

  const HEAT = [[8, 8, 32], [70, 20, 110], [170, 45, 90], [235, 110, 40], [250, 200, 80], [255, 255, 230]];
  const DENS = [[10, 16, 26], [20, 60, 90], [30, 120, 130], [90, 180, 140], [190, 225, 170], [250, 250, 225]];
  SL.HEAT_STOPS = HEAT;
  SL.DENSITY_STOPS = DENS;
  // 압력: 진공(파랑) → 1기압(회색) → 고압(주황·빨강). 로그 눈금 0.01, 0.1, 1, 10, 50기압
  const PRES = [[25, 40, 130], [45, 120, 205], [118, 124, 130], [235, 150, 50], [255, 50, 40]];
  SL.PRESSURE_STOPS = PRES;

  class Renderer {
    constructor(canvas, world) {
      this.canvas = canvas;
      this.world = world;
      canvas.width = world.w; canvas.height = world.h;
      this.ctx = canvas.getContext('2d');
      this.image = this.ctx.createImageData(world.w, world.h);
      this.px = new Uint32Array(this.image.data.buffer);
      this.base = world.data.defs.map((d) => hex(d.color));
      this.heatLut = ramp(HEAT);
      this.densLut = ramp(DENS);
      this.presLut = ramp(PRES);
      this.mode = 'normal';
      // 빛 번짐: 빛나는 칸만 따로 그려 흐리게 겹친다.
      const mk = (w, h) => { const c = (typeof OffscreenCanvas !== 'undefined') ? new OffscreenCanvas(w, h) : Object.assign(document.createElement('canvas'), { width: w, height: h }); return c; };
      this.glowCanvas = mk(world.w, world.h);
      this.glowCtx = this.glowCanvas.getContext('2d');
      this.glowImage = this.glowCtx.createImageData(world.w, world.h);
      this.glowPx = new Uint32Array(this.glowImage.data.buffer);
      this.half = mk(world.w >> 1, world.h >> 1); this.quarter = mk(world.w >> 2, world.h >> 2);
      this.glowCount = 0;
      this.particles = []; // 불티·파편 빛 (칸 단위 좌표)
      this.flashes = [];
      this.shake = 0;
      this.effects = true;
      this.reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // 엔진이 요청한 효과를 입자로 만든다.
    takeFx() {
      const W = this.world;
      for (const e of W.drainFx()) {
        if (this.onFx) this.onFx(e); // 소리 등 화면 밖의 효과
        if (!this.effects) continue;
        if (e.type === 'boom') {
          const big = e.nuke ? 3 : 1;
          this.flashes.push({ x: e.x + 0.5, y: e.y + 0.5, r: e.r * (e.nuke ? 6 : 3), t: 0, max: e.nuke ? 50 : 14, nuke: e.nuke });
          const n = Math.min(90, (10 + e.r * 7) * big);
          for (let k = 0; k < n; k++) {
            const a = Math.random() * Math.PI * 2, sp = (0.4 + Math.random()) * Math.min(5, 0.6 + e.r * 0.35);
            this.spark(e.x + 0.5, e.y + 0.5, Math.cos(a) * sp, Math.sin(a) * sp - 0.4, 18 + Math.random() * 30, Math.random() < 0.5 ? [255, 230, 150] : [255, 150, 60]);
          }
          if (e.r >= 4 && !this.reduceMotion) this.shake = Math.min(8, this.shake + e.r * (e.nuke ? 1.2 : 0.5));
        } else if (e.type === 'spark') {
          const n = 2 + (Math.random() * 3 | 0);
          for (let k = 0; k < n; k++) {
            const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, sp = 0.3 + Math.random() * 0.9;
            this.spark(e.x + 0.5, e.y + 0.5, Math.cos(a) * sp, Math.sin(a) * sp, 10 + Math.random() * 18, e.dust ? [190, 200, 205] : e.hot > 1500 ? [255, 250, 220] : [255, 190, 90]);
          }
        }
      }
    }
    spark(x, y, vx, vy, life, rgb, size) {
      if (this.particles.length > 600) return;
      this.particles.push({ x, y, vx, vy, life, max: life, rgb, size: size || 1 });
    }

    // 덮개 캔버스에 빛 번짐·섬광·불티를 그린다. cell = 한 칸의 픽셀 크기.
    drawFx(ctx, cell) {
      const W = this.world, g = W.g * W.dt * W.dt / W.dx * 0.5;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      if (this.glowCount && this.mode === 'normal' && this.effects && !this.lite) {
        // 빛나는 칸만 담은 작은 그림을 두 번 줄였다가 크게 늘려 흐리게 만든다. 흐림 필터보다 훨씬 가볍다(휴대폰).
        const cw = ctx.canvas.width, ch = ctx.canvas.height;
        ctx.imageSmoothingEnabled = true;
        const hc = this.halfCtx || (this.halfCtx = this.half.getContext('2d')), qc = this.quarterCtx || (this.quarterCtx = this.quarter.getContext('2d'));
        hc.clearRect(0, 0, this.half.width, this.half.height); hc.drawImage(this.glowCanvas, 0, 0, this.half.width, this.half.height);
        qc.clearRect(0, 0, this.quarter.width, this.quarter.height); qc.drawImage(this.half, 0, 0, this.quarter.width, this.quarter.height);
        ctx.globalAlpha = 0.85; ctx.drawImage(this.quarter, 0, 0, cw, ch);
        ctx.globalAlpha = 0.5; ctx.drawImage(this.half, 0, 0, cw, ch);
        ctx.globalAlpha = 1;
      }
      for (const f of this.flashes) {
        const k = 1 - f.t / f.max, R = f.r * cell * (0.6 + 0.6 * f.t / f.max);
        const grd = ctx.createRadialGradient(f.x * cell, f.y * cell, 0, f.x * cell, f.y * cell, R);
        grd.addColorStop(0, `rgba(255,${f.nuke ? 250 : 235},${f.nuke ? 230 : 180},${0.9 * k})`);
        grd.addColorStop(0.4, `rgba(255,170,70,${0.45 * k})`);
        grd.addColorStop(1, 'rgba(255,120,40,0)');
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(f.x * cell, f.y * cell, R, 0, 7); ctx.fill();
        f.t++;
      }
      this.flashes = this.flashes.filter((f) => f.t < f.max);
      const keep = [];
      for (const p of this.particles) {
        p.vy += g * (p.float ? -0.3 : 1); p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0 || p.x < 0 || p.y < 0 || p.x >= W.w || p.y >= W.h) continue;
        const i = (p.y | 0) * W.w + (p.x | 0);
        if (!p.float && W.data.state[W.mat[i]] === 0 && !W.data.defs[W.mat[i]].flame) { if (Math.random() < 0.5) continue; p.vy *= -0.3; p.vx *= 0.5; } // 고체에 닿으면 튕기거나 꺼진다
        const k = p.life / p.max, [r, gg, b] = p.rgb;
        ctx.fillStyle = `rgba(${r},${gg},${b},${Math.min(1, k * 1.5)})`;
        const sz = Math.max(1.2, cell * 0.7 * p.size);
        ctx.fillRect(p.x * cell - sz / 2, p.y * cell - sz / 2, sz, sz);
        keep.push(p);
      }
      this.particles = keep;
      ctx.restore();
      this.shake *= 0.85;
      if (this.shake < 0.3) this.shake = 0;
    }

    draw() {
      const { world: W, px } = this;
      const { mat, T, shade } = W;
      const n = mat.length;
      if (this.mode === 'heat') {
        for (let i = 0; i < n; i++) {
          // 저온 구간이 잘 보이도록 제곱근 눈금을 쓴다. -60~1600°C
          const t = Math.sqrt(Math.max(0, Math.min(1, (T[i] + 60) / 1660)));
          px[i] = this.heatLut[(t * 255) | 0];
        }
      } else if (this.mode === 'pressure') {
        // 기체·액체·가루 칸은 그 칸이 속한 공간의 압력, 벽은 어둡게 그린다.
        const reg = W.pRegions, lab = W.plab, st = W.data.state;
        const cache = new Map();
        for (let i = 0; i < n; i++) {
          const m = mat[i];
          const r = reg && lab ? reg[lab[i]] : null;
          if (!r || (st[m] === 0) || (st[m] === 1 && W.anchor[i])) { const c = this.base[m]; px[i] = rgba(c[0] * 0.25, c[1] * 0.25, c[2] * 0.25); continue; }
          let col = cache.get(r);
          if (col == null) {
            const lp = Math.log10(Math.max(0.01, Math.min(50, r.P)));
            const u = lp <= 1 ? (lp + 2) * 0.25 : 0.75 + (lp - 1) / 0.699 * 0.25;
            col = this.presLut[Math.max(0, Math.min(255, (u * 255) | 0))];
            cache.set(r, col);
          }
          px[i] = st[m] === 3 ? col : (col & 0xff000000) | ((((col >> 16) & 255) * 0.7) << 16) | ((((col >> 8) & 255) * 0.7) << 8) | ((col & 255) * 0.7);
        }
      } else if (this.mode === 'density') {
        for (let i = 0; i < n; i++) {
          // 기체(0.1)부터 금속(9000)까지 로그 눈금
          const t = Math.max(0, Math.min(1, (Math.log10(Math.max(0.05, W.effRho(i))) + 1.3) / 5.3));
          px[i] = this.densLut[(t * 255) | 0];
        }
      } else {
        const air = W.AIR, defs = W.data.defs, st = W.data.state, w = W.w, gp = this.glowPx;
        let glow = 0;
        const lite = this.lite || !this.effects;
        if (this.glowCount) gp.fill(0);
        for (let i = 0; i < n; i++) {
          const m = mat[i];
          if (m === air) { px[i] = rgba(16, 21, 27); continue; }
          // 액체 속의 기체 칸은 밝은 거품으로 그린다(위나 아래가 액체이면).
          if (st[m] === 3 && !defs[m].flame) {
            const up = i >= w ? mat[i - w] : -1, dn = i + w < n ? mat[i + w] : -1;
            const liq = up >= 0 && st[up] === 2 ? up : dn >= 0 && st[dn] === 2 ? dn : -1;
            if (liq >= 0) {
              const c = this.base[liq];
              // 밝은 액체에서는 어둡게, 어두운 액체에서는 밝게 그려 어떤 용액에서도 거품이 보이게 한다.
              const light = c[0] * 0.3 + c[1] * 0.55 + c[2] * 0.15 > 150;
              px[i] = light ? rgba(c[0] * 0.55, c[1] * 0.55, c[2] * 0.6) : rgba(c[0] * 0.35 + 165, c[1] * 0.35 + 165, c[2] * 0.35 + 165);
              continue;
            }
          }
          const c = this.base[m];
          const s = shade[i];
          let r = c[0] + s, g = c[1] + s, b = c[2] + s;
          const flame = defs[m].flame || defs[m].glow; // glow: 열 없이 빛만 내는 물질(화학 발광)
          if (flame) {
            // 불꽃색을 중심으로 밝기만 일렁인다.
            const f = 0.7 + Math.random() * 0.45;
            r = flame[0] * f; g = flame[1] * f; b = flame[2] * f;
            gp[i] = rgba(r * 0.8, g * 0.8, b * 0.8); glow++;
            // 불꽃 위로 가끔 불티가 날린다.
            if (defs[m].flame && !lite && Math.random() < 0.0025 && i >= w && mat[i - w] !== m) {
              this.particles.length < 400 && this.particles.push({ x: i % w + Math.random(), y: (i / w | 0), vx: (Math.random() - 0.5) * 0.15, vy: -0.25 - Math.random() * 0.3, life: 25 + Math.random() * 35, max: 60, rgb: [255, 170 + (Math.random() * 60 | 0), 70], size: 0.7, float: true });
            }
          } else if (T[i] > 450) {
            // 흑체 복사처럼 뜨거운 물체가 빛난다.
            const t = Math.min(1, (T[i] - 450) / 1300);
            r = lerp(r, 255, t); g = lerp(g, 90 + 150 * t, t); b = lerp(b, 20 + 120 * t * t, t);
            if (t > 0.15) { gp[i] = rgba(255 * t, (90 + 150 * t) * t * 0.8, (20 + 120 * t * t) * t * 0.6); glow++; }
          }
          px[i] = rgba(Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b)));
        }
        this.glowCount = glow;
        if (glow) this.glowCtx.putImageData(this.glowImage, 0, 0);
      }
      // 날아가는 칸(파편·물보라)
      for (const f of W.flyers) {
        const x = f.x | 0, y = f.y | 0;
        if (x < 0 || y < 0 || x >= W.w || y >= W.h) continue;
        const c = this.base[f.m], s = f.shade;
        px[y * W.w + x] = this.mode === 'heat' ? this.heatLut[(Math.sqrt(Math.max(0, Math.min(1, (f.T + 60) / 1660))) * 255) | 0]
          : f.T > 450 ? rgba(255, Math.min(255, 120 + f.T / 10), 80) : rgba(Math.max(0, Math.min(255, c[0] + s)), Math.max(0, Math.min(255, c[1] + s)), Math.max(0, Math.min(255, c[2] + s)));
      }
      this.ctx.putImageData(this.image, 0, 0);
      this.takeFx();
    }
  }

  SL.Renderer = Renderer;
})(globalThis.SandLab = globalThis.SandLab || {});
