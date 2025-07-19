import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

// Dashboard-style icons
const Icons = {
    Search: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    ShoppingBag: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
        </svg>
    ),
    CreditCard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    DollarSign: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
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
    MapPin: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Maximize2: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6m-6 0L9 15M9 3H3v6m6 0l6-6" />
        </svg>
    ),
    Euro: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
    ),
    CheckCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    Download: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
};

export default function Purchases({ purchases }) {
    const { __ } = useTranslations();

    const formatPrice = (price) => {
        // Ensure we have a valid number
        const numericPrice = Number(price) || 0;
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 2,
        }).format(numericPrice);
    };

    // Calculate total spent with better error handling
    const calculateTotalSpent = () => {
        if (!purchases || !purchases.data || !Array.isArray(purchases.data)) {
            return 0;
        }
        
        return purchases.data.reduce((sum, purchase) => {
            const amount = Number(purchase?.montant_paye) || 0;
            return sum + amount;
        }, 0);
    };

    const totalSpent = calculateTotalSpent();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPropertyTypeLabel = (type) => {
        const types = {
            'APPARTEMENT': __('Apartment'),
            'MAISON': __('House'),
            'TERRAIN': __('Land'),
            'COMMERCIAL': __('Commercial'),
            'BUREAU': __('Office'),
            'AUTRES': __('Other'),
        };
        return types[type] || type;
    };

    return (
        <AuthenticatedLayout
            usePillNavigation={false}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('My Purchases')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-[14px] h-[31px] flex-none order-1 flex-grow-0">
                        <Link
                            href={route('agent.properties')}
                            className="flex justify-center items-center px-[10px] py-[6px] gap-[6px] h-[31px] bg-[#065033] border-[1.5px] border-[#065033] rounded-[20px] hover:bg-[#054028] transition-colors focus:outline-none"
                        >
                            <Icons.Search className="w-5 h-5 text-white" />
                            <span className="font-inter font-medium text-[12px] leading-[16px] text-white">
                                {__('Search Properties')}
                            </span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={__('My Purchases')} />

            <div className="py-8">
                <div className="mx-auto max-w-[1337px] px-8">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-14 h-14 bg-[#F5F9FA] border border-[#EAEAEA] rounded-full flex items-center justify-center">
                                    <Icons.ShoppingBag className="w-7 h-7 text-[#065033]" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[#000] font-inter">
                                        {__('Contacts Purchased')}
                                    </p>
                                    <p className="text-2xl font-bold text-[#000] font-inter">
                                        {purchases?.total || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-14 h-14 bg-[#F5F9FA] border border-[#EAEAEA] rounded-full flex items-center justify-center">
                                    <Icons.DollarSign className="w-7 h-7 text-[#065033]" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[#000] font-inter">
                                        {__('Total Spent')}
                                    </p>
                                    <p className="text-2xl font-bold text-[#000] font-inter">
                                        {formatPrice(totalSpent)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-14 h-14 bg-[#F5F9FA] border border-[#EAEAEA] rounded-full flex items-center justify-center">
                                    <Icons.Calendar className="w-7 h-7 text-[#065033]" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[#000] font-inter">
                                        {__('This Month')}
                                    </p>
                                    <p className="text-2xl font-bold text-[#000] font-inter">
                                        {purchases?.data?.filter(purchase => 
                                            new Date(purchase.created_at).getMonth() === new Date().getMonth()
                                        ).length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purchases List */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-[#000] font-inter mb-6">
                                {__('Purchase History')}
                            </h3>

                            {purchases?.data && purchases.data.length > 0 ? (
                                <div className="space-y-4">
                                    {purchases.data.map((purchase) => (
                                        <div
                                            key={purchase.id}
                                            className="border border-[#EAEAEA] rounded-lg p-6 hover:bg-[#F5F9FA] transition-colors duration-200"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                {/* Property Info */}
                                                <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                                                    {/* Property Image */}
                                                    <div className="flex-shrink-0">
                                                        {purchase?.property?.images && purchase.property.images.length > 0 ? (
                                                            <img
                                                                src={`/storage/${purchase.property.images[0].chemin_fichier}`}
                                                                alt={purchase.property.adresse_complete}
                                                                className="w-20 h-20 object-cover rounded-lg border border-[#EAEAEA]"
                                                                onError={(e) => {
                                                                    if (!e.target.dataset.fallbackAttempted) {
                                                                        e.target.dataset.fallbackAttempted = 'true';
                                                                        e.target.src = `/images/${purchase.property.images[0].chemin_fichier}`;
                                                                    } else {
                                                                        // Replace with placeholder div
                                                                        const placeholder = document.createElement('div');
                                                                        placeholder.className = 'w-20 h-20 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg flex items-center justify-center';
                                                                        placeholder.innerHTML = '<svg class="w-10 h-10 text-[#6C6C6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>';
                                                                        e.target.parentNode.replaceChild(placeholder, e.target);
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-20 h-20 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg flex items-center justify-center">
                                                                <Icons.Home className="w-10 h-10 text-[#6C6C6C]" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Property Details */}
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-[#000] font-inter mb-1">
                                                            {purchase?.property?.adresse_complete || 'N/A'}
                                                        </h4>
                                                        <div className="flex items-center text-[#6C6C6C] font-inter mb-3">
                                                            <Icons.MapPin className="w-5 h-5 mr-2" />
                                                            {purchase?.property?.ville || 'N/A'}, {purchase?.property?.pays || 'N/A'}
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 text-sm">
                                                            <div className="flex items-center bg-[#F0F9F4] border border-[#D1F2D9] rounded-full px-3 py-1">
                                                                <Icons.Euro className="w-4 h-4 mr-2 text-[#065033]" />
                                                                <span className="text-[#065033] font-medium font-inter">
                                                                    {formatPrice(purchase?.property?.prix || 0)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center bg-[#F5F9FA] border border-[#EAEAEA] rounded-full px-3 py-1">
                                                                <Icons.Maximize2 className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                                <span className="text-[#6C6C6C] font-inter">
                                                                    {purchase?.property?.superficie_m2 || 0} m²
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center bg-[#F5F9FA] border border-[#EAEAEA] rounded-full px-3 py-1">
                                                                <Icons.Home className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                                <span className="text-[#6C6C6C] font-inter">
                                                                    {getPropertyTypeLabel(purchase?.property?.type_propriete) || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Purchase Info */}
                                                <div className="flex flex-col lg:items-end space-y-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex items-center bg-[#F0F9F4] border border-[#D1F2D9] rounded-full px-3 py-1">
                                                            <Icons.CheckCircle className="w-4 h-4 mr-2 text-[#065033]" />
                                                            <span className="text-[#065033] text-xs font-medium font-inter">
                                                                {__('Confirmed')}
                                                            </span>
                                                        </div>
                                                        <span className="text-lg font-bold text-[#000] font-inter">
                                                            {formatPrice(purchase?.montant_paye || 0)}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-sm text-[#6C6C6C] font-inter flex items-center">
                                                        <Icons.Calendar className="w-4 h-4 mr-2" />
                                                        {__('Purchased on')} {formatDate(purchase?.created_at)}
                                                    </p>

                                                    <div className="flex flex-col space-y-2">
                                                        <Link
                                                            href={route('agent.contact-details', purchase.id)}
                                                            className="flex items-center justify-center px-4 py-2 bg-[#F5F9FA] hover:bg-[#EAEAEA] text-[#065033] border border-[#065033] rounded-lg font-inter font-medium text-sm transition-colors"
                                                        >
                                                            <Icons.Eye className="w-5 h-5 mr-2" />
                                                            {__('View Contact Information')}
                                                        </Link>
                                                        
                                                        {purchase.statut_paiement === 'succeeded' && (
                                                            <a
                                                                href={route('invoices.generate', purchase.id)}
                                                                className="flex items-center justify-center px-4 py-2 bg-white hover:bg-[#F5F9FA] text-[#6C6C6C] border border-[#EAEAEA] rounded-lg font-inter font-medium text-sm transition-colors"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Icons.Download className="w-5 h-5 mr-2" />
                                                                {__('Download Invoice')}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-[#F5F9FA] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icons.ShoppingBag className="w-10 h-10 text-[#6C6C6C]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-2">
                                        {__('No Purchases Yet')}
                                    </h3>
                                    <p className="text-[#6C6C6C] font-inter mb-6">
                                        {__('You haven\'t purchased any property owner contacts yet.')}
                                    </p>
                                    <div className="flex justify-center">
                                        <Link
                                            href={route('agent.properties')}
                                            className="flex items-center justify-center px-6 py-3 bg-[#065033] hover:bg-[#054028] text-white rounded-lg font-inter font-medium transition-colors"
                                        >
                                            <Icons.Search className="w-5 h-5 mr-2" />
                                            {__('Search Properties')}
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {purchases?.links && purchases.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {purchases.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                    link.active
                                                        ? 'bg-[#065033] text-white'
                                                        : link.url
                                                        ? 'text-[#6C6C6C] hover:bg-[#F5F9FA] border border-[#EAEAEA]'
                                                        : 'text-[#EAEAEA] cursor-not-allowed'
                                                }`}
                                                preserveState
                                                preserveScroll
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}