# src/의 파일을 순서대로 이어 붙여 dist/sandlab.js 한 개로 만든다. 설치할 것이 없다.
$root = $PSScriptRoot
$order = 'elements', 'materials', 'reactions', 'engine', 'scenes', 'renderer', 'ui'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$out = foreach ($name in $order) { [System.IO.File]::ReadAllText("$root\src\$name.js", $utf8) }
New-Item -ItemType Directory -Force "$root\dist" | Out-Null
[System.IO.File]::WriteAllText("$root\dist\sandlab.js", ($out -join "`n"), $utf8)
Write-Output "dist/sandlab.js ($((Get-Item "$root\dist\sandlab.js").Length) bytes)"
