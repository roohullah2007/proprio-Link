# Proprio Link - Deployment Verification Script
# This script helps verify that your deployment is successful

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Proprio Link - Deployment Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://app.proprio-link.fr"

# Function to check if a URL returns 200 OK
function Test-Url {
    param($url)
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            return @{Success = $true; StatusCode = $response.StatusCode}
        }
    }
    catch {
        return @{Success = $false; Error = $_.Exception.Message}
    }
}

Write-Host "Checking deployment status..." -ForegroundColor Yellow
Write-Host ""

# Check manifest.json
Write-Host "1. Checking manifest.json..." -ForegroundColor White
$manifestUrl = "$baseUrl/build/manifest.json"
$result = Test-Url $manifestUrl
if ($result.Success) {
    Write-Host "   ✓ Manifest accessible" -ForegroundColor Green
    
    # Get manifest content to check a specific asset
    try {
        $manifest = Invoke-RestMethod -Uri $manifestUrl
        $sampleAsset = $manifest.'resources/js/app.jsx'.file
        Write-Host "   → Main app file: $sampleAsset" -ForegroundColor Gray
        
        # Check if the main app file is accessible
        $appUrl = "$baseUrl/build/$sampleAsset"
        $appResult = Test-Url $appUrl
        if ($appResult.Success) {
            Write-Host "   ✓ Main app file accessible" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Main app file NOT accessible" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "   ! Could not parse manifest" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✗ Manifest NOT accessible" -ForegroundColor Red
    Write-Host "   Error: $($result.Error)" -ForegroundColor Red
}

Write-Host ""

# Check main application page
Write-Host "2. Checking main application..." -ForegroundColor White
$mainResult = Test-Url $baseUrl
if ($mainResult.Success) {
    Write-Host "   ✓ Application is accessible" -ForegroundColor Green
} else {
    Write-Host "   ✗ Application NOT accessible" -ForegroundColor Red
}

Write-Host ""

# Get local manifest hash for comparison
Write-Host "3. Local vs Remote Comparison..." -ForegroundColor White
if (Test-Path "public\build\manifest.json") {
    $localHash = (Get-FileHash "public\build\manifest.json" -Algorithm SHA256).Hash
    Write-Host "   Local manifest hash: $($localHash.Substring(0, 16))..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "   To verify remote matches local:" -ForegroundColor Yellow
    Write-Host "   1. Download $manifestUrl" -ForegroundColor Gray
    Write-Host "   2. Compare the file contents" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TROUBLESHOOTING TIPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "If assets are not loading:" -ForegroundColor White
Write-Host "1. Clear browser cache (Ctrl+Shift+R)" -ForegroundColor Gray
Write-Host "2. Check in incognito/private mode" -ForegroundColor Gray
Write-Host "3. Clear Hostinger server cache" -ForegroundColor Gray
Write-Host "4. Ensure entire build folder was replaced" -ForegroundColor Gray
Write-Host "5. Check .htaccess file on server" -ForegroundColor Gray
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")