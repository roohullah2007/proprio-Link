import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

const Icons = {
    User: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    ArrowLeft: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    ),
    Home: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    CreditCard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    Mail: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Phone: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    MapPin: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Shield: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    Calendar: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    TrendingUp: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    DocumentText: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Download: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
};

export default function UserDetails({ auth, user, stats }) {
    const { __ } = useTranslations();
    const [activeTab, setActiveTab] = useState('profile');

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount || 0);
    };

    const formatSiret = (siret) => {
        if (!siret) return '-';
        // Format SIRET as XXX XXX XXX XXXXX
        return siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
    };

    const handleVerificationToggle = () => {
        router.post(route('admin.users.update-verification', user.id), {
            verified: !user.est_verifie
        });
    };

    const handleUserAction = (action) => {
        if (action === 'delete' && !confirm(__('Are you sure you want to delete this user?'))) {
            return;
        }

        router.post(route('admin.users.update-status', user.id), {
            action: action
        });
    };

    const getBadgeColor = (type) => {
        switch (type) {
            case 'AGENT':
                return 'bg-blue-100 text-blue-800';
            case 'PROPRIETAIRE':
                return 'bg-green-100 text-green-800';
            case 'ADMIN':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPropertyStatusColor = (status) => {
        switch (status) {
            case 'PUBLIE':
                return 'bg-green-100 text-green-800';
            case 'EN_ATTENTE':
                return 'bg-yellow-100 text-yellow-800';
            case 'REJETE':
                return 'bg-red-100 text-red-800';
            case 'VENDU':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const tabs = [
        { id: 'profile', label: __('Profile'), icon: Icons.User },
        { id: 'properties', label: __('Properties'), icon: Icons.Home },
        { id: 'purchases', label: __('Purchases'), icon: Icons.CreditCard },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('User Details')}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={__("User Details") + " - " + user.prenom + " " + user.nom + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href={route('admin.users')}
                            className="inline-flex items-center text-[#6C6C6C] hover:text-[#065033] transition-colors"
                        >
                            <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                            {__('Back to Users')}
                        </Link>
                    </div>

                    {/* User Header */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                                <div className="flex-shrink-0">
                                    <div className="h-20 w-20 rounded-full bg-[#065033] flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white">
                                            {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-[#000] font-inter mb-2">
                                        {user.prenom} {user.nom}
                                    </h1>
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center text-[#6C6C6C] font-inter">
                                            <Icons.Mail className="w-4 h-4 mr-2" />
                                            {user.email}
                                            {user.email_verified_at && (
                                                <Icons.Check className="w-4 h-4 ml-2 text-green-500" />
                                            )}
                                        </div>
                                        {user.telephone && (
                                            <div className="flex items-center text-[#6C6C6C] font-inter">
                                                <Icons.Phone className="w-4 h-4 mr-2" />
                                                {user.telephone}
                                            </div>
                                        )}
                                        {user.type_utilisateur === 'AGENT' && user.numero_siret && (
                                            <div className="flex items-center text-[#6C6C6C] font-inter">
                                                <Icons.Shield className="w-4 h-4 mr-2" />
                                                <span className="text-sm">SIRET: {formatSiret(user.numero_siret)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col lg:items-end space-y-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(user.type_utilisateur)}`}>
                                    {user.type_utilisateur === 'AGENT' && <Icons.Shield className="w-4 h-4 mr-1" />}
                                    {user.type_utilisateur === 'PROPRIETAIRE' && <Icons.Home className="w-4 h-4 mr-1" />}
                                    {user.type_utilisateur === 'AGENT' ? 'Agent' : 
                                     user.type_utilisateur === 'PROPRIETAIRE' ? 'Property Owner' : 
                                     user.type_utilisateur === 'ADMIN' ? 'Administrator' : user.type_utilisateur}
                                </span>
                                
                                {user.type_utilisateur === 'AGENT' && (
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        user.est_verifie ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {user.est_verifie ? __('Verified Agent') : __('Pending Verification')}
                                    </span>
                                )}
                                
                                {user.is_suspended && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        {__('Suspended')}
                                    </span>
                                )}
                                
                                <div className="flex space-x-2">
                                    {user.type_utilisateur === 'AGENT' && (
                                        <button
                                            onClick={handleVerificationToggle}
                                            className={`px-4 py-2 rounded-lg border transition-colors ${
                                                user.est_verifie
                                                    ? 'border-red-300 text-red-700 hover:bg-red-50'
                                                    : 'border-green-300 text-green-700 hover:bg-green-50'
                                            }`}
                                        >
                                            {user.est_verifie ? __('Revoke Verification') : __('Verify Agent')}
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={() => handleUserAction(user.is_suspended ? 'activate' : 'suspend')}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${
                                            user.is_suspended
                                                ? 'border-green-300 text-green-700 hover:bg-green-50'
                                                : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                                        }`}
                                    >
                                        {user.is_suspended ? __('Activate User') : __('Suspend User')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <Icons.Home className="w-8 h-8 text-[#065033]" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[#6C6C6C] font-inter">
                                        {__('Total Properties')}
                                    </p>
                                    <p className="text-2xl font-bold text-[#000] font-inter">
                                        {formatNumber(stats.properties_count)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <Icons.Check className="w-8 h-8 text-green-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[#6C6C6C] font-inter">
                                        {__('Published Properties')}
                                    </p>
                                    <p className="text-2xl font-bold text-[#000] font-inter">
                                        {formatNumber(stats.published_properties)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <Icons.CreditCard className="w-8 h-8 text-blue-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[#6C6C6C] font-inter">
                                        {__('Contacts Purchased')}
                                    </p>
                                    <p className="text-2xl font-bold text-[#000] font-inter">
                                        {formatNumber(stats.contacts_purchased)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <Icons.TrendingUp className="w-8 h-8 text-purple-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[#6C6C6C] font-inter">
                                        {__('Total Spent')}
                                    </p>
                                    <p className="text-2xl font-bold text-[#000] font-inter">
                                        {formatCurrency(stats.total_spent)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden">
                        <div className="border-b border-[#EAEAEA]">
                            <nav className="flex space-x-8 px-6">
                                {tabs.map((tab) => {
                                    const IconComponent = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                                activeTab === tab.id
                                                    ? 'border-[#065033] text-[#065033]'
                                                    : 'border-transparent text-[#6C6C6C] hover:text-[#065033] hover:border-[#065033]'
                                            }`}
                                        >
                                            <IconComponent className="w-5 h-5 mr-2" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter">
                                        {__('Profile Information')}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                {__('First Name')}
                                            </label>
                                            <p className="text-[#000] font-inter">{user.prenom || '-'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                {__('Last Name')}
                                            </label>
                                            <p className="text-[#000] font-inter">{user.nom || '-'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                {__('Email')}
                                            </label>
                                            <p className="text-[#000] font-inter">{user.email}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                {__('Phone')}
                                            </label>
                                            <p className="text-[#000] font-inter">{user.telephone || '-'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                {__('City')}
                                            </label>
                                            <p className="text-[#000] font-inter">{user.ville || '-'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                {__('User Type')}
                                            </label>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getBadgeColor(user.type_utilisateur)}`}>
                                                {user.type_utilisateur === 'AGENT' && <Icons.Shield className="w-4 h-4 mr-1" />}
                                                {user.type_utilisateur === 'PROPRIETAIRE' && <Icons.Home className="w-4 h-4 mr-1" />}
                                                {user.type_utilisateur === 'ADMIN' && <Icons.Shield className="w-4 h-4 mr-1" />}
                                                {user.type_utilisateur === 'AGENT' ? 'Agent' : 
                                                 user.type_utilisateur === 'PROPRIETAIRE' ? 'Property Owner' : 
                                                 user.type_utilisateur === 'ADMIN' ? 'Administrator' : user.type_utilisateur}
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                {__('Email Verified')}
                                            </label>
                                            <div className="flex items-center">
                                                {user.email_verified_at ? (
                                                    <span className="inline-flex items-center text-green-600">
                                                        <Icons.Check className="w-4 h-4 mr-1" />
                                                        {__('Yes')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center text-red-600">
                                                        <Icons.X className="w-4 h-4 mr-1" />
                                                        {__('No')}
                                                    </span>
                                                )}
                                                {user.email_verified_at && (
                                                    <span className="text-sm text-[#6C6C6C] ml-2">
                                                        ({formatDate(user.email_verified_at)})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                {__('Member Since')}
                                            </label>
                                            <p className="text-[#000] font-inter">{formatDate(user.created_at)}</p>
                                        </div>

                                        {/* Agent-specific fields */}
                                        {user.type_utilisateur === 'AGENT' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                        {__('Agent Verified')}
                                                    </label>
                                                    <div className="flex items-center">
                                                        {user.est_verifie ? (
                                                            <span className="inline-flex items-center text-green-600">
                                                                <Icons.Check className="w-4 h-4 mr-1" />
                                                                {__('Yes')}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center text-yellow-600">
                                                                <Icons.X className="w-4 h-4 mr-1" />
                                                                {__('No')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                        {__('SIRET Number')}
                                                    </label>
                                                    <p className="text-[#000] font-inter font-mono tracking-wider">
                                                        {formatSiret(user.numero_siret)}
                                                    </p>
                                                    <p className="text-xs text-[#6C6C6C] mt-1">
                                                        {__('14 digits only, no spaces')}
                                                    </p>
                                                </div>

                                                {user.licence_professionnelle_url && (
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                                                            {__('Professional License (Carte T)')}
                                                        </label>
                                                        <div className="flex items-center space-x-3 p-4 border border-[#EAEAEA] rounded-lg bg-gray-50">
                                                            <Icons.DocumentText className="w-8 h-8 text-[#065033]" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-[#000] font-inter">
                                                                    {__('Professional License Document')}
                                                                </p>
                                                                <p className="text-xs text-[#6C6C6C] font-inter">
                                                                    {__('PDF, JPG, PNG (max 10 MB)')}
                                                                </p>
                                                            </div>
                                                            <a
                                                                href={user.licence_professionnelle_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-3 py-2 border border-[#065033] text-[#065033] rounded-lg hover:bg-[#065033] hover:text-white transition-colors"
                                                            >
                                                                <Icons.Download className="w-4 h-4 mr-1" />
                                                                {__('View')}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                        {__('Verification Status')}
                                                    </label>
                                                    <p className="text-[#000] font-inter">
                                                        {user.verification_statut || __('Pending')}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-1">
                                                        {__('Preferred Language')}
                                                    </label>
                                                    <p className="text-[#000] font-inter">
                                                        {user.language === 'fr' ? __('French') : user.language === 'en' ? __('English') : user.language || __('French')}
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        {/* Suspension info if applicable */}
                                        {user.is_suspended && (
                                            <div className="md:col-span-2">
                                                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                                                    <h4 className="text-sm font-medium text-red-800 mb-2">
                                                        {__('Account Suspended')}
                                                    </h4>
                                                    {user.suspended_at && (
                                                        <p className="text-xs text-red-700">
                                                            {__('Suspended on')}: {formatDate(user.suspended_at)}
                                                        </p>
                                                    )}
                                                    {user.suspension_reason && (
                                                        <p className="text-xs text-red-700 mt-1">
                                                            {__('Reason')}: {user.suspension_reason}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'properties' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter">
                                        {__('User Properties')}
                                    </h3>
                                    
                                    {user.properties && user.properties.length > 0 ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {user.properties.map((property) => (
                                                <div key={property.id} className="border border-[#EAEAEA] rounded-lg p-4 hover:border-[#CEE8DE] transition-colors">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="flex-shrink-0">
                                                            {property.images && property.images.length > 0 ? (
                                                                <img
                                                                    className="h-16 w-16 rounded-lg object-cover"
                                                                    src={`/storage/${property.images[0].chemin_fichier}`}
                                                                    alt={property.type_propriete}
                                                                />
                                                            ) : (
                                                                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                    <Icons.Home className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="text-sm font-medium text-[#000] font-inter truncate">
                                                                    {property.type_propriete}
                                                                </h4>
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPropertyStatusColor(property.statut)}`}>
                                                                    {property.statut}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-[#6C6C6C] font-inter mb-1">
                                                                {property.ville}
                                                            </p>
                                                            <p className="text-sm font-medium text-[#000] font-inter">
                                                                {formatCurrency(property.prix)} • {property.superficie_m2} m²
                                                            </p>
                                                            <p className="text-xs text-[#6C6C6C] font-inter mt-2">
                                                                {__('Created')}: {formatDate(property.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Icons.Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-[#6C6C6C] font-inter">
                                                {__('No properties found for this user.')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'purchases' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter">
                                        {__('Contact Purchases')}
                                    </h3>
                                    
                                    {user.contact_purchases && user.contact_purchases.length > 0 ? (
                                        <div className="space-y-4">
                                            {user.contact_purchases.map((purchase) => (
                                                <div key={purchase.id} className="border border-[#EAEAEA] rounded-lg p-4 hover:border-[#CEE8DE] transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start space-x-4">
                                                            <div className="flex-shrink-0">
                                                                {purchase.property && purchase.property.images && purchase.property.images.length > 0 ? (
                                                                    <img
                                                                        className="h-16 w-16 rounded-lg object-cover"
                                                                        src={`/storage/${purchase.property.images[0].chemin_fichier}`}
                                                                        alt={purchase.property.type_propriete}
                                                                    />
                                                                ) : (
                                                                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                        <Icons.Home className="w-6 h-6 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium text-[#000] font-inter mb-1">
                                                                    {purchase.property ? purchase.property.type_propriete : __('Property Deleted')}
                                                                </h4>
                                                                <p className="text-sm text-[#6C6C6C] font-inter mb-1">
                                                                    {purchase.property ? purchase.property.ville : '-'}
                                                                </p>
                                                                <p className="text-xs text-[#6C6C6C] font-inter">
                                                                    {__('Purchased')}: {formatDate(purchase.created_at)}
                                                                </p>
                                                                {purchase.property && purchase.property.proprietaire && (
                                                                    <p className="text-xs text-[#6C6C6C] font-inter">
                                                                        {__('Owner')}: {purchase.property.proprietaire.prenom} {purchase.property.proprietaire.nom}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-medium text-[#000] font-inter">
                                                                {formatCurrency(purchase.montant_paye)}
                                                            </p>
                                                            <div className="flex items-center justify-end space-x-2">
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                    purchase.statut_paiement === 'succeeded' ? 'bg-green-100 text-green-800' : 
                                                                    purchase.statut_paiement === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    purchase.statut_paiement === 'canceled' ? 'bg-gray-100 text-gray-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {purchase.statut_paiement === 'succeeded' ? __('Paid') : 
                                                                     purchase.statut_paiement === 'pending' ? __('Pending') :
                                                                     purchase.statut_paiement === 'canceled' ? __('Canceled') :
                                                                     __('Failed')}
                                                                </span>
                                                                {purchase.statut_paiement === 'succeeded' && (
                                                                    <a
                                                                        href={route('invoices.generate', purchase.id)}
                                                                        className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <Icons.Download className="w-3 h-3 mr-1" />
                                                                        {__('Invoice')}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Icons.CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-[#6C6C6C] font-inter">
                                                {__('No contact purchases found for this user.')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
