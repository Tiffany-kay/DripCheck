# Quick MongoDB Connection Test
Write-Host "🧪 Testing MongoDB Connection..." -ForegroundColor Cyan

# Navigate to server directory
Set-Location "drip-check-server"

# Start server in background and capture output
Write-Host "Starting server..." -ForegroundColor Yellow
$job = Start-Job -ScriptBlock {
    Set-Location $args[0]
    npm start 2>&1
} -ArgumentList (Get-Location)

# Wait for server to start
Start-Sleep -Seconds 10

# Check if MongoDB connected
$output = Receive-Job $job -Keep
$mongoConnected = $output -match "MongoDB connected successfully"
$mongoError = $output -match "MongoDB connection error"

if ($mongoConnected) {
    Write-Host "✅ SUCCESS: MongoDB connected!" -ForegroundColor Green
    Write-Host "🚀 Your DripCheck app is ready for deployment!" -ForegroundColor Cyan
} elseif ($mongoError) {
    Write-Host "❌ ERROR: MongoDB connection failed" -ForegroundColor Red
    Write-Host "📝 Please complete the Atlas IP whitelist fix:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://cloud.mongodb.com/" -ForegroundColor White
    Write-Host "   2. Network Access -> IP Access List" -ForegroundColor White
    Write-Host "   3. Add IP: Allow Access from Anywhere (0.0.0.0/0)" -ForegroundColor White
} else {
    Write-Host "⏳ Server starting... check manually with: npm start" -ForegroundColor Yellow
}

# Stop the job
Stop-Job $job -PassThru | Remove-Job

# Return to root directory
Set-Location ".."

Write-Host "`nNext steps after MongoDB fix:" -ForegroundColor Cyan
Write-Host "1. Run this test again to verify connection" -ForegroundColor White
Write-Host "2. Run .\deploy.ps1 to deploy to production" -ForegroundColor White
