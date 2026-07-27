Write-Host ""
Write-Host ""
Write-Host ""
Write-Host ""
Write-Host ""



Write-Host "[1/4] Stopping Backend..."

Get-Process -Name python -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Backend stopped."



Write-Host "[2/4] Stopping Frontend..."

Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Frontend stopped."


Write-Host "[3/4] Stopping Ollama..."

Get-Process -Name ollama -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Ollama stopped."



Write-Host "[4/4] Stopping Qdrant..."

docker stop qdrant 2>$null

Write-Host "Qdrant stopped."

Write-Host ""
Write-Host ""
Write-Host ""
Write-Host ""
Write-Host ""