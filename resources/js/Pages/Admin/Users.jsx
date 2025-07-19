import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

const Icons = {
    Users: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    ),
    Search: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Filter: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
    ),
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
    Shield: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    Mail: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
    MoreHorizontal: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
    ),
    ChevronDown: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    )
};

export default function Users({ auth, users, stats, filters = {} }) {
    const { __ } = useTranslations();
    const [showFilters, setShowFilters] = useState(false);
    const [dropdownUser, setDropdownUser] = useState(null);
    const dropdownRef = useRef(null);

    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        type: filters.type || '',
        verified: filters.verified || '',
        email_verified: filters.email_verified || '',
    });

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownUser(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.users'), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setData({
            search: '',
            type: '',
            verified: '',
            email_verified: '',
        });
        get(route('admin.users'), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleVerificationToggle = (userId, currentStatus) => {
        router.post(route('admin.users.update-verification', userId), {
            verified: !currentStatus
        }, {
            preserveScroll: true,
            onSuccess: () => setDropdownUser(null)
        });
    };

    const handleUserAction = (userId, action) => {
        if (action === 'delete' && !confirm(__('Are you sure you want to delete this user?'))) {
            return;
        }

        router.post(route('admin.users.update-status', userId), {
            action: action
        }, {
            preserveScroll: true,
            onSuccess: () => setDropdownUser(null)
        });
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR');
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Users Management')}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={__("Users Management") + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-8">


                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-black font-inter">
                                    {__('Total Users')}
                                </h3>
                                <p className="text-2xl font-semibold text-black font-inter">
                                    {formatNumber(stats.total_users)}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-black font-inter">
                                    {__('Verified Users')}
                                </h3>
                                <p className="text-2xl font-semibold text-black font-inter">
                                    {formatNumber(stats.verified_users)}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-black font-inter">
                                    {__('Agents')}
                                </h3>
                                <p className="text-2xl font-semibold text-black font-inter">
                                    {formatNumber(stats.agents)}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-black font-inter">
                                    {__('Property Owners')}
                                </h3>
                                <p className="text-2xl font-semibold text-black font-inter">
                                    {formatNumber(stats.owners)}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-black font-inter">
                                    {__('Pending Verifications')}
                                </h3>
                                <p className="text-2xl font-semibold text-black font-inter">
                                    {formatNumber(stats.pending_verifications)}
                                </p>
                                {stats.pending_verifications > 0 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        {__('Requires attention')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 mb-8">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1 max-w-md">
                                    <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                        <div className="flex-none w-4 h-4">
                                            <Icons.Search className="w-4 h-4 text-[#6C6C6C]" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            placeholder={__('Search users...')}
                                            className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex justify-center items-center px-[16px] py-[8px] gap-[8px] min-w-max h-[40px] border border-[#EAEAEA] rounded-lg text-[#6C6C6C] hover:text-[#065033] hover:border-[#065033] transition-colors"
                                    >
                                        <Icons.Filter className="w-4 h-4" />
                                        {__('Filters')}
                                        <Icons.ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex justify-center items-center px-[16px] py-[8px] gap-[8px] min-w-max h-[40px] bg-[#065033] border border-[#065033] rounded-lg text-white hover:bg-[#054028] transition-colors disabled:opacity-50 font-inter"
                                    >
                                        <Icons.Search className="w-4 h-4" />
                                        {processing ? __('Searching...') : __('Search')}
                                    </button>
                                </div>
                            </div>

                            {/* Filter Options */}
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#EAEAEA]">
                                    <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] capitalize appearance-none focus:outline-none focus:ring-0 focus:border-0"
                                        >
                                            <option value="">{__('All Types')}</option>
                                            <option value="AGENT">{__('Agents')}</option>
                                            <option value="PROPRIETAIRE">{__('Property Owners')}</option>
                                            <option value="ADMIN">{__('Administrators')}</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                        <select
                                            value={data.verified}
                                            onChange={(e) => setData('verified', e.target.value)}
                                            className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] capitalize appearance-none focus:outline-none focus:ring-0 focus:border-0"
                                        >
                                            <option value="">{__('All Status')}</option>
                                            <option value="verified">{__('Verified')}</option>
                                            <option value="unverified">{__('Unverified')}</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                        <select
                                            value={data.email_verified}
                                            onChange={(e) => setData('email_verified', e.target.value)}
                                            className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] capitalize appearance-none focus:outline-none focus:ring-0 focus:border-0"
                                        >
                                            <option value="">{__('All Status')}</option>
                                            <option value="verified">{__('Email Verified')}</option>
                                            <option value="unverified">{__('Email Not Verified')}</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Clear Filters */}
                            {(data.search || data.type || data.verified || data.email_verified) && (
                                <div className="flex justify-end pt-4 border-t border-[#EAEAEA]">
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="text-sm text-[#6C6C6C] hover:text-[#065033] transition-colors"
                                    >
                                        {__('Clear all filters')}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F5F9FA] border-b border-[#EAEAEA]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-[#696969] font-inter">
                                            {__('User')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-[#696969] font-inter">
                                            {__('Type')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-[#696969] font-inter">
                                            {__('Properties')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-[#696969] font-inter">
                                            {__('Purchases')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-[#696969] font-inter">
                                            {__('Status')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-[#696969] font-inter">
                                            {__('Joined')}
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-[#696969] font-inter">
                                            {__('Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EAEAEA]">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#F5F9FA]">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-[#065033] flex items-center justify-center">
                                                            <span className="text-sm font-medium text-white">
                                                                {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-[#000] font-inter">
                                                            {user.prenom} {user.nom}
                                                        </div>
                                                        <div className="text-sm text-[#6C6C6C] font-inter flex items-center">
                                                            <Icons.Mail className="w-3 h-3 mr-1" />
                                                            {user.email}
                                                            {user.email_verified_at && (
                                                                <Icons.Check className="w-3 h-3 ml-1 text-green-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(user.type_utilisateur)}`}>
                                                    {user.type_utilisateur === 'AGENT' && <Icons.Shield className="w-3 h-3 mr-1" />}
                                                    {user.type_utilisateur === 'PROPRIETAIRE' && <Icons.Home className="w-3 h-3 mr-1" />}
                                                    {__(`user_type_${user.type_utilisateur?.toLowerCase()}`)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#6C6C6C] font-inter">
                                                {formatNumber(user.properties_count)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#6C6C6C] font-inter">
                                                {formatNumber(user.contact_purchases_count)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    {user.type_utilisateur === 'AGENT' && (
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                            user.est_verifie ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {user.est_verifie ? __('Verified') : __('Pending Verification')}
                                                        </span>
                                                    )}
                                                    {user.is_suspended && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            {__('Suspended')}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#6C6C6C] font-inter">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center space-x-2 justify-end">
                                                    <Link
                                                        href={route('admin.users.show', user.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-[#EAEAEA] rounded-lg text-sm text-[#6C6C6C] hover:text-[#065033] hover:border-[#065033] transition-colors"
                                                    >
                                                        <Icons.Eye className="w-4 h-4 mr-1" />
                                                        {__('View')}
                                                    </Link>
                                                    
                                                    <div className="relative" ref={dropdownUser === user.id ? dropdownRef : null}>
                                                        <button
                                                            onClick={() => setDropdownUser(dropdownUser === user.id ? null : user.id)}
                                                            className="inline-flex items-center px-2 py-1.5 border border-[#EAEAEA] rounded-lg text-[#6C6C6C] hover:text-[#065033] hover:border-[#065033] transition-colors"
                                                        >
                                                            <Icons.MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                        
                                                        {dropdownUser === user.id && (
                                                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#EAEAEA] z-50">
                                                                <div className="py-1">
                                                                    {user.type_utilisateur === 'AGENT' && (
                                                                        <button
                                                                            onClick={() => handleVerificationToggle(user.id, user.est_verifie)}
                                                                            className="block w-full text-left px-4 py-2 text-sm text-[#6C6C6C] hover:bg-[#F5F9FA] hover:text-[#065033]"
                                                                        >
                                                                            {user.est_verifie ? __('Revoke Verification') : __('Verify Agent')}
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleUserAction(user.id, user.is_suspended ? 'activate' : 'suspend')}
                                                                        className="block w-full text-left px-4 py-2 text-sm text-[#6C6C6C] hover:bg-[#F5F9FA] hover:text-[#065033]"
                                                                    >
                                                                        {user.is_suspended ? __('Activate User') : __('Suspend User')}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleUserAction(user.id, 'delete')}
                                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                    >
                                                                        {__('Delete User')}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.links && users.links.length > 3 && (
                            <div className="bg-[#F5F9FA] px-6 py-3 border-t border-[#EAEAEA]">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-[#6C6C6C] font-inter">
                                        {__('Showing :from to :to of :total results', {
                                            from: users.from || 0,
                                            to: users.to || 0,
                                            total: users.total || 0
                                        })}
                                    </div>
                                    <div className="flex space-x-1">
                                        {users.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                                    link.active
                                                        ? 'bg-[#065033] border-[#065033] text-white'
                                                        : 'bg-white border-[#EAEAEA] text-[#6C6C6C] hover:border-[#065033] hover:text-[#065033]'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                preserveState
                                                preserveScroll
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
