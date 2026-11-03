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
