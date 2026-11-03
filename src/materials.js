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

  for (const e of SL.ELEMENTS) {
    const multi = MOLECULE[e.sym] ? 2 : 1;
    family({
      key: e.sym, fx: MOLECULE[e.sym] || e.sym, name: e.name, M: e.M * multi, rho: e.rho, mp: e.mp, bp: e.bp, subl: e.mp == null, k: e.k,
      c: Math.round(25000 / e.M), color: ELEMENT_COLORS[e.sym] || CAT_COLOR[e.cat], gasColor: GAS_COLOR[e.sym], cat: 'element', flow: 3,
      metal: METAL_CATS.has(e.cat) ? e.sym : undefined, radioactive: e.radioactive, predicted: e.predicted, tags: { el: e.sym, z: e.z, elCat: e.cat },
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
    ['H2SO4', '진한 황산', 'H2SO4', 98.08, 1.84, 10.3, 337, 'acid', '#d8d4a8', { k: 0.3, c: 1400, flow: 2, misc: true, tags: { acid: { a: 'SO4', conc: true } }, desc: '물과 만나면 많은 열을 내고, 설탕에서 물을 빼앗습니다.' }],
    ['HNO3', '진한 질산', 'HNO3', 63.01, 1.51, -42, 83, 'acid', '#e8dca0', { k: 0.3, c: 1720, flow: 4, misc: true, tags: { acid: { a: 'NO3', conc: true } }, desc: '강한 산화제. 수소 대신 이산화질소가 생깁니다.' }],
    ['CH3COOH', '빙초산', 'CH3COOH', 60.05, 1.05, 16.6, 118, 'acid', '#d8dcc8', { k: 0.2, c: 2050, flow: 4, misc: true, tags: Object.assign({ acid: { a: 'CH3COO', conc: true, weak: true } }, fuel(460, 0.1, CH, 1100)) }],
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
    ['C10H8', '나프탈렌', 'C10H8', 128.2, 1.14, 80.3, 218, 'organic', '#f0f0ea', { k: 0.3, c: 1300, tags: fuel(525, 0.2, CH, 1200) }],
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
  const OXCL = 'O Cl'.split(' ');
  const RE = 'O Cl NO3 SO4 OH F'.split(' ');
  const CATIONS = [
    ['Li', '리튬', 1, 'Li'], ['Na', '나트륨', 1, 'Na'], ['K', '칼륨', 1, 'K'], ['Rb', '루비듐', 1, 'Rb'], ['Cs', '세슘', 1, 'Cs'], ['NH4', '암모늄', 1, null],
    ['Be', '베릴륨', 2, 'Be', 'O Cl OH SO4'.split(' ')], ['Mg', '마그네슘', 2, 'Mg'], ['Ca', '칼슘', 2, 'Ca'], ['Sr', '스트론튬', 2, 'Sr'], ['Ba', '바륨', 2, 'Ba'],
    ['Al', '알루미늄', 3, 'Al'], ['Cr3', '크로뮴(III)', 3, 'Cr'], ['Mn2', '망가니즈(II)', 2, 'Mn'], ['Fe2', '철(II)', 2, 'Fe'], ['Fe3', '철(III)', 3, 'Fe'], ['Co2', '코발트(II)', 2, 'Co'], ['Ni2', '니켈(II)', 2, 'Ni'],
    ['Cu2', '구리(II)', 2, 'Cu'], ['Zn', '아연', 2, 'Zn'], ['Ag', '은', 1, 'Ag'], ['Cd', '카드뮴', 2, 'Cd'], ['Sn2', '주석(II)', 2, 'Sn'], ['Pb2', '납(II)', 2, 'Pb'], ['Hg2', '수은(II)', 2, 'Hg'],
    ['Au3', '금(III)', 3, 'Au', OXCL], ['Pd2', '팔라듐(II)', 2, 'Pd', OXCL], ['Mn4', '망가니즈(IV)', 4, 'Mn', ['O']], ['Ti4', '타이타늄(IV)', 4, 'Ti', OXCL], ['V5', '바나듐(V)', 5, 'V', ['O']], ['Mo6', '몰리브데넘(VI)', 6, 'Mo', ['O']],
    ['W6', '텅스텐(VI)', 6, 'W', ['O']], ['Zr4', '지르코늄(IV)', 4, 'Zr', OXCL], ['Hf4', '하프늄(IV)', 4, 'Hf', ['O']], ['Nb5', '나이오븀(V)', 5, 'Nb', ['O']], ['Ta5', '탄탈럼(V)', 5, 'Ta', ['O']], ['Ge4', '저마늄(IV)', 4, 'Ge', ['O']],
    ['Sb3', '안티모니(III)', 3, 'Sb', OXCL], ['Bi3', '비스무트(III)', 3, 'Bi', 'O Cl NO3'.split(' ')], ['In3', '인듐(III)', 3, 'In', OXCL], ['Ga3', '갈륨(III)', 3, 'Ga', OXCL], ['Tl', '탈륨(I)', 1, 'Tl', OXCL], ['Sc3', '스칸듐', 3, 'Sc', RE], ['Y3', '이트륨', 3, 'Y', RE],
    ['Th4', '토륨(IV)', 4, 'Th', ['O']], ['U6', '우라늄(VI)', 6, 'U', ['O']],
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
    if (a === 'S' && ['Al', 'Cr3'].includes(c)) return false;
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
        add({ id: 'NH4OH:aq', name: '암모니아수', formula: 'NH₃(aq)', fx: 'NH4OH', state: 'liquid', cat: 'base', color: '#b8d8e0', density: 960, c: 4000, k: 0.5, flow: 5, aq: true, misc: true, salt: { c, a }, base: true, up: { at: 40, to: 'NH3:g', L: 3e5 }, desc: '끓지 않아도 암모니아가 날아갑니다.' });
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
        add({
          id: aqId, name: (fx === 'NaCl' ? '소금물' : `${aname}${cname} 용액`), formula: pretty(fx) + '(aq)', fx, state: 'liquid', cat: isBase ? 'base' : 'solution', color: AN_AQ_COLOR[a] || AQ_COLOR[c] || '#3f93c4', density: 1000 + Math.min(300, density / 25), c: 3900, k: 0.6, flow: 5, aq: true, misc: true, salt: { c, a }, base: isBase,
          desc: '끓이면 물이 날아가고 고체가 남습니다.',
          up: { at: 102, to: [['H2O:g', 0.6], [solid, 0.4]], L: 2.257e6 }, down: { at: -5, to: [['H2O:s', 0.7], [solid, 0.3]], L: 3.34e5 },
        });
      }
    }
  }

  // ---- 산 ----
  // [별칭, 이름, 화학식, 음이온, 색, 끓을 때 나오는 기체, 강도]
  const ACIDS = [
    ['HCl', '염산', 'HCl', 'Cl', '#b7dc5a', 'HClg', 0.9], ['HBr', '브로민화수소산', 'HBr', 'Br', '#c8c080', 'HBrg', 0.9], ['HI', '아이오딘화수소산', 'HI', 'I', '#c0a080', 'HIg', 0.9],
    ['HF', '플루오린화수소산', 'HF', 'F', '#c8e080', 'HFg', 0.4], ['HNO3aq', '묽은 질산', 'HNO3', 'NO3', '#dcd890', 'NO2', 0.9], ['H2SO4aq', '묽은 황산', 'H2SO4', 'SO4', '#d0d0a0', 'SO2', 0.9],
    ['H3PO4', '인산', 'H3PO4', 'PO4', '#d0d8c0', null, 0.3], ['CH3COOHaq', '식초(아세트산)', 'CH3COOH', 'CH3COO', '#d8d8b0', 'CH3COOH', 0.15], ['H2CO3', '탄산수', 'H2CO3', 'CO3', '#a8d0e0', 'CO2', 0.05], ['H2SO3', '아황산', 'H2SO3', 'SO3x', '#c8d8c0', 'SO2', 0.2],
  ];
  for (const [key, name, fx, a, color, gas, strength] of ACIDS) {
    const id = 'A:acid:' + key;
    alias[key] = id;
    add({
      id, name, formula: pretty(fx) + '(aq)', fx, state: 'liquid', cat: 'acid', color, density: 1050, c: 3900, k: 0.55, flow: 5, aq: true, misc: true, acid: { a, strength },
      desc: '금속, 탄산염, 염기, 금속 산화물과 반응합니다.',
      up: { at: key === 'H2CO3' ? 60 : 105, to: gas ? [['H2O:g', 0.7], [gas, 0.3]] : 'H2O:g', L: key === 'H2CO3' ? 2e5 : 2.257e6 },
      down: { at: -10, to: 'H2O:s', L: 3.34e5 },
    });
  }
  add({ id: 'aquaregia', name: '왕수', formula: 'HCl+HNO₃', fx: 'HCl', state: 'liquid', cat: 'acid', color: '#e0a040', density: 1200, c: 3000, k: 0.5, flow: 4, aq: true, misc: true, acid: { a: 'Cl', strength: 0.9 }, up: { at: 108, to: [['H2O:g', 0.5], ['NO2', 0.5]], L: 1e6 }, desc: '진한 염산과 진한 질산의 혼합물. 금을 녹입니다.' });

  // ---- 일상 물질, 암석, 장치 ----
  const others = [
    { id: 'air', name: '공기', formula: 'N₂+O₂', fx: 'O2', state: 'gas', color: '#10151b', density: 1.2, c: 1005, k: 0.026, desc: '산소 21%. 연소에 쓰이면 소모됩니다.' },
    { id: 'oil', name: '식용유', formula: 'C₅₇H₁₀₄O₆', fx: 'C57H104O6', state: 'liquid', cat: 'organic', color: '#b58a2e', density: 900, c: 2000, k: 0.15, flow: 3, fuel: { ign: 250, prob: 0.3, prods: CH, T: 1000 }, down: { at: -10, to: 'fat', L: 2e5 }, desc: '물에 뜨는 가연성 액체. 수산화나트륨과 반응해 비누가 됩니다.' },
    { id: 'fat', name: '굳은 기름', formula: '지방', fx: 'C57H104O6', state: 'powder', color: '#d8c890', density: 930, c: 2000, k: 0.15, T0: -20, up: { at: -10, to: 'oil', L: 2e5 } },
    { id: 'soap', name: '비누 용액', formula: 'C₁₈H₃₃NaO₂(aq)', fx: 'C18H33NaO2', state: 'liquid', cat: 'organic', color: '#c8d8c0', density: 1020, c: 3800, k: 0.5, flow: 3, aq: true, misc: true, desc: '기름과 수산화나트륨이 만든 비누입니다.' },
    { id: 'wood', name: '나무', formula: 'C₆H₁₀O₅', fx: 'C6H10O5', state: 'solid', cat: 'basic', color: '#8a5a2b', density: 600, c: 1700, k: 0.15, desc: '약 300°C에서 공기와 만나면 불이 붙습니다.' },
    { id: 'ember', name: '불씨', formula: '연소 중인 나무', fx: 'C6H10O5', state: 'solid', color: '#e0662a', density: 600, c: 1700, k: 0.05, T0: 600, desc: '산소가 있으면 계속 타고, 없으면 식어서 꺼집니다.', down: { at: 250, to: 'wood', L: 0, silent: true } },
    { id: 'ash', name: '재', formula: '탄산염 혼합', fx: 'K2CO3', state: 'powder', cat: 'basic', color: '#77787a', density: 500, c: 800, k: 0.1, desc: '탄 나무가 남긴 가벼운 가루.' },
    { id: 'smoke', name: '연기', formula: '미세입자', fx: 'C', state: 'gas', cat: 'basic', color: '#555b61', density: 1.0, c: 1000, k: 0.03, T0: 200, lifetime: 500, decay: [['CO2', 1]], desc: '입자가 가라앉으면 연소 기체만 남습니다.' },
    { id: 'sugar', name: '설탕', formula: 'C₁₂H₂₂O₁₁', fx: 'C12H22O11', state: 'powder', cat: 'organic', color: '#f4f2ea', density: 1590, c: 1250, k: 0.2, mp: 186, fuel: { ign: 350, prob: 0.1, prods: CH, T: 900 }, desc: '186°C 부근에서 분해됩니다. 진한 황산이 물을 빼앗으면 탄소만 남습니다.' },
    { id: 'phth', name: '페놀프탈레인', formula: 'C₂₀H₁₄O₄(aq)', fx: 'C20H14O4', state: 'liquid', cat: 'indicator', color: '#c8d8e0', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'phth', desc: '염기를 만나면 분홍색이 됩니다.' },
    { id: 'phth:pink', name: '분홍색 페놀프탈레인', formula: '염기성', fx: 'C20H14O4', state: 'liquid', color: '#e83a9a', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'phth', desc: '염기성 용액입니다.' },
    { id: 'litmus', name: '리트머스 용액', formula: '지시약', fx: 'C7H7NO4', state: 'liquid', cat: 'indicator', color: '#7a5ab0', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'litmus', desc: '산에서 붉게, 염기에서 푸르게 변합니다.' },
    { id: 'litmus:red', name: '붉은 리트머스', formula: '산성', fx: 'C7H7NO4', state: 'liquid', color: '#d03040', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'litmus', desc: '산성 용액입니다.' },
    { id: 'litmus:blue', name: '푸른 리트머스', formula: '염기성', fx: 'C7H7NO4', state: 'liquid', color: '#2a50d0', density: 1000, c: 4000, k: 0.6, flow: 5, aq: true, misc: true, indicator: 'litmus', desc: '염기성 용액입니다.' },

    { id: 'sand', name: '모래', formula: 'SiO₂', fx: 'SiO2', state: 'powder', cat: 'rock', color: '#d3b673', density: 1600, c: 830, k: 0.3, mp: 1713, cast: true, desc: '녹는점 1713°C. 녹았다 식으면 유리가 됩니다.', up: { at: 1713, to: 'moltenglass', L: 1.4e5 } },
    { id: 'quartz', name: '석영', formula: 'SiO₂', fx: 'SiO2', state: 'solid', cat: 'rock', color: '#e8e4dc', density: 2650, c: 740, k: 3, mp: 1713, desc: '녹는점 1713°C.', up: { at: 1713, to: 'moltenglass', L: 1.4e5 } },
    { id: 'stone', name: '화강암', formula: 'SiO₂+Al₂O₃', fx: 'SiO2', state: 'solid', cat: 'rock', color: '#767e88', density: 2700, c: 790, k: 2.8, mp: 1215, desc: '약 1215°C에서 녹아 용암이 됩니다.', up: { at: 1215, to: 'lava', L: 4e5 } },
    { id: 'basalt', name: '현무암', formula: '규산염', fx: 'SiO2', state: 'solid', cat: 'rock', color: '#3e4246', density: 3000, c: 840, k: 1.7, mp: 1100, desc: '용암이 식어 굳은 어두운 암석. 약 1100°C에서 녹습니다.', up: { at: 1100, to: 'lava', L: 4e5 } },
    { id: 'marble', name: '대리암', formula: 'CaCO₃', fx: 'CaCO3', state: 'solid', cat: 'rock', color: '#e4e2da', density: 2700, c: 880, k: 2.5, salt: { c: 'Ca', a: 'CO3' }, desc: '석회암이 변성된 암석. 산에 녹습니다.' },
    { id: 'lava', name: '용암', formula: '규산염 용융체', fx: 'SiO2', state: 'liquid', cat: 'rock', color: '#f0531c', density: 2600, c: 1100, k: 2, T0: 1400, flow: 1, desc: '약 1100°C 아래로 식으면 현무암으로 굳습니다.', down: { at: 1100, to: 'basalt', L: 4e5 } },
    { id: 'glass', name: '유리', formula: 'SiO₂ 유리', fx: 'SiO2', state: 'solid', cat: 'rock', color: '#9fd6d8', density: 2500, c: 840, k: 1, desc: '약 1400°C에서 흐르기 시작합니다. 플루오린화수소산에 녹습니다.', up: { at: 1400, to: 'moltenglass', L: 1.4e5 } },
    { id: 'moltenglass', name: '녹은 유리', formula: 'SiO₂(l)', fx: 'SiO2', state: 'liquid', cat: null, color: '#ffb347', density: 2300, c: 1000, k: 1.5, T0: 1500, flow: 1, desc: '식으면 유리가 됩니다.', down: { at: 1100, to: 'glass', L: 1.4e5 } },

    { id: 'wall', name: '단열벽', formula: '-', state: 'solid', cat: 'device', color: '#3a424c', density: 2000, c: 1000, k: 0.001, inert: true, desc: '열을 거의 전달하지 않는 벽.' },
    { id: 'firebrick', name: '내화벽돌', formula: 'Al₂O₃+SiO₂', state: 'solid', cat: 'device', color: '#a8644a', density: 2000, c: 1000, k: 1, inert: true, desc: '녹지 않고 열을 천천히 전달합니다. 용광로의 안쪽 벽입니다.' },
    { id: 'heater', name: '가열판', formula: '800°C', state: 'solid', cat: 'device', color: '#d8392b', density: 5000, c: 1000, k: 80, T0: 800, fixed: true, inert: true, desc: '항상 800°C를 유지합니다.' },
    { id: 'furnace', name: '용광로판', formula: '2000°C', state: 'solid', cat: 'device', color: '#f07a10', density: 5000, c: 1000, k: 80, T0: 2000, fixed: true, inert: true, desc: '항상 2000°C를 유지합니다. 철도 녹습니다.' },
    { id: 'cooler', name: '냉각판', formula: '-60°C', state: 'solid', cat: 'device', color: '#3bb4d8', density: 5000, c: 1000, k: 80, T0: -60, fixed: true, inert: true, desc: '항상 -60°C를 유지합니다.' },
    { id: 'cryoplate', name: '극저온판', formula: '-250°C', state: 'solid', cat: 'device', color: '#7a90f0', density: 5000, c: 1000, k: 80, T0: -250, fixed: true, inert: true, desc: '항상 -250°C를 유지합니다. 공기 속 기체도 얼립니다.' },
  ];
  others.forEach(add);

  // 합금
  [['steel', '강철', 'Fe+C', 7850, 1450, 2860, '#7f878f', 50], ['bronze', '청동', 'Cu+Sn', 8800, 950, 2300, '#a9793a', 60], ['brass', '황동', 'Cu+Zn', 8500, 930, 1100, '#c9a53c', 110], ['solder', '땜납', 'Sn+Pb', 8400, 183, 1600, '#a8aeb4', 50]].forEach(([key, name, f, rho, mp, bp, color, k]) => {
    family({ key, name, fx: f.replace('+', ''), M: 60, rho: rho / 1000, mp, bp, k, c: 450, color, cat: 'alloy', cast: true, flow: 2 });
    list.filter((d) => d.sp === key).forEach((d) => { d.formula = f + (d.state === 'powder' ? '' : d.state === 'liquid' ? '(l)' : '(g)'); });
  });

  // 불꽃. 불꽃 반응 색은 금속마다 다르다.
  const FLAME_COLORS = { Li: [230, 30, 60], Na: [255, 200, 30], K: [190, 130, 240], Rb: [200, 60, 170], Cs: [120, 110, 255], Ca: [255, 110, 40], Sr: [240, 25, 45], Ba: [150, 230, 80], Cu: [50, 220, 150], Mg: [255, 255, 245] };
  const mkFire = (id, name, rgb) => add({ id, name, formula: '연소 기체', state: 'gas', cat: id === 'fire' ? 'basic' : null, color: '#ff8a2a', density: 0.3, c: 1100, k: 0.08, T0: 1000, lifetime: 40, rise: 0.12, flame: rgb, inert: false, decay: [['smoke', 0.85], ['CO2', 0.15]], aliasOf: id === 'fire' ? null : 'fire', desc: '수명이 짧은 고온의 기체.' });
  mkFire('fire', '불꽃', [255, 130, 30]);
  for (const [el, rgb] of Object.entries(FLAME_COLORS)) mkFire('fire:' + el, SL.ELEMENTS.find((e) => e.sym === el).name + ' 불꽃', rgb);

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
    ['indicator', '지시약'], ['organic', '유기물'], ['gas', '기체'], ['chem', '기타 화학'], ['cryo', '극저온'], ['device', '장치'],
  ];

  SL.BALLS = {
    iron: { name: '철 공', density: 7870, e: 0.55, color: '#9aa2ab' },
    rubber: { name: '고무공', density: 1100, e: 0.85, color: '#e0584f' },
    wood: { name: '나무 공', density: 600, e: 0.45, color: '#a8743a' },
    foam: { name: '스티로폼 공', density: 30, e: 0.35, color: '#f1f1ea' },
  };
})(globalThis.SandLab = globalThis.SandLab || {});
