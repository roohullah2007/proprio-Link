# Global Language Switcher Documentation

## Overview
The Propio application now supports both French and English languages with a global language switcher that allows users to seamlessly switch between languages.

## Features Implemented

### ✅ Backend Language Support
- **Language Controller**: Handles language switching requests
- **SetLocale Middleware**: Automatically sets the application locale based on user preference
- **Session Persistence**: Language preference is stored in user session
- **User Language Preference**: Language preference is stored in user profile (database)
- **Multiple Language Files**: Complete French and English translation files

### ✅ Frontend Language Switcher
- **LanguageSwitcher Component**: Elegant dropdown component with flags
- **Global Placement**: Available in all layouts (Guest, Authenticated, Welcome)
- **Translation Helper**: Utility function for translating strings in React components
- **Automatic Refresh**: Page refreshes after language change to ensure complete translation

### ✅ Translation System
- **JSON Translation Files**: 
  - `lang/fr.json` - French translations
  - `lang/en.json` - English translations
- **Laravel Language Files**:
  - Authentication messages (fr/en)
  - Validation messages (fr/en)
  - Password reset messages (fr/en)
  - Pagination messages (fr/en)

## How to Use

### For Users
1. **Language Switcher Location**:
   - Top right corner on guest pages (login, register, welcome)
   - Top navigation bar when logged in
   - Mobile menu when on mobile devices

2. **Switching Languages**:
   - Click the language switcher (shows current language flag + code)
   - Select desired language from dropdown
   - Page automatically refreshes with new language

### For Developers

#### Adding New Translations
1. **Add to JSON files**:
   ```json
   // lang/fr.json
   "Your new text": "Votre nouveau texte"
   
   // lang/en.json  
   "Your new text": "Your new text"
   ```

2. **Use in React components**:
   ```jsx
   import { __ } from '@/Utils/translations';
   
   function MyComponent() {
       return <h1>{__("Your new text")}</h1>;
   }
   ```

3. **Use with placeholders**:
   ```jsx
   // In translation files:
   "Welcome, :name!": "Bienvenue, :name !"
   
   // In component:
   {__("Welcome, :name!", { name: user.prenom })}
   ```

#### Language Files Structure
```
lang/
├── fr/
│   ├── auth.php
│   ├── passwords.php
│   ├── pagination.php
│   └── validation.php
├── en/
│   ├── auth.php
│   ├── passwords.php
│   ├── pagination.php
│   └── validation.php
├── fr.json
└── en.json
```

## Technical Implementation

### Routes
```php
// Language switching routes
Route::post('/language/change', [LanguageController::class, 'change'])->name('language.change');
Route::get('/language/current', [LanguageController::class, 'current'])->name('language.current');
```

### Middleware Stack
```php
// bootstrap/app.php
$middleware->web(append: [
    \App\Http\Middleware\HandleInertiaRequests::class,
    \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
    \App\Http\Middleware\SetLocale::class, // Language middleware
]);
```

### Database Schema
```sql
-- Users table includes language preference
ALTER TABLE users ADD COLUMN language VARCHAR(2) DEFAULT 'fr';
```

## Supported Languages
- 🇫🇷 **French (fr)** - Default language
- 🇬🇧 **English (en)** - Secondary language

## Language Switcher Component Features
- **Visual Indicators**: Flag emojis and language codes
- **Dropdown Interface**: Clean, accessible dropdown menu
- **Active State**: Shows currently selected language
- **Responsive Design**: Works on desktop and mobile
- **Smooth Transitions**: Animated dropdown with proper focus management

## Benefits
1. **User Experience**: Users can use the app in their preferred language
2. **Accessibility**: Supports international users
3. **Scalability**: Easy to add more languages in the future
4. **Persistence**: Language preference is remembered across sessions
5. **Complete Coverage**: All user-facing text is translatable

## Testing
The language switcher includes comprehensive tests:
- Default language behavior
- Language switching functionality
- Invalid language handling
- Session persistence
- API endpoint responses

## Future Enhancements
- **Browser Language Detection**: Automatically detect user's browser language
- **More Languages**: Spanish, German, Italian, etc.
- **Right-to-Left Support**: For Arabic, Hebrew, etc.
- **Regional Variations**: Canadian French, British English, etc.
- **Translation Management**: Admin interface for managing translations

## Usage Examples

### Registration Form (Multi-language)
```jsx
// Before
<h2>Créer un compte Propio</h2>

// After  
<h2>{__("Create a Propio Account")}</h2>
```

### User Messages
```jsx
// Before
"Bienvenue, Jean Dupont !"

// After
{__("Welcome, :name!", { name: `${user.prenom} ${user.nom}` })}
```

### Form Labels
```jsx
// Before
<InputLabel value="Adresse email *" />

// After
<InputLabel value={__("Email address") + " *"} />
```

The language switcher provides a professional, user-friendly way to support multiple languages while maintaining the French-first approach of the Propio platform.
