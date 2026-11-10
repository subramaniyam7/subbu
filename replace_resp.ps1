$css = Get-Content 'style.css' -Encoding UTF8
$newR = Get-Content 'responsive_new.css' -Encoding UTF8 -Raw
$before = ($css[0..2244]) -join "`n"
$after = ($css[2432..($css.Length - 1)]) -join "`n"
$combined = $before + "`n" + $newR + "`n" + $after
[System.IO.File]::WriteAllText((Resolve-Path 'style.css').Path, $combined, [System.Text.Encoding]::UTF8)
Write-Host "Done - CSS responsive section replaced"
