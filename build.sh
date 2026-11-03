#!/bin/sh
# build.ps1과 같은 일을 한다: src/의 파일을 순서대로 이어 붙여 dist/sandlab.js 하나로 만든다(파일 사이에 줄바꿈 하나).
# 사용법: sh build.sh        확인만: sh build.sh --check (dist가 src와 다르면 실패)
set -e
cd "$(dirname "$0")"
out=$(mktemp)
first=1
for name in elements materials reactions engine scenes renderer ui; do
  if [ $first -eq 0 ]; then printf '\n' >> "$out"; fi
  cat "src/$name.js" >> "$out"
  first=0
done
if [ "$1" = "--check" ]; then
  if cmp -s "$out" dist/sandlab.js; then echo "dist/sandlab.js가 src와 같습니다."; rm -f "$out"; else echo "dist/sandlab.js가 src와 다릅니다. sh build.sh로 다시 묶으세요." >&2; rm -f "$out"; exit 1; fi
else
  mkdir -p dist
  mv "$out" dist/sandlab.js
  echo "dist/sandlab.js ($(wc -c < dist/sandlab.js) bytes)"
fi
