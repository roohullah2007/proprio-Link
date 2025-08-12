import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

// Icons
const Icons = {
    Settings: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    CreditCard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    Globe: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Upload: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    ),
    Check: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    X: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Save: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
    ),
    Plus: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    ),
    Trash: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    Mail: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
};

export default function Settings({ auth, settings }) {
    const { __ } = useTranslations();
    const [activeTab, setActiveTab] = useState('payment');
    const [testingStripe, setTestingStripe] = useState(false);
    const [stripeTestResult, setStripeTestResult] = useState(null);
    const [testingSmtp, setTestingSmtp] = useState(false);
    const [smtpTestResult, setSmtpTestResult] = useState(null);
    const [testEmail, setTestEmail] = useState('');

    // Parse website menu links for easier editing
    const parseMenuLinks = (menuLinksString) => {
        try {
            const parsed = typeof menuLinksString === 'string' ? JSON.parse(menuLinksString) : menuLinksString;
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    const [menuLinks, setMenuLinks] = useState(() => 
        parseMenuLinks(settings.website_menu_links || '[]')
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        // Payment Settings
        stripe_publishable_key: settings.stripe_publishable_key || '',
        stripe_secret_key: settings.stripe_secret_key || '',
        stripe_webhook_secret: settings.stripe_webhook_secret || '',
        contact_purchase_price: settings.contact_purchase_price || 15.00,
        payment_currency: settings.payment_currency || 'EUR',
        
        // Platform Settings
        platform_name: settings.platform_name || 'Propio',
        platform_url: settings.platform_url || '',
        default_language: settings.default_language || 'fr',
        
        // Admin Notification Settings
        admin_notification_emails: settings.admin_notification_emails || [''],
        
        // Website Settings
        website_url: settings.website_url || 'https://yourdomain.com',
        website_menu_links: JSON.stringify(parseMenuLinks(settings.website_menu_links) || [
            { label: 'Home', url: 'https://yourdomain.com', external: true },
            { label: 'About', url: 'https://yourdomain.com/about', external: true },
            { label: 'Services', url: 'https://yourdomain.com/services', external: true },
            { label: 'Contact', url: 'https://yourdomain.com/contact', external: true }
        ]),
        
        // File Settings
        max_file_size: settings.max_file_size || 10,
        allowed_image_types: settings.allowed_image_types || ['jpg', 'jpeg', 'png', 'webp'],
        
        // SMTP Settings
        smtp_enabled: settings.smtp_enabled || false,
        smtp_host: settings.smtp_host || '',
        smtp_port: settings.smtp_port || 587,
        smtp_username: settings.smtp_username || '',
        smtp_password: settings.smtp_password || '',
        smtp_encryption: settings.smtp_encryption || 'tls',
        smtp_from_address: settings.smtp_from_address || '',
        smtp_from_name: settings.smtp_from_name || 'Propio',
    });

    // Menu link management functions
    const addMenuLink = () => {
        const newLinks = [...menuLinks, { label: '', url: '', external: true }];
        setMenuLinks(newLinks);
        setData('website_menu_links', JSON.stringify(newLinks));
    };

    const updateMenuLink = (index, field, value) => {
        const newLinks = [...menuLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setMenuLinks(newLinks);
        setData('website_menu_links', JSON.stringify(newLinks));
    };

    const removeMenuLink = (index) => {
        const newLinks = menuLinks.filter((_, i) => i !== index);
        setMenuLinks(newLinks);
        setData('website_menu_links', JSON.stringify(newLinks));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    const testStripeConnection = async () => {
        if (!data.stripe_secret_key) {
            alert(__('Please enter Stripe Secret Key first'));
            return;
        }

        setTestingStripe(true);
        setStripeTestResult(null);

        try {
            const response = await fetch(route('admin.settings.test-stripe'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    stripe_secret_key: data.stripe_secret_key
                })
            });

            const result = await response.json();
            setStripeTestResult(result);
        } catch (error) {
            setStripeTestResult({
                success: false,
                error: 'Connection failed'
            });
        } finally {
            setTestingStripe(false);
        }
    };

    const testSmtpConnection = async () => {
        if (!data.smtp_host || !data.smtp_port || !data.smtp_username || !data.smtp_password || !data.smtp_from_address || !testEmail) {
            alert(__('Please fill all SMTP fields and provide a test email address'));
            return;
        }

        setTestingSmtp(true);
        setSmtpTestResult(null);

        try {
            const response = await fetch(route('admin.settings.test-smtp'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    smtp_host: data.smtp_host,
                    smtp_port: data.smtp_port,
                    smtp_username: data.smtp_username,
                    smtp_password: data.smtp_password,
                    smtp_encryption: data.smtp_encryption,
                    smtp_from_address: data.smtp_from_address,
                    smtp_from_name: data.smtp_from_name,
                    test_email: testEmail
                })
            });

            const result = await response.json();
            setSmtpTestResult(result);
        } catch (error) {
            setSmtpTestResult({
                success: false,
                error: 'Connection failed'
            });
        } finally {
            setTestingSmtp(false);
        }
    };

    const toggleImageType = (type) => {
        const currentTypes = [...data.allowed_image_types];
        const index = currentTypes.indexOf(type);
        
        if (index > -1) {
            currentTypes.splice(index, 1);
        } else {
            currentTypes.push(type);
        }
        
        setData('allowed_image_types', currentTypes);
    };

    // Admin notification emails management
    const addNotificationEmail = () => {
        const newEmails = [...data.admin_notification_emails, ''];
        setData('admin_notification_emails', newEmails);
    };

    const removeNotificationEmail = (index) => {
        const newEmails = data.admin_notification_emails.filter((_, i) => i !== index);
        setData('admin_notification_emails', newEmails.length > 0 ? newEmails : ['']);
    };

    const updateNotificationEmail = (index, value) => {
        const newEmails = [...data.admin_notification_emails];
        newEmails[index] = value;
        setData('admin_notification_emails', newEmails);
    };

    const tabs = [
        { id: 'payment', label: __('Payment Settings'), icon: Icons.CreditCard },
        { id: 'email', label: __('Email Settings'), icon: Icons.Mail },
        { id: 'notifications', label: __('Admin Notifications'), icon: Icons.Mail },
        { id: 'platform', label: __('Platform Settings'), icon: Icons.Globe },
        { id: 'website', label: __('Website Settings'), icon: Icons.Globe },
        { id: 'files', label: __('File Settings'), icon: Icons.Upload },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Settings')}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={__("Settings") + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-8">


                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6">
                                <nav className="space-y-2">
                                    {tabs.map((tab) => {
                                        const IconComponent = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors font-inter ${
                                                    activeTab === tab.id
                                                        ? 'bg-[#F5F9FA] border border-[#CEE8DE] text-[#065033]'
                                                        : 'text-[#6C6C6C] hover:bg-[#F5F9FA] hover:text-[#065033]'
                                                }`}
                                            >
                                                <IconComponent className="w-5 h-5 mr-3" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-sm">
                                    {/* Payment Settings */}
                                    {activeTab === 'payment' && (
                                        <div className="space-y-6">
                                            <div className="border-b border-[#EAEAEA] pb-4">
                                                <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                    {__('Stripe Payment Configuration')}
                                                </h3>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {__('Configure Stripe payment processing for agent contact purchases.')}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Stripe Publishable Key')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.stripe_publishable_key}
                                                        onChange={(e) => setData('stripe_publishable_key', e.target.value)}
                                                        placeholder="pk_test_..."
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                    />
                                                    {errors.stripe_publishable_key && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.stripe_publishable_key}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Stripe Secret Key')}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="password"
                                                            value={data.stripe_secret_key}
                                                            onChange={(e) => setData('stripe_secret_key', e.target.value)}
                                                            placeholder="sk_test_..."
                                                            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={testStripeConnection}
                                                            disabled={testingStripe || !data.stripe_secret_key}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs bg-[#065033] text-white rounded hover:bg-[#054028] disabled:opacity-50"
                                                        >
                                                            {testingStripe ? __('Testing...') : __('Test')}
                                                        </button>
                                                    </div>
                                                    {errors.stripe_secret_key && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.stripe_secret_key}</p>
                                                    )}
                                                    
                                                    {/* Stripe Test Result */}
                                                    {stripeTestResult && (
                                                        <div className={`mt-2 p-3 rounded-lg border ${
                                                            stripeTestResult.success 
                                                                ? 'bg-green-50 border-green-200 text-green-800' 
                                                                : 'bg-red-50 border-red-200 text-red-800'
                                                        }`}>
                                                            <div className="flex items-center">
                                                                {stripeTestResult.success ? (
                                                                    <Icons.Check className="w-4 h-4 mr-2" />
                                                                ) : (
                                                                    <Icons.X className="w-4 h-4 mr-2" />
                                                                )}
                                                                <span className="text-sm font-medium">
                                                                    {stripeTestResult.success ? __('Connection successful') : __('Connection failed')}
                                                                </span>
                                                            </div>
                                                            {stripeTestResult.success && (
                                                                <div className="mt-2 text-xs">
                                                                    <p>{__('Account ID')}: {stripeTestResult.account_id}</p>
                                                                    <p>{__('Business')}: {stripeTestResult.business_name}</p>
                                                                    <p>{__('Country')}: {stripeTestResult.country}</p>
                                                                </div>
                                                            )}
                                                            {!stripeTestResult.success && (
                                                                <p className="mt-1 text-xs">{stripeTestResult.error}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Webhook Secret')}
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={data.stripe_webhook_secret}
                                                        onChange={(e) => setData('stripe_webhook_secret', e.target.value)}
                                                        placeholder="whsec_..."
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                    />
                                                    {errors.stripe_webhook_secret && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.stripe_webhook_secret}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Contact Purchase Price')}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="1"
                                                            max="1000"
                                                            value={data.contact_purchase_price}
                                                            onChange={(e) => setData('contact_purchase_price', parseFloat(e.target.value))}
                                                            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                        />
                                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6C6C6C] font-inter">
                                                            €
                                                        </span>
                                                    </div>
                                                    {errors.contact_purchase_price && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.contact_purchase_price}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Payment Currency')}
                                                    </label>
                                                    <select
                                                        value={data.payment_currency}
                                                        onChange={(e) => setData('payment_currency', e.target.value)}
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                    >
                                                        <option value="EUR">EUR (€)</option>
                                                        <option value="USD">USD ($)</option>
                                                        <option value="GBP">GBP (£)</option>
                                                    </select>
                                                    {errors.payment_currency && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.payment_currency}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Email Settings */}
                                    {activeTab === 'email' && (
                                        <div className="space-y-6">
                                            <div className="border-b border-[#EAEAEA] pb-4">
                                                <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                    {__('SMTP Email Configuration')}
                                                </h3>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {__('Configure custom SMTP settings for sending emails. If disabled, system will use .env configuration.')}
                                                </p>
                                            </div>

                                            {/* SMTP Enable Toggle */}
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id="smtp_enabled"
                                                    checked={data.smtp_enabled}
                                                    onChange={(e) => setData('smtp_enabled', e.target.checked)}
                                                    className="w-4 h-4 text-[#065033] bg-gray-100 border-gray-300 rounded focus:ring-[#065033] focus:ring-2"
                                                />
                                                <label htmlFor="smtp_enabled" className="text-sm font-medium text-[#696969] font-inter">
                                                    {__('Enable Custom SMTP Configuration')}
                                                </label>
                                            </div>

                                            {data.smtp_enabled && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                            {__('SMTP Host')} *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={data.smtp_host}
                                                            onChange={(e) => setData('smtp_host', e.target.value)}
                                                            placeholder="smtp.gmail.com"
                                                            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                        />
                                                        {errors.smtp_host && (
                                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_host}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                            {__('SMTP Port')} *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={data.smtp_port}
                                                            onChange={(e) => setData('smtp_port', parseInt(e.target.value))}
                                                            placeholder="587"
                                                            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                        />
                                                        {errors.smtp_port && (
                                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_port}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                            {__('Username')} *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={data.smtp_username}
                                                            onChange={(e) => setData('smtp_username', e.target.value)}
                                                            placeholder="your-email@gmail.com"
                                                            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                        />
                                                        {errors.smtp_username && (
                                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_username}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                            {__('Password')} *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={data.smtp_password}
                                                            onChange={(e) => setData('smtp_password', e.target.value)}
                                                            placeholder="••••••••••••"
                                                            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                        />
                                                        {errors.smtp_password && (
                                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_password}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                            {__('Encryption')}
                                                        </label>
                                                        <select
                                                            value={data.smtp_encryption}
                                                            onChange={(e) => setData('smtp_encryption', e.target.value)}
                                                            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                        >
                                                            <option value="tls">TLS</option>
                                                            <option value="ssl">SSL</option>
                                                        </select>
                                                        {errors.smtp_encryption && (
                                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_encryption}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                            {__('From Email')} *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={data.smtp_from_address}
                                                            onChange={(e) => setData('smtp_from_address', e.target.value)}
                                                            placeholder="noreply@yourdomain.com"
                                                            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                        />
                                                        {errors.smtp_from_address && (
                                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_from_address}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                            {__('From Name')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={data.smtp_from_name}
                                                            onChange={(e) => setData('smtp_from_name', e.target.value)}
                                                            placeholder="Propio"
                                                            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                        />
                                                        {errors.smtp_from_name && (
                                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_from_name}</p>
                                                        )}
                                                    </div>

                                                    {/* SMTP Test Section */}
                                                    <div className="md:col-span-2">
                                                        <div className="border-t border-[#EAEAEA] pt-4">
                                                            <h4 className="text-sm font-medium text-[#696969] font-inter mb-3">
                                                                {__('Test SMTP Configuration')}
                                                            </h4>
                                                            <div className="flex space-x-3">
                                                                <input
                                                                    type="email"
                                                                    value={testEmail}
                                                                    onChange={(e) => setTestEmail(e.target.value)}
                                                                    placeholder={__('Enter test email address')}
                                                                    className="flex-1 px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={testSmtpConnection}
                                                                    disabled={testingSmtp || !data.smtp_host || !data.smtp_username || !data.smtp_password || !testEmail}
                                                                    className="px-4 py-3 bg-[#065033] text-white rounded-lg hover:bg-[#054028] disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                                                                >
                                                                    {testingSmtp ? __('Sending...') : __('Send Test Email')}
                                                                </button>
                                                            </div>
                                                            
                                                            {/* SMTP Test Result */}
                                                            {smtpTestResult && (
                                                                <div className={`mt-3 p-3 rounded-lg border ${
                                                                    smtpTestResult.success 
                                                                        ? 'bg-green-50 border-green-200 text-green-800' 
                                                                        : 'bg-red-50 border-red-200 text-red-800'
                                                                }`}>
                                                                    <div className="flex items-center">
                                                                        {smtpTestResult.success ? (
                                                                            <Icons.Check className="w-4 h-4 mr-2" />
                                                                        ) : (
                                                                            <Icons.X className="w-4 h-4 mr-2" />
                                                                        )}
                                                                        <span className="text-sm font-medium">
                                                                            {smtpTestResult.success ? smtpTestResult.message : __('Test failed')}
                                                                        </span>
                                                                    </div>
                                                                    {!smtpTestResult.success && (
                                                                        <p className="mt-1 text-xs">{smtpTestResult.error}</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {!data.smtp_enabled && (
                                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <div className="flex items-start">
                                                        <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-blue-800 font-inter">
                                                                {__('Using Default Email Configuration')}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-blue-700 font-inter">
                                                                {__('The system is currently using the email configuration from your .env file. Enable custom SMTP above to override these settings.')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Admin Notifications */}
                                    {activeTab === 'notifications' && (
                                        <div className="space-y-6">
                                            <div className="border-b border-[#EAEAEA] pb-4">
                                                <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                    {__('Admin Notification Emails')}
                                                </h3>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {__('Configure email addresses that will receive admin notifications (new users, property submissions, etc.).')}
                                                </p>
                                            </div>

                                            {data.admin_notification_emails.length === 1 && data.admin_notification_emails[0] === '' && (
                                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.734 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                        </svg>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-yellow-800 font-inter">
                                                                {__('No Admin Notification Emails Configured')}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-yellow-700 font-inter">
                                                                {__('Please add at least one email address to receive admin notifications. Without this, you will not receive important system notifications.')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                {data.admin_notification_emails.map((email, index) => (
                                                    <div key={index} className="flex items-center space-x-3">
                                                        <div className="flex-1">
                                                            <input
                                                                type="email"
                                                                value={email}
                                                                onChange={(e) => updateNotificationEmail(index, e.target.value)}
                                                                placeholder={__('admin@yourdomain.com')}
                                                                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter placeholder-[#6C6C6C] focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                            />
                                                        </div>
                                                        {data.admin_notification_emails.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNotificationEmail(index)}
                                                                className="flex items-center justify-center w-10 h-10 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                                                                title={__('Remove email address')}
                                                            >
                                                                <Icons.Trash className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                
                                                {errors.admin_notification_emails && (
                                                    <p className="text-red-500 text-sm">{errors.admin_notification_emails}</p>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={addNotificationEmail}
                                                    className="flex items-center px-4 py-2 text-sm bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg text-[#6C6C6C] hover:text-[#065033] hover:border-[#065033] transition-colors font-inter"
                                                >
                                                    <Icons.Plus className="w-4 h-4 mr-2" />
                                                    {__('Add Email Address')}
                                                </button>

                                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <div className="flex items-start">
                                                        <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-blue-800 font-inter">
                                                                {__('Important Information')}
                                                            </h4>
                                                            <ul className="mt-1 text-sm text-blue-700 font-inter space-y-1">
                                                                <li>• {__('These addresses will receive notifications for new user registrations')}</li>
                                                                <li>• {__('Property submission and approval notifications will be sent here')}</li>
                                                                <li>• {__('Contact purchase notifications will be sent to these addresses')}</li>
                                                                <li>• {__('System alerts and important updates will be delivered here')}</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Platform Settings */}
                                    {activeTab === 'platform' && (
                                        <div className="space-y-6">
                                            <div className="border-b border-[#EAEAEA] pb-4">
                                                <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                    {__('Platform Configuration')}
                                                </h3>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {__('General platform settings and branding.')}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Platform Name')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.platform_name}
                                                        onChange={(e) => setData('platform_name', e.target.value)}
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                    />
                                                    {errors.platform_name && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.platform_name}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Platform URL')}
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={data.platform_url}
                                                        onChange={(e) => setData('platform_url', e.target.value)}
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                    />
                                                    {errors.platform_url && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.platform_url}</p>
                                                    )}
                                                </div>


                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Default Language')}
                                                    </label>
                                                    <select
                                                        value={data.default_language}
                                                        onChange={(e) => setData('default_language', e.target.value)}
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                    >
                                                        <option value="fr">{__('French')}</option>
                                                        <option value="en">{__('English')}</option>
                                                    </select>
                                                    {errors.default_language && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.default_language}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Website Settings */}
                                    {activeTab === 'website' && (
                                        <div className="space-y-6">
                                            <div className="border-b border-[#EAEAEA] pb-4">
                                                <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                    {__('Website Configuration')}
                                                </h3>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {__('Configure the main website URL and navigation menu for public pages.')}
                                                </p>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Website URL')}
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={data.website_url}
                                                        onChange={(e) => setData('website_url', e.target.value)}
                                                        placeholder="https://yourdomain.com"
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                    />
                                                    {errors.website_url && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.website_url}</p>
                                                    )}
                                                    <p className="text-xs text-[#6C6C6C] mt-1">
                                                        {__('This URL will be used for the logo link on public pages')}
                                                    </p>
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <label className="block text-sm font-medium text-[#696969] font-inter">
                                                            {__('Website Menu Links')}
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={addMenuLink}
                                                            className="flex items-center px-3 py-2 text-sm bg-[#065033] text-white rounded-lg hover:bg-[#054028] transition-colors"
                                                        >
                                                            <Icons.Plus className="w-4 h-4 mr-2" />
                                                            {__('Add Link')}
                                                        </button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {menuLinks.map((link, index) => (
                                                            <div key={index} className="p-4 border border-[#EAEAEA] rounded-lg bg-gray-50">
                                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                                                    <div className="md:col-span-3">
                                                                        <label className="block text-xs font-medium text-[#696969] mb-1">
                                                                            {__('Label')}
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={link.label}
                                                                            onChange={(e) => updateMenuLink(index, 'label', e.target.value)}
                                                                            placeholder="Home"
                                                                            className="w-full px-3 py-2 border border-[#EAEAEA] rounded text-sm focus:outline-none focus:border-[#065033]"
                                                                        />
                                                                    </div>
                                                                    <div className="md:col-span-5">
                                                                        <label className="block text-xs font-medium text-[#696969] mb-1">
                                                                            {__('URL')}
                                                                        </label>
                                                                        <input
                                                                            type="url"
                                                                            value={link.url}
                                                                            onChange={(e) => updateMenuLink(index, 'url', e.target.value)}
                                                                            placeholder="https://yourdomain.com"
                                                                            className="w-full px-3 py-2 border border-[#EAEAEA] rounded text-sm focus:outline-none focus:border-[#065033]"
                                                                        />
                                                                    </div>
                                                                    <div className="md:col-span-2">
                                                                        <label className="block text-xs font-medium text-[#696969] mb-1">
                                                                            {__('External')}
                                                                        </label>
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={link.external}
                                                                                onChange={(e) => updateMenuLink(index, 'external', e.target.checked)}
                                                                                className="mr-2 text-[#065033] border-[#EAEAEA] rounded focus:ring-[#065033]"
                                                                            />
                                                                            <span className="text-xs text-[#6C6C6C]">
                                                                                {__('Open in new tab')}
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="md:col-span-2 flex justify-end">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeMenuLink(index)}
                                                                            className="flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                            title={__('Remove Link')}
                                                                        >
                                                                            <Icons.Trash className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {menuLinks.length === 0 && (
                                                            <div className="text-center py-8 border-2 border-dashed border-[#EAEAEA] rounded-lg">
                                                                <p className="text-[#6C6C6C] text-sm">
                                                                    {__('No menu links added yet. Click "Add Link" to get started.')}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {errors.website_menu_links && (
                                                        <p className="text-red-500 text-sm mt-2">{errors.website_menu_links}</p>
                                                    )}
                                                    
                                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <p className="text-xs text-blue-800">
                                                            <strong>{__('Note')}:</strong> {__('These links will appear in the header for non-authenticated users. Logged-in users will see their role-based navigation instead.')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* File Settings */}
                                    {activeTab === 'files' && (
                                        <div className="space-y-6">
                                            <div className="border-b border-[#EAEAEA] pb-4">
                                                <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                    {__('File Upload Configuration')}
                                                </h3>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {__('Configure file upload limits and allowed file types.')}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Maximum File Size (MB)')}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        value={data.max_file_size}
                                                        onChange={(e) => setData('max_file_size', parseInt(e.target.value))}
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#000] font-inter focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033]"
                                                    />
                                                    {errors.max_file_size && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.max_file_size}</p>
                                                    )}
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                                        {__('Allowed Image Types')}
                                                    </label>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {['jpg', 'jpeg', 'png', 'webp', 'gif'].map((type) => (
                                                            <label key={type} className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={data.allowed_image_types.includes(type)}
                                                                    onChange={() => toggleImageType(type)}
                                                                    className="mr-2 text-[#065033] border-[#EAEAEA] rounded focus:ring-[#065033]"
                                                                />
                                                                <span className="text-sm text-[#6C6C6C] font-inter uppercase">
                                                                    {type}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {errors.allowed_image_types && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.allowed_image_types}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Save Button */}
                                    <div className="mt-8 pt-6 border-t border-[#EAEAEA]">
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex justify-center items-center px-[16px] py-[8px] gap-[8px] min-w-max h-[40px] bg-[#065033] border border-[#065033] rounded-lg text-white hover:bg-[#054028] transition-colors disabled:opacity-50 font-inter"
                                            >
                                                {processing ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Icons.Save className="w-5 h-5" />
                                                )}
                                                <span className="font-medium">
                                                    {processing ? __('Saving...') : __('Save Settings')}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
