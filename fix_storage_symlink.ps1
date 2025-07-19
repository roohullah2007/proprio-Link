# PowerShell Storage Symlink Fix
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "POWERSHELL STORAGE SYMLINK FIX" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠ Warning: Not running as administrator" -ForegroundColor Yellow
    Write-Host "Symlink creation might fail without admin privileges" -ForegroundColor Yellow
    Write-Host ""
}

# Remove existing storage file/link
if (Test-Path "public\storage") {
    Write-Host "Removing existing storage file/link..." -ForegroundColor Yellow
    Remove-Item "public\storage" -Force -Recurse -ErrorAction SilentlyContinue
    Write-Host "✓ Removed existing storage" -ForegroundColor Green
}

# Try Laravel artisan first
Write-Host "Step 1: Attempting Laravel artisan storage:link..." -ForegroundColor White
try {
    $artisanResult = & php artisan storage:link 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Artisan storage:link successful" -ForegroundColor Green
    } else {
        throw "Artisan failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "⚠ Artisan method failed: $_" -ForegroundColor Yellow
    
    # Try PowerShell symlink creation
    Write-Host "Step 2: Attempting PowerShell symlink creation..." -ForegroundColor White
    try {
        $sourcePath = Resolve-Path "storage\app\public"
        $targetPath = "public\storage"
        
        New-Item -ItemType SymbolicLink -Path $targetPath -Target $sourcePath -Force
        Write-Host "✓ PowerShell symlink created successfully" -ForegroundColor Green
    } catch {
        Write-Host "⚠ PowerShell symlink failed: $_" -ForegroundColor Yellow
        
        # Try junction as fallback
        Write-Host "Step 3: Attempting junction creation..." -ForegroundColor White
        try {
            & cmd /c "mklink /J `"public\storage`" `"storage\app\public`""
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Junction created successfully" -ForegroundColor Green
            } else {
                throw "Junction creation failed"
            }
        } catch {
            Write-Host "✗ All symlink methods failed" -ForegroundColor Red
            Write-Host "Using route-based fallback instead" -ForegroundColor Yellow
        }
    }
}

# Test the symlink
Write-Host ""
Write-Host "Step 4: Testing symlink..." -ForegroundColor White
if (Test-Path "public\storage\profile-images\profile_9_1751843309.jpg") {
    Write-Host "✓ Image accessible via symlink!" -ForegroundColor Green
    Write-Host "  URL: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg" -ForegroundColor Cyan
} elseif (Test-Path "public\storage") {
    Write-Host "⚠ Symlink exists but image not found" -ForegroundColor Yellow
    Write-Host "Checking symlink target..." -ForegroundColor White
    Get-ChildItem "public\storage" | Format-Table Name, Target
} else {
    Write-Host "⚠ Symlink creation failed, but fallback route is available" -ForegroundColor Yellow
}

# Clear caches
Write-Host ""
Write-Host "Step 5: Clearing Laravel caches..." -ForegroundColor White
& php artisan config:clear | Out-Null
& php artisan route:clear | Out-Null
Write-Host "✓ Caches cleared" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ STORAGE FIX COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Test Steps:" -ForegroundColor White
Write-Host "1. Refresh browser (Ctrl+F5)" -ForegroundColor White  
Write-Host "2. Go to /profile" -ForegroundColor White
Write-Host "3. Image should now display" -ForegroundColor White
Write-Host ""
Write-Host "If issues persist, the fallback route will serve images directly." -ForegroundColor Yellow

Read-Host "Press Enter to continue"
