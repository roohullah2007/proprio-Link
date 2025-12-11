import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';
import { formatDate } from '@/Utils/dateUtils';

const Icons = {
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
    TrendingUp: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    CreditCard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    Calendar: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    Search: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
};

export default function Invoices({ auth, invoices, stats, filters, error }) {
    const { __ } = useTranslations();
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    // Handle error case
    if (error) {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                        <div className="flex-none order-0 flex-grow-0">
                            <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                                {__('Invoices & Revenue')}
                            </h1>
                        </div>
                    </div>
                }
            >
                <Head title={__("Invoices") + " - Propio"} />
                <div className="py-8">
                    <div className="mx-auto max-w-[1336px] px-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-red-800 font-inter mb-2">
                                        {__('Database Setup Required')}
                                    </h3>
                                    <p className="text-red-700 font-inter mb-4">
                                        {error}
                                    </p>
                                    <div className="bg-white border border-red-200 rounded p-4">
                                        <h4 className="font-semibold text-red-800 font-inter mb-2">
                                            {__('How to fix:')}
                                        </h4>
                                        <ol className="list-decimal list-inside text-red-700 font-inter space-y-1">
                                            <li>{__('Open terminal/command prompt')}</li>
                                            <li>{__('Navigate to your Laravel project directory')}</li>
                                            <li>{__('Run: php artisan migrate')}</li>
                                            <li>{__('Refresh this page')}</li>
                                        </ol>
                                        <p className="mt-4 text-sm text-red-600 font-inter">
                                            {__('Alternative: Run the fix_database.php script in your project root.')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };


    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        
        window.location.href = route('admin.invoices.index') + '?' + params.toString();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Invoices & Revenue')}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={__("Invoices") + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1336px] px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Icons.DocumentText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-[#000] font-inter">
                                        {stats.total_invoices}
                                    </h3>
                                    <p className="text-sm text-[#6C6C6C] font-inter">{__('Total Invoices')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100">
                                    <Icons.TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-[#000] font-inter">
                                        {formatCurrency(stats.total_amount)}
                                    </h3>
                                    <p className="text-sm text-[#6C6C6C] font-inter">{__('Total Revenue')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <Icons.Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-[#000] font-inter">
                                        {stats.invoices_this_month}
                                    </h3>
                                    <p className="text-sm text-[#6C6C6C] font-inter">{__('This Month')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-orange-100">
                                    <Icons.CreditCard className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-[#000] font-inter">
                                        {formatCurrency(stats.amount_this_month)}
                                    </h3>
                                    <p className="text-sm text-[#6C6C6C] font-inter">{__('Monthly Revenue')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 mb-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                        {__('Search')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder={__('Invoice number, agent name, email...')}
                                            className="w-full pl-10 pr-4 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033] font-inter"
                                        />
                                        <Icons.Search className="absolute left-3 top-2.5 w-5 h-5 text-[#6C6C6C]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                        {__('From Date')}
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full px-4 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033] font-inter"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                        {__('To Date')}
                                    </label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full px-4 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033] focus:ring-1 focus:ring-[#065033] font-inter"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                        &nbsp;
                                    </label>
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-[#065033] text-white rounded-lg hover:bg-[#054028] transition-colors font-inter"
                                    >
                                        {__('Filter')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Invoices Table */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#EAEAEA]">
                            <h3 className="text-lg font-semibold text-[#000] font-inter">
                                {__('Invoices')} ({invoices.total})
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F5F9FA] border-b border-[#EAEAEA]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6C6C6C] uppercase tracking-wider font-inter">
                                            {__('Invoice')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6C6C6C] uppercase tracking-wider font-inter">
                                            {__('Agent')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6C6C6C] uppercase tracking-wider font-inter">
                                            {__('Property')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6C6C6C] uppercase tracking-wider font-inter">
                                            {__('Amount')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6C6C6C] uppercase tracking-wider font-inter">
                                            {__('Date')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6C6C6C] uppercase tracking-wider font-inter">
                                            {__('Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#EAEAEA]">
                                    {invoices.data.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-[#F5F9FA]">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Icons.DocumentText className="w-5 h-5 text-[#6C6C6C] mr-3" />
                                                    <div>
                                                        <p className="font-medium text-[#000] font-inter">
                                                            {invoice.invoice_number}
                                                        </p>
                                                        <p className="text-sm text-[#6C6C6C] font-inter">
                                                            {invoice.contact_purchase?.stripe_payment_intent_id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium text-[#000] font-inter">
                                                        {invoice.agent_name}
                                                    </p>
                                                    <p className="text-sm text-[#6C6C6C] font-inter">
                                                        {invoice.agent_email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium text-[#000] font-inter">
                                                        {invoice.property_reference}
                                                    </p>
                                                    {invoice.contact_purchase?.property && (
                                                        <p className="text-sm text-[#6C6C6C] font-inter">
                                                            {invoice.contact_purchase.property.ville}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-semibold text-[#065033] font-inter">
                                                    {formatCurrency(invoice.amount)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-[#000] font-inter">
                                                    {formatDate(invoice.issued_at)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <a
                                                        href={route('admin.invoices.show', invoice.id)}
                                                        className="inline-flex items-center px-3 py-1 border border-[#EAEAEA] rounded-lg text-sm font-medium text-[#6C6C6C] bg-white hover:bg-[#F5F9FA] transition-colors font-inter"
                                                        title={__('View Invoice')}
                                                    >
                                                        <Icons.Eye className="w-4 h-4 mr-1" />
                                                        {__('View')}
                                                    </a>
                                                    <a
                                                        href={route('invoices.generate', invoice.contact_purchase_id)}
                                                        className="inline-flex items-center px-3 py-1 border border-[#065033] rounded-lg text-sm font-medium text-[#065033] bg-white hover:bg-[#F5F9FA] transition-colors font-inter"
                                                        title={__('Download PDF')}
                                                    >
                                                        <Icons.Download className="w-4 h-4 mr-1" />
                                                        {__('PDF')}
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {invoices.data.length === 0 && (
                                <div className="text-center py-12">
                                    <Icons.DocumentText className="w-12 h-12 text-[#6C6C6C] mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-[#000] font-inter mb-2">
                                        {__('No invoices found')}
                                    </h3>
                                    <p className="text-[#6C6C6C] font-inter">
                                        {__('No invoices match your current filters.')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {invoices.data.length > 0 && (
                            <div className="px-6 py-4 border-t border-[#EAEAEA]">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-[#6C6C6C] font-inter">
                                        {__('Showing')} {invoices.from} {__('to')} {invoices.to} {__('of')} {invoices.total} {__('results')}
                                    </div>
                                    <div className="flex space-x-2">
                                        {invoices.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-lg font-inter ${
                                                    link.active
                                                        ? 'bg-[#065033] text-white'
                                                        : link.url
                                                        ? 'bg-white border border-[#EAEAEA] text-[#6C6C6C] hover:bg-[#F5F9FA]'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
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
