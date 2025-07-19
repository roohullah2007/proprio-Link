/**
 * Translation utilities for Propio application
 * Works with Laravel translations passed via Inertia props
 */

import { usePage } from '@inertiajs/react';

/**
 * React hook for translations - provides the main translation function
 */
export const useTranslations = () => {
    const { props } = usePage();
    
    const translate = (key, replacements = {}) => {
        try {
            const translations = props.translations || {};
            let translation = translations[key];
            
            // If translation not found, try to find it in a case-insensitive way
            if (!translation) {
                const lowerKey = key.toLowerCase();
                const foundKey = Object.keys(translations).find(k => k.toLowerCase() === lowerKey);
                if (foundKey) {
                    translation = translations[foundKey];
                }
            }
            
            // If still not found, only log once per key to avoid spam
            if (!translation) {
                if (!window._missing_translations) {
                    window._missing_translations = new Set();
                }
                if (!window._missing_translations.has(key)) {
                    console.warn(`Translation missing for key: "${key}" in locale: ${props.locale || 'fr'}`);
                    window._missing_translations.add(key);
                }
                translation = key;
            }
            
            // Handle replacements (like :name, :count, etc.)
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
            console.error('Translation error for key:', key, error);
            return key;
        }
    };

    return { __: translate };
};

/**
 * Get current locale from Inertia props
 */
export const getCurrentLocale = () => {
    try {
        const { props } = usePage();
        return props.locale || 'fr';
    } catch (error) {
        console.warn('Could not get locale from Inertia props, defaulting to fr');
        return 'fr';
    }
};

/**
 * Get translations from Inertia props
 */
export const getTranslations = () => {
    try {
        const { props } = usePage();
        return props.translations || {};
    } catch (error) {
        console.warn('Could not get translations from Inertia props');
        return {};
    }
};

/**
 * Translation function that works with Laravel translations
 */
export const __ = (key, replacements = {}) => {
    try {
        const translations = getTranslations();
        let translation = translations[key];
        
        // If translation not found, try to find it in a case-insensitive way
        if (!translation) {
            const lowerKey = key.toLowerCase();
            const foundKey = Object.keys(translations).find(k => k.toLowerCase() === lowerKey);
            if (foundKey) {
                translation = translations[foundKey];
            }
        }
        
        // If still not found, only log once per key to avoid spam
        if (!translation) {
            if (!window._missing_translations) {
                window._missing_translations = new Set();
            }
            if (!window._missing_translations.has(key)) {
                console.warn(`Translation missing for key: "${key}" in locale: ${getCurrentLocale()}`);
                window._missing_translations.add(key);
            }
            translation = key;
        }
        
        // Handle replacements (like :name, :count, etc.)
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
        console.error('Translation error for key:', key, error);
        return key;
    }
};

/**
 * Property type translations based on current locale
 */
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
            // Also handle the case where the type is already in French
            'Appartement': 'Appartement',
            'Maison': 'Maison',
            'Terrain': 'Terrain',
            'Local commercial': 'Local commercial',
            'Bureau': 'Bureau',
            'Autre': 'Autre'
        },
        en: {
            'APPARTEMENT': 'Apartment',
            'MAISON': 'House',
            'TERRAIN': 'Land',
            'COMMERCIAL': 'Commercial space',
            'BUREAU': 'Office',
            'AUTRES': 'Other',
            // Also handle the case where the type is in French but we want English
            'Appartement': 'Apartment',
            'Maison': 'House',
            'Terrain': 'Land',
            'Local commercial': 'Commercial space',
            'Bureau': 'Office',
            'Autre': 'Other'
        }
    };
    
    return translations[locale]?.[type] || type;
};

/**
 * Property status translations
 */
export const translatePropertyStatus = (status) => {
    const locale = getCurrentLocale();
    
    const translations = {
        fr: {
            'EN_ATTENTE': 'En attente',
            'PUBLIE': 'Publié',
            'REJETE': 'Rejeté',
            'VENDU': 'Vendu',
            'en_attente': 'En attente',
            'publie': 'Publié',
            'rejete': 'Rejeté',
            'vendu': 'Vendu'
        },
        en: {
            'EN_ATTENTE': 'Pending',
            'PUBLIE': 'Published',
            'REJETE': 'Rejected',
            'VENDU': 'Sold',
            'en_attente': 'Pending',
            'publie': 'Published',
            'rejete': 'Rejected',
            'vendu': 'Sold'
        }
    };
    
    return translations[locale]?.[status] || status;
};

/**
 * Payment status translations
 */
export const translatePaymentStatus = (status) => {
    const locale = getCurrentLocale();
    
    const translations = {
        fr: {
            'pending': 'En attente',
            'succeeded': 'Confirmé',
            'failed': 'Échoué',
            'canceled': 'Annulé'
        },
        en: {
            'pending': 'Pending',
            'succeeded': 'Confirmed',
            'failed': 'Failed',
            'canceled': 'Canceled'
        }
    };
    
    return translations[locale]?.[status] || status;
};

/**
 * Verification status translations
 */
export const translateVerificationStatus = (status) => {
    const locale = getCurrentLocale();
    
    const translations = {
        fr: {
            'approuve': 'Vérifié',
            'en_attente': 'En attente',
            'rejete': 'Rejeté'
        },
        en: {
            'approuve': 'Verified',
            'en_attente': 'Pending',
            'rejete': 'Rejected'
        }
    };
    
    return translations[locale]?.[status] || status;
};

/**
 * Format currency based on locale
 */
export const formatCurrency = (amount) => {
    const locale = getCurrentLocale();
    
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
    }).format(amount);
};

/**
 * Format date based on locale
 */
export const formatDate = (date) => {
    const locale = getCurrentLocale();
    
    return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format date with time based on locale
 */
export const formatDateTime = (date) => {
    const locale = getCurrentLocale();
    
    return new Date(date).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format contact count with proper pluralization
 */
export const formatContactsRemaining = (count) => {
    const locale = getCurrentLocale();
    
    if (count === 0) {
        return __('Épuisé');
    }
    
    if (locale === 'fr') {
        return count === 1 ? '1 contact restant' : `${count} contacts restants`;
    } else {
        return count === 1 ? '1 contact remaining' : `${count} contacts remaining`;
    }
};

/**
 * Format property count with proper pluralization
 */
export const formatPropertyCount = (count) => {
    const locale = getCurrentLocale();
    
    if (count === 0) {
        return locale === 'fr' ? 'Aucune propriété' : 'No properties';
    }
    
    if (locale === 'fr') {
        return count === 1 ? '1 propriété' : `${count} propriétés`;
    } else {
        return count === 1 ? '1 property' : `${count} properties`;
    }
};

/**
 * Format contact count with proper pluralization
 */
export const formatContactCount = (count) => {
    const locale = getCurrentLocale();
    
    if (count === 0) {
        return locale === 'fr' ? 'Aucun contact' : 'No contacts';
    }
    
    if (locale === 'fr') {
        return count === 1 ? '1 contact' : `${count} contacts`;
    } else {
        return count === 1 ? '1 contact' : `${count} contacts`;
    }
};

/**
 * Format surface area with proper unit
 */
export const formatSurface = (surface) => {
    const locale = getCurrentLocale();
    return `${surface} m²`;
};

/**
 * Format room count
 */
export const formatRooms = (count) => {
    const locale = getCurrentLocale();
    
    if (locale === 'fr') {
        return count === 1 ? '1 pièce' : `${count} pièces`;
    } else {
        return count === 1 ? '1 room' : `${count} rooms`;
    }
};
