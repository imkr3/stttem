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
      this.mode = 'normal';
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
      } else if (this.mode === 'density') {
        for (let i = 0; i < n; i++) {
          // 기체(0.1)부터 금속(9000)까지 로그 눈금
          const t = Math.max(0, Math.min(1, (Math.log10(Math.max(0.05, W.effRho(i))) + 1.3) / 5.3));
          px[i] = this.densLut[(t * 255) | 0];
        }
      } else {
        const air = W.AIR, defs = W.data.defs;
        for (let i = 0; i < n; i++) {
          const m = mat[i];
          if (m === air) { px[i] = rgba(16, 21, 27); continue; }
          const c = this.base[m];
          const s = shade[i];
          let r = c[0] + s, g = c[1] + s, b = c[2] + s;
          const flame = defs[m].flame || defs[m].glow; // glow: 열 없이 빛만 내는 물질(화학 발광)
          if (flame) {
            // 불꽃색을 중심으로 밝기만 일렁인다.
            const f = 0.7 + Math.random() * 0.45;
            r = flame[0] * f; g = flame[1] * f; b = flame[2] * f;
          } else if (T[i] > 450) {
            // 흑체 복사처럼 뜨거운 물체가 빛난다.
            const t = Math.min(1, (T[i] - 450) / 1300);
            r = lerp(r, 255, t); g = lerp(g, 90 + 150 * t, t); b = lerp(b, 20 + 120 * t * t, t);
          }
          px[i] = rgba(Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b)));
        }
      }
      this.ctx.putImageData(this.image, 0, 0);
    }
  }

  SL.Renderer = Renderer;
})(globalThis.SandLab = globalThis.SandLab || {});
