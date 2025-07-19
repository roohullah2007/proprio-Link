import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

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
    Home: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
};

export default function AgentInvoices({ auth, purchases }) {
    const { __ } = useTranslations();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const successfulPurchases = purchases.filter(purchase => purchase.statut_paiement === 'succeeded');
    const totalSpent = successfulPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.montant_paye), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('My Invoices')}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={__("My Invoices")} />

            <div className="py-8">
                <div className="mx-auto max-w-[1336px] px-8">
                    {/* Summary Card */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Icons.DocumentText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-[#000] font-inter">
                                        {successfulPurchases.length}
                                    </h3>
                                    <p className="text-sm text-[#6C6C6C] font-inter">{__('Contact Purchases')}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100">
                                    <Icons.CreditCard className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-[#000] font-inter">
                                        {formatCurrency(totalSpent)}
                                    </h3>
                                    <p className="text-sm text-[#6C6C6C] font-inter">{__('Total Spent')}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <Icons.Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-[#000] font-inter">
                                        {successfulPurchases.filter(p => 
                                            new Date(p.paiement_confirme_a).getMonth() === new Date().getMonth()
                                        ).length}
                                    </h3>
                                    <p className="text-sm text-[#6C6C6C] font-inter">{__('This Month')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoices List */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#EAEAEA]">
                            <h3 className="text-lg font-semibold text-[#000] font-inter">
                                {__('Purchase History & Invoices')}
                            </h3>
                        </div>

                        <div className="divide-y divide-[#EAEAEA]">
                            {successfulPurchases.map((purchase) => (
                                <div key={purchase.id} className="p-6 hover:bg-[#F5F9FA]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 rounded-full bg-[#F5F9FA]">
                                                <Icons.Home className="w-6 h-6 text-[#065033]" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#000] font-inter">
                                                    {purchase.property ? (
                                                        `${purchase.property.type_propriete} - ${purchase.property.ville}`
                                                    ) : (
                                                        __('Property Contact Purchase')
                                                    )}
                                                </h4>
                                                <div className="flex items-center space-x-4 text-sm text-[#6C6C6C] font-inter">
                                                    <span>{__('Purchased on')} {formatDate(purchase.paiement_confirme_a)}</span>
                                                    <span>•</span>
                                                    <span>{__('Payment ID')}: {purchase.stripe_payment_intent_id}</span>
                                                </div>
                                                {purchase.property && (
                                                    <p className="text-sm text-[#6C6C6C] font-inter mt-1">
                                                        {__('Owner')}: {purchase.property.proprietaire.prenom} {purchase.property.proprietaire.nom}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-[#065033] font-inter">
                                                    {formatCurrency(purchase.montant_paye)}
                                                </p>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {__('Paid')}
                                                </p>
                                            </div>
                                            <a
                                                href={route('invoices.generate', purchase.id)}
                                                className="inline-flex items-center px-4 py-2 border border-[#065033] rounded-lg text-sm font-medium text-[#065033] bg-white hover:bg-[#F5F9FA] transition-colors font-inter"
                                            >
                                                <Icons.Download className="w-4 h-4 mr-2" />
                                                {__('Download Invoice')}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {successfulPurchases.length === 0 && (
                                <div className="text-center py-12">
                                    <Icons.DocumentText className="w-12 h-12 text-[#6C6C6C] mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-[#000] font-inter mb-2">
                                        {__('No invoices yet')}
                                    </h3>
                                    <p className="text-[#6C6C6C] font-inter mb-4">
                                        {__('You haven\'t made any property contact purchases yet.')}
                                    </p>
                                    <Link
                                        href="/properties/search"
                                        className="inline-flex items-center px-4 py-2 bg-[#065033] text-white rounded-lg hover:bg-[#054028] transition-colors font-inter"
                                    >
                                        {__('Browse Properties')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
