import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { useTranslations } from '@/Utils/translations';

// Icons in dashboard style
const Icons = {
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
    User: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Phone: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    Mail: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Copy: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    CheckCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Calendar: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    CreditCard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    Hash: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
    ),
    ExternalLink: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    ),
    Lightbulb: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    ),
};

export default function ContactDetails({ purchase, property, owner }) {
    const { __ } = useTranslations();
    const [copiedText, setCopiedText] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedText(label);
            setTimeout(() => setCopiedText(''), 2000);
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

    const handleBackClick = () => {
        window.history.back();
    };

    // Function to open Gmail with pre-filled email
    const openGmailCompose = () => {
        const subject = encodeURIComponent(__('Property Service Proposal') + ' - ' + property.adresse_complete);
        const body = encodeURIComponent(`${__('Hello')} ${owner.prenom} ${owner.nom},

${__('I am contacting you regarding your property located at')} ${property.adresse_complete}.

${__('As a real estate agent, I would be delighted to assist you with selling your property.')}

${__('I remain at your disposal for any additional information.')}

${__('Best regards')}`);
        
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(owner.email)}&su=${subject}&body=${body}`;
        
        // Open Gmail in new tab
        window.open(gmailUrl, '_blank');
    };

    // Function to handle phone calls with multiple options
    const handleCallOwner = () => {
        const phoneNumber = owner.telephone;
        
        // For mobile devices, directly use tel: protocol
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.open(`tel:${phoneNumber}`, '_self');
        } else {
            // For desktop, show confirmation and options
            if (confirm(`Call ${owner.prenom} ${owner.nom} at ${phoneNumber}?\n\nThis will open your default phone app or dialer.\n\nClick OK to call, or Cancel to copy the number instead.`)) {
                // Try to open phone app
                window.open(`tel:${phoneNumber}`, '_blank');
            } else {
                // Copy to clipboard as fallback
                copyToClipboard(phoneNumber, 'phone');
            }
        }
    };

    return (
        <AuthenticatedLayout
            usePillNavigation={false}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Contact Information')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-[14px] h-[31px] flex-none order-1 flex-grow-0">
                        <button 
                            onClick={handleBackClick}
                            className="flex justify-center items-center px-[10px] py-[6px] gap-[6px] h-[31px] bg-[#F5F9FA] border-[1.5px] border-[#EAEAEA] rounded-[20px] hover:bg-[#EAEAEA] transition-colors focus:outline-none"
                        >
                            <Icons.ArrowLeft className="w-4 h-4 text-[#000]" />
                            <span className="font-inter font-medium text-[12px] leading-[16px] text-[#000]">
                                {__('Back to Purchases')}
                            </span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={__('Contact Information')} />

            <div className="py-8">
                <div className="mx-auto max-w-[1336px] px-8">
                    {/* Success Banner */}
                    <div className="bg-[#EBF4FF] border border-[#BFDBFE] rounded-lg p-6 mb-8">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mr-4">
                                <Icons.CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[#1E40AF] font-inter mb-1">
                                    {__('Contact purchased successfully!')}
                                </h3>
                                <p className="text-[#1E40AF] font-inter">
                                    {__('You can now contact the property owner directly.')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Property Information - Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-4 flex items-center">
                                        <Icons.Home className="w-5 h-5 mr-2 text-[#1E40AF]" />
                                        {__('Property Details')}
                                    </h3>
                                    
                                    {/* Property Image */}
                                    <div className="mb-6">
                                        {property.images && property.images.length > 0 ? (
                                            <img
                                                src={`/storage/${property.images[0].chemin_fichier}`}
                                                alt={property.adresse_complete}
                                                className="w-full h-64 object-cover rounded-lg border border-[#EAEAEA]"
                                                onError={(e) => {
                                                    if (!e.target.dataset.fallbackAttempted) {
                                                        e.target.dataset.fallbackAttempted = 'true';
                                                        e.target.src = `/images/${property.images[0].chemin_fichier}`;
                                                    } else {
                                                        // Replace with placeholder div
                                                        const placeholder = document.createElement('div');
                                                        placeholder.className = 'w-full h-64 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg flex items-center justify-center';
                                                        placeholder.innerHTML = '<div class="text-center"><svg class="w-12 h-12 text-[#6C6C6C] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg><p class="text-[#6C6C6C] font-inter text-sm">No images available</p></div>';
                                                        e.target.parentNode.replaceChild(placeholder, e.target);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <Icons.Home className="w-12 h-12 text-[#6C6C6C] mx-auto mb-2" />
                                                    <p className="text-[#6C6C6C] font-inter text-sm">{__('No images available')}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-[#EBF4FF] border border-[#BFDBFE] p-4 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <Icons.MapPin className="w-4 h-4 text-[#1E40AF] mr-2" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Address')}</span>
                                                </div>
                                                <p className="text-[#000] font-inter font-medium">{property.adresse_complete}</p>
                                                <p className="text-[#6C6C6C] font-inter text-sm">{property.ville}, {property.pays}</p>
                                            </div>
                                            
                                            <div className="bg-[#EBF4FF] border border-[#BFDBFE] p-4 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <Icons.Euro className="w-4 h-4 text-[#1E40AF] mr-2" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Price')}</span>
                                                </div>
                                                <p className="text-xl font-bold text-[#1E40AF] font-inter">
                                                    {formatPrice(property.prix)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="bg-[#EBF4FF] border border-[#BFDBFE] p-4 rounded-lg text-center">
                                                <div className="flex items-center justify-center mb-2">
                                                    <Icons.Home className="w-4 h-4 text-[#1E40AF] mr-1" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Type')}</span>
                                                </div>
                                                <p className="text-[#000] font-inter font-medium">{getPropertyTypeLabel(property.type_propriete)}</p>
                                            </div>
                                            
                                            <div className="bg-[#EBF4FF] border border-[#BFDBFE] p-4 rounded-lg text-center">
                                                <div className="flex items-center justify-center mb-2">
                                                    <Icons.Maximize2 className="w-4 h-4 text-[#1E40AF] mr-1" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Surface')}</span>
                                                </div>
                                                <p className="text-[#000] font-inter font-medium">{property.superficie_m2} m²</p>
                                            </div>
                                            
                                            {property.nombre_pieces && (
                                                <div className="bg-[#EBF4FF] border border-[#BFDBFE] p-4 rounded-lg text-center">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <Icons.User className="w-4 h-4 text-[#1E40AF] mr-1" />
                                                        <span className="text-sm font-medium text-[#000] font-inter">{__('Rooms')}</span>
                                                    </div>
                                                    <p className="text-[#000] font-inter font-medium">{property.nombre_pieces}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information - Right Column */}
                        <div className="sticky top-24 space-y-6 h-fit">
                            <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-6 flex items-center">
                                        <Icons.User className="w-5 h-5 mr-2 text-[#1E40AF]" />
                                        {__('Owner Information')}
                                    </h3>

                                    {/* Owner Avatar */}
                                    <div className="flex items-center mb-6 p-4 bg-[#EBF4FF] border border-[#BFDBFE] rounded-lg">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] rounded-full flex items-center justify-center mr-4">
                                            <span className="text-white text-xl font-bold font-inter">
                                                {owner.prenom?.[0]}{owner.nom?.[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#000] font-inter text-lg">
                                                {owner.prenom} {owner.nom}
                                            </p>
                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                {__('Property Owner')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div className="space-y-4 mb-6">
                                        {/* Email */}
                                        <div className="p-4 bg-[#EBF4FF] border border-[#BFDBFE] rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <Icons.Mail className="w-4 h-4 text-[#1E40AF] mr-2" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Email')}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => copyToClipboard(owner.email, 'email')}
                                                        className={`p-1 rounded transition-colors ${
                                                            copiedText === 'email' 
                                                                ? 'text-[#1E40AF] bg-[#EBF4FF]' 
                                                                : 'text-[#6C6C6C] hover:text-[#1E40AF] hover:bg-[#EBF4FF]'
                                                        }`}
                                                        title={__('Copy')}
                                                    >
                                                        <Icons.Copy className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={openGmailCompose}
                                                        className="p-1 text-[#6C6C6C] hover:text-[#1E40AF] hover:bg-[#EBF4FF] rounded transition-colors"
                                                        title={__('Send Email')}
                                                    >
                                                        <Icons.ExternalLink className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[#000] font-inter font-medium break-all">
                                                {owner.email}
                                            </p>
                                        </div>

                                        {/* Phone */}
                                        <div className="p-4 bg-[#EBF4FF] border border-[#BFDBFE] rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <Icons.Phone className="w-4 h-4 text-[#1E40AF] mr-2" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Phone')}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => copyToClipboard(owner.telephone, 'phone')}
                                                        className={`p-1 rounded transition-colors ${
                                                            copiedText === 'phone' 
                                                                ? 'text-[#1E40AF] bg-[#EBF4FF]' 
                                                                : 'text-[#6C6C6C] hover:text-[#1E40AF] hover:bg-[#EBF4FF]'
                                                        }`}
                                                        title={__('Copy')}
                                                    >
                                                        <Icons.Copy className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleCallOwner}
                                                        className="p-1 text-[#6C6C6C] hover:text-[#1E40AF] hover:bg-[#EBF4FF] rounded transition-colors"
                                                        title={__('Call')}
                                                    >
                                                        <Icons.ExternalLink className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[#000] font-inter font-medium">
                                                {owner.telephone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="space-y-3 mb-6">
                                        <button
                                            onClick={openGmailCompose}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white rounded-lg font-inter font-medium text-sm transition-colors cursor-pointer"
                                        >
                                            <Icons.Mail className="w-4 h-4 mr-2" />
                                            {__('Send Email to Owner')}
                                        </button>
                                        
                                        <button
                                            onClick={handleCallOwner}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-[#EBF4FF] hover:bg-[#BFDBFE] text-[#1E40AF] border border-[#1E40AF] rounded-lg font-inter font-medium text-sm transition-colors cursor-pointer"
                                        >
                                            <Icons.Phone className="w-4 h-4 mr-2" />
                                            {__('Call Owner')}
                                        </button>
                                    </div>

                                    {/* Purchase Information */}
                                    <div className="pt-6 border-t border-[#EAEAEA]">
                                        <h4 className="text-sm font-semibold text-[#000] font-inter mb-4">
                                            {__('Purchase Information')}
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center">
                                                    <Icons.Calendar className="w-4 h-4 text-[#1E40AF] mr-2" />
                                                    <span className="text-sm text-[#000] font-inter">{__('Purchase Date')}</span>
                                                </div>
                                                <span className="text-sm text-[#000] font-inter font-medium">
                                                    {formatDate(purchase.created_at)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center">
                                                    <Icons.CreditCard className="w-4 h-4 text-[#1E40AF] mr-2" />
                                                    <span className="text-sm text-[#000] font-inter">{__('Amount Paid')}</span>
                                                </div>
                                                <span className="text-sm text-[#1E40AF] font-inter font-bold">
                                                    {formatPrice(purchase.montant_paye)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center">
                                                    <Icons.Hash className="w-4 h-4 text-[#1E40AF] mr-2" />
                                                    <span className="text-sm text-[#000] font-inter">{__('Transaction ID')}</span>
                                                </div>
                                                <span className="text-xs text-[#6C6C6C] font-inter font-mono">
                                                    {purchase.stripe_payment_intent_id.substring(0, 15)}...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-8 bg-[#EBF4FF] border border-[#BFDBFE] rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-[#1E40AF] font-inter mb-4 flex items-center">
                            <Icons.Lightbulb className="w-5 h-5 mr-2" />
                            {__('Tips for contacting the owner')}
                        </h3>
                        <ul className="space-y-3 text-[#1E40AF] font-inter">
                            <li className="flex items-start">
                                <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                {__('Introduce yourself and mention that you are a real estate agent')}
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                {__('Offer a free evaluation and personalized sales plan')}
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                {__('Highlight your local expertise and references')}
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                {__('Be professional and respectful in your communications')}
                            </li>
                        </ul>
                    </div>

                    {/* Copied notification */}
                    {copiedText && (
                        <div className="fixed bottom-4 right-4 bg-[#2563eb] text-white px-4 py-2 rounded-lg font-inter text-sm">
                            {__('Copied to clipboard')}!
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
