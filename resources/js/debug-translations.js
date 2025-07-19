// Test Translation Debugging Script
// Add this to browser console to debug translation issues

console.log('=== Translation Debug ===');
console.log('Current locale:', window.location.search.includes('locale') || 'fr (default)');

// Check if Inertia props are available
if (window.page && window.page.props) {
    const { locale, translations } = window.page.props;
    console.log('Inertia locale:', locale);
    console.log('Translation count:', Object.keys(translations || {}).length);
    
    // Test specific admin translations
    const adminKeys = [
        'Tableau de bord admin',
        'Propriétés en attente', 
        'Propriétés publiées',
        'Propriétés rejetées',
        'Utilisateurs totaux',
        'Actions rapides',
        'Modérer les propriétés',
        'Voir tout'
    ];
    
    console.log('\n--- Admin Translation Tests ---');
    adminKeys.forEach(key => {
        const translation = translations[key];
        console.log(`"${key}" -> "${translation || 'NOT FOUND'}"`);
    });
    
    // Test missing translations
    const missingKeys = adminKeys.filter(key => !translations[key]);
    if (missingKeys.length > 0) {
        console.warn('Missing translations:', missingKeys);
    }
    
} else {
    console.warn('Inertia props not available');
}

// Test translation function if available
if (window.__ || (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)) {
    console.log('\n--- Translation Function Test ---');
    const testKeys = ['Tableau de bord admin', 'Propriétés en attente'];
    testKeys.forEach(key => {
        try {
            // This would test the actual __ function if available
            console.log(`__(${key}) would return translation`);
        } catch (e) {
            console.error('Translation function error:', e);
        }
    });
}

console.log('=== End Debug ===');
