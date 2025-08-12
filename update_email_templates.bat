@echo off
echo ========================================
echo EMAIL TEMPLATE UPDATES
echo ========================================
echo.

echo 🎨 Updates Applied:
echo   ✅ Removed purchase ID from all emails
echo   ✅ Changed color scheme from green to blue
echo   ✅ Updated footer links:
echo      • Visit Proprio Link: https://proprio-link.fr/
echo      • Support/Admin: https://proprio-link.fr/contact/
echo.

echo 🔧 Clearing caches to apply changes...
php artisan view:clear
php artisan cache:clear

echo.
echo ✅ Email templates updated successfully!
echo.
echo 📧 Email Color Scheme:
echo   • Header Background: Blue (#1e40af)
echo   • Success Color: Blue (#3b82f6) 
echo   • Detail Boxes: Light Blue (#eff6ff)
echo   • Buttons: Blue (#1e40af)
echo.
echo 🔗 Footer Links Updated:
echo   • "Visit Proprio Link" → https://proprio-link.fr/
echo   • "Support/Admin Support" → https://proprio-link.fr/contact/
echo.
echo The email templates are now ready with the blue theme!
echo Test the payment flow to see the updated emails.
echo.
pause
