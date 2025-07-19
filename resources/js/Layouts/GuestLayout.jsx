import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { props } = usePage();
    const currentLocale = props.locale || 'fr';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Header */}
            <header className="w-full px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo className="h-8 w-auto text-[#065033]" />
                    </Link>
                    
                    <LanguageSwitcher currentLocale={currentLocale} />
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Auth Card - Updated to match dashboard design */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl shadow-sm p-8">
                        {children}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full px-6 py-4 text-center">
                <p className="text-sm text-[#6C6C6C] font-inter">
                    © 2025 Proprio Link. Tous droits réservés.
                </p>
            </footer>
        </div>
    );
}