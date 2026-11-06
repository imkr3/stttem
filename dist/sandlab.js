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
  // 원소의 실제 색(금속은 은회색 계열에서 조금씩 다르게).
  const ELEMENT_COLORS = {
    H: '#d9c9f5', He: '#f4e3b0', Li: '#c8ccd0', Be: '#a6abb0', B: '#3c3530', C: '#26262a', N: '#9fb4d8', O: '#9fd3ff', F: '#d6e38a', Ne: '#ff8a70', Na: '#d8dcd6', Mg: '#c4c9ce', Al: '#d2d7dc', Si: '#5a6472', P: '#f0e8c8', S: '#e8d22c',
    Cl: '#a8cc4e', Ar: '#c79be0', K: '#cfd3c8', Ca: '#e2e0d8', Ti: '#8a9098', Cr: '#c4ced8', Mn: '#a8a49e', Fe: '#8a9098', Co: '#8c96a6', Ni: '#c2baa6', Cu: '#c9784a', Zn: '#a8b6c2', Ga: '#c8ccd2',
    Br: '#8a2a10', Rb: '#ccc8c0', Sr: '#e0dac6', Pd: '#c6c6c2', Ag: '#e6e9ec', Cd: '#b4bcc4', Sn: '#d0d4d8', Sb: '#a2a6ae', I: '#3e2e58', Cs: '#dcc888', Ba: '#cac8ba', La: '#c8c8c0', Ce: '#c6c2b2', Gd: '#c0c0bc',
    W: '#8a8e94', Pt: '#d8d8d4', Au: '#ebc040', Hg: '#cdd2d8', Pb: '#767c88', Bi: '#d0b4c4', Po: '#b0b4b8', Ra: '#e8ecd8', U: '#7a7c74', Pu: '#7c7468', Cf: '#a0a4a0',
  };

  const CAT_COLOR = { alkali: '#c8ccc4', alkaline: '#cfcdc2', tm: '#a2a8ae', post: '#a8aeb4', metalloid: '#7c8288', nonmetal: '#b0b0a0', halogen: '#a0b070', noble: '#b0c4d8', ln: '#b4b8ae', an: '#8c9088' };
  const MOLECULE = { H: 'H2', N: 'N2', O: 'O2', F: 'F2', Cl: 'Cl2', Br: 'Br2', I: 'I2' };
  const GAS_COLOR = { H: '#2a2c3a', He: '#2c2a24', N: '#1b2230', O: '#1e3040', F: '#555a2c', Ne: '#3a241f', Cl: '#6c8530', Ar: '#2a2233', Br: '#8a3a18', I: '#6a3f96', Kr: '#1f2c33', Xe: '#242a44', Rn: '#33242a', Hg: '#2c3036', Na: '#6c6a24', S: '#a07a20' };
  const METAL_CATS = new Set(['alkali', 'alkaline', 'tm', 'post', 'ln', 'an']);
  const METALLIC_METALLOIDS = new Set(['Ge', 'Sb']); // 준금속이지만 금속처럼 가열하면 산화물이 된다.

  // 반응이 사실상 없거나(희귀 귀금속·비활성), 측정값이 거의 없는(초중원소) 원소는 물질로 만들지 않는다.
  // 주기율표에는 회색으로 남겨 두어 위치는 볼 수 있게 한다.
  SL.ELEMENT_SKIP = new Set(('Sc V Ge As Se Kr Y Zr Nb Mo Tc Ru Rh In Te Xe Pr Nd Pm Sm Eu Tb Dy Ho Er Tm Yb Lu Hf Ta Re Os Ir Tl At Rn Fr Ac Th Pa Np Am Cm Bk ' +
    'Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split(' '));
  for (const e of SL.ELEMENTS) {
    if (SL.ELEMENT_SKIP.has(e.sym)) continue;
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
    ['H2SO4', '진한 황산', 'H2SO4', 98.08, 1.84, 10.3, 337, 'acid', '#c4c8bc', { k: 0.3, c: 1400, flow: 2, misc: true, tags: { acid: { a: 'SO4', conc: true }, pH: 0 }, desc: '물과 만나면 많은 열을 내고, 설탕에서 물을 빼앗습니다.' }],
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
    ['N2O4', '사산화이질소', 'N2O4', 92.01, 1.44, -11.2, 21.1, 'gas', '#e0e0d0', { gasColor: '#1c2026', k: 0.1, c: 790, gasOnly: true, desc: '이산화질소 두 분자가 붙은 무색 기체. 따뜻하면 다시 갈색 이산화질소로 갈라집니다.' }],
    ['CH3Cl', '클로로메테인', 'CH3Cl', 50.49, 0.99, -97.4, -24.2, 'organic', '#c8d0c0', { gasColor: '#262c26', k: 0.1, c: 810, desc: '메테인과 염소가 빛을 받아 생기는 기체. 냉매로 쓰였습니다.' }],
    ['O3', '오존', 'O3', 48.0, 1.35, -192.2, -112, 'gas', '#4a6ad0', { gasColor: '#2a3a6a', k: 0.1, c: 820, gasOnly: true, desc: '산소 원자 셋으로 된 엷은 파란 기체. 강한 산화제로 살균·표백을 하고, 시간이 지나면 산소로 돌아갑니다. 성층권에서 자외선을 막아 줍니다.' }],
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
  const RE = ['O', 'OH', 'Cl', 'NO3', 'SO4', 'CO3', 'F', 'C2O4']; // 란타넘족: 산에 잘 녹는다. 탄산염·플루오린화물·옥살산염은 앙금
  const BE_GA = ['O', 'OH', 'Cl', 'NO3', 'SO4', 'CH3COO'];
  const CATIONS = [
    ['Li', '리튬', 1, 'Li'], ['Na', '나트륨', 1, 'Na'], ['K', '칼륨', 1, 'K'], ['Rb', '루비듐', 1, 'Rb'], ['Cs', '세슘', 1, 'Cs'], ['NH4', '암모늄', 1, null],
    ['Be', '베릴륨', 2, 'Be', BE_GA], ['Mg', '마그네슘', 2, 'Mg'], ['Ca', '칼슘', 2, 'Ca'], ['Sr', '스트론튬', 2, 'Sr'], ['Ba', '바륨', 2, 'Ba'],
    ['Al', '알루미늄', 3, 'Al'], ['Cr3', '크로뮴(III)', 3, 'Cr'], ['Mn2', '망가니즈(II)', 2, 'Mn'], ['Fe2', '철(II)', 2, 'Fe'], ['Fe3', '철(III)', 3, 'Fe'], ['Co2', '코발트(II)', 2, 'Co'], ['Ni2', '니켈(II)', 2, 'Ni'],
    ['Cu2', '구리(II)', 2, 'Cu'], ['Zn', '아연', 2, 'Zn'], ['Ag', '은', 1, 'Ag'], ['Cd', '카드뮴', 2, 'Cd'], ['Sn2', '주석(II)', 2, 'Sn'], ['Pb2', '납(II)', 2, 'Pb'], ['Hg2', '수은(II)', 2, 'Hg'],
    ['Au3', '금(III)', 3, 'Au', OXCL], ['Pd2', '팔라듐(II)', 2, 'Pd', ['O', 'Cl', 'NO3']], ['Mn4', '망가니즈(IV)', 4, 'Mn', ['O']], ['Ti4', '타이타늄(IV)', 4, 'Ti', ['O', 'Cl', 'F']],
    ['W6', '텅스텐(VI)', 6, 'W', ['O']],
    ['Sb3', '안티모니(III)', 3, 'Sb', ['O', 'Cl']], ['Bi3', '비스무트(III)', 3, 'Bi', ['O', 'NO3']], ['Ga3', '갈륨(III)', 3, 'Ga', BE_GA],
    ['U6', '우라늄(VI)', 6, 'U', ['O']], ['Pu4', '플루토늄(IV)', 4, 'Pu', ['O']],
  ];
  'La 란타넘,Ce 세륨,Gd 가돌리늄'.split(',').forEach((s) => {
    const [el, name] = s.split(' ');
    CATIONS.push([el + '3', name, 3, el, RE]);
  });

  // [키, 전하, 이름 앞부분, 화학식, 다원자 여부]
  const ANIONS = [
    ['F', 1, '플루오린화', 'F', 0], ['Cl', 1, '염화', 'Cl', 0], ['Br', 1, '브로민화', 'Br', 0], ['I', 1, '아이오딘화', 'I', 0], ['OH', 1, '수산화', 'OH', 1], ['NO3', 1, '질산', 'NO3', 1],
    ['SO4', 2, '황산', 'SO4', 1], ['CO3', 2, '탄산', 'CO3', 1], ['HCO3', 1, '탄산수소', 'HCO3', 1], ['S', 2, '황화', 'S', 0], ['PO4', 3, '인산', 'PO4', 1], ['CH3COO', 1, '아세트산', 'CH3COO', 1],
    ['O', 2, '산화', 'O', 0], ['CrO4', 2, '크로뮴산', 'CrO4', 1], ['MnO4', 1, '과망가니즈산', 'MnO4', 1],
    ['SO3', 2, '아황산', 'SO3', 1], ['NO2', 1, '아질산', 'NO2', 1], ['ClO3', 1, '염소산', 'ClO3', 1], ['C2O4', 2, '옥살산', 'C2O4', 1], ['H', 1, '수소화', 'H', 0],
  ];
  const ALKALI = new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'NH4']);

  function exists(c, a, cat) {
    if (cat[4]) return cat[4].includes(a);
    if (a === 'HCO3') return ['Na', 'K', 'NH4'].includes(c);
    if (a === 'MnO4') return ['Na', 'K'].includes(c);
    if (a === 'ClO3') return ['Na', 'K'].includes(c); // 염소산염은 산소를 얻는 실험에 쓰는 나트륨·칼륨염만
    if (a === 'H') return ['Li', 'Na', 'K', 'Rb', 'Cs', 'Mg', 'Ca', 'Sr', 'Ba'].includes(c); // 금속 수소화물은 활발한 금속만
    if (a === 'NO2') return ['Na', 'K', 'NH4', 'Ca', 'Ba', 'Ag'].includes(c);
    if (a === 'SO3' && ['Al', 'Fe3', 'Cr3', 'Au3', 'Pd2', 'Ti4', 'W6', 'U6', 'Pu4', 'Sb3', 'Bi3', 'Ga3', 'Be'].includes(c)) return false;
    if (a === 'C2O4' && ['Au3', 'Pd2', 'Ti4', 'W6', 'U6', 'Pu4', 'Sb3', 'Bi3', 'Ga3', 'Be', 'Mn4'].includes(c)) return false;
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
    if (a === 'O' || a === 'H') return false; // 수소화물은 물과 반응해 녹지 않는다.
    if (a === 'NO2') return c !== 'Ag';
    if (a === 'ClO3') return true;
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
  Object.assign(DATA, {
    NaNO2: [2.17, 271, '#f2ecc4'], KNO2: [1.92, 441, '#f0eac0'], KClO3: [2.32, 356], NaClO3: [2.49, 248], Na2SO3: [2.63, null], K2SO3: [2.6, null], CaSO3: [2.5, null],
    CaC2O4: [2.2, null], Na2C2O4: [2.34, null], FeC2O4: [2.28, null, '#e8d040'], LiH: [0.78, 689, '#d8d8d4'], NaH: [1.39, null], KH: [1.43, null], CaH2: [1.7, 816], MgH2: [1.45, null],
  });
  DATA['Ca3(PO4)2'] = DATA.Ca3PO42;

  const COMMON = { NaCl: '소금', NaHCO3: '베이킹소다', Na2CO3: '탄산소다', CaCO3: '석회암', CaO: '생석회', 'Ca(OH)2': '소석회', Fe2O3: '녹', NaOH: '가성소다', NH4OH: '암모니아수', CaSO4: '석고', CuSO4: '황산구리', SiO2: '석영', TiO2: '티타니아' };
  // 수용액의 색은 양이온이 정한다. 없으면 맑은 물색.
  const AQ_COLOR = { Cu2: '#2a6fd0', Ni2: '#3fa86a', Fe2: '#7ab89a', Fe3: '#b48a2a', Cr3: '#3f7a6a', Mn2: '#c4a0b0', Co2: '#c05a80', Au3: '#c8a820' };
  const AN_AQ_COLOR = { MnO4: '#6a1a80', CrO4: '#d8c020' };

  // ---- 색 ----
  const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const rgbHex = (r) => '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mixHex = (a, b, t) => { const x = hexRgb(a), y = hexRgb(b); return rgbHex(x.map((v, i) => v + (y[i] - v) * t)); };
  const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); return (h >>> 0) / 4294967296; };
  // 같은 흰색·무색이라도 물질마다 아주 조금씩 다르게 해서 섞였을 때 구분되게 한다.
  const jitter = (hex, key, amt) => { const h = hash(key), rgb = hexRgb(hex); return rgbHex(rgb.map((v, i) => v + (hash(key + i) - 0.5) * amt * 2 + (h - 0.5) * amt)); };
  // 고체 염의 색: 양이온(전이 금속)과 음이온이 정한다. 측정한 색(DATA)이 있으면 그것을 쓴다.
  const SOLID_CATION_COLOR = { Cu2: '#5a9ee0', Ni2: '#5cb070', Co2: '#d0607e', Fe2: '#b6d4a4', Fe3: '#d4923a', Mn2: '#f0c8d2', Cr3: '#4e8060', Au3: '#d0a030', Pd2: '#8a5a3a', U6: '#e8d040', Ag: '#e6e4dc' };
  const SULFIDE_COLOR = { Zn: '#ece8d8', Cd: '#e8c020', Mn2: '#c08898', Sn2: '#4a3a22', Na: '#e8e0a8', K: '#e4dca0', Li: '#ece4b0', Ca: '#e8e4d0', Mg: '#e6e2d4', Ba: '#e4e0d0', Sr: '#e6e2d2', Rb: '#e4dca8', Cs: '#e0d8a0', NH4: '#e8e0a0' };
  const SPECIAL = { CrO4: '#e8c818', MnO4: '#3a1050', H: '#c8c8c0' };
  function solidColor(c, a, fx) {
    if (SPECIAL[a]) return SPECIAL[a];
    if (a === 'S') return SULFIDE_COLOR[c] || '#2a2826';
    if (a === 'O') return SOLID_CATION_COLOR[c] ? mixHex(SOLID_CATION_COLOR[c], '#202020', 0.6) : jitter('#ececea', fx, 6);
    if (a === 'I' && !SOLID_CATION_COLOR[c]) return jitter('#f0e8cc', fx, 6); // 아이오딘화물은 공기 중에서 누렇게 변하기 쉽다.
    if (SOLID_CATION_COLOR[c]) return jitter(SOLID_CATION_COLOR[c], fx, 10);
    return jitter('#ececea', fx, 7);
  }
  // 수용액: 색 있는 이온이 없으면 물과 거의 같은 색에 아주 엷은 차이만 준다.
  const aqColor = (c, a, fx) => AN_AQ_COLOR[a] || AQ_COLOR[c] || jitter('#3d8cd8', fx, 9);
  // 녹은 염: 고체 색에 빛나는 주황을 섞는다(뜨거우면 렌더러가 더 밝게 그린다).
  const meltColor = (solidHex) => mixHex(solidHex, '#ffb060', 0.45);
  const FLAME = { Li: 'Li', Na: 'Na', K: 'K', Rb: 'Rb', Cs: 'Cs', Ca: 'Ca', Sr: 'Sr', Ba: 'Ba', Cu2: 'Cu' };
  // 용해열: 양수는 데워지고 음수는 차가워진다(°C/칸).
  const DISSOLVE_HEAT = { NaOH: 40, KOH: 45, NH4NO3: -25, KNO3: -12, CaCl2: 25, NH4Cl: -12, K2CO3: 8, Na2CO3: 6, MgSO4: 8, NaCl: -1 };

  // 0.1 mol/L 정도 수용액의 대략적인 pH. 약산의 음이온은 염기성, 약염기의 양이온과 작은 고전하 금속 이온은 산성을 띤다(가수 분해).
  const ANION_PH = { OH: 13, CO3: 11.6, HCO3: 8.3, PO4: 12.1, S: 12.5, CH3COO: 8.9, F: 7.9, CrO4: 8.8, SO3: 9.8, NO2: 8.2, C2O4: 8.3 };
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
        id: solid, name: label, formula: pretty(fx), fx, state: 'powder', cat: 'salt', color: data[2] || solidColor(c, a, fx), density, c: 800, k: 2, salt: { c, a }, base: isBase && soluble(c, a), mp, est, cast: true,
        desc: baseDesc.trim(), up: mp != null ? { at: mp, to: 'M:' + fx, L: 3e5 } : null, dHsol: DISSOLVE_HEAT[fx] || 0,
      });
      if (mp != null) {
        add({
          id: 'M:' + fx, name: '녹은 ' + aname + cname, formula: pretty(fx) + '(l)', fx, state: 'liquid', color: meltColor(data[2] || solidColor(c, a, fx)), density: density * 0.9, c: 1000, k: 1, T0: mp + 15, flow: 2, salt: { c, a }, mp,
          desc: `녹는점 ${mp}°C. 식으면 다시 굳습니다.`, down: { at: mp, to: solid, L: 3e5, cast: true },
        });
      }
      if (soluble(c, a)) {
        const aqId = 'A:' + fx;
        entry.aq = aqId;
        const pH = phOf(c, a);
        const freeze = EUTECTIC[fx] != null ? EUTECTIC[fx] : -5;
        add({
          id: aqId, name: (fx === 'NaCl' ? '소금물' : `${aname}${cname} 용액`), formula: pretty(fx) + '(aq)', fx, state: 'liquid', cat: isBase ? 'base' : 'solution', color: aqColor(c, a, fx), density: 1000 + Math.min(300, density / 25), c: 3900, k: 0.6, flow: 5, aq: true, misc: true, salt: { c, a }, base: isBase, pH,
          desc: `pH 약 ${pH}. 끓이면 물이 날아가고 고체가 남습니다.` + (EUTECTIC[fx] != null ? ` 진하면 ${freeze}°C까지 얼지 않습니다.` : ''),
          up: { at: 102, to: [['H2O:g', 0.6], [solid, 0.4]], L: 2.257e6 }, down: { at: freeze, to: [['H2O:s', 0.7], [solid, 0.3]], L: 3.34e5 },
        });
      }
    }
  }

  // ---- 산 ----
  // [별칭, 이름, 화학식, 음이온, 색, 끓을 때 나오는 기체, 강도, pH(약 0.1 mol/L)]
  const ACIDS = [
    ['HCl', '염산', 'HCl', 'Cl', '#86c4cc', 'HClg', 0.9, 1], ['HBr', '브로민화수소산', 'HBr', 'Br', '#c8bc8c', 'HBrg', 0.9, 1], ['HI', '아이오딘화수소산', 'HI', 'I', '#c89a64', 'HIg', 0.9, 1],
    ['HF', '플루오린화수소산', 'HF', 'F', '#94ccc0', 'HFg', 0.4, 2.1], ['HNO3aq', '묽은 질산', 'HNO3', 'NO3', '#a4c6d6', 'NO2', 0.9, 1], ['H2SO4aq', '묽은 황산', 'H2SO4', 'SO4', '#8cb4d6', 'SO2', 0.9, 1],
    ['H3PO4', '인산', 'H3PO4', 'PO4', '#9cc0d0', null, 0.3, 1.6], ['CH3COOHaq', '식초(아세트산)', 'CH3COOH', 'CH3COO', '#c8c49a', 'CH3COOH', 0.15, 2.9], ['H2CO3', '탄산수', 'H2CO3', 'CO3', '#a8d0e0', 'CO2', 0.05, 4], ['H2SO3', '아황산', 'H2SO3', 'SO3', '#b8d0c4', 'SO2', 0.2, 1.8],
    ['H2C2O4', '옥살산 용액', 'H2C2O4', 'C2O4', '#c4d4cc', null, 0.4, 1.3],
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
    { id: 'plastic', name: '플라스틱 (폴리에틸렌)', formula: '(C₂H₄)ₙ', fx: 'C2H4', state: 'powder', cat: 'organic', color: '#e8eef2', density: 940, c: 1900, k: 0.4, fuel: { ign: 350, prob: 0.15, prods: ['CO2', 'H2O'], T: 1100 }, desc: '에틸렌이 길게 이어진 고분자. 물에 뜨고, 130°C쯤에서 녹으며, 타면 검은 연기를 냅니다. 산·염기에 잘 견딥니다.', up: { at: 130, to: 'plastic:l', L: 2e5 } },
    { id: 'plastic:l', name: '녹은 플라스틱', formula: '(C₂H₄)ₙ(l)', fx: 'C2H4', state: 'liquid', color: '#d8d0b8', density: 900, c: 2200, k: 0.3, flow: 1, T0: 160, fuel: { ign: 350, prob: 0.2, prods: ['CO2', 'H2O'], T: 1100 }, desc: '녹은 플라스틱. 식으면 굳습니다.', down: { at: 130, to: 'plastic', L: 2e5, cast: true } },
    { id: 'sawdust', name: '톱밥', formula: '(C₆H₁₀O₅)ₙ', fx: 'C6H10O5', state: 'powder', cat: 'organic', color: '#c49a5c', density: 250, c: 1700, k: 0.1, dust: true, fuel: { ign: 300, prob: 0.15, prods: ['CO2', 'H2O'], T: 900 }, desc: '나무 부스러기. 물보다 가벼워 뜨고(부력), 잘 타며 공기 중에 퍼지면 분진 폭발을 일으킵니다.' },
    { id: 'leaf', name: '식물 잎', formula: '엽록체', fx: 'C', state: 'solid', cat: 'organic', color: '#3a9a3a', density: 700, c: 3500, k: 0.4, fuel: { ign: 300, prob: 0.05, prods: ['CO2'], T: 800 }, desc: '빛을 받으면 이산화탄소와 물로 포도당을 만들고 산소를 내놓습니다(광합성). 어두우면 호흡해 산소를 쓰고 이산화탄소를 냅니다. 너무 뜨거우면 시듭니다.', up: { at: 70, to: 'leaf:dead', L: 5e4 } },
    { id: 'leaf:dead', name: '시든 잎', formula: '죽은 식물', fx: 'C', state: 'solid', color: '#8a7a3a', density: 600, c: 3000, k: 0.3, fuel: { ign: 280, prob: 0.08, prods: ['CO2'], T: 800 }, desc: '열로 죽은 잎. 광합성을 하지 않습니다.' },
    { id: 'A:Ni(NH3)6', name: '헥사암민니켈(II) 용액', formula: '[Ni(NH₃)₆]²⁺(aq)', fx: 'Ni(NH3)6(OH)2', state: 'liquid', color: '#6a5ad8', density: 1020, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 11, desc: '초록 니켈 이온에 암모니아가 결합한 푸른 보라색 착이온.' },
    { id: 'A:Zn(NH3)4', name: '테트라암민아연 용액', formula: '[Zn(NH₃)₄]²⁺(aq)', fx: 'Zn(NH3)4(OH)2', state: 'liquid', color: '#4a92d8', density: 1020, c: 3900, k: 0.6, flow: 5, aq: true, misc: true, pH: 11, desc: '흰 수산화아연이 암모니아수에 녹은 무색 용액.' },
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
    { id: 'wire', name: '도선', formula: '피복 구리선', fx: 'Cu', state: 'solid', cat: 'device', color: '#c06a30', density: 8900, c: 385, k: 50, inert: true, wire: true, grain: 3, desc: '겉을 감싼 구리선. 전기는 통하지만 용액과는 반응하지 않습니다. 금속·전극·전구를 이어 회로를 만듭니다.' },
    { id: 'bulb', name: '전구', formula: '꼬마전구', fx: 'W', state: 'solid', cat: 'device', color: '#5a5a48', density: 2500, c: 800, k: 2, inert: true, load: true, grain: 2, desc: '회로에 전류가 흐르면 켜집니다. 전원의 (+)·(−)극 사이나, 서로 다른 두 금속으로 만든 화학 전지 사이에 이어 보세요.' },
    { id: 'bulb:on', name: '켜진 전구', formula: '꼬마전구', fx: 'W', state: 'solid', color: '#fff2a0', density: 2500, c: 800, k: 2, inert: true, load: true, glow: [255, 240, 150], desc: '전류가 흘러 필라멘트가 빛납니다.' },
    { id: 'lamp', name: '전등', formula: '가시광선', fx: 'W', state: 'solid', cat: 'device', color: '#fff4c8', density: 2500, c: 800, k: 1, inert: true, glow: [255, 244, 200], desc: '빛을 비춥니다. 옆(1칸 거리)에 있는 식물 잎은 광합성을 합니다.' },
    { id: 'uvlamp', name: '자외선 램프', formula: '자외선', fx: 'Hg', state: 'solid', cat: 'device', color: '#a070ff', density: 2500, c: 800, k: 1, inert: true, glow: [170, 110, 255], desc: '자외선을 비춥니다. 옆의 물질에 빛으로 일어나는 반응(광분해, 광화학 반응)을 일으킵니다.' },
    { id: 'pump', name: '진공 펌프', formula: '기체를 빼냄', fx: 'Fe', state: 'solid', cat: 'device', color: '#5a6a7a', density: 7000, c: 500, k: 20, inert: true, pump: true, desc: '닫힌 용기 벽의 일부를 이것으로 바꾸면(안쪽 기체에 닿게) 기체를 조금씩 빼내 압력을 낮춥니다. 압력이 낮으면 물이 상온에서 끓고, 얇은 캔은 찌그러집니다.' },
    { id: 'switch:on', name: '스위치(켜짐)', formula: '닫힌 접점', fx: 'Cu', state: 'solid', cat: 'device', color: '#d8b040', density: 8000, c: 400, k: 50, inert: true, wire: true, grain: 2, desc: '전기가 통하는 스위치. 측정 탭의 "켜기·끄기" 도구로 누르면 꺼집니다.' },
    { id: 'switch:off', name: '스위치(꺼짐)', formula: '열린 접점', fx: 'Cu', state: 'solid', cat: null, aliasOf: 'switch:on', color: '#6a5a30', density: 8000, c: 400, k: 0.5, inert: true, grain: 2, desc: '전기가 통하지 않는 상태의 스위치. 켜기·끄기 도구로 누르면 켜집니다.' },
    { id: 'valve', name: '밸브(닫힘)', formula: '마개', fx: 'Fe', state: 'solid', cat: 'device', color: '#b04a4a', density: 7800, c: 500, k: 20, inert: true, strength: 100, grain: 2, desc: '관이나 용기 벽에 끼워 두는 마개. 켜기·끄기 도구로 누르면 열려 기체·액체가 지나가고, 다시 누르면 닫힙니다.' },
    { id: 'piston', name: '피스톤', formula: '금속 판', fx: 'Fe', state: 'solid', cat: 'device', color: '#7d8fa3', density: 7800, c: 500, k: 20, inert: true, strength: 500, grain: 2, desc: '밀폐 용기 안의 기체를 새지 않게 밀고 당기는 판. 측정 탭의 피스톤 도구로 넣고 빼면 기체의 양은 그대로 부피만 바뀝니다(보일 법칙).' },
    { id: 'can', name: '얇은 금속 벽(캔)', formula: '알루미늄 판', fx: 'Al', state: 'solid', cat: 'device', color: '#b8c0c8', density: 2700, c: 900, k: 200, inert: true, strength: 1, shatter: 'can:crushed', grain: 3, desc: '견디는 압력이 1기압 정도인 얇은 벽. 안의 압력이 많이 낮아지면 바깥 공기에 눌려 찌그러집니다.' },
    { id: 'can:crushed', name: '찌그러진 캔', formula: '알루미늄 조각', fx: 'Al', state: 'powder', color: '#8c949c', density: 2700, c: 900, k: 200, inert: true, desc: '대기압에 눌려 찌그러진 캔 조각.' },
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
  // 불꽃이 식으면 무엇이 남는지는 무엇이 탔는지에 따라 다르다. 탄소가 든 연료만 연기와 이산화탄소를 남긴다.
  const mkFire = (id, name, rgb, decay, desc) => add({ id, name, formula: '연소 기체', state: 'gas', cat: id === 'fire' ? 'basic' : null, color: '#ff8a2a', density: 0.3, c: 1100, k: 0.08, T0: 1000, lifetime: 40, rise: 0.12, flame: rgb, inert: false, decay, aliasOf: id === 'fire' ? null : 'fire', desc: desc || '수명이 짧은 고온의 기체.' });
  mkFire('fire', '불꽃', [255, 130, 30], [['smoke', 0.85], ['CO2', 0.15]], '수명이 짧은 고온의 기체. 탄소가 든 연료의 불꽃은 식으면 연기와 이산화탄소가 됩니다.');
  // 산소를 다 쓴 뒤 남는 공기는 질소이므로, 탄소가 없는 불꽃은 식으면 질소(와 흰 연기·수증기)가 된다.
  add({ id: 'smoke:white', name: '흰 연기', formula: '금속 산화물 미세입자', fx: 'MgO', state: 'gas', color: '#9aa0a4', density: 1.1, c: 1000, k: 0.03, T0: 200, lifetime: 400, decay: [['N:g', 1]], desc: '금속이 탈 때 생긴 산화물 가루가 떠 있는 연기.' });
  for (const [el, rgb] of Object.entries(FLAME_COLORS)) mkFire('fire:' + el, SL.ELEMENTS.find((e) => e.sym === el).name + ' 불꽃', rgb, [['smoke:white', 0.6], ['N:g', 0.4]], '금속이 타는 불꽃. 식으면 금속 산화물의 흰 연기가 됩니다.');
  mkFire('fire:H', '수소 불꽃', [150, 185, 255], [['H2O:g', 0.6], ['N:g', 0.4]], '수소의 불꽃은 엷은 파란색이라 낮에는 잘 보이지 않고, 식으면 수증기만 남습니다.');
  mkFire('fire:S', '황 불꽃', [70, 110, 255], [['N:g', 1]], '황은 파란 불꽃을 내며 탑니다.');
  mkFire('fire:clean', '불꽃', [255, 150, 50], [['N:g', 0.8], ['smoke:white', 0.2]], '탄소가 없는 물질이 타거나 폭발한 불꽃. 이산화탄소를 남기지 않습니다.');
  // 핵폭발의 불덩이: 아주 뜨겁고 오래 남아 위로 솟으며 연기(버섯구름)가 된다.
  add({ id: 'fireball', name: '불덩이(화구)', formula: '플라스마·고온 기체', state: 'gas', color: '#fff0c8', density: 0.1, c: 1100, k: 0.05, T0: 5000, lifetime: 260, rise: 0.4, flame: [255, 236, 190], decay: [['smoke', 0.8], ['fallout', 0.2]], aliasOf: 'fire', desc: '핵폭발로 생긴 수천 °C의 불덩이. 위로 솟아오르며 식어 연기와 방사성 낙진이 됩니다.' });

  // 비활성 기체는 반응하지 않는다.
  list.forEach((d) => { if (d.elCat === 'noble') d.inert = true; });

  Object.assign(alias, {
    water: 'H2O:l', ice: 'H2O:s', steam: 'H2O:g', hydrogen: 'H:g', oxygen: 'O:g', nitrogen: 'N:g', co2: 'CO2:g', sodium: 'Na:s', iron: 'Fe:s', copper: 'Cu:s', magnesium: 'Mg:s', salt: 'S:NaCl', brine: 'A:NaCl', naoh: 'A:NaOH',
    hcl: 'A:acid:HCl', limestone: 'S:CaCO3', quicklime: 'S:CaO', slaked: 'S:Ca(OH)2', rust: 'S:Fe2O3', vinegar: 'A:acid:CH3COOHaq', molteniron: 'Fe:l',
  });

  // ---- 가열·냉각으로 바뀌는 것, 폭발에 부서지는 것 ----
  const byId = (id) => list.find((d) => d.id === id);
  add({ id: 'glassshards', name: '깨진 유리', formula: 'SiO₂ 유리 조각', fx: 'SiO2', state: 'powder', cat: 'rock', color: '#b4e0e0', density: 1500, c: 840, k: 0.5, desc: '뜨거운 유리가 갑자기 식거나 폭발에 맞아 깨진 조각. 녹이면 다시 유리가 됩니다.', up: { at: 1400, to: 'moltenglass', L: 1.4e5 } });
  add({ id: 'fog', name: '안개', formula: '작은 물방울', fx: 'H2O', state: 'gas', color: '#d8e0e6', density: 1.5, c: 1000, k: 0.03, T0: -10, lifetime: 360, decay: [['air', 1]], grain: 14, desc: '차가워진 공기 속 수증기가 엉긴 작은 물방울. 공기보다 차갑고 무거워 바닥으로 깔리다가 사라집니다.' });
  add({ id: 'gravel', name: '돌 부스러기', formula: '암석 조각', fx: 'SiO2', state: 'powder', cat: 'rock', color: '#8a8f96', density: 1600, c: 800, k: 0.4, desc: '바위가 얼었다 녹기를 되풀이하거나(풍화) 폭발에 맞아 부서진 조각.', up: { at: 1215, to: 'lava', L: 4e5 } });
  add({ id: 'flour', name: '밀가루', formula: '(C₆H₁₀O₅)ₙ', fx: 'C6H10O5', state: 'powder', cat: 'organic', color: '#f2ece0', density: 600, c: 1700, k: 0.1, dust: true, fuel: { ign: 380, prob: 0.2, prods: ['CO2', 'H2O'], T: 1000 }, desc: '고운 가루가 공기 중에 퍼진 채 불이 붙으면 순식간에 타며 폭발합니다(분진 폭발).' });
  add({ id: 'caramel', name: '캐러멜', formula: '설탕이 분해된 갈색 물질', fx: 'C12H18O9', state: 'powder', color: '#a05a1a', density: 1500, c: 1300, k: 0.2, desc: '설탕을 160°C 넘게 가열하면 분해되며 갈색과 향이 생깁니다. 더 가열하면 검게 탑니다.' });
  add({ id: 'I:vapor', name: '아이오딘 증기(승화)', formula: 'I₂(g)', fx: 'I2', state: 'gas', color: '#6a3f96', density: 10.6, c: 145, k: 0.02, lifetime: 1200, decay: [['air', 1]], desc: '고체 아이오딘이 녹지 않고 바로 기체가 된 보라색 증기. 차가운 면에 닿으면 다시 결정이 됩니다.' });
  add({ id: 'S:plastic', name: '고무상 황', formula: 'Sₙ (사슬 모양)', fx: 'S', sp: 'S', state: 'powder', color: '#6a3a18', density: 1920, c: 710, k: 0.2, lifetime: 1800, decay: [['S:s', 1]], desc: '200°C 가까이 가열해 진해진 황을 찬물에 부으면 고무처럼 늘어나는 황이 됩니다. 며칠에 걸쳐 다시 노란 황으로 돌아갑니다.' });
  add({ id: 'Sn:gray', name: '회색 주석', formula: 'α-Sn', fx: 'Sn', state: 'powder', color: '#7c7f84', density: 5770, c: 210, k: 2, desc: '13°C 아래에서 흰 주석이 천천히 부서지는 회색 가루로 변하는 "주석 페스트". 데우면 돌아갑니다.', up: { at: 13.2, to: 'Sn:s', L: 2e3 } });
  add(Object.assign({}, byId('steel:s'), { id: 'steel:hard', name: '담금질한 강철', formula: 'Fe+C (마르텐사이트)', color: '#5c646c', desc: '뜨겁게 달군 강철을 물에 넣어 급히 식히면 단단하고 잘 부러지는 강철이 됩니다. 600°C 정도로 다시 데우면 무르게 풀립니다(뜨임).', up: { at: 600, to: 'steel:s', L: 5e4 }, down: null, cat: null }));
  // 가열하면 색이 바뀌고 식으면 돌아오는 물질(열변색)
  const recolor = (id, hotId, at, name, color, desc) => {
    const cold = byId(id);
    if (!cold) return;
    add(Object.assign({}, cold, { id: hotId, name, color, desc, cat: null, up: cold.up, down: { at, to: id, L: 2e3 } }));
    cold.up = { at, to: hotId, L: 2e3 };
    cold.desc = (cold.desc ? cold.desc + ' ' : '') + `${at}°C 넘게 가열하면 ${name.replace(/^.*\(|\)$/g, '')}이 되고 식으면 돌아옵니다.`;
  };
  recolor('S:ZnO', 'ZnO:hot', 250, '뜨거운 산화아연 (노란색)', '#e8d850', '산화아연은 뜨거울 때만 노랗고 식으면 다시 흰색입니다.');
  recolor('S:HgI2', 'HgI2:yellow', 127, '아이오딘화수은 (노란 결정형)', '#f0d030', '127°C 위에서는 결정 구조가 바뀌어 노란색입니다.');
  // 황: 160°C 넘게 가열하면 고리 모양 분자가 사슬로 이어져 진한 빨간색의 끈적한 액체가 된다.
  const sl = byId('S:l');
  add(Object.assign({}, sl, { id: 'S:l:dark', name: '진하게 끈적한 황', color: '#7a2414', flow: 1, T0: 200, cat: null, desc: '160°C 넘게 가열한 황. 분자가 긴 사슬로 이어져 진한 적갈색이 되고 잘 흐르지 않습니다. 찬물에 부으면 고무상 황이 됩니다.', down: { at: 160, to: 'S:l', L: 1e4 } }));
  sl.up = { at: 160, to: 'S:l:dark', L: 1e4 };
  // 갇힌 기체의 압력을 견디는 정도(기압, 1cm 두께 기준의 대략값). 정하지 않은 고체는 12, 금속은 40, 가루는 3.
  const STRENGTH = { glass: 6, glassshards: 2, quartz: 15, stone: 20, basalt: 25, marble: 18, concrete: 20, ceramic: 12, gypsum: 6, wood: 8, ember: 3, 'H2O:s': 4, ice: 4 };
  for (const [id, v] of Object.entries(STRENGTH)) { const m = byId(id); if (m) m.strength = v; }

  // 폭발에 맞으면 부서지는 고체
  for (const id of ['stone', 'basalt', 'marble', 'quartz', 'concrete', 'ceramic', 'gypsum']) byId(id).shatter = 'gravel';
  byId('glass').shatter = 'glassshards';

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
    NO3: { Na: 380, K: 400, Rb: 450, Cs: 450, Mg: 330, Ca: 561, Sr: 570, Ba: 592, Al: 150, Fe3: 125, Fe2: 100, Cu2: 170, Zn: 110, Pb2: 290, Ag: 444, Ni2: 110, Co2: 100, Mn2: 140, Cd: 300, Hg2: 200, Cr3: 100, Sn2: 150 },
    SO4: { Cu2: 650, Fe2: 480, Fe3: 480, Al: 770, Zn: 680, Pb2: 1000, Mn2: 850, Ni2: 840, Co2: 735, Cd: 1000 },
    ClO3: { K: 400, Na: 300 },
    C2O4: { def: 450 },
    SO3: { def: 600 },
  };
  const DECOMP_GAS = { CO3: ['CO2', 'CO2'], HCO3: ['CO2', 'CO2'], OH: ['H2O:g', 'H2O'], NO3: ['NO2', 'NO2'], SO4: ['SO3', 'SO3'], SO3: ['SO2', 'SO2'], ClO3: ['O:g', 'O2'], C2O4: ['CO', 'CO'] };
  const HEAVY_ALKALI = new Set(['Na', 'K', 'Rb', 'Cs']);
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
      // 고운 가루(밀가루 등)도 공기 중에서 한꺼번에 타면 폭발한다(분진 폭발).
      const blast = B.id === 'O:l' ? [2.5, 0.3] : gasFuel ? (B.id === 'air' ? [1.5, 0.15] : [2.5, 0.4]) : A.dust ? [2.5, 0.12] : null;
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
      // 타이타늄은 치밀한 산화막 때문에 대부분의 산에 녹지 않는다(인공 관절·잠수함에 쓰는 이유). 플루오린화수소산과 뜨거운 염산만 예외.
      const tiBlock = elA === 'Ti' && a !== 'F' && a !== 'Cl';
      if (sal && r >= 0 && !tiBlock) {
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
          out.push(R('acid:' + elA + ':' + a, A.name + '과 ' + B.name, [elA, B.fx], [sal.fx, 'H2'], { minT: elA === 'Ti' && a === 'Cl' ? 70 : undefined, prob: insoluble ? pace * 0.1 : pace, toA: insoluble ? formOf(sal) : [[A.id, 0.85], ['H:g', 0.15]], toB: insoluble ? 'H:g' : [[formOf(sal), 0.6], ['H:g', 0.4]], dT: 25 + 60 * (1 - r / H_RANK), note: '수소보다 활발한 금속이 산에 녹으며 수소를 냅니다.' + (insoluble ? ' 생성물이 물에 녹지 않아 표면을 덮어 느려집니다.' : '') }));
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

    // 물과 수용액의 증발: 끓지 않아도 표면에서 물이 날아간다(수증기는 공기 속으로 흩어진다고 본다).
    // 증기압이 온도에 따라 가파르게 커지므로 뜨거울수록 빠르다. 녹아 있던 것은 결정으로 남는다(염전, 바닷물이 마른 자국).
    if (B.id === 'air' && A.state === 'liquid' && (A.id === 'H2O:l' || (A.aq && !A.acid && !A.indicator))) {
      const left = A.id === 'H2O:l' ? null : A.salt ? (salt(A.salt.c, A.salt.a) || {}).solid : A.id === 'A:sugar' ? 'sugar' : A.id === 'A:glucose' ? 'glucose' : null;
      const to = left ? [['air', 0.8], [left, 0.2]] : 'air';
      const what = left ? `${A.formula} → H₂O(g)↑ + 결정` : 'H₂O(l) → H₂O(g)';
      for (const [minT, prob] of [[80, 0.01], [50, 0.003], [undefined, 0.0004]]) {
        out.push(R('evap:water', '물의 증발', [], [], { kind: 'physical', eq: what, minT, prob, toA: to, dT: -1, note: '끓는점보다 낮아도 물은 표면에서 조금씩 증발합니다. 따뜻할수록 빠르고, 녹아 있던 소금 같은 것은 결정으로 남습니다. 증발할 때 열을 가져가 시원해집니다.' }));
      }
    }

    // 아주 차가운 물질 옆의 공기는 습기가 얼어 붙어 하얀 안개가 된다(액체 질소·드라이아이스의 안개).
    if (B.id === 'air' && A.bp != null && A.bp < -20 && A.state !== 'gas' && A.sp) {
      out.push(R('fog', '차가운 안개', [], [], { kind: 'physical', eq: '공기 속 수증기 → 작은 물방울·얼음 알갱이', maxT: -5, prob: 0.05, toB: 'fog', note: '하얀 연기처럼 보이는 것은 이산화탄소나 질소가 아니라, 차가워진 공기 속 수증기가 엉긴 작은 물방울입니다. 공기보다 차갑고 무거워 바닥으로 깔립니다.' }));
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
      } else if (a === 'SO3' && eProd && A.acid.a !== 'SO3') {
        out.push(R('sulfite-acid:' + A.fx + ':' + B.fx, A.name + '과 ' + B.name, [A.fx, B.fx], [e.fx, 'SO2', 'H2O'], { prob: pace * 0.6, toA: eProd, toB: 'SO2', note: '아황산염은 산을 만나 자극적인 이산화황을 냅니다.' }));
      } else if (a === 'NO2' && eProd) {
        out.push(R('nitrite-acid:' + A.fx + ':' + B.fx, A.name + '과 ' + B.name, [], [], { kind: 'chemical', eq: '2NO₂⁻ + 2H⁺ → NO↑ + NO₂↑ + H₂O', prob: pace * 0.6, toA: eProd, toB: 'NO2', note: '아질산염에 산을 넣으면 불안정한 아질산이 분해되어 적갈색 기체가 나옵니다.' }));
      } else if (a === 'H' && eProd) {
        out.push(R('hydride-acid:' + A.fx + ':' + B.fx, A.name + '과 ' + B.name, [A.fx, B.fx], [e.fx, 'H2'], { prob: 0.4, toA: eProd, toB: 'H:g', dT: 200, note: '금속 수소화물은 산과 격렬하게 반응해 수소를 냅니다.' }));
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

    // 금속 수소화물 + 물 → 수산화물 + 수소 (격렬, 수소 저장 물질)
    if (A.salt && A.salt.a === 'H' && (isWater(B) || B.id === 'H2O:g' || (B.aq && B.state === 'liquid'))) {
      const hyd = salt(A.salt.c, 'OH');
      if (hyd) out.push(R('hydride-water:' + A.fx, A.name + '과 물', [A.fx, 'H2O'], [hyd.fx, 'H2'], { prob: 0.2, toA: formOf(hyd), toB: 'H:g', dT: 250, explode: 1.5, explodeP: 0.05, note: '수소화물의 수소 이온(H⁻)이 물의 수소와 만나 수소 기체가 됩니다. 수소를 고체로 저장하는 방법으로 연구됩니다.' }));
    }
    if (m && m.cat && B.sp === 'H' && B.state === 'gas') {
      const hy = salt(m.cat, 'H');
      if (hy && hy.solid) out.push(R('hydride:' + elA, A.name + '과 수소', [elA, 'H2'], [hy.fx], { minT: 300, prob: 0.02, toA: hy.solid, toB: 'air', dT: 50, note: '활발한 금속은 뜨거운 수소와 결합해 수소화물이 됩니다.' }));
    }
    // 아황산염은 공기 중에서 천천히 황산염이 된다(식품 보존제가 산소를 먼저 잡는 원리).
    if (A.salt && A.salt.a === 'SO3' && B.id === 'air') {
      const sul = salt(A.salt.c, 'SO4');
      if (sul) out.push(R('sulfite-air:' + A.fx, A.name + '의 산화', [A.fx, 'O2'], [sul.fx], { prob: 0.0005, toA: formOf(sul), note: '아황산 이온은 산소를 잘 잡아 황산 이온이 됩니다. 와인·말린 과일의 산화 방지제로 씁니다.' }));
    }
    // 이산화황 + 염기 용액 → 아황산염 (배기가스 탈황)
    if (A.sp === 'SO2' && A.state === 'gas' && B.aq && B.salt && B.salt.a === 'OH') {
      const sf = salt(B.salt.c, 'SO3');
      if (sf) out.push(R('so2-base:' + B.fx, '이산화황과 ' + B.name, ['SO2', B.fx], [sf.fx, 'H2O'], { prob: 0.2, toA: 'H2O:l', toB: formOf(sf), note: '발전소 굴뚝에서 이산화황을 염기로 흡수해 산성비를 줄입니다.' }));
    }
    // 아황산 이온은 환원제: 아이오딘·과망가니즈산의 색을 없앤다.
    if (A.aq && A.salt && A.salt.a === 'SO3' && (B.id === 'A:KI3' || B.id === 'A:KMnO4' || B.id === 'starch:blue')) {
      const to = B.id === 'A:KI3' ? 'A:KI' : B.id === 'starch:blue' ? 'starch' : 'A:MnSO4';
      out.push(R('sulfite-redox:' + B.id, '아황산 이온의 환원 작용', [], [], { kind: 'chemical', eq: B.id === 'A:KMnO4' ? '2MnO₄⁻ + 5SO₃²⁻ + 6H⁺ → 2Mn²⁺ + 5SO₄²⁻ + 3H₂O' : 'I₂ + SO₃²⁻ + H₂O → 2I⁻ + SO₄²⁻ + 2H⁺', prob: 0.3, toB: to, note: '아황산 이온이 전자를 내주고 황산 이온이 되며 색이 사라집니다.' }));
    }
    // 염소산염 + 이산화망가니즈(촉매): 낮은 온도에서 산소
    if (A.salt && A.salt.a === 'ClO3' && A.state === 'powder' && B.id === 'S:MnO2') {
      const cl = salt(A.salt.c, 'Cl');
      out.push(R('chlorate-mno2:' + A.fx, A.name + '과 이산화망가니즈(촉매)', [A.fx], [cl.fx, 'O2'], { minT: 200, prob: 0.08, toA: [[cl.solid, 0.4], ['O:g', 0.6]], note: '이산화망가니즈는 촉매라서 줄어들지 않고, 분해 온도만 크게 낮춥니다. 교과서의 산소 발생 실험입니다.' }));
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
      const c0 = A.salt.c, a0 = A.salt.a;
      if (at != null && a0 === 'ClO3') {
        const cl = salt(c0, 'Cl');
        out.push(R('decomp:' + A.fx, A.name + '의 열분해', [A.fx], [cl.fx, 'O2'], { minT: at, prob: 0.05, toA: cl.solid, toB: 'O:g', note: '가열하면 산소를 내놓습니다. 이산화망가니즈를 섞으면 훨씬 낮은 온도에서 일어납니다(실험실 산소 제조).' }));
      } else if (at != null && a0 === 'NO3' && HEAVY_ALKALI.has(c0)) {
        const no2 = salt(c0, 'NO2');
        if (no2) out.push(R('decomp:' + A.fx, A.name + '의 열분해', [A.fx], [no2.fx, 'O2'], { minT: at, prob: 0.05, toA: no2.solid, toB: 'O:g', note: '나트륨·칼륨의 질산염은 녹을 만큼 가열하면 아질산염과 산소가 됩니다. 다른 금속의 질산염은 이산화질소를 냅니다.' }));
      } else if (at != null && a0 === 'C2O4') {
        const carb = salt(c0, 'CO3'), ox = salt(c0, 'O');
        const prod = carb || ox; // 탄산염이 없는 금속은 산화물과 일산화탄소·이산화탄소가 된다.
        if (prod) out.push(R('decomp:' + A.fx, A.name + '의 열분해', [A.fx], carb ? [carb.fx, 'CO'] : [ox.fx, 'CO', 'CO2'], { minT: at, prob: 0.05, toA: prod.solid, toB: 'CO', note: '옥살산염은 가열하면 탄산염과 일산화탄소가 됩니다.' }));
      } else if (at != null && (product || A.salt.c === 'NH4' || A.salt.c === 'Ag')) {
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
      // 수소보다 반응성이 큰 금속은 구연산에도 천천히 녹는다(약한 산이라 마그네슘 말고는 아주 느림).
      const CITRIC_METALS = { Ca: 0.03, Zn: 0.006, Fe: 0.003, Al: 0.001, Ni: 0.0008, Sn: 0.0008, Pb: 0.0005, Mn: 0.004, Co: 0.001, Cr: 0.001, Cd: 0.002, Be: 0.002, Ga: 0.001, La: 0.01, Ce: 0.01, Gd: 0.01, Sr: 0.03, Ba: 0.03 };
      if (!solid && B.metal && CITRIC_METALS[B.metal] && B.state === 'powder') out.push(R('citric-metal:' + B.metal, '구연산과 ' + B.name, [], [], { kind: 'chemical', eq: `${B.formula} + 구연산 → 시트르산 ${B.formula} + H₂↑`, prob: CITRIC_METALS[B.metal], toA: 'A:citrate', toB: [[B.id, 0.8], ['H:g', 0.2]], note: '레몬즙 같은 약한 산도 반응성이 큰 금속은 천천히 녹이며 수소 거품을 냅니다.' }));
      // 녹지 않는 탄산염도 구연산에 녹으며 거품이 난다(세제·물때 제거).
      if (!solid && B.salt && B.salt.a === 'CO3' && !['Na', 'K', 'Ca'].includes(B.salt.c)) out.push(R('citric-co3:' + B.fx, '구연산과 ' + B.name, [], [], { kind: 'chemical', eq: '2C₆H₈O₇ + 3MCO₃ → M₃(C₆H₅O₇)₂ + 3CO₂↑ + 3H₂O', prob: 0.05, toA: 'A:citrate', toB: [['A:citrate', 0.5], ['CO2', 0.5]], note: '탄산염은 약한 산에도 이산화탄소 거품을 내며 녹습니다.' }));
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
    if (!E || E.state !== 'liquid' || E.indicator) return null;
    if (!E.aq) return E.salt && E.id.startsWith('M:') ? { c: E.salt.c, a: E.salt.a, molten: true } : null; // 녹은 염도 이온이 움직여 전기가 통한다.
    if (E.salt) return { c: E.salt.c, a: E.salt.a };
    if (E.acid) return { c: 'H', a: E.acid.a };
    if (E.id === 'A:citric' || E.id === 'A:vitc') return { c: 'H', a: 'cit' }; // 레몬즙 같은 약한 유기산도 전기가 통한다.
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
      // 녹은 염에는 물이 없으므로 나트륨·알루미늄 같은 반응성이 큰 금속도 석출된다(다운스 법, 홀-에루 법).
      if (ions.molten && el) {
        const ion = el + (SUP[cat.charge] || '⁺');
        return { to: el + ':l', deposit: true, e: cat.charge, key: 'electro:molten:' + el, name: '녹은 염의 전기 분해: ' + SL.ELEMENTS.find((e) => e.sym === el).name + ' 얻기', eq: `${ion} + ${cat.charge}e⁻ → ${el}`, note: '물이 없는 녹은 염을 전기 분해하면 반응성이 큰 금속도 얻을 수 있습니다. 나트륨은 녹은 소금에서, 알루미늄은 녹은 산화알루미늄에서 이렇게 만듭니다. 전기가 아주 많이 듭니다.' };
      }
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
    if (ions.molten && !hal) return { to: [['O:g', 0.5], [E.id, 0.5]], e: 4, key: 'electro:molten:O2', name: '녹은 산화물의 전기 분해: 산소', eq: '2O²⁻ → O₂↑ + 4e⁻', note: '녹은 산화물에서는 산화 이온이 산소가 됩니다. 알루미늄 제련에서는 이 산소가 탄소 전극을 태워 이산화탄소가 됩니다.' };
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
    const to = sal && sal.aq ? sal.aq : ions.a === 'cit' ? 'A:citrate' : null;
    if (!to) return null;
    const el = metalDef.metal, ch = SL.CATION[m.cat].charge;
    return { to, e: ch, key: 'electro:anode:' + el, name: '전기 분해: (+)극의 ' + metalDef.name + '이(가) 녹음', eq: `${el} → ${el}${SUP[ch] || '⁺'} + ${ch}e⁻`, note: '금속을 (+)극으로 쓰면 전극 자체가 이온으로 녹아 들어갑니다. 구리를 순수하게 만드는 정련과 전기 도금에 씁니다.' };
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
    ...['S:s', 'S:l', 'S:l:dark'].flatMap((s) => OX.map((ox) => ({ id: 's_burn', name: '황의 연소', reactants: ['S', 'O2'], products: ['SO2'], a: s, b: ox, minT: 230, prob: ox === 'air' ? 0.1 : 0.3, toA: 'fire:S', toB: 'SO2', T: 1000, note: '파란 불꽃과 함께 자극적인 이산화황이 생깁니다.' }))),
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
    { id: 'haber', name: '하버-보슈 공정', reactants: ['N2', 'H2'], products: ['NH3'], a: 'nitrogen', b: 'hydrogen', near: ['Fe:s'], minT: 400, minP: 2, prob: 0.2, toA: 'NH3', toB: 'NH3', note: '철 촉매와 고온에서 암모니아를 만듭니다. 높은 압력(밀폐 용기를 가열해 2기압 이상)이 있어야 일어납니다. 실제 공정은 약 200기압을 씁니다.' },
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
    { id: 'caramel', name: '캐러멜화', kind: 'chemical', eq: '설탕 → 캐러멜(갈색) + 물 (160°C 이상)', a: 'sugar', b: 'air', minT: 160, maxT: 220, prob: 0.02, toA: 'caramel', note: '설탕이 녹으며 분해되어 갈색과 단내가 나는 캐러멜이 됩니다. 요리에서 쓰는 반응입니다.' },
    { id: 'sugar_heat', name: '설탕의 열분해', kind: 'chemical', eq: '캐러멜 → C + H₂O (더 가열)', a: 'caramel', b: 'air', minT: 230, prob: 0.03, toA: 'C:s', toB: 'steam', note: '더 가열하면 검게 탄 탄소만 남습니다.' },
    { id: 'sugar_heat', name: '설탕의 열분해', reactants: ['C12H22O11'], products: ['C', 'H2O'], a: 'sugar', b: 'air', minT: 230, prob: 0.02, toA: 'C:s', toB: 'steam', note: '캐러멜을 거쳐 탄소가 됩니다.' },
    // 과산화수소가 분해되면 물과 함께 산소 기체가 나온다(2H₂O₂ → 2H₂O + O₂이므로 칸의 일부를 산소로 바꾼다).
    { id: 'h2o2_mno2', name: '과산화수소의 분해', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'S:MnO2', prob: 0.4, toA: [['water', 0.6], ['oxygen', 0.4]], dT: 10, note: '이산화망가니즈는 촉매라서 줄어들지 않습니다. 산소 거품이 납니다.' },
    { id: 'h2o2_ki', name: '과산화수소와 아이오딘화 칼륨', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'A:KI', farFrom: ['H2SO4aq', 'hcl', 'vinegar'], prob: 0.3, toA: [['water', 0.6], ['oxygen', 0.4]], dT: 15, note: '아이오딘화 이온도 촉매입니다. 비누를 섞으면 산소가 거품을 부풀려 "코끼리 치약"이 됩니다.' },
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
    { id: 'h2_s', name: '수소와 황', reactants: ['H2', 'S'], products: ['H2S'], a: 'hydrogen', b: 'S:l:dark', minT: 300, prob: 0.05, toA: 'H2S', toB: 'H2S', note: '녹은 황 위로 수소를 통과시키면 달걀 썩는 냄새의 황화수소가 생깁니다.' },
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
    // ---- 가열·냉각으로 일어나는 변화 ----
    { id: 'glass_shock', name: '유리의 열 충격', kind: 'physical', eq: '뜨거운 유리 + 찬물 → 깨진 유리', a: 'glass', b: 'water', minT: 250, prob: 0.2, toA: 'glassshards', toB: 'steam', note: '바깥만 급히 식어 줄어들면서 안쪽과 어긋나 유리가 깨집니다. 내열 유리는 덜 늘어나서 잘 견딥니다.' },
    { id: 'quench', name: '강철 담금질', kind: 'physical', eq: '달군 강철(750°C 이상) + 물 → 단단한 강철', a: 'steel:s', b: 'water', minT: 700, prob: 0.3, toA: 'steel:hard', toB: 'steam', note: '대장간에서 칼을 단단하게 만드는 방법입니다. 탄소가 철 결정 속에 갇혀 단단해집니다.' },
    { id: 'glass_shock', name: '유리의 열 충격', kind: 'physical', eq: '뜨거운 유리(200°C 이상) + 얼음 → 깨진 유리', a: 'glass', b: 'ice', minT: 200, prob: 0.08, toA: 'glassshards', toB: 'water', note: '겉면만 갑자기 식어 줄어들면 아직 뜨거운 속과 크기가 달라져 금이 갑니다.' },
    { id: 'fire_setting', name: '불 지르기 채굴(열충격)', kind: 'physical', eq: '달군 바위(400°C 이상) + 찬물 → 돌 부스러기', a: 'stone', b: 'water', minT: 400, prob: 0.03, toA: 'gravel', toB: 'steam', note: '옛 광부들은 바위를 불로 달군 뒤 찬물을 끼얹어 갈라지게 했습니다. 겉과 속의 팽창 차이 때문에 바위에 금이 갑니다.' },
    { id: 'quench', name: '강철 담금질', kind: 'physical', eq: '달군 강철(750°C 이상) + 물 → 단단한 강철', a: 'steel:s', b: 'steam', minT: 700, prob: 0.2, toA: 'steel:hard', toB: null, note: '대장간에서 칼을 단단하게 만드는 방법입니다. 탄소가 철 결정 속에 갇혀 단단해집니다.' },
    { id: 'plastic_sulfur', name: '고무상 황 만들기', kind: 'physical', eq: '진한 액체 황 + 찬물 → 고무상 황', a: 'S:l:dark', b: 'water', prob: 0.3, toA: 'S:plastic', toB: 'steam', note: '긴 사슬 모양의 황이 결정을 만들 틈 없이 굳어 고무처럼 늘어납니다.' },
    { id: 'iodine_sublime', name: '아이오딘의 승화', kind: 'physical', eq: 'I₂(s) → I₂(g)', a: 'I:s', b: 'air', minT: 50, prob: 0.01, toA: 'I:vapor', note: '아이오딘은 녹기 전에도 보라색 증기로 많이 날아갑니다. 데울수록 빠릅니다.' },
    { id: 'iodine_sublime', name: '아이오딘의 승화', kind: 'physical', eq: 'I₂(s) → I₂(g)', a: 'I:s', b: 'air', minT: 100, prob: 0.08, toA: 'I:vapor', note: '아이오딘은 녹기 전에도 보라색 증기로 많이 날아갑니다. 데울수록 빠릅니다.' },
    ...['glass', 'stone', 'I:s', 'ice', 'cooler', 'cryoplate'].map((b) => ({ id: 'iodine_deposit', name: '아이오딘 결정 맺힘', kind: 'physical', eq: 'I₂(g) → I₂(s) (차가운 면)', a: 'I:vapor', b, maxT: 45, prob: 0.15, toA: 'I:s', note: '보라색 증기가 차가운 면에 닿으면 액체를 거치지 않고 바로 반짝이는 결정이 됩니다(승화의 반대).' })),
    { id: 'naphthalene', name: '좀약이 작아짐', kind: 'physical', eq: 'C₁₀H₈(s) → C₁₀H₈(g)', a: 'C10H8:s', b: 'air', prob: 0.0004, toA: 'air', note: '나프탈렌은 상온에서도 조금씩 승화해 냄새를 내고 점점 작아집니다.' },
    ...['glass', 'stone', 'S:KNO3'].map((b) => ({ id: 'recrystal:KNO3', name: '식히면 생기는 결정(질산칼륨)', kind: 'physical', eq: 'KNO₃(aq) → KNO₃(s) (차가워지면 덜 녹음)', a: 'A:KNO3', b, maxT: 12, prob: 0.02, toA: 'S:KNO3', note: '질산칼륨은 뜨거운 물에는 많이 녹지만 차가운 물에는 적게 녹아, 식히면 결정이 생깁니다(재결정).' })),
    ...['glass', 'stone', 'S:CuSO4·5H2O'].map((b) => ({ id: 'recrystal:CuSO4', name: '식히면 생기는 결정(황산구리)', kind: 'physical', eq: 'CuSO₄(aq) → CuSO₄·5H₂O(s)', a: 'A:CuSO4', b, maxT: 10, prob: 0.01, toA: 'S:CuSO4·5H2O', note: '진한 황산구리 용액을 천천히 식히면 파란 결정이 자랍니다.' })),
    ...['stone', 'basalt', 'concrete', 'marble', 'limestone'].map((b) => ({ id: 'frost', name: '동결 풍화', kind: 'physical', eq: '물이 얼며 부피가 9% 늘어남 → 바위가 갈라짐', a: 'ice', b, prob: 0.0004, toB: 'gravel', note: '틈에 스민 물이 얼면 부피가 커져 바위를 쪼갭니다. 겨울에 도로가 패는 이유입니다.' })),
    { id: 'tin_pest', name: '주석 페스트', kind: 'physical', eq: '흰 주석(β) → 회색 주석(α) (13°C 아래)', a: 'Sn:s', b: 'air', maxT: 13, prob: 0.0003, toA: 'Sn:gray', note: '추운 곳의 주석 그릇·단추가 회색 가루로 부서집니다. 영하 30°C 근처에서 가장 빠릅니다.' },
    { id: 'tin_pest', name: '주석 페스트', kind: 'physical', eq: '흰 주석(β) → 회색 주석(α) (13°C 아래)', a: 'Sn:s', b: 'air', maxT: -20, prob: 0.008, toA: 'Sn:gray', note: '추운 곳의 주석 그릇·단추가 회색 가루로 부서집니다. 영하 30°C 근처에서 가장 빠릅니다.' },
    { id: 'h2o2_blast', name: '과산화수소의 폭발적 분해', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'fire', prob: 0.3, toA: [['oxygen', 0.5], ['steam', 0.5]], T: 600, explode: 2, explodeP: 0.3, note: '진한 과산화수소는 뜨거워지면 분해가 스스로 빨라져 폭발할 수 있습니다. 분해열이 다시 분해를 부르기 때문입니다.' },
    // ---- 빛으로 일어나는 반응 ----
    { id: 'photosynthesis', name: '광합성', reactants: ['CO2', 'H2O'], products: ['C6H12O6', 'O2'], a: 'leaf', b: 'CO2', near: ['lamp', 'uvlamp'], prob: 0.08, toB: 'oxygen', note: '식물은 빛 에너지로 이산화탄소와 물에서 포도당을 만들고 산소를 내놓습니다.' },
    { id: 'photosynthesis', name: '광합성', reactants: ['CO2', 'H2O'], products: ['C6H12O6', 'O2'], a: 'leaf', b: 'A:acid:H2CO3', near: ['lamp', 'uvlamp'], prob: 0.05, toB: [['water', 0.7], ['oxygen', 0.3]], note: '물에 녹은 이산화탄소를 써서 BTB 용액이 노랑에서 초록·파랑으로 돌아갑니다(검정말 실험).' },
    ...['air', 'oxygen'].map((b) => ({ id: 'respiration', name: '식물의 호흡', reactants: ['C6H12O6', 'O2'], products: ['CO2', 'H2O'], a: 'leaf', b, farFrom: ['lamp', 'uvlamp'], prob: 0.0008, toB: 'CO2', note: '식물도 늘 호흡합니다. 빛이 없으면 광합성을 못 해 이산화탄소만 내놓습니다.' })),
    { id: 'ch4_cl2', name: '메테인의 염소화(빛)', reactants: ['CH4', 'Cl2'], products: ['CH3Cl', 'HCl'], a: 'CH4', b: 'Cl:g', near: ['uvlamp'], prob: 0.2, toA: 'CH3Cl', toB: 'HClg', note: '빛이 염소 분자를 쪼개면 사슬 반응으로 메테인의 수소가 염소로 바뀝니다. 어두우면 일어나지 않습니다.' },
    { id: 'h2_cl2', name: '수소와 염소', reactants: ['H2', 'Cl2'], products: ['HCl'], a: 'hydrogen', b: 'Cl:g', near: ['uvlamp'], prob: 0.5, toA: 'HClg', toB: 'HClg', dT: 500, explode: 2, explodeP: 0.3, note: '강한 빛만 쬐어도 폭발하며 염화수소가 됩니다.' },
    ...['S:AgCl', 'S:AgBr'].map((a) => ({ id: 'photo_ag', name: '할로젠화은의 감광', kind: 'chemical', eq: '2AgX → 2Ag + X₂ (빛)', a, b: 'air', near: ['uvlamp', 'lamp'], prob: 0.01, toA: 'Ag:s', note: '빛을 받으면 은 입자가 생겨 검게 변합니다. 필름 사진의 원리입니다.' })),
    { id: 'ozone', name: '오존 생성', reactants: ['O2'], products: ['O3'], a: 'oxygen', b: 'uvlamp', prob: 0.05, toA: 'O3', note: '자외선이 산소 분자를 쪼개면 산소 원자가 다른 산소와 붙어 오존이 됩니다. 성층권 오존층이 생기는 원리입니다.' },
    { id: 'ozone', name: '오존 생성', reactants: ['O2'], products: ['O3'], a: 'air', b: 'uvlamp', prob: 0.005, toA: 'O3', note: '자외선이 산소 분자를 쪼개면 산소 원자가 다른 산소와 붙어 오존이 됩니다. 성층권 오존층이 생기는 원리입니다.' },
    { id: 'ozone_decay', name: '오존의 분해', reactants: ['O3'], products: ['O2'], a: 'O3', b: 'air', prob: 0.002, toA: 'oxygen', note: '오존은 불안정해 시간이 지나면 산소로 돌아갑니다. 데우면 빨라집니다.' },
    { id: 'ozone_decay', name: '오존의 분해', reactants: ['O3'], products: ['O2'], a: 'O3', b: 'air', minT: 100, prob: 0.05, toA: 'oxygen', note: '오존은 불안정해 시간이 지나면 산소로 돌아갑니다. 데우면 빨라집니다.' },
    ...['litmus', 'litmus:red', 'litmus:blue', 'phth:pink', 'btb', 'btb:yellow', 'btb:blue', 'starch:blue', 'cabbage'].map((a) => ({ id: 'ozone_bleach', name: '오존의 표백', kind: 'chemical', eq: 'O₃ + 색소 → 산화된 색소', a, b: 'O3', prob: 0.05, toA: 'bleached', toB: 'oxygen', note: '오존은 강한 산화제라 색소를 분해합니다. 정수장에서 소독·탈색에 씁니다.' })),
    // ---- 착이온·산화 환원 더 ----
    { id: 'ni_nh3', name: '니켈 암모니아 착이온', reactants: ['Ni(OH)2', 'NH4OH'], products: ['Ni(NH3)6(OH)2', 'H2O'], a: 'S:Ni(OH)2', b: 'NH4OH:aq', prob: 0.15, toA: 'A:Ni(NH3)6', toB: 'A:Ni(NH3)6', note: '초록 수산화니켈 앙금이 암모니아수에 녹아 푸른 보라색이 됩니다.' },
    { id: 'zn_nh3', name: '아연 암모니아 착이온', reactants: ['Zn(OH)2', 'NH4OH'], products: ['Zn(NH3)4(OH)2', 'H2O'], a: 'S:Zn(OH)2', b: 'NH4OH:aq', prob: 0.15, toA: 'A:Zn(NH3)4', toB: 'A:Zn(NH3)4', note: '흰 수산화아연 앙금이 암모니아수에 녹아 맑아집니다. 수산화알루미늄은 녹지 않아 둘을 구별할 수 있습니다.' },
    { id: 'h2o2_iodide', name: '과산화수소가 아이오딘화 이온을 산화', eq: 'H₂O₂ + 2I⁻ + 2H⁺ → I₂ + 2H₂O', a: 'H2O2', b: 'A:KI', near: ['H2SO4aq', 'hcl', 'vinegar'], prob: 0.2, toA: 'water', toB: 'A:KI3', note: '산성에서는 과산화수소가 촉매로 분해되는 대신 아이오딘화 이온을 산화시켜 갈색이 됩니다(아이오딘 시계 반응의 한 단계).' },
    { id: 'h2o2_fe2', name: '과산화수소가 철(II)을 산화', eq: '2Fe²⁺ + H₂O₂ + 2H⁺ → 2Fe³⁺ + 2H₂O', a: 'H2O2', b: 'A:FeSO4', prob: 0.15, toA: 'water', toB: 'A:Fe2(SO4)3', note: '연두색 철(II) 용액이 노란 갈색 철(III) 용액으로 변합니다.' },
    { id: 'dichromate_fe2', name: '다이크로뮴산 이온과 철(II) 이온', eq: 'Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O', a: 'A:K2Cr2O7', b: 'A:FeSO4', near: ['H2SO4aq', 'H2SO4'], prob: 0.25, toA: 'A:Cr2(SO4)3', toB: 'A:Fe2(SO4)3', note: '주황색이 초록색으로 변합니다. 철의 양을 재는 적정에 씁니다.' },
    { id: 'kmno4_oxalic', name: '과망가니즈산 이온과 옥살산', eq: '2MnO₄⁻ + 5H₂C₂O₄ + 6H⁺ → 2Mn²⁺ + 10CO₂↑ + 8H₂O', a: 'A:KMnO4', b: 'A:acid:H2C2O4', minT: 60, prob: 0.2, toA: 'A:MnSO4', toB: 'CO2', note: '데워야 시작되고, 생긴 Mn²⁺가 촉매가 되어 점점 빨라집니다(자기 촉매). 과망가니즈산 칼륨 표준화 적정입니다.' },
    { id: 'nitrogen_make', name: '아질산나트륨과 염화암모늄(질소 만들기)', reactants: ['NaNO2', 'NH4Cl'], products: ['NaCl', 'N2', 'H2O'], a: 'A:NaNO2', b: 'A:NH4Cl', minT: 60, prob: 0.1, toA: 'brine', toB: 'nitrogen', note: '데우면 순수한 질소 기체가 나옵니다. 실험실에서 질소를 얻는 방법입니다.' },
    { id: 'sucrose_hydrolysis', name: '설탕의 가수 분해', eq: 'C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆(포도당) + C₆H₁₂O₆(과당)', a: 'A:sugar', b: 'hcl', minT: 60, prob: 0.03, toA: 'A:glucose', note: '산과 열이 설탕을 포도당과 과당으로 나눕니다(전화당). 그러면 베네딕트 반응을 합니다.' },
    { id: 'cracking', name: '석유의 열분해(크래킹)', eq: 'C₈H₁₈ → C₂H₄ + C₆H₁₄ … (촉매, 고온)', a: 'C8H18:g', b: 'sand', minT: 450, prob: 0.05, toA: [['C2H4', 0.6], ['C2H6', 0.4]], note: '긴 탄화수소를 뜨거운 촉매 위에서 쪼개 에틸렌 같은 작은 분자를 얻습니다. 플라스틱 원료가 이렇게 만들어집니다.' },
    { id: 'cracking', name: '석유의 열분해(크래킹)', eq: 'C₈H₁₈ → C₂H₄ + C₆H₁₄ … (촉매, 고온)', a: 'C8H18:g', b: 'S:Al2O3', minT: 450, prob: 0.08, toA: [['C2H4', 0.6], ['C2H6', 0.4]], note: '긴 탄화수소를 뜨거운 촉매 위에서 쪼개 에틸렌 같은 작은 분자를 얻습니다. 플라스틱 원료가 이렇게 만들어집니다.' },
    ...['air', 'oxygen'].map((b) => ({ id: 'ostwald', name: '오스트발트 공정(질산 원료)', reactants: ['NH3', 'O2'], products: ['NO', 'H2O'], a: 'NH3', b, near: ['Pt:s'], minT: 300, prob: 0.2, toA: 'NO', toB: 'steam', note: '뜨거운 백금 그물 위에서 암모니아가 산화되어 일산화질소가 됩니다. 이것을 다시 산화해 물에 녹이면 질산이 됩니다.' })),
    ...['air', 'oxygen'].map((b) => ({ id: 'contact', name: '접촉법(황산 원료)', reactants: ['SO2', 'O2'], products: ['SO3'], a: 'SO2', b, near: ['Pt:s'], minT: 400, prob: 0.1, toA: 'SO3', note: '촉매 위에서 이산화황이 삼산화황이 되고, 이것으로 황산을 만듭니다. 세계에서 가장 많이 만드는 화학 물질입니다.' })),
    // ---- 압력·온도로 바뀌는 평형, 고분자, 에스터 ----
    ...['air', 'N:g', 'NO2', 'CO2:g'].filter((b) => b !== 'NO2').map((b) => ({ id: 'n2o4', name: '이산화질소의 이합체(차가우면)', reactants: ['NO2'], products: ['N2O4'], a: 'NO2', b, maxT: 5, prob: 0.1, toA: 'N2O4', note: '적갈색 이산화질소는 차가우면 둘씩 붙어 무색의 사산화이질소가 되고, 데우면 다시 갈라집니다. 온도에 따라 평형이 옮겨 가는 르샤틀리에 원리의 대표 예입니다.' })),
    ...['air', 'N:g'].map((b) => ({ id: 'n2o4_split', name: '사산화이질소의 분해(뜨거우면)', reactants: ['N2O4'], products: ['NO2'], a: 'N2O4', b, minT: 30, prob: 0.1, toA: 'NO2', note: '온도를 올리면 열을 흡수하는 쪽(갈라지는 쪽)으로 평형이 옮겨 가 다시 갈색이 됩니다.' })),
    { id: 'polymer', name: '에틸렌의 중합(폴리에틸렌)', eq: 'n CH₂=CH₂ → (–CH₂–CH₂–)ₙ', a: 'C2H4', b: 'S:TiCl4', minT: 60, prob: 0.1, toA: 'plastic', note: '촉매(지글러-나타 촉매) 위에서 에틸렌의 이중 결합이 풀리며 길게 이어져 플라스틱이 됩니다.' },
    { id: 'polymer', name: '에틸렌의 중합(폴리에틸렌)', eq: 'n CH₂=CH₂ → (–CH₂–CH₂–)ₙ', a: 'C2H4', b: 'M:TiCl4', minT: 60, prob: 0.1, toA: 'plastic', note: '촉매(지글러-나타 촉매) 위에서 에틸렌의 이중 결합이 풀리며 길게 이어져 플라스틱이 됩니다.' },
    { id: 'ester_hydrolysis', name: '에스터의 가수 분해(비누화)', reactants: ['C4H8O2', 'NaOH'], products: ['NaCH3COO', 'C2H5OH'], a: 'C4H8O2', b: 'naoh', minT: 40, prob: 0.05, toA: 'C2H5OH', toB: 'A:NaCH3COO', note: '에스터는 염기와 데우면 알코올과 카복실산염으로 나뉩니다. 과일 향이 사라집니다.' },
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

    // 철 + 뜨거운 수증기 → 사산화삼철(검은 녹) + 수소. 철은 산화수 +2와 +3이 섞인 산화물이 된다.
    { id: 'fe_steam', name: '철과 뜨거운 수증기', reactants: ['Fe', 'H2O'], products: ['Fe3O4', 'H2'], a: 'Fe:s', b: 'steam', minT: 500, prob: 0.05, toA: 'S:Fe3O4', toB: 'hydrogen', dT: 30, note: '빨갛게 달군 철은 수증기에서 산소를 빼앗아 검은 사산화삼철(Fe₃O₄, 자철석 성분)이 되고 수소가 나옵니다. 라부아지에가 물이 원소가 아님을 보인 실험입니다.' },
    { id: 'fe_steam', name: '철과 뜨거운 수증기', reactants: ['Fe', 'H2O'], products: ['Fe3O4', 'H2'], a: 'steel:s', b: 'steam', minT: 500, prob: 0.04, toA: 'S:Fe3O4', toB: 'hydrogen', dT: 30, note: '빨갛게 달군 철은 수증기에서 산소를 빼앗아 검은 사산화삼철이 되고 수소가 나옵니다.' },
    // ---- 산화제 + 환원제 ----
    { id: 'h2o2_h2s', name: '과산화수소와 황화수소', eq: 'H₂O₂ + H₂S → S↓ + 2H₂O', a: 'H2O2', b: 'H2S:g', prob: 0.2, toA: 'water', toB: 'S:s', dT: 20, note: '과산화수소가 황화 이온을 산화시켜 노란 황이 생깁니다. 하수 냄새를 없애는 원리입니다.' },
    { id: 'h2o2_so2', name: '과산화수소와 이산화황', eq: 'H₂O₂ + SO₂ → H₂SO₄', a: 'H2O2', b: 'SO2:g', prob: 0.25, toA: 'A:acid:H2SO4aq', toB: 'A:acid:H2SO4aq', dT: 15, note: '이산화황이 황산이 됩니다. 공기 중 이산화황 농도를 재는 방법이자, 산성비가 생기는 한 경로입니다.' },
    { id: 'h2o2_sulfite', name: '과산화수소와 아황산 이온', eq: 'H₂O₂ + SO₃²⁻ → SO₄²⁻ + H₂O', a: 'H2O2', b: 'A:Na2SO3', prob: 0.25, toA: 'A:Na2SO4', toB: 'A:Na2SO4', dT: 10, note: '아황산 이온은 쉽게 산화되어 황산 이온이 됩니다.' },
    { id: 'h2o2_sulfide', name: '과산화수소와 황화 이온', eq: 'Na₂S + 4H₂O₂ → Na₂SO₄ + 4H₂O', a: 'H2O2', b: 'A:Na2S', prob: 0.2, toA: 'A:Na2SO4', toB: 'A:Na2SO4', dT: 25, note: '충분한 과산화수소는 황화 이온을 황산 이온까지 산화시킵니다.' },
    { id: 'ag_h2o2', name: '은 촉매와 과산화수소', reactants: ['H2O2'], products: ['H2O', 'O2'], a: 'H2O2', b: 'Ag:s', prob: 0.15, toA: [['water', 0.6], ['oxygen', 0.4]], dT: 8, note: '은 표면에서도 과산화수소가 분해되어 산소 거품이 납니다. 은은 줄어들지 않습니다.' },
    { id: 'kmno4_h2s', name: '과망가니즈산 이온과 황화수소', eq: '2KMnO₄ + 3H₂S → 2MnO₂↓ + 3S↓ + 2KOH + 2H₂O', a: 'A:KMnO4', b: 'H2S:g', prob: 0.25, toA: 'S:MnO2', toB: 'S:s', note: '보라색이 사라지고 갈색 이산화망가니즈와 노란 황이 생깁니다.' },
    { id: 'kmno4_so2', name: '과망가니즈산 이온과 이산화황', eq: '2KMnO₄ + 5SO₂ + 2H₂O → K₂SO₄ + 2MnSO₄ + 2H₂SO₄', a: 'A:KMnO4', b: 'SO2:g', prob: 0.3, toA: 'A:MnSO4', toB: 'A:MnSO4', note: '보라색이 거의 무색이 됩니다. 이산화황을 확인하는 방법입니다.' },
    { id: 'kmno4_ki', name: '과망가니즈산 이온과 아이오딘화 이온', eq: '2KMnO₄ + 6KI + 4H₂O → 2MnO₂ + 3I₂ + 8KOH', a: 'A:KMnO4', b: 'A:KI', prob: 0.25, toA: 'S:MnO2', toB: 'A:KI3', note: '아이오딘화 이온이 산화되어 갈색 아이오딘이 생깁니다.' },
    { id: 'kmno4_sulfide', name: '과망가니즈산 이온과 황화 이온', eq: '2KMnO₄ + 3Na₂S + 4H₂O → 2MnO₂ + 3S + 2KOH + 6NaOH', a: 'A:KMnO4', b: 'A:Na2S', prob: 0.25, toA: 'S:MnO2', toB: 'S:s', note: '황화 이온이 황으로 산화됩니다.' },
    { id: 'kmno4_alcohol', name: '과망가니즈산 이온과 메탄올', eq: 'CH₃OH → HCHO → HCOOH (산화)', a: 'A:KMnO4', b: 'CH3OH', prob: 0.03, toA: 'S:MnO2', toB: null, note: '알코올이 산화되면서 보라색이 갈색 앙금으로 바뀝니다. 느립니다.' },
    { id: 'kmno4_glycerol_aq', name: '과망가니즈산 이온과 글리세롤', eq: '글리세롤 → 산화 생성물 (MnO₄⁻ → MnO₂)', a: 'A:KMnO4', b: 'C3H8O3', prob: 0.04, toA: 'S:MnO2', toB: null, dT: 10, note: '용액에서는 천천히 보라색이 갈색으로 바뀝니다. 고체 과망가니즈산칼륨에 떨어뜨리면 열이 쌓여 불이 붙습니다.' },
    ...['glucose', 'A:sugar'].map((b) => ({ id: 'kmno4_sugar', name: '과망가니즈산 이온과 당', eq: 'MnO₄⁻(보라) → MnO₄²⁻(초록) → MnO₂(갈색)', a: 'A:KMnO4', b, prob: 0.02, toA: 'S:MnO2', toB: null, note: '당이 과망가니즈산 이온을 천천히 환원시킵니다. 염기성에서는 보라→초록→주황으로 바뀌는 "카멜레온 반응"이 됩니다.' })),
    ...[['Cl:g', 'Cl₂', 'A:acid:HCl', 'HCl', 'A:FeCl3', 'FeCl₃', 'A:NaCl', 'NaCl', 0.3], ['Br:l', 'Br₂', 'A:acid:HBr', 'HBr', 'A:FeBr3', 'FeBr₃', 'A:NaBr', 'NaBr', 0.2]].flatMap(([X, x2, acid, hx, fe, fex, na, nax, p]) => [
      { id: 'hal_so2:' + X, name: x2 + '와 이산화황', eq: `SO₂ + ${x2} + 2H₂O → H₂SO₄ + 2${hx}`, a: X, b: 'SO2:g', near: ['water'], prob: p, toA: acid, toB: 'A:acid:H2SO4aq', note: '물이 있으면 이산화황이 할로젠을 환원시키고 자신은 황산이 됩니다. 할로젠의 색이 사라집니다.' },
      { id: 'hal_fe2:' + X, name: x2 + '와 철(II) 이온', eq: `6FeSO₄ + 3${x2} → 2Fe₂(SO₄)₃ + 2${fex}`, a: X, b: 'A:FeSO4', prob: p, toA: fe, toB: 'A:Fe2(SO4)3', note: '연두색 철(II) 이온이 노란 갈색 철(III) 이온으로 산화됩니다.' },
      { id: 'hal_sulfite:' + X, name: x2 + '와 아황산 이온', eq: `Na₂SO₃ + ${x2} + H₂O → Na₂SO₄ + 2${hx}`, a: X, b: 'A:Na2SO3', prob: p, toA: acid, toB: 'A:Na2SO4', note: '아황산나트륨은 수돗물이나 실험실의 할로젠을 없애는 데 씁니다.' },
      { id: 'hal_sulfide:' + X, name: x2 + '와 황화 이온', eq: `Na₂S + ${x2} → 2${nax} + S↓`, a: X, b: 'A:Na2S', prob: p, toA: na, toB: 'S:s', note: '황화 이온이 산화되어 노란 황이 앙금으로 생깁니다.' },
    ]),
    { id: 'br_h2s', name: '브로민과 황화수소', eq: 'Br₂ + H₂S → 2HBr + S↓', a: 'Br:l', b: 'H2S:g', prob: 0.25, toA: 'A:acid:HBr', toB: 'S:s', note: '적갈색 브로민의 색이 사라지고 황이 생깁니다.' },
    { id: 'i_h2s', name: '아이오딘과 황화수소', eq: 'I₂ + H₂S → 2HI + S↓', a: 'I:s', b: 'H2S:g', prob: 0.1, toA: 'A:acid:HI', toB: 'S:s', note: '아이오딘도 황화수소를 산화시킬 수 있습니다.' },
    { id: 'i_sulfide', name: '아이오딘과 황화 이온', eq: 'Na₂S + I₂ → 2NaI + S↓', a: 'I:s', b: 'A:Na2S', prob: 0.1, toA: 'A:NaI', toB: 'S:s', note: '아이오딘의 갈색이 사라지고 황이 생깁니다.' },
    { id: 'i_so2', name: '아이오딘과 이산화황', eq: 'I₂ + SO₂ + 2H₂O → 2HI + H₂SO₄', a: 'I:s', b: 'SO2:g', near: ['water'], prob: 0.1, toA: 'A:acid:HI', toB: 'A:acid:H2SO4aq', note: '물속에서 아이오딘이 이산화황에 환원됩니다(수분 측정에 쓰는 칼 피셔 반응의 바탕).' },
    { id: 'i_so2', name: '아이오딘과 이산화황', eq: 'I₂ + SO₂ + 2H₂O → 2HI + H₂SO₄', a: 'A:KI3', b: 'SO2:g', prob: 0.25, toA: 'A:KI', toB: 'A:acid:H2SO4aq', note: '갈색 아이오딘 용액의 색이 사라집니다. 이산화황이 환원제로 작용합니다.' },
    { id: 'i_h2s', name: '아이오딘과 황화수소', eq: 'I₂ + H₂S → 2HI + S↓', a: 'A:KI3', b: 'H2S:g', prob: 0.2, toA: 'A:KI', toB: 'S:s', note: '갈색이 사라지고 뿌연 황이 생깁니다.' },
    { id: 'i_sulfite', name: '아이오딘과 아황산 이온', eq: 'Na₂SO₃ + I₂ + H₂O → Na₂SO₄ + 2HI', a: 'I:s', b: 'A:Na2SO3', prob: 0.1, toA: 'A:acid:HI', toB: 'A:Na2SO4', note: '아이오딘의 색이 사라집니다.' },
    { id: 'i_fe', name: '아이오딘과 철', reactants: ['Fe', 'I2'], products: ['FeI2'], a: 'Fe:s', b: 'I:s', minT: 100, prob: 0.03, toA: 'S:FeI2', toB: 'air', dT: 40, note: '아이오딘은 약한 할로젠이라 철(II)까지만 산화시킵니다.' },
    { id: 'h2_br2', name: '수소와 브로민', reactants: ['H2', 'Br2'], products: ['HBr'], a: 'H:g', b: 'Br:l', minT: 200, prob: 0.1, toA: 'HBrg:g', toB: 'HBrg:g', dT: 60, note: '염소보다 느리지만 가열하면 브로민화수소가 됩니다.' },
    { id: 'h2_br2', name: '수소와 브로민', reactants: ['H2', 'Br2'], products: ['HBr'], a: 'H:g', b: 'Br:g', minT: 200, prob: 0.1, toA: 'HBrg:g', toB: 'HBrg:g', dT: 60, note: '염소보다 느리지만 가열하면 브로민화수소가 됩니다.' },
    { id: 'h2_i2', name: '수소와 아이오딘(가역)', reactants: ['H2', 'I2'], products: ['HI'], a: 'H:g', b: 'I:g', minT: 300, prob: 0.04, toA: 'HIg:g', toB: 'HIg:g', note: '가열해도 일부만 반응하고 평형에 이릅니다. 화학 평형을 처음 연구한 반응입니다.' },
    { id: 'hi_decomp', name: '아이오딘화수소의 분해(가역)', reactants: ['HI'], products: ['H2', 'I2'], a: 'HIg:g', b: 'HIg:g', minT: 300, prob: 0.01, toA: 'H:g', toB: 'I:g', note: '반대 방향 반응도 함께 일어나 H₂ + I₂ ⇄ 2HI 평형이 됩니다.' },
    { id: 'o3_ki', name: '오존과 아이오딘화 이온', eq: 'O₃ + 2KI + H₂O → I₂ + 2KOH + O₂', a: 'O3:g', b: 'A:KI', prob: 0.3, toA: 'oxygen', toB: 'A:KI3', note: '오존을 확인하는 방법입니다. 아이오딘화칼륨 녹말 종이가 파랗게 변합니다.' },
    { id: 'o3_h2s', name: '오존과 황화수소', eq: 'H₂S + O₃ → S + O₂ + H₂O', a: 'O3:g', b: 'H2S:g', prob: 0.2, toA: 'oxygen', toB: 'S:s', note: '오존은 냄새를 없애는 데 쓰입니다.' },
    { id: 'o3_no', name: '오존과 일산화질소', eq: 'NO + O₃ → NO₂ + O₂', a: 'O3:g', b: 'NO:g', prob: 0.4, toA: 'oxygen', toB: 'NO2:g', note: '도시 대기에서 오존과 질소 산화물이 서로 바뀌는 반응입니다(광화학 스모그).' },
    { id: 'o3_ag', name: '오존과 은', eq: '2Ag + O₃ → Ag₂O + O₂', a: 'O3:g', b: 'Ag:s', prob: 0.03, toA: 'oxygen', toB: 'S:Ag2O', note: '산소와는 반응하지 않는 은도 오존에는 검게 변합니다.' },
    { id: 'naclo_ki', name: '차아염소산 이온과 아이오딘화 이온', eq: 'NaClO + 2KI + H₂O → NaCl + I₂ + 2KOH', a: 'A:NaClO', b: 'A:KI', prob: 0.3, toA: 'A:NaCl', toB: 'A:KI3', note: '표백제가 아이오딘화 이온을 갈색 아이오딘으로 산화시킵니다.' },
    { id: 'naclo_h2s', name: '표백제와 황화수소', eq: 'NaClO + H₂S → NaCl + S↓ + H₂O', a: 'A:NaClO', b: 'H2S:g', prob: 0.3, toA: 'A:NaCl', toB: 'S:s', note: '하수구 냄새를 표백제로 없애는 원리입니다.' },
    { id: 'naclo_so2', name: '표백제와 이산화황', eq: 'NaClO + SO₂ + H₂O → NaCl + H₂SO₄', a: 'A:NaClO', b: 'SO2:g', prob: 0.3, toA: 'A:NaCl', toB: 'A:acid:H2SO4aq', note: '이산화황이 산화되어 황산이 됩니다.' },
    { id: 'naclo_sulfite', name: '표백제와 아황산 이온(탈염소)', eq: 'NaClO + Na₂SO₃ → NaCl + Na₂SO₄', a: 'A:NaClO', b: 'A:Na2SO3', prob: 0.3, toA: 'A:NaCl', toB: 'A:Na2SO4', note: '정수장과 수족관에서 남은 염소를 없애는 방법입니다.' },
    { id: 'naclo_fe2', name: '표백제와 철(II) 이온', eq: '2FeSO₄ + NaClO + 5H₂O → 2Fe(OH)₃↓ + NaCl + 2H₂SO₄', a: 'A:NaClO', b: 'A:FeSO4', prob: 0.25, toA: 'A:NaCl', toB: 'S:Fe(OH)3', note: '연두색 용액에 적갈색 수산화철(III) 앙금이 생깁니다. 지하수의 철분을 없애는 원리입니다.' },
    { id: 'naclo_sulfide', name: '표백제와 황화 이온', eq: 'NaClO + Na₂S + H₂O → NaCl + S↓ + 2NaOH', a: 'A:NaClO', b: 'A:Na2S', prob: 0.25, toA: 'A:NaCl', toB: 'S:s', note: '황화 이온이 황으로 산화됩니다.' },
    ...['sugar', 'A:sugar'].map((b) => ({ id: 'hno3_sugar', name: '설탕의 질산 산화(옥살산 만들기)', eq: 'C₁₂H₂₂O₁₁ + 36HNO₃ → 6H₂C₂O₄ + 36NO₂ + 23H₂O', a: 'HNO3', b, minT: 60, prob: 0.05, toA: 'NO2:g', toB: 'A:acid:H2C2O4', dT: 20, note: '1776년 셸레가 옥살산을 처음 얻은 방법입니다. 갈색 이산화질소가 많이 나옵니다.' })),
    { id: 'hno3_glucose', name: '포도당의 질산 산화', eq: 'C₆H₁₂O₆ + 18HNO₃ → 3H₂C₂O₄ + 18NO₂ + 12H₂O', a: 'HNO3', b: 'glucose', minT: 60, prob: 0.05, toA: 'NO2:g', toB: 'A:acid:H2C2O4', dT: 20, note: '진한 질산이 당을 옥살산까지 산화시킵니다.' },
    ...[['HNO3', 'NO2', 'NO₂'], ['A:acid:HNO3aq', 'NO', 'NO']].flatMap(([acid, gas, gf]) => [
      { id: 'hno3_h2s', name: '질산과 황화수소', eq: gas === 'NO2' ? 'H₂S + 2HNO₃ → S + 2NO₂ + 2H₂O' : '3H₂S + 2HNO₃ → 3S + 2NO + 4H₂O', a: acid, b: 'H2S:g', prob: 0.2, toA: gas, toB: 'S:s', note: '질산은 산화제라 황화수소를 황으로 바꿉니다.' },
      { id: 'hno3_ki', name: '질산과 아이오딘화 이온', eq: gas === 'NO2' ? '2KI + 4HNO₃ → I₂ + 2KNO₃ + 2NO₂ + 2H₂O' : '6KI + 8HNO₃ → 3I₂ + 6KNO₃ + 2NO + 4H₂O', a: acid, b: 'A:KI', prob: 0.2, toA: gas, toB: 'A:KI3', note: '아이오딘화 이온이 갈색 아이오딘으로 산화됩니다.' },
      { id: 'hno3_fe2', name: '질산과 철(II) 이온', eq: '3FeSO₄ + 4HNO₃ → Fe₂(SO₄)₃ + Fe(NO₃)₃ + NO↑ + 2H₂O', a: acid, b: 'A:FeSO4', prob: 0.2, toA: 'NO', toB: 'A:Fe2(SO4)3', note: '철(II) 이온이 산화되며 일산화질소가 나옵니다. 질산 이온 검출(갈색 고리 반응)의 바탕입니다.' },
    ]),
    { id: 'hno3_so2', name: '질산과 이산화황', eq: 'SO₂ + 2HNO₃ → H₂SO₄ + 2NO₂', a: 'HNO3', b: 'SO2:g', prob: 0.2, toA: 'NO2:g', toB: 'A:acid:H2SO4aq', note: '옛날 황산 제조법(연실법)에서는 질소 산화물이 이산화황을 산화시켰습니다.' },
    { id: 'h2so4_h2s', name: '진한 황산과 황화수소', eq: 'H₂SO₄ + H₂S → S + SO₂ + 2H₂O', a: 'H2SO4', b: 'H2S:g', prob: 0.15, toA: 'SO2:g', toB: 'S:s', note: '진한 황산은 산화제라 황화수소를 말리는 데 쓸 수 없습니다.' },
    { id: 'h2so4_ki', name: '진한 황산과 아이오딘화 이온', eq: '8KI + 5H₂SO₄ → 4I₂ + H₂S + 4K₂SO₄ + 4H₂O', a: 'H2SO4', b: 'A:KI', prob: 0.15, toA: 'H2S:g', toB: 'A:KI3', dT: 30, note: '아이오딘화 이온은 환원력이 커서 진한 황산을 황화수소까지 환원시킵니다. 그래서 진한 황산으로 HI를 만들 수 없습니다.' },
    { id: 'sugar_h2so4', name: '포도당의 탈수', eq: 'C₆H₁₂O₆ → 6C + 6H₂O', a: 'glucose', b: 'H2SO4', prob: 0.08, toA: 'C:s', toB: 'steam', dT: 100, note: '진한 황산이 포도당에서도 물을 빼앗아 탄소가 남습니다.' },
    { id: 'dichromate_so2', name: '다이크로뮴산 이온과 이산화황', eq: 'K₂Cr₂O₇ + 3SO₂ + H₂SO₄ → K₂SO₄ + Cr₂(SO₄)₃ + H₂O', a: 'A:K2Cr2O7', b: 'SO2:g', prob: 0.25, toA: 'A:Cr2(SO4)3', toB: 'A:Cr2(SO4)3', note: '주황색이 초록색으로 바뀝니다. 이산화황을 확인하는 고전적인 방법입니다.' },
    { id: 'dichromate_h2s', name: '다이크로뮴산 이온과 황화수소', eq: 'K₂Cr₂O₇ + 3H₂S + 4H₂SO₄ → K₂SO₄ + Cr₂(SO₄)₃ + 3S + 7H₂O', a: 'A:K2Cr2O7', b: 'H2S:g', prob: 0.2, toA: 'A:Cr2(SO4)3', toB: 'S:s', note: '주황색이 초록색이 되고 황이 생깁니다.' },
    { id: 'dichromate_ki', name: '다이크로뮴산 이온과 아이오딘화 이온', eq: 'K₂Cr₂O₇ + 6KI + 7H₂SO₄ → 4K₂SO₄ + Cr₂(SO₄)₃ + 3I₂ + 7H₂O', a: 'A:K2Cr2O7', b: 'A:KI', near: ['A:acid:H2SO4aq', 'H2SO4'], prob: 0.25, toA: 'A:Cr2(SO4)3', toB: 'A:KI3', note: '산성에서 아이오딘이 생깁니다. 적정에 쓰입니다.' },
    { id: 'dichromate_sulfite', name: '다이크로뮴산 이온과 아황산 이온', eq: 'Cr₂O₇²⁻ + 3SO₃²⁻ + 8H⁺ → 2Cr³⁺ + 3SO₄²⁻ + 4H₂O', a: 'A:K2Cr2O7', b: 'A:Na2SO3', near: ['A:acid:H2SO4aq', 'H2SO4', 'hcl'], prob: 0.25, toA: 'A:Cr2(SO4)3', toB: 'A:Na2SO4', note: '독성이 큰 6가 크로뮴을 3가로 바꾸는 폐수 처리 방법입니다.' },
    { id: 'breathalyzer_meoh', name: '다이크로뮴산 이온과 메탄올', eq: '2Cr₂O₇²⁻ + 3CH₃OH + 16H⁺ → 4Cr³⁺ + 3HCOOH + 11H₂O', a: 'A:K2Cr2O7', b: 'CH3OH', near: ['A:acid:H2SO4aq', 'H2SO4'], prob: 0.15, toA: 'A:Cr2(SO4)3', toB: null, note: '에탄올처럼 메탄올도 주황색을 초록색으로 바꿉니다.' },
    // ---- 플루오린: 거의 모든 것을 태운다 ----
    ...['wood', 'C:s', 'sugar', 'oil', 'sawdust', 'plastic', 'C2H5OH', 'CH3OH', 'C3H8O3', 'glucose', 'S:s', 'H2S:g', 'leaf', 'flour'].map((b) => ({ id: 'f2_burn', name: '플루오린 속에서 타기', eq: '연료 + F₂ → CF₄ + HF (+ SF₆)', a: 'F:g', b, prob: 0.4, toA: 'HFg:g', toB: 'fire:clean', T: 1500, note: '플루오린은 산소보다 강한 산화제라 나무·탄소·물까지 불꽃을 내며 태웁니다. 가장 반응성이 큰 원소입니다.' })),
    ...[['Cl:g', '2P + 3Cl₂ → 2PCl₃', 0.4], ['Br:l', '2P + 3Br₂ → 2PBr₃', 0.2], ['F:g', '2P + 5F₂ → 2PF₅', 0.6]].map(([X, eq, p]) => ({ id: 'p_halogen', name: '인과 할로젠', eq, a: 'P:s', b: X, prob: p, toA: 'fire:clean', toB: 'smoke:white', T: 900, note: '인은 염소·브로민 속에서 저절로 불이 붙어 흰 연기(할로젠화 인)를 냅니다.' })),
    // ---- 기체 ----
    ...[['HBrg:g', 'S:NH4Br', 'HBr'], ['HIg:g', 'S:NH4I', 'HI'], ['HFg:g', 'S:NH4F', 'HF']].map(([b, prod, hx]) => ({ id: 'nh3_' + hx.toLowerCase(), name: '암모니아와 ' + hx, reactants: ['NH3', hx], products: [prod.slice(2)], a: 'NH3', b, prob: 0.6, toA: prod, toB: 'air', dT: 20, note: '염화수소처럼 흰 연기 같은 고체 암모늄염이 생깁니다.' })),
    { id: 'nh3_h2so4', name: '암모니아와 황산(황산암모늄 비료)', reactants: ['NH3', 'H2SO4'], products: ['(NH4)2SO4'], a: 'NH3', b: 'H2SO4', prob: 0.4, toA: 'S:(NH4)2SO4', toB: 'S:(NH4)2SO4', dT: 60, note: '가장 흔한 질소 비료인 황산암모늄을 만드는 반응입니다.' },
    { id: 'nh3_hno3', name: '암모니아와 질산(질산암모늄 비료)', reactants: ['NH3', 'HNO3'], products: ['NH4NO3'], a: 'NH3', b: 'HNO3', prob: 0.4, toA: 'S:NH4NO3', toB: 'S:NH4NO3', dT: 60, note: '질산암모늄 비료를 만드는 반응입니다. 질산암모늄은 뜨겁게 하면 위험하므로 보관을 조심합니다.' },
    ...['NO2:g', 'NO2:l'].map((a) => ({ id: 'no2_water', name: '이산화질소와 물(산성비)', reactants: ['NO2', 'H2O'], products: ['HNO3', 'NO'], a, b: 'water', prob: 0.2, toA: 'NO', toB: 'A:acid:HNO3aq', note: '이산화질소가 물에 녹아 질산이 됩니다. 산성비와 질산 공업(오스트발트 공정의 마지막 단계)의 반응입니다.' })),
    // ---- 첨가 반응(촉매) ----
    { id: 'hydrogenation', name: '에틸렌의 수소 첨가', reactants: ['C2H4', 'H2'], products: ['C2H6'], a: 'C2H4:g', b: 'hydrogen', near: ['Ni:s', 'Pt:s', 'Pd:s'], minT: 100, prob: 0.2, toA: 'C2H6:g', toB: 'air', dT: 40, note: '니켈·백금 촉매 위에서 이중 결합에 수소가 붙습니다. 식물성 기름을 굳혀 마가린을 만드는 원리입니다.' },
    { id: 'hydrogenation2', name: '아세틸렌의 수소 첨가', reactants: ['C2H2', 'H2'], products: ['C2H4'], a: 'C2H2:g', b: 'hydrogen', near: ['Ni:s', 'Pt:s', 'Pd:s'], minT: 100, prob: 0.2, toA: 'C2H4:g', toB: 'air', dT: 50, note: '삼중 결합에 수소가 붙어 에틸렌이 됩니다.' },
    { id: 'margarine', name: '기름의 수소 첨가(경화유)', eq: '불포화 지방 + H₂ → 포화 지방', a: 'oil', b: 'hydrogen', near: ['Ni:s'], minT: 120, prob: 0.05, toA: 'fat', toB: 'air', note: '니켈 촉매로 액체 기름에 수소를 붙이면 굳은 기름(마가린·쇼트닝)이 됩니다.' },
    // ---- 유기물 ----
    { id: 'k_ethanol', name: '칼륨과 에탄올', reactants: ['K', 'C2H5OH'], products: ['C2H5OK', 'H2'], a: 'K:s', b: 'C2H5OH', prob: 0.08, toA: 'ethoxide', toB: 'hydrogen', dT: 50, note: '나트륨보다 빠르게 수소 거품을 냅니다. 물보다는 순합니다.' },
    { id: 'li_ethanol', name: '리튬과 에탄올', reactants: ['Li', 'C2H5OH'], products: ['C2H5OLi', 'H2'], a: 'Li:s', b: 'C2H5OH', prob: 0.01, toA: 'ethoxide', toB: 'hydrogen', dT: 15, note: '아주 천천히 수소가 나옵니다.' },
    ...['naoh', 'A:KOH'].map((b) => ({ id: 'oleic_base', name: '지방산과 염기(비누)', eq: 'C₁₇H₃₃COOH + NaOH → C₁₇H₃₃COONa + H₂O', a: 'oleic', b, prob: 0.2, toA: 'soap', toB: 'soap', dT: 10, note: '지방산은 염기와 바로 중화되어 비누가 됩니다.' })),
    ...['oil', 'fat'].map((a) => ({ id: 'soft_soap', name: '물비누 만들기(칼륨 비누)', eq: '지방 + 3KOH → 칼륨 비누 + 글리세롤', a, b: 'A:KOH', minT: 40, prob: 0.05, toA: 'soap', toB: 'C3H8O3', dT: 10, note: '수산화칼륨으로 만든 비누는 부드러워 물비누가 됩니다.' })),
    ...[['HNO3', '질산'], ['A:CuSO4', '황산구리(중금속)'], ['C2H5OH', '에탄올']].map(([b, n]) => ({ id: 'milk_denature', name: '우유 단백질의 변성(' + n + ')', kind: 'chemical', eq: '카제인 → 엉긴 단백질', a: 'milk', b, prob: 0.1, toA: 'curd', toB: 'whey', note: '산·중금속 이온·알코올은 단백질의 모양을 바꿔 엉기게 합니다. 중금속을 먹었을 때 우유를 마시게 하는 이유입니다.' })),
    // ---- 합금 ----
    { id: 'dezinc', name: '황동의 탈아연', eq: 'Zn(황동 속) + 2HCl → ZnCl₂ + H₂↑', a: 'brass:s', b: 'hcl', prob: 0.03, toA: [['brass:s', 0.85], ['Cu:s', 0.15]], toB: [['A:ZnCl2', 0.6], ['hydrogen', 0.4]], dT: 10, note: '황동 속 아연만 녹아 나오고 구리가 붉게 남습니다. 오래된 수도관이 약해지는 원인입니다.' },
    { id: 'bronze_hcl', name: '청동과 염산', eq: 'Sn(청동 속) + 2HCl → SnCl₂ + H₂↑', a: 'bronze:s', b: 'hcl', prob: 0.01, toA: [['bronze:s', 0.85], ['Cu:s', 0.15]], toB: [['A:SnCl2', 0.6], ['hydrogen', 0.4]], note: '주석만 천천히 녹습니다. 청동은 구리보다 잘 녹슬지 않아 동상과 종에 씁니다.' },
    { id: 'solder_hcl', name: '땜납과 염산', eq: 'Sn(땜납 속) + 2HCl → SnCl₂ + H₂↑', a: 'solder:s', b: 'hcl', prob: 0.015, toA: [['solder:s', 0.85], ['Pb:s', 0.15]], toB: [['A:SnCl2', 0.6], ['hydrogen', 0.4]], note: '주석이 녹아 나오고 납이 남습니다.' },
    ...[['brass:s', 'A:Cu(NO3)2', '황동'], ['bronze:s', 'A:Cu(NO3)2', '청동'], ['solder:s', 'A:Pb(NO3)2', '땜납'], ['amalgam', 'A:Hg(NO3)2', '아말감']].map(([a, salt, n]) => ({ id: 'alloy_hno3', name: n + '과 질산', eq: '합금 속 금속 + 4HNO₃ → M(NO₃)₂ + 2NO₂ + 2H₂O', a, b: 'HNO3', prob: 0.15, toA: salt, toB: 'NO2:g', dT: 40, note: '질산은 합금 속 금속을 모두 녹여 갈색 이산화질소를 냅니다.' })),
    { id: 'brass_cu', name: '황동과 황산구리 용액', eq: 'Zn(황동 속) + CuSO₄ → ZnSO₄ + Cu', a: 'brass:s', b: 'A:CuSO4', prob: 0.04, toA: [['brass:s', 0.8], ['Cu:s', 0.2]], toB: 'A:ZnSO4', note: '황동 속 아연이 구리 이온을 밀어내 표면에 구리가 석출됩니다.' },
    { id: 'solder_cu', name: '땜납과 황산구리 용액', eq: 'Sn(땜납 속) + CuSO₄ → SnSO₄ + Cu', a: 'solder:s', b: 'A:CuSO4', prob: 0.03, toA: [['solder:s', 0.8], ['Cu:s', 0.2]], toB: 'A:SnSO4', note: '주석이 구리 이온을 밀어냅니다.' },
    // ---- 암석·기타 ----
    ...['cement', 'concrete'].map((a) => ({ id: 'concrete_acid', name: '콘크리트와 산', eq: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑, Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O', a, b: 'hcl', prob: 0.03, toA: [[a, 0.8], ['A:CaCl2', 0.2]], toB: [['A:CaCl2', 0.7], ['CO2', 0.3]], note: '콘크리트 속 수산화칼슘·탄산칼슘이 산에 녹습니다. 산성비가 건물을 깎는 원리입니다.' })),
    { id: 'hf_glass', name: '플루오린화수소산과 유리', reactants: ['SiO2', 'HF'], products: ['SiF4', 'H2O'], a: 'glassshards', b: 'A:acid:HF', prob: 0.05, toA: 'air', toB: 'water', note: '유리 조각도 플루오린화수소산에 녹습니다.' },
    ...['S:s', 'S:l', 'S:l:dark'].map((a) => ({ id: 's_burn', name: '황의 연소', reactants: ['S', 'O2'], products: ['SO2'], a, b: 'fire', near: OX, prob: 0.15, toA: 'fire:S', toB: 'SO2', T: 1000, note: '불꽃이 닿은 황은 파란 불꽃을 내며 타고 자극적인 이산화황이 생깁니다.' })),
    { id: 'pd_hno3', name: '팔라듐과 진한 질산', eq: 'Pd + 4HNO₃ → Pd(NO₃)₂ + 2NO₂ + 2H₂O', a: 'Pd:s', b: 'HNO3', prob: 0.02, toA: 'A:Pd(NO3)2', toB: 'NO2:g', note: '백금족 금속 가운데 팔라듐만 진한 질산에 천천히 녹습니다.' },
    { id: 'pd_aqua', name: '팔라듐과 왕수', eq: '3Pd + 2HNO₃ + 12HCl → 3H₂PdCl₄ + 2NO + 4H₂O', a: 'Pd:s', b: 'aquaregia', prob: 0.05, toA: 'A:PdCl2', toB: 'NO2', note: '팔라듐은 왕수에 금보다 쉽게 녹습니다.' },
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
      this.loose = new Uint8Array(size); // 고정하지 않고 놓은 고체 칸. 이어진 칸끼리 한 덩어리로 떨어지고 뜬다.
      this.rlab = new Uint32Array(size); this.rgen = 0; this.looseN = 0;
      this.bmask = new Uint8Array(size); this.bcells = []; // 공이 차지한 칸(액체가 들어오지 못함)
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
      this.bodies = []; this.selected = null; this.probe = null; this.nextBodyId = 1; this.valves = [];
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
      this.loose[i] = 0;
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
      t = this.loose[i]; this.loose[i] = this.loose[j]; this.loose[j] = t;
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
        if (!anchored && s === SOLID && m !== this.AIR) { this.loose[i] = 1; this.looseN++; }
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
      this.stepRigid();
      this.stepFlyers();
      this.stepHeat();
      this.stepNuclear();
      this.stepElectro();
      if (this.tick % 20 === 0 || this.pressureSoon) { this.pressureSoon = false; this.stepPressure(); }
      this.stepCells();
      this.stepBodies();
      this.record();
    }

    stepMotion() {
      const { w, h, mat, T } = this, air = this.AIR, st = this.data.state;
      const flip = this.tick & 1;
      for (let y = h - 1; y >= 0; y--) {
        for (let k = 0; k < w; k++) {
          const x = flip ? k : w - 1 - k;
          const i = y * w + x;
          if (this.stamp[i] === this.tick) continue;
          const m = this.mat[i];
          // 가장 흔한 경우(공기 위에 같은 온도의 공기)는 바로 건너뛴다.
          if (m === air && (y + 1 >= h || (mat[i + w] === air && T[i + w] - T[i] <= 2))) continue;
          const s = st[m];
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
      if (sj === SOLID || this.anchor[j] || this.bmask[j]) return 0;
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
          if (this.mat[ni] === this.mat[i] || ms === SOLID || ms === POWDER || this.bmask[ni] || this.effRho(i) <= this.effRho(ni)) break;
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

    // ---- 고체 덩어리 ----
    // 고정하지 않고 놓은 고체는 이어진 칸끼리 한 덩어리(강체)로 움직인다. 받침이 없으면 떨어지고,
    // 액체 속에서는 무게와 부력(잠긴 부분이 밀어낸 액체의 무게, 아르키메데스)을 비교해 가라앉거나 떠오른다.
    stepRigid() {
      if (!this.looseN) return;
      const { w, loose } = this, lab = this.rlab;
      if (this.rgen > 0xfff00000) { lab.fill(0); this.rgen = 0; }
      const start = this.rgen + 1; // 이번 틱에 붙인 덩어리 번호는 모두 start 이상
      let found = 0;
      const stack = [];
      for (let s0 = 0; s0 < loose.length; s0++) {
        if (!loose[s0] || lab[s0] >= start) continue;
        const gen = ++this.rgen;
        const cells = [s0]; lab[s0] = gen; stack.length = 0; stack.push(s0);
        while (stack.length) {
          const i = stack.pop(), x = i % w;
          if (x > 0 && loose[i - 1] && lab[i - 1] < start) { lab[i - 1] = gen; stack.push(i - 1); cells.push(i - 1); }
          if (x < w - 1 && loose[i + 1] && lab[i + 1] < start) { lab[i + 1] = gen; stack.push(i + 1); cells.push(i + 1); }
          if (i >= w && loose[i - w] && lab[i - w] < start) { lab[i - w] = gen; stack.push(i - w); cells.push(i - w); }
          if (i + w < loose.length && loose[i + w] && lab[i + w] < start) { lab[i + w] = gen; stack.push(i + w); cells.push(i + w); }
        }
        found += cells.length;
        this.moveBody(cells, gen);
      }
      this.looseN = found;
    }
    // 피스톤이 한 칸 움직인 뒤: 판을 통과한 기체를 바로잡아 위·아래 공간의 기체가 섞이지 않게 한다.
    // 올라가면 아래 공간에 빈 칸(기체량 0에 가까움)이 생기고, 내려가면 아래 기체가 남은 공간에 눌려 담긴다.
    pistonSeal(cells, dir) {
      const { w, mat, gas } = this, st = this.data.state, cols = new Map();
      for (const i of cells) {
        const x = i % w, y = (i / w) | 0, c = cols.get(x);
        if (!c) cols.set(x, { top: y, bot: y }); else { if (y < c.top) c.top = y; if (y > c.bot) c.bot = y; }
      }
      for (const [x, c] of cols) {
        const below = (c.bot + 1) * w + x, below2 = below + w, above = (c.top - 1) * w + x, above2 = above - w;
        if (dir < 0) { // 올라감: 위에서 내려온 기체 칸 → 아래 공간의 빈 칸
          if (below < mat.length && st[mat[below]] === GAS) {
            if (below2 < mat.length && st[mat[below2]] === GAS) mat[below] = mat[below2];
            gas[below] = 0.0005;
          }
        } else { // 내려감: 아래에서 올라온 기체 칸의 기체량을 아래 공간에 돌려준다
          if (above >= 0 && st[mat[above]] === GAS) {
            const n = gas[above] || 1;
            if (below < mat.length && st[mat[below]] === GAS) gas[below] = Math.min(80, (gas[below] || 1) + n);
            if (above2 >= 0 && st[mat[above2]] === GAS) mat[above] = mat[above2];
            gas[above] = 1;
          }
        }
      }
    }

    // 빠르게 떨어지던 덩어리가 단단한 바닥에 부딪힘. 약 30 cm 넘게 떨어진 유리·돌은 깨진다.
    impact(cells, vy) {
      if (vy < 4.5) return;
      const d = this.data, mat = this.mat;
      let broke = 0;
      for (const i of cells) if (this.loose[i] && d.shatter[mat[i]] >= 0 && Math.random() < Math.min(0.9, (vy - 4) * 0.25)) { this.setCell(i, d.shatter[mat[i]], this.T[i]); broke++; }
      if (broke && this.fx.length < 200) { const c = cells[(cells.length / 2) | 0]; this.fx.push({ type: 'spark', x: c % this.w, y: (c / this.w) | 0, hot: 0, dust: true }); }
      if (broke) this.note('shatter_fall', () => ({ type: 'reaction', id: 'shatter_fall', name: '떨어져 깨짐', kind: 'physical', eq: '운동 에너지 ½mv² → 부서짐', note: '높은 곳에서 떨어진 유리·돌은 바닥에 부딪힐 때 짧은 순간 큰 힘을 받아 조각납니다. 높이 떨어질수록(속도가 빠를수록) 잘 깨집니다.' }));
    }
    moveBody(cells, gen) {
      const w = this.w, h = this.h, mat = this.mat, lab = this.rlab;
      const d = this.data, st = d.state;
      const inBody = (j) => lab[j] === gen && this.loose[j];
      // 무게와 부력. 한 줄(같은 y)의 양 끝 옆이 액체이면 그 줄은 잠긴 것으로 본다(위로 넘친 물은 세지 않음).
      let W = 0, B = 0, wet = 0, canDown = true, canUp = true, vy = 0;
      const rows = new Map();
      for (const i of cells) {
        const x = i % w, y = (i / w) | 0, m = mat[i];
        W += d.rho[m]; vy += this.vy[i];
        let r = rows.get(y);
        if (!r) { r = { n: 0, lo: x, hi: x, liq: 0, rho: 0 }; rows.set(y, r); }
        r.n++; if (x < r.lo) r.lo = x; if (x > r.hi) r.hi = x;
        if (y + 1 >= h) canDown = false;
        else if (!inBody(i + w)) {
          const b = mat[i + w], sb = st[b];
          if (sb === SOLID || sb === POWDER || this.anchor[i + w]) canDown = false;
          else if (sb === LIQUID && !r.liq) { r.liq = 1; r.rho = this.effRho(i + w); }
        }
        if (y === 0) canUp = false;
        else if (!inBody(i - w)) {
          const a = mat[i - w], sa = st[a];
          if (sa === SOLID || sa === POWDER || this.anchor[i - w]) canUp = false;
        }
      }
      for (const [y, r] of rows) {
        for (const x of [r.lo - 1, r.hi + 1]) {
          if (x < 0 || x >= w) continue;
          const j = y * w + x;
          if (st[mat[j]] === LIQUID && !inBody(j)) { r.liq = 2; r.rho = this.effRho(j); }
        }
        if (r.liq === 2) { B += r.n * r.rho; wet += r.n; }
      }
      vy /= cells.length;
      const gC = this.g * this.dt * this.dt / this.dx;
      let dir = 0, steps = 0;
      // 피스톤: 아래·위 기체의 압력 차가 피스톤의 무게(단위 넓이당)를 이기면 천천히 움직인다.
      // 데우면 위로 밀려 올라가고(샤를 법칙), 위에 무게를 더하면 내려간다(보일 법칙).
      const pis = d.idOf.piston;
      const isPiston = pis != null && mat[cells[0]] === pis;
      if (isPiston && !this.pRegions) { this.pressureSoon = true; vy = 0; } // 압력을 먼저 구한 뒤 움직인다
      else if (isPiston) {
        let Pb = 0, nb = 0, Pa = 0, na = 0;
        const cols = new Set();
        for (const i of cells) {
          cols.add(i % w);
          const dn = i + w, up = i - w;
          if (dn < mat.length && !inBody(dn) && st[mat[dn]] === GAS) { Pb += this.regionP(dn); nb++; }
          if (up >= 0 && !inBody(up) && st[mat[up]] === GAS) { Pa += this.regionP(up); na++; }
        }
        const pb = nb ? Pb / nb : null, pa = na ? Pa / na : 1;
        const weightP = W * this.dx * this.g / cols.size / 101325; // 기압 단위
        const net = pb == null ? -1 : pb - pa - weightP;
        if (net > 0.01 && canUp) { dir = -1; steps = Math.random() < Math.min(1, net * 4) ? 1 : 0; }
        else if (net < -0.01 && canDown && pb != null) { dir = 1; steps = Math.random() < Math.min(1, -net * 4) ? 1 : 0; }
        else if (pb == null && canDown) { dir = 1; steps = 1; } // 아래가 액체·빈칸이 아니면 그냥 떨어짐
        if (steps) this.pressureSoon = true;
        this.note('free_piston', () => ({ type: 'reaction', id: 'free_piston', name: '움직이는 피스톤', kind: 'physical', eq: 'P(아래) = P(위) + 피스톤 무게 ÷ 넓이', note: '피스톤은 아래 기체가 미는 힘과 위에서 누르는 힘(대기압 + 무게)이 같아지는 곳에서 멈춥니다. 아래 기체를 데우면 부피가 늘어 피스톤이 올라갑니다(샤를 법칙).' }));
      } else if (W > B && canDown) {
        if (!wet) { vy = Math.min(MAX_FALL, Math.max(0, vy) + gC); steps = Math.floor(vy); if (Math.random() < vy - steps) steps++; }
        else { vy = 0; steps = Math.random() < 0.6 * (W - B) / W ? 1 : 0; } // 액체 속에서는 끌림 때문에 천천히
        dir = 1;
      } else if (B > W * 1.03 && canUp && wet) {
        vy = 0; dir = -1; steps = Math.random() < 0.6 * (B - W) / B ? 1 : 0; // 떠오름
      } else {
        if (!wet) this.impact(cells, vy);
        vy = 0;
      }
      if (dir && steps) {
        for (let s = 0; s < steps; s++) {
          if (s > 0) { // 여러 칸을 갈 때는 칸마다 다시 확인한다.
            let ok = true;
            let hard = false; // 단단한 것에 부딪혔는지, 액체 면에 닿았는지
            for (const i of cells) {
              const j = i + w;
              if (j >= mat.length) { ok = false; hard = true; break; }
              if (inBody(j)) continue;
              const sj = st[mat[j]];
              if (sj === SOLID || sj === POWDER || this.anchor[j]) { ok = false; hard = true; break; }
              if (sj === LIQUID) ok = false;
            }
            if (!ok) { if (hard && !wet) this.impact(cells, vy); else if (!hard) vy = Math.min(vy, 2); break; }
          }
          cells.sort(dir > 0 ? (a, b) => b - a : (a, b) => a - b);
          const splash = dir > 0 && vy >= 3;
          for (let k = 0; k < cells.length; k++) {
            const i = cells[k], j = i + dir * w;
            if (splash && st[mat[j]] === LIQUID && j >= w && Math.random() < 0.3) this.launch(j, (Math.random() - 0.5) * vy, -vy * 0.5);
            this.swap(i, j); lab[j] = gen; cells[k] = j;
          }
          for (const i of cells) lab[i] = gen;
          if (isPiston) this.pistonSeal(cells, dir);
        }
        if (dir > 0 && steps) this.note('rigid_fall', () => ({ type: 'reaction', id: 'rigid_fall', name: '덩어리의 낙하와 부력', kind: 'physical', eq: '무게 > 부력 → 가라앉음, 무게 < 부력 → 뜸', note: '받침이 없는 고체는 한 덩어리로 떨어집니다. 액체에 잠기면 밀어낸 액체의 무게만큼 떠받쳐져(아르키메데스), 물보다 가벼운 나무는 뜨고 돌·유리는 가라앉습니다.' }));
      }
      for (const i of cells) this.vy[i] = vy;
      // 움직인 칸의 표시를 지운다(다음 덩어리 탐색이 섞이지 않도록 lab은 세대 번호로 관리).
      for (const i of cells) lab[i] = gen;
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
          if (st[mat[j]] !== GAS || this.anchor[j] || this.bmask[j]) { landed = true; break; }
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

    // ---- 채우기 도구 ----
    // 누른 칸과 같은 물질(보통 공기)로 이어진 칸 가운데 누른 높이보다 아래(같은 높이 포함)만 m으로 채운다.
    // 그릇 안을 누르면 그 높이까지 액체가 찬다. 열린 곳이라 너무 넓으면 채우지 않고 0을 돌려준다.
    fillLevel(cx, cy, m, limit) {
      if (!this.inside(cx, cy)) return 0;
      const { w, mat } = this, start = this.index(cx, cy), from = mat[start];
      if (from === m) return 0;
      const max = limit || 6000, seen = new Uint8Array(mat.length), list = [start], stack = [start];
      seen[start] = 1;
      while (stack.length) {
        const i = stack.pop(), x = i % w, y = (i / w) | 0;
        const nb = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > cy ? i - w : -1, i + w < mat.length ? i + w : -1];
        for (const j of nb) {
          if (j < 0 || seen[j] || mat[j] !== from || this.anchor[j] && this.data.state[from] !== GAS) continue;
          seen[j] = 1; list.push(j); stack.push(j);
          if (list.length > max) return 0;
        }
      }
      const s = this.data.state[m];
      for (const i of list) { this.setCell(i, m, this.data.t0[m]); if (s === GAS) this.gas[i] = 1; }
      return list.length;
    }

    // ---- 그릇 도구 ----
    // 두 점을 모서리로 하는 U자 모양 그릇(바닥과 양쪽 벽, 두께 2칸)을 고정된 칸으로 만든다.
    vessel(x0, y0, x1, y1, id, closed) {
      const m = this.data.idOf[id || 'glass'];
      const l = Math.max(0, Math.min(x0, x1)), r = Math.min(this.w - 1, Math.max(x0, x1));
      const t = Math.max(0, Math.min(y0, y1)), b = Math.min(this.h - 1, Math.max(y0, y1));
      if (r - l < 6 || b - t < 4) return false;
      const put = (x, y) => { const i = this.index(x, y); this.setCell(i, m, this.data.t0[m]); this.anchor[i] = 1; };
      for (let y = t; y <= b; y++) { put(l, y); put(l + 1, y); put(r, y); put(r - 1, y); }
      for (let x = l; x <= r; x++) { put(x, b); put(x, b - 1); if (closed) { put(x, t); put(x, t + 1); } }
      if (closed) { // 안쪽은 1기압 공기로 새로 채운다(밀폐한 순간의 압력).
        for (let y = t + 2; y < b - 1; y++) for (let x = l + 2; x < r - 1; x++) { const i = this.index(x, y); if (this.data.state[this.mat[i]] === GAS) this.gas[i] = 1; }
        this.pressureSoon = true;
      }
      return true;
    }


    // ---- 압력 도구 ----
    // 펌프: 누른 곳이 속한 닫힌 공간 전체의 기체량을 f배로 바꾼다(펌프를 용기에 꽂은 것처럼). 열린 공간이면 아무 일도 없다.
    // 닫힌 공간이 아직 계산되지 않았으면 붓 안의 기체 칸만 바꾼다.
    pumpGas(cx, cy, r, f) {
      const st = this.data.state, defs = this.data.defs, gas = this.gas, mat = this.mat;
      // 누른 칸이 속한 공간을 먼저 쓰고, 누른 칸이 벽이면 붓 안에서 가장 가까운 기체 칸의 공간을 쓴다.
      let id = 0, best = Infinity;
      this.forDisc(cx, cy, r, (i) => {
        if (st[mat[i]] !== GAS || !this.plab || !this.plab[i]) return;
        const dd = (i % this.w - cx) ** 2 + (((i / this.w) | 0) - cy) ** 2;
        if (dd < best) { best = dd; id = this.plab[i]; }
      });
      const reg = id && this.pRegions ? this.pRegions[id] : null;
      if (reg && reg.open) return 0;
      let n = 0;
      if (reg) {
        for (let i = 0; i < mat.length; i++) if (this.plab[i] === id && st[mat[i]] === GAS && !defs[mat[i]].flame) { gas[i] = Math.max(0.0005, Math.min(80, (gas[i] || 1) * f)); n++; }
      } else {
        this.forDisc(cx, cy, r, (i) => { if (st[mat[i]] === GAS && !defs[mat[i]].flame) { gas[i] = Math.max(0.0005, Math.min(80, (gas[i] || 1) * f)); n++; } });
      }
      if (n) this.pressureSoon = true;
      return n;
    }
    // 피스톤 밀기: 붓 안의 기체 칸을 피스톤 판으로 바꾸고, 그 칸들의 기체량은 둘레의 같은 공간 기체 칸에 나눠 준다.
    // 기체량(n)은 그대로이고 부피(V)만 줄어 압력이 오른다(보일 법칙 PV = 일정).
    pistonPush(cx, cy, r) {
      const { w, mat, gas } = this, st = this.data.state, defs = this.data.defs, pis = this.data.idOf.piston;
      let nSum = 0;
      const taken = [];
      this.forDisc(cx, cy, r, (i) => {
        if (st[mat[i]] !== GAS || this.anchor[i]) return;
        nSum += gas[i] || 1; taken.push(i);
      });
      if (!taken.length) return 0;
      const T0 = this.T[taken[0]];
      for (const i of taken) { this.setCell(i, pis, T0); this.anchor[i] = 1; }
      // 둘레에서 가까운 기체 칸부터 찾아 나눠 담는다.
      const seen = new Set(taken), q = taken.slice(), got = [];
      for (let k = 0; k < q.length && got.length < 400; k++) {
        const i = q[k], x = i % w;
        for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
          if (j < 0 || j >= mat.length || seen.has(j)) continue;
          seen.add(j);
          if (st[mat[j]] === GAS && !defs[mat[j]].flame) { got.push(j); q.push(j); }
        }
      }
      if (got.length) for (const j of got) gas[j] = Math.min(80, (gas[j] || 1) + nSum / got.length);
      this.pressureSoon = true;
      return taken.length;
    }
    // 피스톤 빼기: 붓 안의 피스톤 판을 거의 빈(기체량 0에 가까운) 칸으로 바꾼다. 기체량은 그대로, 부피만 늘어 압력이 내려간다.
    pistonPull(cx, cy, r) {
      const { w, mat } = this, st = this.data.state, defs = this.data.defs, pis = this.data.idOf.piston;
      let n = 0;
      this.forDisc(cx, cy, r, (i) => {
        if (mat[i] !== pis) return;
        const x = i % w;
        let g = this.AIR;
        for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) if (j >= 0 && j < mat.length && st[mat[j]] === GAS && !defs[mat[j]].flame) { g = mat[j]; break; }
        this.setCell(i, g, this.T[i]);
        this.gas[i] = 0.002;
        n++;
      });
      if (n) this.pressureSoon = true;
      return n;
    }

    // ---- 켜기·끄기 도구 (스위치, 밸브) ----
    // 누른 칸과 이어진 스위치는 켜짐↔꺼짐을 바꾸고, 밸브는 열어(빈칸) 자리를 기억해 두었다가 다시 누르면 닫는다.
    toggleDevice(cx, cy) {
      if (!this.inside(cx, cy)) return null;
      const { w, mat } = this, d = this.data, start = this.index(cx, cy);
      const on = d.idOf['switch:on'], off = d.idOf['switch:off'], valve = d.idOf.valve;
      const group = (i0, test) => {
        const out = [i0], seen = new Set(out);
        for (let k = 0; k < out.length; k++) {
          const i = out[k], x = i % w;
          for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) if (j >= 0 && j < mat.length && !seen.has(j) && test(j)) { seen.add(j); out.push(j); }
        }
        return out;
      };
      const m = mat[start];
      if (m === on || m === off) {
        const cells = group(start, (j) => mat[j] === on || mat[j] === off), to = m === on ? off : on;
        for (const i of cells) { const T = this.T[i]; this.setCell(i, to, T); this.anchor[i] = 1; }
        this.role = null; this.lit = null; // 회로를 다시 찾는다
        return to === on ? 'switch-on' : 'switch-off';
      }
      if (m === valve) {
        const cells = group(start, (j) => mat[j] === valve);
        for (const i of cells) { this.setCell(i, this.AIR, this.T[i]); this.gas[i] = 1; }
        this.valves.push({ cells, x: cx, y: cy });
        this.pressureSoon = true;
        return 'valve-open';
      }
      // 열린 밸브 자리를 누르면 닫는다(누른 곳에서 2칸 안).
      const k = this.valves.findIndex((v) => v.cells.some((i) => Math.abs(i % w - cx) <= 2 && Math.abs(((i / w) | 0) - cy) <= 2));
      if (k >= 0) {
        for (const i of this.valves[k].cells) { this.setCell(i, valve, this.T[i]); this.anchor[i] = 1; }
        this.valves.splice(k, 1);
        this.pressureSoon = true;
        return 'valve-close';
      }
      return null;
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
      const { w, h, mat, T } = this, d = this.data;
      const cap = d.heatCap, K = d.k, st = d.state;
      const scale = this.dt * this.heatBoost / (this.dx * this.dx);
      const gasScale = scale * Math.min(1, 50 / this.heatBoost);
      // conductance()와 같은 계산을 안쪽 반복에 풀어 쓴다(가장 많이 도는 반복이라).
      const flow = (i, j) => {
        const a = mat[i], b = mat[j], ka = K[a], kb = K[b];
        let g = (a === b ? ka : 2 * ka * kb / (ka + kb)) * (st[a] === GAS || st[b] === GAS ? gasScale : scale);
        const ca = cap[a], cb = cap[b], lim = 0.2 * (ca < cb ? ca : cb);
        if (g > lim) g = lim;
        const q = g * (T[j] - T[i]);
        T[i] += q / ca; T[j] -= q / cb;
      };
      const last = w - 1;
      for (let y = 0; y < h; y++) {
        const row = y * w, down = y + 1 < h;
        for (let x = 0; x < w; x++) {
          const i = row + x, t = T[i];
          if (x < last) { const dT = T[i + 1] - t; if (dT > 0.01 || dT < -0.01) flow(i, i + 1); }
          if (down) { const dT = T[i + w] - T[i]; if (dT > 0.01 || dT < -0.01) flow(i, i + w); }
        }
      }
    }

    // 상변화, 수명, 화학 반응을 칸 단위로 처리한다.
    stepCells() {
      const { w, h, mat, T } = this;
      const d = this.data, st = d.state;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          const m = mat[i];
          if (d.fixed[m]) { T[i] = d.t0[m]; continue; }
          if (m === this.AIR) { T[i] += (this.ambient - T[i]) * 0.002; continue; } // 외부로의 열 손실
          if (T[i] < -273.15) T[i] = -273.15; else if (T[i] > 9000) T[i] = 9000; // 절대영도 아래로는 내려가지 않는다
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
          // 압력이 낮은 닫힌 공간: 끓는점보다 뜨거운 액체는 기체와 닿은 면에서 바로 끓어오르고, 그 열(잠열)만큼 아래 액체가 식는다.
          // 진공 속 물은 상온에서도 끓다가 식어서 결국 얼어붙는다.
          if (this.lowP && d.up[m] && d.up[m].boil && y > 0 && st[mat[i - w]] === GAS && Math.random() < 0.05) {
            const bp = this.boilAt(d.up[m].at, i), over = T[i] - bp;
            if (over > 0.5) {
              const to = d.up[m].to;
              const below = y + 1 < h && mat[i + w] === m ? i + w : -1;
              this.setCell(i, to, bp);
              if (below >= 0) T[below] -= Math.min(25, d.up[m].L / d.cp[m] * 0.04);
              this.note('vacuum_boil', () => ({ type: 'reaction', id: 'vacuum_boil', name: '낮은 압력에서 끓음', kind: 'physical', eq: `압력 ${this.regionP(i).toFixed(3)}기압 → 끓는점 ${bp.toFixed(0)}°C`, note: '압력이 낮으면 끓는점이 내려가 상온의 물도 끓습니다. 끓을 때 열(기화열)을 빼앗아 물이 식고, 계속 기체를 빼면 끓으면서 얼어붙기도 합니다. 높은 산에서 밥이 설익는 것도 같은 원리입니다.' }));
              continue;
            }
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
      let lowP = false;
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
        if (!(open || big) && P < 0.8) lowP = true;
        if (open || big) continue;
        // 진공 펌프에 닿은 닫힌 공간은 기체가 조금씩 빠져나간다.
        if (pumped) {
          for (let k = 0; k < size; k++) if (lab[k] === id && st[mat[k]] === GAS) gas[k] = Math.max(0.01, gas[k] * 0.85);
          regions[id].P = P * 0.85;
          this.note('vacuum', () => ({ type: 'reaction', id: 'vacuum', name: '진공 펌프', kind: 'physical', eq: `기체를 빼냄 → 압력 ${P.toFixed(2)}기압`, note: '닫힌 용기의 기체를 빼내면 압력이 내려갑니다. 압력이 낮으면 물이 낮은 온도에서도 끓습니다.' }));
        }
        // 바깥 공기(1기압)가 누르는 힘이 얇은 벽이 견디는 정도를 넘으면 안쪽으로 찌그러진다.
        if (weak >= 0 && (1 - P) * 2 > weakS) {
          this.note('implode', () => ({ type: 'reaction', id: 'implode', name: '대기압에 찌그러짐', kind: 'physical', eq: `바깥 1기압 − 안쪽 ${P.toFixed(2)}기압`, note: '안쪽 압력이 낮아지면 바깥 공기가 용기를 누르는 힘이 커져 얇은 용기가 찌그러집니다. 공기도 무게가 있어 큰 힘으로 누르고 있다는 증거입니다.' }));
          this.setCell(weak, d.shatter[mat[weak]] >= 0 ? d.shatter[mat[weak]] : this.AIR, T[weak]);
          continue;
        }
        // 벽이 견디는 것은 안팎의 압력 차(바깥은 1기압)다.
        if (weak >= 0 && P - 1 > weakS) {
          const r = Math.max(2, Math.min(8, 1.5 + (P - weakS) * 0.6));
          this.note('burst', () => ({ type: 'reaction', id: 'burst', name: '밀폐 용기 파열', kind: 'physical', eq: `안팎 압력 차 ${(P - 1).toFixed(1)}기압 > 용기가 견디는 압력 차 ${weakS}기압`, note: '갇힌 기체를 데우거나 액체가 끓어 기체가 생기면 압력이 커집니다(PV = nRT). 용기가 견딜 수 있는 압력을 넘으면 가장 약한 곳이 터집니다. 압력솥에 안전밸브가 있는 이유입니다.' }));
          this.explode(weak, r, Math.max(200, Tsum / V));
          if (st[mat[weak]] === SOLID || anchor[weak]) this.setCell(weak, d.shatter[mat[weak]] >= 0 ? d.shatter[mat[weak]] : this.AIR, T[weak]); // 터진 자리는 반드시 뚫린다
          for (let k = 0; k < size; k++) if (lab[k] === id && gas[k] > 1) gas[k] = 1;
        }
      }
      // 열린 공간으로 나온 압축 기체는 대기 속으로 퍼져 1기압이 된다.
      // 닫힌 공간 안에서는 기체가 순식간에 퍼져 어디서나 같은 압력이 된다(파스칼). 전체 기체량(Σn·T)은 그대로 두고 칸마다 고르게 나눈다.
      for (let k = 0; k < size; k++) {
        if (st[mat[k]] !== GAS) continue;
        const r = regions[lab[k]];
        if (!r || r.open) { if (gas[k] !== 1 && gas[k] > 0) gas[k] = 1 + (gas[k] - 1) * 0.5; }
        else if (r.V) gas[k] = r.P * 293.15 / (T[k] + 273.15);
      }
      this.pRegions = regions;
      this.lowP = lowP;
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
    // 공 둘레 바로 바깥을 재어 공이 잠긴 정도와 주변 유체의 밀도를 구한다(공 안의 유체는 밀려나 있다).
    sampleFluid(b) {
      let sum = 0;
      for (let n = 0; n < 9; n++) {
        const a = n / 8 * Math.PI * 2;
        const rr = n === 8 ? b.r + this.dx * 0.8 : b.r + this.dx * 0.8;
        if (n === 8) { // 맨 아래 한 점을 더 본다(바닥에 잠긴 부분)
          const cx = Math.floor(b.x / this.dx), cy = Math.floor((b.y + rr) / this.dx);
          if (this.inside(cx, cy)) { const i = this.index(cx, cy), s = this.data.state[this.mat[i]]; if (s === LIQUID || (s === GAS && !this.vacuum)) sum += this.effRho(i); }
          continue;
        }
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
      this.displaceByBodies();
      for (const b of this.bodies) {
        if (this.tick % 2 === 0) {
          b.trail.push(b.x, b.y);
          if (b.trail.length > 400) b.trail.splice(0, 2);
        }
      }
    }

    // 공이 들어간 자리의 액체를 밀어낸다. 빠르면 물보라로 튀고, 느리면 위쪽 빈자리로 올라가 수면이 높아진다(아르키메데스).
    displaceByBodies() {
      const { w, h, mat, bmask } = this, st = this.data.state;
      for (const i of this.bcells) bmask[i] = 0;
      const cells = [];
      for (const b of this.bodies) {
        const rc = b.r / this.dx, cx = b.x / this.dx, cy = b.y / this.dx, sp = Math.hypot(b.vx, b.vy) * this.dt / this.dx; // 칸/틱
        const x0 = Math.max(0, Math.floor(cx - rc)), x1 = Math.min(w - 1, Math.ceil(cx + rc)), y0 = Math.max(0, Math.floor(cy - rc)), y1 = Math.min(h - 1, Math.ceil(cy + rc));
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          const ox = x + 0.5 - cx, oy = y + 0.5 - cy, d = Math.hypot(ox, oy);
          if (d > rc - 0.3) continue;
          const i = y * w + x;
          cells.push(i); bmask[i] = 1;
          if (st[mat[i]] !== LIQUID) continue;
          const ux = d > 1e-6 ? ox / d : 0, uy = d > 1e-6 ? oy / d : -1;
          if (sp > 0.4 && this.launch(i, ux * sp * 0.8 + b.vx * this.dt / this.dx * 0.3, Math.min(uy, -0.3) * sp * 0.9)) continue;
          // 느리면 같은 열 위쪽의 가장 가까운 빈 기체 칸(공 밖)과 자리를 바꾼다.
          for (let k = i - w; k >= 0; k -= w) {
            if (bmask[k] && k !== i) continue;
            const sk = st[mat[k]];
            if (sk === SOLID || (sk === POWDER && this.anchor[k])) break;
            if (sk === GAS && !bmask[k]) { this.swap(i, k); break; }
          }
        }
      }
      this.bcells = cells;
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
    // 온도계는 여러 개(최대 3개) 둘 수 있다. setProbe는 하나로 바꾸고 addProbe는 더한다.
    get probe() { return this.probes && this.probes.length ? this.probes[this.probes.length - 1] : null; }
    set probe(v) { this.probes = v ? [v] : []; }
    setProbe(x, y) { this.probes = [{ x, y, log: [] }]; }
    addProbe(x, y) {
      this.probes = (this.probes || []).filter((p) => p.x !== x || p.y !== y);
      this.probes.push({ x, y, log: [] });
      if (this.probes.length > 3) this.probes.shift();
    }
    record() {
      const b = this.selected;
      if (b) {
        const { ke, pe } = this.energyOf(b);
        b.log.push({ t: this.time - b.born, h: this.heightOf(b), v: b.vy, E: ke + pe });
        if (b.log.length > 1800) b.log.shift();
      }
      if (this.probes && this.probes.length && this.tick % 6 === 0) {
        for (const p of this.probes) {
          const pi = this.index(p.x, p.y);
          p.log.push({ t: this.time, T: this.T[pi], m: this.mat[pi], P: this.pressureAt(pi) });
          if (p.log.length > 1200) p.log.shift();
        }
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
        mat: this.mat.slice(), T: this.T.slice(), gas: this.gas.slice(), anchor: this.anchor.slice(), loose: this.loose.slice(), store: this.store.slice(), vy: this.vy.slice(), life: this.life.slice(), shade: this.shade.slice(),
        bodies: this.bodies.map((b) => Object.assign({}, b, { trail: [], log: [] })), probe: this.probe && { x: this.probe.x, y: this.probe.y }, probes: (this.probes || []).map((p) => ({ x: p.x, y: p.y })), valves: this.valves.map((v) => ({ cells: v.cells.slice(), x: v.x, y: v.y })),
      };
    }
    restoreSnapshot(s) {
      this.mat.set(s.mat); this.T.set(s.T); if (s.loose) { this.loose.set(s.loose); this.looseN = 1; } if (s.gas) this.gas.set(s.gas); this.anchor.set(s.anchor); this.store.set(s.store); this.vy.set(s.vy); this.life.set(s.life); this.shade.set(s.shade);
      this.bodies = s.bodies.map((b) => Object.assign({}, b, { trail: [], log: [] }));
      this.selected = null; this.fq = []; this.flyers = []; this.valves = (s.valves || []).map((v) => ({ cells: v.cells.slice(), x: v.x, y: v.y }));
      if (s.probes) this.probes = s.probes.map((p) => ({ x: p.x, y: p.y, log: [] })); else if (s.probe) this.setProbe(s.probe.x, s.probe.y); else this.probe = null;
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
        materials: this.data.defs.map((d) => d.id), mat: enc(this.mat), T: enc(this.T), anchor: enc(this.anchor), loose: enc(this.loose),
        bodies: this.bodies.map((b) => ({ type: b.type, r: b.r, x: b.x, y: b.y, vx: b.vx, vy: b.vy })),
        valves: this.valves.map((v) => ({ cells: v.cells, x: v.x, y: v.y })),
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
      if (o.loose) { this.loose.set(dec(o.loose, Uint8Array)); this.looseN = 1; } // 예전 저장 데이터에는 없음
      if (o.valves) this.valves = o.valves.map((v) => ({ cells: v.cells.slice(), x: v.x, y: v.y }));
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

  // 고정하지 않은 고체 덩어리(떨어지고 뜨는 칸)를 놓는다.
  const lump = (w, id, x0, y0, x1, y1, T) => {
    w.rect(id, x0, y0, x1, y1, T);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) w.loose[w.index(x, y)] = 1;
    w.looseN++;
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
      id: 'complex', name: '색이 변하는 이온 반응', tab: 'codex',
      desc: '왼쪽: 황산구리 용액이 암모니아수를 만나면 파란 수산화구리 앙금이 생겼다가, 암모니아가 많으면 다시 녹아 짙은 남색 착이온이 됩니다. 가운데: 염화철(III)에 싸이오사이안산칼륨을 넣으면 핏빛이 됩니다. 오른쪽: 노란 크로뮴산칼륨에 염산을 넣으면 주황색이 됩니다.',
      setup(w) {
        air(w);
        const pairs = [['A:CuSO4', 'NH4OH:aq'], ['A:FeCl3', 'A:KSCN'], ['A:K2CrO4', 'hcl']];
        beakers(w, pairs.map(([a, b], i) => (t) => {
          if (i === 0) { // 착이온은 암모니아가 많아야 생기므로, 과량의 암모니아수에 황산구리 용액을 떨어뜨린다.
            w.rect(b, t.l, 100, t.r, t.b);
            w.rect(a, t.l + 15, 75, t.r - 15, 85);
            return;
          }
          w.rect(a, t.l, 118, t.r, t.b);
          w.rect(b, t.l + 6, 80, t.r - 6, 100);
        }));
      },
    },
    {
      id: 'ph', name: 'BTB로 보는 pH', tab: 'codex',
      desc: '초록색 BTB 용액에 왼쪽부터 식초(pH 약 3), 탄산수(약 4), 소금물(7), 베이킹소다 용액(약 8.3), 수산화나트륨 용액(13)을 넣었습니다. 산성은 노랑, 중성은 초록, 염기성은 파랑입니다.',
      setup(w) {
        air(w);
        beakers(w, ['vinegar', 'A:acid:H2CO3', 'brine', 'A:NaHCO3', 'naoh'].map((id) => (t) => {
          w.rect('btb', t.l, 122, t.r, t.b);
          w.rect(id, t.l + 3, 95, t.r - 3, 110);
        }));
      },
    },
    {
      id: 'peroxide', name: '과산화수소와 촉매', tab: 'codex',
      desc: '왼쪽: 이산화망가니즈 촉매가 과산화수소를 물과 산소로 분해합니다. 가운데: 비누를 섞은 과산화수소에 아이오딘화 칼륨을 넣으면 산소가 거품을 부풀립니다(코끼리 치약). 오른쪽: 보라색 과망가니즈산 칼륨이 과산화수소를 만나 색을 잃고 갈색 앙금이 생깁니다.',
      setup(w) {
        air(w);
        beakers(w, [
          (t) => { w.rect('H2O2', t.l, 110, t.r, t.b); w.rect('S:MnO2', t.l + 25, 85, t.r - 25, 90); },
          (t) => { w.rect('H2O2', t.l, 118, t.r, t.b); w.rect('soap', t.l, 110, t.r, 117); w.rect('A:KI', t.l + 20, 85, t.r - 20, 92); },
          (t) => { w.rect('A:KMnO4', t.l, 118, t.r, t.b); w.rect('H2O2', t.l + 10, 85, t.r - 10, 98); },
        ]);
      },
    },
    {
      id: 'amphoteric', name: '양쪽성 금속', tab: 'codex',
      desc: '알루미늄과 아연은 산뿐 아니라 강염기에도 녹습니다. 왼쪽과 가운데는 염화알루미늄·황산아연 용액을 수산화나트륨 용액에 떨어뜨린 것으로, 흰 앙금이 생겼다가 염기가 많은 곳에서 다시 녹습니다. 오른쪽은 알루미늄 조각이 수산화나트륨 용액에서 수소를 내는 모습입니다.',
      setup(w) {
        air(w);
        beakers(w, [
          // 금속염 용액이 수산화나트륨 용액보다 무거우므로, 위에서 떨어뜨리면 염기 속을 지나며 반응한다.
          (t) => { w.rect('naoh', t.l, 100, t.r, t.b); w.rect('A:AlCl3', t.l + 15, 70, t.r - 15, 80); },
          (t) => { w.rect('naoh', t.l, 100, t.r, t.b); w.rect('A:ZnSO4', t.l + 15, 70, t.r - 15, 80); },
          (t) => { w.rect('naoh', t.l, 105, t.r, t.b); w.rect('Al', t.l + 20, 130, t.r - 20, t.b, 20, true); },
        ]);
      },
    },
    {
      id: 'bleach', name: '표백제와 염소', tab: 'codex',
      desc: '왼쪽: 표백제(락스)가 리트머스의 색을 없앱니다. 가운데: 표백제에 염산을 넣으면 황록색 염소 기체가 나옵니다. 그래서 락스와 산성 세제는 절대 섞으면 안 됩니다. 오른쪽: 염소가 아이오딘화 칼륨에서 아이오딘을 밀어내고, 그 아이오딘이 녹말을 청람색으로 물들입니다. 실제로 따라 하지 마세요.',
      setup(w) {
        air(w);
        beakers(w, [
          (t) => { w.rect('litmus', t.l, 120, t.r, t.b); w.rect('A:NaClO', t.l + 8, 90, t.r - 8, 105); },
          (t) => { w.rect('A:NaClO', t.l, 120, t.r, t.b); w.rect('hcl', t.l + 8, 90, t.r - 8, 105); },
          (t) => { w.rect('starch', t.l, 128, t.r, t.b); w.rect('A:KI', t.l, 120, t.r, 127); w.rect('Cl:g', t.l, 70, t.r, 105); },
        ]);
      },
    },
    {
      id: 'cave', name: '석회 동굴과 센물', tab: 'codex',
      desc: '왼쪽: 이산화탄소가 녹은 물(탄산수)이 석회암을 천천히 녹여 센물이 됩니다. 가운데: 센물을 데우면 이산화탄소가 빠지며 탄산칼슘이 다시 쌓입니다(종유석, 주전자 물때). 오른쪽: 센물에 비누를 넣으면 거품 대신 찌꺼기가 생깁니다.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149);
        const t1 = tank(w, 'glass', 4, 76, 60, 142);
        w.rect('A:acid:H2CO3', t1.l, 95, t1.r, t1.b);
        w.rect('limestone', t1.l + 15, 125, t1.r - 15, t1.b, 20, true);
        w.rect('heater', 84, 142, 156, 145);
        const t2 = tank(w, 'glass', 84, 156, 60, 141);
        w.rect('A:Ca(HCO3)2', t2.l, 100, t2.r, t2.b);
        const t3 = tank(w, 'glass', 164, 236, 60, 142);
        w.rect('A:Ca(HCO3)2', t3.l, 115, t3.r, t3.b);
        w.rect('soap', t3.l + 8, 85, t3.r - 8, 100);
      },
    },
    {
      id: 'freeze', name: '얼음과 소금 (한제)', tab: 'physics', graph: 'T',
      desc: '왼쪽은 얼음만, 오른쪽은 얼음과 소금을 섞었습니다. 온도계는 오른쪽에 꽂혀 있습니다. 소금물은 0°C보다 훨씬 낮은 온도(최저 약 -21°C)에서 얼기 때문에, 얼음이 녹으며 열을 빼앗아 영하로 내려갑니다. 아이스크림을 만들거나 도로에 염화칼슘을 뿌리는 원리입니다.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149);
        const a = tank(w, 'glass', 20, 110, 60, 142);
        w.rect('ice', a.l, 100, a.r, a.b, -5);
        const b = tank(w, 'glass', 130, 220, 60, 142);
        for (let y = 100; y <= b.b; y++) for (let x = b.l; x <= b.r; x++) w.rect((x * 7 + y * 3) % 5 === 0 ? 'salt' : 'ice', x, y, x, y, -5);
        w.setProbe(175, 130);
      },
    },
    {
      id: 'endo', name: '열을 내는 반응, 빼앗는 반응', tab: 'physics', graph: 'T',
      desc: '왼쪽: 수산화바륨과 염화암모늄 두 고체를 섞기만 해도 열을 빼앗아 차가워집니다(온도계). 가운데: 질산암모늄이 물에 녹으면 차가워집니다(냉찜질 팩). 오른쪽: 생석회에 물을 부으면 뜨거워집니다(발열 도시락). 온도 보기로 함께 보세요.',
      setup(w) {
        air(w);
        beakers(w, [
          (t) => { for (let y = 115; y <= t.b; y++) for (let x = t.l; x <= t.r; x++) w.rect((x + y) % 2 ? 'S:Ba(OH)2' : 'S:NH4Cl', x, y, x, y); },
          (t) => { w.rect('water', t.l, 115, t.r, t.b); w.rect('S:NH4NO3', t.l + 10, 90, t.r - 10, 100); },
          (t) => { w.rect('quicklime', t.l, 125, t.r, t.b); w.rect('water', t.l + 10, 90, t.r - 10, 105); },
        ]);
        w.setProbe(40, 130);
      },
    },
    {
      id: 'metalfire', name: '금속 화재', tab: 'codex',
      desc: '왼쪽: 불붙은 마그네슘은 이산화탄소 속에서도 계속 타며 검은 탄소를 남깁니다. 오른쪽: 불붙은 마그네슘에 물을 부으면 뜨거운 금속이 수증기에서 산소를 빼앗아 수소를 내고 불길이 더 커집니다. 금속 화재는 마른 모래나 전용 소화기로 끕니다.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149);
        const a = tank(w, 'glass', 10, 110, 40, 142);
        w.rect('co2', a.l, 41, a.r, a.b);
        w.rect('Mg', a.l + 20, 130, a.r - 20, a.b, 1000);
        const b = tank(w, 'stone', 130, 230, 90, 142);
        w.rect('Mg', b.l + 20, 130, b.r - 20, b.b, 1000);
        w.rect('water', b.l + 30, 60, b.r - 30, 70);
      },
    },
    {
      id: 'oilfire', name: '기름 화재와 물', tab: 'codex',
      desc: '두 냄비 모두 기름에 불이 붙어 있습니다. 왼쪽에 물을 부으면 물이 기름 밑으로 가라앉아 순간적으로 끓으며 불붙은 기름을 튀겨 불길이 커집니다. 오른쪽처럼 공기보다 무거운 이산화탄소로 덮어 산소를 막으면 꺼집니다. 실제로 따라 하지 마세요.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149);
        [[20, 110], [130, 220]].forEach(([x0, x1], i) => {
          w.rect('heater', x0, 142, x1, 145);
          const t = tank(w, 'stone', x0, x1, 120, 138);
          w.rect('oil', t.l, 126, t.r, t.b, 320);
          w.rect('fire', t.l, 121, t.r, 125);
          if (i === 0) w.rect('water', t.l + 25, 70, t.r - 25, 80);
          else w.rect('co2', t.l - 3, 60, t.r + 3, 100, 20);
        });
      },
    },
    {
      id: 'hydrate', name: '결정 속의 물', tab: 'codex',
      desc: '왼쪽: 파란 황산구리 오수화물을 데우면 결정 속 물이 빠져 흰색이 됩니다(650°C를 넘기면 황산구리 자체가 분해됩니다). 오른쪽: 흰 무수 황산구리와 파란 염화코발트에 물방울이 떨어지면 각각 파랑과 분홍으로 변했다가 녹아 용액이 됩니다. 물을 검출하거나 습도를 나타내는 데 씁니다.',
      setup(w) {
        air(w);
        w.setHeatBoost(400);
        w.rect('stone', 0, 146, 239, 149);
        // 가열판과 결정 사이에 내화벽돌을 두어 천천히 데운다.
        w.rect('heater', 10, 142, 110, 145);
        w.rect('firebrick', 10, 126, 110, 141);
        w.rect('S:CuSO4·5H2O', 20, 120, 100, 125);
        const t = tank(w, 'glass', 130, 230, 100, 142);
        w.rect('S:CuSO4', t.l + 4, 130, t.l + 40, t.b);
        w.rect('S:CoCl2', t.l + 54, 130, t.r - 4, t.b);
        w.rect('water', t.l + 14, 70, t.l + 28, 73);
        w.rect('water', t.l + 64, 70, t.l + 78, 73);
      },
    },
    {
      id: 'so2test', name: '이산화황으로 색 지우기', tab: 'codex',
      desc: '공기보다 무거운 이산화황이 세 비커로 가라앉습니다. 이산화황은 환원제라서 보라색 과망가니즈산 칼륨은 무색, 주황색 다이크로뮴산 칼륨은 초록, 갈색 아이오딘 용액은 무색이 됩니다. 이산화황을 확인하는 고전적인 방법입니다.',
      setup(w) {
        air(w);
        beakers(w, [
          (t) => { w.rect('A:KMnO4', t.l, 110, t.r, t.b); w.rect('SO2:g', t.l, 70, t.r, 100); },
          (t) => { w.rect('A:K2Cr2O7', t.l, 110, t.r, t.b); w.rect('SO2:g', t.l, 70, t.r, 100); },
          (t) => { w.rect('A:KI3', t.l, 110, t.r, t.b); w.rect('SO2:g', t.l, 70, t.r, 100); },
        ]);
      },
    },
    {
      id: 'chlorine', name: '염소의 산화력', tab: 'codex',
      desc: '황록색 염소 기체가 네 용액으로 가라앉습니다. 왼쪽부터: 연두색 철(II) 이온이 노란 갈색 철(III) 이온으로, 황화 이온이 노란 황 앙금으로, 아이오딘화 이온이 갈색 아이오딘으로, 브로민화 이온이 주황색 브로민으로 산화됩니다. 염소는 약한 할로젠을 밀어냅니다.',
      setup(w) {
        air(w);
        beakers(w, [
          (t) => { w.rect('A:FeSO4', t.l, 110, t.r, t.b); w.rect('Cl:g', t.l, 70, t.r, 100); },
          (t) => { w.rect('A:Na2S', t.l, 110, t.r, t.b); w.rect('Cl:g', t.l, 70, t.r, 100); },
          (t) => { w.rect('A:KI', t.l, 110, t.r, t.b); w.rect('Cl:g', t.l, 70, t.r, 100); },
          (t) => { w.rect('A:NaBr', t.l, 110, t.r, t.b); w.rect('Cl:g', t.l, 70, t.r, 100); },
        ]);
      },
    },
    {
      id: 'alloys', name: '합금과 산', tab: 'codex',
      desc: '합금은 섞인 금속마다 다르게 반응합니다. 황동(구리+아연)은 염산에 아연만 녹아 붉은 구리가 남고(탈아연), 청동(구리+주석)과 땜납(주석+납)은 주석만 천천히 녹습니다. 오른쪽에서는 황동 속 아연이 황산구리 용액의 구리를 밀어냅니다.',
      setup(w) {
        air(w);
        beakers(w, [
          (t) => { w.rect('hcl', t.l, 110, t.r, t.b - 6); w.rect('brass:s', t.l + 6, t.b - 5, t.r - 6, t.b); },
          (t) => { w.rect('hcl', t.l, 110, t.r, t.b - 6); w.rect('bronze:s', t.l + 6, t.b - 5, t.r - 6, t.b); },
          (t) => { w.rect('hcl', t.l, 110, t.r, t.b - 6); w.rect('solder:s', t.l + 6, t.b - 5, t.r - 6, t.b); },
          (t) => { w.rect('A:CuSO4', t.l, 110, t.r, t.b - 6); w.rect('brass:s', t.l + 6, t.b - 5, t.r - 6, t.b); },
        ]);
        w.setHeatBoost(200);
      },
      speed: 2,
    },
    {
      id: 'lemon', name: '레몬즙(구연산)의 힘', tab: 'codex',
      desc: '구연산은 약한 산이라 천천히 반응합니다. 왼쪽부터: 아연에서 수소 거품, 석회석(탄산칼슘)에서 이산화탄소 거품(물때 제거), 녹(산화철)이 녹아 없어짐, 베이킹소다와 만나 거품이 솟음. 식초·레몬으로 청소하는 원리입니다.',
      setup(w) {
        air(w);
        beakers(w, [
          (t) => { w.rect('A:citric', t.l, 105, t.r, t.b - 5); w.rect('Zn:s', t.l + 5, t.b - 4, t.r - 5, t.b); },
          (t) => { w.rect('A:citric', t.l, 105, t.r, t.b - 5); w.rect('limestone', t.l + 5, t.b - 4, t.r - 5, t.b); },
          (t) => { w.rect('A:citric', t.l, 105, t.r, t.b - 5); w.rect('S:Fe2O3', t.l + 5, t.b - 4, t.r - 5, t.b); },
          (t) => { w.rect('A:citric', t.l, 115, t.r, t.b); w.rect('S:NaHCO3', t.l + 8, 85, t.r - 8, 92); },
        ]);
      },
      speed: 2,
    },
    {
      id: 'floatsink', name: '뜨는 덩어리, 가라앉는 덩어리', tab: 'physics',
      desc: '받침 없는 고체는 한 덩어리로 떨어집니다. 물에 들어가면 밀어낸 물의 무게(부력)와 자기 무게를 비교해 나무는 뜨고 돌은 가라앉습니다(아르키메데스). 왼쪽 위의 유리판은 높은 곳에서 돌바닥에 떨어져 깨지고, 오른쪽의 뜨거운 유리(400°C)는 얼음에 닿아 열충격으로 깨집니다.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149);
        const t = tank(w, 'glass', 70, 180, 70, 142);
        w.rect('water', t.l, 95, t.r, t.b);
        lump(w, 'wood', 85, 30, 100, 38);
        lump(w, 'stone', 120, 30, 130, 38);
        lump(w, 'wood', 145, 50, 165, 53);
        lump(w, 'glass', 15, 20, 40, 23);
        w.rect('glass', 200, 136, 225, 145, 400, true);
        w.rect('ice', 205, 110, 220, 118);
      },
    },
    {
      id: 'pressure', name: '압력과 진공 놀이터', tab: 'physics', graph: 'P',
      desc: "세 밀폐 용기가 있습니다. 측정 탭의 '압력·진공' 도구로 해 보세요. 왼쪽(유리, 물 반쯤): 기체 빼기로 압력을 낮추면 물이 상온에서 끓습니다. 가운데(얇은 캔): 기체를 빼면 바깥 대기압에 찌그러집니다. 오른쪽(튼튼한 벽, 위쪽 회색 판이 피스톤): 피스톤을 밀고 빼면 압력이 부피에 반비례합니다(보일 법칙). 기체 넣기를 계속하면 유리 용기는 6기압에서 터집니다. '압력 보기'를 켜면 압력이 색으로 보입니다.",
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149);
        w.vessel(8, 60, 76, 145, 'glass', true);
        w.rect('water', 10, 105, 74, 143, 25);
        w.vessel(86, 70, 150, 145, 'can', true);
        w.vessel(160, 50, 232, 145, 'wall', true);
        w.rect('piston', 162, 52, 230, 61, 20, true);
        w.setProbe(196, 120);
      },
    },
    {
      id: 'charles', name: '움직이는 피스톤 (샤를 법칙)', tab: 'physics', graph: 'P',
      desc: '두 실린더에 피스톤이 얹혀 있습니다. 피스톤은 아래 기체가 미는 힘과 위의 대기압·자기 무게가 같아지는 곳에서 멈춥니다. 오른쪽 실린더 바닥의 가열판이 기체를 데우면 부피가 늘어 피스톤이 천천히 올라갑니다(샤를 법칙). 가열판을 지우개로 지우면 식으면서 다시 내려옵니다. 왼쪽 피스톤 위에 모래를 부어 무게를 더하면 기체가 눌려 압력이 커집니다(보일 법칙). 압력계로 오른쪽 실린더 안을 재 보세요.',
      setup(w) {
        air(w);
        w.rect('stone', 0, 146, 239, 149, null, true);
        for (const [x0, x1] of [[40, 90], [140, 190]]) {
          w.rect('glass', x0, 20, x0 + 1, 145, null, true); w.rect('glass', x1, 20, x1 + 1, 145, null, true);
          lump(w, 'piston', x0 + 2, 108, x1 - 1, 111);
        }
        w.rect('heater', 161, 142, 170, 145, null, true);
        w.setProbe(165, 128);
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

  // ---- 도전 과제 ----
  // check(c): c.has(발견 id), c.any(정규식), c.count(물질 id), c.cells(물질 id, 조건). 발견 기록은 저장되므로 한 번 이루면 끝이다.
  // 사이트에서는 sandlab:challenge 이벤트로 진도·점수와 연결할 수 있다.
  SL.CHALLENGES = [
    { id: 'so2', name: '이산화황으로 색 지우기', hint: '과망가니즈산 칼륨이나 다이크로뮴산 칼륨 용액에 이산화황을 넣어 보세요.', check: (c) => c.has('kmno4_so2') || c.has('dichromate_so2') },
    { id: 'float', name: '물에 뜨는 나무', hint: "'고정'을 끄고 나무를 물 위 공중에 그려 보세요.", check: (c) => c.has('rigid_fall') },
    { id: 'dezinc', name: '황동에서 아연만 녹이기', hint: '황동을 염산에 넣어 보세요.', check: (c) => c.has('dezinc') },
    { id: 'neutral', name: '산과 염기 중화하기', hint: '염산에 수산화나트륨 용액을 떨어뜨려 보세요.', check: (c) => c.any(/^neutral:/) },
    { id: 'precip', name: '노란 앙금 만들기', hint: '질산납 용액과 아이오딘화 칼륨 용액을 만나게 해 보세요.', check: (c) => c.count('S:PbI2') > 0 || c.count('S:AgI') > 0 || c.count('S:PbCrO4') > 0 },
    { id: 'flame4', name: '불꽃색 네 가지 보기', hint: '여러 금속의 염화물을 불꽃에 넣어 보세요.', check: (c) => c.ids().filter((k) => /^flame:/.test(k)).length >= 4 },
    { id: 'silver', name: '은 나무 키우기', hint: '구리를 질산은 용액에 넣어 보세요.', check: (c) => c.any(/^displace:.*:Ag:/) },
    { id: 'starch', name: '녹말 찾기', hint: '녹말 용액에 아이오딘을 넣어 보세요.', check: (c) => c.has('starch_iodine') },
    { id: 'slime', name: '슬라임 만들기', hint: '물풀과 붕사 용액을 섞어 보세요.', check: (c) => c.has('slime') },
    { id: 'garden', name: '화학 정원 키우기', hint: '물유리에 금속염 결정을 떨어뜨려 보세요.', check: (c) => c.has('garden') },
    { id: 'ferment', name: '발효시키기', hint: '따뜻한 설탕물에 효모를 넣어 보세요.', check: (c) => c.has('ferment') },
    { id: 'cold', name: '얼음과 소금으로 영하 15°C 만들기', hint: '얼음에 소금을 뿌리고 온도계로 재 보세요.', check: (c) => c.cells('A:NaCl', (T) => T < -15) > 0 },
    { id: 'fog', name: '차가운 안개 만들기', hint: '액체 질소나 드라이아이스를 공기 중에 두어 보세요.', check: (c) => c.has('fog') },
    { id: 'hotice', name: '핫 아이스 굳히기', hint: '과포화 아세트산나트륨 용액에 결정을 하나 떨어뜨려 보세요.', check: (c) => c.has('hotice') },
    { id: 'glass', name: '모래로 유리 만들기', hint: '모래를 1713°C 넘게 녹였다가 식혀 보세요(용광로판).', check: (c) => c.has('phase:moltenglass:glass') },
    { id: 'steel', name: '강철 만들기', hint: '녹은 철에 숯을 넣어 보세요.', check: (c) => c.has('steel') },
    { id: 'thermite', name: '테르밋으로 쇳물 얻기', hint: '알루미늄 가루와 녹을 섞고 아주 뜨겁게 불을 붙여 보세요.', check: (c) => c.any(/^thermite:/) },
    { id: 'h2pop', name: '수소 폭발시키기', hint: '수소와 산소를 섞고 불을 대 보세요.', check: (c) => c.has('h2_burn') && c.has('explosion:small') },
    { id: 'electrolysis', name: '물을 전기 분해하기', hint: '묽은 황산에 (+)극과 (−)극 전극을 꽂아 보세요.', check: (c) => c.has('electro:H2') && c.has('electro:O2') },
    { id: 'plating', name: '구리 도금하기', hint: '황산구리 용액에서 철을 (−)극에 이어 보세요.', check: (c) => c.has('electro:metal:Cu') },
    { id: 'battery', name: '레몬 전지로 전구 켜기', hint: '레몬즙에 아연과 구리를 담그고 도선과 전구로 이어 보세요.', check: (c) => c.has('galvanic') && c.has('bulb') },
    { id: 'chain', name: '핵분열 연쇄 반응 일으키기', hint: '농축 우라늄을 임계 질량보다 많이 모아 보세요(실제로는 절대 불가능하고 위험합니다).', check: (c) => c.has('chain') },
    { id: 'meltdown', name: '원자로가 녹는 까닭 알아보기', hint: '물속에 농축 우라늄을 모아 보세요. 핵폭발은 일어나지 않습니다.', check: (c) => c.has('meltdown') },
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
  .picked { display:flex; align-items:center; gap:8px; padding:6px 8px; margin:6px 0 8px; background:var(--sl-raised); border-radius:6px; min-height:38px; }
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
        picked.innerHTML = `<i style="background:${d.color}"></i><span class="nm"><b>${d.name}</b><small>${d.formula}</small></span><button class="more" title="설명과 함께 떨어뜨려 볼 재료">정보 ›</button>`;
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
        <div class="chips">${[['v', '수직 속도'], ['h', '높이'], ['E', '역학적 에너지'], ['T', '온도계'], ['P', '압력계']].map(([k, n]) => `<button class="chip${this.graphMode === k ? ' on' : ''}" data-graph="${k}">${n}</button>`).join('')}</div>
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
      pane.innerHTML = `<details class="challenges"${this.challengesOpen === false ? '' : ' open'}><summary><h3>도전 과제 ${this.done.size} / ${ch.length}</h3></summary><ul>${ch.map((c) => `<li class="${this.done.has(c.id) ? 'ok' : ''}" title="${c.hint}"><span>${this.done.has(c.id) ? '✓' : '○'}</span>${c.name}${this.done.has(c.id) ? '' : `<small>${c.hint}</small>`}</li>`).join('')}</ul></details>` +
        `<h3>발견한 반응 ${found}개, 상태 변화 ${entries.length - found}개</h3>` + this.codexHints() +
        (entries.length ? entries.slice().reverse().map((e) => `<details class="entry"><summary><b>${e.name}</b><code>${e.eq}</code></summary><span>${e.note || ''}</span></details>`).join('')
          : '<p class="hint">아직 발견한 반응이 없습니다. 물질들을 만나게 해 보세요.</p>');
      pane.onclick = (e) => { if (e.target.closest('.morehint')) { this.hintSeed = (this.hintSeed || 1) + 1; this.renderPane(); } };
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
        const n = this.world.fillLevel(c.x, c.y, this.world.data.idOf[this.matId]);
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
      if (t.kind === 'mat') w.paint(x, y, r, w.data.idOf[t.id], true, this.anchored);
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
        ? `<b>${info.def.name}</b> ${info.def.formula} · ${fmt(info.T, 1)}°C · ${info.rho >= 10 ? fmt(info.rho, 0) : fmt(info.rho, 2)} kg/m³${Math.abs(info.P - 1) > 0.02 ? ` · <b>${fmt(info.P, 2)}기압</b>` : ''}`
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

    // 그래프 하나, 축 하나. 측정값은 실선, 이론값은 점선으로 구분한다.
    plotData() {
      const w = this.world, m = this.graphMode;
      if (m === 'T' || m === 'P') {
        const ps = w.probes || [];
        if (!ps.length) return { empty: '온도계 도구로 측정할 곳을 눌러 주세요(최대 3곳). 압력은 밀폐 용기 안의 기체에서 잽니다.' };
        const t0 = Math.min(...ps.map((p) => (p.log.length ? p.log[0].t : Infinity)));
        const val = (s) => (m === 'P' ? s.P || 1 : s.T);
        const p = ps[0], unit = m === 'P' ? '기압' : '°C', label = m === 'P' ? '압력' : '온도';
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
      const all = d.ys.concat(theoryPts.filter((v) => v != null), ...more.map((q) => q.ys));
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
        q.ys.forEach((v, i) => { if (i) ctx.lineTo(X(q.xs[i]), Y(v)); else ctx.moveTo(X(q.xs[i]), Y(v)); });
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
      if (this.graphMode === 'P') {
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
  SL.version = '0.16.0'; // 저장 데이터·공개 API가 바뀌면 올린다. 사이트에서 호환성을 확인할 때 쓴다.

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
