import ApplicationLogo from '@/Components/ApplicationLogo';
import PillNavigation from '@/Components/PillNavigation';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import Toast from '@/Components/Toast';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { __ } from '@/Utils/translations';

export default function AuthenticatedLayout({ header, children, usePillNavigation = false }) {
    const { props } = usePage();
    const user = props.auth.user;
    const currentLocale = props.locale || 'fr';

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Pill Navigation items (for test pages)
    const getPillNavigationItems = () => {
        return [
            { 
                href: '/agent/properties?type=rent', 
                label: 'For Rent',
                active: false
            },
            { 
                href: '/agent/properties?type=sale', 
                label: 'For Sale',
                active: true
            },
            { 
                href: '/agent/properties?category=buildings', 
                label: 'Browse Buildings',
                active: false
            },
            { 
                href: user?.type_utilisateur === 'PROPRIETAIRE' ? '/properties/create' : '/sell', 
                label: 'Sell',
                active: false
            },
            { 
                href: '/contact', 
                label: 'Contact',
                active: false
            }
        ];
    };

    // Regular Navigation items (for actual dashboards)
    const getRegularNavigationItems = () => {
        if (user.type_utilisateur === 'AGENT') {
            return [
                { href: '/agent/dashboard', label: __('Dashboard'), active: route().current('agent.dashboard') },
                { href: '/agent/properties', label: __('Search Properties'), active: route().current('agent.properties') },
                { href: '/agent/purchases', label: __('My Contacts'), active: route().current('agent.purchases') },
                { href: '/agent/invoices', label: __('My Invoices'), active: route().current('agent.invoices') }
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
                { href: '/admin/invoices', label: __('Invoices'), active: route().current('admin.invoices.index') },
                { href: '/admin/settings', label: __('Settings'), active: route().current('admin.settings') }
            ];
        }
        
        return [];
    };

    // Check if current user should use pill navigation
    const shouldUsePillNavigation = () => {
        return usePillNavigation || user.type_utilisateur === 'AGENT' || user.type_utilisateur === 'PROPRIETAIRE' || user.type_utilisateur === 'ADMIN';
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
                            <Link href="/" className="flex-shrink-0">
                                <ApplicationLogo className="h-8 w-auto" />
                            </Link>

                            {/* Navigation - Conditional based on usePillNavigation prop or user type */}
                            {shouldUsePillNavigation() ? (
                                /* Pill Navigation for test pages and agents */
                                <PillNavigation 
                                    items={usePillNavigation ? getPillNavigationItems() : getRegularNavigationItems()} 
                                    className="hidden lg:flex"
                                />
                            ) : (
                                /* Regular Navigation for actual dashboards */
                                <div className="hidden md:flex items-center space-x-8">
                                    {getRegularNavigationItems().map((item, index) => (
                                        <NavLink
                                            key={index}
                                            href={item.href}
                                            active={item.active}
                                            className="text-sm font-medium"
                                        >
                                            {item.label}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right side - User Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Language Switcher */}
                            <LanguageSwitcher currentLocale={currentLocale} />

                            {/* User Profile Dropdown */}
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none transition-all duration-200 ease-in-out hover:bg-gray-50 rounded-lg px-2 py-1">
                                            {user.profile_image_url || (user.profile_image && `/storage/${user.profile_image}`) ? (
                                                <img
                                                    src={user.profile_image_url || `/storage/${user.profile_image}`}
                                                    alt={`${user.prenom} ${user.nom}`}
                                                    className="w-8 h-8 rounded-full object-cover transition-transform duration-200 hover:scale-105 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-105 shadow-sm">
                                                    <span className="text-sm font-bold text-white">
                                                        {user.prenom?.[0]?.toUpperCase()}{user.nom?.[0]?.toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <svg className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        
                                        {/* Role-specific dashboard links */}
                                        {user.type_utilisateur === 'AGENT' && (
                                            <Dropdown.Link href="/agent/dashboard">
                                                {__("Agent Dashboard")}
                                            </Dropdown.Link>
                                        )}
                                        {user.type_utilisateur === 'PROPRIETAIRE' && (
                                            <Dropdown.Link href="/dashboard">
                                                {__("Owner Dashboard")}
                                            </Dropdown.Link>
                                        )}
                                        {user.type_utilisateur === 'ADMIN' && (
                                            <Dropdown.Link href="/admin/dashboard">
                                                {__("Admin Panel")}
                                            </Dropdown.Link>
                                        )}
                                        
                                        <Dropdown.Link href="/profile">
                                            {__("Profile")}
                                        </Dropdown.Link>
                                        
                                        <div className="border-t border-gray-100">
                                            <Dropdown.Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                            >
                                                {__("Log Out")}
                                            </Dropdown.Link>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile menu button and icons */}
                        <div className="md:hidden flex items-center space-x-3">
                            {/* Mobile Language Switcher */}
                            <LanguageSwitcher currentLocale={currentLocale} />
                            
                            {/* Mobile User Icon */}
                            {user.profile_image_url || (user.profile_image && `/storage/${user.profile_image}`) ? (
                                <img
                                    src={user.profile_image_url || `/storage/${user.profile_image}`}
                                    alt={`${user.prenom} ${user.nom}`}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                        {user.prenom?.[0]?.toUpperCase()}{user.nom?.[0]?.toUpperCase()}
                                    </span>
                                </div>
                            )}
                            
                            {/* Hamburger Menu */}
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
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

                {/* Mobile Navigation */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} md:hidden`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                        {/* Mobile Navigation Items */}
                        {(shouldUsePillNavigation() ? 
                            (usePillNavigation ? getPillNavigationItems() : getRegularNavigationItems()) : 
                            getRegularNavigationItems()
                        ).map((item, index) => (
                            <ResponsiveNavLink
                                key={index}
                                href={item.href}
                                active={item.active}
                            >
                                {item.label}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    {/* Mobile User Section */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.prenom} {user.nom}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href="/profile">
                                {__("Profile")}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href="/logout"
                                as="button"
                            >
                                {__("Log Out")}
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="bg-white shadow-sm border-b border-gray-200 mt-16">
                    <div className="w-full px-8">
                        <div className="max-w-[1400px] mx-auto flex items-center py-4">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className={`flex-1 ${!header ? 'mt-16' : ''}`}>
                {children}
            </main>

            {/* Toast Notifications */}
            <Toast />
        </div>
    );
}