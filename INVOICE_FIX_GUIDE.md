# 🔧 INVOICE SYSTEM FIX GUIDE

## ❌ Problem
When clicking on "Invoices" in admin view, you get:
```
SQLSTATE[42S02]: Base table or view not found: 1146 Table 'propio.invoices' doesn't exist
```

## ✅ Solution: Run Database Migrations

### Method 1: Command Line (Recommended)
1. Open Command Prompt or Terminal
2. Navigate to your Laravel project:
   ```bash
   cd E:\propio\webapp\laravel-react-app
   ```
3. Run migrations:
   ```bash
   php artisan migrate
   ```

### Method 2: Use Batch File (Windows)
1. Double-click `run_migrations.bat` in your project root
2. This will automatically run the migrations

### Method 3: Manual Database Fix
1. Run the fix script:
   ```bash
   php fix_database.php
   ```
2. This will manually create the required tables

### Method 4: Alternative Migration Commands
If the basic migrate command doesn't work, try:
```bash
# Force run migrations
php artisan migrate --force

# Reset and re-run all migrations
php artisan migrate:fresh

# Check migration status
php artisan migrate:status
```

## 🔍 What This Will Create

The migrations will create these tables:
1. **invoices** - Stores invoice data with PDF paths
2. **contact_purchases** - Stores payment transactions (if not exists)
3. **admin_settings** - SMTP and other admin settings (if not exists)

## ✅ How to Verify Fix

After running migrations:
1. Go to `/admin/invoices` - Should load without errors
2. Go to `/agent/invoices` - Should show empty invoice list
3. Go to `/admin/settings` - SMTP settings should be visible

## 🎯 Expected Results

After the fix:
- ✅ Admin can access invoice management page
- ✅ Agent can access their invoices page  
- ✅ No more database errors
- ✅ SMTP settings appear in admin panel
- ✅ Platform earnings stats work in dashboard

## 🐛 If Issues Persist

If you still get errors:

### Check Database Connection
```bash
php artisan tinker
# Then type: DB::connection()->getPdo();
```

### Verify Migration Files
Check these files exist:
- `database/migrations/*_create_invoices_table.php`
- `database/migrations/*_create_contact_purchases_table.php`
- `database/migrations/*_add_smtp_settings_to_admin_settings.php`

### Manual Table Creation
If migrations fail, run:
```bash
php fix_database.php
```

## 📝 Migration Details

The invoices table includes:
- UUID primary key
- Invoice numbering system
- Agent and property reference
- Amount and currency
- Billing details (JSON)
- PDF file path
- Timestamps

## 🚀 After Fix Works

Once fixed, you can:
1. **Admin**: View all platform invoices and revenue stats
2. **Agent**: Download invoices for their purchases  
3. **System**: Generate professional PDF invoices automatically
4. **Settings**: Configure SMTP for email notifications

Run the migration now to fix the issue! 🎉
