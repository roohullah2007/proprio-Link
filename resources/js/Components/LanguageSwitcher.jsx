import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function LanguageSwitcher({ currentLocale = 'fr', className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isChanging, setIsChanging] = useState(false);

    const languages = [
        {
            code: 'fr',
            name: 'Français',
            flag: (
                <img 
                    src="/france.svg" 
                    alt="French flag" 
                    className="w-[19px] h-[19px] object-cover rounded-sm"
                />
            )
        },
        {
            code: 'en',
            name: 'English',
            flag: (
                <img 
                    src="/british.svg" 
                    alt="British flag" 
                    className="w-[19px] h-[19px] object-cover rounded-sm"
                />
            )
        }
    ];

    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

    const handleLanguageChange = (langCode) => {
        if (isChanging || currentLocale === langCode) {
            return;
        }
        
        setIsOpen(false);
        setIsChanging(true);
        
        console.log('Language change to:', langCode);
        
        // Use Inertia router to make a POST request
        router.post(route('language.change'), {
            language: langCode
        }, {
            preserveState: false,
            preserveScroll: false,
            replace: false,
            onStart: () => {
                console.log('Language change started:', langCode);
            },
            onSuccess: (page) => {
                console.log('Language changed successfully to:', langCode);
                setIsChanging(false);
            },
            onError: (errors) => {
                console.error('Language change failed:', errors);
                setIsChanging(false);
                alert('Failed to change language. Please try again.');
            },
            onFinish: () => {
                setIsChanging(false);
            }
        });
    };

    return (
        <div className={`relative ${className}`}>
            {/* Language Switcher Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isChanging}
                className={`flex items-center justify-center w-[35px] h-[35px] bg-[#F5F7F8] border-[1.5px] border-[#E5E5E5] rounded-full p-2 hover:bg-[#EAEEF0] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#065033] focus:ring-opacity-50 ${
                    isChanging ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title={`Current language: ${currentLanguage.name}`}
            >
                <div className="w-[19px] h-[19px] flex-none">
                    {isChanging ? (
                        <div className="w-[19px] h-[19px] border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : (
                        currentLanguage.flag
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && !isChanging && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    {/* Dropdown Content */}
                    <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] py-1">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                disabled={currentLocale === language.code || isChanging}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors duration-150 disabled:cursor-not-allowed ${
                                    currentLocale === language.code 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <div className="w-[19px] h-[19px] flex-none">
                                    {language.flag}
                                </div>
                                <span className="font-medium flex-1">{language.name}</span>
                                {currentLocale === language.code && (
                                    <div className="flex-none">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
