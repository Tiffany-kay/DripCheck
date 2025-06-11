# MongoDB Atlas Connection Fix Script
Write-Host "🔧 MongoDB Atlas Connection Fix" -ForegroundColor Cyan
Write-Host "This will help you fix the database connection issue." -ForegroundColor White

# Get current IP
Write-Host "`n1. Getting your current IP address..." -ForegroundColor Yellow
try {
    $currentIP = (Invoke-WebRequest -Uri "https://ipinfo.io/ip").Content.Trim()
    Write-Host "   Your current IP: $currentIP" -ForegroundColor Green
} catch {
    Write-Host "   Could not get IP automatically" -ForegroundColor Yellow
    $currentIP = "Unable to detect"
}

Write-Host "`n2. MongoDB Atlas Fix Instructions:" -ForegroundColor Yellow
Write-Host "   🌐 Go to: https://cloud.mongodb.com/" -ForegroundColor White
Write-Host "   🔑 Login with your MongoDB account" -ForegroundColor White
Write-Host "   📍 Navigate: Network Access -> IP Access List" -ForegroundColor White
Write-Host "   ➕ Click: 'Add IP Address'" -ForegroundColor White
Write-Host "   🌍 Select: 'Allow Access from Anywhere' (0.0.0.0/0)" -ForegroundColor White
Write-Host "   ✅ Click: 'Confirm'" -ForegroundColor White
Write-Host "   ⏳ Wait: 2-3 minutes for changes to propagate" -ForegroundColor White

if ($currentIP -ne "Unable to detect") {
    Write-Host "`n   📝 Alternative: Add specific IP: $currentIP/32" -ForegroundColor Gray
}

Write-Host "`n3. Test the fix:" -ForegroundColor Yellow
Write-Host "   After fixing Atlas, restart the server:" -ForegroundColor White
Write-Host "   cd drip-check-server" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray

Write-Host "`n4. Expected result:" -ForegroundColor Yellow
Write-Host "   ✅ 'MongoDB connected successfully'" -ForegroundColor Green
Write-Host "   ❌ No more Atlas connection errors" -ForegroundColor Green

Write-Host "`n🚀 Once fixed, your DripCheck app will be ready for deployment!" -ForegroundColor Cyan

# Pause for user to read
Write-Host "`nPress any key to continue after fixing Atlas..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
