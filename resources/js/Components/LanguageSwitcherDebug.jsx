/**
 * Language Switcher Debug Component
 * 
 * This component helps debug language switching issues by showing:
 * 1. Current locale state
 * 2. Available translations
 * 3. Language switching functionality
 */

import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslations, getCurrentLocale, getTranslations } from '@/Utils/translations';

export default function LanguageSwitcherDebug() {
    const { props } = usePage();
    const { __ } = useTranslations();
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        const info = {
            currentLocale: getCurrentLocale(),
            propsLocale: props.locale,
            translations: getTranslations(),
            translationKeys: Object.keys(getTranslations()),
            hasTranslations: Object.keys(getTranslations()).length > 0,
            testTranslation: __('Welcome'),
            allProps: props
        };
        
        setDebugInfo(info);
        console.log('Language Debug Info:', info);
    }, [props.locale]);

    const testLanguageChange = (langCode) => {
        console.log('Testing language change to:', langCode);
        
        router.post(route('language.change'), {
            language: langCode
        }, {
            preserveState: false,
            preserveScroll: false,
            onStart: () => console.log('Language change started'),
            onSuccess: (page) => {
                console.log('Language change successful:', page);
            },
            onError: (errors) => {
                console.error('Language change failed:', errors);
            },
            onFinish: () => console.log('Language change finished')
        });
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
            <h3 className="text-sm font-bold mb-2">Language Debug Info</h3>
            
            <div className="text-xs space-y-1 mb-3">
                <div><strong>Current Locale:</strong> {debugInfo.currentLocale}</div>
                <div><strong>Props Locale:</strong> {debugInfo.propsLocale}</div>
                <div><strong>Has Translations:</strong> {debugInfo.hasTranslations ? 'Yes' : 'No'}</div>
                <div><strong>Translation Count:</strong> {debugInfo.translationKeys?.length || 0}</div>
                <div><strong>Test Translation:</strong> {debugInfo.testTranslation}</div>
            </div>
            
            <div className="space-y-2">
                <button
                    onClick={() => testLanguageChange('fr')}
                    className="w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                    Switch to French
                </button>
                <button
                    onClick={() => testLanguageChange('en')}
                    className="w-full text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                    Switch to English
                </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
                Check browser console for detailed logs
            </div>
        </div>
    );
}
