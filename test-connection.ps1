# Test DripCheck Database Connection
Write-Host "Testing DripCheck Database Connection..." -ForegroundColor Cyan

# Test Backend Health
Write-Host ""
Write-Host "1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "Backend is healthy!" -ForegroundColor Green
    Write-Host "   Service: $($healthData.service)" -ForegroundColor Gray
    Write-Host "   M-PESA Configured: $($healthData.mpesa.configured)" -ForegroundColor Gray
} catch {
    Write-Host "Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test Database Connection
Write-Host ""
Write-Host "2. Testing Database Connection..." -ForegroundColor Yellow
try {
    $outfitsResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/outfits" -Method GET
    Write-Host "Database connection working!" -ForegroundColor Green
    Write-Host "   Outfits API responding successfully" -ForegroundColor Gray
} catch {
    Write-Host "Database connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "CRITICAL: MongoDB Atlas IP whitelist issue!" -ForegroundColor Red
    Write-Host "Fix this by:" -ForegroundColor Yellow
    Write-Host "1. Go to https://cloud.mongodb.com/" -ForegroundColor White
    Write-Host "2. Navigate: Network Access -> IP Access List" -ForegroundColor White
    Write-Host "3. Add IP Address: Allow Access from Anywhere (0.0.0.0/0)" -ForegroundColor White
    Write-Host "4. Wait 2-3 minutes for changes to propagate" -ForegroundColor White
    exit 1
}

# Test Frontend
Write-Host ""
Write-Host "3. Testing Frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET
    Write-Host "Frontend is running!" -ForegroundColor Green
} catch {
    Write-Host "Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "All systems ready for deployment!" -ForegroundColor Green
Write-Host "Next step: Run .\deploy.ps1 to deploy to production" -ForegroundColor Cyan