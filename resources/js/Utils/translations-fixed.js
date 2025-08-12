/**
 * Improved translation utilities with better error handling and debugging
 */

import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

/**
 * Debug flag - set to false in production
 */
const DEBUG_TRANSLATIONS = true;

/**
 * Translation cache to avoid repeated lookups
 */
let translationCache = {};
let currentLocale = null;

/**
 * Safe translation hook that maintains hook order
 */
export const useTranslations = () => {
    const { props } = usePage();
    
    // Memoize translations to avoid re-computation
    const translations = useMemo(() => {
        const newTranslations = props.translations || {};
        const locale = props.locale || 'fr';
        
        // Update cache if locale changed
        if (currentLocale !== locale) {
            translationCache = newTranslations;
            currentLocale = locale;
            
            if (DEBUG_TRANSLATIONS) {
                console.log('🌐 Translation cache updated:', {
                    locale,
                    translationCount: Object.keys(newTranslations).length,
                    sampleKeys: Object.keys(newTranslations).slice(0, 5)
                });
            }
        }
        
        return newTranslations;
    }, [props.translations, props.locale]);
    
    const locale = useMemo(() => props.locale || 'fr', [props.locale]);
    
    // Memoize translation function to maintain referential equality
    const translate = useCallback((key, replacements = {}) => {
        return translateKey(key, replacements, translations, locale);
    }, [translations, locale]);

    return { __: translate, locale, translations };
};

/**
 * Direct translation function - does not use hooks
 * Safe to use outside of React components
 */
export const __ = (key, replacements = {}) => {
    try {
        // Try to get translations from window object first (set by Inertia)
        let translations = translationCache;
        let locale = currentLocale;
        
        // Fallback to window.page if cache is empty
        if (Object.keys(translations).length === 0 && window?.page?.props) {
            translations = window.page.props.translations || {};
            locale = window.page.props.locale || 'fr';
            
            // Update cache
            translationCache = translations;
            currentLocale = locale;
        }
        
        return translateKey(key, replacements, translations, locale);
    } catch (error) {
        if (DEBUG_TRANSLATIONS) {
            console.error('❌ Translation error for key:', key, error);
        }
        return key;
    }
};

/**
 * Core translation function
 */
function translateKey(key, replacements = {}, translations = {}, locale = 'fr') {
    try {
        let translation = translations[key];
        
        // If translation not found, try case-insensitive search
        if (!translation) {
            const lowerKey = key.toLowerCase();
            const foundKey = Object.keys(translations).find(k => k.toLowerCase() === lowerKey);
            if (foundKey) {
                translation = translations[foundKey];
            }
        }
        
        // If still not found, try fallback strategies
        if (!translation) {
            translation = handleMissingTranslation(key, translations, locale);
        }
        
        // Handle replacements
        if (translation && typeof translation === 'string') {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation.replace(
                    new RegExp(`:${placeholder}`, 'g'), 
                    replacements[placeholder]
                );
            });
        }
        
        return translation;
    } catch (error) {
        if (DEBUG_TRANSLATIONS) {
            console.error('❌ Translation processing error for key:', key, error);
        }
        return key;
    }
}

/**
 * Handle missing translation with fallback strategies
 */
function handleMissingTranslation(key, translations, locale) {
    // Log missing translation only once per key
    if (DEBUG_TRANSLATIONS) {
        if (!window._missing_translations) {
            window._missing_translations = new Set();
        }
        if (!window._missing_translations.has(key)) {
            console.warn(`🔍 Translation missing for key: "${key}" in locale: ${locale}`);
            console.log('Available keys sample:', Object.keys(translations).slice(0, 10));
            window._missing_translations.add(key);
        }
    }
    
    // Try to find similar keys (fuzzy matching)
    const similarKey = findSimilarKey(key, translations);
    if (similarKey) {
        if (DEBUG_TRANSLATIONS) {
            console.log(`🎯 Found similar key for "${key}": "${similarKey}"`);
        }
        return translations[similarKey];
    }
    
    // Return the key as fallback
    return key;
}

/**
 * Find similar translation key using fuzzy matching
 */
function findSimilarKey(searchKey, translations) {
    const keys = Object.keys(translations);
    const searchKeyLower = searchKey.toLowerCase();
    
    // Try exact partial matches first
    let match = keys.find(key => key.toLowerCase().includes(searchKeyLower));
    if (match) return match;
    
    // Try reverse partial match
    match = keys.find(key => searchKeyLower.includes(key.toLowerCase()));
    if (match) return match;
    
    // Try word boundary matches
    const searchWords = searchKeyLower.split(/\s+/);
    match = keys.find(key => {
        const keyLower = key.toLowerCase();
        return searchWords.some(word => keyLower.includes(word) && word.length > 2);
    });
    
    return match || null;
}

/**
 * Get current locale without using hooks
 */
export const getCurrentLocale = () => {
    try {
        return currentLocale || window?.page?.props?.locale || 'fr';
    } catch (error) {
        return 'fr';
    }
};

/**
 * Get translations without using hooks
 */
export const getTranslations = () => {
    try {
        if (Object.keys(translationCache).length > 0) {
            return translationCache;
        }
        return window?.page?.props?.translations || {};
    } catch (error) {
        return {};
    }
};

/**
 * Force refresh translations from current page props
 */
export const refreshTranslations = () => {
    try {
        if (window?.page?.props) {
            translationCache = window.page.props.translations || {};
            currentLocale = window.page.props.locale || 'fr';
            
            if (DEBUG_TRANSLATIONS) {
                console.log('🔄 Translations manually refreshed:', {
                    locale: currentLocale,
                    count: Object.keys(translationCache).length
                });
            }
        }
    } catch (error) {
        if (DEBUG_TRANSLATIONS) {
            console.error('❌ Failed to refresh translations:', error);
        }
    }
};

/**
 * Debug function to list all available translations
 */
export const debugTranslations = () => {
    if (DEBUG_TRANSLATIONS) {
        const translations = getTranslations();
        const locale = getCurrentLocale();
        
        console.group('🐛 Translation Debug Info');
        console.log('Current locale:', locale);
        console.log('Total translations:', Object.keys(translations).length);
        console.log('Sample translations:', Object.entries(translations).slice(0, 10));
        console.log('Cache state:', {
            cacheSize: Object.keys(translationCache).length,
            currentLocale,
            windowPropsAvailable: !!window?.page?.props
        });
        console.groupEnd();
    }
};

// Export all the utility functions
export const translatePropertyType = (type) => {
    const locale = getCurrentLocale();
    
    const translations = {
        fr: {
            'APPARTEMENT': 'Appartement',
            'MAISON': 'Maison',
            'TERRAIN': 'Terrain',
            'COMMERCIAL': 'Local commercial',
            'BUREAU': 'Bureau',
            'AUTRES': 'Autre',
        },
        en: {
            'APPARTEMENT': 'Apartment',
            'MAISON': 'House',
            'TERRAIN': 'Land',
            'COMMERCIAL': 'Commercial space',
            'BUREAU': 'Office',
            'AUTRES': 'Other',
        }
    };
    
    return translations[locale]?.[type] || type;
};

export const translatePropertyStatus = (status) => {
    const locale = getCurrentLocale();
    
    const translations = {
        fr: {
            'EN_ATTENTE': 'En attente',
            'PUBLIE': 'Publié',
            'REJETE': 'Rejeté',
            'VENDU': 'Vendu',
        },
        en: {
            'EN_ATTENTE': 'Pending',
            'PUBLIE': 'Published',
            'REJETE': 'Rejected',
            'VENDU': 'Sold',
        }
    };
    
    return translations[locale]?.[status] || status;
};

export const formatCurrency = (amount) => {
    const locale = getCurrentLocale();
    
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
    }).format(amount);
};

export const formatDate = (date) => {
    const locale = getCurrentLocale();
    
    return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Initialize translations on load if window.page is available
if (typeof window !== 'undefined' && window?.page?.props) {
    translationCache = window.page.props.translations || {};
    currentLocale = window.page.props.locale || 'fr';
}

// Add global debug function
if (typeof window !== 'undefined') {
    window.debugTranslations = debugTranslations;
    window.refreshTranslations = refreshTranslations;
}
