/**
 * Date formatting utilities with localization support
 */

/**
 * Get the current locale from the HTML lang attribute
 * @returns {string} Current locale code (en, fr, etc.)
 */
export function getCurrentLocale() {
    return document.documentElement.lang || 'fr';
}

/**
 * Get the locale code for Intl.DateTimeFormat
 * @param {string} locale - The locale (en, fr, etc.)
 * @returns {string} The locale code (en-US, fr-FR, etc.)
 */
export function getLocaleCode(locale = null) {
    const currentLocale = locale || getCurrentLocale();
    const localeMap = {
        'en': 'en-US',
        'fr': 'fr-FR',
    };
    return localeMap[currentLocale] || 'fr-FR';
}

/**
 * Format a date according to the current locale
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
    if (!date) return '';
    
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    const localeCode = getLocaleCode();
    
    return new Date(date).toLocaleDateString(localeCode, finalOptions);
}

/**
 * Format a date with time according to the current locale
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(date) {
    return formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format a date in short format (just date, no time)
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDateShort(date) {
    return formatDate(date, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
}