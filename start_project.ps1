Write-Host ""
Write-Host ""
Write-Host ""
Write-Host ""
Write-Host ""

$ProjectRoot = "C:\projects\smart pdf chat"



Write-Host "[1/5] Checking Docker..."

try {
    docker info | Out-Null
    Write-Host "Docker is running."
}
catch {
    Write-Host "Docker Desktop is NOT running."
    Write-Host "Please start Docker Desktop first."
    Pause
    exit
}



Write-Host "[2/5] Checking Qdrant..."

$container = docker ps -a --filter "ancestor=qdrant/qdrant" --format "{{.Names}}"

if ($container) {

    docker start $container | Out-Null

    Write-Host "Qdrant is running."

}
else {

    Write-Host "Qdrant container not found."

}



Write-Host "[3/5] Checking Ollama..."

try {

    ollama list | Out-Null

    Write-Host "Ollama is running."

}
catch {

    Write-Host "Starting Ollama..."

    Start-Process ollama -ArgumentList "serve"

    Start-Sleep -Seconds 5

}


Write-Host "[4/5] Starting Backend..."

Start-Process powershell -ArgumentList @(
"-NoExit",
"-Command",
"cd '$ProjectRoot\backend'; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload"
)

Start-Sleep -Seconds 4



Write-Host "[5/5] Starting Frontend..."

Start-Process powershell -ArgumentList @(
"-NoExit",
"-Command",
"cd '$ProjectRoot\frontend'; npm run dev"
)

Start-Sleep -Seconds 5

Start-Process "http://localhost:5173"

Write-Host ""
Write-Host ""
Write-Host ""
Write-Host ""
Write-Host ""
Write-Host "Frontend : http://localhost:5173"
Write-Host "Backend  : http://127.0.0.1:8000/docs"
Write-Host ""