// 반응 규칙.
// - REACTIONS: 특정 물질끼리의 반응 표. 한 줄 추가로 확장한다.
// - rulesFor: 반응성 계열과 용해도 규칙으로 계산하는 일반 규칙. 두 물질이 처음 만날 때 한 번만 계산한다.
// 한 칸의 결과는 두 칸 안에서 표현하므로, 화학식의 몰 비까지 칸 수로 지키지는 않는다. 화학식 표시는 항상 균형을 맞춘다.
// toA, toB: 결과(null이면 그대로, 배열이면 확률 선택) / prob: 틱당 확률 / minT, maxT: 둘 중 높은 온도의 하한·상한
// dT: 생성물 온도 변화 / T: 생성물 최저 온도 / near: 옆에 이 물질이 있어야 일어남 / farFrom: 옆에 이 물질이 있으면 일어나지 않음
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
    Pu: { ox: 'Pu4', ign: 300, burn: 1, tarnish: 0.0003, T: 2000 }, Ge: { ox: 'Ge4', ign: 700, burn: 0 }, V: { ox: 'V5', ign: 700, burn: 0 }, Mo: { ox: 'Mo6', ign: 600, burn: 0 }, W: { ox: 'W6', ign: 500, burn: 0 }, Nb: { ox: 'Nb5', ign: 600, burn: 0 }, Ta: { ox: 'Ta5', ign: 600, burn: 0 }, Th: { ox: 'Th4', ign: 400, burn: 1, T: 2500, flame: 'Mg' }, U: { ox: 'U6', ign: 300, burn: 1, T: 1800 },
  };
  for (const r of ['Sc', 'Y', 'La', 'Ce', 'Pr', 'Nd', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu']) {
    METALS[r] = { cat: r + '3', ox: r + '3', ign: 300, burn: 1, T: 2000, flame: 'Mg', tarnish: 0.0002 };
  }
  // 차가운 물과 반응하는 금속: 확률, 발열
  const WATER_METALS = { Cs: [0.6, 1100], Rb: [0.5, 1000], K: [0.4, 800], Na: [0.15, 550], Li: [0.06, 150], Ba: [0.2, 200], Sr: [0.15, 150], Ca: [0.08, 120], La: [0.01, 30], Ce: [0.01, 30] };
  // 물과 만났을 때 폭발하는 금속: [반지름, 확률]. 무거운 알칼리 금속일수록 순식간에 반응해 터진다.
  const WATER_BLAST = { Cs: [3.5, 0.3], Rb: [3, 0.25], K: [2, 0.08], Na: [2, 0.02] };
  // 할로젠화 이온 → 진한 황산과 가열하면 나오는 기체 (아이오딘화 이온은 산화되어 아이오딘이 된다)
  const HALIDE_GAS = { Cl: 'HClg', F: 'HFg', Br: 'HBrg' };
  const ACTIVE_OXIDES = new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'Ca', 'Sr', 'Ba', 'Mg']);
  // 뜨거워지면 분해되는 온도. 없으면 안정.
  const DECOMP = {
    // 나트륨·칼륨·루비듐·세슘의 탄산염은 녹아도 거의 분해되지 않는다(null).
    CO3: { Mg: 350, Ca: 825, Sr: 1100, Ba: 1300, Li: 1300, Cu2: 200, Zn: 300, Pb2: 315, Fe2: 300, Mn2: 400, Co2: 400, Ni2: 400, Cd: 350, Ag: 200, NH4: 60, Na: null, K: null, Rb: null, Cs: null, def: 500 },
    HCO3: { Na: 150, K: 100, NH4: 40 },
    OH: { Ca: 512, Mg: 350, Cu2: 100, Fe2: 150, Fe3: 200, Al: 300, Zn: 125, Ni2: 230, Co2: 170, Cr3: 300, Pb2: 145, Mn2: 300, Cd: 200, Sr: 700, Ba: 780, Be: 400, def: 300 },
    NO3: { Mg: 330, Ca: 561, Sr: 570, Ba: 592, Al: 150, Fe3: 125, Fe2: 100, Cu2: 170, Zn: 110, Pb2: 290, Ag: 444, Ni2: 110, Co2: 100, Mn2: 140, Cd: 300, Hg2: 200, Cr3: 100, Sn2: 150 },
    SO4: { Cu2: 650, Fe2: 480, Fe3: 480, Al: 770, Zn: 680, Pb2: 1000, Mn2: 850, Ni2: 840, Co2: 735, Cd: 1000 },
  };
  const DECOMP_GAS = { CO3: ['CO2', 'CO2'], HCO3: ['CO2', 'CO2'], OH: ['H2O:g', 'H2O'], NO3: ['NO2', 'NO2'], SO4: ['SO3', 'SO3'] };
  const NOBLE_OXIDES = { Ag2O: 300, HgO: 500, Au2O3: 160, PdO: 750 };
  const HALOGEN_ORDER = ['F', 'Cl', 'Br', 'I'];
  const OXIDES_TO_ACID = { SO3: 'H2SO4aq', SO2: 'H2SO3', NO2: 'HNO3aq', CO2: 'H2CO3' };
  // 진한 질산·진한 황산에 넣으면 표면에 얇은 산화막이 생겨 반응이 멈추는 금속(부동태). 가열하면 반응한다.
  const PASSIVE = new Set(['Fe', 'Al', 'Cr']);
  // 수증기와 고온에서 반응해 수소를 내는 금속(금속 화재에 물을 뿌리면 안 되는 이유)
  const STEAM_METALS = new Set(['Mg', 'Al', 'Zn', 'Be', 'Ti', 'Zr']);
  // 일산화탄소로 환원되는 금속 산화물의 최소 온도(용광로 안에서 실제로 철광석을 환원하는 것은 대부분 CO다).
  const CO_REDUCE = { Fe3: 700, Fe2: 700, Ni2: 600, Co2: 600, Sn2: 600, Pb2: 500, Cu2: 250, Ag: 200, Hg2: 300, Bi3: 500, Sb3: 600, Cd: 700 };
  // 얼음 + 염 → 녹으면서 열을 빼앗는 한제. 값은 한 번 반응할 때의 온도 변화(°C).
  const ICE_SALT = { NaCl: -12, KCl: -8, CaCl2: -4, MgCl2: -6, NH4NO3: -18 };
  // pH 지시약: 변색 범위(pH)와 상태별 물질
  const INDICATORS = {
    phth: { name: '페놀프탈레인', to: (pH) => (pH >= 8.2 ? 'phth:pink' : 'phth') },
    litmus: { name: '리트머스', to: (pH) => (pH < 4.5 ? 'litmus:red' : pH >= 8.3 ? 'litmus:blue' : 'litmus') },
    btb: { name: 'BTB', to: (pH) => (pH < 6 ? 'btb:yellow' : pH > 7.6 ? 'btb:blue' : 'btb') },
    cabbage: { name: '적양배추 지시약', to: (pH) => (pH < 3 ? 'cabbage:red' : pH < 6 ? 'cabbage:pink' : pH < 7.5 ? 'cabbage' : pH < 9 ? 'cabbage:blue' : pH < 12 ? 'cabbage:green' : 'cabbage:yellow') },
    mo: { name: '메틸 오렌지', to: (pH) => (pH < 3.1 ? 'mo:red' : pH > 4.4 ? 'mo:yellow' : 'mo') },
  };
  // 화학 정원: 물유리 속에 넣으면 색깔 있는 관을 키우는 금속 이온
  const GARDEN = { Cu2: 'Cu', Co2: 'Co', Ni2: 'Ni', Fe3: 'Fe3', Fe2: 'Fe2', Mn2: 'Mn', Ca: 'Ca', Zn: 'Zn' };

  const isOx = (d) => d.id === 'air' || d.id === 'O:g' || d.id === 'O:l';
  const isWater = (d) => d.id === 'H2O:l';
  const metalInfo = (d) => (d.metal && d.state !== 'gas' ? METALS[d.metal] : null);
  const flameId = (k) => (k ? 'fire:' + k : 'fire:clean'); // 불꽃색이 없는 금속도 이산화탄소는 남기지 않는다.
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
      // 기체 연료가 공기와 섞여 타면 순식간에 번져 폭발한다(가스 폭발). 액체 산소와 만난 연료도 격렬하다.
      const gasFuel = A.state === 'gas';
      const blast = B.id === 'O:l' ? [2.5, 0.3] : gasFuel ? (B.id === 'air' ? [1.5, 0.15] : [2.5, 0.4]) : null;
      const fireId = f.prods.includes('CO2') ? 'fire' : 'fire:clean';
      out.push(R('burn:' + (A.sp || A.id), A.name + '의 연소', [dFx(A), 'O2'], f.prods, { kind: 'chemical', a: A.id, minT: f.ign, prob: f.prob * (B.id === 'air' ? 1 : 3), toA: fireId, toB: fireId, T: f.T, explode: blast && blast[0], explodeP: blast && blast[1], note: gasFuel ? '기체 연료는 공기와 섞인 채로 불이 붙으면 한꺼번에 타며 폭발합니다.' : '산소가 있어야 탑니다.' }));
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
    if (m && (isWater(B) || B.id === 'H2O:g' || B.id === 'H2O:s') && WATER_METALS[elA] && m.cat) {
      const [prob, dT] = WATER_METALS[elA];
      const hyd = salt(m.cat, 'OH');
      const blast = isWater(B) ? WATER_BLAST[elA] : null;
      const slow = B.id === 'H2O:s' ? 0.3 : 1; // 얼음과는 느리게 반응한다.
      if (hyd) out.push(R('water:' + elA, A.name + '과 물', [elA, 'H2O'], [hyd.fx, 'H2'], { prob: prob * slow, toA: formOf(hyd), toB: 'H:g', dT, explode: blast && blast[0], explodeP: blast && blast[1], note: (dT > 400 ? '격렬한 발열 반응입니다. 뜨거운 수소에 불이 붙습니다.' : '수소 거품이 올라옵니다.') + (blast && blast[0] >= 3 ? ' 루비듐과 세슘은 물에 닿는 순간 폭발합니다.' : '') }));
    }
    if (m && elA === 'Mg' && isWater(B)) {
      out.push(R('water:Mg', '마그네슘과 뜨거운 물', ['Mg', 'H2O'], ['Mg(OH)2', 'H2'], { minT: 70, prob: 0.01, toA: 'S:Mg(OH)2', toB: 'H:g', dT: 30, note: '찬물에서는 거의 반응하지 않고 뜨거운 물과 반응합니다.' }));
    }

    // 금속 + 산
    if (m && B.acid && m.cat) {
      const a = B.acid.a, r = rank(elA);
      const oxidizing = a === 'NO3';
      const sal = salt(m.cat, a);
      const concOx = B.acid.conc && (a === 'NO3' || a === 'SO4');
      const passive = concOx && PASSIVE.has(elA);
      // 산화성 산은 철을 철(III)까지 산화시킨다.
      const oxSal = salt(elA === 'Fe' ? 'Fe3' : m.cat, a) || sal;
      if (passive) {
        out.push(R('passive:' + elA + ':' + a, A.name + '의 부동태', [], [], { kind: 'physical', eq: `${A.formula} + 진한 ${a === 'NO3' ? 'HNO₃' : 'H₂SO₄'} → 얇은 산화막(반응 멈춤)`, prob: 0.02, maxT: 80, note: '진한 산이 표면을 산화시켜 치밀한 막을 만들면 더 이상 녹지 않습니다. 그래서 진한 질산·황산을 철이나 알루미늄 용기에 운반합니다. 가열하거나 묽히면 반응합니다.' }));
      }
      if (sal && r >= 0) {
        if (oxidizing && (B.acid.conc || B.acid.strength) && elA !== 'Au' && elA !== 'Pd') {
          const nox = B.acid.conc ? 'NO2' : 'NO';
          out.push(R('hno3:' + elA + ':' + nox, A.name + '과 질산', [elA, 'HNO3'], [oxSal.fx, nox, 'H2O'], { prob: B.acid.conc ? 0.2 : 0.06, minT: passive ? 80 : undefined, toA: formOf(oxSal), toB: nox, dT: 40, note: '질산은 수소 대신 질소 산화물을 냅니다. 구리도 녹입니다.' + (nox === 'NO' ? ' 무색의 일산화질소는 공기를 만나면 적갈색 이산화질소가 됩니다.' : '') }));
        } else if (a === 'SO4' && B.acid.conc && elA !== 'Au') {
          // 진한 황산은 산화제로 작용해 수소 대신 이산화황을 낸다. 활발한 금속은 차가워도 천천히 반응한다.
          const cold = r < H_RANK && !passive;
          out.push(R('h2so4c:' + elA, A.name + '과 진한 황산', [elA, 'H2SO4'], [oxSal.fx, 'SO2', 'H2O'], { minT: cold ? undefined : 100, prob: cold ? 0.03 : 0.1, toA: formOf(oxSal), toB: 'SO2', dT: 30, note: '진한 황산은 수소 대신 자극적인 이산화황을 냅니다. 수소보다 반응성이 작은 금속은 가열해야 녹습니다.' }));
        } else if (r < H_RANK && !oxidizing) {
          // 반응 속도는 반응성 계열에서 수소와 멀수록 가파르게 커진다(Mg ≫ Zn > Fe > Sn, Pb).
          const pace = Math.max(0.003, 1.2 * (1 - r / H_RANK) ** 3) * (B.acid.strength || 0.9);
          const insoluble = !sal.aq;
          // 몰 수: 금속 1cm³에는 묽은 산 1cm³보다 수십 배 많은 원자가 있다. 그래서 반응할 때마다 산 칸은 다 쓰이지만(염 용액이나 수소 거품),
          // 금속 칸은 가끔만 녹아 없어진다. 녹지 않는 염이 생기면 금속 표면을 덮어 반응이 느려진다.
          out.push(R('acid:' + elA + ':' + a, A.name + '과 ' + B.name, [elA, B.fx], [sal.fx, 'H2'], { prob: insoluble ? pace * 0.1 : pace, toA: insoluble ? formOf(sal) : [[A.id, 0.85], ['H:g', 0.15]], toB: insoluble ? 'H:g' : [[formOf(sal), 0.6], ['H:g', 0.4]], dT: 25 + 60 * (1 - r / H_RANK), note: '수소보다 활발한 금속이 산에 녹으며 수소를 냅니다.' + (insoluble ? ' 생성물이 물에 녹지 않아 표면을 덮어 느려집니다.' : '') }));
        }
      }
    }

    // 뜨거운 금속 + 수증기 → 산화물 + 수소. 불타는 마그네슘에 물을 뿌리면 오히려 더 격렬해진다.
    if (m && STEAM_METALS.has(elA) && B.id === 'H2O:g' && m.ox) {
      const oxide = salt(m.ox, 'O');
      if (oxide) out.push(R('steam:' + elA, A.name + '과 수증기', [elA, 'H2O'], [oxide.fx, 'H2'], { minT: Math.max(400, m.ign), prob: 0.15, toA: oxide.solid, toB: 'H:g', T: m.T || 1500, note: '뜨거운 금속은 수증기에서 산소를 빼앗고 수소를 냅니다. 금속 화재에 물을 뿌리면 안 되는 이유입니다.' }));
    }

    // 마그네슘은 이산화탄소 속에서도 탄다. 이산화탄소 소화기로 끌 수 없다.
    if (m && (elA === 'Na' || elA === 'K') && B.sp === 'CO2') {
      const carb = salt(elA, 'CO3');
      out.push(R('co2:' + elA, A.name + '과 이산화탄소', [elA, 'CO2'], [carb.fx, 'C'], { minT: 300, prob: 0.1, toA: carb.solid, toB: 'C:s', T: 1200, note: '불붙은 알칼리 금속은 이산화탄소 속에서도 계속 탑니다. 나트륨 화재에는 마른 모래나 전용 소화기를 씁니다.' }));
    }
    if (m && elA === 'Mg' && B.sp === 'N' && B.state === 'gas') {
      out.push(R('nitride:Mg', '마그네슘과 질소', ['Mg', 'N2'], ['Mg3N2'], { minT: 700, prob: 0.05, toA: 'S:Mg3N2', toB: 'air', T: 1800, note: '마그네슘은 너무 뜨거워 공기 속 질소와도 결합합니다. 타고 남은 재에 노란빛 질화마그네슘이 섞이는 이유입니다.' }));
    }
    if (m && elA === 'Li' && B.sp === 'N' && B.state === 'gas') {
      out.push(R('nitride:Li', '리튬과 질소', ['Li', 'N2'], ['Li3N'], { prob: 0.002, toA: 'S:Li3N', toB: 'air', dT: 20, note: '리튬은 상온에서도 질소와 천천히 반응하는 유일한 알칼리 금속입니다.' }));
    }
    if (m && (elA === 'Mg' || elA === 'Al') && (B.id === 'sand' || B.id === 'quartz')) {
      const own = salt(elA, 'O');
      out.push(R('silicon:' + elA, '모래에서 규소 얻기', [elA, 'SiO2'], [own.fx, 'Si'], { minT: 800, prob: 0.1, toA: own.solid, toB: 'Si:s', T: 1800, note: '활발한 금속이 모래(이산화규소)에서 산소를 빼앗아 규소가 생깁니다.' }));
    }
    if (m && elA === 'Fe' && B.id === 'H2O:g') {
      out.push(R('steam:Fe', '철과 수증기', ['Fe', 'H2O'], ['Fe3O4', 'H2'], { minT: 500, prob: 0.05, toA: 'S:Fe3O4', toB: 'H:g', note: '뜨거운 철은 수증기에서 산소를 빼앗아 검은 사산화삼철과 수소가 됩니다(라부아지에의 물 분해 실험).' }));
    }
    // 녹은 금속과 물: 물이 순식간에 끓어 부피가 1700배로 늘며 터진다(수증기 폭발).
    if (m && A.state === 'liquid' && A.mp > 200 && isWater(B)) {
      out.push(R('steamblast:' + elA, '녹은 ' + SL.ELEMENTS.find((e) => e.sym === elA).name + '과 물', [], [], { kind: 'physical', eq: '녹은 금속 + 물 → 수증기 폭발', prob: 0.2, toB: 'steam', explode: 2.5, explodeP: 0.15, T: 600, note: '물이 녹은 금속 밑에 갇혀 순식간에 끓으면 부피가 약 1700배로 늘며 폭발합니다. 주물 공장에서 가장 조심하는 사고입니다.' }));
    }
    if (m && elA === 'Mg' && B.sp === 'CO2') {
      out.push(R('co2:Mg', '마그네슘과 이산화탄소', ['Mg', 'CO2'], ['MgO', 'C'], { minT: 600, prob: 0.2, toA: 'S:MgO', toB: 'C:s', T: 2200, note: '마그네슘이 이산화탄소에서 산소를 빼앗아 흰 산화마그네슘과 검은 탄소가 생깁니다. 이산화탄소 소화기로는 끌 수 없습니다.' }));
    }

    // 금속 + 다른 금속 이온 (치환)
    if (m && m.cat && B.aq && B.salt && !WATER_METALS[elA] && SL.CATION[B.salt.c] && SL.CATION[B.salt.c].el) {
      const el2 = SL.CATION[B.salt.c].el;
      const r1 = rank(elA), r2 = rank(el2);
      const newSalt = salt(m.cat, B.salt.a);
      if (r1 >= 0 && r2 >= 0 && r1 < r2 && el2 !== elA && newSalt && B.salt.a !== 'OH') {
        // 알루미늄은 산화막 때문에 느리지만, 염화 이온은 산화막을 뚫어 빨라진다.
        const film = elA === 'Al' && B.salt.a !== 'Cl' ? 0.05 : 1;
        out.push(R('displace:' + elA + ':' + B.salt.c + ':' + B.salt.a, A.name + '의 금속 치환', [elA, B.fx], [newSalt.fx, el2], { prob: 0.06 * film, toA: formOf(newSalt), toB: el2 + ':s', dT: 5, note: `${A.name}이(가) ${SL.CATION[B.salt.c].name}보다 반응성이 커서 금속이 석출됩니다.` }));
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
      // 수은은 상온에서도 황과 결합한다(쏟은 수은을 황 가루로 덮어 처리하는 이유).
      const hg = elA === 'Hg';
      if (sul && sul.solid) out.push(R('sulfide:' + elA, A.name + '과 황', [elA, 'S'], [sul.fx], { minT: hg ? undefined : 250, prob: hg ? 0.02 : 0.15, toA: sul.solid, toB: 'air', dT: hg ? 5 : 300, note: hg ? '수은은 상온에서도 황과 결합해 황화수은이 됩니다. 쏟은 수은을 황 가루로 덮는 이유입니다.' : '가열하면 빛을 내며 황화물이 됩니다.' }));
    }

    // 끓는점이 상온보다 낮은 물질은 공기에 닿은 면부터 빠르게 기화한다(액체 질소, 드라이아이스).
    if (B.id === 'air' && A.bp != null && A.bp < 15 && A.state !== 'gas' && A.sp) {
      out.push(R('boiloff:' + A.sp, A.name + '의 기화', [], [], { kind: 'physical', eq: `${A.formula} → 기체 (${A.bp}°C)`, prob: 0.04, minT: A.bp, toA: A.sp + ':g', T: A.bp + 2, note: '상온의 공기가 끓는점보다 훨씬 뜨거워서 빠르게 기체가 됩니다.' }));
    }

    // 고체의 용해. 순수한 물뿐 아니라 다른 수용액 속의 물에도 녹는다(같은 물질의 용액에는 더 녹지 않는 것으로 단순화: 포화).
    if (A.salt && A.state === 'powder' && (isWater(B) || (B.aq && B.state === 'liquid' && B.fx !== A.fx && !B.indicator))) {
      const e = salt(A.salt.c, A.salt.a);
      if (e && e.aq) {
        const water = isWater(B);
        out.push(R('dissolve:' + A.fx, A.name + '의 용해', [A.fx], [A.fx], { kind: 'physical', eq: `${A.formula}(s) → ${A.formula}(aq)`, prob: water ? 0.05 : 0.03, toA: e.aq, toB: water ? e.aq : null, dT: A.dHsol || 0, note: (A.dHsol > 10 ? '녹으면서 열을 냅니다.' : A.dHsol < -10 ? '녹으면서 주변이 차가워집니다.' : '물에 녹아 용액이 됩니다.') + (water ? '' : ' 다른 용액에 넣어도 그 속의 물에 녹아 이온끼리 반응할 수 있습니다.') }));
      }
    }

    // 끓는점이 낮은 액체는 끓지 않아도 공기와 닿은 면부터 증발한다(증기는 공기 속으로 흩어진다고 본다). 증발하면서 열을 빼앗는다.
    if (B.id === 'air' && A.state === 'liquid' && A.sp && A.bp != null && A.bp >= 15 && A.bp < 90 && !A.aq) {
      out.push(R('evap:' + A.sp, A.name + '의 증발', [], [], { kind: 'physical', eq: `${A.formula}(l) → ${A.formula}(g)`, prob: 0.004 * Math.exp(-(A.bp - 20) / 30), toA: 'air', dT: -3, note: '끓는점보다 낮아도 표면의 분자는 공기 속으로 날아갑니다. 끓는점이 낮을수록 빨리 마르고, 증발할 때 열을 빼앗아 시원해집니다.' }));
    }

    // 산성·염기성 기체는 물이 든 용액에 녹는다. 암모니아는 산과 바로 중화되어 암모늄염이 된다.
    if (A.sp === 'NH3' && A.state === 'gas' && B.state === 'liquid' && B.aq && !isWater(B)) {
      const nh4 = B.acid ? salt('NH4', B.acid.a) : null;
      if (nh4 && nh4.aq) out.push(R('nh3-acid:' + B.fx, '암모니아와 ' + B.name, ['NH3', B.fx], [nh4.fx], { prob: 0.4, toA: nh4.aq, toB: nh4.aq, dT: 20, note: '암모니아 기체가 산에 녹아 바로 암모늄염 용액이 됩니다.' }));
      else if (!B.acid) out.push(R('nh3-dissolve', '암모니아가 용액에 녹음', [], [], { kind: 'physical', eq: 'NH₃(g) → NH₃(aq)', prob: 0.3, toA: 'NH4OH:aq', note: '암모니아는 물에 매우 잘 녹아 용액 속 물과 함께 암모니아수가 됩니다.' }));
    }
    if (A.id === 'HClg:g' && B.state === 'liquid' && B.aq && !isWater(B) && !B.acid) {
      out.push(R('hcl-dissolve', '염화수소가 용액에 녹음', [], [], { kind: 'physical', eq: 'HCl(g) → H⁺ + Cl⁻', prob: 0.3, toA: 'hcl', note: '염화수소는 물에 매우 잘 녹아 염산이 됩니다.' }));
    }

    // 할로젠화물·질산염 고체 + 진한 황산 → 휘발성 산 기체 (실험실에서 염화수소·질산을 얻는 방법)
    if (A.salt && A.state === 'powder' && B.id === 'H2SO4:l') {
      const { c, a } = A.salt;
      const sul = salt(c, 'SO4');
      if (sul && HALIDE_GAS[a]) {
        const acidFx = { Cl: 'HCl', F: 'HF', Br: 'HBr' }[a];
        out.push(R('h2so4-salt:' + A.fx, A.name + '과 진한 황산', [A.fx, 'H2SO4'], [sul.fx, acidFx], { minT: a === 'F' ? 60 : undefined, prob: 0.1, toA: sul.solid || sul.aq, toB: HALIDE_GAS[a], dT: 20, note: '진한 황산은 끓는점이 높아, 휘발성인 ' + acidFx + ' 기체를 밀어냅니다.' }));
      } else if (sul && a === 'I') {
        out.push(R('h2so4-salt:' + A.fx, A.name + '과 진한 황산', [], [], { kind: 'chemical', eq: '8I⁻ + H₂SO₄(진함) → 4I₂ + H₂S + …', prob: 0.1, toA: sul.solid || sul.aq, toB: 'I:g', dT: 30, note: '아이오딘화 이온은 진한 황산에 산화되어 보라색 아이오딘 증기가 나옵니다.' }));
      } else if (sul && a === 'NO3') {
        out.push(R('h2so4-salt:' + A.fx, A.name + '과 진한 황산', [A.fx, 'H2SO4'], [sul.fx, 'HNO3'], { minT: 80, prob: 0.08, toA: sul.solid || sul.aq, toB: 'HNO3', note: '질산염을 진한 황산과 데우면 질산이 증류되어 나옵니다.' }));
      }
    }

    // 진한 산의 산화 작용: 뜨거운 진한 황산·질산은 탄소와 황도 산화시킨다.
    if ((A.id === 'C:s' || A.id === 'graphite' || A.sp === 'S') && A.state !== 'gas' && (B.id === 'H2SO4:l' || B.id === 'HNO3:l')) {
      const isC = A.sp !== 'S', nitric = B.id === 'HNO3:l';
      const reac = [isC ? 'C' : 'S', nitric ? 'HNO3' : 'H2SO4'];
      const prods = nitric ? [isC ? 'CO2' : 'H2SO4', 'NO2', 'H2O'] : [isC ? 'CO2' : 'SO2', 'SO2', 'H2O'].filter((v, i, arr) => isC || i !== 1);
      out.push(R('oxacid:' + (isC ? 'C' : 'S') + ':' + (nitric ? 'N' : 'S'), A.name + '과 진한 ' + (nitric ? '질산' : '황산'), reac, prods, { minT: nitric ? 70 : 120, prob: 0.04, toA: isC ? 'CO2' : nitric ? 'H2SO4aq' : 'SO2', toB: nitric ? 'NO2' : 'SO2', dT: 20, note: '뜨거운 진한 산은 수소보다 반응성이 작은 비금속도 산화시킵니다.' }));
    }

    // 얼음은 다른 액체를 만나면 녹는다(용액은 0°C보다 낮은 온도에서 어므로). 진한 황산은 얼음도 뜨겁게 녹인다.
    if (A.id === 'H2O:s' && B.state === 'liquid' && !isWater(B) && (B.aq || B.misc || B.acid) && !B.indicator) {
      const hot = B.id === 'H2SO4:l';
      out.push(R('ice-melt:' + (hot ? 'H2SO4' : 'liquid'), hot ? '얼음과 진한 황산' : '얼음이 용액에 녹음', [], [], { kind: 'physical', eq: hot ? '얼음 + 진한 H₂SO₄ → 묽은 황산 + 열' : '얼음 + 용액 → 묽어진 용액', prob: hot ? 0.2 : 0.02, toA: hot ? 'H2SO4aq' : B.aq ? B.id : 'water', toB: hot ? 'H2SO4aq' : null, dT: hot ? 60 : -2, note: hot ? '진한 황산이 물과 섞이며 내는 열이 커서 얼음도 녹고 뜨거워집니다.' : '소금물·알코올·산 같은 용액은 0°C에서 얼지 않으므로 얼음을 녹입니다. 녹는 데 열을 써서 차가워집니다.' }));
    }

    // 황화수소 + 중금속 이온 용액 → 검은 황화물 앙금 (계통 분석)
    if (A.sp === 'H2S' && A.state === 'gas' && B.aq && B.salt && ['Cu2', 'Pb2', 'Ag', 'Hg2', 'Cd', 'Sn2', 'Bi3', 'Zn'].includes(B.salt.c) && SL.ACIDS[B.salt.a]) {
      const sul = salt(B.salt.c, 'S');
      const acid = SL.ACIDS[B.salt.a];
      if (sul && sul.solid) out.push(R('h2s-ion:' + B.fx, '황화수소와 ' + B.name, ['H2S', B.fx], [sul.fx, acid.fx], { prob: 0.3, toA: sul.solid, toB: acid.id, note: '황화수소를 통과시키면 금속 이온이 색 있는 황화물로 가라앉습니다. 금속 이온을 구별하는 방법입니다.' }));
    }

    // 얼음 + 염: 얼음이 녹는 데 필요한 열을 주변에서 빼앗아 영하로 내려간다(한제, 도로 제설).
    if (A.id === 'H2O:s' && B.salt && B.state === 'powder' && ICE_SALT[B.fx] != null) {
      const e = salt(B.salt.c, B.salt.a);
      if (e && e.aq) out.push(R('ice-salt:' + B.fx, '얼음과 ' + B.name, [], [], { kind: 'physical', eq: `얼음 + ${B.formula} → ${B.formula}(aq) + 열 흡수`, prob: 0.05, toA: e.aq, toB: e.aq, dT: ICE_SALT[B.fx], note: '염이 녹아든 물은 0°C보다 낮은 온도에서 업니다. 얼음이 녹으며 열을 빼앗아 영하 20°C 가까이 내려갑니다. 도로에 염화칼슘을 뿌리는 원리입니다.' }));
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

    // 고체 암모늄염 + 고체 강염기를 가열 → 암모니아 (실험실에서 암모니아를 얻는 방법)
    if (A.salt && A.salt.c === 'NH4' && A.state === 'powder' && B.state === 'powder' && B.salt && B.salt.a === 'OH' && ['Na', 'K', 'Ca', 'Ba', 'Sr', 'Li'].includes(B.salt.c) && B.id !== 'S:Ba(OH)2') {
      const p = salt(B.salt.c, A.salt.a);
      if (p) out.push(R('nh4-solid:' + A.fx + ':' + B.fx, '암모니아 발생(가열)', [A.fx, B.fx], [p.fx, 'NH3', 'H2O'], { minT: 80, prob: 0.1, toA: 'NH3', toB: p.solid || p.aq, note: '암모늄염과 강염기 고체를 섞어 가열하면 암모니아가 나옵니다.' }));
    }

    // 활성 금속 산화물 + 물 → 수산화물
    if (A.salt && A.salt.a === 'O' && (isWater(B) || B.id === 'H2O:g') && ACTIVE_OXIDES.has(A.salt.c)) {
      const h = salt(A.salt.c, 'OH');
      const slow = A.salt.c === 'Mg';
      if (h) out.push(R('oxide-water:' + A.fx, A.name + '과 물', [A.fx, 'H2O'], [h.fx], { prob: slow ? 0.003 : 0.08, toA: formOf(h), dT: slow ? 5 : 150, note: '발열이 커서 물이 끓기도 합니다.' }));
    }

    // 비금속 산화물 + 물 → 산
    if (OXIDES_TO_ACID[A.sp] && (A.state === 'gas' || A.sp === 'SO3') && isWater(B)) {
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
    // 열분해. 기체가 빠져나갈 공기 칸이나 불꽃 칸이 있어야 한다. 불꽃 쪽으로 나온 이산화탄소는 불을 끈다(베이킹소다 소화).
    if (A.salt && A.state === 'powder' && (B.id === 'air' || B.flame) && DECOMP[A.salt.a]) {
      const table = DECOMP[A.salt.a];
      const at = A.salt.c in table ? table[A.salt.c] : table.def;
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
    if (A.salt && A.state === 'powder' && (B.id === 'air' || B.flame) && NOBLE_OXIDES[A.fx]) {
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

    if (A.sp === 'CO' && A.state === 'gas' && B.salt && B.salt.a === 'O' && CO_REDUCE[B.salt.c] != null) {
      const el = SL.CATION[B.salt.c].el;
      out.push(R('co-reduce:' + B.fx, '일산화탄소로 ' + B.name + ' 환원', ['CO', B.fx], [el, 'CO2'], { minT: CO_REDUCE[B.salt.c], prob: 0.08, toA: 'CO2', toB: el + ':s', note: '용광로 안에서 철광석을 실제로 환원하는 것은 숯이 불완전 연소해 생긴 일산화탄소입니다.' }));
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
    if (A.flame && isWater(B)) out.push(R('fire-water', '물로 불 끄기', [], [], { kind: 'physical', eq: '불꽃 + 물 → 연기 + 수증기', prob: 0.5, toA: A.id === 'fire' ? 'smoke' : A.id === 'fire:H' ? 'H2O:g' : 'smoke:white', toB: 'H2O:g', note: '물이 열을 빼앗아 불이 꺼집니다.' }));

    // 지시약: 용액의 pH에 따라 변색 범위가 다르다. 순수한 물로 묽히는 것만으로는 색이 바뀌지 않게 한다.
    if (A.indicator && INDICATORS[A.indicator] && B.pH != null && B.state === 'liquid' && Math.abs(B.pH - 7) >= 0.5) {
      const ind = INDICATORS[A.indicator];
      const to = ind.to(B.pH);
      if (to !== A.id) {
        const side = B.pH < 7 ? 'acid' : 'base';
        const toDef = SL.MATERIALS.find((d) => d.id === to);
        out.push(R('indicator:' + A.indicator + ':' + side, `${ind.name}의 색 변화 (${side === 'acid' ? '산성' : '염기성'})`, [], [], { kind: 'physical', eq: `${ind.name} + pH ${B.pH} 용액 → ${toDef.name}`, prob: 0.5, toA: to, note: '지시약은 용액의 pH에 따라 색이 바뀌고, 지시약마다 색이 바뀌는 pH 범위가 다릅니다.' }));
      }
    }

    // 표백: 염소와 차아염소산 이온이 색소를 산화시켜 색을 없앤다.
    if ((A.indicator || A.id === 'starch:blue') && (B.id === 'A:NaClO' || B.id === 'Cl:g')) {
      out.push(R('bleach:' + A.id, A.name + '의 표백', [], [], { kind: 'chemical', eq: `${B.id === 'Cl:g' ? 'Cl₂' : 'ClO⁻'} + 색소 → 산화된 색소(무색)`, prob: 0.03, toA: 'bleached', note: '염소와 표백제는 색소 분자를 산화시켜 색을 없앱니다. 지시약도 표백되므로 표백제의 pH는 지시약으로 재기 어렵습니다.' }));
    }

    // 철(III) 이온 + 싸이오사이안산 이온 → 핏빛 착이온 (철 이온 검출)
    if (A.aq && A.salt && A.salt.c === 'Fe3' && B.id === 'A:KSCN') {
      const k = salt('K', A.salt.a);
      if (k) out.push(R('scn:' + A.fx, '철(III) 이온 검출', [A.fx, 'KSCN'], ['Fe(SCN)3', k.fx], { prob: 0.3, toA: 'A:Fe(SCN)3', toB: 'A:Fe(SCN)3', note: '아주 적은 철(III) 이온도 핏빛으로 변해 바로 알 수 있습니다.' }));
    }

    // 크로뮴산 이온(노랑) ⇄ 다이크로뮴산 이온(주황): 산을 넣으면 주황, 염기를 넣으면 다시 노랑.
    if (A.id === 'A:K2CrO4' && B.acid && B.state === 'liquid' && (B.acid.strength || 0.9) >= 0.1) {
      const k = salt('K', B.acid.a);
      if (k && k.aq) out.push(R('chromate:acid', '크로뮴산 이온과 산', ['K2CrO4', B.fx], ['K2Cr2O7', k.fx, 'H2O'], { prob: 0.3, toA: 'A:K2Cr2O7', toB: k.aq, note: '노란 크로뮴산 이온이 산을 만나 주황색 다이크로뮴산 이온이 됩니다. 염기를 넣으면 다시 노랗게 돌아가는 가역 반응입니다.' }));
    }
    if (A.id === 'A:K2Cr2O7' && B.aq && B.salt && B.salt.a === 'OH' && (B.salt.c === 'K' || B.salt.c === 'Na')) {
      const prods = B.salt.c === 'K' ? ['K2CrO4', 'H2O'] : ['K2CrO4', 'Na2CrO4', 'H2O'];
      out.push(R('chromate:base', '다이크로뮴산 이온과 염기', ['K2Cr2O7', B.fx], prods, { prob: 0.3, toA: 'A:K2CrO4', toB: B.salt.c === 'K' ? 'A:K2CrO4' : 'A:Na2CrO4', note: '주황색 다이크로뮴산 이온이 염기를 만나 노란 크로뮴산 이온으로 돌아갑니다.' }));
    }

    // 구리(II)·철(III) 이온은 아이오딘화 이온을 산화시켜 아이오딘(갈색)을 만든다.
    if (A.aq && A.salt && (A.salt.c === 'Cu2' || A.salt.c === 'Fe3') && B.id === 'A:KI') {
      const k = salt('K', A.salt.a);
      if (k && A.salt.c === 'Cu2') out.push(R('ki-ox:' + A.fx, '구리(II) 이온과 아이오딘화 이온', [A.fx, 'KI'], ['CuI', 'I2', k.fx], { prob: 0.2, toA: 'S:CuI', toB: 'A:KI3', note: '흰 아이오딘화 구리(I)가 가라앉고, 생긴 아이오딘이 남은 용액을 갈색으로 물들입니다.' }));
      const fe2 = salt('Fe2', A.salt.a);
      if (k && fe2 && A.salt.c === 'Fe3') out.push(R('ki-ox:' + A.fx, '철(III) 이온과 아이오딘화 이온', [A.fx, 'KI'], [fe2.fx, 'I2', k.fx], { prob: 0.2, toA: formOf(fe2), toB: 'A:KI3', note: '철(III) 이온이 철(II) 이온으로 환원되며 아이오딘이 생겨 갈색이 됩니다.' }));
    }

    // 표백제는 산과 만나면 염소를 낸다. 시판 표백제에는 염화 이온도 들어 있어 어떤 산이든 위험하다.
    if (A.id === 'A:NaClO' && B.acid && B.state === 'liquid' && B.id !== 'A:acid:HCl') {
      out.push(R('naclo-acid:' + B.fx, '표백제와 ' + B.name, [], [], { kind: 'chemical', eq: 'ClO⁻ + Cl⁻ + 2H⁺ → Cl₂↑ + H₂O', prob: 0.2, toA: 'brine', toB: 'Cl:g', note: '표백제에 산을 넣으면 유독한 염소 기체가 나옵니다. 식초처럼 약한 산도 마찬가지이니 절대 섞지 마세요.' }));
    }

    // 비누 + 산 → 물에 녹지 않는 지방산이 떠오른다(비누가 산성에서 거품을 못 내는 이유).
    if (A.id === 'soap' && B.acid && B.state === 'liquid' && (B.acid.strength || 0.9) >= 0.1) {
      const na = salt('Na', B.acid.a);
      if (na && na.aq) out.push(R('soap-acid:' + B.fx, '비누와 ' + B.name, ['C18H33NaO2', B.fx], ['C18H34O2', na.fx], { prob: 0.2, toA: 'oleic', toB: na.aq, note: '산이 비누를 원래의 지방산으로 되돌려 기름처럼 떠오릅니다.' }));
    }

    // 화학 정원: 금속염 결정이 물유리에 닿으면 표면에 규산염 막이 생기고, 안쪽의 가벼운 용액이 막을 뚫고 위로 솟으며 관이 자란다.
    if (A.salt && A.state === 'powder' && GARDEN[A.salt.c] && B.id === 'A:Na2SiO3') {
      const k = GARDEN[A.salt.c];
      out.push(R('garden', '화학 정원', [], [], { kind: 'chemical', eq: 'M²⁺ + SiO₃²⁻ → MSiO₃ 막 (삼투압으로 관이 자람)', prob: 0.1, toA: 'garden:' + k, toB: 'gjet:' + k, note: '금속 이온과 규산 이온이 만든 얇은 막 안으로 물이 스며들어(삼투) 막이 터지고, 가벼운 금속염 용액이 위로 솟으며 새 막을 만듭니다.' }));
    }
    if (A.id && A.id.startsWith('gjet:') && B.id === 'A:Na2SiO3') {
      const k = A.id.slice(5);
      out.push(R('garden', '화학 정원', [], [], { kind: 'chemical', eq: 'M²⁺ + SiO₃²⁻ → MSiO₃ 막 (삼투압으로 관이 자람)', prob: 0.06, toA: 'garden:' + k, toB: [['gjet:' + k, 0.92], ['garden:' + k, 0.08]], note: '금속 이온과 규산 이온이 만든 얇은 막 안으로 물이 스며들어(삼투) 막이 터지고, 가벼운 금속염 용액이 위로 솟으며 새 막을 만듭니다.' }));
    }
    // 물유리 + 산 → 실리카겔
    if (A.id === 'A:Na2SiO3' && B.acid && B.state === 'liquid' && (B.acid.strength || 0.9) >= 0.1) {
      const na = salt('Na', B.acid.a);
      if (na && na.aq) out.push(R('silicagel:' + B.fx, '물유리와 ' + B.name, ['Na2SiO3', B.fx], ['SiO2', na.fx, 'H2O'], { prob: 0.2, toA: 'silicagel', toB: na.aq, note: '산이 규산 이온을 굳혀 하얀 실리카겔이 생깁니다. 제습제를 만드는 방법입니다.' }));
    }

    // 구연산(레몬즙): 약한 산이라 일반 산 규칙 대신 실제로 쓰이는 반응만 둔다.
    if (A.id === 'A:citric' || (A.id === 'citric' && B.state === 'liquid' && B.aq)) {
      const solid = A.id === 'citric';
      const carb = B.salt && (B.salt.a === 'HCO3' || B.salt.a === 'CO3') ? B.salt : null;
      if (carb && (carb.c === 'Na' || carb.c === 'K')) out.push(R('citric-carb:' + B.fx, '구연산과 ' + B.name, [], [], { kind: 'chemical', eq: carb.a === 'HCO3' ? 'C₆H₈O₇ + 3NaHCO₃ → Na₃C₆H₅O₇ + 3CO₂↑ + 3H₂O' : '2C₆H₈O₇ + 3Na₂CO₃ → 2Na₃C₆H₅O₇ + 3CO₂↑ + 3H₂O', prob: 0.3, toA: 'A:citrate', toB: 'CO2', note: '구연산과 베이킹소다가 물에서 만나면 이산화탄소 거품이 납니다. 입욕제(배스 밤)와 발포 비타민의 원리입니다.' }));
      if (!solid && B.salt && B.salt.c === 'Ca' && B.salt.a === 'CO3') out.push(R('citric-scale', '구연산으로 물때 녹이기', [], [], { kind: 'chemical', eq: '2C₆H₈O₇ + 3CaCO₃ → Ca₃(C₆H₅O₇)₂ + 3CO₂↑ + 3H₂O', prob: 0.05, toA: 'A:citrate', toB: 'CO2', note: '주전자 물때(탄산칼슘)를 구연산으로 녹여 없앱니다.' }));
      if (!solid && B.salt && B.salt.a === 'O' && (B.salt.c === 'Fe3' || B.salt.c === 'Fe2')) out.push(R('citric-rust', '구연산으로 녹 없애기', [], [], { kind: 'chemical', eq: 'Fe₂O₃ + 2C₆H₈O₇ → 2FeC₆H₅O₇ + 3H₂O', prob: 0.03, toA: 'A:citrate', toB: 'A:citrate', note: '구연산은 철 이온과 잘 결합해 녹을 녹여 냅니다.' }));
      if (!solid && B.salt && B.salt.a === 'OH' && B.aq) out.push(R('citric-base:' + B.fx, '구연산과 ' + B.name, [], [], { kind: 'chemical', eq: 'C₆H₈O₇ + 3OH⁻ → C₆H₅O₇³⁻ + 3H₂O', prob: 0.3, toA: 'A:citrate', toB: 'A:citrate', dT: 20, note: '약한 산도 염기와 중화됩니다.' }));
      if (!solid && m == null && B.metal === 'Mg' && B.state !== 'gas') out.push(R('citric-mg', '구연산과 마그네슘', [], [], { kind: 'chemical', eq: '3Mg + 2C₆H₈O₇ → Mg₃(C₆H₅O₇)₂ + 3H₂↑', prob: 0.02, toA: 'A:citrate', toB: 'H:g', note: '약한 산이라 거품이 천천히 납니다.' }));
    }

    // 센물 + 비누 → 물에 녹지 않는 비누 찌꺼기(때)
    if (A.id === 'soap' && B.aq && ((B.salt && (B.salt.c === 'Ca' || B.salt.c === 'Mg')) || B.hard)) {
      const c = B.salt ? B.salt.c : 'Ca', a = B.salt ? B.salt.a : 'HCO3';
      const na = salt('Na', a);
      if (na && na.aq) out.push(R('scum:' + B.fx, '센물과 비누', ['C18H33NaO2', B.fx], [c + '(C18H33O2)2', na.fx], { prob: 0.2, toA: 'scum', toB: na.aq, note: '칼슘·마그네슘 이온이 많은 센물에서는 비누가 거품을 잘 내지 못하고 회색 찌꺼기가 뜹니다.' }));
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

  // ---- 전기 분해 ----
  // 전해질: 이온이 녹아 있어 전기가 통하는 수용액. 순수한 물과 설탕물은 전기가 거의 통하지 않는다.
  function electrolyteIons(E) {
    if (!E || E.state !== 'liquid' || !E.aq || E.indicator) return null;
    if (E.salt) return { c: E.salt.c, a: E.salt.a };
    if (E.acid) return { c: 'H', a: E.acid.a };
    return null;
  }
  const SUP = { 1: '⁺', 2: '²⁺', 3: '³⁺', 4: '⁴⁺' };
  const HALOGEN_PRODUCT = { Cl: ['Cl:g', 'Cl₂', '황록색 염소 기체'], Br: ['Br:l', 'Br₂', '적갈색 브로민'], I: ['I:s', 'I₂', '갈색 아이오딘'] };
  // side: 'cathode'(−, 환원) 또는 'anode'(+, 산화). 전해질 칸이 무엇으로 바뀌는지와 발견 정보를 돌려준다.
  function electrolysis(E, side) {
    const ions = electrolyteIons(E);
    if (!ions) return null;
    const { c, a } = ions;
    if (side === 'cathode') {
      const cat = SL.CATION[c];
      const el = cat && cat.el;
      // 알루미늄보다 반응성이 작은 금속 이온은 금속으로 석출된다(전기 도금).
      if (el && rank(el) > rank('Al')) {
        const ion = el + (SUP[cat.charge] || '⁺');
        return { to: el + ':s', deposit: true, e: cat.charge, key: 'electro:metal:' + el, name: '전기 분해: ' + SL.ELEMENTS.find((e) => e.sym === el).name + ' 석출', eq: `${ion} + ${cat.charge}e⁻ → ${el}`, note: '(−)극에서 금속 이온이 전자를 받아 금속이 되어 전극 표면에 붙습니다. 전기 도금과 금속 정련의 원리입니다.' };
      }
      // 반응성이 큰 금속 이온 대신 물(또는 수소 이온)이 환원되어 수소가 나오고, 남은 용액은 염기성이 된다.
      const base = c !== 'H' && salt(c, 'OH');
      return { to: [['H:g', 0.5], [base && base.aq ? base.aq : E.id, 0.5]], e: 2, key: 'electro:H2', name: '전기 분해: (−)극에서 수소 발생', eq: c === 'H' ? '2H⁺ + 2e⁻ → H₂↑' : '2H₂O + 2e⁻ → H₂↑ + 2OH⁻', note: c === 'H' ? '수소 이온이 전자를 받아 수소 기체가 됩니다.' : '나트륨처럼 반응성이 큰 금속 이온은 환원되지 않고, 대신 물이 환원되어 수소가 나옵니다. 전극 주변은 염기성이 됩니다.' };
    }
    const hal = HALOGEN_PRODUCT[a];
    if (hal) return { to: [[hal[0], 0.5], [E.id, 0.5]], e: 2, key: 'electro:' + a, name: '전기 분해: (+)극에서 ' + hal[2], eq: `2${a}⁻ → ${hal[1]} + 2e⁻`, note: c === 'Na' && a === 'Cl' ? '소금물을 전기 분해하면 (+)극에서 염소, (−)극에서 수소와 수산화나트륨이 생깁니다(염소-알칼리 공업).' : '할로젠화 이온이 전자를 잃고 할로젠이 됩니다.' };
    const acid = SL.ACIDS[a];
    return { to: [['O:g', 0.5], [acid && c !== 'H' && a !== 'OH' ? acid.id : E.id, 0.5]], e: 4, key: 'electro:O2', name: '전기 분해: (+)극에서 산소 발생', eq: a === 'OH' ? '4OH⁻ → O₂↑ + 2H₂O + 4e⁻' : '2H₂O → O₂↑ + 4H⁺ + 4e⁻', note: '황산 이온·질산 이온은 산화되지 않고 대신 물이 산화되어 산소가 나옵니다. 수소는 산소의 두 배만큼 나옵니다(물 = H₂O).' };
  }
  // 금속을 (+)극으로 쓰면 금속 자체가 녹아 이온이 된다(구리 정련, 도금할 금속 공급). 금·백금은 녹지 않는다.
  function anodeDissolve(metalDef, E) {
    const ions = electrolyteIons(E);
    const m = metalDef.metal && METALS[metalDef.metal];
    if (!ions || !m || !m.cat || metalDef.metal === 'Au') return null;
    const sal = salt(m.cat, ions.a);
    if (!sal || !sal.aq) return null;
    const el = metalDef.metal, ch = SL.CATION[m.cat].charge;
    return { to: sal.aq, e: ch, key: 'electro:anode:' + el, name: '전기 분해: (+)극의 ' + metalDef.name + '이(가) 녹음', eq: `${el} → ${el}${SUP[ch] || '⁺'} + ${ch}e⁻`, note: '금속을 (+)극으로 쓰면 전극 자체가 이온으로 녹아 들어갑니다. 구리를 순수하게 만드는 정련과 전기 도금에 씁니다.' };
  }

  SL.CHEM = { rulesFor, equation, balance, parseFormula, METALS, SERIES, electrolysis, anodeDissolve, electrolyteIons };

  // ---- 표로 지정하는 특수 반응 ----
  const WOOD = { id: 'wood_burn', name: '나무의 연소', reactants: ['C6H10O5', 'O2'], products: ['CO2', 'H2O'], note: '공기가 없으면 타지 않습니다.' };
  SL.REACTIONS = [
    // 나무: 발화 → 불씨 → (산소가 있으면) 연소. 산소가 없으면 불씨가 식어 꺼진다.
    ...OX.map((ox) => Object.assign({}, WOOD, { a: 'wood', b: ox, minT: 300, prob: 0.06, toA: 'ember', T: 600 })),
    Object.assign({}, WOOD, { a: 'wood', b: 'fire', prob: 0.5, toA: 'ember', T: 600 }),
    ...OX.map((ox) => Object.assign({}, WOOD, { a: 'ember', b: ox, prob: ox === 'air' ? 0.12 : 0.3, toA: [['fire', 0.7], ['ash', 0.3]], toB: 'fire', T: 900 })),
    Object.assign({}, WOOD, { a: 'ember', b: 'wood', prob: 0.08, toB: 'ember', T: 600, near: OX }),
    // 재는 구멍이 많아 공기가 통하고, 불꽃의 상승 기류에 날려 올라간다. 그래서 재가 덮여도 모닥불은 계속 탄다.
    Object.assign({}, WOOD, { a: 'ember', b: 'ash', near: OX, prob: 0.06, toA: [['fire', 0.7], ['ash', 0.3]], T: 900 }),
    { id: 'ash_lift', name: '재가 날림', kind: 'physical', eq: '불꽃의 상승 기류 → 재가 날아오름', a: 'fire', b: 'ash', prob: 0.05, toB: 'smoke', silent: true, note: '' },

    // 수소는 공기와 섞인 채 불이 붙으면 "펑" 하고 터지고, 순수한 산소와 2:1로 섞이면(산수소) 훨씬 세게 터진다.
    ...OX.map((ox) => ({ id: 'h2_burn', name: '수소의 연소', reactants: ['H2', 'O2'], products: ['H2O'], a: 'hydrogen', b: ox, minT: 500, prob: 0.6, toA: 'fire:H', toB: 'steam', T: 1100, explode: ox === 'air' ? 1.5 : 3, explodeP: ox === 'air' ? 0.15 : 0.4, note: '수소가 타면 물만 생깁니다. 공기나 산소와 섞인 수소에 불이 붙으면 폭발합니다.' })),
    // 불꽃 옆의 수소는 산소나 공기와 맞닿아 있으면 바로 탄다. 불꽃이 혼합 기체 전체로 순식간에 번진다.
    { id: 'h2_burn', name: '수소의 연소', reactants: ['H2', 'O2'], products: ['H2O'], a: 'hydrogen', b: 'fire', near: ['O:g'], prob: 0.7, toA: 'fire:H', T: 1100, explode: 3, explodeP: 0.4, note: '수소가 타면 물만 생깁니다. 공기나 산소와 섞인 수소에 불이 붙으면 폭발합니다.' },
    { id: 'h2_burn', name: '수소의 연소', reactants: ['H2', 'O2'], products: ['H2O'], a: 'hydrogen', b: 'fire', near: ['air'], prob: 0.6, toA: 'fire:H', T: 1100, explode: 1.5, explodeP: 0.15, note: '수소가 타면 물만 생깁니다. 공기나 산소와 섞인 수소에 불이 붙으면 폭발합니다.' },
    { id: 'h2_burn', name: '수소의 연소', reactants: ['H2', 'O2'], products: ['H2O'], a: 'hydrogen', b: 'fire', prob: 0.5, T: 550, note: '수소가 타면 물만 생깁니다. 공기나 산소와 섞인 수소에 불이 붙으면 폭발합니다.' },
    ...OX.map((ox) => ({ id: 'c_burn', name: '탄소의 연소', reactants: ['C', 'O2'], products: ['CO2'], a: 'C:s', b: ox, minT: 600, prob: ox === 'air' ? 0.05 : 0.2, toA: 'fire', toB: 'CO2', T: 1200, note: '숯이 타면 이산화탄소가 됩니다.' })),
    { id: 'c_burn', name: '탄소의 연소', reactants: ['C', 'O2'], products: ['CO2'], a: 'C:s', b: 'fire', prob: 0.3, T: 650, note: '숯이 타면 이산화탄소가 됩니다.' },
    ...['S:s', 'S:l'].flatMap((s) => OX.map((ox) => ({ id: 's_burn', name: '황의 연소', reactants: ['S', 'O2'], products: ['SO2'], a: s, b: ox, minT: 230, prob: ox === 'air' ? 0.1 : 0.3, toA: 'fire:S', toB: 'SO2', T: 1000, note: '파란 불꽃과 함께 자극적인 이산화황이 생깁니다.' }))),
    ...OX.map((ox) => ({ id: 'p_burn', name: '인의 연소', reactants: ['P', 'O2'], products: ['P4O10'], a: 'P:s', b: ox, minT: 34, prob: 0.2, toA: 'fire:clean', toB: 'smoke:white', T: 1500, note: '흰인은 30~40°C 정도에서도 스스로 불이 붙습니다.' })),
    ...OX.map((ox) => ({ id: 'si_burn', name: '규소의 산화', reactants: ['Si', 'O2'], products: ['SiO2'], a: 'Si:s', b: ox, minT: 900, prob: 0.02, toA: 'sand', note: '고온에서 이산화규소가 됩니다.' })),
    ...OX.map((ox) => ({ id: 'b_burn', name: '붕소의 연소', reactants: ['B', 'O2'], products: ['B2O3'], a: 'B:s', b: ox, minT: 700, prob: 0.1, toA: 'fire:Ba', toB: 'fire:Ba', T: 1800, note: '붕소는 녹색 불꽃을 냅니다.' })),
    { id: 'lava_burst', name: '마그마 수증기 폭발', kind: 'physical', eq: '용암 + 물 → 수증기 폭발', a: 'lava', b: 'water', prob: 0.01, toB: 'steam', explode: 2.5, T: 900, note: '물이 용암 속에 갇혀 순간적으로 끓으면 폭발합니다. 바다에서 일어나는 화산 폭발이 격렬한 이유입니다.' },
    { id: 'lava_quench', name: '용암의 급랭', kind: 'physical', eq: '용암 + 물 → 현무암 + 수증기', a: 'lava', b: 'water', prob: 0.15, toA: 'basalt', toB: 'steam', note: '겉면이 급히 식어 굳습니다.' },

    { id: 'fe_rust', name: '철의 부식', reactants: ['Fe', 'O2', 'H2O'], products: ['Fe(OH)3'], a: 'iron', b: 'water', near: OX, farFrom: ['Zn:s', 'Mg:s'], prob: 0.0015, toA: 'rust', note: '철은 물과 산소가 함께 있을 때 녹슬고, 산소가 없는 물속에서는 거의 녹슬지 않습니다.' },
    { id: 'fe_rust', name: '철의 부식', reactants: ['Fe', 'O2', 'H2O'], products: ['Fe(OH)3'], a: 'iron', b: 'brine', near: OX, farFrom: ['Zn:s', 'Mg:s'], prob: 0.02, toA: 'rust', dT: 45, note: '소금물에서는 부식이 더 빠르고, 철가루라면 열이 꽤 납니다. 일회용 손난로(철가루+소금+물+공기)의 원리입니다.' },
    { id: 'ag_tarnish', name: '은의 변색', reactants: ['Ag', 'H2S', 'O2'], products: ['Ag2S', 'H2O'], a: 'Ag:s', b: 'H2S', prob: 0.1, toA: 'S:Ag2S', note: '은은 황화수소를 만나면 검게 변합니다.' },

    { id: 'h2_cl2', name: '수소와 염소', reactants: ['H2', 'Cl2'], products: ['HCl'], a: 'hydrogen', b: 'Cl:g', minT: 250, prob: 0.5, toA: 'HClg', toB: 'HClg', dT: 500, explode: 2, explodeP: 0.3, note: '불을 붙이거나 강한 빛을 쬐면 폭발하며 염화수소가 됩니다.' },
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
    // 과산화수소가 분해되면 물과 함께 산소 기체가 나온다(2H₂O₂ → 2H₂O + O₂이므로 칸의 일부를 산소로 바꾼다).
    { id: 'h2o2_mno2', name: '과산화수소의 분해', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'S:MnO2', prob: 0.4, toA: [['water', 0.6], ['oxygen', 0.4]], dT: 10, note: '이산화망가니즈는 촉매라서 줄어들지 않습니다. 산소 거품이 납니다.' },
    { id: 'h2o2_ki', name: '과산화수소와 아이오딘화 칼륨', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'A:KI', prob: 0.3, toA: [['water', 0.6], ['oxygen', 0.4]], dT: 15, note: '아이오딘화 이온도 촉매입니다. 비누를 섞으면 산소가 거품을 부풀려 "코끼리 치약"이 됩니다.' },
    { id: 'h2o2_o2', name: '과산화수소의 분해', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'air', minT: 150, prob: 0.1, toA: 'water', toB: 'oxygen', note: '가열해도 물과 산소로 분해됩니다.' },
    { id: 'foam', name: '산소 거품', kind: 'physical', eq: 'O₂ + 비누 용액 → 거품', a: 'oxygen', b: 'soap', prob: 0.4, toA: 'foam', toB: 'foam', note: '비누 막이 기체를 가두어 거품이 됩니다. 시간이 지나면 터져 꺼집니다.' },
    { id: 'kmno4_h2o2', name: '과망가니즈산 칼륨과 과산화수소', eq: '2KMnO₄ + 3H₂O₂ → 2MnO₂ + 2KOH + 3O₂↑ + 2H₂O', a: 'A:KMnO4', b: 'H2O2', prob: 0.2, toA: 'S:MnO2', toB: 'oxygen', dT: 20, note: '보라색이 사라지고 갈색 이산화망가니즈가 생기며 산소가 나옵니다. 생긴 이산화망가니즈가 다시 과산화수소 분해를 돕습니다.' },
    { id: 'kmno4_heat', name: '과망가니즈산 칼륨의 열분해', reactants: ['KMnO4'], products: ['K2MnO4', 'MnO2', 'O2'], a: 'S:KMnO4', b: 'air', minT: 240, prob: 0.05, toA: 'S:MnO2', toB: 'oxygen', note: '가열하면 산소가 나옵니다. 실험실에서 산소를 얻는 방법 중 하나입니다.' },
    { id: 'kmno4_glycerol', name: '과망가니즈산 칼륨과 글리세롤', eq: '14KMnO₄ + 4C₃H₅(OH)₃ → 7K₂CO₃ + 7Mn₂O₃ + 5CO₂ + 16H₂O', a: 'S:KMnO4', b: 'C3H8O3', prob: 0.01, toA: 'fire', toB: 'fire', T: 900, note: '강한 산화제와 연료가 만나 잠시 뒤 저절로 불이 붙습니다. 실제로 따라 하지 마세요.' },
    { id: 'al_naoh', name: '알루미늄과 수산화나트륨', reactants: ['Al', 'NaOH', 'H2O'], products: ['NaAl(OH)4', 'H2'], a: 'Al:s', b: 'naoh', prob: 0.08, toA: 'A:NaAl(OH)4', toB: 'hydrogen', dT: 60, note: '알루미늄은 산뿐 아니라 강염기에도 녹습니다(양쪽성 금속). 알루민산 이온이 생깁니다.' },
    { id: 'zn_naoh', name: '아연과 수산화나트륨', reactants: ['Zn', 'NaOH', 'H2O'], products: ['Na2Zn(OH)4', 'H2'], a: 'Zn:s', b: 'naoh', minT: 60, prob: 0.04, toA: 'A:Na2Zn(OH)4', toB: 'hydrogen', dT: 20, note: '아연도 양쪽성 금속입니다. 아연산 이온이 생깁니다.' },
    { id: 'aloh3_naoh', name: '수산화알루미늄이 다시 녹음', reactants: ['Al(OH)3', 'NaOH'], products: ['NaAl(OH)4'], a: 'S:Al(OH)3', b: 'naoh', prob: 0.1, toA: 'A:NaAl(OH)4', toB: 'A:NaAl(OH)4', note: '흰 앙금이 수산화나트륨을 더 넣으면 다시 녹습니다. 양쪽성 수산화물의 특징입니다.' },
    { id: 'znoh2_naoh', name: '수산화아연이 다시 녹음', reactants: ['Zn(OH)2', 'NaOH'], products: ['Na2Zn(OH)4'], a: 'S:Zn(OH)2', b: 'naoh', prob: 0.1, toA: 'A:Na2Zn(OH)4', toB: 'A:Na2Zn(OH)4', note: '수산화아연도 과량의 염기에 다시 녹습니다.' },
    { id: 'cu_nh3', name: '구리 암모니아 착이온', reactants: ['Cu(OH)2', 'NH4OH'], products: ['Cu(NH3)4(OH)2', 'H2O'], a: 'S:Cu(OH)2', b: 'NH4OH:aq', prob: 0.15, toA: 'A:Cu(NH3)4(OH)2', toB: 'A:Cu(NH3)4(OH)2', note: '파란 수산화구리 앙금이 암모니아수를 더 넣으면 녹으며 짙은 남색 착이온이 됩니다.' },
    { id: 'agcl_nh3', name: '염화은이 암모니아수에 녹음', reactants: ['AgCl', 'NH4OH'], products: ['Ag(NH3)2Cl', 'H2O'], a: 'S:AgCl', b: 'NH4OH:aq', prob: 0.1, toA: 'A:Ag(NH3)2Cl', toB: 'A:Ag(NH3)2Cl', note: '물에 녹지 않는 염화은도 암모니아와 착이온을 만들어 녹습니다.' },
    { id: 'feoh2_air', name: '수산화철(II)의 산화', reactants: ['Fe(OH)2', 'O2', 'H2O'], products: ['Fe(OH)3'], a: 'S:Fe(OH)2', b: 'air', prob: 0.004, toA: 'S:Fe(OH)3', note: '녹색 앙금이 공기 속 산소와 만나 점점 적갈색으로 변합니다.' },
    { id: 'feoh2_air', name: '수산화철(II)의 산화', reactants: ['Fe(OH)2', 'O2', 'H2O'], products: ['Fe(OH)3'], a: 'S:Fe(OH)2', b: 'oxygen', prob: 0.02, toA: 'S:Fe(OH)3', note: '녹색 앙금이 산소와 만나 점점 적갈색으로 변합니다.' },
    { id: 'starch_iodine', name: '녹말과 아이오딘', kind: 'chemical', eq: '녹말 + I₂ → 청람색 착물', a: 'starch', b: 'I:s', prob: 0.3, toA: 'starch:blue', note: '아이오딘 분자가 녹말 사슬 속에 들어가 청람색이 됩니다. 녹말 검출 반응입니다.' },
    { id: 'starch_iodine', name: '녹말과 아이오딘', kind: 'chemical', eq: '녹말 + I₂ → 청람색 착물', a: 'starch', b: 'I:g', prob: 0.3, toA: 'starch:blue', note: '아이오딘 분자가 녹말 사슬 속에 들어가 청람색이 됩니다. 녹말 검출 반응입니다.' },
    { id: 'starch_heat', name: '녹말-아이오딘 색의 소멸', kind: 'physical', eq: '청람색 착물 → 녹말 + I₂ (가열)', a: 'starch:blue', b: 'air', minT: 70, prob: 0.05, toA: 'starch', note: '데우면 아이오딘이 사슬에서 빠져나와 색이 사라지고, 식히면 다시 나타납니다.' },
    { id: 'naclo_make', name: '표백제 만들기', reactants: ['Cl2', 'NaOH'], products: ['NaCl', 'NaClO', 'H2O'], a: 'Cl:g', b: 'naoh', prob: 0.2, toA: 'A:NaClO', toB: 'A:NaClO', dT: 10, note: '염소를 수산화나트륨 용액에 통과시키면 차아염소산나트륨(가정용 표백제)이 됩니다.' },
    { id: 'naclo_acid', name: '표백제와 산', reactants: ['NaClO', 'HCl'], products: ['NaCl', 'Cl2', 'H2O'], a: 'A:NaClO', b: 'hcl', prob: 0.3, toA: 'brine', toB: 'Cl:g', note: '표백제와 산성 세제를 섞으면 유독한 염소 기체가 나옵니다. 절대 섞지 마세요.' },
    { id: 'naclo_h2o2', name: '표백제와 과산화수소', eq: 'NaClO + H₂O₂ → NaCl + O₂↑ + H₂O', a: 'A:NaClO', b: 'H2O2', prob: 0.3, toA: 'brine', toB: 'oxygen', dT: 15, note: '두 산화제가 만나 산소가 거세게 나옵니다.' },
    { id: 'no_air', name: '일산화질소의 산화', reactants: ['NO', 'O2'], products: ['NO2'], a: 'NO', b: 'air', prob: 0.05, toA: 'NO2', note: '무색의 일산화질소가 공기와 만나면 바로 적갈색 이산화질소가 됩니다.' },
    { id: 'no_air', name: '일산화질소의 산화', reactants: ['NO', 'O2'], products: ['NO2'], a: 'NO', b: 'oxygen', prob: 0.2, toA: 'NO2', note: '무색의 일산화질소가 공기와 만나면 바로 적갈색 이산화질소가 됩니다.' },
    { id: 'h2s_so2', name: '황화수소와 이산화황', reactants: ['H2S', 'SO2'], products: ['S', 'H2O'], a: 'H2S', b: 'SO2', prob: 0.1, toA: 'S:s', toB: 'water', note: '두 기체가 만나면 노란 황 가루가 생깁니다. 화산 주변에 황이 쌓이는 원리입니다.' },
    { id: 'f2_water', name: '플루오린과 물', reactants: ['F2', 'H2O'], products: ['HF', 'O2'], a: 'F:g', b: 'water', prob: 0.4, toA: 'oxygen', toB: 'HF', dT: 100, note: '플루오린은 물에서도 산소를 빼앗아 플루오린화수소가 됩니다. 가장 강한 산화제입니다.' },
    { id: 'water_gas', name: '수성 가스 반응', reactants: ['C', 'H2O'], products: ['CO', 'H2'], a: 'C:s', b: 'steam', minT: 900, prob: 0.05, toA: 'CO', toB: 'hydrogen', dT: -60, note: '뜨거운 숯에 수증기를 통과시키면 일산화탄소와 수소가 생깁니다. 열을 흡수하는 반응입니다.' },
    { id: 'boudouard', name: '탄소와 이산화탄소', reactants: ['C', 'CO2'], products: ['CO'], a: 'C:s', b: 'CO2', minT: 800, prob: 0.03, toA: 'CO', toB: 'CO', dT: -40, note: '뜨거운 숯은 이산화탄소를 일산화탄소로 바꿉니다. 용광로에서 일산화탄소가 생기는 과정입니다.' },
    { id: 'carbide', name: '탄화칼슘과 물', reactants: ['CaC2', 'H2O'], products: ['Ca(OH)2', 'C2H2'], a: 'S:CaC2', b: 'water', prob: 0.1, toA: 'S:Ca(OH)2', toB: 'C2H2', dT: 40, note: '물을 만나면 아세틸렌 기체가 나옵니다. 옛날 카바이드 등불의 원리입니다.' },
    { id: 'ester', name: '에스터화 반응', reactants: ['C2H5OH', 'CH3COOH'], products: ['C4H8O2', 'H2O'], a: 'C2H5OH', b: 'CH3COOH', near: ['H2SO4'], minT: 60, prob: 0.05, toA: 'C4H8O2', toB: 'water', note: '진한 황산을 촉매로 알코올과 산이 만나 과일 향이 나는 아세트산 에틸이 됩니다.' },
    { id: 'endo_ba', name: '수산화바륨과 염화암모늄', reactants: ['Ba(OH)2', 'NH4Cl'], products: ['BaCl2', 'NH3', 'H2O'], a: 'S:Ba(OH)2', b: 'S:NH4Cl', prob: 0.1, toA: 'A:BaCl2', toB: 'NH3', dT: -30, note: '두 고체를 섞기만 해도 열을 빼앗아 영하로 내려갑니다. 대표적인 흡열 반응입니다.' },
    { id: 'dryice_water', name: '드라이아이스와 물', kind: 'physical', eq: 'CO₂(s) → CO₂(g)', a: 'CO2:s', b: 'water', prob: 0.08, toA: 'CO2', note: '물이 열을 주어 드라이아이스가 빠르게 승화합니다. 물은 차가워지고 이산화탄소 기체가 바닥으로 깔립니다.' },
    { id: 'oil_water', name: '뜨거운 기름에 물', kind: 'physical', eq: '뜨거운 기름 + 물 → 수증기 폭발 + 기름 불길', a: 'oil', b: 'water', minT: 200, prob: 0.4, toA: [['fire', 0.7], ['oil', 0.3]], toB: 'steam', T: 700, note: '물이 기름 아래로 가라앉아 순간적으로 끓으며 불붙은 기름을 튀깁니다. 기름 화재는 뚜껑이나 젖은 천으로 덮어 끕니다.' },
    { id: 'cuso4_hydrate', name: '황산구리의 수화', kind: 'chemical', eq: 'CuSO₄(흰색) + 5H₂O → CuSO₄·5H₂O(파랑)', a: 'S:CuSO4', b: 'steam', maxT: 120, prob: 0.2, toA: 'S:CuSO4·5H2O', toB: 'air', dT: 10, note: '흰 무수 황산구리가 물을 만나면 파랗게 변합니다. 물 검출에 씁니다.' },
    { id: 'cuso4_hydrate', name: '황산구리의 수화', kind: 'chemical', eq: 'CuSO₄(흰색) + 5H₂O → CuSO₄·5H₂O(파랑)', a: 'S:CuSO4', b: 'water', maxT: 90, prob: 0.1, toA: 'S:CuSO4·5H2O', dT: 10, note: '흰 무수 황산구리가 물을 만나면 파랗게 변합니다. 물 검출에 씁니다.' },
    { id: 'cuso4_dehydrate', name: '황산구리 오수화물의 가열', kind: 'chemical', eq: 'CuSO₄·5H₂O → CuSO₄ + 5H₂O', a: 'S:CuSO4·5H2O', b: 'air', minT: 110, prob: 0.05, toA: 'S:CuSO4', toB: 'steam', note: '가열하면 결정 속 물이 빠져나와 흰색이 됩니다.' },
    // 가루 사이로 수증기가 빠져나가므로, 이미 물이 빠진 가루 아래쪽도 차례로 흰색이 된다.
    { id: 'cuso4_dehydrate', name: '황산구리 오수화물의 가열', kind: 'chemical', eq: 'CuSO₄·5H₂O → CuSO₄ + 5H₂O', a: 'S:CuSO4·5H2O', b: 'S:CuSO4', minT: 110, prob: 0.03, toA: 'S:CuSO4', note: '가열하면 결정 속 물이 빠져나와 흰색이 됩니다.' },
    { id: 'cuso4_hydrate_dissolve', name: '황산구리 결정의 용해', kind: 'physical', eq: 'CuSO₄·5H₂O(s) → CuSO₄(aq)', a: 'S:CuSO4·5H2O', b: 'water', prob: 0.05, toA: 'A:CuSO4', toB: 'A:CuSO4', note: '물에 녹아 파란 용액이 됩니다.' },
    { id: 'cocl2_hydrate', name: '염화코발트의 수화', kind: 'chemical', eq: 'CoCl₂(파랑) + 6H₂O → CoCl₂·6H₂O(분홍)', a: 'S:CoCl2', b: 'steam', maxT: 120, prob: 0.2, toA: 'S:CoCl2·6H2O', toB: 'air', note: '파란 염화코발트가 물기를 만나면 분홍색이 됩니다. 습도 표시 종이에 씁니다.' },
    { id: 'cocl2_hydrate', name: '염화코발트의 수화', kind: 'chemical', eq: 'CoCl₂(파랑) + 6H₂O → CoCl₂·6H₂O(분홍)', a: 'S:CoCl2', b: 'water', maxT: 90, prob: 0.1, toA: 'S:CoCl2·6H2O', note: '파란 염화코발트가 물기를 만나면 분홍색이 됩니다. 습도 표시 종이에 씁니다.' },
    { id: 'cocl2_dehydrate', name: '염화코발트 육수화물의 가열', kind: 'chemical', eq: 'CoCl₂·6H₂O → CoCl₂ + 6H₂O', a: 'S:CoCl2·6H2O', b: 'air', minT: 110, prob: 0.05, toA: 'S:CoCl2', toB: 'steam', note: '가열해 물을 빼면 다시 파랗게 됩니다.' },
    { id: 'cocl2_dehydrate', name: '염화코발트 육수화물의 가열', kind: 'chemical', eq: 'CoCl₂·6H₂O → CoCl₂ + 6H₂O', a: 'S:CoCl2·6H2O', b: 'S:CoCl2', minT: 110, prob: 0.03, toA: 'S:CoCl2', note: '가열해 물을 빼면 다시 파랗게 됩니다.' },
    { id: 'cocl2_hydrate_dissolve', name: '염화코발트 결정의 용해', kind: 'physical', eq: 'CoCl₂·6H₂O(s) → CoCl₂(aq)', a: 'S:CoCl2·6H2O', b: 'water', prob: 0.05, toA: 'A:CoCl2', toB: 'A:CoCl2', note: '물에 녹아 분홍 용액이 됩니다.' },
    { id: 'patina', name: '구리의 녹(녹청)', reactants: ['Cu', 'O2', 'CO2', 'H2O'], products: ['Cu2(OH)2CO3'], a: 'Cu:s', b: 'water', near: OX, prob: 0.0008, toA: 'S:Cu2(OH)2CO3', note: '구리는 공기 속 산소·이산화탄소·물과 만나 오랜 시간에 걸쳐 푸른 녹청이 됩니다. 자유의 여신상이 푸른 이유입니다.' },
    { id: 'malachite_heat', name: '염기성 탄산구리의 열분해', reactants: ['Cu2(OH)2CO3'], products: ['CuO', 'CO2', 'H2O'], a: 'S:Cu2(OH)2CO3', b: 'air', minT: 250, prob: 0.05, toA: 'S:CuO', toB: 'CO2', note: '초록색 가루가 가열되면 검은 산화구리가 되고 이산화탄소와 물이 나옵니다.' },
    { id: 'malachite_acid', name: '염기성 탄산구리와 염산', reactants: ['Cu2(OH)2CO3', 'HCl'], products: ['CuCl2', 'CO2', 'H2O'], a: 'S:Cu2(OH)2CO3', b: 'hcl', prob: 0.1, toA: 'A:CuCl2', toB: 'CO2', note: '거품을 내며 녹아 청록색 용액이 됩니다.' },
    ...['limestone', 'marble'].map((a) => ({ id: 'hardwater', name: '탄산수가 석회암을 녹임', reactants: ['CaCO3', 'H2CO3'], products: ['Ca(HCO3)2'], a, b: 'A:acid:H2CO3', prob: 0.02, toA: 'A:Ca(HCO3)2', toB: 'A:Ca(HCO3)2', note: '이산화탄소가 녹은 빗물이 석회암을 천천히 녹여 석회 동굴을 만듭니다. 석회수에 이산화탄소를 계속 넣으면 다시 맑아지는 이유이기도 합니다.' })),
    { id: 'stalactite', name: '종유석과 물때', reactants: ['Ca(HCO3)2'], products: ['CaCO3', 'CO2', 'H2O'], a: 'A:Ca(HCO3)2', b: 'air', prob: 0.002, toA: 'limestone', toB: 'CO2', note: '센물에서 이산화탄소가 빠져나가면 탄산칼슘이 다시 쌓입니다. 종유석과 주전자 물때가 이렇게 생깁니다.' },
    { id: 'stalactite', name: '종유석과 물때', reactants: ['Ca(HCO3)2'], products: ['CaCO3', 'CO2', 'H2O'], a: 'A:Ca(HCO3)2', b: 'air', minT: 70, prob: 0.05, toA: 'limestone', toB: 'CO2', note: '센물을 끓이면 탄산칼슘이 빠르게 쌓입니다.' },
    // ---- 직접 떨어뜨렸을 때의 반응 (물질별로 실제 상황을 생각해 추가) ----
    // 백금: 반응하지 않지만 촉매로 작용한다.
    ...OX.map((ox) => ({ id: 'pt_h2', name: '백금 촉매와 수소', reactants: ['H2', 'O2'], products: ['H2O'], a: 'hydrogen', b: ox, near: ['Pt:s'], prob: 0.3, toA: 'fire:H', toB: 'steam', T: 900, note: '백금 표면에서는 불을 붙이지 않아도 수소가 산소와 반응해 불이 붙습니다(되베라이너 라이터).' })),
    { id: 'pt_h2o2', name: '백금 촉매와 과산화수소', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'Pt:s', prob: 0.3, toA: [['water', 0.6], ['oxygen', 0.4]], dT: 10, note: '백금은 줄어들지 않고 분해만 빠르게 합니다.' },
    { id: 'pt_aqua', name: '백금과 왕수', eq: '3Pt + 4HNO₃ + 18HCl → 3H₂PtCl₆ + 4NO + 8H₂O', a: 'Pt:s', b: 'aquaregia', prob: 0.02, toA: 'aquaregia', toB: 'NO2', note: '백금도 왕수에는 천천히 녹습니다.' },
    // 기체끼리
    { id: 'f2_h2', name: '플루오린과 수소', reactants: ['F2', 'H2'], products: ['HF'], a: 'F:g', b: 'hydrogen', prob: 0.6, toA: 'HFg', toB: 'HFg', dT: 800, explode: 2, explodeP: 0.3, note: '플루오린은 어둡고 차가운 곳에서도 수소와 폭발적으로 반응합니다.' },
    { id: 'cl2_h2s', name: '염소와 황화수소', reactants: ['Cl2', 'H2S'], products: ['S', 'HCl'], a: 'Cl:g', b: 'H2S', prob: 0.2, toA: 'HClg', toB: 'S:s', note: '염소가 황화수소에서 수소를 빼앗아 노란 황이 생깁니다.' },
    { id: 'nh3_cl2', name: '암모니아와 염소', reactants: ['NH3', 'Cl2'], products: ['N2', 'NH4Cl'], a: 'NH3', b: 'Cl:g', prob: 0.2, toA: 'S:NH4Cl', toB: 'nitrogen', dT: 30, note: '흰 연기(염화암모늄)가 생깁니다. 염소 누출을 암모니아로 찾는 방법이었습니다.' },
    { id: 'hi_water', name: '아이오딘화수소가 물에 녹음', eq: 'HI(g) → H⁺ + I⁻', kind: 'physical', a: 'HIg', b: 'water', prob: 0.4, toA: 'HI', toB: 'HI', dT: 10, note: '아이오딘화수소산이 됩니다.' },
    { id: 'hf_water', name: '플루오린화수소가 물에 녹음', eq: 'HF(g) → HF(aq)', kind: 'physical', a: 'HFg', b: 'water', prob: 0.4, toA: 'HF', toB: 'HF', dT: 10, note: '유리를 녹이는 플루오린화수소산이 됩니다.' },
    { id: 'ticl4', name: '사염화타이타늄의 가수 분해', reactants: ['TiCl4', 'H2O'], products: ['TiO2', 'HCl'], a: 'S:TiCl4', b: 'water', prob: 0.3, toA: 'S:TiO2', toB: 'hcl', dT: 40, note: '물을 만나면 흰 이산화타이타늄과 염산이 생깁니다.' },
    { id: 'ticl4', name: '사염화타이타늄의 가수 분해', reactants: ['TiCl4', 'H2O'], products: ['TiO2', 'HCl'], a: 'M:TiCl4', b: 'water', prob: 0.3, toA: 'S:TiO2', toB: 'hcl', dT: 40, note: '물을 만나면 흰 이산화타이타늄과 염산이 생깁니다.' },
    { id: 'ticl4_air', name: '사염화타이타늄의 흰 연기', kind: 'chemical', eq: 'TiCl₄ + 2H₂O(공기 중 습기) → TiO₂ + 4HCl', a: 'M:TiCl4', b: 'air', prob: 0.01, toA: 'S:TiO2', toB: 'smoke:white', note: '공기 중의 습기와 반응해 짙은 흰 연기를 냅니다. 연막에 쓰였습니다.' },
    // 공기 중에서 저절로
    { id: 'nh3_escape', name: '암모니아수에서 암모니아가 날아감', kind: 'physical', eq: 'NH₃(aq) → NH₃(g)', a: 'NH4OH:aq', b: 'air', prob: 0.002, toA: 'water', toB: 'NH3', note: '암모니아수는 뚜껑을 열어 두면 냄새를 내며 암모니아가 빠져나가 점점 묽어집니다.' },
    { id: 'soda_flat', name: '김빠진 탄산수', kind: 'physical', eq: 'H₂CO₃(aq) → H₂O + CO₂↑', a: 'A:acid:H2CO3', b: 'air', prob: 0.002, toA: 'water', toB: 'CO2', note: '열어 둔 탄산수는 이산화탄소가 빠져나가 그냥 물이 됩니다. 따뜻할수록 빠릅니다.' },
    { id: 'soda_flat', name: '김빠진 탄산수', kind: 'physical', eq: 'H₂CO₃(aq) → H₂O + CO₂↑', a: 'A:acid:H2CO3', b: 'air', minT: 35, prob: 0.02, toA: 'water', toB: 'CO2', note: '열어 둔 탄산수는 이산화탄소가 빠져나가 그냥 물이 됩니다. 따뜻할수록 빠릅니다.' },
    // 부식
    { id: 'fe_rust', name: '철의 부식', reactants: ['Fe', 'O2', 'H2O'], products: ['Fe(OH)3'], a: 'steel:s', b: 'water', near: OX, farFrom: ['Zn:s', 'Mg:s'], prob: 0.0012, toA: 'rust', note: '강철도 물과 산소가 함께 있으면 녹습니다.' },
    { id: 'fe_rust', name: '철의 부식', reactants: ['Fe', 'O2', 'H2O'], products: ['Fe(OH)3'], a: 'steel:s', b: 'brine', near: OX, farFrom: ['Zn:s', 'Mg:s'], prob: 0.006, toA: 'rust', note: '소금물에서는 부식이 더 빠릅니다.' },
    ...['bronze:s', 'brass:s'].map((a) => ({ id: 'patina', name: '구리의 녹(녹청)', reactants: ['Cu', 'O2', 'CO2', 'H2O'], products: ['Cu2(OH)2CO3'], a, b: 'water', near: OX, prob: 0.0005, toA: 'S:Cu2(OH)2CO3', note: '구리 합금도 물과 공기 속에서 천천히 푸른 녹이 습니다. 청동상이 푸른 이유입니다.' })),
    // 녹이고 섞기
    { id: 'sugar_dissolve', name: '설탕의 용해', kind: 'physical', eq: 'C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)', a: 'sugar', b: 'water', prob: 0.05, toA: 'A:sugar', toB: 'A:sugar', dT: -1, note: '설탕은 물에 아주 잘 녹지만 이온으로 나뉘지 않습니다.' },
    { id: 'glucose_dissolve', name: '포도당의 용해', kind: 'physical', eq: 'C₆H₁₂O₆(s) → C₆H₁₂O₆(aq)', a: 'glucose', b: 'water', prob: 0.05, toA: 'A:glucose', toB: 'A:glucose', dT: -2, note: '포도당은 물에 잘 녹고, 녹을 때 약간 시원해집니다.' },
    { id: 'iodine_ki', name: '아이오딘이 아이오딘화 칼륨 용액에 녹음', kind: 'chemical', eq: 'I₂ + I⁻ → I₃⁻', a: 'I:s', b: 'A:KI', prob: 0.1, toA: 'A:KI3', toB: 'A:KI3', note: '아이오딘은 물에는 잘 녹지 않지만 아이오딘화 이온과 결합해 갈색 용액이 됩니다.' },
    { id: 'starch_iodine', name: '녹말과 아이오딘', kind: 'chemical', eq: '녹말 + I₃⁻ → 청람색 착물', a: 'starch', b: 'A:KI3', prob: 0.4, toA: 'starch:blue', toB: 'A:KI', note: '아이오딘 분자가 녹말 사슬 속에 들어가 청람색이 됩니다. 녹말 검출 반응입니다.' },
    // 싸이오황산나트륨
    { id: 'thio_acid', name: '싸이오황산나트륨과 산', reactants: ['Na2S2O3', 'HCl'], products: ['NaCl', 'S', 'SO2', 'H2O'], a: 'A:Na2S2O3', b: 'hcl', prob: 0.01, toA: [['S:s', 0.5], ['brine', 0.5]], toB: 'SO2', note: '시간이 지나며 뿌연 황이 생깁니다. 온도와 농도에 따라 빠르기가 달라 반응 속도 실험에 씁니다.' },
    { id: 'thio_acid', name: '싸이오황산나트륨과 산', reactants: ['Na2S2O3', 'HCl'], products: ['NaCl', 'S', 'SO2', 'H2O'], a: 'A:Na2S2O3', b: 'hcl', minT: 50, prob: 0.04, toA: [['S:s', 0.5], ['brine', 0.5]], toB: 'SO2', note: '시간이 지나며 뿌연 황이 생깁니다. 데우면 훨씬 빨라집니다.' },
    { id: 'thio_iodine', name: '싸이오황산 이온과 아이오딘', eq: 'I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻', a: 'A:Na2S2O3', b: 'A:KI3', prob: 0.4, toB: 'A:KI', note: '갈색 아이오딘이 아이오딘화 이온으로 환원되어 색이 사라집니다. 아이오딘 적정의 원리입니다.' },
    { id: 'thio_iodine', name: '싸이오황산 이온과 아이오딘', eq: 'I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻', a: 'A:Na2S2O3', b: 'starch:blue', prob: 0.4, toB: 'starch', note: '아이오딘이 사라지며 청람색도 사라집니다.' },
    // 당과 환원 반응
    { id: 'benedict', name: '베네딕트 반응', eq: '환원당 + 2Cu²⁺ → Cu₂O↓(황적색) + 산화된 당', a: 'benedict', b: 'A:glucose', minT: 70, prob: 0.1, toA: 'S:Cu2O', note: '포도당 같은 환원당이 구리(II) 이온을 구리(I)로 환원시킵니다. 데워야 일어납니다.' },
    { id: 'benedict', name: '베네딕트 반응', eq: '환원당 + 2Cu²⁺ → Cu₂O↓(황적색) + 산화된 당', a: 'benedict', b: 'glucose', minT: 70, prob: 0.1, toA: 'S:Cu2O', note: '포도당 같은 환원당이 구리(II) 이온을 구리(I)로 환원시킵니다. 데워야 일어납니다.' },
    { id: 'tollens', name: '은거울 반응', eq: '환원당 + 2[Ag(NH₃)₂]⁺ → 2Ag↓ + 산화된 당', a: 'A:Ag(NH3)2Cl', b: 'A:glucose', minT: 50, prob: 0.1, toA: 'Ag:s', note: '은 이온이 환원되어 용기 벽에 은이 거울처럼 붙습니다.' },
    // 강한 산화제와 유기물
    { id: 'kmno4_fe2', name: '과망가니즈산 이온과 철(II) 이온', eq: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O', a: 'A:KMnO4', b: 'A:FeSO4', near: ['H2SO4aq'], prob: 0.3, toA: 'A:MnSO4', toB: 'A:Fe2(SO4)3', note: '산성 용액에서 보라색이 사라집니다. 산화·환원 적정에 씁니다.' },
    { id: 'kmno4_fe2_neutral', name: '과망가니즈산 이온과 철(II) 이온(중성)', eq: 'MnO₄⁻ + 3Fe²⁺ + … → MnO₂↓ + 3Fe³⁺', a: 'A:KMnO4', b: 'A:FeSO4', farFrom: ['H2SO4aq', 'H2SO4'], prob: 0.05, toA: 'S:MnO2', toB: 'A:Fe2(SO4)3', note: '산이 없으면 보라색이 사라지는 대신 갈색 이산화망가니즈 앙금이 생깁니다.' },
    { id: 'kmno4_ethanol', name: '과망가니즈산 칼륨과 에탄올', eq: '4MnO₄⁻ + 3C₂H₅OH → 4MnO₂↓ + 3CH₃COO⁻ + …', a: 'A:KMnO4', b: 'C2H5OH', prob: 0.03, toA: 'S:MnO2', toB: 'vinegar', note: '에탄올이 아세트산으로 산화되며 보라색이 갈색 앙금으로 바뀝니다.' },
    { id: 'breathalyzer', name: '음주 측정 반응', eq: '2Cr₂O₇²⁻ + 3C₂H₅OH + 16H⁺ → 4Cr³⁺ + 3CH₃COOH + 11H₂O', a: 'A:K2Cr2O7', b: 'C2H5OH', near: ['H2SO4aq', 'H2SO4'], prob: 0.2, toA: 'A:Cr2(SO4)3', toB: 'vinegar', note: '주황색이 초록색으로 바뀝니다. 옛 음주 측정기의 원리입니다.' },
    { id: 'h2so4_wood', name: '진한 황산과 나무', reactants: ['C6H10O5'], products: ['C', 'H2O'], a: 'wood', b: 'H2SO4', prob: 0.03, toA: 'C:s', toB: 'H2SO4aq', dT: 40, note: '진한 황산이 나무에서 물을 빼앗아 검게 탄 것처럼 됩니다.' },
    { id: 'hf_glass', name: '플루오린화수소산과 유리', reactants: ['SiO2', 'HF'], products: ['SiF4', 'H2O'], a: 'quartz', b: 'HF', prob: 0.03, toA: 'air', toB: 'water', note: '석영도 플루오린화수소산에 녹습니다.' },
    // 알칼리 금속과 알코올: 물보다 순하게 수소를 낸다.
    { id: 'na_ethanol', name: '나트륨과 에탄올', reactants: ['Na', 'C2H5OH'], products: ['C2H5ONa', 'H2'], a: 'Na:s', b: 'C2H5OH', prob: 0.03, toA: 'ethoxide', toB: 'hydrogen', dT: 30, note: '물보다 훨씬 순하게 수소 거품을 냅니다. 남은 나트륨을 안전하게 처리할 때 씁니다.' },
    { id: 'ethoxide_water', name: '소듐 에톡사이드와 물', reactants: ['C2H5ONa', 'H2O'], products: ['NaOH', 'C2H5OH'], a: 'ethoxide', b: 'water', prob: 0.2, toA: 'C2H5OH', toB: 'naoh', note: '물을 만나면 수산화나트륨과 에탄올로 돌아갑니다.' },
    // ---- 더 많은 조합 ----
    // 질산암모늄: 녹을 때 차가워지는 비료지만, 가열하면 분해되고 크게 뜨거워지면 폭발한다.
    ...['S:NH4NO3', 'M:NH4NO3'].map((a) => ({ id: 'an_decomp', name: '질산암모늄의 열분해', reactants: ['NH4NO3'], products: ['N2O', 'H2O'], a, b: 'air', minT: 210, prob: 0.05, toA: 'N2O', toB: 'steam', note: '200°C를 넘으면 아산화질소(웃음 기체)와 수증기로 분해됩니다.' })),
    ...['S:NH4NO3', 'M:NH4NO3'].map((a) => ({ id: 'an_blast', name: '질산암모늄의 폭발', reactants: ['NH4NO3'], products: ['N2', 'O2', 'H2O'], a, b: 'fire', minT: 300, prob: 0.2, toA: 'nitrogen', toB: 'steam', T: 2500, explode: 4, explodeP: 0.5, note: '많은 양이 크게 가열되면 폭발합니다. 2020년 베이루트 항구 폭발의 원인입니다.' })),
    { id: 'n2o_ember', name: '아산화질소와 불씨', reactants: ['C6H10O5', 'N2O'], products: ['CO2', 'H2O', 'N2'], a: 'ember', b: 'N2O', prob: 0.3, toA: 'fire', toB: 'nitrogen', T: 900, note: '뜨거운 아산화질소는 산소를 내놓아 꺼져 가는 불씨를 다시 타오르게 합니다.' },
    { id: 'graphite_burn', name: '흑연의 연소', reactants: ['C', 'O2'], products: ['CO2'], a: 'graphite', b: 'air', minT: 750, prob: 0.03, toA: 'fire', toB: 'CO2', T: 1200, note: '흑연 감속재가 아주 뜨거워진 채 공기를 만나면 불이 붙습니다.' },
    // 질화물
    { id: 'nitride_water', name: '질화마그네슘과 물', reactants: ['Mg3N2', 'H2O'], products: ['Mg(OH)2', 'NH3'], a: 'S:Mg3N2', b: 'water', prob: 0.1, toA: 'S:Mg(OH)2', toB: 'NH3', dT: 20, note: '물을 만나면 암모니아 냄새가 납니다.' },
    { id: 'nitride_water', name: '질화리튬과 물', reactants: ['Li3N', 'H2O'], products: ['LiOH', 'NH3'], a: 'S:Li3N', b: 'water', prob: 0.2, toA: 'A:LiOH', toB: 'NH3', dT: 40, note: '물을 만나면 암모니아가 나옵니다.' },
    // 산화철
    { id: 'smelt:Fe3O4', name: '자철석 제련', reactants: ['C', 'Fe3O4'], products: ['Fe', 'CO2'], a: 'C:s', b: 'S:Fe3O4', minT: 800, prob: 0.05, toA: 'CO2', toB: 'iron', note: '탄소가 자철석에서 산소를 빼앗아 철을 얻습니다.' },
    { id: 'thermite:Al:Fe3O4', name: '자철석의 테르밋 반응', reactants: ['Al', 'Fe3O4'], products: ['Al2O3', 'Fe'], a: 'Al:s', b: 'S:Fe3O4', minT: 900, prob: 0.4, toA: 'S:Al2O3', toB: 'iron', T: 2500, note: '알루미늄이 산화철에서 산소를 빼앗아 쇳물이 나옵니다.' },
    { id: 'fe3o4_acid', name: '자철석과 염산', reactants: ['Fe3O4', 'HCl'], products: ['FeCl2', 'FeCl3', 'H2O'], a: 'S:Fe3O4', b: 'hcl', prob: 0.05, toA: 'A:FeCl3', toB: 'A:FeCl2', note: '철(II)과 철(III)이 섞인 산화물이라 두 가지 염이 함께 생깁니다.' },
    // 기체·비금속
    { id: 'h2_s', name: '수소와 황', reactants: ['H2', 'S'], products: ['H2S'], a: 'hydrogen', b: 'S:l', minT: 300, prob: 0.05, toA: 'H2S', toB: 'H2S', note: '녹은 황 위로 수소를 통과시키면 달걀 썩는 냄새의 황화수소가 생깁니다.' },
    { id: 'cao_co2', name: '생석회가 이산화탄소를 흡수', reactants: ['CaO', 'CO2'], products: ['CaCO3'], a: 'quicklime', b: 'CO2', prob: 0.003, toA: 'limestone', toB: 'air', note: '생석회는 공기 중 이산화탄소를 천천히 흡수해 다시 석회암이 됩니다.' },
    { id: 'cl2_fe2', name: '염소와 철(II) 이온', reactants: ['Cl2', 'FeCl2'], products: ['FeCl3'], a: 'Cl:g', b: 'A:FeCl2', prob: 0.2, toA: 'A:FeCl3', toB: 'A:FeCl3', note: '연두색 철(II) 용액이 노란 갈색 철(III) 용액으로 변합니다.' },
    { id: 'kmno4_hcl', name: '과망가니즈산 칼륨과 염산', reactants: ['KMnO4', 'HCl'], products: ['KCl', 'MnCl2', 'Cl2', 'H2O'], a: 'S:KMnO4', b: 'hcl', prob: 0.1, toA: 'A:MnCl2', toB: 'Cl:g', note: '염산이 산화되어 황록색 염소 기체가 나옵니다. 실험실에서 염소를 얻는 방법이지만 유독합니다.' },
    { id: 'mno2_hcl', name: '이산화망가니즈와 진한 염산', reactants: ['MnO2', 'HCl'], products: ['MnCl2', 'Cl2', 'H2O'], a: 'S:MnO2', b: 'hcl', minT: 60, prob: 0.05, toA: 'A:MnCl2', toB: 'Cl:g', note: '셸레가 처음 염소를 발견한 반응입니다. 데워야 일어납니다.' },
    // 금속끼리, 아말감
    { id: 'cu_fecl3', name: '염화철(III)로 구리 녹이기', reactants: ['Cu', 'FeCl3'], products: ['CuCl2', 'FeCl2'], a: 'Cu:s', b: 'A:FeCl3', prob: 0.05, toA: 'A:CuCl2', toB: 'A:FeCl2', note: '구리는 염산에는 안 녹지만 철(III) 이온에는 녹습니다. 인쇄 회로 기판을 만드는 에칭 원리입니다.' },
    { id: 'al_hg', name: '알루미늄과 수은', kind: 'chemical', eq: '4Al(Hg) + 3O₂ → 2Al₂O₃ (산화막이 계속 벗겨짐)', a: 'Al:s', b: 'Hg:l', near: OX, prob: 0.02, toA: 'S:Al2O3', dT: 30, note: '수은이 알루미늄의 보호 산화막을 무너뜨려, 알루미늄이 공기 중에서 흰 털처럼 산화물을 피워 올립니다. 비행기에 수은 반입이 금지된 이유입니다.' },
    { id: 'au_hg', name: '금 아말감 만들기', kind: 'physical', eq: 'Au + Hg → 아말감', a: 'Au:s', b: 'Hg:l', prob: 0.05, toA: 'amalgam', toB: 'amalgam', note: '금은 수은에 녹아 반죽이 됩니다. 옛날에 모래 속 금을 모으던 방법입니다.' },
    { id: 'amalgam_heat', name: '아말감 가열', kind: 'physical', eq: 'Au-Hg → Au + Hg↑', a: 'amalgam', b: 'air', minT: 360, prob: 0.1, toA: 'Au:s', toB: 'Hg:g', note: '수은이 증발하고 금만 남습니다. 수은 증기는 매우 유독해 지금은 쓰지 않습니다.' },
    { id: 'al_i2', name: '알루미늄과 아이오딘(물 한 방울)', reactants: ['Al', 'I2'], products: ['AlI3'], a: 'Al:s', b: 'I:s', near: ['water'], prob: 0.1, toA: 'S:Al2O3', toB: 'I:g', dT: 600, note: '물 한 방울이 촉매가 되어 격렬히 반응하고 보라색 아이오딘 증기가 솟습니다(남은 고체는 단순화해 표시).' },
    { id: 'zn_i2', name: '아연과 아이오딘(물)', reactants: ['Zn', 'I2'], products: ['ZnI2'], a: 'Zn:s', b: 'I:s', near: ['water'], prob: 0.05, toA: 'A:ZnI2', toB: 'A:ZnI2', dT: 40, note: '물속에서 아연과 아이오딘이 직접 결합해 무색 용액이 됩니다. 원소에서 화합물을 만드는 대표 실험입니다.' },
    { id: 'cu_nh3_air', name: '구리가 암모니아수에 녹음', kind: 'chemical', eq: '2Cu + 8NH₃ + O₂ + 2H₂O → 2[Cu(NH₃)₄]²⁺ + 4OH⁻', a: 'Cu:s', b: 'NH4OH:aq', near: OX, prob: 0.003, toA: 'A:Cu(NH3)4(OH)2', note: '공기가 있으면 구리도 암모니아수에 천천히 녹아 짙은 남색이 됩니다.' },
    { id: 'ag2o_nh3', name: '톨렌스 시약 만들기', kind: 'chemical', eq: 'Ag₂O + 4NH₃ + H₂O → 2[Ag(NH₃)₂]OH', a: 'S:Ag2O', b: 'NH4OH:aq', prob: 0.1, toA: 'A:Ag(NH3)2Cl', toB: 'A:Ag(NH3)2Cl', note: '질산은에 암모니아수를 넣으면 갈색 앙금이 생겼다가 더 넣으면 녹습니다. 은거울 반응에 쓰는 시약입니다.' },
    // 브로민수와 불포화 검출
    { id: 'br_water', name: '브로민이 물에 녹음', kind: 'physical', eq: 'Br₂(l) → Br₂(aq)', a: 'Br:l', b: 'water', prob: 0.03, toA: 'brominewater', toB: 'brominewater', note: '브로민은 물에 조금 녹아 주황색 브로민수가 됩니다.' },
    ...['brominewater', 'Br:l', 'Br:g'].flatMap((a) => ['C2H4', 'C2H2'].map((b) => ({ id: 'br_alkene', name: '브로민의 첨가 반응(불포화 검출)', reactants: ['C2H4', 'Br2'], products: ['C2H4Br2'], a, b, prob: 0.3, toA: a === 'brominewater' ? 'water' : 'C2H4Br2', toB: a === 'brominewater' ? 'C2H4Br2' : 'air', note: '이중·삼중 결합이 있는 탄화수소는 브로민의 색을 없앱니다. 메테인 같은 포화 탄화수소는 빛이 없으면 반응하지 않습니다.' }))),
    ...['C2H4', 'C2H2'].map((b) => ({ id: 'kmno4_alkene', name: '과망가니즈산 칼륨과 에틸렌', eq: '3C₂H₄ + 2MnO₄⁻ + 4H₂O → 3C₂H₄(OH)₂ + 2MnO₂ + 2OH⁻', a: 'A:KMnO4', b, prob: 0.2, toA: 'S:MnO2', toB: 'air', note: '보라색이 사라지고 갈색 앙금이 생깁니다(불포화 검출, 바이어 시험).' })),
    { id: 'ethylene_make', name: '에탄올의 탈수(에틸렌 만들기)', reactants: ['C2H5OH'], products: ['C2H4', 'H2O'], a: 'C2H5OH:g', b: 'H2SO4', minT: 160, prob: 0.1, toA: 'C2H4', toB: 'H2SO4', note: '진한 황산과 170°C 정도로 가열하면 에탄올에서 물이 빠져 에틸렌이 생깁니다.' },
    { id: 'ethylene_make', name: '에탄올의 탈수(에틸렌 만들기)', reactants: ['C2H5OH'], products: ['C2H4', 'H2O'], a: 'C2H5OH', b: 'H2SO4', minT: 160, prob: 0.1, toA: 'C2H4', note: '진한 황산과 170°C 정도로 가열하면 에탄올에서 물이 빠져 에틸렌이 생깁니다.' },
    { id: 'cuo_ethanol', name: '산화구리와 에탄올', eq: 'CuO + C₂H₅OH → Cu + CH₃CHO + H₂O', a: 'S:CuO', b: 'C2H5OH:g', minT: 250, prob: 0.1, toA: 'Cu:s', toB: 'steam', note: '검게 산화된 구리가 에탄올 증기를 만나면 다시 붉은 구리로 돌아갑니다. 에탄올은 아세트알데하이드가 됩니다.' },
    { id: 'cuo_ethanol', name: '산화구리와 에탄올', eq: 'CuO + C₂H₅OH → Cu + CH₃CHO + H₂O', a: 'S:CuO', b: 'C2H5OH', minT: 250, prob: 0.1, toA: 'Cu:s', toB: 'steam', note: '검게 산화된 구리가 에탄올 증기를 만나면 다시 붉은 구리로 돌아갑니다. 에탄올은 아세트알데하이드가 됩니다.' },
    // 아이오딘
    { id: 'tincture', name: '아이오딘이 에탄올에 녹음', kind: 'physical', eq: 'I₂(s) → I₂(에탄올)', a: 'I:s', b: 'C2H5OH', prob: 0.1, toA: 'tincture', toB: 'tincture', note: '아이오딘은 물에는 잘 안 녹지만 에탄올에는 잘 녹아 갈색 소독약(팅크)이 됩니다.' },
    { id: 'starch_iodine', name: '녹말과 아이오딘', kind: 'chemical', eq: '녹말 + I₂ → 청람색 착물', a: 'starch', b: 'tincture', prob: 0.4, toA: 'starch:blue', toB: 'C2H5OH', note: '아이오딘 분자가 녹말 사슬 속에 들어가 청람색이 됩니다. 녹말 검출 반응입니다.' },
    { id: 'thio_iodine', name: '싸이오황산 이온과 아이오딘', eq: 'I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻', a: 'A:Na2S2O3', b: 'I:s', prob: 0.2, toB: 'A:NaI', note: '아이오딘 고체도 싸이오황산 이온에 녹아 무색이 됩니다.' },
    // 카멜레온 반응
    { id: 'chameleon', name: '카멜레온 반응(보라 → 초록)', eq: 'MnO₄⁻(보라) + e⁻ → MnO₄²⁻(초록)', a: 'A:KMnO4', b: 'A:glucose', near: ['naoh'], prob: 0.1, toA: 'A:K2MnO4', note: '염기성에서 포도당이 과망가니즈산 이온을 차례로 환원시켜 보라 → 초록 → 주황 갈색으로 색이 변합니다.' },
    { id: 'chameleon2', name: '카멜레온 반응(초록 → 갈색)', eq: 'MnO₄²⁻(초록) + 2H₂O + 2e⁻ → MnO₂↓ + 4OH⁻', a: 'A:K2MnO4', b: 'A:glucose', prob: 0.05, toA: 'S:MnO2', note: '초록색 망가니즈산 이온이 더 환원되어 갈색 이산화망가니즈가 됩니다.' },
    // 비누와 기름
    { id: 'emulsify', name: '비누가 기름을 씻어 냄', kind: 'physical', eq: '기름 + 비누 → 미셀(유화)', a: 'oil', b: 'soap', prob: 0.05, toA: 'emulsion', toB: 'emulsion', note: '비누 분자의 기름 쪽 꼬리가 기름을 감싸고 물 쪽 머리가 바깥을 향해 기름이 물에 섞입니다.' },
    { id: 'soap', name: '비누화 반응', eq: '지방 + 3NaOH → 비누 + 글리세롤', a: 'fat', b: 'naoh', minT: 40, prob: 0.05, toA: 'soap', toB: 'C3H8O3', dT: 10, note: '굳은 기름도 염기와 데우면 비누가 됩니다.' },
    // 단백질 (달걀흰자)
    ...['naoh', 'A:KOH'].map((b) => ({ id: 'biuret', name: '뷰렛 반응(단백질 검출)', kind: 'chemical', eq: '단백질 + Cu²⁺ (염기성) → 보라색 착물', a: 'eggwhite', b, near: ['A:CuSO4'], prob: 0.3, toA: 'biuret', note: '수산화나트륨과 황산구리 용액을 넣으면 단백질이 보라색으로 변합니다.' })),
    { id: 'biuret', name: '뷰렛 반응(단백질 검출)', kind: 'chemical', eq: '단백질 + Cu²⁺ (염기성) → 보라색 착물', a: 'eggwhite', b: 'A:CuSO4', near: ['naoh'], prob: 0.3, toA: 'biuret', toB: 'biuret', note: '수산화나트륨과 황산구리 용액을 넣으면 단백질이 보라색으로 변합니다.' },
    { id: 'xanthoprotein', name: '잔토프로테인 반응', kind: 'chemical', eq: '단백질 + 진한 HNO₃ → 노란색', a: 'eggwhite', b: 'HNO3', prob: 0.3, toA: 'eggwhite:yellow', note: '진한 질산이 단백질을 노랗게 만듭니다. 질산이 피부에 묻으면 노래지는 이유입니다.' },
    ...['hcl', 'H2SO4aq', 'HNO3aq', 'vinegar', 'C2H5OH', 'A:CuSO4', 'A:AgNO3', 'A:Pb(NO3)2', 'A:HgCl2'].map((b) => ({ id: 'denature', name: '단백질의 변성', kind: 'chemical', eq: '단백질 + 산·알코올·중금속 이온 → 굳은 단백질', a: 'eggwhite', b, prob: 0.05, toA: 'eggwhite:cooked', note: '산, 알코올, 중금속 이온은 단백질의 모양을 망가뜨려 굳게 합니다. 중금속이 몸에 해로운 이유이기도 합니다.' })),
    // 효소
    { id: 'catalase', name: '카탈레이스 효소', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'liver', prob: 0.5, toA: [['water', 0.6], ['oxygen', 0.4]], note: '생간의 효소가 과산화수소를 순식간에 분해해 거품이 일어납니다. 익힌 간에서는 일어나지 않습니다.' },
    { id: 'h2o2_rust', name: '녹과 과산화수소', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'rust', prob: 0.03, toA: [['water', 0.6], ['oxygen', 0.4]], note: '산화철도 과산화수소 분해를 조금 돕습니다.' },
    { id: 'h2o2_base', name: '염기 속 과산화수소', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'naoh', prob: 0.01, toA: [['water', 0.6], ['oxygen', 0.4]], note: '과산화수소는 염기성에서 더 빨리 분해됩니다. 그래서 약국의 과산화수소는 약한 산성으로 보관합니다.' },
    // ---- 생활 속의 실제 반응 ----
    { id: 'citric_dissolve', name: '구연산의 용해', kind: 'physical', eq: 'C₆H₈O₇(s) → C₆H₈O₇(aq)', a: 'citric', b: 'water', prob: 0.05, toA: 'A:citric', toB: 'A:citric', dT: -2, note: '구연산은 물에 잘 녹아 신 용액이 됩니다.' },
    { id: 'borax_dissolve', name: '붕사의 용해', kind: 'physical', eq: 'Na₂B₄O₇(s) → Na₂B₄O₇(aq)', a: 'S:borax', b: 'water', prob: 0.03, toA: 'A:borax', toB: 'A:borax', note: '붕사는 물에 녹아 약한 염기가 됩니다.' },
    { id: 'slime', name: '슬라임 만들기', kind: 'chemical', eq: 'PVA 사슬 + B(OH)₄⁻ → 교차 결합된 고분자', a: 'glue', b: 'A:borax', prob: 0.2, toA: 'slime', toB: 'slime', note: '붕산 이온이 풀의 긴 사슬들을 다리처럼 이어 끈적하게 흐르는 슬라임이 됩니다.' },
    ...['A:citric', 'vinegar', 'hcl', 'A:acid:H2CO3', 'whey'].filter((b) => b !== 'whey').map((b) => ({ id: 'milk_curd', name: '우유가 산에 굳음', kind: 'chemical', eq: '카제인 + H⁺ → 엉긴 카제인 (pH 4.6)', a: 'milk', b, prob: 0.1, toA: 'curd', toB: 'whey', note: '산이 카제인 단백질의 전하를 없애 서로 엉겨 붙습니다. 리코타 치즈와 두부(간수)를 만드는 원리입니다.' })),
    { id: 'mentos', name: '박하 사탕과 탄산수', kind: 'physical', eq: 'CO₂(녹아 있음) → CO₂(거품) (표면에서 기포 생성)', a: 'mentos', b: 'A:acid:H2CO3', prob: 0.6, toB: [['CO2', 0.6], ['foam', 0.4]], note: '화학 반응이 아닙니다. 사탕 표면의 작은 구멍에서 녹아 있던 이산화탄소가 한꺼번에 거품이 되어 뿜어져 나옵니다.' },
    { id: 'vitc_iodine', name: '비타민 C와 아이오딘', eq: 'C₆H₈O₆ + I₂ → C₆H₆O₆ + 2HI', a: 'A:vitc', b: 'A:KI3', prob: 0.4, toB: 'A:KI', note: '비타민 C가 아이오딘을 환원시켜 갈색이 사라집니다. 음료 속 비타민 C 양을 재는 방법입니다.' },
    { id: 'vitc_iodine', name: '비타민 C와 아이오딘', eq: 'C₆H₈O₆ + I₂ → C₆H₆O₆ + 2HI', a: 'A:vitc', b: 'starch:blue', prob: 0.4, toB: 'starch', note: '비타민 C가 아이오딘을 환원시켜 청람색이 사라집니다.' },
    { id: 'vitc_iodine', name: '비타민 C와 아이오딘', eq: 'C₆H₈O₆ + I₂ → C₆H₆O₆ + 2HI', a: 'A:vitc', b: 'tincture', prob: 0.4, toB: 'C2H5OH', note: '비타민 C가 아이오딘을 환원시켜 갈색이 사라집니다.' },
    { id: 'vitc_fe3', name: '비타민 C와 철(III) 이온', eq: 'C₆H₈O₆ + 2Fe³⁺ → C₆H₆O₆ + 2Fe²⁺ + 2H⁺', a: 'A:vitc', b: 'A:FeCl3', prob: 0.2, toB: 'A:FeCl2', note: '비타민 C는 철을 흡수되기 쉬운 철(II)로 바꿉니다.' },
    { id: 'vitc_kmno4', name: '비타민 C와 과망가니즈산 칼륨', eq: '5C₆H₈O₆ + 2MnO₄⁻ + 6H⁺ → 5C₆H₆O₆ + 2Mn²⁺ + 8H₂O', a: 'A:vitc', b: 'A:KMnO4', prob: 0.2, toB: 'A:MnSO4', note: '보라색이 사라집니다.' },
    { id: 'hotice', name: '핫 아이스 (과포화 용액의 결정화)', kind: 'physical', eq: 'NaCH₃COO(aq, 과포화) → NaCH₃COO·3H₂O(s) + 열', a: 'supersat', b: 'S:NaCH3COO', maxT: 54, prob: 0.5, toA: 'S:NaCH3COO', T: 54, note: '결정 하나가 씨앗이 되어 녹아 있던 것이 한꺼번에 굳으며 녹을 때 흡수했던 열을 내놓습니다. 재사용 손난로의 원리입니다.' },
    { id: 'hotice_reset', name: '손난로 되돌리기', kind: 'physical', eq: 'NaCH₃COO·3H₂O(s) → 과포화 용액 (가열 후 식힘)', a: 'S:NaCH3COO', b: 'supersat', minT: 80, prob: 0.2, toA: 'supersat', note: '끓는 물에 데워 결정을 다시 녹이면 식어도 굳지 않는 과포화 용액으로 돌아갑니다.' },
    ...['A:sugar', 'A:glucose'].map((b) => ({ id: 'ferment', name: '알코올 발효', reactants: ['C6H12O6'], products: ['C2H5OH', 'CO2'], a: 'yeast', b, minT: 15, maxT: 45, prob: 0.01, toB: [['C2H5OH', 0.5], ['CO2', 0.5]], note: '효모가 산소 없이 당을 분해해 에탄올과 이산화탄소를 만듭니다. 빵이 부풀고 술이 만들어지는 원리입니다. 너무 차갑거나 뜨거우면 일어나지 않습니다.' })),
    { id: 'yeast_h2o2', name: '효모와 과산화수소', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'yeast', prob: 0.4, toA: [['water', 0.6], ['oxygen', 0.4]], note: '효모 속 카탈레이스가 과산화수소를 분해합니다. 학교의 코끼리 치약 실험에 흔히 씁니다.' },
    { id: 'cement_set', name: '시멘트 굳기', kind: 'chemical', eq: '2Ca₃SiO₅ + 6H₂O → 3CaO·2SiO₂·3H₂O + 3Ca(OH)₂ + 열', a: 'cement', b: 'water', prob: 0.02, toA: 'concrete', toB: [['concrete', 0.5], ['water', 0.5]], dT: 15, note: '시멘트는 마르는 것이 아니라 물과 화학 반응해 굳습니다. 그래서 물속에서도 굳습니다.' },
    { id: 'concrete_acid', name: '산성비와 콘크리트', kind: 'chemical', eq: 'Ca(OH)₂·CaCO₃ + 2H⁺ → Ca²⁺ + …', a: 'concrete', b: 'H2SO4aq', prob: 0.002, toA: 'S:CaSO4', note: '콘크리트 속 염기 성분이 산과 반응해 표면이 조금씩 깎입니다.' },
    { id: 'plaster_set', name: '석고 굳기', reactants: ['CaSO4', 'H2O'], products: ['CaSO4'], eq: '2CaSO₄·½H₂O + 3H₂O → 2CaSO₄·2H₂O + 열', a: 'plaster', b: 'water', prob: 0.05, toA: 'gypsum', toB: [['gypsum', 0.5], ['water', 0.5]], dT: 10, note: '소석고가 물을 다시 결정 속에 받아들이며 굳고 따뜻해집니다(깁스).' },
    { id: 'gypsum_heat', name: '석고 가열', kind: 'chemical', eq: '2CaSO₄·2H₂O → 2CaSO₄·½H₂O + 3H₂O', a: 'gypsum', b: 'air', minT: 150, prob: 0.03, toA: 'plaster', toB: 'steam', note: '가열하면 결정 속 물이 빠져 소석고 가루가 됩니다.' },
    { id: 'clay_wet', name: '점토가 물을 머금음', kind: 'physical', eq: '점토 + 물 → 진흙', a: 'clay', b: 'water', prob: 0.05, toA: 'mud', toB: [['mud', 0.4], ['air', 0.6]], note: '점토 알갱이 사이에 물이 들어가 빚을 수 있게 됩니다.' },
    { id: 'tarnish_clean', name: '검게 변한 은 되돌리기', eq: '3Ag₂S + 2Al + 6H₂O → 6Ag + 2Al(OH)₃ + 3H₂S', a: 'S:Ag2S', b: 'Al:s', near: ['A:NaHCO3', 'A:Na2CO3', 'brine'], minT: 50, prob: 0.05, toA: 'Ag:s', note: '뜨거운 베이킹소다 물 속에서 알루미늄 포일에 닿은 황화은이 다시 은이 됩니다. 은 수저를 닦는 방법입니다.' },
    { id: 'naclo_nh3', name: '표백제와 암모니아', reactants: ['NaClO', 'NH3'], products: ['NaOH', 'NH2Cl'], a: 'A:NaClO', b: 'NH4OH:aq', prob: 0.2, toA: 'naoh', toB: 'NH2Cl', note: '유독한 클로라민 기체가 나옵니다. 락스와 암모니아가 든 세제(유리 세정제 등)를 절대 섞지 마세요.' },
    { id: 'naclo_nh3', name: '표백제와 암모니아', reactants: ['NaClO', 'NH3'], products: ['NaOH', 'NH2Cl'], a: 'A:NaClO', b: 'NH3', prob: 0.3, toA: 'naoh', toB: 'NH2Cl', note: '유독한 클로라민 기체가 나옵니다. 락스와 암모니아가 든 세제(유리 세정제 등)를 절대 섞지 마세요.' },
    { id: 'waterglass_make', name: '물유리 만들기', reactants: ['SiO2', 'NaOH'], products: ['Na2SiO3', 'H2O'], a: 'sand', b: 'naoh', minT: 90, prob: 0.01, toA: 'A:Na2SiO3', toB: 'A:Na2SiO3', note: '뜨거운 진한 염기는 모래(이산화규소)도 천천히 녹입니다.' },
    // 실험 시연
    ...['fire', 'air'].map((b) => ({ id: 'volcano', name: '다이크로뮴산암모늄 화산', reactants: ['(NH4)2Cr2O7'], products: ['Cr2O3', 'N2', 'H2O'], a: 'S:(NH4)2Cr2O7', b, minT: b === 'air' ? 225 : undefined, prob: 0.3, toA: 'S:Cr2O3', toB: [['fire:clean', 0.6], ['nitrogen', 0.4]], T: 900, note: '스스로 분해하며 불꽃을 튀기고, 부피가 큰 초록색 산화크로뮴이 화산재처럼 쌓입니다. 독성이 있어 지금은 학교에서 하지 않습니다.' })),
    { id: 'sugar_snake', name: '설탕 뱀', eq: 'C₁₂H₂₂O₁₁ → 12C + 11H₂O, 2NaHCO₃ → Na₂CO₃ + CO₂↑ + H₂O', a: 'sugar', b: 'S:NaHCO3', minT: 250, prob: 0.1, toA: 'snake', toB: [['snake', 0.6], ['CO2', 0.4]], note: '설탕이 타서 생긴 탄소가 베이킹소다에서 나온 이산화탄소에 부풀어 검은 뱀처럼 솟아오릅니다.' },
    ...['A:FeCl3', 'A:CuSO4', 'liver', 'rust'].map((c) => ({ id: 'luminol', name: '루미놀 발광', kind: 'chemical', eq: '루미놀 + H₂O₂ (촉매) → 3-아미노프탈산 + N₂ + 빛', a: 'luminol', b: 'H2O2', near: [c], prob: 0.4, toA: 'luminol:glow', toB: 'water', note: '철 같은 촉매가 있으면 과산화수소가 루미놀을 산화시키고, 그 에너지가 파란빛으로 나옵니다. 혈액 속 철로 혈흔을 찾습니다.' })),
    // 부식: 금속끼리 닿으면 더 활발한 쪽이 대신 녹슨다(희생 양극, 아연 도금).
    { id: 'galvanic_cu', name: '구리와 닿은 철의 부식', reactants: ['Fe', 'O2', 'H2O'], products: ['Fe(OH)3'], a: 'iron', b: 'water', near: ['Cu:s'], prob: 0.005, toA: 'rust', note: '철이 구리와 닿아 있으면 전지가 만들어져 철이 더 빨리 녹슬니다(갈바니 부식).' },
    { id: 'zn_corrode', name: '아연의 부식(희생 양극)', reactants: ['Zn', 'O2'], products: ['ZnO'], a: 'Zn:s', b: 'water', near: OX, prob: 0.001, toA: 'S:ZnO', note: '아연은 철보다 먼저 산화되어 철을 지켜 줍니다. 함석(아연 도금 강판)과 배 바닥의 아연 덩어리가 이 원리입니다.' },
    { id: 'softening', name: '센물 연화', reactants: ['Ca(HCO3)2', 'Na2CO3'], products: ['CaCO3', 'NaHCO3'], a: 'A:Ca(HCO3)2', b: 'A:Na2CO3', prob: 0.3, toA: 'limestone', toB: 'A:NaHCO3', note: '탄산나트륨을 넣으면 칼슘 이온이 탄산칼슘으로 가라앉아 단물이 됩니다.' },
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
