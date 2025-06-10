# 🚀 DripCheck Production Deployment Script
Write-Host "🚀 Starting DripCheck Deployment..." -ForegroundColor Cyan
Write-Host "This will deploy your social fashion app to production!" -ForegroundColor Green

# Check prerequisites
Write-Host "`n📋 Checking Prerequisites..." -ForegroundColor Yellow

# Check if git is available
try {
    git --version | Out-Null
    Write-Host "✅ Git is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    npm --version | Out-Null
    Write-Host "✅ NPM is available" -ForegroundColor Green
} catch {
    Write-Host "❌ NPM not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Test local connection first
Write-Host "`n🔍 Testing Local Setup..." -ForegroundColor Yellow
& .\test-connection.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Local setup has issues. Fix them before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "`n🌐 Ready to Deploy!" -ForegroundColor Green
Write-Host "Choose deployment option:" -ForegroundColor Cyan
Write-Host "1. Frontend Only (Vercel)" -ForegroundColor White
Write-Host "2. Backend Only (Railway)" -ForegroundColor White
Write-Host "3. Full Stack (Frontend + Backend)" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White

$choice = Read-Host "`nEnter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`n🎨 Deploying Frontend to Vercel..." -ForegroundColor Cyan
        
        # Install Vercel CLI if not exists
        try {
            vercel --version | Out-Null
            Write-Host "✅ Vercel CLI found" -ForegroundColor Green
        } catch {
            Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        # Build and deploy frontend
        Set-Location "drip-check-client"
        Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
        npm run build
        
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
        vercel --prod
        
        Write-Host "`n✅ Frontend deployed!" -ForegroundColor Green
        Write-Host "Update your backend CORS settings with the new Vercel URL" -ForegroundColor Yellow
    }
    
    "2" {
        Write-Host "`n⚡ Backend deployment requires manual setup on Railway..." -ForegroundColor Yellow
        Write-Host "1. Go to https://railway.app/" -ForegroundColor White
        Write-Host "2. Sign up with GitHub" -ForegroundColor White
        Write-Host "3. Deploy from GitHub repo" -ForegroundColor White
        Write-Host "4. Set environment variables from .env file" -ForegroundColor White
        Write-Host "5. Deploy!" -ForegroundColor White
    }
    
    "3" {
        Write-Host "`n🚀 Full Stack Deployment Guide:" -ForegroundColor Cyan
        Write-Host "This requires both Vercel and Railway setup..." -ForegroundColor Yellow
        
        # Frontend deployment
        Write-Host "`n1. Deploying Frontend..." -ForegroundColor Green
        try {
            vercel --version | Out-Null
        } catch {
            npm install -g vercel
        }
        
        Set-Location "drip-check-client"
        npm run build
        vercel --prod
        
        Set-Location ".."
        
        Write-Host "`n2. Backend deployment instructions:" -ForegroundColor Green
        Write-Host "   - Go to https://railway.app/" -ForegroundColor White
        Write-Host "   - Connect your GitHub repo" -ForegroundColor White
        Write-Host "   - Set environment variables" -ForegroundColor White
        Write-Host "   - Deploy backend" -ForegroundColor White
    }
    
    "4" {
        Write-Host "Deployment cancelled." -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n🎉 Deployment process completed!" -ForegroundColor Green
Write-Host "Don't forget to:" -ForegroundColor Yellow
Write-Host "1. Update environment variables in production" -ForegroundColor White
Write-Host "2. Update Clerk redirect URLs" -ForegroundColor White
Write-Host "3. Test M-PESA integration" -ForegroundColor White
Write-Host "4. Monitor logs for any issues" -ForegroundColor White