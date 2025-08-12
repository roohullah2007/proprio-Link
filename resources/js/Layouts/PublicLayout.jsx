import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import PillNavigation from '@/Components/PillNavigation';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useTranslations } from '@/Utils/translations';
import { useState } from 'react';

export default function PublicLayout({ children, title }) {
    const { props } = usePage();
    const { __ } = useTranslations();
    const settings = props.settings || {};
    const user = props.auth?.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    
    // Parse menu links from settings
    const menuLinks = (() => {
        try {
            let links = settings.website_menu_links;
            
            console.log('Raw settings received:', settings);
            console.log('Raw website_menu_links:', links);
            
            // Handle different formats of menu links
            if (typeof links === 'string') {
                console.log('Menu links is string, parsing...');
                links = JSON.parse(links);
            }
            
            // Ensure it's an array
            if (!Array.isArray(links)) {
                console.log('Menu links is not an array:', links);
                return [];
            }
            
            console.log('Final parsed menu links:', links);
            return links;
        } catch (e) {
            console.error('Error parsing menu links:', e);
            return [];
        }
    })();

    // Get navigation items based on user type (for authenticated users)
    const getAuthenticatedNavigationItems = () => {
        if (!user) return [];

        if (user.type_utilisateur === 'AGENT') {
            return [
                { href: '/agent/dashboard', label: __('Dashboard'), active: route().current('agent.dashboard') },
                { href: '/agent/properties', label: __('Search Properties'), active: route().current('agent.properties') },
                { href: '/agent/purchases', label: __('My Contacts'), active: route().current('agent.purchases') }
            ];
        }
        
        if (user.type_utilisateur === 'PROPRIETAIRE') {
            return [
                { href: '/dashboard', label: __('Dashboard'), active: route().current('dashboard') },
                { href: '/properties', label: __('My Properties'), active: route().current('properties.*') },
                { href: '/properties/create', label: __('Add Property'), active: route().current('properties.create') }
            ];
        }
        
        if (user.type_utilisateur === 'ADMIN') {
            return [
                { href: '/admin/dashboard', label: __('Dashboard'), active: route().current('admin.dashboard') },
                { href: '/admin/properties/all', label: __('Properties'), active: route().current('admin.pending-properties') || route().current('admin.all-properties') || route().current('admin.property-review') },
                { href: '/admin/users', label: __('Users'), active: route().current('admin.users') || route().current('admin.users.show') },
                { href: '/admin/settings', label: __('Settings'), active: route().current('admin.settings') }
            ];
        }
        
        return [];
    };

    // Get pill navigation items for public/guest users
    const getPublicPillNavigationItems = () => {
        if (user) {
            // For authenticated users, use their dashboard navigation
            return getAuthenticatedNavigationItems().map(item => ({
                href: item.href,
                label: item.label,
                active: item.active,
                external: false
            }));
        }
        
        // For guests, use website menu links or fallback to default
        let pillItems = [];
        
        if (menuLinks.length > 0) {
            pillItems = menuLinks.map(link => ({
                href: link.url,
                label: link.label,
                active: false,
                external: link.external
            }));
        } else {
            // Fallback menu for testing
            pillItems = [
                { href: 'https://yourdomain.com', label: 'Home', active: false, external: true },
                { href: 'https://yourdomain.com/about', label: 'About', active: false, external: true },
                { href: '/properties/search', label: 'Properties', active: true, external: false },
                { href: 'https://yourdomain.com/contact', label: 'Contact', active: false, external: true }
            ];
        }
        
        console.log('Pill navigation items for guests:', pillItems);
        return pillItems;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="w-full px-8">
                    <div className="max-w-[1400px] mx-auto flex justify-between items-center h-16">
                        {/* Left side - Logo and Navigation */}
                        <div className="flex items-center space-x-8">
                            {/* Logo */}
                            <Link href={settings.website_url || "/"} className="flex-shrink-0">
                                <ApplicationLogo className="h-8 w-auto" />
                            </Link>

                            {/* Pill Navigation - Same style as agent dashboard */}
                            <PillNavigation 
                                items={getPublicPillNavigationItems()}
                                className="hidden md:flex"
                            />
                        </div>

                        {/* Right side - Authentication & Language */}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                /* Authenticated User Menu */
                                <div className="flex items-center space-x-4">
                                    <LanguageSwitcher currentLocale={props.locale || 'fr'} />
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.prenom} {user.nom}
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                {__('Profile')}
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                {__('Log Out')}
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                /* Guest User Buttons */
                                <div className="flex items-center space-x-4">
                                    <LanguageSwitcher currentLocale={props.locale || 'fr'} />
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-700 hover:text-[#2563EB] transition-colors duration-200"
                                    >
                                        {__('Log in')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-4 py-2 bg-[#2563EB] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-[#1D4ED8] focus:bg-[#1D4ED8] active:bg-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        {__('Register')}
                                    </Link>
                                </div>
                            )}

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'}>
                        <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                            {getPublicPillNavigationItems().map((item, index) => (
                                item.external ? (
                                    <a
                                        key={index}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                            item.active
                                                ? 'border-[#2563EB] text-[#2563EB] bg-[#F0F4FF]'
                                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            ))}
                            
                            {/* Mobile Auth Links for Guests */}
                            {!user && (
                                <>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <Link
                                            href={route('login')}
                                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                                        >
                                            {__('Log in')}
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                                        >
                                            {__('Register')}
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="pt-16">
                {children}
            </div>
        </div>
    );
}
