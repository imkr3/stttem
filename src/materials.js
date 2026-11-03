// 물질 목록을 데이터로부터 생성한다.
// - 원소와 분자: 고체·액체·기체 세 상태를 만들고 녹는점·끓는점으로 잇는다.
// - 이온 화합물: 양이온 × 음이온 조합으로 만들고, 용해도 규칙에 맞으면 수용액도 만든다.
// 잠열과 비열 자료가 없는 물질은 경험 법칙으로 추정한다(뒤룽-프티, 트루턴, 리처드).
(function (SL) {
  'use strict';

  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const pretty = (fx) => fx.replace(/\d/g, (d) => SUB[d]);
  SL.prettyFormula = pretty;

  const list = [];
  const alias = {};
  const add = (d) => { list.push(Object.assign({ T0: 20, c: 800, k: 1, density: 1000 }, d)); return d.id; };

  function pointsText(o) {
    const t = [];
    if (o.subl) t.push(`승화점 ${o.bp}°C`);
    else {
      if (o.mp != null) t.push(`녹는점 ${o.mp}°C`);
      if (o.bp != null) t.push(`끓는점 ${o.bp}°C`);
    }
    return t.join(' · ');
  }

  // 응축상 색에서 흐린 증기 색을 만든다.
  const fade = (hex, t) => {
    const n = (i) => parseInt(hex.slice(i, i + 2), 16);
    const mix = (v, bg) => Math.round(v * t + bg * (1 - t)).toString(16).padStart(2, '0');
    return '#' + mix(n(1), 16) + mix(n(3), 21) + mix(n(5), 27);
  };

  // 한 물질의 세 상태를 만든다. std는 20°C에서의 상태.
  function family(o) {
    const key = o.key;
    const subl = o.subl;
    const std = o.std || (subl ? (o.bp > 20 ? 's' : 'g') : o.mp > 20 ? 's' : o.bp > 20 ? 'l' : 'g');
    const id = { s: key + ':s', l: key + ':l', g: key + ':g' };
    alias[key] = id[std];
    const cS = o.c || 2000;
    const Lf = o.Lf || 9 * (o.mp + 273) * 1000 / o.M; // 리처드 법칙
    const Lv = o.Lv || 88 * (o.bp + 273) * 1000 / o.M; // 트루턴 법칙
    const gasRho = o.M * 0.0416; // 이상 기체, 20°C 1기압
    const common = { fx: o.fx, sp: key, mp: o.mp, bp: o.bp, subl, est: o.est, predicted: o.predicted, radioactive: o.radioactive, mol: o.mol };
    const note = [o.desc, pointsText(o), o.radioactive ? '방사성 원소입니다(붕괴는 다루지 않음).' : '', o.predicted ? '성질은 측정값이 아닌 이론 예측값입니다.' : ''].filter(Boolean).join(' ');
    const names = o.names || {};
    const label = {
      s: names.s || (std === 's' ? o.name : '고체 ' + o.name),
      l: names.l || (std === 'l' ? o.name : std === 's' ? '녹은 ' + o.name : '액체 ' + o.name),
      g: names.g || (std === 'g' ? o.name : o.name + ' 증기'),
    };
    const pal = (ph) => (ph === std ? o.cat : (o.pal && o.pal[ph]) || null);
    const castable = o.metal || o.cast;

    add(Object.assign({}, common, o.tags, {
      id: id.s, name: label.s, formula: pretty(o.fx) + (std === 's' ? '' : '(s)'), state: o.solidState || 'powder', cat: pal('s'), color: o.color,
      density: o.rho * 1000, c: cS, k: o.k, T0: std === 's' ? 20 : (subl ? o.bp : o.mp) - 10, desc: note, metal: o.metal,
      up: subl ? { at: o.bp, to: id.g, L: Lf + Lv } : { at: o.mp, to: id.l, L: Lf },
      plate: o.plate,
    }));
    if (!subl) {
      add(Object.assign({}, common, o.tags, {
        id: id.l, name: label.l, formula: pretty(o.fx) + (std === 'l' ? '' : '(l)'), state: 'liquid', cat: pal('l'), color: o.liquidColor || o.color,
        density: (o.rhoL || o.rho * 0.93) * 1000, c: o.cL || cS * 1.2, k: o.k * 0.5, T0: std === 'l' ? 20 : o.mp + 15, flow: o.flow || 3, desc: note, metal: o.metal, misc: o.misc,
        up: { at: o.bp, to: id.g, L: Lv }, down: { at: o.mp, to: id.s, L: Lf, cast: castable },
      }));
    }
    add(Object.assign({}, common, o.tags, {
      id: id.g, name: label.g, formula: pretty(o.fx) + (std === 'g' ? '' : '(g)'), state: 'gas', cat: pal('g'), color: o.gasColor || fade(o.color, std === 'g' ? 0.75 : 0.5),
      density: gasRho, c: o.cG || Math.max(cS, 500), k: 0.03, T0: std === 'g' ? 20 : o.bp + 15, desc: note,
      down: o.gasOnly ? null : subl ? { at: o.bp, to: id.s, L: Lf + Lv } : { at: o.bp, to: id.l, L: Lv },
    }));
  }

  // ---- 원소 ----
  const ELEMENT_COLORS = {
    H: '#d9c9f5', He: '#f4e3b0', Li: '#c4c8cc', B: '#4b4640', C: '#26262a', N: '#9fb4d8', O: '#9fd3ff', F: '#d6e38a', Ne: '#ff8a70', Na: '#d5d9c8', Mg: '#c9cdd2', Al: '#cfd4d9', Si: '#6e7680', P: '#f0e6c0', S: '#e6d23c',
    Cl: '#a8cc4e', Ar: '#c79be0', K: '#c9cfc2', Ca: '#d8d5cc', Ti: '#9aa0a8', V: '#a0a4aa', Cr: '#b8c2cc', Mn: '#9c9690', Fe: '#8d949c', Co: '#7f8a9c', Ni: '#b4ae9c', Cu: '#c97a4a', Zn: '#a6b0ba', Ga: '#c0c6cc', Ge: '#808890',
    As: '#6c7074', Se: '#7a3a30', Br: '#9a3216', Kr: '#b8d8e8', Rb: '#c8c4c0', Sr: '#d4cfc2', Ag: '#e2e5e8', Cd: '#a8b0b8', In: '#b0b4bc', Sn: '#c2c6ca', Sb: '#8e9298', Te: '#858a90', I: '#3a2a55', Xe: '#a0b4ff', Cs: '#d8c98c',
    Ba: '#bfbdae', W: '#7a7e84', Pt: '#d0d2d4', Au: '#e8bf3c', Hg: '#c4cad0', Pb: '#6f7680', Bi: '#c3a8b4', Rn: '#c08090', U: '#6a7068', Pu: '#6c665c', Ra: '#c8d0a8', Os: '#7a8ca0',
  };
  const CAT_COLOR = { alkali: '#c8ccc4', alkaline: '#cfcdc2', tm: '#a2a8ae', post: '#a8aeb4', metalloid: '#7c8288', nonmetal: '#b0b0a0', halogen: '#a0b070', noble: '#b0c4d8', ln: '#b4b8ae', an: '#8c9088' };
  const MOLECULE = { H: 'H2', N: 'N2', O: 'O2', F: 'F2', Cl: 'Cl2', Br: 'Br2', I: 'I2' };
  const GAS_COLOR = { H: '#2a2c3a', He: '#2c2a24', N: '#1b2230', O: '#1e3040', F: '#555a2c', Ne: '#3a241f', Cl: '#6c8530', Ar: '#2a2233', Br: '#8a3a18', I: '#6a3f96', Kr: '#1f2c33', Xe: '#242a44', Rn: '#33242a', Hg: '#2c3036', Na: '#6c6a24', S: '#a07a20' };
  const METAL_CATS = new Set(['alkali', 'alkaline', 'tm', 'post', 'ln', 'an']);
  const METALLIC_METALLOIDS = new Set(['Ge', 'Sb']); // 준금속이지만 금속처럼 가열하면 산화물이 된다.

  for (const e of SL.ELEMENTS) {
    const multi = MOLECULE[e.sym] ? 2 : 1;
    family({
      key: e.sym, fx: MOLECULE[e.sym] || e.sym, name: e.name, M: e.M * multi, rho: e.rho, mp: e.mp, bp: e.bp, subl: e.mp == null, k: e.k,
      c: Math.round(25000 / e.M), color: ELEMENT_COLORS[e.sym] || CAT_COLOR[e.cat], gasColor: GAS_COLOR[e.sym], cat: 'element', flow: 3,
      metal: METAL_CATS.has(e.cat) || METALLIC_METALLOIDS.has(e.sym) ? e.sym : undefined, radioactive: e.radioactive, predicted: e.predicted, tags: { el: e.sym, z: e.z, elCat: e.cat },
    });
  }
  // 기체 원소는 액체로도 쓸 수 있게 목록에 노출한다.
  for (const [k, phases] of Object.entries({ N: { l: 'cryo' }, O: { l: 'cryo' }, Ar: { l: 'cryo' } })) {
    list.filter((d) => d.sp === k && d.id === k + ':l').forEach((d) => { d.cat = phases.l; });
  }

  // ---- 분자 ----
  // [키, 이름, 화학식, M, 응축상 밀도, 녹는점, 끓는점, 분류, 색, 추가]
  const fuel = (ign, prob, prods, T) => ({ fuel: { ign, prob, prods, T } });
  const CH = ['CO2', 'H2O'];
  const MOLECULES = [
    ['CO2', '이산화탄소', 'CO2', 44.01, 1.56, null, -78.5, 'gas', '#c8d4cc', { names: { s: '드라이아이스' }, gasColor: '#26302a', k: 0.1, c: 840, pal: { s: 'cryo' }, desc: '공기보다 무겁고 불을 끕니다. 고체는 바로 기체가 됩니다.' }],
    ['CO', '일산화탄소', 'CO', 28.01, 0.93, -205, -191.5, 'gas', '#a0a8a0', { gasColor: '#20262a', k: 0.1, c: 1040, tags: fuel(600, 0.4, ['CO2'], 1500), desc: '독성이 있고 파란 불꽃을 내며 탑니다.' }],
    ['NO', '일산화질소', 'NO', 30.01, 1.27, -163.6, -151.8, 'gas', '#b0b0b0', { gasColor: '#22262c', k: 0.1, c: 995 }],
    ['NO2', '이산화질소', 'NO2', 46.01, 1.45, -11.2, 21.1, 'gas', '#a84a1c', { gasColor: '#8a4018', k: 0.1, c: 800, gasOnly: true, desc: '적갈색의 유독한 기체.' }],
    ['SO2', '이산화황', 'SO2', 64.07, 1.46, -72, -10, 'gas', '#c0c4b0', { gasColor: '#30342a', k: 0.1, c: 640, desc: '자극적인 냄새의 기체. 물에 녹아 산이 됩니다.' }],
    ['SO3', '삼산화황', 'SO3', 80.07, 1.92, 16.9, 45, 'chem', '#e8e8e0', { k: 0.1, c: 700 }],
    ['H2S', '황화수소', 'H2S', 34.08, 0.95, -85.5, -60, 'gas', '#c4c49a', { gasColor: '#30301f', k: 0.1, c: 1000, tags: fuel(260, 0.4, ['SO2', 'H2O'], 1200), desc: '달걀 썩는 냄새가 나는 유독한 기체.' }],
    ['NH3', '암모니아', 'NH3', 17.03, 0.68, -77.7, -33.3, 'gas', '#c0d8d8', { gasColor: '#22302f', k: 0.2, c: 2060, desc: '공기보다 가볍고 물에 매우 잘 녹습니다.' }],
    ['HClg', '염화수소', 'HCl', 36.46, 1.19, -114.2, -85, 'gas', '#c8d8b0', { gasColor: '#2a3324', k: 0.1, c: 800, desc: '물에 녹으면 염산이 됩니다.' }],
    ['HBrg', '브로민화수소', 'HBr', 80.91, 2.6, -86.8, -66.8, 'gas', '#c8c0b0', { gasColor: '#2c2a24', k: 0.1, c: 360 }],
    ['HIg', '아이오딘화수소', 'HI', 127.9, 2.85, -50.8, -35.4, 'gas', '#c8c0c8', { gasColor: '#2c262e', k: 0.1, c: 230 }],
    ['HFg', '플루오린화수소', 'HF', 20.01, 1.0, -83.6, 19.5, 'gas', '#d0d8b0', { gasColor: '#2a3026', k: 0.1, c: 1450, gasOnly: true }],
    ['H2O2', '과산화수소', 'H2O2', 34.01, 1.45, -0.4, 150.2, 'chem', '#bcdcf0', { k: 0.6, c: 2620, misc: true, flow: 4, desc: '이산화망가니즈를 만나면 빠르게 분해되어 산소를 냅니다.' }],
    ['H2SO4', '진한 황산', 'H2SO4', 98.08, 1.84, 10.3, 337, 'acid', '#d8d4a8', { k: 0.3, c: 1400, flow: 2, misc: true, tags: { acid: { a: 'SO4', conc: true }, pH: 0 }, desc: '물과 만나면 많은 열을 내고, 설탕에서 물을 빼앗습니다.' }],
    ['HNO3', '진한 질산', 'HNO3', 63.01, 1.51, -42, 83, 'acid', '#e8dca0', { k: 0.3, c: 1720, flow: 4, misc: true, tags: { acid: { a: 'NO3', conc: true }, pH: 0 }, desc: '강한 산화제. 수소 대신 이산화질소가 생깁니다.' }],
    ['CH3COOH', '빙초산', 'CH3COOH', 60.05, 1.05, 16.6, 118, 'acid', '#d8dcc8', { k: 0.2, c: 2050, flow: 4, misc: true, tags: Object.assign({ acid: { a: 'CH3COO', conc: true, weak: true }, pH: 2.4 }, fuel(460, 0.1, CH, 1100)) }],
    ['CH4', '메테인', 'CH4', 16.04, 0.42, -182.5, -161.5, 'organic', '#b8c0d0', { gasColor: '#222a36', k: 0.1, c: 2220, tags: fuel(540, 0.5, CH, 1400), desc: '천연가스의 주성분.' }],
    ['C2H6', '에테인', 'C2H6', 30.07, 0.54, -182.8, -88.6, 'organic', '#b8c0d0', { gasColor: '#222a36', k: 0.1, c: 1750, tags: fuel(515, 0.5, CH, 1400) }],
    ['C3H8', '프로페인', 'C3H8', 44.1, 0.58, -187.7, -42.1, 'organic', '#b8c0d0', { gasColor: '#232b33', k: 0.1, c: 1670, tags: fuel(470, 0.5, CH, 1400), desc: '공기보다 무거운 연료 기체.' }],
    ['C4H10', '뷰테인', 'C4H10', 58.12, 0.6, -138.4, -0.5, 'organic', '#b8c0d0', { gasColor: '#242c33', k: 0.1, c: 1700, tags: fuel(405, 0.5, CH, 1400) }],
    ['C2H4', '에틸렌', 'C2H4', 28.05, 0.57, -169.2, -103.7, 'organic', '#b8c0d0', { gasColor: '#222a36', k: 0.1, c: 1530, tags: fuel(490, 0.5, CH, 1500) }],
    ['C2H2', '아세틸렌', 'C2H2', 26.04, 0.73, null, -80.8, 'organic', '#b8c0d0', { gasColor: '#222a36', k: 0.1, c: 1690, tags: fuel(305, 0.7, CH, 2500), desc: '매우 뜨거운 불꽃을 내는 연료.' }],
    ['CH3OH', '메탄올', 'CH3OH', 32.04, 0.79, -97.6, 64.7, 'organic', '#c4dcec', { rhoL: 0.79, k: 0.2, c: 2500, flow: 5, misc: true, tags: fuel(385, 0.25, CH, 1000), desc: '유독한 알코올. 불꽃이 잘 보이지 않습니다.' }],
    ['C2H5OH', '에탄올', 'C2H5OH', 46.07, 0.79, -114.1, 78.4, 'organic', '#c8e0ec', { rhoL: 0.789, k: 0.17, c: 2440, flow: 5, misc: true, tags: fuel(365, 0.25, CH, 1000), desc: '물과 잘 섞이고 잘 탑니다.' }],
    ['C3H6O', '아세톤', 'C3H6O', 58.08, 0.79, -94.7, 56, 'organic', '#d0e4e8', { rhoL: 0.784, k: 0.16, c: 2150, flow: 5, misc: true, tags: fuel(465, 0.3, CH, 1100) }],
    ['C6H6', '벤젠', 'C6H6', 78.11, 0.88, 5.5, 80.1, 'organic', '#d0d8c0', { rhoL: 0.876, k: 0.14, c: 1740, flow: 4, tags: fuel(498, 0.25, CH, 1300), desc: '물에 뜨고 섞이지 않습니다. 그을음을 내며 탑니다.' }],
    ['C8H18', '휘발유(옥테인)', 'C8H18', 114.2, 0.7, -57, 125, 'organic', '#d4c48a', { rhoL: 0.7, k: 0.13, c: 2200, flow: 5, tags: fuel(220, 0.4, CH, 1200) }],
    ['CCl4', '사염화탄소', 'CCl4', 153.8, 1.59, -23, 76.7, 'organic', '#c0d0c0', { rhoL: 1.59, k: 0.1, c: 860, flow: 4, desc: '물보다 무겁고 물과 섞이지 않습니다.' }],
    ['C3H8O3', '글리세롤', 'C3H8O3', 92.09, 1.26, 17.8, 290, 'organic', '#e0e4d8', { rhoL: 1.26, k: 0.29, c: 2430, flow: 1, misc: true, std: 'l', tags: fuel(370, 0.1, CH, 1000) }],
    ['C25H52', '파라핀', 'C25H52', 352.7, 0.9, 58, 370, 'organic', '#ece6cc', { k: 0.25, c: 2500, tags: fuel(245, 0.15, CH, 1000), desc: '양초의 재료. 녹으면 불이 잘 붙습니다.' }],
    ['N2O', '아산화질소', 'N2O', 44.01, 1.23, -90.9, -88.5, 'gas', '#c8d0d8', { gasColor: '#222830', k: 0.1, c: 880, desc: '웃음 기체. 뜨거우면 산소를 내놓아 불씨를 다시 타오르게 합니다.' }],
    ['C2H4Br2', '1,2-다이브로모에테인', 'C2H4Br2', 187.9, 2.18, 9.8, 131.6, 'organic', '#d8d0c0', { rhoL: 2.18, k: 0.1, c: 730, flow: 4, desc: '에틸렌이 브로민과 첨가 반응해 생긴 무색 액체. 물보다 무겁습니다.' }],
    ['C10H8', '나프탈렌', 'C10H8', 128.2, 1.14, 80.3, 218, 'organic', '#f0f0ea', { k: 0.3, c: 1300, tags: fuel(525, 0.2, CH, 1200) }],
    ['C4H8O2', '아세트산 에틸', 'C4H8O2', 88.11, 0.902, -83.6, 77.1, 'organic', '#e4ecd8', { rhoL: 0.902, k: 0.14, c: 1920, flow: 5, tags: fuel(426, 0.3, CH, 1100), desc: '과일 향이 나는 에스터. 매니큐어 제거제에도 쓰입니다. 물에 조금만 녹아 위에 뜹니다.' }],
  ];
  for (const m of MOLECULES) {
    const [key, name, fx, M, rho, mp, bp, cat, color, extra] = m;
    family(Object.assign({ key, name, fx, M, rho, mp, bp, subl: mp == null, cat, color }, extra));
  }
  // 물은 측정값이 잘 알려져 있으므로 직접 지정한다.
  family({ key: 'H2O', name: '물', fx: 'H2O', M: 18.015, rho: 0.917, rhoL: 0.998, mp: 0, bp: 100, cat: 'basic', color: '#b6e3f5', liquidColor: '#2f7fd6', gasColor: '#a9b8c6', k: 2.2, c: 2100, cL: 4186, cG: 2010, Lf: 3.34e5, Lv: 2.257e6, flow: 5, misc: true,
    names: { s: '얼음', g: '수증기' }, pal: { s: 'basic', g: 'basic' }, desc: '얼음은 물보다 가벼워 물에 뜹니다.' });
  list.find((d) => d.id === 'H2O:l').k = 0.6;

  // ---- 이온 화합물 ----
  // [키, 이름, 전하, 원소, 허용 음이온(생략하면 전부)]
  // 잘 쓰이지 않고 반응도 거의 없는 화합물은 만들지 않는다. 금속을 가열하거나 물에 넣었을 때 생기는 산화물·수산화물만 남긴다.
  const OXCL = 'O Cl'.split(' ');
  const OX_ONLY = ['O'];
  const RE = ['O', 'OH'];
  const CATIONS = [
    ['Li', '리튬', 1, 'Li'], ['Na', '나트륨', 1, 'Na'], ['K', '칼륨', 1, 'K'], ['Rb', '루비듐', 1, 'Rb'], ['Cs', '세슘', 1, 'Cs'], ['NH4', '암모늄', 1, null],
    ['Be', '베릴륨', 2, 'Be', OX_ONLY], ['Mg', '마그네슘', 2, 'Mg'], ['Ca', '칼슘', 2, 'Ca'], ['Sr', '스트론튬', 2, 'Sr'], ['Ba', '바륨', 2, 'Ba'],
    ['Al', '알루미늄', 3, 'Al'], ['Cr3', '크로뮴(III)', 3, 'Cr'], ['Mn2', '망가니즈(II)', 2, 'Mn'], ['Fe2', '철(II)', 2, 'Fe'], ['Fe3', '철(III)', 3, 'Fe'], ['Co2', '코발트(II)', 2, 'Co'], ['Ni2', '니켈(II)', 2, 'Ni'],
    ['Cu2', '구리(II)', 2, 'Cu'], ['Zn', '아연', 2, 'Zn'], ['Ag', '은', 1, 'Ag'], ['Cd', '카드뮴', 2, 'Cd'], ['Sn2', '주석(II)', 2, 'Sn'], ['Pb2', '납(II)', 2, 'Pb'], ['Hg2', '수은(II)', 2, 'Hg'],
    ['Au3', '금(III)', 3, 'Au', OXCL], ['Pd2', '팔라듐(II)', 2, 'Pd', OX_ONLY], ['Mn4', '망가니즈(IV)', 4, 'Mn', ['O']], ['Ti4', '타이타늄(IV)', 4, 'Ti', OXCL], ['V5', '바나듐(V)', 5, 'V', ['O']], ['Mo6', '몰리브데넘(VI)', 6, 'Mo', ['O']],
    ['W6', '텅스텐(VI)', 6, 'W', ['O']], ['Zr4', '지르코늄(IV)', 4, 'Zr', OX_ONLY], ['Hf4', '하프늄(IV)', 4, 'Hf', ['O']], ['Nb5', '나이오븀(V)', 5, 'Nb', ['O']], ['Ta5', '탄탈럼(V)', 5, 'Ta', ['O']], ['Ge4', '저마늄(IV)', 4, 'Ge', ['O']],
    ['Sb3', '안티모니(III)', 3, 'Sb', OX_ONLY], ['Bi3', '비스무트(III)', 3, 'Bi', OX_ONLY], ['In3', '인듐(III)', 3, 'In', OX_ONLY], ['Ga3', '갈륨(III)', 3, 'Ga', OX_ONLY], ['Tl', '탈륨(I)', 1, 'Tl', OX_ONLY], ['Sc3', '스칸듐', 3, 'Sc', RE], ['Y3', '이트륨', 3, 'Y', RE],
    ['Th4', '토륨(IV)', 4, 'Th', ['O']], ['U6', '우라늄(VI)', 6, 'U', ['O']], ['Pu4', '플루토늄(IV)', 4, 'Pu', ['O']],
  ];
  'La 란타넘,Ce 세륨,Pr 프라세오디뮴,Nd 네오디뮴,Sm 사마륨,Eu 유로퓸,Gd 가돌리늄,Tb 터븀,Dy 디스프로슘,Ho 홀뮴,Er 어븀,Tm 툴륨,Yb 이터븀,Lu 루테튬'.split(',').forEach((s) => {
    const [el, name] = s.split(' ');
    CATIONS.push([el + '3', name, 3, el, RE]);
  });

  // [키, 전하, 이름 앞부분, 화학식, 다원자 여부]
  const ANIONS = [
    ['F', 1, '플루오린화', 'F', 0], ['Cl', 1, '염화', 'Cl', 0], ['Br', 1, '브로민화', 'Br', 0], ['I', 1, '아이오딘화', 'I', 0], ['OH', 1, '수산화', 'OH', 1], ['NO3', 1, '질산', 'NO3', 1],
    ['SO4', 2, '황산', 'SO4', 1], ['CO3', 2, '탄산', 'CO3', 1], ['HCO3', 1, '탄산수소', 'HCO3', 1], ['S', 2, '황화', 'S', 0], ['PO4', 3, '인산', 'PO4', 1], ['CH3COO', 1, '아세트산', 'CH3COO', 1],
    ['O', 2, '산화', 'O', 0], ['CrO4', 2, '크로뮴산', 'CrO4', 1], ['MnO4', 1, '과망가니즈산', 'MnO4', 1],
  ];
  const ALKALI = new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'NH4']);

  function exists(c, a, cat) {
    if (cat[4]) return cat[4].includes(a);
    if (a === 'HCO3') return ['Na', 'K', 'NH4'].includes(c);
    if (a === 'MnO4') return ['Na', 'K'].includes(c);
    if (a === 'CrO4') return ['Na', 'K', 'Ba', 'Ag', 'Pb2'].includes(c);
    if (a === 'OH' && (c === 'Ag' || c === 'Hg2')) return false; // 곧바로 산화물이 된다.
    if (a === 'O' && c === 'NH4') return false;
    if (a === 'CO3' && ['Al', 'Fe3', 'Cr3', 'Sn2'].includes(c)) return false; // 가수 분해되어 존재하지 않는다.
    if (a === 'S' && ['Al', 'Cr3', 'Fe3'].includes(c)) return false; // 물속에서 황화철(II)과 황으로 바뀐다.
    if (a === 'I' && ['Cu2', 'Fe3'].includes(c)) return false; // 아이오딘화 이온을 산화시켜 존재하지 않는다(CuI + I₂, Fe²⁺ + I₂).
    return true;
  }

  // 교과서의 용해도 규칙.
  function soluble(c, a) {
    if (a === 'O') return false;
    if (ALKALI.has(c)) return true;
    switch (a) {
      case 'NO3': case 'CH3COO': case 'MnO4': case 'HCO3': return true;
      case 'Cl': case 'Br': return !['Ag', 'Pb2', 'Tl', 'Sb3', 'Bi3'].includes(c);
      case 'I': return !['Ag', 'Pb2', 'Hg2', 'Tl'].includes(c);
      case 'F': return !['Mg', 'Ca', 'Sr', 'Ba', 'Pb2', 'La3', 'Ce3', 'Y3'].includes(c) && !/^[A-Z][a-z]?3$/.test(c);
      case 'SO4': return !['Ba', 'Sr', 'Pb2', 'Ca', 'Ag', 'Hg2'].includes(c);
      case 'OH': return ['Ba', 'Sr', 'Ca'].includes(c);
      case 'CrO4': return false;
      case 'S': return ['Mg', 'Ca', 'Sr', 'Ba'].includes(c);
      default: return false; // CO3, PO4
    }
  }

  // 화합물 측정값: 밀도(g/cm³), 녹는점(°C, 없으면 null), 색(선택)
  const DATA = {
    NaCl: [2.165, 801], KCl: [1.98, 770], LiCl: [2.07, 605], CsCl: [3.99, 645], RbCl: [2.8, 718], NaBr: [3.2, 747], KBr: [2.74, 734], NaI: [3.67, 661], KI: [3.12, 681], NaF: [2.56, 993], KF: [2.48, 858], LiF: [2.64, 845],
    CaF2: [3.18, 1418], MgCl2: [2.32, 714], CaCl2: [2.15, 772], BaCl2: [3.86, 962], SrCl2: [3.05, 874], AlCl3: [2.48, null], FeCl2: [3.16, 677, '#c8d890'], FeCl3: [2.9, 306, '#5a3218'], CuCl2: [3.39, 498, '#6a4a28'], ZnCl2: [2.91, 290], CoCl2: [3.36, 735, '#4a70c0'], NiCl2: [3.55, 1001, '#c8b040'], MnCl2: [2.98, 654, '#e0a8b0'],
    AgCl: [5.56, 455, '#f0f0ec'], AgBr: [6.47, 432, '#efe6b0'], AgI: [5.68, 558, '#efe080'], PbCl2: [5.85, 501], PbBr2: [6.66, 373], PbI2: [6.16, 402, '#f0c820'], HgCl2: [5.43, 277], HgI2: [6.36, 259, '#d83020'], SnCl2: [3.95, 247], AuCl3: [4.7, null, '#c89030'],
    NaOH: [2.13, 318], KOH: [2.04, 360], LiOH: [1.46, 462], 'Ca(OH)2': [2.21, null], 'Mg(OH)2': [2.34, null], 'Ba(OH)2': [3.74, 407], 'Al(OH)3': [2.42, null], 'Fe(OH)2': [3.4, null, '#7a9a78'], 'Fe(OH)3': [3.4, null, '#a0522a'], 'Cu(OH)2': [3.37, null, '#6ab0e0'], 'Zn(OH)2': [3.05, null], 'Ni(OH)2': [4.1, null, '#80c080'], 'Co(OH)2': [3.6, null, '#d080a0'], 'Cr(OH)3': [3.11, null, '#6a9a6a'], 'Pb(OH)2': [7.41, null], 'Mn(OH)2': [3.26, null, '#e0d0c0'],
    NaNO3: [2.26, 308], KNO3: [2.11, 334], AgNO3: [4.35, 212], 'Pb(NO3)2': [4.53, null], 'Cu(NO3)2': [3.05, 114, '#3a70c0'], 'Ca(NO3)2': [2.5, 561], NH4NO3: [1.72, 170], 'Ba(NO3)2': [3.24, 592], 'Sr(NO3)2': [2.99, 570], 'Mg(NO3)2': [2.3, 89], 'Zn(NO3)2': [2.07, 110], 'Fe(NO3)3': [1.68, 47, '#b09870'],
    Na2SO4: [2.66, 884], K2SO4: [2.66, 1069], CaSO4: [2.96, 1460], BaSO4: [4.5, 1580], SrSO4: [3.96, 1605], CuSO4: [3.6, null, '#d8e0d8'], FeSO4: [2.84, null, '#b0d0b0'], ZnSO4: [3.54, null], MgSO4: [2.66, 1124], PbSO4: [6.29, 1087], 'Al2(SO4)3': [2.67, null], NiSO4: [4.01, null, '#60b070'], MnSO4: [3.25, 710, '#e8c0c8'], CoSO4: [3.71, null, '#c06080'], '(NH4)2SO4': [1.77, null], Ag2SO4: [5.45, 652],
    Na2CO3: [2.54, 851], K2CO3: [2.43, 891], Li2CO3: [2.11, 723], CaCO3: [2.71, null], MgCO3: [2.96, null], BaCO3: [4.29, null], SrCO3: [3.5, null], CuCO3: [3.9, null, '#3a9a70'], ZnCO3: [4.4, null], PbCO3: [6.58, null], FeCO3: [3.96, null, '#a89878'], Ag2CO3: [6.08, null, '#d8d090'], NaHCO3: [2.2, null], KHCO3: [2.17, null], NH4HCO3: [1.58, null],
    Li2O: [2.01, 1438], Na2O: [2.27, 1132], K2O: [2.35, 740], Rb2O: [4, 500], Cs2O: [4.65, 490, '#d0a040'], BeO: [3.02, 2507], MgO: [3.58, 2852], CaO: [3.34, 2613], SrO: [4.7, 2531], BaO: [5.72, 1923], Al2O3: [3.95, 2072], TiO2: [4.23, 1843], Cr2O3: [5.22, 2435, '#3e7a3e'], MnO: [5.37, 1945, '#5a7a5a'], MnO2: [5.03, null, '#26221e'], Fe2O3: [5.24, 1566, '#a5502a'], FeO: [5.7, 1377, '#2a2a2a'], CuO: [6.31, 1326, '#2b2522'], ZnO: [5.61, 1975], Ag2O: [7.14, null, '#4a3226'], SnO: [6.45, 1080, '#3a3a40'], PbO: [9.53, 888, '#e0b030'], HgO: [11.14, null, '#d04020'], NiO: [6.67, 1955, '#5a8a50'], CoO: [6.44, 1933, '#4a5a4a'], WO3: [7.16, 1473, '#d8d840'], V2O5: [3.36, 690, '#d89030'], MoO3: [4.69, 795, '#e8e8d8'], ZrO2: [5.68, 2715], HfO2: [9.68, 2758], Nb2O5: [4.6, 1512], Ta2O5: [8.2, 1872], GeO2: [4.25, 1115], Sb2O3: [5.2, 656], Bi2O3: [8.9, 817, '#e8d870'], In2O3: [7.18, 1913, '#d8d070'], Ga2O3: [5.88, 1793], Sc2O3: [3.86, 2485], Y2O3: [5.01, 2425], La2O3: [6.51, 2315], CeO2: [7.2, 2400], ThO2: [10, 3350], UO3: [7.3, null, '#d0b820'], Tl2O: [9.5, 596, '#2a2a2a'], Au2O3: [11.34, null, '#6a4a20'], PdO: [8.3, null, '#2a2a2a'], TiCl4: [1.73, -24], ZrCl4: [2.8, null],
    FeS: [4.84, 1194, '#26241f'], CuS: [4.76, null, '#1e2024'], ZnS: [4.09, 1850, '#e8e4d0'], PbS: [7.6, 1118, '#22242a'], Ag2S: [7.23, 836, '#1c1c1c'], HgS: [8.1, null, '#c02818'], CdS: [4.82, 1750, '#e8c020'], NiS: [5.87, 797, '#2a2a22'], CoS: [5.45, 1117, '#24242a'], MnS: [4.0, 1610, '#b08090'], SnS: [5.22, 882, '#3a3020'], Na2S: [1.86, 1176], K2S: [1.74, 840],
    Ca3PO42: [3.14, 1670], Na3PO4: [1.62, 1583], K3PO4: [2.56, 1380], Ag3PO4: [6.37, 849, '#e8e060'], FePO4: [2.87, null, '#e8e0c0'],
    KMnO4: [2.7, null, '#4a1a68'], NaMnO4: [2.7, null, '#4a1a68'], K2CrO4: [2.73, 968, '#e8d020'], Na2CrO4: [2.72, 792, '#e8d020'], BaCrO4: [4.5, null, '#e8d840'], Ag2CrO4: [5.63, null, '#a02818'], PbCrO4: [6.12, 844, '#f0c010'],
    NaCH3COO: [1.53, 324], KCH3COO: [1.57, 292], 'Ca(CH3COO)2': [1.5, null], 'Cu(CH3COO)2': [1.88, null, '#2a7a70'], 'Pb(CH3COO)2': [3.25, 280],
  };
  DATA['Ca3(PO4)2'] = DATA.Ca3PO42;

  const COMMON = { NaCl: '소금', NaHCO3: '베이킹소다', Na2CO3: '탄산소다', CaCO3: '석회암', CaO: '생석회', 'Ca(OH)2': '소석회', Fe2O3: '녹', NaOH: '가성소다', NH4OH: '암모니아수', CaSO4: '석고', CuSO4: '황산구리', SiO2: '석영', TiO2: '티타니아' };
  // 수용액의 색은 양이온이 정한다. 없으면 맑은 물색.
  const AQ_COLOR = { Cu2: '#2a6fd0', Ni2: '#3fa86a', Fe2: '#7ab89a', Fe3: '#b48a2a', Cr3: '#3f7a6a', Mn2: '#c4a0b0', Co2: '#c05a80', Au3: '#c8a820' };
  const AN_AQ_COLOR = { MnO4: '#6a1a80', CrO4: '#d8c020' };
  const FLAME = { Li: 'Li', Na: 'Na', K: 'K', Rb: 'Rb', Cs: 'Cs', Ca: 'Ca', Sr: 'Sr', Ba: 'Ba', Cu2: 'Cu' };
  // 용해열: 양수는 데워지고 음수는 차가워진다(°C/칸).
  const DISSOLVE_HEAT = { NaOH: 40, KOH: 45, NH4NO3: -25, KNO3: -12, CaCl2: 25, NH4Cl: -12, K2CO3: 8, Na2CO3: 6, MgSO4: 8, NaCl: -1 };

  // 0.1 mol/L 정도 수용액의 대략적인 pH. 약산의 음이온은 염기성, 약염기의 양이온과 작은 고전하 금속 이온은 산성을 띤다(가수 분해).
  const ANION_PH = { OH: 13, CO3: 11.6, HCO3: 8.3, PO4: 12.1, S: 12.5, CH3COO: 8.9, F: 7.9, CrO4: 8.8 };
  const CATION_PH = {
    NH4: 5.1, Be: 3.5, Mg: 6.5, Al: 3, Cr3: 3, Mn2: 5.5, Fe2: 4.5, Fe3: 2, Co2: 5.5, Ni2: 5.5, Cu2: 4, Zn: 5.2, Ag: 6, Cd: 5.5, Sn2: 2, Pb2: 4, Hg2: 3.5,
    Au3: 2, Pd2: 2, Ti4: 1, Zr4: 1.5, Sb3: 1.5, Bi3: 1.5, In3: 3.5, Ga3: 3, Tl: 6.5, Sc3: 4, Y3: 5,
  };
  const STRONG_BASE_PH = { Ca: 12.4 }; // 수산화칼슘은 조금만 녹아 포화 용액의 pH가 낮다.
  const phOf = (c, a) => {
    if (a === 'OH' && STRONG_BASE_PH[c]) return STRONG_BASE_PH[c];
    const shift = (ANION_PH[a] != null ? ANION_PH[a] - 7 : 0) + (CATION_PH[c] != null ? CATION_PH[c] - 7 : /^[A-Z][a-z]3$/.test(c) ? -1.5 : 0);
    return Math.round(Math.max(0, Math.min(14, 7 + shift)) * 10) / 10;
  };
  // 수용액이 어는 가장 낮은 온도(공융점, °C). 없으면 -5°C로 단순화한다.
  const EUTECTIC = { NaCl: -21, KCl: -11, CaCl2: -50, MgCl2: -33, NH4NO3: -17, BaCl2: -8, NH4Cl: -16 };

  const salts = {};
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const part = (fx, n, poly) => (n === 1 ? fx : poly ? `(${fx})${n}` : fx + n);

  for (const cat of CATIONS) {
    salts[cat[0]] = {};
    for (const an of ANIONS) {
      const [c, cname, zc] = cat, [a, za, aname, afx, poly] = [an[0], an[1], an[2], an[3], an[4]];
      if (!exists(c, a, cat)) continue;
      const g = gcd(zc, za), nc = za / g, na = zc / g;
      const fx = part(c === 'NH4' ? 'NH4' : cat[3], nc, c === 'NH4') + part(afx, na, poly);
      if (c === 'NH4' && a === 'OH') { // 암모니아수는 용액으로만 존재한다.
        salts[c][a] = { aq: 'NH4OH:aq', solid: null, fx };
        add({ id: 'NH4OH:aq', name: '암모니아수', formula: 'NH₃(aq)', fx: 'NH4OH', state: 'liquid', cat: 'base', color: '#b8d8e0', density: 960, c: 4000, k: 0.5, flow: 5, aq: true, misc: true, salt: { c, a }, base: true, pH: 11.6, up: { at: 40, to: 'NH3:g', L: 3e5 }, desc: '약한 염기(pH 약 11.6). 끓지 않아도 암모니아가 날아갑니다. 구리·은 이온과 착이온을 만듭니다.' });
        continue;
      }
      const data = DATA[fx] || [];
      const est = !DATA[fx];
      const M = 40 + (cat[3] ? (SL.ELEMENTS.find((e) => e.sym === cat[3]).M) : 18) * nc;
      const density = (data[0] || Math.min(7, 2 + M / 80)) * 1000;
      const mp = data[1] == null ? null : data[1];
      const label = aname + cname + (COMMON[fx] ? ` (${COMMON[fx]})` : '');
      const solid = 'S:' + fx;
      const isBase = a === 'OH';
      const entry = { solid, aq: null, fx };
      salts[c][a] = entry;
      const baseDesc = (a === 'O' ? '금속 산화물.' : '') + (mp != null ? ` 녹는점 ${mp}°C.` : '') + (est ? ' 일부 성질은 추정값입니다.' : '');
      add({
        id: solid, name: label, formula: pretty(fx), fx, state: 'powder', cat: 'salt', color: data[2] || '#e6e6ea', density, c: 800, k: 2, salt: { c, a }, base: isBase && soluble(c, a), mp, est, cast: true,
        desc: baseDesc.trim(), up: mp != null ? { at: mp, to: 'M:' + fx, L: 3e5 } : null, dHsol: DISSOLVE_HEAT[fx] || 0,
      });
      if (mp != null) {
        add({
          id: 'M:' + fx, name: '녹은 ' + aname + cname, formula: pretty(fx) + '(l)', fx, state: 'liquid', color: data[2] || '#f0d8b0', density: density * 0.9, c: 1000, k: 1, T0: mp + 15, flow: 2, salt: { c, a }, mp,
          desc: `녹는점 ${mp}°C. 식으면 다시 굳습니다.`, down: { at: mp, to: solid, L: 3e5, cast: true },
        });
      }
      if (soluble(c, a)) {
        const aqId = 'A:' + fx;
        entry.aq = aqId;
        const pH = phOf(c, a);
        const freeze = EUTECTIC[fx] != null ? EUTECTIC[fx] : -5;
        add({
          id: aqId, name: (fx === 'NaCl' ? '소금물' : `${aname}${cname} 용액`), formula: pretty(fx) + '(aq)', fx, state: 'liquid', cat: isBase ? 'base' : 'solution', color: AN_AQ_COLOR[a] || AQ_COLOR[c] || '#3f93c4', density: 1000 + Math.min(300, density / 25), c: 3900, k: 0.6, flow: 5, aq: true, misc: true, salt: { c, a }, base: isBase, pH,
          desc: `pH 약 ${pH}. 끓이면 물이 날아가고 고체가 남습니다.` + (EUTECTIC[fx] != null ? ` 진하면 ${freeze}°C까지 얼지 않습니다.` : ''),
          up: { at: 102, to: [['H2O:g', 0.6], [solid, 0.4]], L: 2.257e6 }, down: { at: freeze, to: [['H2O:s', 0.7], [solid, 0.3]], L: 3.34e5 },
        });
      }
    }
  }

  // ---- 산 ----
  // [별칭, 이름, 화학식, 음이온, 색, 끓을 때 나오는 기체, 강도, pH(약 0.1 mol/L)]
  const ACIDS = [
    ['HCl', '염산', 'HCl', 'Cl', '#b7dc5a', 'HClg', 0.9, 1], ['HBr', '브로민화수소산', 'HBr', 'Br', '#c8c080', 'HBrg', 0.9, 1], ['HI', '아이오딘화수소산', 'HI', 'I', '#c0a080', 'HIg', 0.9, 1],
    ['HF', '플루오린화수소산', 'HF', 'F', '#c8e080', 'HFg', 0.4, 2.1], ['HNO3aq', '묽은 질산', 'HNO3', 'NO3', '#dcd890', 'NO2', 0.9, 1], ['H2SO4aq', '묽은 황산', 'H2SO4', 'SO4', '#d0d0a0', 'SO2', 0.9, 1],
    ['H3PO4', '인산', 'H3PO4', 'PO4', '#d0d8c0', null, 0.3, 1.6], ['CH3COOHaq', '식초(아세트산)', 'CH3COOH', 'CH3COO', '#d8d8b0', 'CH3COOH', 0.15, 2.9], ['H2CO3', '탄산수', 'H2CO3', 'CO3', '#a8d0e0', 'CO2', 0.05, 4], ['H2SO3', '아황산', 'H2SO3', 'SO3x', '#c8d8c0', 'SO2', 0.2, 1.8],
  ];
  for (const [key, name, fx, a, color, gas, strength, pH] of ACIDS) {
    const id = 'A:acid:' + key;
    alias[key] = id;
    add({
      id, name, formula: pretty(fx) + '(aq)', fx, state: 'liquid', cat: 'acid', color, density: 1050, c: 3900, k: 0.55, flow: 5, aq: true, misc: true, acid: { a, strength }, pH,
      desc: `pH 약 ${pH}. 금속, 탄산염, 염기, 금속 산화물과 반응합니다.`,
      up: { at: key === 'H2CO3' ? 60 : 105, to: gas ? [['H2O:g', 0.7], [gas, 0.3]] : 'H2O:g', L: key === 'H2CO3' ? 2e5 : 2.257e6 },
      down: { at: -10, to: 'H2O:s', L: 3.34e5 },
    });
  }
  add({ id: 'aquaregia', name: '왕수', formula: 'HCl+HNO₃', fx: 'HCl', state: 'liquid', cat: 'acid', color: '#e0a040', density: 1200, c: 3000, k: 0.5, flow: 4, aq: true, misc: true, acid: { a: 'Cl', strength: 0.9 }, pH: 0, up: { at: 108, to: [['H2O:g', 0.5], ['NO2', 0.5]], L: 1e6 }, desc: '진한 염산과 진한 질산의 혼합물. 금을 녹입니다.' });

  // ---- 일상 물질, 암석, 장치 ----
  const others = [
    { id: 'air', name: '공기', formula: 'N₂+O₂', fx: 'O2', state: 'gas', color: '#10151b', density: 1.2, c: 1005, k: 0.026, desc: '산소 21%. 연소에 쓰이면 소모됩니다.' },
    { id: 'oil', name: '식용유', formula: 'C₅₇H₁₀₄O₆', fx: 'C57H104O6', state: 'liquid', cat: 'organic', color: '#b58a2e', density: 900, c: 2000, k: 0.15, flow: 3, fuel: { ign: 250, prob: 0.3, prods: CH, T: 1000 }, down: { at: -10, to: 'fat', L: 2e5 }, desc: '물에 뜨는 가연성 액체. 수산화나트륨과 반응해 비누가 됩니다.' },
    { id: 'fat', name: '굳은 기름', formula: '지방', fx: 'C57H104O6', state: 'powder', color: '#d8c890', density: 930, c: 2000, k: 0.15, T0: -20, up: { at: -10, to: 'oil', L: 2e5 } },
    { id: 'soap', name: '비누 용액', formula: 'C₁₈H₃₃NaO₂(aq)', fx: 'C18H33NaO2', state: 'liquid', cat: 'organic', color: '#c8d8c0', density: 1020, c: 3800, k: 0.5, flow: 3, aq: true, misc: true, pH: 10, desc: '기름과 수산화나트륨이 만든 비누입니다(pH 약 10). 센물에서는 찌꺼기가 생깁니다.' },
    { id: 'wood', name: '나무', formula: 'C₆H₁₀O₅', fx: 'C6H10O5', state: 'solid', cat: 'basic', color: '#8a5a2b', density: 600, c: 1700, k: 0.15, desc: '약 300°C에서 공기와 만나면 불이 붙습니다.' },
    { id: 'ember', name: '불씨', formula: '연소 중인 나무', fx: 'C6H10O5', state: 'solid', color: '#e0662a', density: 600, c: 1700, k: 0.05, T0: 600, desc: '산소가 있으면 계속 타고, 없으면 식어서 꺼집니다.', down: { at: 250, to: 'wood', L: 0, silent: true } },
    { id: 'ash', name: '재', formula: 'K₂CO₃ 등', fx: 'K2CO3', state: 'powder', cat: 'basic', color: '#77787a', density: 500, c: 800, k: 0.1, salt: { c: 'K', a: 'CO3' }, desc: '탄 나무가 남긴 가벼운 가루. 주성분인 탄산칼륨이 물에 녹아 미끈한 잿물(염기성)이 되고, 불에 넣으면 칼륨의 보라색 불꽃이 보입니다.' },
    { id: 'smoke', name: '연기', formula: '미세입자', fx: 'C', state: 'gas', cat: 'basic', color: '#555b61', density: 1.0, c: 1000, k: 0.03, T0: 200, lifetime: 500, decay: [['CO2', 1]], desc: '입자가 가라앉으면 연소 기체만 남습니다.' },
    { id: 'sugar', name: '설탕', formula: 'C₁₂H₂₂O₁₁', fx: 'C12H22O11', state: 'powder', cat: 'organic', color: '#f4f2ea', density: 1590, c: 1250, k: 0.2, mp: 186, fuel: { ign: 350, prob: 0.1, prods: CH, T: 900 }, desc: '186°C 부근에서 분해됩니다. 진한 황산이 물을 빼앗으면 탄소만 남습니다.' },
    { id: 'phth', name: '페놀프탈레인', formula: 'C₂₀H₁₄O₄(aq)', fx: 'C20H14O4', state: 'liquid', cat: 'indicator', color: '#c8d8e0', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'phth', desc: 'pH 8.2 위의 염기를 만나면 분홍색이 됩니다. 산성과 중성에서는 무색입니다.' },
    { id: 'phth:pink', name: '분홍색 페놀프탈레인', formula: '염기성', fx: 'C20H14O4', state: 'liquid', color: '#e83a9a', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'phth', desc: '염기성 용액입니다.' },
    { id: 'litmus', name: '리트머스 용액', formula: '지시약', fx: 'C7H7NO4', state: 'liquid', cat: 'indicator', color: '#7a5ab0', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'litmus', desc: 'pH 4.5 아래에서 붉게, 8.3 위에서 푸르게 변합니다. 그 사이에서는 보라색입니다.' },
    { id: 'litmus:red', name: '붉은 리트머스', formula: '산성', fx: 'C7H7NO4', state: 'liquid', color: '#d03040', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'litmus', desc: '산성 용액입니다.' },
    { id: 'litmus:blue', name: '푸른 리트머스', formula: '염기성', fx: 'C7H7NO4', state: 'liquid', color: '#2a50d0', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'litmus', desc: '염기성 용액입니다.' },
    { id: 'btb', name: 'BTB 용액', formula: '지시약', fx: 'C27H28Br2O5S', state: 'liquid', cat: 'indicator', color: '#3f9a4a', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'btb', desc: '브로모티몰 블루. pH 6 아래에서 노랑, 6~7.6에서 초록, 7.6 위에서 파랑입니다. 탄산수처럼 약한 산에도 반응합니다.' },
    { id: 'btb:yellow', name: '노란 BTB', formula: '산성', fx: 'C27H28Br2O5S', state: 'liquid', color: '#e0c828', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'btb', desc: '산성 용액입니다.' },
    { id: 'btb:blue', name: '파란 BTB', formula: '염기성', fx: 'C27H28Br2O5S', state: 'liquid', color: '#2a5ed8', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'btb', desc: '염기성 용액입니다.' },
    { id: 'starch', name: '녹말 용액', formula: '(C₆H₁₀O₅)ₙ(aq)', fx: 'C6H10O5', state: 'liquid', cat: 'indicator', color: '#d8dccc', density: 1010, c: 4000, k: 0.6, flow: 4, aq: true, misc: true, desc: '아이오딘을 만나면 청람색이 됩니다. 데우면 색이 사라졌다가 식으면 돌아옵니다.' },
    { id: 'starch:blue', name: '청람색 녹말 용액', formula: '녹말-아이오딘', fx: 'C6H10O5', state: 'liquid', color: '#1c1e5a', density: 1010, c: 4000, k: 0.6, flow: 4, aq: true, misc: true, desc: '녹말 사슬 속에 아이오딘이 들어간 착물입니다.' },
    { id: 'bleached', name: '탈색된 용액', formula: '산화된 색소(aq)', fx: 'H2O', state: 'liquid', color: '#c4d4dc', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, desc: '표백되어 색을 잃은 색소 용액입니다. 다시 지시약으로 쓸 수 없습니다.' },
    { id: 'foam', name: '거품', formula: 'O₂ + 비누막', fx: 'O2', state: 'powder', color: '#f4f2ee', density: 60, c: 2000, k: 0.05, lifetime: 900, decay: [['air', 0.8], ['soap', 0.2]], desc: '비누 막에 갇힌 기체. 액체 위에 쌓였다가 터져 사라집니다.' },
    { id: 'scum', name: '비누 찌꺼기', formula: 'Ca(C₁₈H₃₃O₂)₂', fx: 'Ca(C18H33O2)2', state: 'powder', color: '#b8b4a6', density: 1030, c: 1800, k: 0.2, desc: '센물의 칼슘·마그네슘 이온과 비누가 만든, 물에 녹지 않는 찌꺼기(욕조의 때).' },

    // 착이온과 생활 화학 용액
    { id: 'A:NaAl(OH)4', name: '알루민산나트륨 용액', formula: 'Na[Al(OH)₄](aq)', fx: 'NaAl(OH)4', state: 'liquid', cat: 'solution', color: '#4f9ac4', density: 1080, c: 3800, k: 0.6, flow: 5, aq: true, misc: true, pH: 13, desc: '양쪽성인 알루미늄이 강염기에 녹아 생긴 용액(pH 약 13).', up: { at: 102, to: [['H2O:g', 0.6], ['S:Al(OH)3', 0.4]], L: 2.257e6 } },
    { id: 'A:Na2Zn(OH)4', name: '아연산나트륨 용액', formula: 'Na₂[Zn(OH)₄](aq)', fx: 'Na2Zn(OH)4', state: 'liquid', cat: 'solution', color: '#4f9ac4', density: 1080, c: 3800, k: 0.6, flow: 5, aq: true, misc: true, pH: 13, desc: '양쪽성인 아연이 강염기에 녹아 생긴 용액(pH 약 13).', up: { at: 102, to: [['H2O:g', 0.6], ['S:Zn(OH)2', 0.4]], L: 2.257e6 } },
    { id: 'A:Cu(NH3)4(OH)2', name: '테트라암민구리(II) 용액', formula: '[Cu(NH₃)₄]²⁺(aq)', fx: 'Cu(NH3)4(OH)2', state: 'liquid', cat: 'solution', color: '#1d2fb0', density: 1020, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 11, desc: '구리 이온에 암모니아 네 분자가 결합한 짙은 남색 착이온. 구리 이온 검출에 씁니다.', up: { at: 60, to: [['NH3:g', 0.5], ['S:Cu(OH)2', 0.5]], L: 5e5 } },
    { id: 'A:Ag(NH3)2Cl', name: '다이암민은 용액', formula: '[Ag(NH₃)₂]Cl(aq)', fx: 'Ag(NH3)2Cl', state: 'liquid', cat: 'solution', color: '#7ab0cc', density: 1020, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 10.5, desc: '염화은이 암모니아수에 녹은 무색 용액. 산을 넣으면 다시 염화은이 가라앉습니다.', up: { at: 60, to: [['NH3:g', 0.5], ['S:AgCl', 0.5]], L: 5e5 } },
    { id: 'A:KSCN', name: '싸이오사이안산칼륨 용액', formula: 'KSCN(aq)', fx: 'KSCN', state: 'liquid', cat: 'solution', color: '#3f93c4', density: 1050, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 7, desc: '철(III) 이온을 만나면 핏빛으로 변합니다. 철 이온 검출 시약입니다.' },
    { id: 'A:Fe(SCN)3', name: '싸이오사이안산철 용액', formula: '[Fe(SCN)]²⁺(aq)', fx: 'Fe(SCN)3', state: 'liquid', color: '#8e0c1c', density: 1050, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, desc: '철(III) 이온과 싸이오사이안산 이온의 핏빛 착이온.' },
    { id: 'A:K2Cr2O7', name: '다이크로뮴산칼륨 용액', formula: 'K₂Cr₂O₇(aq)', fx: 'K2Cr2O7', state: 'liquid', cat: 'solution', color: '#e06a14', density: 1060, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 4, desc: '주황색. 염기를 넣으면 노란 크로뮴산 이온으로 돌아갑니다. 독성이 있습니다.' },
    { id: 'A:NaClO', name: '표백제(차아염소산나트륨)', formula: 'NaClO(aq)', fx: 'NaClO', state: 'liquid', cat: 'base', color: '#d4e0b8', density: 1100, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 11.5, desc: '가정용 락스. 색소를 산화시켜 표백합니다. 산성 세제와 섞으면 염소 기체가 나옵니다(절대 섞지 마세요).', up: { at: 102, to: [['H2O:g', 0.7], ['S:NaCl', 0.3]], L: 2.257e6 } },
    { id: 'A:Ca(HCO3)2', name: '센물(탄산수소칼슘)', formula: 'Ca(HCO₃)₂(aq)', fx: 'Ca(HCO3)2', state: 'liquid', cat: 'solution', color: '#5aa0c8', density: 1010, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, hard: true, pH: 8, desc: '석회암 지대의 물. 이산화탄소가 빠지면 탄산칼슘이 쌓여 종유석과 물때가 됩니다. 비누 거품이 잘 안 납니다.', up: { at: 102, to: [['H2O:g', 0.6], ['S:CaCO3', 0.4]], L: 2.257e6 } },
    { id: 'S:CuSO4·5H2O', name: '황산구리 오수화물', formula: 'CuSO₄·5H₂O', fx: 'CuSO4·5H2O', state: 'powder', cat: 'salt', color: '#2a7ae0', density: 2290, c: 1100, k: 1, desc: '파란 결정. 110°C 넘게 가열하면 물이 빠져 흰 무수 황산구리가 됩니다.' },
    { id: 'S:CoCl2·6H2O', name: '염화코발트 육수화물', formula: 'CoCl₂·6H₂O', fx: 'CoCl2·6H2O', state: 'powder', cat: 'salt', color: '#d0507a', density: 1920, c: 1100, k: 1, desc: '분홍 결정. 가열하면 물이 빠져 파랗게 됩니다.' },
    { id: 'S:Cu2(OH)2CO3', name: '염기성 탄산구리 (녹청)', formula: 'Cu₂(OH)₂CO₃', fx: 'Cu2(OH)2CO3', state: 'powder', cat: 'salt', color: '#3c9a74', density: 4000, c: 800, k: 1, desc: '구리의 푸른 녹이자 공작석의 성분. 가열하면 검은 산화구리가 됩니다.' },
    { id: 'A:sugar', name: '설탕물', formula: 'C₁₂H₂₂O₁₁(aq)', fx: 'C12H22O11', state: 'liquid', cat: 'solution', color: '#a8cde0', density: 1100, c: 3700, k: 0.55, flow: 4, aq: true, misc: true, pH: 7, desc: '설탕이 녹은 물. 설탕은 환원성이 없어 베네딕트 반응을 하지 않습니다.', up: { at: 103, to: [['H2O:g', 0.6], ['sugar', 0.4]], L: 2.257e6 }, down: { at: -3, to: [['H2O:s', 0.7], ['sugar', 0.3]], L: 3.34e5 } },
    { id: 'glucose', name: '포도당', formula: 'C₆H₁₂O₆', fx: 'C6H12O6', state: 'powder', cat: 'organic', color: '#f2f0e4', density: 1540, c: 1200, k: 0.2, mp: 146, fuel: { ign: 350, prob: 0.1, prods: CH, T: 900 }, desc: '환원성이 있는 당. 물에 잘 녹고, 베네딕트 용액과 데우면 붉은 앙금을 만듭니다.' },
    { id: 'A:glucose', name: '포도당 용액', formula: 'C₆H₁₂O₆(aq)', fx: 'C6H12O6', state: 'liquid', cat: 'solution', color: '#a8cde0', density: 1080, c: 3800, k: 0.55, flow: 4, aq: true, misc: true, pH: 7, desc: '베네딕트 용액·암모니아성 질산은 용액과 데우면 반응합니다(환원당 검출).', up: { at: 102, to: [['H2O:g', 0.6], ['glucose', 0.4]], L: 2.257e6 } },
    { id: 'benedict', name: '베네딕트 용액', formula: 'Cu²⁺ 착이온(aq)', fx: 'CuSO4', state: 'liquid', cat: 'indicator', color: '#2a6fd8', density: 1050, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 10, desc: '포도당 같은 환원당과 함께 데우면 황적색 산화구리(I) 앙금이 생깁니다. 설탕과 녹말은 반응하지 않습니다.' },
    { id: 'S:Cu2O', name: '산화구리(I)', formula: 'Cu₂O', fx: 'Cu2O', state: 'powder', cat: 'salt', color: '#c0441c', density: 6000, c: 450, k: 2, mp: 1232, desc: '황적색 앙금. 베네딕트 반응의 결과물입니다. 녹는점 1232°C.' },
    { id: 'S:CuI', name: '아이오딘화 구리(I)', formula: 'CuI', fx: 'CuI', state: 'powder', cat: 'salt', color: '#e6dccc', density: 5670, c: 300, k: 1, mp: 606, desc: '구리(II) 이온이 아이오딘화 이온을 만나 생기는 흰 앙금. 함께 생긴 아이오딘 때문에 갈색으로 보입니다.' },
    { id: 'A:KI3', name: '아이오딘 용액 (루골)', formula: 'I₂ + KI(aq)', fx: 'KI3', state: 'liquid', cat: 'indicator', color: '#8a4a12', density: 1050, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 7, desc: '아이오딘이 아이오딘화 칼륨 용액에 녹은 갈색 용액. 녹말을 만나면 청람색이 됩니다.', up: { at: 102, to: [['H2O:g', 0.7], ['I:g', 0.3]], L: 2.257e6 } },
    { id: 'A:Na2S2O3', name: '싸이오황산나트륨 용액', formula: 'Na₂S₂O₃(aq)', fx: 'Na2S2O3', state: 'liquid', cat: 'solution', color: '#3f93c4', density: 1080, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 7.5, desc: '산을 만나면 서서히 뿌옇게 황이 생깁니다(반응 속도 실험). 아이오딘의 색을 없앱니다.' },
    { id: 'oleic', name: '지방산 (올레산)', formula: 'C₁₈H₃₄O₂', fx: 'C18H34O2', state: 'liquid', cat: 'organic', color: '#c8b070', density: 895, c: 2000, k: 0.15, flow: 3, fuel: { ign: 360, prob: 0.2, prods: CH, T: 1000 }, down: { at: 13, to: 'fat', L: 1.4e5 }, desc: '비누에 산을 넣으면 생기는 기름 같은 산. 물에 뜨고 섞이지 않습니다.' },
    { id: 'ethoxide', name: '소듐 에톡사이드 용액', formula: 'C₂H₅ONa(에탄올)', fx: 'C2H5ONa', state: 'liquid', color: '#d8d0b0', density: 870, c: 2400, k: 0.17, flow: 4, misc: true, pH: 13, fuel: { ign: 365, prob: 0.2, prods: ['Na2CO3', 'CO2', 'H2O'], T: 1000 }, desc: '나트륨이 에탄올과 반응해 생긴 강한 염기. 물을 만나면 수산화나트륨과 에탄올이 됩니다.' },
    { id: 'S:Fe3O4', name: '사산화삼철 (자철석)', formula: 'Fe₃O₄', fx: 'Fe3O4', state: 'powder', cat: 'salt', color: '#2c2c30', density: 5170, c: 650, k: 2, mp: 1597, desc: '뜨거운 철이 수증기나 산소와 만나 생기는 검은 산화철. 자석에 붙습니다.' },
    { id: 'S:Mg3N2', name: '질화마그네슘', formula: 'Mg₃N₂', fx: 'Mg3N2', state: 'powder', cat: 'salt', color: '#c8c88c', density: 2710, c: 1000, k: 1, desc: '마그네슘이 질소 속에서 타며 생기는 노란빛 가루. 물을 만나면 암모니아를 냅니다.' },
    { id: 'S:Li3N', name: '질화리튬', formula: 'Li₃N', fx: 'Li3N', state: 'powder', cat: 'salt', color: '#8a3038', density: 1270, c: 1500, k: 1, mp: 813, desc: '리튬은 상온에서도 질소와 반응하는 유일한 알칼리 금속입니다. 물을 만나면 암모니아를 냅니다.' },
    { id: 'amalgam', name: '금 아말감', formula: 'Au-Hg', fx: 'AuHg', state: 'powder', cat: 'alloy', color: '#cfc6a8', density: 15000, c: 140, k: 8, desc: '수은에 금이 녹은 반죽. 가열하면 수은이 증발하고 금이 남습니다(옛 금 정련법, 수은 증기는 매우 유독).' },
    { id: 'brominewater', name: '브로민수', formula: 'Br₂(aq)', fx: 'Br2', state: 'liquid', cat: 'solution', color: '#d0801c', density: 1010, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, pH: 5, desc: '브로민이 녹은 주황색 물. 에틸렌 같은 이중 결합 물질을 만나면 색이 사라집니다(불포화 검출).' },
    { id: 'tincture', name: '아이오딘 팅크', formula: 'I₂(에탄올)', fx: 'I2', state: 'liquid', cat: 'indicator', color: '#6a2a10', density: 830, c: 2400, k: 0.2, flow: 5, misc: true, desc: '아이오딘을 에탄올에 녹인 갈색 소독약. 녹말을 만나면 청람색이 됩니다.' },
    { id: 'A:K2MnO4', name: '망가니즈산칼륨 용액', formula: 'K₂MnO₄(aq)', fx: 'K2MnO4', state: 'liquid', color: '#2c8a3c', density: 1060, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 13, desc: '초록색. 염기성에서 과망가니즈산 이온이 환원된 중간 단계입니다(카멜레온 반응).' },
    { id: 'emulsion', name: '비누에 유화된 기름', formula: '미셀(aq)', fx: 'C57H104O6', state: 'liquid', cat: null, color: '#e4dcc4', density: 990, c: 3500, k: 0.4, flow: 4, misc: true, aq: true, desc: '비누 분자가 기름 방울을 감싸 물에 섞이게 된 뿌연 액체. 비누가 때를 빼는 원리입니다.' },
    { id: 'eggwhite', name: '달걀흰자', formula: '단백질(aq)', fx: 'C', state: 'liquid', cat: 'organic', color: '#e8e8c8', density: 1040, c: 3700, k: 0.5, flow: 1, misc: true, desc: '단백질 용액. 약 62°C 넘게 데우거나 산·알코올·중금속 이온을 만나면 굳습니다(변성).', up: { at: 65, to: 'eggwhite:cooked', L: 2e4 } },
    { id: 'eggwhite:cooked', name: '굳은 흰자', formula: '변성 단백질', fx: 'C', state: 'powder', color: '#fafaf4', density: 1040, c: 3500, k: 0.5, fuel: { ign: 300, prob: 0.05, prods: ['CO2'], T: 800 }, desc: '열이나 산으로 단백질의 구조가 풀려 굳은 것. 식혀도 다시 투명해지지 않습니다.' },
    { id: 'eggwhite:yellow', name: '노랗게 변한 단백질', formula: '잔토프로테인', fx: 'C', state: 'powder', color: '#e8c020', density: 1100, c: 3000, k: 0.5, desc: '진한 질산이 단백질의 고리 구조와 반응해 노랗게 변한 것(잔토프로테인 반응).' },
    { id: 'biuret', name: '보라색 단백질 용액', formula: '뷰렛 반응', fx: 'C', state: 'liquid', color: '#8a3ab8', density: 1050, c: 3800, k: 0.5, flow: 3, misc: true, aq: true, desc: '염기성에서 구리 이온이 단백질의 펩타이드 결합과 결합한 보라색(뷰렛 반응).' },
    { id: 'liver', name: '생간 조각', formula: '카탈레이스 효소', fx: 'C', state: 'solid', cat: 'organic', color: '#7a2a2a', density: 1060, c: 3500, k: 0.5, desc: '카탈레이스 효소가 과산화수소를 빠르게 분해합니다. 익히면(70°C 이상) 효소가 망가져 작용하지 않습니다.', up: { at: 70, to: 'liver:cooked', L: 5e4 } },
    { id: 'liver:cooked', name: '익은 간', formula: '변성된 효소', fx: 'C', state: 'solid', color: '#5a3a2a', density: 1060, c: 3500, k: 0.5, fuel: { ign: 300, prob: 0.05, prods: ['CO2'], T: 800 }, desc: '효소가 열로 변성되어 과산화수소를 분해하지 못합니다.' },
    // ---- 지시약 ----
    { id: 'cabbage', name: '적양배추 지시약', formula: '안토사이아닌(aq)', fx: 'C15H11O6', state: 'liquid', cat: 'indicator', color: '#7a4aa0', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'cabbage', desc: '자주색. pH에 따라 빨강(강산) → 분홍 → 자주(중성) → 파랑 → 초록 → 노랑(강염기)으로 변하는 천연 지시약입니다.' },
    ...[['red', '빨간', '#d02050', '강산성'], ['pink', '분홍', '#c84a98', '약산성'], ['blue', '파란', '#3a5ad0', '약염기성'], ['green', '초록', '#2f9a5a', '염기성'], ['yellow', '노란', '#d8c830', '강염기성']].map(([k, n, color, what]) => ({ id: 'cabbage:' + k, name: n + ' 적양배추 지시약', formula: what, fx: 'C15H11O6', state: 'liquid', color, density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'cabbage', desc: what + ' 용액입니다.' })),
    { id: 'mo', name: '메틸 오렌지', formula: '지시약', fx: 'C14H14N3NaO3S', state: 'liquid', cat: 'indicator', color: '#f08020', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'mo', desc: 'pH 3.1 아래에서 빨강, 4.4 위에서 노랑입니다. 강산을 약염기로 적정할 때 씁니다.' },
    { id: 'mo:red', name: '빨간 메틸 오렌지', formula: '산성', fx: 'C14H14N3NaO3S', state: 'liquid', color: '#d82828', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'mo', desc: 'pH 3.1 아래입니다.' },
    { id: 'mo:yellow', name: '노란 메틸 오렌지', formula: 'pH 4.4 이상', fx: 'C14H14N3NaO3S', state: 'liquid', color: '#f0d020', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'mo', desc: 'pH 4.4 위입니다.' },
    { id: 'luminol', name: '루미놀 용액', formula: 'C₈H₇N₃O₂(염기성)', fx: 'C8H7N3O2', state: 'liquid', cat: 'indicator', color: '#c8d0e0', density: 1010, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, pH: 11, desc: '과산화수소와 철 같은 촉매(혈액의 헤모글로빈)를 만나면 파랗게 빛납니다. 과학 수사에서 혈흔을 찾는 데 씁니다.' },
    { id: 'luminol:glow', name: '빛나는 루미놀', formula: '화학 발광', fx: 'C8H7N3O2', state: 'liquid', color: '#5a8cff', density: 1010, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, glow: [90, 150, 255], lifetime: 150, decay: [['luminol:spent', 1]], desc: '산화될 때 나온 에너지가 열 대신 빛으로 나옵니다(화학 발광).' },
    { id: 'luminol:spent', name: '빛이 꺼진 루미놀', formula: '3-아미노프탈산염', fx: 'C8H7N3O2', state: 'liquid', color: '#b8c4d4', density: 1010, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, desc: '반응이 끝나 더 빛나지 않습니다.' },

    // ---- 부엌과 집 ----
    { id: 'citric', name: '구연산', formula: 'C₆H₈O₇', fx: 'C6H8O7', state: 'powder', cat: 'organic', color: '#f4f4ec', density: 1665, c: 1200, k: 0.2, mp: 153, desc: '레몬의 신맛을 내는 약한 산. 물때(탄산칼슘)와 녹을 녹여 청소에 씁니다.' },
    { id: 'A:citric', name: '구연산 용액 (레몬즙)', formula: 'C₆H₈O₇(aq)', fx: 'C6H8O7', state: 'liquid', cat: 'acid', color: '#e8e4a8', density: 1040, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 2.3, desc: 'pH 약 2.3의 약한 산. 베이킹소다와 거품을 내고, 물때·녹을 녹이며, 우유를 굳힙니다.', up: { at: 103, to: [['H2O:g', 0.7], ['citric', 0.3]], L: 2.257e6 } },
    { id: 'A:citrate', name: '시트르산염 용액', formula: '시트르산 이온(aq)', fx: 'Na3C6H5O7', state: 'liquid', cat: null, color: '#b8d4e0', density: 1060, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 7.5, desc: '구연산이 염기·탄산염·녹과 반응해 생긴 용액.' },
    { id: 'A:vitc', name: '비타민 C 용액', formula: 'C₆H₈O₆(aq)', fx: 'C6H8O6', state: 'liquid', cat: 'solution', color: '#e8e0b0', density: 1020, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 3, desc: '환원제(항산화제). 아이오딘의 갈색, 과망가니즈산 칼륨의 보라색을 없애고 철(III)을 철(II)로 바꿉니다.' },
    { id: 'milk', name: '우유', formula: '단백질·지방(aq)', fx: 'C', state: 'liquid', cat: 'organic', color: '#f4f2ea', density: 1030, c: 3900, k: 0.55, flow: 4, aq: true, misc: true, pH: 6.7, desc: '카제인 단백질이 퍼져 있는 액체. 산을 만나면 몽글몽글 굳습니다(치즈·두부의 원리).', up: { at: 100, to: [['H2O:g', 0.8], ['curd', 0.2]], L: 2.257e6 } },
    { id: 'curd', name: '응유 (굳은 우유)', formula: '카제인', fx: 'C', state: 'powder', color: '#faf8ee', density: 1080, c: 3000, k: 0.4, desc: '산 때문에 카제인 단백질이 엉긴 덩어리. 치즈의 시작입니다.' },
    { id: 'whey', name: '유청', formula: '유청(aq)', fx: 'H2O', state: 'liquid', color: '#e8e4b8', density: 1025, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, pH: 4.6, desc: '우유가 굳고 남은 노르스름한 물.' },
    { id: 'mentos', name: '박하 사탕', formula: '설탕·고무 코팅', fx: 'C12H22O11', state: 'powder', cat: 'organic', color: '#f8f8f0', density: 1500, c: 1250, k: 0.2, desc: '울퉁불퉁한 표면이 탄산수 속 이산화탄소가 거품으로 빠져나오는 자리가 되어 거품이 뿜어져 나옵니다(물리 변화).' },
    { id: 'glue', name: '물풀 (PVA)', formula: '(C₂H₄O)ₙ(aq)', fx: 'C2H4O', state: 'liquid', cat: 'organic', color: '#e8eef4', density: 1100, c: 3500, k: 0.4, flow: 2, misc: true, aq: true, pH: 6, desc: '폴리비닐 알코올 사슬이 녹은 풀. 붕사 용액을 만나면 사슬끼리 묶여 슬라임이 됩니다.' },
    { id: 'S:borax', name: '붕사', formula: 'Na₂B₄O₇·10H₂O', fx: 'Na2B4O7', state: 'powder', cat: 'salt', color: '#f0f0ec', density: 1730, c: 1600, k: 0.5, desc: '세탁 보조제. 물에 녹으면 약한 염기(pH 9.2)가 됩니다.' },
    { id: 'A:borax', name: '붕사 용액', formula: 'Na₂B₄O₇(aq)', fx: 'Na2B4O7', state: 'liquid', cat: 'base', color: '#3f93c4', density: 1030, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 9.2, desc: '물풀과 섞으면 슬라임이 됩니다.' },
    { id: 'slime', name: '슬라임', formula: 'PVA-붕산 교차 결합', fx: 'C2H4O', state: 'liquid', cat: null, color: '#6ad0a0', density: 1080, c: 3500, k: 0.4, flow: 1, desc: '긴 사슬들이 붕산 이온으로 느슨하게 묶여 천천히 흐르는 고분자.' },
    { id: 'supersat', name: '과포화 아세트산나트륨 용액', formula: 'NaCH₃COO(aq, 과포화)', fx: 'NaCH3COO', state: 'liquid', cat: 'solution', color: '#d8e4ec', density: 1300, c: 3000, k: 0.5, flow: 3, misc: true, aq: true, pH: 8.9, desc: '녹을 수 있는 양보다 더 녹아 있는 불안정한 용액. 결정 하나만 닿아도 순식간에 굳으며 54°C까지 뜨거워집니다(재사용 손난로, "핫 아이스").' },
    { id: 'yeast', name: '효모', formula: '효모균', fx: 'C', state: 'powder', cat: 'organic', color: '#c8a870', density: 1100, c: 3500, k: 0.3, desc: '설탕물이나 포도당 용액을 15~45°C에서 에탄올과 이산화탄소로 발효시킵니다. 60°C를 넘으면 죽습니다. 카탈레이스도 있어 과산화수소를 분해합니다.', up: { at: 60, to: 'yeast:dead', L: 5e4 } },
    { id: 'yeast:dead', name: '죽은 효모', formula: '변성된 효모', fx: 'C', state: 'powder', color: '#a08860', density: 1100, c: 3500, k: 0.3, desc: '열로 죽어 발효하지 못합니다.' },

    // ---- 건축 재료 ----
    { id: 'cement', name: '시멘트', formula: 'Ca₃SiO₅ 등', fx: 'Ca3SiO5', state: 'powder', cat: 'rock', color: '#a8a8a0', density: 1440, c: 840, k: 0.3, desc: '물과 반응(수화)해 단단한 콘크리트가 됩니다. 굳으면서 열이 납니다.' },
    { id: 'concrete', name: '콘크리트', formula: '규산칼슘 수화물', fx: 'Ca3SiO5', state: 'solid', cat: null, color: '#8c8c88', density: 2400, c: 880, k: 1.4, desc: '시멘트가 물과 반응해 굳은 돌. 산성비에 조금씩 깎입니다.' },
    { id: 'plaster', name: '소석고', formula: 'CaSO₄·½H₂O', fx: 'CaSO4', state: 'powder', cat: 'rock', color: '#f0eee4', density: 2550, c: 1000, k: 0.3, desc: '물을 만나면 다시 석고로 굳습니다(깁스, 석고상).' },
    { id: 'gypsum', name: '석고', formula: 'CaSO₄·2H₂O', fx: 'CaSO4', state: 'solid', cat: null, color: '#f6f4ec', density: 2320, c: 1090, k: 0.5, desc: '굳은 석고. 150°C 정도로 가열하면 물이 빠져 다시 소석고 가루가 됩니다.' },
    { id: 'clay', name: '점토', formula: 'Al₂Si₂O₅(OH)₄', fx: 'Al2Si2O5(OH)4', state: 'powder', cat: 'rock', color: '#b88a5a', density: 1700, c: 920, k: 0.4, desc: '물을 머금으면 빚을 수 있는 진흙이 되고, 약 900°C로 구우면 단단한 도자기가 됩니다.', up: { at: 900, to: 'ceramic', L: 2e5 } },
    { id: 'mud', name: '젖은 점토', formula: '점토 + 물', fx: 'Al2Si2O5(OH)4', state: 'powder', cat: null, color: '#8a6040', density: 1900, c: 2000, k: 0.8, desc: '물을 머금은 점토. 마르면(100°C) 다시 점토가 됩니다.', up: { at: 100, to: [['clay', 0.7], ['H2O:g', 0.3]], L: 6e5 } },
    { id: 'ceramic', name: '도자기', formula: '구운 점토', fx: 'Al2Si2O5(OH)4', state: 'solid', cat: null, color: '#c8704a', density: 2300, c: 900, k: 1.2, desc: '구운 점토. 물에 다시 풀어지지 않습니다.' },

    // ---- 화학 정원과 실험 ----
    { id: 'A:Na2SiO3', name: '물유리 (규산나트륨)', formula: 'Na₂SiO₃(aq)', fx: 'Na2SiO3', state: 'liquid', cat: 'base', color: '#a8c4cc', density: 1300, c: 3500, k: 0.6, flow: 3, aq: true, misc: true, pH: 12.5, desc: '끈적한 강염기 용액. 금속염 결정을 넣으면 색깔 있는 관이 자라는 "화학 정원"이 생기고, 산을 넣으면 실리카겔이 됩니다.' },
    { id: 'silicagel', name: '실리카겔', formula: 'SiO₂·nH₂O', fx: 'SiO2', state: 'powder', cat: null, color: '#e8eef0', density: 700, c: 900, k: 0.2, desc: '구멍이 많은 이산화규소. 습기를 빨아들이는 제습제입니다.' },
    { id: 'S:(NH4)2Cr2O7', name: '다이크로뮴산암모늄', formula: '(NH₄)₂Cr₂O₇', fx: '(NH4)2Cr2O7', state: 'powder', cat: 'salt', color: '#e86018', density: 2150, c: 1000, k: 0.5, desc: '주황 결정. 불을 붙이면 불꽃을 튀기며 부피가 큰 초록색 산화크로뮴이 솟는 "화산" 반응을 합니다. 독성이 있습니다.' },
    { id: 'snake', name: '탄소 뱀', formula: 'C (거품 구조)', fx: 'C', state: 'powder', color: '#1c1c1c', density: 150, c: 700, k: 0.05, desc: '설탕이 타며 나온 탄소가 이산화탄소 거품에 부풀어 오른 가벼운 덩어리.' },
    { id: 'NH2Cl', name: '클로라민', formula: 'NH₂Cl', fx: 'NH2Cl', state: 'gas', color: '#2a3226', density: 2.14, c: 900, k: 0.03, desc: '표백제와 암모니아를 섞으면 생기는 유독한 기체. 기침과 폐 손상을 일으킵니다. 절대 섞지 마세요.' },
    ...[['Cu', '#2a70c8'], ['Co', '#4a3aa8'], ['Ni', '#3aa060'], ['Fe3', '#a85a20'], ['Fe2', '#4a6a40'], ['Mn', '#d8a0b8'], ['Ca', '#ecece4'], ['Zn', '#dce8e8']].flatMap(([k, color]) => [
      { id: 'garden:' + k, name: '화학 정원의 관', formula: '금속 규산염', fx: 'SiO2', state: 'solid', color, density: 2000, c: 900, k: 0.5, desc: '금속 이온과 규산 이온이 만나 생긴 얇은 막. 안쪽 용액이 위로 솟으며 관이 자랍니다.' },
      { id: 'gjet:' + k, name: '솟아오르는 금속염 용액', formula: '금속염(aq)', fx: 'SiO2', state: 'liquid', color, density: 1060, c: 3900, k: 0.6, flow: 1, lifetime: 120, decay: [['garden:' + k, 1]], desc: '물유리보다 가벼워 위로 솟으며 바깥에 막을 남깁니다.' },
    ]),
    { id: 'S:CaC2', name: '탄화칼슘 (카바이드)', formula: 'CaC₂', fx: 'CaC2', state: 'powder', cat: 'salt', color: '#5a5650', density: 2220, c: 950, k: 1, mp: 2160, desc: '물을 만나면 아세틸렌을 냅니다. 녹는점 2160°C.' },

    { id: 'sand', name: '모래', formula: 'SiO₂', fx: 'SiO2', state: 'powder', cat: 'rock', color: '#d3b673', density: 1600, c: 830, k: 0.3, mp: 1713, cast: true, desc: '녹는점 1713°C. 녹았다 식으면 유리가 됩니다.', up: { at: 1713, to: 'moltenglass', L: 1.4e5 } },
    { id: 'quartz', name: '석영', formula: 'SiO₂', fx: 'SiO2', state: 'solid', cat: 'rock', color: '#e8e4dc', density: 2650, c: 740, k: 3, mp: 1713, desc: '녹는점 1713°C.', up: { at: 1713, to: 'moltenglass', L: 1.4e5 } },
    { id: 'stone', name: '화강암', formula: 'SiO₂+Al₂O₃', fx: 'SiO2', state: 'solid', cat: 'rock', color: '#767e88', density: 2700, c: 790, k: 2.8, mp: 1215, desc: '약 1215°C에서 녹아 용암이 됩니다.', up: { at: 1215, to: 'lava', L: 4e5 } },
    { id: 'basalt', name: '현무암', formula: '규산염', fx: 'SiO2', state: 'solid', cat: 'rock', color: '#3e4246', density: 3000, c: 840, k: 1.7, mp: 1100, desc: '용암이 식어 굳은 어두운 암석. 약 1100°C에서 녹습니다.', up: { at: 1100, to: 'lava', L: 4e5 } },
    { id: 'marble', name: '대리암', formula: 'CaCO₃', fx: 'CaCO3', state: 'solid', cat: 'rock', color: '#e4e2da', density: 2700, c: 880, k: 2.5, salt: { c: 'Ca', a: 'CO3' }, desc: '석회암이 변성된 암석. 산에 녹습니다.' },
    { id: 'lava', name: '용암', formula: '규산염 용융체', fx: 'SiO2', state: 'liquid', cat: 'rock', color: '#f0531c', density: 2600, c: 1100, k: 2, T0: 1400, flow: 1, desc: '약 1100°C 아래로 식으면 현무암으로 굳습니다.', down: { at: 1100, to: 'basalt', L: 4e5 } },
    { id: 'glass', name: '유리', formula: 'SiO₂ 유리', fx: 'SiO2', state: 'solid', cat: 'rock', color: '#9fd6d8', density: 2500, c: 840, k: 1, desc: '약 1400°C에서 흐르기 시작합니다. 플루오린화수소산에 녹습니다.', up: { at: 1400, to: 'moltenglass', L: 1.4e5 } },
    { id: 'moltenglass', name: '녹은 유리', formula: 'SiO₂(l)', fx: 'SiO2', state: 'liquid', cat: null, color: '#ffb347', density: 2300, c: 1000, k: 1.5, T0: 1500, flow: 1, desc: '식으면 유리가 됩니다.', down: { at: 1100, to: 'glass', L: 1.4e5 } },

    { id: 'wall', name: '단열벽', formula: '-', state: 'solid', cat: 'device', color: '#3a424c', density: 2000, c: 1000, k: 0.001, inert: true, armor: true, desc: '열을 거의 전달하지 않는 벽. 폭발에도 부서지지 않습니다.' },
    { id: 'firebrick', name: '내화벽돌', formula: 'Al₂O₃+SiO₂', state: 'solid', cat: 'device', color: '#a8644a', density: 2000, c: 1000, k: 1, inert: true, armor: true, desc: '녹지 않고 열을 천천히 전달합니다. 용광로의 안쪽 벽입니다.' },

    // 핵·방사성 (개념 학습용 단순화 모형)
    { id: 'nsource', name: '중성자원 (Am-Be)', formula: '²⁴¹Am+Be', state: 'solid', cat: 'nuclear', color: '#c8a0f0', density: 5000, c: 500, k: 20, inert: true, spont: 0.03, decayHeat: 5, desc: '계속 중성자를 내보내는 장치. 원자로를 켤 때 씁니다. 스스로 연쇄 반응을 하지는 않습니다.' },
    { id: 'controlrod', name: '제어봉 (탄화붕소)', formula: 'B₄C', state: 'solid', cat: 'nuclear', color: '#4a4a56', density: 2520, c: 950, k: 30, inert: true, absorb: 0.95, desc: '중성자를 흡수해 연쇄 반응을 멈춥니다. 원자로의 브레이크입니다.' },
    { id: 'graphite', name: '흑연 블록', formula: 'C', fx: 'C', state: 'solid', cat: 'nuclear', color: '#3a3c40', density: 2200, c: 710, k: 120, moderator: true, absorb: 0.001, desc: '중성자를 느리게 만드는 감속재. 아주 뜨거워지면 공기 중에서 탑니다(체르노빌 사고).' },
    { id: 'fallout', name: '핵분열 생성물', formula: '¹³⁷Cs, ⁹⁰Sr, ¹³¹I …', fx: 'Cs', state: 'powder', cat: 'nuclear', color: '#9aa84a', density: 6000, c: 300, k: 2, radioactive: true, decayHeat: 300, absorb: 0.1, lifetime: 2400, decay: [['fallout:old', 1]], desc: '핵분열로 생긴 방사성 원자들. 처음에는 붕괴열이 커서 스스로 뜨거워지고, 시간이 지나면 식습니다. 중성자를 조금 흡수합니다(독물질).' },
    { id: 'fallout:old', name: '식은 핵분열 생성물', formula: '사용후 핵연료 성분', fx: 'Cs', state: 'powder', color: '#7a8450', density: 6000, c: 300, k: 2, radioactive: true, decayHeat: 3, absorb: 0.1, desc: '붕괴열이 줄었지만 여전히 방사성입니다. 오랫동안 냉각하고 격리해야 합니다.' },
    { id: 'electrode+', name: '(+)극 전극', formula: '흑연, 전원 +', fx: 'C', state: 'solid', cat: 'device', color: '#c84040', density: 2200, c: 710, k: 100, inert: true, electrode: 1, desc: '전원의 + 쪽에 연결된 흑연 전극(산화가 일어나는 곳). (−)극과 같은 전해질 용액에 닿아 있어야 전류가 흐릅니다. 닿아 있는 금속도 전극이 됩니다.' },
    { id: 'electrode-', name: '(−)극 전극', formula: '흑연, 전원 −', fx: 'C', state: 'solid', cat: 'device', color: '#4060c8', density: 2200, c: 710, k: 100, inert: true, electrode: 2, desc: '전원의 − 쪽에 연결된 흑연 전극(환원이 일어나는 곳). 금속 이온이 여기에 석출되거나 수소가 나옵니다.' },
    { id: 'heater', name: '가열판', formula: '800°C', state: 'solid', cat: 'device', color: '#d8392b', density: 5000, c: 1000, k: 80, T0: 800, fixed: true, inert: true, desc: '항상 800°C를 유지합니다.' },
    { id: 'furnace', name: '용광로판', formula: '2000°C', state: 'solid', cat: 'device', color: '#f07a10', density: 5000, c: 1000, k: 80, T0: 2000, fixed: true, inert: true, desc: '항상 2000°C를 유지합니다. 철도 녹습니다.' },
    { id: 'cooler', name: '냉각판', formula: '-60°C', state: 'solid', cat: 'device', color: '#3bb4d8', density: 5000, c: 1000, k: 80, T0: -60, fixed: true, inert: true, desc: '항상 -60°C를 유지합니다.' },
    { id: 'cryoplate', name: '극저온판', formula: '-250°C', state: 'solid', cat: 'device', color: '#7a90f0', density: 5000, c: 1000, k: 80, T0: -250, fixed: true, inert: true, desc: '항상 -250°C를 유지합니다. 공기 속 기체도 얼립니다.' },
  ];
  others.forEach(add);

  // 합금
  [['steel', '강철', 'Fe+C', 7850, 1450, 2860, '#7f878f', 50], ['bronze', '청동', 'Cu+Sn', 8800, 950, 2300, '#a9793a', 60], ['brass', '황동', 'Cu+Zn', 8500, 930, 1100, '#c9a53c', 110], ['solder', '땜납', 'Sn+Pb', 8400, 183, 1600, '#a8aeb4', 50]].forEach(([key, name, f, rho, mp, bp, color, k]) => {
    family({ key, name, fx: f.replace('+', ''), M: 60, rho: rho / 1000, mp, bp, k, c: 450, color, cat: 'alloy', cast: true, flow: 2 });
    list.filter((d) => d.sp === key).forEach((d) => {
      d.formula = f + (d.state === 'powder' ? '' : d.state === 'liquid' ? '(l)' : '(g)');
      if (key === 'steel' && d.state !== 'gas') d.metal = 'Fe'; // 강철은 대부분 철이므로 산·산소·이온과 철처럼 반응한다.
    });
  });

  // 농축 우라늄: 우라늄-235 비율을 높인 우라늄. 화학적으로는 우라늄과 같다.
  family({ key: 'HEU', name: '농축 우라늄', fx: 'U', M: 235, rho: 19.05, mp: 1132, bp: 4131, k: 27, c: 116, color: '#6c7a52', cat: 'nuclear', flow: 2, metal: 'U', radioactive: true,
    tags: { fissile: { fast: 0.09, thermal: 0.4 }, spont: 1e-4, decayHeat: 0.06, absorb: 0 },
    desc: '우라늄-235를 많이 담은 우라늄. 작은 덩어리는 중성자가 빠져나가 안전하지만, 임계 질량을 넘게 모이면 연쇄 반응이 일어납니다. 물이나 흑연이 중성자를 느리게 하면 더 적은 양으로도 반응합니다.' });

  // 핵분열 성질과 방사성 붕괴열(W/kg, 대표 동위원소 기준 대략값)
  const NUCLEAR = {
    U: { fissile: { fast: 0.002, thermal: 0.012 }, spont: 1e-6, absorb: 0.02, decayHeat: 1e-5, note: '천연 우라늄은 우라늄-235가 0.7%뿐이라 그대로 쌓아서는 연쇄 반응이 일어나지 않습니다.' },
    Pu: { fissile: { fast: 0.12, thermal: 0.45 }, spont: 5e-4, absorb: 0, decayHeat: 2.5, note: '우라늄-235보다 임계 질량이 작고, 자발 핵분열로 중성자를 스스로 냅니다. 만지면 약간 따뜻합니다.' },
    Po: { decayHeat: 140000, note: '폴로늄-210은 붕괴열이 매우 커서 스스로 수백 °C까지 달아오르고 증발합니다.' },
    Ra: { decayHeat: 30, note: '라듐은 붕괴열로 주변보다 조금 따뜻합니다.' },
    Am: { decayHeat: 110, note: '아메리슘-241은 화재 감지기에 들어 있습니다.' },
    Cm: { decayHeat: 2800, note: '퀴륨-244는 붕괴열이 커서 우주 탐사선의 전원으로 연구되었습니다.' },
    Cf: { decayHeat: 39000, spont: 0.02, emitter: true, note: '캘리포늄-252는 자발 핵분열로 많은 중성자를 내는 강한 중성자원입니다.' },
    Cd: { absorb: 0.9, note: '카드뮴은 중성자를 아주 잘 흡수해 제어봉에 씁니다.' },
    B: { absorb: 0.8, note: '붕소는 중성자를 잘 흡수합니다. 원자로 냉각수에 붕산으로 녹여 씁니다.' },
    Gd: { absorb: 0.95 }, Hf: { absorb: 0.5 }, In: { absorb: 0.4 }, Ag: { absorb: 0.3 },
  };
  for (const d of list) {
    const nu = NUCLEAR[d.sp];
    if (!nu || !d.el) continue;
    if (nu.fissile) d.fissile = nu.fissile;
    if (nu.spont) d.spont = nu.spont;
    if (nu.absorb != null) d.absorb = nu.absorb;
    if (nu.decayHeat && d.state !== 'gas') d.decayHeat = nu.decayHeat;
    if (nu.emitter) d.fissile = null;
    if (nu.note) d.desc = (d.desc ? d.desc + ' ' : '') + nu.note;
  }
  // 감속재: 가벼운 원자(수소, 탄소)가 많은 물질
  for (const id of ['H2O:l', 'H2O:s', 'C:s', 'C25H52:s', 'C25H52:l']) list.find((d) => d.id === id).moderator = true;
  list.find((d) => d.id === 'H2O:l').absorb = 0.01;

  // 불꽃. 불꽃 반응 색은 금속마다 다르다.
  const FLAME_COLORS = { Li: [230, 30, 60], Na: [255, 200, 30], K: [190, 130, 240], Rb: [200, 60, 170], Cs: [120, 110, 255], Ca: [255, 110, 40], Sr: [240, 25, 45], Ba: [150, 230, 80], Cu: [50, 220, 150], Mg: [255, 255, 245] };
  const mkFire = (id, name, rgb) => add({ id, name, formula: '연소 기체', state: 'gas', cat: id === 'fire' ? 'basic' : null, color: '#ff8a2a', density: 0.3, c: 1100, k: 0.08, T0: 1000, lifetime: 40, rise: 0.12, flame: rgb, inert: false, decay: [['smoke', 0.85], ['CO2', 0.15]], aliasOf: id === 'fire' ? null : 'fire', desc: '수명이 짧은 고온의 기체.' });
  mkFire('fire', '불꽃', [255, 130, 30]);
  for (const [el, rgb] of Object.entries(FLAME_COLORS)) mkFire('fire:' + el, SL.ELEMENTS.find((e) => e.sym === el).name + ' 불꽃', rgb);
  // 핵폭발의 불덩이: 아주 뜨겁고 오래 남아 위로 솟으며 연기(버섯구름)가 된다.
  add({ id: 'fireball', name: '불덩이(화구)', formula: '플라스마·고온 기체', state: 'gas', color: '#fff0c8', density: 0.1, c: 1100, k: 0.05, T0: 5000, lifetime: 260, rise: 0.4, flame: [255, 236, 190], decay: [['smoke', 0.8], ['fallout', 0.2]], aliasOf: 'fire', desc: '핵폭발로 생긴 수천 °C의 불덩이. 위로 솟아오르며 식어 연기와 방사성 낙진이 됩니다.' });

  // 비활성 기체는 반응하지 않는다.
  list.forEach((d) => { if (d.elCat === 'noble') d.inert = true; });

  Object.assign(alias, {
    water: 'H2O:l', ice: 'H2O:s', steam: 'H2O:g', hydrogen: 'H:g', oxygen: 'O:g', nitrogen: 'N:g', co2: 'CO2:g', sodium: 'Na:s', iron: 'Fe:s', copper: 'Cu:s', magnesium: 'Mg:s', salt: 'S:NaCl', brine: 'A:NaCl', naoh: 'A:NaOH',
    hcl: 'A:acid:HCl', limestone: 'S:CaCO3', quicklime: 'S:CaO', slaked: 'S:Ca(OH)2', rust: 'S:Fe2O3', vinegar: 'A:acid:CH3COOHaq', molteniron: 'Fe:l',
  });

  SL.MATERIALS = list;
  SL.MATERIAL_ALIAS = alias;
  SL.SALTS = salts;
  SL.CATION = Object.fromEntries(CATIONS.map((c) => [c[0], { key: c[0], name: c[1], charge: c[2], el: c[3] }]));
  SL.ANION = Object.fromEntries(ANIONS.map((a) => [a[0], { key: a[0], charge: a[1], name: a[2], fx: a[3] }]));
  SL.ACIDS = Object.fromEntries(ACIDS.map((a) => [a[3], { id: 'A:acid:' + a[0], fx: a[2] }]));
  SL.FLAME_OF_CATION = FLAME;

  SL.CATEGORIES = [
    ['element', '원소'], ['basic', '기본'], ['rock', '암석·광물'], ['alloy', '합금'], ['acid', '산'], ['base', '염기'], ['salt', '염·산화물'], ['solution', '용액'],
    ['indicator', '지시약'], ['organic', '유기물'], ['gas', '기체'], ['chem', '기타 화학'], ['cryo', '극저온'], ['device', '장치'], ['nuclear', '핵·방사성'],
  ];

  SL.BALLS = {
    iron: { name: '철 공', density: 7870, e: 0.55, color: '#9aa2ab' },
    rubber: { name: '고무공', density: 1100, e: 0.85, color: '#e0584f' },
    wood: { name: '나무 공', density: 600, e: 0.45, color: '#a8743a' },
    foam: { name: '스티로폼 공', density: 30, e: 0.35, color: '#f1f1ea' },
  };
})(globalThis.SandLab = globalThis.SandLab || {});
