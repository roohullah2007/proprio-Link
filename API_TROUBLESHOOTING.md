# 🔧 Propio API Troubleshooting Guide

## ❌ **Problem**: API Route Not Working
**Error**: "Failed to connect to API - Check your API URL setting"

---

## 🕵️ **Diagnostic Steps**

### **Step 1: Verify Laravel Server is Running**
```bash
cd E:\Propio\webapp\laravel-react-app
php artisan serve --host=127.0.0.1 --port=8000
```
**Expected Output**: `Server running on [http://127.0.0.1:8000]`

### **Step 2: Test Basic API Connection**
Open browser and visit: **http://localhost:8000/api/test**

**Expected Response**:
```json
{
  "message": "API is working!",
  "time": "2025-06-26T..."
}
```

### **Step 3: Test WordPress Debug Endpoint**
Visit: **http://localhost:8000/api/debug/wordpress**

**Expected Response**:
```json
{
  "success": true,
  "debug": {
    "database_connected": true,
    "total_properties": 0,
    "property_types": [],
    "published_properties": 0,
    "controller_exists": true
  }
}
```

### **Step 4: Test WordPress Property Types Endpoint**
Visit: **http://localhost:8000/api/wordpress/property-types**

**Expected Response**:
```json
{
  "success": true,
  "data": []
}
```

---

## 🔧 **Common Fixes**

### **Fix 1: Clear Laravel Caches**
```bash
cd E:\Propio\webapp\laravel-react-app
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### **Fix 2: Check Route Registration**
```bash
php artisan route:list --name=wordpress
```
**Should show 5 WordPress routes**

### **Fix 3: Verify API URL in WordPress Plugin**
1. **WordPress Admin** → **Settings** → **Propio Integration**
2. **API URL**: Should be exactly `http://localhost:8000/api/wordpress/`
3. **Include trailing slash**: Very important!

### **Fix 4: Check CORS Headers**
The API now includes CORS headers. If still having issues, check browser console for CORS errors.

---

## 📍 **Testing URLs**

### **Laravel Server URLs**:
- **Basic API**: http://localhost:8000/api/test
- **Debug Info**: http://localhost:8000/api/debug/wordpress
- **Property Types**: http://localhost:8000/api/wordpress/property-types
- **Cities**: http://localhost:8000/api/wordpress/cities
- **Properties**: http://localhost:8000/api/wordpress/properties
- **Featured**: http://localhost:8000/api/wordpress/featured
- **Stats**: http://localhost:8000/api/wordpress/stats

### **WordPress Plugin URLs**:
- **Settings**: http://localhost/wordpress-2/wp-admin/options-general.php?page=propio-integration

---

## 🛠️ **Step-by-Step Fix Process**

### **Step 1: Start Laravel Server**
```bash
# Open Command Prompt/PowerShell
cd E:\Propio\webapp\laravel-react-app
php artisan serve --host=127.0.0.1 --port=8000
```
**Keep this terminal window open**

### **Step 2: Test API in Browser**
1. **Open browser**
2. **Visit**: http://localhost:8000/api/test
3. **Should see**: `{"message":"API is working!","time":"..."}`

### **Step 3: Test WordPress Endpoint**
1. **Visit**: http://localhost:8000/api/wordpress/property-types
2. **Should see**: `{"success":true,"data":[]}`

### **Step 4: Update WordPress Plugin**
1. **WordPress Admin** → **Settings** → **Propio Integration**
2. **API URL**: `http://localhost:8000/api/wordpress/`
3. **Save Settings**
4. **Check API Status** - Should show ✅ Success

### **Step 5: Verify in Plugin Settings**
The **API Status** section should now show:
- ✅ **API connection successful!**
- **Found X property types**

---

## 🚨 **If Still Not Working**

### **Check These Common Issues**:

1. **Laravel Server Not Running**
   - Make sure `php artisan serve` is running
   - Check for error messages in terminal

2. **Wrong API URL**
   - Must be exactly: `http://localhost:8000/api/wordpress/`
   - Include the trailing slash
   - Use `localhost`, not `127.0.0.1`

3. **Firewall/Antivirus Blocking**
   - Temporarily disable firewall
   - Add exception for port 8000

4. **XAMPP Port Conflicts**
   - Check if port 8000 is free
   - Try different port: `php artisan serve --port=8080`

5. **Browser Console Errors**
   - Open Developer Tools (F12)
   - Check Console tab for CORS or network errors

---

## 📞 **Quick Verification Checklist**

- [ ] Laravel server running on port 8000
- [ ] http://localhost:8000/api/test returns JSON
- [ ] http://localhost:8000/api/wordpress/property-types returns JSON
- [ ] WordPress plugin API URL is `http://localhost:8000/api/wordpress/`
- [ ] API Status shows green checkmark in WordPress admin

---

## 🎯 **Expected End Result**

When everything is working correctly:

1. **Laravel Terminal**: Shows `Server running on [http://127.0.0.1:8000]`
2. **API Test**: http://localhost:8000/api/test returns success JSON
3. **WordPress Admin**: API Status shows ✅ **API connection successful!**
4. **Plugin Ready**: All shortcodes available in settings sidebar

**Once these are working, the WordPress plugin shortcodes will function properly!** ✨
