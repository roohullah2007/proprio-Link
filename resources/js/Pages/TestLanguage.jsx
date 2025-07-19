import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { __ } from '@/Utils/translations';

export default function TestLanguage({ current_locale, session_locale, user_language }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{__('Language Test')}</h2>}
        >
            <Head title={__('Language Test')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">{__('Language Test Page')}</h1>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Language Status */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-3">{__('Language Status')}</h3>
                                    <div className="space-y-2">
                                        <p><strong>{__('Current Locale')}:</strong> {current_locale}</p>
                                        <p><strong>{__('Session Locale')}:</strong> {session_locale || 'None'}</p>
                                        <p><strong>{__('User Language')}:</strong> {user_language || 'Not set'}</p>
                                    </div>
                                </div>

                                {/* Sample Translations */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-3">{__('Sample Translations')}</h3>
                                    <div className="space-y-2">
                                        <p><strong>{__('Welcome')}:</strong> {__('Welcome')}</p>
                                        <p><strong>{__('Dashboard')}:</strong> {__('Dashboard')}</p>
                                        <p><strong>{__('My Properties')}:</strong> {__('My Properties')}</p>
                                        <p><strong>{__('Add Property')}:</strong> {__('Add Property')}</p>
                                        <p><strong>{__('Language')}:</strong> {__('Language')}</p>
                                    </div>
                                </div>

                                {/* Navigation Translations */}
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-3">{__('Navigation Translations')}</h3>
                                    <div className="space-y-2">
                                        <p><strong>{__('Search Properties')}:</strong> {__('Search Properties')}</p>
                                        <p><strong>{__('My Contacts')}:</strong> {__('My Contacts')}</p>
                                        <p><strong>{__('Admin Panel')}:</strong> {__('Admin Panel')}</p>
                                        <p><strong>{__('Moderation')}:</strong> {__('Moderation')}</p>
                                        <p><strong>{__('Profile')}:</strong> {__('Profile')}</p>
                                    </div>
                                </div>

                                {/* Property Related Translations */}
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-3">{__('Property Translations')}</h3>
                                    <div className="space-y-2">
                                        <p><strong>{__('Property type')}:</strong> {__('Property type')}</p>
                                        <p><strong>{__('Apartment')}:</strong> {__('Apartment')}</p>
                                        <p><strong>{__('House')}:</strong> {__('House')}</p>
                                        <p><strong>{__('Sale price')}:</strong> {__('Sale price')}</p>
                                        <p><strong>{__('Surface area')}:</strong> {__('Surface area')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-3">{__('Test Instructions')}</h3>
                                <ol className="list-decimal list-inside space-y-2">
                                    <li>{__('Use the language switcher in the top navigation to change languages')}</li>
                                    <li>{__('Observe how the text on this page changes')}</li>
                                    <li>{__('Check that the active language is correctly displayed in the switcher')}</li>
                                    <li>{__('Navigate to other pages to confirm translations work throughout the app')}</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
