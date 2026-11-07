# 모래 실험실 (프로토타입)

정해진 공간 안에서 물질을 섞고 가열하며 화학 반응과 물리 법칙을 관찰하는 웹 샌드박스입니다.
외부 라이브러리와 설치가 필요 없고, 다른 웹사이트에 기능으로 넣을 수 있게 만들었습니다.

## 실행

`index.html`을 더블클릭하면 실행됩니다.

테스트용 공개 페이지(작업 브랜치에 올릴 때마다 자동 배포):

| 주소 | 내용 |
|---|---|
| https://imkr3.github.io/stttem/ | 실험실 전체 화면 |
| https://imkr3.github.io/stttem/embed-example.html | 다른 사이트에 넣었을 때의 모습(사이트 CSS와 격리 확인) |
| https://imkr3.github.io/stttem/tests/tests.html | 엔진 자동 검증 |

## 다른 웹사이트에 넣기

필요한 파일은 `dist/sandlab.js` 하나입니다. 넣을 요소에는 높이를 지정해 주세요.

```html
<!-- 방법 1: 태그 -->
<script src="sandlab.js"></script>
<sand-lab scene="alkali" style="height:600px"></sand-lab>
<!-- 화면 효과(불티·섬광·흔들림)를 끄려면 effects="off", 소리를 켜려면 sound="on", 재료를 제한하려면 materials="water,Na:s,salt" -->

<!-- 방법 2: 스크립트로 제어 -->
<div id="lab" style="height:600px"></div>
<script src="sandlab.js"></script>
<script>
  const el = document.getElementById('lab');
  const lab = SandLab.create(el, {
    scene: 'water',
    effects: true, // false면 화면 효과를 끔(물리 결과는 같음)
    sound: false, // true면 효과음(폭발·깨짐·발견 알림)
    materials: undefined, // ['water', 'Na:s', 'salt']처럼 주면 그 재료만 고를 수 있음(수업용)
    // 생략하면 브라우저에 저장합니다. 사이트 계정에 저장하려면 이 두 함수를 바꾸면 됩니다.
    storage: { load: (key) => null, save: (key, value) => {} },
  });
  el.addEventListener('sandlab:discover', (e) => console.log(e.detail.name, e.detail.eq));
</script>
```

| 항목 | 내용 |
|---|---|
| 메서드 | `loadScene(id)`, `scenes()`, `undo()`, `challenges()`, `pause()`, `resume()`, `setView('normal'｜'heat'｜'density')`, `setEffects(true｜false)`, `setSound(true｜false)`, `exportCode()`·`importCode(code)` (압축된 공유 코드, Promise), `addProbe(x, y)`, `save()`, `restore(data)`, `discoveries()`, `destroy()` |
| 버전 | `SandLab.version` (저장 데이터나 공개 API가 바뀌면 올림) |
| 이벤트 | `sandlab:ready`, `sandlab:scenechange`, `sandlab:discover`, `sandlab:challenge`(도전 과제 완료: `id`, `name`, `done`, `total`), `sandlab:export`(CSV 저장), `sandlab:prediction`(예측 문제 결과: `id`, `choice`, `correct`) |
| 농도 | 용액은 칸마다 농도를 가짐(묽힘·pH·적정). 저장 데이터에 함께 저장되며, 예전 저장 데이터는 모두 기준 농도로 읽음. 엔진에서 `lab.world.setConc(x0, y0, x1, y1, c)`, `lab.world.pHAt(i)`, `lab.world.pHMeter(x, y)` |
| 조작 | 스페이스: 일시정지, `[` `]`: 붓 크기, `0`: 확대 초기화, Ctrl+Z: 되돌리기(실험실을 누른 뒤에만). 휴대폰은 두 손가락으로 확대·이동, 데스크톱은 Ctrl+휠 |
| 성능 | 느린 기기에서는 화면이 끊기는 대신 시뮬레이션이 조금 느리게 흐르고, 무거운 효과는 자동으로 줄어듦. 화면 밖에 있거나 바뀐 것이 없으면 계산·그리기를 쉼 |
| 화면 효과 | 불티·폭발 섬광·빛 번짐·화면 흔들림. 사용자의 운영체제에서 '동작 줄이기'를 켜면 흔들림은 하지 않음 |
| 색상 변경 | 사이트 CSS에서 `--sl-accent`, `--sl-bg`, `--sl-panel` 등을 지정 |

전역 이름은 `SandLab` 하나만 쓰고, 화면은 Shadow DOM 안에 있어 사이트 CSS와 섞이지 않습니다.
레이아웃은 화면 폭이 아니라 넣은 요소의 폭에 맞춰 바뀌며, 화면 밖으로 나가면 연산을 멈춥니다.
`embed-example.html`에서 실제 동작을 볼 수 있습니다.

사이트에 넣을 때 확인할 것:

- 넣을 요소에 높이를 꼭 지정(예: `height:600px` 또는 `height:80vh`). 폭이 760px보다 좁으면 실험 공간이 위, 패널이 아래로 바뀝니다.
- 키보드 단축키(Ctrl+Z)는 실험실 안을 누른 뒤에만 받으므로 사이트의 단축키와 겹치지 않습니다.
- 한 페이지에 여러 개를 넣어도 되지만, 실험실마다 연산을 하므로 보이지 않는 것은 자동으로 멈춥니다.
- 사이트를 떠날 때(단일 페이지 앱에서 화면 전환) `lab.destroy()`를 부르거나 `<sand-lab>` 태그를 지우면 정리됩니다.

## 구조

| 파일 | 역할 | 수정할 때 |
|---|---|---|
| `src/elements.js` | 원소 118종 표(주기율표 위치·성질). 물질로 만드는 원소는 `materials.js`의 `ELEMENT_SKIP`으로 고름 | 원소 값 수정 |
| `src/materials.js` | 분자, 이온 화합물, 암석, 합금, 장치 | 새 물질 추가 |
| `src/reactions.js` | 일반 반응 규칙과 특수 반응 표 | 새 반응 추가 |
| `src/scenes.js` | 미리 꾸민 실험 | 새 실험 추가 |
| `src/engine.js` | 시뮬레이션 (화면과 무관) | 물리 규칙 변경 |
| `src/renderer.js` | 격자 그리기, 보기 모드 | 색상·표현 변경 |
| `src/ui.js` | 화면, 입력, 그래프, 공개 API | UI 변경 |

`src/`를 고친 뒤에는 다시 묶어야 합니다(둘 중 하나).

```bash
powershell -ExecutionPolicy Bypass -File build.ps1
```

```bash
sh build.sh
```

`sh build.sh --check`는 `dist/sandlab.js`가 `src/`와 같은지만 확인합니다. 배포할 때 자동으로 확인합니다.

엔진 검증은 개발 서버를 띄운 뒤 `http://localhost:8123/tests/tests.html`을 열면 실행됩니다.

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

앞으로의 계획은 [docs/ROADMAP.md](docs/ROADMAP.md)에 있습니다.
