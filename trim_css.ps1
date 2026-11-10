$lines = Get-Content 'style.css' -Encoding UTF8
# Remove lines 2808 to end (0-indexed: 2807 to end)
# We want to keep lines 0 to 2807 (lines 1..2808)
$kept = $lines[0..2807]
[System.IO.File]::WriteAllLines((Resolve-Path 'style.css').Path, $kept, [System.Text.Encoding]::UTF8)
Write-Host "Done: CSS now has $($kept.Length) lines"
