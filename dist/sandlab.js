// 원소 118종. 열 순서: 기호, 이름, 원자량, 분류, 밀도(g/cm³, 응축상), 녹는점 °C, 끓는점 °C, 열전도율 W/(m·K)
// 분류: alkali 알칼리 / alkaline 알칼리 토금속 / tm 전이 금속 / post 전이후 금속 / metalloid 준금속
//       nonmetal 비금속 / halogen 할로젠 / noble 비활성 기체 / ln 란타넘족 / an 악티늄족
// 녹는점이 null이면 상압에서 승화한다(끓는점 값이 승화점). 100번 이후는 거의 측정되지 않은 이론 예측값이다.
(function (SL) {
  'use strict';

  const ROWS = `
H|수소|1.008|nonmetal|0.086|-259.16|-252.87|0.18
He|헬륨|4.0026|noble|0.145|-272.2|-268.93|0.15
Li|리튬|6.94|alkali|0.534|180.5|1342|85
Be|베릴륨|9.012|alkaline|1.85|1287|2470|200
B|붕소|10.81|metalloid|2.34|2076|3927|27
C|탄소|12.011|nonmetal|2.27|null|3642|120
N|질소|14.007|nonmetal|1.03|-210|-195.8|0.026
O|산소|15.999|nonmetal|1.43|-218.8|-183|0.026
F|플루오린|18.998|halogen|1.7|-219.7|-188.1|0.028
Ne|네온|20.18|noble|1.44|-248.6|-246.1|0.05
Na|나트륨|22.99|alkali|0.971|97.8|883|140
Mg|마그네슘|24.305|alkaline|1.738|650|1090|156
Al|알루미늄|26.98|post|2.7|660.3|2470|237
Si|규소|28.085|metalloid|2.33|1414|3265|149
P|인|30.974|nonmetal|1.82|44.1|280|0.24
S|황|32.06|nonmetal|2.07|115.2|444.6|0.2
Cl|염소|35.45|halogen|2.03|-101.5|-34|0.009
Ar|아르곤|39.95|noble|1.62|-189.3|-185.8|0.018
K|칼륨|39.098|alkali|0.862|63.5|759|102
Ca|칼슘|40.078|alkaline|1.55|842|1484|200
Sc|스칸듐|44.956|tm|2.99|1541|2836|16
Ti|타이타늄|47.867|tm|4.51|1668|3287|22
V|바나듐|50.942|tm|6.11|1910|3407|31
Cr|크로뮴|51.996|tm|7.19|1907|2671|94
Mn|망가니즈|54.938|tm|7.21|1246|2061|8
Fe|철|55.845|tm|7.87|1538|2862|80
Co|코발트|58.933|tm|8.9|1495|2927|100
Ni|니켈|58.693|tm|8.91|1455|2913|91
Cu|구리|63.546|tm|8.96|1085|2562|401
Zn|아연|65.38|tm|7.14|419.5|907|116
Ga|갈륨|69.723|post|5.91|29.8|2204|41
Ge|저마늄|72.63|metalloid|5.32|938|2833|60
As|비소|74.922|metalloid|5.73|null|614|50
Se|셀레늄|78.971|nonmetal|4.81|221|685|0.5
Br|브로민|79.904|halogen|3.12|-7.2|58.8|0.12
Kr|크립톤|83.798|noble|2.82|-157.4|-153.4|0.009
Rb|루비듐|85.468|alkali|1.53|39.3|688|58
Sr|스트론튬|87.62|alkaline|2.64|777|1382|35
Y|이트륨|88.906|tm|4.47|1526|3336|17
Zr|지르코늄|91.224|tm|6.51|1855|4409|23
Nb|나이오븀|92.906|tm|8.57|2477|4744|54
Mo|몰리브데넘|95.95|tm|10.28|2623|4639|139
Tc|테크네튬|98|tm|11.5|2157|4265|51
Ru|루테늄|101.07|tm|12.37|2334|4150|117
Rh|로듐|102.91|tm|12.41|1964|3695|150
Pd|팔라듐|106.42|tm|12.02|1555|2963|72
Ag|은|107.87|tm|10.49|961.8|2162|429
Cd|카드뮴|112.41|tm|8.65|321.1|767|97
In|인듐|114.82|post|7.31|156.6|2072|82
Sn|주석|118.71|post|7.31|231.9|2602|67
Sb|안티모니|121.76|metalloid|6.69|630.6|1587|24
Te|텔루륨|127.6|metalloid|6.24|449.5|988|3
I|아이오딘|126.9|halogen|4.93|113.7|184.3|0.45
Xe|제논|131.29|noble|3|-111.8|-108.1|0.006
Cs|세슘|132.91|alkali|1.87|28.4|671|36
Ba|바륨|137.33|alkaline|3.51|727|1870|18
La|란타넘|138.91|ln|6.16|920|3464|13
Ce|세륨|140.12|ln|6.77|795|3443|11
Pr|프라세오디뮴|140.91|ln|6.77|935|3520|13
Nd|네오디뮴|144.24|ln|7.01|1024|3074|17
Pm|프로메튬|145|ln|7.26|1042|3000|15
Sm|사마륨|150.36|ln|7.52|1072|1794|13
Eu|유로퓸|151.96|ln|5.24|826|1529|14
Gd|가돌리늄|157.25|ln|7.9|1312|3273|11
Tb|터븀|158.93|ln|8.23|1356|3230|11
Dy|디스프로슘|162.5|ln|8.55|1407|2567|11
Ho|홀뮴|164.93|ln|8.8|1461|2720|16
Er|어븀|167.26|ln|9.07|1529|2868|15
Tm|툴륨|168.93|ln|9.32|1545|1950|17
Yb|이터븀|173.05|ln|6.97|824|1196|39
Lu|루테튬|174.97|ln|9.84|1652|3402|16
Hf|하프늄|178.49|tm|13.31|2233|4603|23
Ta|탄탈럼|180.95|tm|16.69|3017|5458|57
W|텅스텐|183.84|tm|19.25|3422|5555|173
Re|레늄|186.21|tm|21.02|3186|5596|48
Os|오스뮴|190.23|tm|22.59|3033|5012|88
Ir|이리듐|192.22|tm|22.56|2446|4428|147
Pt|백금|195.08|tm|21.45|1768|3825|72
Au|금|196.97|tm|19.3|1064|2856|318
Hg|수은|200.59|tm|13.53|-38.83|356.7|8
Tl|탈륨|204.38|post|11.85|304|1473|46
Pb|납|207.2|post|11.34|327.5|1749|35
Bi|비스무트|208.98|post|9.78|271.4|1564|8
Po|폴로늄|209|post|9.2|254|962|20
At|아스타틴|210|halogen|6.4|302|337|1.7
Rn|라돈|222|noble|4.4|-71|-61.7|0.004
Fr|프랑슘|223|alkali|1.87|27|677|15
Ra|라듐|226|alkaline|5.5|700|1737|19
Ac|악티늄|227|an|10|1050|3200|12
Th|토륨|232.04|an|11.72|1750|4788|54
Pa|프로트악티늄|231.04|an|15.37|1572|4000|47
U|우라늄|238.03|an|19.05|1132|4131|27
Np|넵투늄|237|an|20.45|644|3902|6
Pu|플루토늄|244|an|19.82|640|3228|7
Am|아메리슘|243|an|13.69|1176|2607|10
Cm|퀴륨|247|an|13.51|1340|3110|10
Bk|버클륨|247|an|14.78|986|2627|10
Cf|캘리포늄|251|an|15.1|900|1470|10
Es|아인슈타이늄|252|an|8.84|860|996|10
Fm|페르뮴|257|an|9.7|1527|2000|10
Md|멘델레븀|258|an|10.3|827|1800|10
No|노벨륨|259|an|9.9|827|1500|10
Lr|로렌슘|266|an|15.6|1627|3000|10
Rf|러더포듐|267|tm|23.2|2100|5500|23
Db|더브늄|268|tm|29.3|2500|5500|50
Sg|시보귬|269|tm|35|2800|5500|50
Bh|보륨|270|tm|37.1|2800|5500|50
Hs|하슘|277|tm|41|2800|5500|50
Mt|마이트너륨|278|tm|37.4|2500|5000|50
Ds|다름슈타튬|281|tm|34.8|2000|4500|50
Rg|뢴트게늄|282|tm|28.7|1500|3500|50
Cn|코페르니슘|285|tm|14|10|67|5
Nh|니호늄|286|post|16|430|1130|10
Fl|플레로븀|289|post|14|70|150|10
Mc|모스코븀|290|post|13.5|400|1100|10
Lv|리버모륨|293|post|12.9|435|800|10
Ts|테네신|294|halogen|7.2|500|610|1
Og|오가네손|294|noble|7|50|80|1`;

  SL.ELEMENTS = ROWS.trim().split('\n').map((line, i) => {
    const p = line.split('|');
    return {
      z: i + 1, sym: p[0], name: p[1], M: +p[2], cat: p[3], rho: +p[4],
      mp: p[5] === 'null' ? null : +p[5], bp: +p[6], k: +p[7],
      radioactive: i + 1 === 43 || i + 1 === 61 || i + 1 >= 84,
      predicted: i + 1 >= 100,
    };
  });

  // 주기율표 칸 위치 [행, 열]. 란타넘족과 악티늄족은 아래쪽 8, 9행에 둔다.
  SL.elementCell = function (z) {
    const starts = [[1, 1, 1], [2, 1, 18], [3, 2, 1], [5, 2, 13], [11, 3, 1], [13, 3, 13], [19, 4, 1], [37, 5, 1], [55, 6, 1]];
    if (z >= 57 && z <= 71) return [8, z - 57 + 3];
    if (z >= 72 && z <= 86) return [6, z - 72 + 4];
    if (z === 87) return [7, 1];
    if (z === 88) return [7, 2];
    if (z >= 89 && z <= 103) return [9, z - 89 + 3];
    if (z >= 104) return [7, z - 104 + 4];
    let cell = null;
    for (const [from, row, col] of starts) if (z >= from) cell = [row, col + z - from];
    return cell;
  };
})(globalThis.SandLab = globalThis.SandLab || {});

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

// 시뮬레이션 엔진. DOM을 전혀 쓰지 않으므로 어떤 화면에도 붙일 수 있고 단독 테스트가 가능하다.
// 한 칸 = 1cm, 한 틱 = 1/60초. 강체 공은 미터 단위(SI)로 계산한다.
(function (SL) {
  'use strict';

  const SOLID = 0, POWDER = 1, LIQUID = 2, GAS = 3;
  const STATES = { solid: SOLID, powder: POWDER, liquid: LIQUID, gas: GAS };
  const EARTH_G = 9.81;
  const MAX_FALL = 8; // 칸/틱. 터널링 방지용 상한

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
      add(a, b, { r, toSelf: toA, toOther: toB, near });
      add(b, a, { r, toSelf: toB, toOther: toA, near });
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
      this.reset();
    }

    reset() {
      this.tick = 0; this.time = 0;
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
      this.stepMotion();
      this.stepHeat();
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
        if (Math.random() > r.prob) continue;
        if (e.near && !this.hasNear(i, e.near) && !this.hasNear(j, e.near)) continue;
        const dT = r.dT || 0;
        const apply = (cell, to) => {
          let t = T[cell] + dT;
          if (r.T != null) t = Math.max(t, r.T);
          if (to == null) { if (!this.data.fixed[this.mat[cell]]) T[cell] = t; return; }
          this.setCell(cell, pick(to), t);
        };
        apply(i, e.toSelf);
        apply(j, e.toOther);
        if (!r.silent) this.note(r.id, () => ({ type: 'reaction', id: r.id, name: r.name, eq: SL.CHEM ? SL.CHEM.equation(r) : r.eq, kind: r.kind || 'chemical', note: r.note }));
        return;
      }
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

// 미리 꾸며 둔 실험. setup(world)만 구현하면 목록에 자동으로 추가된다.
(function (SL) {
  'use strict';

  // 바닥과 양쪽 벽이 있는 수조를 만든다. 안쪽 범위를 돌려준다.
  const tank = (w, mat, x0, x1, top, bottom) => {
    w.rect(mat, x0, bottom, x1, bottom + 3);
    w.rect(mat, x0, top, x0 + 2, bottom);
    w.rect(mat, x1 - 2, top, x1, bottom);
    return { l: x0 + 3, r: x1 - 3, b: bottom - 1 };
  };
  const air = (w) => { w.g = 9.81; w.vacuum = false; w.setHeatBoost(200); };
  // 비커 여러 개를 나란히 놓는다.
  const beakers = (w, list) => {
    w.rect('stone', 0, 146, 239, 149);
    const width = Math.floor(236 / list.length);
    list.forEach((fn, i) => {
      const x0 = 2 + i * width, x1 = x0 + width - 6;
      fn(tank(w, 'glass', x0, x1, 60, 142));
    });
  };

  SL.SCENES = [
    {
      id: 'free', name: '빈 실험실', tab: 'materials',
      desc: '아무것도 없는 공간입니다. 재료를 골라 직접 실험해 보세요.',
      setup(w) { air(w); w.rect('stone', 0, 146, 239, 149); },
    },
    {
      id: 'alkali', name: '알칼리 금속과 물', tab: 'codex',
      desc: '왼쪽부터 리튬, 나트륨, 칼륨입니다. 주기율표 아래로 갈수록 물과 더 격렬하게 반응합니다.',
      setup(w) {
        air(w);
        beakers(w, ['Li', 'Na', 'K'].map((el) => (t) => {
          w.rect('water', t.l, 105, t.r, t.b);
          w.rect(el, t.l + 25, 40, t.r - 25, 46);
        }));
      },
    },
    {
      id: 'series', name: '금속과 염산', tab: 'codex',
      desc: '왼쪽부터 마그네슘, 아연, 철, 구리입니다. 반응성 계열에 따라 수소 거품의 양이 다르고, 구리는 녹지 않습니다.',
      setup(w) {
        air(w);
        beakers(w, ['Mg', 'Zn', 'Fe', 'Cu'].map((el) => (t) => {
          w.rect('hcl', t.l, 105, t.r, t.b);
          w.rect(el, t.l + 12, 128, t.r - 12, t.b);
        }));
      },
    },
    {
      id: 'displace', name: '은 나무 만들기', tab: 'codex',
      desc: '구리를 질산은 용액에 넣으면 구리가 녹아 파랗게 변하고 은이 석출됩니다. 왼쪽은 황산구리 용액에 넣은 철입니다.',
      setup(w) {
        air(w);
        beakers(w, [
          (t) => { w.rect('A:CuSO4', t.l, 90, t.r, t.b); w.rect('Fe', t.l + 40, 70, t.l + 55, t.b, 20, true); },
          (t) => { w.rect('A:AgNO3', t.l, 90, t.r, t.b); w.rect('Cu', t.l + 40, 70, t.l + 55, t.b, 20, true); },
        ]);
      },
    },
    {
      id: 'precip', name: '앙금 생성', tab: 'codex',
      desc: '맑은 용액 두 가지를 섞으면 색 있는 앙금이 생깁니다. 왼쪽부터 아이오딘화 납(노랑), 수산화 구리(파랑), 염화 은(흰색), 수산화 철(갈색)입니다.',
      setup(w) {
        air(w);
        const pairs = [['A:Pb(NO3)2', 'A:KI'], ['A:CuSO4', 'naoh'], ['A:AgNO3', 'brine'], ['A:FeCl3', 'naoh']];
        beakers(w, pairs.map(([a, b]) => (t) => {
          w.rect(a, t.l, 115, t.r, t.b);
          w.rect(b, t.l + 8, 70, t.r - 8, 85);
        }));
      },
    },
    {
      id: 'flame', name: '불꽃 반응', tab: 'codex',
      desc: '금속 이온마다 불꽃색이 다릅니다. 왼쪽부터 리튬(빨강), 나트륨(노랑), 칼륨(연보라), 칼슘(주황), 구리(청록), 바륨(연두)입니다.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149);
        ['S:LiCl', 'S:NaCl', 'S:KCl', 'S:CaCl2', 'S:CuCl2', 'S:BaCl2'].forEach((id, i) => {
          const x = 8 + i * 39;
          w.rect('heater', x, 142, x + 30, 145);
          w.rect('C2H5OH', x + 2, 135, x + 28, 141);
          w.rect(id, x + 6, 110, x + 24, 116);
          w.rect('fire', x + 2, 130, x + 28, 134);
        });
      },
    },
    {
      id: 'neutral', name: '중화와 지시약', tab: 'codex',
      desc: '페놀프탈레인을 넣은 염기 용액에 염산을 부으면 분홍색이 사라집니다. 오른쪽은 리트머스 용액의 색 변화입니다.',
      setup(w) {
        air(w);
        beakers(w, [
          (t) => { w.rect('naoh', t.l, 120, t.r, t.b); w.rect('phth', t.l, 112, t.r, 119); w.rect('hcl', t.l + 30, 70, t.r - 30, 80); },
          (t) => { w.rect('litmus', t.l, 115, t.r, t.b); w.rect('hcl', t.l + 5, 70, t.l + 40, 80); w.rect('naoh', t.r - 40, 70, t.r - 5, 80); },
        ]);
      },
    },
    {
      id: 'limestone', name: '석회암과 염산', tab: 'codex',
      desc: '염산이 석회암을 녹이며 이산화탄소 거품이 올라옵니다. 이산화탄소는 공기보다 무거워 바닥에 고이는 경향이 있습니다.',
      setup(w) {
        air(w);
        const t = tank(w, 'glass', 50, 190, 40, 140);
        w.rect('limestone', 85, 115, 155, t.b, 20, true);
        w.rect('hcl', 90, 45, 150, 75);
      },
    },
    {
      id: 'furnace', name: '철 녹이기와 굳히기', tab: 'codex',
      desc: '용광로판 위에 왼쪽부터 납(327°C), 알루미늄(660°C), 구리(1085°C), 철(1538°C)을 놓았습니다. 녹는점이 낮은 금속부터 녹습니다. 온도 보기로 함께 보세요.',
      setup(w) {
        air(w);
        // 내화벽돌을 거치므로 금속의 온도가 서서히 올라 녹는점 순서대로 녹는다.
        w.setHeatBoost(400);
        w.rect('wall', 0, 146, 239, 149);
        w.rect('furnace', 10, 140, 229, 145);
        w.rect('firebrick', 10, 138, 229, 139);
        ['Pb', 'Al', 'Cu', 'Fe'].forEach((el, i) => {
          const x = 18 + i * 54;
          w.rect('wall', x - 3, 100, x - 2, 137);
          w.rect('wall', x + 44, 100, x + 45, 137);
          w.rect(el, x + 8, 110, x + 34, 137, 20, true);
        });
      },
    },
    {
      id: 'thermite', name: '테르밋 반응', tab: 'codex',
      desc: '알루미늄 가루와 녹(산화철)의 혼합물입니다. 마그네슘이 타는 열로 불이 붙으면 쇳물이 흘러나옵니다.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149);
        const t = tank(w, 'stone', 80, 160, 90, 142);
        for (let y = 110; y <= t.b; y++) for (let x = t.l; x <= t.r; x++) w.rect((x + y) % 2 ? 'Al' : 'rust', x, y, x, y, y < 114 ? 1000 : 20);
        w.rect('Mg', 105, 104, 135, 109, 1000); // 불 붙은 마그네슘 띠로 점화한다.
      },
    },
    {
      id: 'smelt', name: '철 제련', tab: 'codex',
      desc: '철광석(산화철)과 숯을 가열하면 숯이 산소를 빼앗아 철이 나옵니다. 용광로의 원리입니다.',
      setup(w) {
        air(w);
        w.setHeatBoost(600);
        w.rect('wall', 0, 146, 239, 149);
        w.rect('furnace', 70, 138, 170, 145);
        const t = tank(w, 'wall', 78, 162, 90, 134);
        w.rect('firebrick', 78, 134, 162, 137);
        for (let y = 112; y <= t.b; y++) for (let x = t.l; x <= t.r; x++) w.rect((x + y) % 2 ? 'C' : 'rust', x, y, x, y);
      },
    },
    {
      id: 'decomp', name: '석회암 가열과 석회수', tab: 'codex',
      desc: '석회암을 825°C 넘게 가열하면 생석회와 이산화탄소로 나뉩니다. 이산화탄소가 오른쪽 석회수에 닿으면 뿌옇게 흐려집니다.',
      setup(w) {
        air(w);
        w.setHeatBoost(600);
        w.rect('wall', 0, 146, 239, 149);
        w.rect('furnace', 20, 138, 100, 145);
        w.rect('limestone', 30, 115, 90, 137);
        const t = tank(w, 'glass', 130, 220, 110, 142);
        w.rect('A:Ca(OH)2', t.l, 125, t.r, t.b);
        w.rect('co2', 133, 95, 217, 124, 20);
      },
    },
    {
      id: 'water', name: '물의 세 가지 상태', tab: 'physics', graph: 'T',
      desc: '온도계가 물 속에 꽂혀 있습니다. 온도가 오르다가 100°C 근처에서 멈추는 구간(잠열)을 그래프로 확인하세요. 수증기는 식어서 다시 물이 됩니다.',
      setup(w) {
        air(w);
        w.setHeatBoost(800); // 관찰하기 좋은 시간 안에 끓도록 가속한다.
        w.rect('stone', 0, 146, 239, 149);
        w.rect('heater', 70, 138, 170, 145);
        const t = tank(w, 'stone', 80, 160, 80, 134);
        w.rect('water', t.l, 95, t.r, t.b);
        w.setProbe(120, 120);
      },
    },
    {
      id: 'cold', name: '극저온의 세계', tab: 'materials',
      desc: '극저온판 위에서는 물이 얼고 수은도 굳습니다(-39°C). 액체 질소(-196°C)는 공기 속에서 바로 끓어오릅니다.',
      setup(w) {
        air(w);
        w.setHeatBoost(600);
        w.rect('stone', 0, 146, 239, 149);
        w.rect('cryoplate', 10, 138, 229, 145);
        w.rect('water', 30, 118, 80, 137);
        w.rect('Hg', 100, 118, 150, 137);
        w.rect('N:l', 170, 100, 215, 110);
      },
    },
    {
      id: 'sugar', name: '설탕과 진한 황산', tab: 'codex',
      desc: '진한 황산이 설탕에서 물을 빼앗아 검은 탄소가 생기고 수증기가 뿜어져 나옵니다.',
      setup(w) {
        air(w);
        const t = tank(w, 'glass', 70, 170, 50, 142);
        w.rect('sugar', t.l, 110, t.r, t.b);
        w.rect('H2SO4', 90, 80, 150, 95);
      },
    },
    {
      id: 'oxygen', name: '연소와 산소', tab: 'codex',
      desc: '왼쪽은 트여 있고 오른쪽은 유리로 막혀 있습니다. 산소가 다 떨어지면 막힌 쪽의 불은 나무가 남아도 꺼집니다.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149);
        tank(w, 'glass', 130, 225, 50, 142);
        w.rect('glass', 130, 88, 225, 90); // 안의 공기가 나무보다 적어 산소가 먼저 떨어진다.
        w.rect('wood', 18, 110, 107, 141);
        w.rect('wood', 133, 110, 222, 141);
        w.rect('fire', 45, 104, 80, 109);
        w.rect('fire', 160, 104, 195, 109);
      },
    },
    {
      id: 'volcano', name: '용암과 바다', tab: 'codex',
      desc: '용암이 물을 만나면 겉이 굳어 암석이 되고 수증기가 치솟습니다. 수증기는 식으면 다시 물이 됩니다.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 130, 239, 149);
        for (let i = 0; i < 40; i++) w.rect('stone', 20 + i, 130 - i, 100 - i, 130 - i);
        w.rect('stone', 100, 120, 239, 129);
        w.rect('water', 100, 95, 236, 119);
        w.rect('stone', 237, 90, 239, 129);
        w.rect('lava', 45, 72, 75, 90);
      },
    },
    {
      id: 'salt', name: '소금물 증발', tab: 'codex',
      desc: '소금을 물에 녹인 뒤 끓이면 물은 수증기가 되어 날아가고 소금만 남습니다.',
      setup(w) {
        air(w);
        w.setHeatBoost(800);
        w.rect('stone', 0, 146, 239, 149);
        w.rect('heater', 70, 138, 170, 145);
        const t = tank(w, 'stone', 80, 160, 105, 134);
        w.rect('water', t.l, 118, t.r, t.b);
        w.rect('salt', 100, 85, 140, 100);
      },
    },
    {
      id: 'density', name: '밀도 기둥', tab: 'materials',
      desc: '일부러 무거운 소금물을 위에, 기름을 아래에 넣었습니다. 밀도 순서대로 층이 나뉘는 과정을 보세요. 밀도 보기와 함께 쓰면 좋습니다.',
      setup(w) {
        air(w);
        const t = tank(w, 'glass', 80, 160, 30, 142);
        w.rect('oil', t.l, 112, t.r, t.b);
        w.rect('water', t.l, 82, t.r, 111);
        w.rect('brine', t.l, 52, t.r, 81);
      },
    },
    {
      id: 'galileo', name: '갈릴레이 낙하', tab: 'physics',
      desc: '철 공과 스티로폼 공을 같은 높이에서 떨어뜨립니다. 공기가 있으면 차이가 나고, "공기 저항 없음(진공)"을 켜면 동시에 떨어집니다.',
      speed: 0.25,
      setup(w) {
        air(w);
        const b = w.addBody({ type: 'iron', x: 0.8, y: 0.08, r: 0.05 });
        w.addBody({ type: 'foam', x: 1.6, y: 0.08, r: 0.05 });
        w.select(b);
      },
    },
    {
      id: 'buoyancy', name: '아르키메데스 부력', tab: 'physics',
      desc: '밀도가 물보다 작은 공은 뜨고, 큰 공은 가라앉습니다.',
      setup(w) {
        air(w);
        const t = tank(w, 'glass', 20, 220, 50, 142);
        w.rect('water', t.l, 70, t.r, t.b);
        const b = w.addBody({ type: 'wood', x: 0.6, y: 0.2, r: 0.07 });
        w.addBody({ type: 'iron', x: 1.0, y: 0.2, r: 0.07 });
        w.addBody({ type: 'rubber', x: 1.4, y: 0.2, r: 0.07 });
        w.addBody({ type: 'foam', x: 1.8, y: 0.2, r: 0.07 });
        w.select(b);
      },
    },
  ];
})(globalThis.SandLab = globalThis.SandLab || {});

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
          const flame = defs[m].flame;
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
