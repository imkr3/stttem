// 반응 규칙.
// - REACTIONS: 특정 물질끼리의 반응 표. 한 줄 추가로 확장한다.
// - rulesFor: 반응성 계열과 용해도 규칙으로 계산하는 일반 규칙. 두 물질이 처음 만날 때 한 번만 계산한다.
// 한 칸의 결과는 두 칸 안에서 표현하므로, 화학식의 몰 비까지 칸 수로 지키지는 않는다. 화학식 표시는 항상 균형을 맞춘다.
// toA, toB: 결과(null이면 그대로, 배열이면 확률 선택) / prob: 틱당 확률 / minT: 둘 중 높은 온도 조건
// dT: 생성물 온도 변화 / T: 생성물 최저 온도 / near: 옆에 이 물질이 있어야 일어남
(function (SL) {
  'use strict';

  const OX = ['air', 'O:g'];
  const SALTS = SL.SALTS;
  const salt = (c, a) => (SALTS[c] && SALTS[c][a]) || null;
  const solidOf = (e) => e && (e.solid || e.aq);
  const formOf = (e) => e && (e.aq || e.solid); // 물속에서의 형태

  // 금속 반응성 계열(앞일수록 활발). H는 산에서 수소를 내는 기준.
  const SERIES = 'Cs Rb K Ba Sr Ca Na Li La Ce Pr Nd Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Sc Y Mg Be Al Ti Zr Mn Zn Cr Ga Fe Cd In Co Ni Sn Pb H Sb Bi Cu Hg Ag Pd Pt Au'.split(' ');
  const rank = (el) => { const i = SERIES.indexOf(el); return i < 0 ? -1 : i; };
  const H_RANK = rank('H');

  // cat: 산과 염에서의 이온, ox: 산화물의 이온, ign: 발화 온도, burn: 불꽃을 내며 탐, tarnish: 상온에서 서서히 산화, flame: 불꽃색
  const METALS = {
    Cs: { cat: 'Cs', ox: 'Cs', ign: 20, burn: 1, flame: 'Cs' }, Rb: { cat: 'Rb', ox: 'Rb', ign: 20, burn: 1, flame: 'Rb' }, K: { cat: 'K', ox: 'K', ign: 70, burn: 1, tarnish: 0.002, flame: 'K' }, Na: { cat: 'Na', ox: 'Na', ign: 125, burn: 1, tarnish: 0.001, flame: 'Na' }, Li: { cat: 'Li', ox: 'Li', ign: 180, burn: 1, tarnish: 0.0003, flame: 'Li' },
    Ba: { cat: 'Ba', ox: 'Ba', ign: 200, burn: 1, tarnish: 0.0005, flame: 'Ba' }, Sr: { cat: 'Sr', ox: 'Sr', ign: 300, burn: 1, tarnish: 0.0003, flame: 'Sr' }, Ca: { cat: 'Ca', ox: 'Ca', ign: 300, burn: 1, tarnish: 0.0002, flame: 'Ca' }, Mg: { cat: 'Mg', ox: 'Mg', ign: 470, burn: 1, flame: 'Mg', T: 2300 }, Be: { cat: 'Be', ox: 'Be', ign: 800, burn: 1, T: 2000 },
    Al: { cat: 'Al', ox: 'Al', ign: 650, burn: 1, flame: 'Mg', T: 2500 }, Ti: { cat: 'Ti4', ox: 'Ti4', ign: 1200, burn: 1, flame: 'Mg', T: 2500 }, Zr: { cat: 'Zr4', ox: 'Zr4', ign: 400, burn: 1, flame: 'Mg', T: 2500 }, Hf: { cat: 'Hf4', ox: 'Hf4', ign: 800, burn: 1, T: 2300 },
    Zn: { cat: 'Zn', ox: 'Zn', ign: 460, burn: 1, T: 1500 }, Fe: { cat: 'Fe2', ox: 'Fe3', ign: 800, burn: 1, T: 1500 }, Mn: { cat: 'Mn2', ox: 'Mn4', ign: 800, burn: 0 }, Cr: { cat: 'Cr3', ox: 'Cr3', ign: 1000, burn: 0 }, Co: { cat: 'Co2', ox: 'Co2', ign: 700, burn: 0 }, Ni: { cat: 'Ni2', ox: 'Ni2', ign: 800, burn: 0 },
    Cu: { cat: 'Cu2', ox: 'Cu2', ign: 300, burn: 0 }, Sn: { cat: 'Sn2', ox: 'Sn2', ign: 400, burn: 0 }, Pb: { cat: 'Pb2', ox: 'Pb2', ign: 400, burn: 0 }, Cd: { cat: 'Cd', ox: 'Cd', ign: 400, burn: 0 }, Hg: { cat: 'Hg2', ox: 'Hg2', ign: 350, burn: 0 }, Bi: { cat: 'Bi3', ox: 'Bi3', ign: 500, burn: 0 }, Sb: { cat: 'Sb3', ox: 'Sb3', ign: 500, burn: 0 },
    In: { cat: 'In3', ox: 'In3', ign: 800, burn: 0 }, Ga: { cat: 'Ga3', ox: 'Ga3', ign: 800, burn: 0 }, Tl: { cat: 'Tl', ox: 'Tl', ign: 500, burn: 0 }, Ag: { cat: 'Ag', noox: 1 }, Pd: { cat: 'Pd2', ox: 'Pd2', ign: 800, burn: 0 }, Au: { noox: 1 },
    Ge: { ox: 'Ge4', ign: 700, burn: 0 }, V: { ox: 'V5', ign: 700, burn: 0 }, Mo: { ox: 'Mo6', ign: 600, burn: 0 }, W: { ox: 'W6', ign: 500, burn: 0 }, Nb: { ox: 'Nb5', ign: 600, burn: 0 }, Ta: { ox: 'Ta5', ign: 600, burn: 0 }, Th: { ox: 'Th4', ign: 400, burn: 1, T: 2500, flame: 'Mg' }, U: { ox: 'U6', ign: 300, burn: 1, T: 1800 },
  };
  for (const r of ['Sc', 'Y', 'La', 'Ce', 'Pr', 'Nd', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu']) {
    METALS[r] = { cat: r + '3', ox: r + '3', ign: 300, burn: 1, T: 2000, flame: 'Mg', tarnish: 0.0002 };
  }
  // 차가운 물과 반응하는 금속: 확률, 발열
  const WATER_METALS = { Cs: [0.6, 1100], Rb: [0.5, 1000], K: [0.4, 800], Na: [0.15, 550], Li: [0.06, 150], Ba: [0.2, 200], Sr: [0.15, 150], Ca: [0.08, 120], La: [0.01, 30], Ce: [0.01, 30] };
  const ACTIVE_OXIDES = new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'Ca', 'Sr', 'Ba', 'Mg']);
  // 뜨거워지면 분해되는 온도. 없으면 안정.
  const DECOMP = {
    CO3: { Mg: 350, Ca: 825, Sr: 1100, Ba: 1300, Li: 1300, Cu2: 200, Zn: 300, Pb2: 315, Fe2: 300, Mn2: 400, Co2: 400, Ni2: 400, Cd: 350, Ag: 200, NH4: 60, def: 500 },
    HCO3: { Na: 150, K: 100, NH4: 40 },
    OH: { Ca: 512, Mg: 350, Cu2: 100, Fe2: 150, Fe3: 200, Al: 300, Zn: 125, Ni2: 230, Co2: 170, Cr3: 300, Pb2: 145, Mn2: 300, Cd: 200, Sr: 700, Ba: 780, Be: 400, def: 300 },
    NO3: { Mg: 330, Ca: 561, Sr: 570, Ba: 592, Al: 150, Fe3: 125, Fe2: 100, Cu2: 170, Zn: 110, Pb2: 290, Ag: 444, Ni2: 110, Co2: 100, Mn2: 140, Cd: 300, Hg2: 200, Cr3: 100, Sn2: 150 },
    SO4: { Cu2: 650, Fe2: 480, Fe3: 480, Al: 770, Zn: 680, Pb2: 1000, Mn2: 850, Ni2: 840, Co2: 735, Cd: 1000 },
  };
  const DECOMP_GAS = { CO3: ['CO2', 'CO2'], HCO3: ['CO2', 'CO2'], OH: ['H2O:g', 'H2O'], NO3: ['NO2', 'NO2'], SO4: ['SO3', 'SO3'] };
  const NOBLE_OXIDES = { Ag2O: 300, HgO: 500, Au2O3: 160, PdO: 750 };
  const HALOGEN_ORDER = ['F', 'Cl', 'Br', 'I'];
  const OXIDES_TO_ACID = { SO3: 'H2SO4aq', SO2: 'H2SO3', NO2: 'HNO3aq', CO2: 'H2CO3' };

  const isOx = (d) => d.id === 'air' || d.id === 'O:g' || d.id === 'O:l';
  const isWater = (d) => d.id === 'H2O:l';
  const metalInfo = (d) => (d.metal && d.state !== 'gas' ? METALS[d.metal] : null);
  const flameId = (k) => (k ? 'fire:' + k : 'fire');
  const dFx = (d) => d.fx;

  function R(id, name, reactants, products, o) {
    return Object.assign({ id, name, reactants, products }, o);
  }

  // 일반 규칙. A가 첫 번째 칸, B가 두 번째 칸이다. 엔진이 순서를 바꿔 두 번 부른다.
  function rulesFor(A, B) {
    const out = [];
    const m = metalInfo(A);
    const elA = A.metal;

    // 연료의 연소
    if (A.fuel && isOx(B)) {
      const f = A.fuel;
      out.push(R('burn:' + (A.sp || A.id), A.name + '의 연소', [dFx(A), 'O2'], f.prods, { kind: 'chemical', a: A.id, minT: f.ign, prob: f.prob * (B.id === 'air' ? 1 : 3), toA: 'fire', toB: 'fire', T: f.T, note: '산소가 있어야 탑니다.' }));
    }
    if ((A.fuel || (m && m.burn)) && B.flame) {
      const ign = A.fuel ? A.fuel.ign : m.ign;
      out.push(R('ignite:' + (A.sp || A.id), A.name + '의 발화', [], [], { silent: true, prob: 0.5, T: ign + 50 }));
    }

    // 금속 + 산소
    if (m && isOx(B) && !m.noox && m.ox) {
      const oxide = salt(m.ox, 'O');
      if (oxide) {
        const flame = flameId(m.flame);
        const prods = [oxide.fx];
        if (m.burn) out.push(R('ox:' + elA, A.name + '의 연소', [elA, 'O2'], prods, { minT: m.ign, prob: B.id === 'air' ? 0.1 : 0.3, toA: oxide.solid, toB: flame, T: m.T || 1400, note: '금속이 산소와 결합하며 빛과 열을 냅니다.' }));
        else out.push(R('ox:' + elA, A.name + '의 산화', [elA, 'O2'], prods, { minT: m.ign, prob: 0.005, toA: oxide.solid, note: '가열된 표면이 산화물로 변합니다.' }));
        if (m.tarnish) out.push(R('tarnish:' + elA, A.name + '의 공기 중 산화', [elA, 'O2'], prods, { prob: m.tarnish, toA: oxide.solid, note: '공기만 닿아도 표면이 변합니다.' }));
      }
    }

    // 금속 + 물
    if (m && isWater(B) && WATER_METALS[elA] && m.cat) {
      const [prob, dT] = WATER_METALS[elA];
      const hyd = salt(m.cat, 'OH');
      if (hyd) out.push(R('water:' + elA, A.name + '과 물', [elA, 'H2O'], [hyd.fx, 'H2'], { prob, toA: formOf(hyd), toB: 'H:g', dT, note: dT > 400 ? '격렬한 발열 반응입니다. 뜨거운 수소에 불이 붙습니다.' : '수소 거품이 올라옵니다.' }));
    }
    if (m && elA === 'Mg' && isWater(B)) {
      out.push(R('water:Mg', '마그네슘과 뜨거운 물', ['Mg', 'H2O'], ['Mg(OH)2', 'H2'], { minT: 70, prob: 0.01, toA: 'S:Mg(OH)2', toB: 'H:g', dT: 30, note: '찬물에서는 거의 반응하지 않고 뜨거운 물과 반응합니다.' }));
    }

    // 금속 + 산
    if (m && B.acid && m.cat) {
      const a = B.acid.a, r = rank(elA);
      const oxidizing = a === 'NO3';
      const sal = salt(m.cat, a);
      if (sal && r >= 0) {
        if (oxidizing && (B.acid.conc || B.acid.strength) && elA !== 'Au' && elA !== 'Pd') {
          const nox = B.acid.conc ? 'NO2' : 'NO';
          out.push(R('hno3:' + elA + ':' + nox, A.name + '과 질산', [elA, 'HNO3'], [sal.fx, nox, 'H2O'], { prob: B.acid.conc ? 0.2 : 0.06, toA: formOf(sal), toB: nox, dT: 40, note: '질산은 수소 대신 질소 산화물을 냅니다. 구리도 녹입니다.' }));
        } else if (B.acid.a === 'SO4' && B.acid.conc && r > H_RANK && elA !== 'Au') {
          out.push(R('h2so4c:' + elA, A.name + '과 진한 황산', [elA, 'H2SO4'], [sal.fx, 'SO2', 'H2O'], { minT: 100, prob: 0.1, toA: formOf(sal), toB: 'SO2', dT: 30, note: '가열하면 이산화황이 생깁니다.' }));
        } else if (r < H_RANK && !oxidizing) {
          const pace = Math.max(0.005, 0.5 * (1 - r / H_RANK)) * (B.acid.strength || 0.9);
          const insoluble = !sal.aq;
          out.push(R('acid:' + elA + ':' + a, A.name + '과 ' + B.name, [elA, B.fx], [sal.fx, 'H2'], { prob: insoluble ? pace * 0.1 : pace, toA: formOf(sal), toB: 'H:g', dT: 25 + 60 * (1 - r / H_RANK), note: '수소보다 활발한 금속이 산에 녹으며 수소를 냅니다.' + (insoluble ? ' 생성물이 물에 녹지 않아 표면을 덮어 느려집니다.' : '') }));
        }
      }
    }

    // 금속 + 다른 금속 이온 (치환)
    if (m && m.cat && B.aq && B.salt && !WATER_METALS[elA] && SL.CATION[B.salt.c] && SL.CATION[B.salt.c].el) {
      const el2 = SL.CATION[B.salt.c].el;
      const r1 = rank(elA), r2 = rank(el2);
      const newSalt = salt(m.cat, B.salt.a);
      if (r1 >= 0 && r2 >= 0 && r1 < r2 && el2 !== elA && newSalt && B.salt.a !== 'OH') {
        out.push(R('displace:' + elA + ':' + B.salt.c + ':' + B.salt.a, A.name + '의 금속 치환', [elA, B.fx], [newSalt.fx, el2], { prob: 0.06, toA: formOf(newSalt), toB: el2 + ':s', dT: 5, note: `${A.name}이(가) ${SL.CATION[B.salt.c].name}보다 반응성이 커서 금속이 석출됩니다.` }));
      }
    }

    // 금속 + 할로젠
    if (m && m.cat && B.el && HALOGEN_ORDER.includes(B.el)) {
      const hal = salt(m.cat === 'Fe2' ? 'Fe3' : m.cat, B.el);
      if (hal) {
        const fierce = { F: 0.6, Cl: 0.3, Br: 0.15, I: 0.03 }[B.el];
        const mult = rank(elA) >= 0 && rank(elA) < H_RANK ? 1 : 0.3;
        out.push(R('hal:' + elA + ':' + B.el, A.name + '과 ' + B.name, [elA, B.fx], [hal.fx], { prob: fierce * mult, minT: B.el === 'I' ? 100 : undefined, toA: hal.solid || hal.aq, toB: m.flame ? flameId(m.flame) : 'air', dT: 500, note: '금속과 할로젠이 직접 결합해 염을 만듭니다.' }));
      }
    }

    // 금속 + 황
    if (m && m.cat && (B.sp === 'S')) {
      const sul = salt(m.cat, 'S');
      if (sul && sul.solid) out.push(R('sulfide:' + elA, A.name + '과 황', [elA, 'S'], [sul.fx], { minT: 250, prob: 0.15, toA: sul.solid, toB: 'air', dT: 300, note: '가열하면 빛을 내며 황화물이 됩니다.' }));
    }

    // 끓는점이 상온보다 낮은 물질은 공기에 닿은 면부터 빠르게 기화한다(액체 질소, 드라이아이스).
    if (B.id === 'air' && A.bp != null && A.bp < 15 && A.state !== 'gas' && A.sp) {
      out.push(R('boiloff:' + A.sp, A.name + '의 기화', [], [], { kind: 'physical', eq: `${A.formula} → 기체 (${A.bp}°C)`, prob: 0.04, minT: A.bp, toA: A.sp + ':g', T: A.bp + 2, note: '상온의 공기가 끓는점보다 훨씬 뜨거워서 빠르게 기체가 됩니다.' }));
    }

    // 고체의 용해
    if (A.salt && A.state === 'powder' && isWater(B)) {
      const e = salt(A.salt.c, A.salt.a);
      if (e && e.aq) out.push(R('dissolve:' + A.fx, A.name + '의 용해', [A.fx], [A.fx], { kind: 'physical', eq: `${A.formula}(s) → ${A.formula}(aq)`, prob: 0.05, toA: e.aq, toB: e.aq, dT: A.dHsol || 0, note: A.dHsol > 10 ? '녹으면서 열을 냅니다.' : A.dHsol < -10 ? '녹으면서 주변이 차가워집니다.' : '물에 녹아 용액이 됩니다.' }));
    }

    // 산 + 염기, 탄산염, 금속 산화물, 황화물
    if (A.acid && B.salt) {
      const { c, a } = B.salt;
      const e = salt(c, A.acid.a);
      const eProd = e ? formOf(e) : null;
      const pace = 0.3 * Math.max(0.3, A.acid.strength || 0.9);
      if (a === 'OH' && eProd) {
        out.push(R('neutral:' + A.fx + ':' + B.fx, '중화: ' + A.name + '과 ' + B.name, [A.fx, B.fx], [e.fx, 'H2O'], { prob: pace, toA: eProd, toB: 'H2O:l', dT: 45, note: '산과 염기가 만나 염과 물이 되고 열이 납니다.' }));
      } else if ((a === 'CO3' || a === 'HCO3') && eProd && A.acid.a !== 'CO3') {
        out.push(R('carbonate:' + A.fx + ':' + B.fx, A.name + '과 ' + B.name, [A.fx, B.fx], [e.fx, 'CO2', 'H2O'], { prob: pace * 0.7, toA: eProd, toB: 'CO2', dT: 5, note: '이산화탄소 거품이 발생합니다.' }));
      } else if (a === 'O' && eProd) {
        out.push(R('oxide-acid:' + A.fx + ':' + B.fx, A.name + '과 ' + B.name, [A.fx, B.fx], [e.fx, 'H2O'], { prob: pace * 0.3, toA: eProd, toB: 'H2O:l', dT: 25, note: '금속 산화물은 산에 녹아 염과 물이 됩니다.' }));
      } else if (a === 'S' && eProd) {
        out.push(R('sulfide-acid:' + A.fx + ':' + B.fx, A.name + '과 ' + B.name, [A.fx, B.fx], [e.fx, 'H2S'], { prob: pace * 0.5, toA: eProd, toB: 'H2S', note: '달걀 썩는 냄새의 황화수소가 납니다.' }));
      }
    }

    // 앙금 생성: 두 용액의 이온이 만나 물에 안 녹는 염을 만든다.
    if (A.aq && B.aq && A.salt && B.salt && A.id < B.id) {
      const { c: c1, a: a1 } = A.salt, { c: c2, a: a2 } = B.salt;
      if (c1 !== c2 && a1 !== a2) {
        const fallback = (c, a) => salt(c, a) || (a === 'OH' ? salt(c, 'O') : null);
        const p1 = fallback(c1, a2), p2 = fallback(c2, a1);
        const ins1 = p1 && !p1.aq, ins2 = p2 && !p2.aq;
        if ((ins1 || ins2) && p1 && p2) {
          const names = [ins1 && p1.fx, ins2 && p2.fx].filter(Boolean).map(SL.prettyFormula).join(', ');
          // 수산화물 대신 산화물이 생기는 금속은 물도 함께 나온다.
          const products = [p1.fx, p2.fx].concat(!salt(c1, a2) || !salt(c2, a1) ? ['H2O'] : []);
          out.push(R('precip:' + A.fx + ':' + B.fx, names + ' 앙금', [A.fx, B.fx], products, { prob: 0.5, toA: formOf(p1), toB: formOf(p2), note: '두 용액의 이온이 만나 물에 녹지 않는 고체가 가라앉습니다.' }));
        }
      }
      // 암모늄 염 + 강염기 → 암모니아
    }
    if (A.aq && B.base && A.salt && A.salt.c === 'NH4' && A.salt.a !== 'OH' && B.salt && B.salt.c !== 'NH4') {
      const p = salt(B.salt.c, A.salt.a);
      if (p) out.push(R('nh4:' + A.fx + ':' + B.fx, '암모니아 발생', [A.fx, B.fx], [p.fx, 'NH3', 'H2O'], { prob: 0.2, toA: formOf(p), toB: 'NH3', note: '암모늄 염이 강염기를 만나 암모니아를 냅니다.' }));
    }

    // 활성 금속 산화물 + 물 → 수산화물
    if (A.salt && A.salt.a === 'O' && isWater(B) && ACTIVE_OXIDES.has(A.salt.c)) {
      const h = salt(A.salt.c, 'OH');
      const slow = A.salt.c === 'Mg';
      if (h) out.push(R('oxide-water:' + A.fx, A.name + '과 물', [A.fx, 'H2O'], [h.fx], { prob: slow ? 0.003 : 0.08, toA: formOf(h), dT: slow ? 5 : 150, note: '발열이 커서 물이 끓기도 합니다.' }));
    }

    // 비금속 산화물 + 물 → 산
    if (OXIDES_TO_ACID[A.sp] && A.state === 'gas' && isWater(B)) {
      const acidId = 'A:acid:' + OXIDES_TO_ACID[A.sp];
      const def = SL.MATERIALS.find((d) => d.id === acidId);
      out.push(R('oxide-acid-water:' + A.sp, A.name + '이(가) 물에 녹음', [A.fx, 'H2O'], A.sp === 'NO2' ? ['HNO3', 'NO'] : [def.fx], { prob: A.sp === 'CO2' ? 0.02 : 0.2, toA: 'H2O:l', toB: acidId, note: '비금속 산화물이 물에 녹으면 산이 됩니다.' }));
    }

    // CO2 + 염기 용액 → 탄산염 (석회수)
    if (A.sp === 'CO2' && A.state === 'gas' && B.aq && B.salt && B.salt.a === 'OH') {
      const carb = salt(B.salt.c, 'CO3');
      if (carb) out.push(R('co2-base:' + B.fx, '이산화탄소와 ' + B.name, ['CO2', B.fx], [carb.fx, 'H2O'], { prob: 0.15, toA: 'H2O:l', toB: formOf(carb), note: B.salt.c === 'Ca' ? '석회수가 뿌옇게 흐려집니다.' : '이산화탄소를 흡수합니다.' }));
    }

    // 할로젠 치환: 더 활발한 할로젠이 약한 할로젠을 밀어낸다.
    if (B.aq && B.salt && A.el && HALOGEN_ORDER.includes(A.el) && HALOGEN_ORDER.includes(B.salt.a)) {
      const hi = HALOGEN_ORDER.indexOf(A.el), lo = HALOGEN_ORDER.indexOf(B.salt.a);
      const prod = salt(B.salt.c, A.el);
      if (hi < lo && prod && A.state !== 'powder') {
        out.push(R('halogen:' + A.el + ':' + B.fx, A.name + '의 할로젠 치환', [A.fx, B.fx], [prod.fx, SL.MATERIALS.find((d) => d.id === B.salt.a + ':s').fx], { prob: 0.3, toA: B.salt.a, toB: formOf(prod), note: '반응성이 큰 할로젠이 약한 할로젠을 밀어냅니다.' }));
      }
    }

    // 열분해. 기체가 빠져나갈 공기 칸이 있어야 한다.
    if (A.salt && A.state === 'powder' && B.id === 'air' && DECOMP[A.salt.a]) {
      const table = DECOMP[A.salt.a];
      const at = table[A.salt.c] != null ? table[A.salt.c] : table.def;
      const e = salt(A.salt.c, 'O');
      const product = A.salt.a === 'HCO3' ? salt(A.salt.c, 'CO3') : e;
      const [gasId, gasFx] = DECOMP_GAS[A.salt.a];
      if (at != null && (product || A.salt.c === 'NH4' || A.salt.c === 'Ag')) {
        if (A.salt.c === 'NH4') {
          out.push(R('decomp:' + A.fx, A.name + '의 열분해', [A.fx], ['NH3', gasFx, 'H2O'], { minT: at, prob: 0.05, toA: 'NH3', toB: gasId, note: '가열하면 암모니아와 기체로 분해됩니다.' }));
        } else if (A.salt.c === 'Ag' && A.salt.a === 'NO3') {
          out.push(R('decomp:' + A.fx, A.name + '의 열분해', [A.fx], ['Ag', gasFx, 'O2'], { minT: at, prob: 0.05, toA: 'Ag:s', toB: gasId, note: '은 이온은 금속으로 돌아갑니다.' }));
        } else if (product) {
          const extra = A.salt.a === 'NO3' ? ['O2'] : A.salt.a === 'HCO3' ? ['H2O'] : [];
          out.push(R('decomp:' + A.fx, A.name + '의 열분해', [A.fx], [product.fx, gasFx].concat(extra), { minT: at, prob: 0.05, toA: product.solid, toB: gasId, note: '가열하면 분해되어 기체가 나옵니다.' }));
        }
      }
    }
    if (A.salt && A.state === 'powder' && B.id === 'air' && NOBLE_OXIDES[A.fx]) {
      out.push(R('decomp:' + A.fx, A.name + '의 열분해', [A.fx], [SL.CATION[A.salt.c].el, 'O2'], { minT: NOBLE_OXIDES[A.fx], prob: 0.05, toA: SL.CATION[A.salt.c].el + ':s', toB: 'O:g', note: '반응성이 작은 금속의 산화물은 가열만으로 금속이 됩니다.' }));
    }

    // 금속 제련: 탄소·수소로 산화물 환원
    if (A.sp === 'C' && A.state === 'powder' && B.salt && B.salt.a === 'O' && SL.CATION[B.salt.c].el) {
      const el = SL.CATION[B.salt.c].el, r = rank(el);
      if (r >= rank('Mn') && el !== 'Au') {
        const T = r > H_RANK ? 500 : 800;
        out.push(R('smelt:' + B.fx, B.name + ' 제련', ['C', B.fx], [el, 'CO2'], { minT: T, prob: 0.05, toA: 'CO2', toB: el + ':s', note: '탄소가 산화물에서 산소를 빼앗아 금속을 얻습니다. 용광로의 원리입니다.' }));
      }
    }
    if (A.sp === 'H' && A.state === 'gas' && B.salt && B.salt.a === 'O' && SL.CATION[B.salt.c].el) {
      const el = SL.CATION[B.salt.c].el;
      if (rank(el) >= rank('Fe')) {
        out.push(R('h2-reduce:' + B.fx, '수소로 ' + B.name + ' 환원', ['H2', B.fx], [el, 'H2O'], { minT: 300, prob: 0.1, toA: 'H2O:g', toB: el + ':s', note: '수소가 산소를 빼앗아 금속이 됩니다.' }));
      }
    }

    // 테르밋: 활성이 큰 금속이 산화물의 금속을 환원
    if ((elA === 'Al' || elA === 'Mg') && A.state !== 'gas' && B.salt && B.salt.a === 'O' && SL.CATION[B.salt.c].el) {
      const el = SL.CATION[B.salt.c].el;
      if (rank(el) > rank('Cr') && el !== 'Au') {
        const own = salt(elA, 'O');
        out.push(R('thermite:' + elA + ':' + B.fx, B.name + '의 테르밋 반응', [elA, B.fx], [own.fx, el], { minT: 900, prob: 0.4, toA: own.solid, toB: el + ':s', T: 2500, note: '시작하려면 고온이 필요하지만, 일단 시작되면 쇳물이 나올 만큼 뜨거워집니다.' }));
      }
    }

    // 불꽃 반응
    if (A.salt && B.flame && SL.FLAME_OF_CATION[A.salt.c]) {
      const key = SL.FLAME_OF_CATION[A.salt.c];
      out.push(R('flame:' + key, SL.MATERIALS.find((d) => d.id === key + ':s').name + ' 불꽃 반응', [], [], { kind: 'physical', eq: `${SL.CATION[A.salt.c].name} 이온 → 고유한 불꽃색`, prob: 0.4, toB: flameId(key), note: '금속 이온은 원소마다 고유한 색의 불꽃을 냅니다.' }));
    }

    // 불과 물
    if (A.flame && isWater(B)) out.push(R('fire-water', '물로 불 끄기', [], [], { kind: 'physical', eq: '불꽃 + 물 → 연기 + 수증기', prob: 0.5, toA: 'smoke', toB: 'H2O:g', note: '물이 열을 빼앗아 불이 꺼집니다.' }));

    // 지시약
    if (A.indicator && (B.acid || B.base)) {
      const acid = !!B.acid;
      const to = A.indicator === 'phth' ? (acid ? 'phth' : 'phth:pink') : (acid ? 'litmus:red' : 'litmus:blue');
      if (to !== A.id) {
        const kindName = A.indicator === 'phth' ? '페놀프탈레인' : '리트머스';
        out.push(R('indicator:' + A.indicator + ':' + (acid ? 'acid' : 'base'), `${kindName}의 색 변화 (${acid ? '산성' : '염기성'})`, [], [], { kind: 'physical', eq: `${kindName} → ${SL.MATERIALS.find((d) => d.id === to).name}`, prob: 0.5, toA: to, note: '지시약은 용액의 산성과 염기성에 따라 색이 바뀝니다.' }));
      }
    }
    return out;
  }

  // ---- 화학식 균형 ----
  function parseFormula(fx) {
    const stack = [{}];
    const re = /([A-Z][a-z]?)|(\()|(\))|(\d+)/g;
    let m, last = null;
    while ((m = re.exec(fx))) {
      if (m[1]) { const top = stack[stack.length - 1]; top[m[1]] = (top[m[1]] || 0) + 1; last = { kind: 'el', el: m[1] }; }
      else if (m[2]) { stack.push({}); last = null; }
      else if (m[3]) { const g = stack.pop(); const top = stack[stack.length - 1]; for (const k in g) top[k] = (top[k] || 0) + g[k]; last = { kind: 'group', group: g }; }
      else if (m[4] && last) {
        const n = +m[4], top = stack[stack.length - 1];
        if (last.kind === 'el') top[last.el] += n - 1;
        else for (const k in last.group) top[k] += last.group[k] * (n - 1);
        last = null;
      }
    }
    return stack[0];
  }

  // 원자 수 연립방정식을 가우스 소거로 풀어 가장 작은 양의 정수 계수를 구한다. 답이 하나가 아니거나 없으면 null.
  function balance(reactants, products) {
    const all = reactants.concat(products).map(parseFormula);
    const n = all.length;
    const els = [...new Set(all.flatMap((f) => Object.keys(f)))];
    const rows = els.map((e) => all.map((f, k) => (k < reactants.length ? 1 : -1) * (f[e] || 0)));
    const pivots = [];
    let row = 0;
    for (let col = 0; col < n && row < rows.length; col++) {
      let best = row;
      for (let i = row; i < rows.length; i++) if (Math.abs(rows[i][col]) > Math.abs(rows[best][col])) best = i;
      if (Math.abs(rows[best][col]) < 1e-9) continue;
      [rows[row], rows[best]] = [rows[best], rows[row]];
      const p = rows[row][col];
      rows[row] = rows[row].map((v) => v / p);
      for (let i = 0; i < rows.length; i++) {
        if (i === row) continue;
        const f = rows[i][col];
        if (f) rows[i] = rows[i].map((v, c) => v - f * rows[row][c]);
      }
      pivots.push(col);
      row++;
    }
    if (pivots.length !== n - 1) return null;
    const free = [...Array(n).keys()].find((c) => !pivots.includes(c));
    const x = new Array(n).fill(0);
    x[free] = 1;
    pivots.forEach((col, i) => { x[col] = -rows[i][free]; });
    if (x.some((v) => v <= 1e-9)) return null;
    for (let scale = 1; scale <= 2000; scale++) {
      const y = x.map((v) => v * scale);
      if (y.every((v) => Math.abs(v - Math.round(v)) < 1e-6)) return y.map(Math.round);
    }
    return null;
  }

  function equation(r) {
    if (r.eq) return r.eq;
    if (!r.reactants || !r.reactants.length) return r.name;
    const coefs = balance(r.reactants, r.products);
    const side = (arr, offset) => arr.map((f, i) => {
      const c = coefs ? coefs[i + offset] : 1;
      const up = /^(H2|CO2|O2|NO2|NO|SO2|SO3|NH3|H2S)$/.test(f) && offset ? '↑' : '';
      return (c > 1 ? c : '') + SL.prettyFormula(f) + up;
    }).join(' + ');
    return side(r.reactants, 0) + ' → ' + side(r.products, r.reactants.length);
  }

  SL.CHEM = { rulesFor, equation, balance, parseFormula, METALS, SERIES };

  // ---- 표로 지정하는 특수 반응 ----
  const WOOD = { id: 'wood_burn', name: '나무의 연소', reactants: ['C6H10O5', 'O2'], products: ['CO2', 'H2O'], note: '공기가 없으면 타지 않습니다.' };
  SL.REACTIONS = [
    // 나무: 발화 → 불씨 → (산소가 있으면) 연소. 산소가 없으면 불씨가 식어 꺼진다.
    ...OX.map((ox) => Object.assign({}, WOOD, { a: 'wood', b: ox, minT: 300, prob: 0.06, toA: 'ember', T: 600 })),
    Object.assign({}, WOOD, { a: 'wood', b: 'fire', prob: 0.5, toA: 'ember', T: 600 }),
    ...OX.map((ox) => Object.assign({}, WOOD, { a: 'ember', b: ox, prob: ox === 'air' ? 0.12 : 0.3, toA: [['fire', 0.7], ['ash', 0.3]], toB: 'fire', T: 900 })),
    Object.assign({}, WOOD, { a: 'ember', b: 'wood', prob: 0.08, toB: 'ember', T: 600, near: OX }),

    ...OX.map((ox) => ({ id: 'h2_burn', name: '수소의 연소', reactants: ['H2', 'O2'], products: ['H2O'], a: 'hydrogen', b: ox, minT: 500, prob: 0.6, toA: 'fire', toB: 'steam', T: 1100, note: '수소가 타면 물만 생깁니다.' })),
    { id: 'h2_burn', name: '수소의 연소', reactants: ['H2', 'O2'], products: ['H2O'], a: 'hydrogen', b: 'fire', prob: 0.5, T: 550, note: '수소가 타면 물만 생깁니다.' },
    ...OX.map((ox) => ({ id: 'c_burn', name: '탄소의 연소', reactants: ['C', 'O2'], products: ['CO2'], a: 'C:s', b: ox, minT: 600, prob: ox === 'air' ? 0.05 : 0.2, toA: 'fire', toB: 'CO2', T: 1200, note: '숯이 타면 이산화탄소가 됩니다.' })),
    { id: 'c_burn', name: '탄소의 연소', reactants: ['C', 'O2'], products: ['CO2'], a: 'C:s', b: 'fire', prob: 0.3, T: 650, note: '숯이 타면 이산화탄소가 됩니다.' },
    ...['S:s', 'S:l'].flatMap((s) => OX.map((ox) => ({ id: 's_burn', name: '황의 연소', reactants: ['S', 'O2'], products: ['SO2'], a: s, b: ox, minT: 230, prob: ox === 'air' ? 0.1 : 0.3, toA: 'fire', toB: 'SO2', T: 1000, note: '파란 불꽃과 함께 자극적인 이산화황이 생깁니다.' }))),
    ...OX.map((ox) => ({ id: 'p_burn', name: '인의 연소', reactants: ['P', 'O2'], products: ['P4O10'], a: 'P:s', b: ox, minT: 34, prob: 0.2, toA: 'fire', toB: 'smoke', T: 1500, note: '흰인은 30~40°C 정도에서도 스스로 불이 붙습니다.' })),
    ...OX.map((ox) => ({ id: 'si_burn', name: '규소의 산화', reactants: ['Si', 'O2'], products: ['SiO2'], a: 'Si:s', b: ox, minT: 900, prob: 0.02, toA: 'sand', note: '고온에서 이산화규소가 됩니다.' })),
    ...OX.map((ox) => ({ id: 'b_burn', name: '붕소의 연소', reactants: ['B', 'O2'], products: ['B2O3'], a: 'B:s', b: ox, minT: 700, prob: 0.1, toA: 'fire:Ba', toB: 'fire:Ba', T: 1800, note: '붕소는 녹색 불꽃을 냅니다.' })),
    { id: 'lava_quench', name: '용암의 급랭', kind: 'physical', eq: '용암 + 물 → 현무암 + 수증기', a: 'lava', b: 'water', prob: 0.15, toA: 'basalt', toB: 'steam', note: '겉면이 급히 식어 굳습니다.' },

    { id: 'fe_rust', name: '철의 부식', reactants: ['Fe', 'O2', 'H2O'], products: ['Fe(OH)3'], a: 'iron', b: 'water', near: OX, prob: 0.0015, toA: 'rust', note: '철은 물과 산소가 함께 있을 때 녹슬고, 산소가 없는 물속에서는 거의 녹슬지 않습니다.' },
    { id: 'fe_rust', name: '철의 부식', reactants: ['Fe', 'O2', 'H2O'], products: ['Fe(OH)3'], a: 'iron', b: 'brine', near: OX, prob: 0.008, toA: 'rust', note: '소금물에서는 부식이 더 빠릅니다.' },
    { id: 'ag_tarnish', name: '은의 변색', reactants: ['Ag', 'H2S', 'O2'], products: ['Ag2S', 'H2O'], a: 'Ag:s', b: 'H2S', prob: 0.1, toA: 'S:Ag2S', note: '은은 황화수소를 만나면 검게 변합니다.' },

    { id: 'h2_cl2', name: '수소와 염소', reactants: ['H2', 'Cl2'], products: ['HCl'], a: 'hydrogen', b: 'Cl:g', minT: 250, prob: 0.5, toA: 'HClg', toB: 'HClg', dT: 500, note: '불을 붙이면 격렬히 반응해 염화수소가 됩니다.' },
    { id: 'h2_br2', name: '수소와 브로민', reactants: ['H2', 'Br2'], products: ['HBr'], a: 'hydrogen', b: 'Br:g', minT: 300, prob: 0.2, toA: 'HBrg', toB: 'HBrg', dT: 150, note: '가열하면 브로민화수소가 됩니다.' },
    { id: 'haber', name: '하버-보슈 공정', reactants: ['N2', 'H2'], products: ['NH3'], a: 'nitrogen', b: 'hydrogen', near: ['Fe:s'], minT: 400, prob: 0.2, toA: 'NH3', toB: 'NH3', note: '철 촉매와 고온에서 암모니아를 만듭니다. 실제 공정은 높은 압력도 필요합니다.' },
    { id: 'nh3_hcl', name: '암모니아와 염화수소', reactants: ['NH3', 'HCl'], products: ['NH4Cl'], a: 'NH3', b: 'HClg', prob: 0.6, toA: 'S:NH4Cl', toB: 'air', dT: 20, note: '두 기체가 만나면 흰 연기처럼 고체가 생깁니다.' },
    { id: 'nh4cl_heat', name: '염화암모늄의 분해', reactants: ['NH4Cl'], products: ['NH3', 'HCl'], a: 'S:NH4Cl', b: 'air', minT: 338, prob: 0.1, toA: 'NH3', toB: 'HClg', note: '가열하면 다시 두 기체로 나뉩니다.' },
    { id: 'nh3_water', name: '암모니아가 물에 녹음', eq: 'NH₃ + H₂O → NH₄OH', kind: 'physical', a: 'NH3', b: 'water', prob: 0.4, toA: 'NH4OH:aq', toB: 'NH4OH:aq', note: '암모니아는 물에 매우 잘 녹습니다.' },
    { id: 'hcl_water', name: '염화수소가 물에 녹음', eq: 'HCl(g) → H⁺ + Cl⁻', kind: 'physical', a: 'HClg', b: 'water', prob: 0.4, toA: 'hcl', toB: 'hcl', dT: 10, note: '염산이 됩니다.' },
    { id: 'hbr_water', name: '브로민화수소가 물에 녹음', eq: 'HBr(g) → H⁺ + Br⁻', kind: 'physical', a: 'HBrg', b: 'water', prob: 0.4, toA: 'HBr', toB: 'HBr', dT: 10, note: '브로민화수소산이 됩니다.' },
    { id: 'cl2_water', name: '염소가 물에 녹음', reactants: ['Cl2', 'H2O'], products: ['HCl', 'HClO'], a: 'Cl:g', b: 'water', prob: 0.05, toA: 'hcl', note: '염소수에는 소독 작용을 하는 차아염소산이 있습니다.' },
    { id: 'h2so4_dilute', name: '진한 황산 희석', kind: 'physical', eq: 'H₂SO₄ + 물 → 묽은 황산 + 많은 열', a: 'H2SO4', b: 'water', prob: 0.2, toA: 'H2SO4aq', toB: 'H2SO4aq', dT: 90, note: '열이 매우 많이 나서 물이 튀어 오를 수 있습니다.' },
    { id: 'hno3_dilute', name: '진한 질산 희석', kind: 'physical', eq: 'HNO₃ + 물 → 묽은 질산', a: 'HNO3', b: 'water', prob: 0.2, toA: 'HNO3aq', toB: 'HNO3aq', dT: 15, note: '물에 섞이면 묽은 질산이 됩니다.' },
    { id: 'acetic_dilute', name: '빙초산 희석', kind: 'physical', eq: 'CH₃COOH + 물 → 식초', a: 'CH3COOH', b: 'water', prob: 0.2, toA: 'CH3COOHaq', toB: 'CH3COOHaq', note: '묽으면 식초가 됩니다.' },
    { id: 'sugar_h2so4', name: '설탕의 탈수', reactants: ['C12H22O11'], products: ['C', 'H2O'], a: 'sugar', b: 'H2SO4', prob: 0.1, toA: 'C:s', toB: 'steam', dT: 120, note: '진한 황산이 설탕에서 물을 빼앗아 검은 탄소 기둥이 솟습니다.' },
    { id: 'sugar_heat', name: '설탕의 열분해', reactants: ['C12H22O11'], products: ['C', 'H2O'], a: 'sugar', b: 'air', minT: 186, prob: 0.02, toA: 'C:s', toB: 'steam', note: '캐러멜을 거쳐 탄소가 됩니다.' },
    { id: 'h2o2_mno2', name: '과산화수소의 분해', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'S:MnO2', prob: 0.4, toA: 'water', dT: 10, note: '이산화망가니즈는 촉매라서 줄어들지 않습니다. 산소 거품이 납니다.' },
    { id: 'h2o2_o2', name: '과산화수소의 분해', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'air', minT: 150, prob: 0.1, toA: 'water', toB: 'oxygen', note: '가열해도 물과 산소로 분해됩니다.' },
    { id: 'al_naoh', name: '알루미늄과 수산화나트륨', eq: '2Al + 2NaOH + 6H₂O → 2Na[Al(OH)₄] + 3H₂↑', a: 'Al:s', b: 'naoh', prob: 0.08, toA: 'brine', toB: 'hydrogen', dT: 60, note: '알루미늄은 산뿐 아니라 강염기에도 녹습니다(양쪽성 금속). 생성 용액은 단순화해 표시합니다.' },
    { id: 'zn_naoh', name: '아연과 수산화나트륨', eq: 'Zn + 2NaOH + 2H₂O → Na₂[Zn(OH)₄] + H₂↑', a: 'Zn:s', b: 'naoh', minT: 60, prob: 0.04, toA: 'brine', toB: 'hydrogen', dT: 20, note: '아연도 양쪽성 금속입니다. 생성 용액은 단순화해 표시합니다.' },
    { id: 'aqua_mix', name: '왕수 만들기', kind: 'chemical', eq: 'HNO₃ + 3HCl → 왕수', a: 'HNO3', b: 'hcl', prob: 0.3, toA: 'aquaregia', toB: 'aquaregia', note: '금도 녹이는 혼합 산입니다.' },
    { id: 'au_aqua', name: '금과 왕수', reactants: ['Au', 'HNO3', 'HCl'], products: ['AuCl3', 'NO', 'H2O'], a: 'Au:s', b: 'aquaregia', prob: 0.05, toA: 'S:AuCl3', toB: 'NO2', note: '금은 왕수에만 녹습니다.' },
    { id: 'hf_glass', name: '플루오린화수소산과 유리', reactants: ['SiO2', 'HF'], products: ['SiF4', 'H2O'], a: 'glass', b: 'HF', prob: 0.05, toA: 'air', toB: 'water', note: '유리를 녹이는 드문 산입니다.' },
    { id: 'hf_glass', name: '플루오린화수소산과 유리', reactants: ['SiO2', 'HF'], products: ['SiF4', 'H2O'], a: 'sand', b: 'HF', prob: 0.05, toA: 'air', toB: 'water', note: '유리를 녹이는 드문 산입니다.' },
    { id: 'soap', name: '비누화 반응', eq: '지방 + 3NaOH → 비누 + 글리세롤', a: 'oil', b: 'naoh', minT: 40, prob: 0.05, toA: 'soap', toB: 'C3H8O3', dT: 10, note: '기름과 염기가 만나 비누가 됩니다. 조금 데우면 빨라집니다.' },
    { id: 'steel', name: '강철 만들기', kind: 'physical', eq: 'Fe(l) + C → 강철', a: 'Fe:l', b: 'C:s', prob: 0.1, toA: 'steel:l', toB: 'steel:l', note: '철에 탄소가 조금 녹으면 더 단단한 강철이 됩니다.' },
    { id: 'bronze', name: '청동 만들기', kind: 'physical', eq: 'Cu(l) + Sn(l) → 청동', a: 'Cu:l', b: 'Sn:l', prob: 0.2, toA: 'bronze:l', toB: 'bronze:l', note: '구리와 주석의 합금입니다.' },
    { id: 'brass', name: '황동 만들기', kind: 'physical', eq: 'Cu(l) + Zn(l) → 황동', a: 'Cu:l', b: 'Zn:l', prob: 0.2, toA: 'brass:l', toB: 'brass:l', note: '구리와 아연의 합금입니다.' },
    { id: 'solder', name: '땜납 만들기', kind: 'physical', eq: 'Sn(l) + Pb(l) → 땜납', a: 'Sn:l', b: 'Pb:l', prob: 0.2, toA: 'solder:l', toB: 'solder:l', note: '녹는점이 두 금속보다 낮아집니다.' },
    { id: 'glass_sand', name: '소다 석회 유리', kind: 'chemical', reactants: ['Na2CO3', 'SiO2'], products: ['Na2SiO3', 'CO2'], a: 'S:Na2CO3', b: 'sand', minT: 1000, prob: 0.05, toA: 'moltenglass', toB: 'moltenglass', note: '탄산소다를 넣으면 모래가 더 낮은 온도에서 유리가 됩니다.' },
    { id: 'cement', name: '시멘트 굳기', kind: 'chemical', reactants: ['Ca(OH)2', 'CO2'], products: ['CaCO3', 'H2O'], a: 'S:Ca(OH)2', b: 'CO2', prob: 0.05, toA: 'limestone', note: '소석회가 공기 속 이산화탄소를 만나 다시 석회암이 됩니다.' },
  ];
})(globalThis.SandLab = globalThis.SandLab || {});
