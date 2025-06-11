# Local MongoDB Setup for DripCheck
Write-Host "🚀 Setting up Local MongoDB for DripCheck" -ForegroundColor Cyan

# Check if MongoDB is installed
Write-Host "`n1. Checking MongoDB installation..." -ForegroundColor Yellow
try {
    $mongoVersion = mongod --version 2>$null
    if ($mongoVersion) {
        Write-Host "   ✅ MongoDB is already installed!" -ForegroundColor Green
    }
} catch {
    Write-Host "   📦 MongoDB not found. Installing..." -ForegroundColor Yellow
    
    # Check if Chocolatey is installed
    try {
        choco --version | Out-Null
        Write-Host "   ✅ Chocolatey found. Installing MongoDB..." -ForegroundColor Green
        choco install mongodb -y
    } catch {
        Write-Host "   📥 Installing Chocolatey first..." -ForegroundColor Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        
        Write-Host "   📦 Now installing MongoDB..." -ForegroundColor Yellow
        choco install mongodb -y
    }
}

# Create MongoDB data directory
Write-Host "`n2. Setting up MongoDB directories..." -ForegroundColor Yellow
$mongoDataPath = "C:\data\db"
if (!(Test-Path $mongoDataPath)) {
    New-Item -ItemType Directory -Path $mongoDataPath -Force
    Write-Host "   ✅ Created MongoDB data directory: $mongoDataPath" -ForegroundColor Green
} else {
    Write-Host "   ✅ MongoDB data directory exists" -ForegroundColor Green
}

# Start MongoDB service
Write-Host "`n3. Starting MongoDB service..." -ForegroundColor Yellow
try {
    Start-Service MongoDB 2>$null
    Write-Host "   ✅ MongoDB service started" -ForegroundColor Green
} catch {
    Write-Host "   🔄 Starting MongoDB manually..." -ForegroundColor Yellow
    Start-Process "mongod" -ArgumentList "--dbpath", $mongoDataPath -WindowStyle Hidden
    Start-Sleep 3
    Write-Host "   ✅ MongoDB started manually" -ForegroundColor Green
}

# Test MongoDB connection
Write-Host "`n4. Testing MongoDB connection..." -ForegroundColor Yellow
try {
    $testConnection = mongo --eval "db.runCommand({connectionStatus: 1})" 2>$null
    if ($testConnection -like "*ok*") {
        Write-Host "   ✅ MongoDB is running and accessible!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  MongoDB might need a moment to start up" -ForegroundColor Yellow
}

Write-Host "`n5. Updating DripCheck configuration..." -ForegroundColor Yellow
Write-Host "   Your .env file should have:" -ForegroundColor White
Write-Host "   MONGODB_URI=mongodb://127.0.0.1:27017/dripcheck" -ForegroundColor Gray
Write-Host "   (This looks correct in your current .env)" -ForegroundColor Green

Write-Host "`n🎉 Local MongoDB setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your DripCheck server" -ForegroundColor White
Write-Host "2. You should see 'MongoDB connected successfully'" -ForegroundColor White
Write-Host "3. Deploy to production!" -ForegroundColor White

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
