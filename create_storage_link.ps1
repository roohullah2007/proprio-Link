# PowerShell script to create storage symlink
$source = "E:\Proprio-Link\webapp\laravel-react-app\storage\app\public"
$target = "E:\Proprio-Link\webapp\laravel-react-app\public\storage"

# Remove existing symlink if it exists
if (Test-Path $target) {
    Remove-Item $target -Force -Recurse
    Write-Host "Removed existing storage link"
}

# Create the symbolic link
try {
    New-Item -ItemType Junction -Path $target -Target $source -Force
    Write-Host "✓ Storage symlink created successfully"
    Write-Host "Source: $source"
    Write-Host "Target: $target"
    
    # Test the link
    if (Test-Path "$target\properties") {
        Write-Host "✓ Symlink is working - properties directory accessible"
    } else {
        Write-Host "✗ Symlink created but properties directory not accessible"
    }
} catch {
    Write-Host "✗ Failed to create symlink: $($_.Exception.Message)"
    Write-Host "Please run PowerShell as Administrator"
}

Read-Host "Press Enter to continue..."
