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
