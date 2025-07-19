@echo off
cd /d "E:\propio\webapp\laravel-react-app"
echo.
echo ==============================================
echo   GENERATING MISSING INVOICES
echo ==============================================
echo.
echo This will create invoices for successful purchases
echo that don't have invoices yet.
echo.
pause
echo.
echo Running invoice generation...
php generate_missing_invoices.php
echo.
echo ==============================================
echo   INVOICE GENERATION COMPLETE
echo ==============================================
echo.
echo You can now check:
echo - Admin invoices: http://127.0.0.1:8000/admin/invoices
echo - Agent invoices: http://127.0.0.1:8000/agent/invoices
echo.
pause
