# Complete Deployment Guide for Proprio-Link

## Prerequisites
- Server with PHP 8.1+ and MySQL
- Composer installed on server
- Node.js for building assets (local only)
- SSH access to server

## Step 1: Prepare Files Locally

### 1.1 Build Production Assets
```bash
npm install
npm run build
```

### 1.2 Run Deployment Script
```bash
deploy.bat
```
This creates a `deployment` folder with the correct structure.

## Step 2: Upload Files to Server

### 2.1 Server Directory Structure
Your server should have this structure:
```
/home/username/
├── public_html/        # Public web directory
└── proprio/           # Laravel application (outside web root)
```

### 2.2 Upload Files
1. Upload contents of `deployment/public_html/` to server's `public_html/`
2. Upload contents of `deployment/proprio/` to server's `proprio/`

Using FTP/SFTP:
- Connect to your server
- Navigate to `/home/username/`
- Upload the files maintaining the structure

## Step 3: Server Configuration

### 3.1 SSH into your server
```bash
ssh username@app.proprio-link.fr
```

### 3.2 Configure Environment
```bash
cd ~/proprio
cp .env.example .env
nano .env
```

Update these values in `.env`:
```
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_specific_password

STRIPE_KEY=pk_live_your_publishable_key
STRIPE_SECRET=sk_live_your_secret_key
```

### 3.3 Set Permissions
```bash
cd ~/proprio
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### 3.4 Install Dependencies (if vendor not uploaded)
```bash
cd ~/proprio
composer install --no-dev --optimize-autoloader
```

### 3.5 Generate Application Key
```bash
php artisan key:generate
```

### 3.6 Run Migrations
```bash
php artisan migrate --force
```

### 3.7 Create Storage Symlink
```bash
cd ~/public_html
ln -s ../proprio/storage/app/public storage
```

### 3.8 Optimize Laravel
```bash
cd ~/proprio
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

## Step 4: Verify Installation

### 4.1 Check Website
1. Visit https://app.proprio-link.fr
2. Check browser console (F12) for any errors
3. Verify CSS and JS are loading

### 4.2 Test Functionality
- [ ] Homepage loads correctly
- [ ] Login/Register works
- [ ] Images display properly
- [ ] Forms submit correctly
- [ ] Email sending works

## Step 5: Troubleshooting

### Issue: 500 Internal Server Error
```bash
# Check Laravel logs
cat ~/proprio/storage/logs/laravel.log

# Check permissions
ls -la ~/proprio/storage

# Clear caches
cd ~/proprio
php artisan config:clear
php artisan cache:clear
```

### Issue: Assets not loading (404)
```bash
# Verify build files exist
ls ~/public_html/build/

# Check .env settings
grep "APP_URL\|ASSET_URL" ~/proprio/.env
```

### Issue: Database connection error
```bash
# Test database connection
cd ~/proprio
php artisan tinker
>>> DB::connection()->getPdo();
```

### Issue: Emails not sending
```bash
# Test email configuration
cd ~/proprio
php artisan tinker
>>> Mail::raw('Test email', function($message) {
    $message->to('test@example.com')->subject('Test');
});
```

## Step 6: Security Checklist

- [ ] `.env` file is not accessible from web
- [ ] `APP_DEBUG=false` in production
- [ ] Database uses strong password
- [ ] SSL certificate is active
- [ ] Storage directory has proper permissions
- [ ] Admin credentials are secure

## Step 7: Maintenance

### Update Application
```bash
# Pull latest changes
cd ~/proprio
git pull origin main

# Update dependencies
composer install --no-dev
npm install && npm run build

# Run migrations
php artisan migrate --force

# Clear caches
php artisan optimize:clear
php artisan optimize
```

### Backup Database
```bash
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
```

### Monitor Logs
```bash
tail -f ~/proprio/storage/logs/laravel.log
```

## Step 8: Cron Jobs (Optional)

Add to crontab for scheduled tasks:
```bash
crontab -e

# Add this line for Laravel scheduler
* * * * * cd /home/username/proprio && php artisan schedule:run >> /dev/null 2>&1
```

## Important Notes

1. **Never commit `.env` file to version control**
2. **Always backup before updates**
3. **Test in staging environment first if possible**
4. **Keep PHP and dependencies updated**
5. **Monitor server resources and logs**

## Support

If you encounter issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check server error logs
3. Verify all configuration steps were completed
4. Ensure server meets Laravel requirements

---

Last updated: 2025-08-09