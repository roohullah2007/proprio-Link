# PROFILE IMAGE UPLOAD TROUBLESHOOTING GUIDE

## Current Issue
Profile images are not being saved to the database because the `profile_image` column doesn't exist in the users table.

## Step-by-Step Fix

### Step 1: Run the Database Migration
Execute one of these methods:

**Method A: Use the comprehensive fix script**
```bash
# Run this batch file
COMPLETE_PROFILE_FIX.bat
```

**Method B: Manual migration**
```bash
cd E:\Proprio-Link\webapp\laravel-react-app
php artisan migrate --path=database/migrations/2025_07_07_120000_add_profile_image_to_users_table.php
```

**Method C: Run all migrations**
```bash
php artisan migrate
```

### Step 2: Create Storage Link
```bash
php artisan storage:link
```

### Step 3: Create Profile Images Directory
```bash
mkdir storage/app/public/profile-images
```

### Step 4: Verify Database Column
Run this to check if the column was added:
```bash
php fix_profile_image_column.php
```

## Common Issues and Solutions

### Issue 1: Migration Already Exists Error
If you get "Migration already exists", run:
```bash
php artisan migrate:rollback --step=1
php artisan migrate
```

### Issue 2: Permission Denied
Make sure the storage directory is writable:
```bash
chmod -R 755 storage/
chmod -R 755 public/storage/
```

### Issue 3: Storage Link Missing
```bash
php artisan storage:link --force
```

### Issue 4: Database Connection Issues
Check your `.env` file for correct database credentials:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Verification Steps

### 1. Check Database Structure
```sql
DESCRIBE users;
```
You should see a `profile_image` column.

### 2. Check Storage Directory
Verify these directories exist:
- `storage/app/public/profile-images/`
- `public/storage/` (symbolic link)

### 3. Test Upload
1. Go to Profile Settings
2. Upload an image
3. Click "Save Changes"
4. Reload the page
5. Image should appear in header and profile sections

## If Still Not Working

### Check Laravel Logs
Look at `storage/logs/laravel.log` for error messages.

### Enable Debug Mode
In `.env` file:
```
APP_DEBUG=true
LOG_LEVEL=debug
```

### Manual Database Fix
If migration fails, manually add the column:
```sql
ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) NULL AFTER licence_professionnelle_url;
```

## Expected Behavior After Fix

1. ✅ Upload button works
2. ✅ Image preview shows immediately
3. ✅ After saving, image persists after page reload
4. ✅ Image appears in navigation header
5. ✅ Image appears in profile page header
6. ✅ Files stored in `storage/app/public/profile-images/`

## Files Created for This Fix

- `COMPLETE_PROFILE_FIX.bat` - Comprehensive fix script
- `fix_profile_image_column.php` - Column verification script
- `run_profile_migration_fix.bat` - Migration runner
- `ProfileController_DEBUG.php` - Debug version of controller

## Support

If issues persist:
1. Check `storage/logs/laravel.log`
2. Verify database connection
3. Ensure proper file permissions
4. Contact administrator if needed
