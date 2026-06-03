# ResumeAI - Windows setup script
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "`n=== ResumeAI Setup ===`n" -ForegroundColor Cyan

# Check Node.js
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "Node.js not found. Install from https://nodejs.org or run:" -ForegroundColor Yellow
    Write-Host "  winget install OpenJS.NodeJS.LTS`n"
    exit 1
}
Write-Host "Node: $(node -v)" -ForegroundColor Green
Write-Host "npm:  $(npm -v)" -ForegroundColor Green

# Server .env
$serverEnv = Join-Path $root "server\.env"
if (-not (Test-Path $serverEnv)) {
    $jwt = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ })
    @"
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/resume-analyzer
JWT_SECRET=$jwt
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=PASTE_YOUR_GEMINI_KEY_HERE
GEMINI_MODEL=gemini-1.5-flash
CLIENT_URL=http://localhost:5173
STORAGE_MODE=local
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=5
"@ | Set-Content $serverEnv -Encoding UTF8
    Write-Host "Created server/.env (edit GEMINI_API_KEY)" -ForegroundColor Green
} else {
    Write-Host "server/.env already exists" -ForegroundColor Gray
}

# Client .env
$clientEnv = Join-Path $root "client\.env"
if (-not (Test-Path $clientEnv)) {
    "VITE_API_URL=http://localhost:5000/api/v1" | Set-Content $clientEnv -Encoding UTF8
    Write-Host "Created client/.env" -ForegroundColor Green
} else {
    Write-Host "client/.env already exists" -ForegroundColor Gray
}

# Install dependencies
Write-Host "`nInstalling server dependencies..." -ForegroundColor Cyan
Set-Location (Join-Path $root "server")
npm install

Write-Host "`nInstalling client dependencies..." -ForegroundColor Cyan
Set-Location (Join-Path $root "client")
npm install

Set-Location $root
Write-Host "`n=== Setup complete ===`n" -ForegroundColor Green
Write-Host "1. Start MongoDB (pick one):"
Write-Host "   docker compose up -d          # local Mongo"
Write-Host "   OR set MONGODB_URI in server/.env to MongoDB Atlas"
Write-Host "2. Edit server/.env -> set GEMINI_API_KEY from https://aistudio.google.com/apikey"
Write-Host "3. Run API:    cd server; npm run dev"
Write-Host "4. Run UI:     cd client; npm run dev"
Write-Host "5. Open:       http://localhost:5173`n"
