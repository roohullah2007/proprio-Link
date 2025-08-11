import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

export default function EmailSettings({ settings, lastTestResult }) {
    const { __ } = useTranslations();
    const [activeTab, setActiveTab] = useState('smtp');

    // SMTP Settings Form
    const { data: smtpData, setData: setSmtpData, post: postSmtp, processing: processingSmtp, errors: smtpErrors } = useForm({
        smtp_host: settings.smtp_host || '',
        smtp_port: settings.smtp_port || '587',
        smtp_username: settings.smtp_username || '',
        smtp_password: '',
        smtp_encryption: settings.smtp_encryption || 'tls',
        mail_from_address: settings.mail_from_address || '',
        mail_from_name: settings.mail_from_name || '',
        smtp_enabled: settings.smtp_enabled ?? true,
    });

    // Notification Emails Form
    const { data: emailsData, setData: setEmailsData, post: postEmails, processing: processingEmails, errors: emailsErrors } = useForm({
        admin_emails: settings.admin_notification_emails || [''],
    });

    // Test Email Form
    const { data: testData, setData: setTestData, post: postTest, processing: processingTest } = useForm({
        test_email: '',
    });

    const submitSmtpSettings = (e) => {
        e.preventDefault();
        postSmtp(route('admin.email-settings.update-smtp'));
    };

    const submitNotificationEmails = (e) => {
        e.preventDefault();
        postEmails(route('admin.email-settings.update-notification-emails'));
    };

    const submitTestEmail = (e) => {
        e.preventDefault();
        postTest(route('admin.email-settings.test-email'));
    };

    const testAdminNotification = () => {
        postTest(route('admin.email-settings.test-admin-notification'), {
            preserveScroll: true,
        });
    };

    const addEmailField = () => {
        setEmailsData('admin_emails', [...emailsData.admin_emails, '']);
    };

    const removeEmailField = (index) => {
        const newEmails = emailsData.admin_emails.filter((_, i) => i !== index);
        setEmailsData('admin_emails', newEmails.length > 0 ? newEmails : ['']);
    };

    const updateEmailField = (index, value) => {
        const newEmails = [...emailsData.admin_emails];
        newEmails[index] = value;
        setEmailsData('admin_emails', newEmails);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Configuration Email - Admin" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Configuration Email
                    </h1>
                    <p className="text-gray-600">
                        Gérez les paramètres SMTP et les notifications administrateur
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('smtp')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'smtp'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Paramètres SMTP
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'notifications'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Notifications Admin
                        </button>
                        <button
                            onClick={() => setActiveTab('test')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'test'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Tester la Configuration
                        </button>
                    </nav>
                </div>

                {/* SMTP Settings Tab */}
                {activeTab === 'smtp' && (
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Configuration SMTP
                            </h2>
                            
                            <form onSubmit={submitSmtpSettings} className="space-y-6">
                                {/* Enable/Disable SMTP */}
                                <div className="flex items-center">
                                    <input
                                        id="smtp_enabled"
                                        type="checkbox"
                                        checked={smtpData.smtp_enabled}
                                        onChange={(e) => setSmtpData('smtp_enabled', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="smtp_enabled" className="ml-2 block text-sm text-gray-900">
                                        Activer l'envoi d'emails
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* SMTP Host */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Serveur SMTP
                                        </label>
                                        <input
                                            type="text"
                                            value={smtpData.smtp_host}
                                            onChange={(e) => setSmtpData('smtp_host', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="smtp.exemple.com"
                                        />
                                        {smtpErrors.smtp_host && (
                                            <p className="mt-1 text-sm text-red-600">{smtpErrors.smtp_host}</p>
                                        )}
                                    </div>

                                    {/* SMTP Port */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Port SMTP
                                        </label>
                                        <input
                                            type="number"
                                            value={smtpData.smtp_port}
                                            onChange={(e) => setSmtpData('smtp_port', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="587"
                                        />
                                        {smtpErrors.smtp_port && (
                                            <p className="mt-1 text-sm text-red-600">{smtpErrors.smtp_port}</p>
                                        )}
                                    </div>

                                    {/* SMTP Username */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nom d'utilisateur
                                        </label>
                                        <input
                                            type="text"
                                            value={smtpData.smtp_username}
                                            onChange={(e) => setSmtpData('smtp_username', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="username@exemple.com"
                                        />
                                        {smtpErrors.smtp_username && (
                                            <p className="mt-1 text-sm text-red-600">{smtpErrors.smtp_username}</p>
                                        )}
                                    </div>

                                    {/* SMTP Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            value={smtpData.smtp_password}
                                            onChange={(e) => setSmtpData('smtp_password', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Laissez vide pour ne pas changer"
                                        />
                                        {smtpErrors.smtp_password && (
                                            <p className="mt-1 text-sm text-red-600">{smtpErrors.smtp_password}</p>
                                        )}
                                    </div>

                                    {/* SMTP Encryption */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Chiffrement
                                        </label>
                                        <select
                                            value={smtpData.smtp_encryption}
                                            onChange={(e) => setSmtpData('smtp_encryption', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="tls">TLS</option>
                                            <option value="ssl">SSL</option>
                                            <option value="null">Aucun</option>
                                        </select>
                                        {smtpErrors.smtp_encryption && (
                                            <p className="mt-1 text-sm text-red-600">{smtpErrors.smtp_encryption}</p>
                                        )}
                                    </div>

                                    {/* From Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Adresse d'expédition
                                        </label>
                                        <input
                                            type="email"
                                            value={smtpData.mail_from_address}
                                            onChange={(e) => setSmtpData('mail_from_address', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="noreply@proprio-link.fr"
                                        />
                                        {smtpErrors.mail_from_address && (
                                            <p className="mt-1 text-sm text-red-600">{smtpErrors.mail_from_address}</p>
                                        )}
                                    </div>

                                    {/* From Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nom d'expédition
                                        </label>
                                        <input
                                            type="text"
                                            value={smtpData.mail_from_name}
                                            onChange={(e) => setSmtpData('mail_from_name', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Proprio Link"
                                        />
                                        {smtpErrors.mail_from_name && (
                                            <p className="mt-1 text-sm text-red-600">{smtpErrors.mail_from_name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processingSmtp}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processingSmtp ? 'Enregistrement...' : 'Enregistrer les paramètres SMTP'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Notification Emails Tab */}
                {activeTab === 'notifications' && (
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Emails de notification administrateur
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Ces adresses recevront toutes les notifications administrateur (nouveaux utilisateurs, nouvelles propriétés, etc.)
                            </p>
                            
                            <form onSubmit={submitNotificationEmails} className="space-y-4">
                                {emailsData.admin_emails.map((email, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => updateEmailField(index, e.target.value)}
                                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="admin@proprio-link.fr"
                                        />
                                        {emailsData.admin_emails.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeEmailField(index)}
                                                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                    </div>
                                ))}
                                
                                {emailsErrors.admin_emails && (
                                    <p className="text-sm text-red-600">{emailsErrors.admin_emails}</p>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={addEmailField}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        Ajouter un email
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingEmails}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processingEmails ? 'Enregistrement...' : 'Enregistrer les emails'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Test Configuration Tab */}
                {activeTab === 'test' && (
                    <div className="space-y-6">
                        {/* Test Email */}
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Tester la configuration SMTP
                                </h2>
                                <form onSubmit={submitTestEmail} className="flex gap-4">
                                    <input
                                        type="email"
                                        value={testData.test_email}
                                        onChange={(e) => setTestData('test_email', e.target.value)}
                                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="test@exemple.com"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={processingTest}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processingTest ? 'Envoi...' : 'Envoyer un test'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Test Admin Notification */}
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Tester les notifications administrateur
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Envoie un email de test à tous les administrateurs configurés
                                </p>
                                <button
                                    onClick={testAdminNotification}
                                    disabled={processingTest}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processingTest ? 'Envoi...' : 'Tester les notifications admin'}
                                </button>
                            </div>
                        </div>

                        {/* Current Admin Emails Display */}
                        {settings.admin_notification_emails && settings.admin_notification_emails.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-900 mb-2">
                                    Emails administrateur configurés:
                                </h3>
                                <ul className="text-sm text-blue-700">
                                    {settings.admin_notification_emails.map((email, index) => (
                                        <li key={index}>• {email}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
