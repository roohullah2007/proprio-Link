# Deployment Checklist for Proprio-Link

## File Structure on Server
```
/home/your-user/
├── public_html/           # All files from local 'public' folder
│   ├── index.php          # Use index_production.php content
│   ├── .htaccess          # Use .htaccess_production content
│   ├── build/             # Vite build output
│   ├── assets/            # Static assets
│   └── storage/           # Symlink to ../proprio/storage/app/public
└── proprio/               # Laravel application files
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── lang/
    ├── resources/
    ├── routes/
    ├── storage/           # Must be writable (chmod 775)
    ├── vendor/            # Composer dependencies
    ├── .env               # Use .env.production as template
    └── artisan
```

## Step-by-Step Deployment

### 1. Upload Files
- Upload `index_production.php` to `public_html/index.php`
- Upload `.htaccess_production` to `public_html/.htaccess`
- Upload all other public files to `public_html/`
- Upload Laravel app files to `../proprio/`

### 2. Configure Environment
```bash
cd ~/proprio
cp .env.production .env
# Edit .env and update:
# - DB_DATABASE, DB_USERNAME, DB_PASSWORD
# - MAIL settings
# - STRIPE keys
```

### 3. Set Permissions
```bash
cd ~/proprio
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### 4. Create Storage Symlink
```bash
cd ~/public_html
ln -s ../proprio/storage/app/public storage
```

### 5. Install Dependencies (if not uploaded)
```bash
cd ~/proprio
composer install --no-dev --optimize-autoloader
```

### 6. Run Laravel Commands
```bash
cd ~/proprio
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link
```

### 7. Verify Installation
- Visit https://app.proprio-link.fr
- Check browser console for any 404 errors
- Test login/registration
- Verify asset loading (CSS, JS, images)

## Troubleshooting

### Assets not loading (404 errors)
1. Check that `APP_URL` and `ASSET_URL` in `.env` are set to `https://app.proprio-link.fr`
2. Verify build files exist in `public_html/build/`
3. Clear browser cache

### 500 Internal Server Error
1. Check Laravel logs: `~/proprio/storage/logs/laravel.log`
2. Verify `.env` file exists and is readable
3. Check file permissions on storage and cache directories

### Database Connection Error
1. Verify database credentials in `.env`
2. Check if database exists and user has permissions
3. Run migrations: `php artisan migrate --force`

### Session/Cookie Issues
1. Set `SESSION_DOMAIN=.proprio-link.fr` in `.env`
2. Set `SESSION_SECURE_COOKIE=true` for HTTPS
3. Clear cookies and try again

## Important Notes
- Always backup database before running migrations
- Keep `APP_DEBUG=false` in production
- Ensure HTTPS is properly configured
- Set up cron job for Laravel scheduler if needed