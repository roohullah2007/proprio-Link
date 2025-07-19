// Quick test script for browser console
// Run this in your browser console to test translations

console.log('=== Translation Debug Test ===');

// Check current page props
if (window._inertia_props) {
    console.log('Current locale:', window._inertia_props.locale);
    console.log('Translations loaded:', Object.keys(window._inertia_props.translations || {}).length);
    console.log('Sample translations:', {
        'Tableau de bord Agent': window._inertia_props.translations?.['Tableau de bord Agent'],
        'Contacts achetés': window._inertia_props.translations?.['Contacts achetés'],
        'Budget dépensé': window._inertia_props.translations?.['Budget dépensé'],
        'Appartement': window._inertia_props.translations?.['Appartement'],
        'Maison': window._inertia_props.translations?.['Maison']
    });
} else {
    console.log('No Inertia props found - this might be the issue!');
}

// Test translation function if available
if (typeof __ !== 'undefined') {
    console.log('Translation function test:');
    console.log('__("Tableau de bord Agent"):', __('Tableau de bord Agent'));
    console.log('__("Contacts achetés"):', __('Contacts achetés'));
    console.log('__("Appartement"):', __('Appartement'));
} else {
    console.log('Translation function __ not available in global scope');
}

console.log('=== End Debug Test ===');
