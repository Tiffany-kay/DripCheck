# 🚀 LIVE DEPLOYMENT - DripCheck
# Deploy your social fashion app to production NOW!

Write-Host "🚀 DripCheck - Going LIVE!" -ForegroundColor Cyan
Write-Host "Deploying your social fashion app to production..." -ForegroundColor Green

# Step 1: Install Vercel CLI
Write-Host "`n📦 Installing Vercel CLI..." -ForegroundColor Yellow
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI already installed" -ForegroundColor Green
} catch {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Step 2: Build and Deploy Frontend
Write-Host "`n🎨 Deploying Frontend to Vercel..." -ForegroundColor Cyan
Set-Location "drip-check-client"

# Create production environment file
Write-Host "Setting up production environment..." -ForegroundColor Yellow
$prodEnv = @"
VITE_CLERK_PUBLISHABLE_KEY=pk_test_c3Rhci1zaGVlcC02LmNsZXJrLmFjY291bnRzLmRldiQ
VITE_API_URL=https://dripcheck-production.up.railway.app
VITE_NODE_ENV=production
"@
$prodEnv | Out-File -FilePath ".env.production" -Encoding utf8

Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
npm run build

Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "Follow the prompts:"
Write-Host "- Project name: dripcheck"
Write-Host "- Deploy to production: Yes"
vercel --prod

Set-Location ".."

Write-Host "`n⚡ Next: Deploy Backend to Railway" -ForegroundColor Cyan
Write-Host "1. Go to: https://railway.app/"
Write-Host "2. Sign up with GitHub"
Write-Host "3. Create New Project -> Deploy from GitHub"
Write-Host "4. Select your DripCheck repository"
Write-Host "5. Choose drip-check-server folder"
Write-Host "6. Add environment variables from .env file"
Write-Host "7. Deploy!"

Write-Host "`n🎉 Your DripCheck app will be LIVE in 15 minutes!" -ForegroundColor Green
