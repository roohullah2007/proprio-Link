import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { useTranslations } from '@/Utils/translations';

// Icons for the property details page
const Icons = {
    MapPin: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Home: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
    Calendar: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
    CheckCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    ArrowLeft: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    ),
    ArrowRight: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
    Shield: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
};

export default function PropertyDetails({ property, contactPrice, currency }) {
    const { __ } = useTranslations();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);

    // Function to format text values for human readability
    const formatHumanText = (text) => {
        if (!text) return __('Not specified');
        
        // Handle specific cases
        if (text === 'NON_RENSEIGNE' || text === 'NON_SPECIFIE') {
            return __('Not specified');
        }
        
        // Convert underscores to spaces and capitalize
        return text
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showImageModal) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [showImageModal]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency.toUpperCase(),
            maximumFractionDigits: 0,
        }).format(price);
    };

    const nextImage = () => {
        if (property.images && property.images.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === property.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (property.images && property.images.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? property.images.length - 1 : prev - 1
            );
        }
    };

    const handlePurchaseContact = () => {
        router.visit(route('payment.form', property.id));
    };

    const openImageModal = (index = null) => {
        if (index !== null) {
            setCurrentImageIndex(index);
        }
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    {/* Left side - Property details title and back button */}
                    <div className="flex items-center space-x-4 flex-none order-0 flex-grow-0">
                        <Link
                            href={route('agent.properties')}
                            className="flex items-center text-[#6C6C6C] hover:text-[#065033] font-inter text-sm font-medium transition-colors"
                        >
                            <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                            {__('Back to Properties')}
                        </Link>
                        <div className="h-4 w-px bg-[#EAEAEA]"></div>
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Property Details')}
                        </h1>
                    </div>
                    
                    {/* Right side - Status badge */}
                    <div className="flex items-center gap-[14px] h-[31px] flex-none order-1 flex-grow-0">
                        <div className={`flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] rounded-full flex-none order-0 flex-grow-0 ${
                            property.is_purchased
                                ? 'bg-[#065033] border border-[#065033]'
                                : 'bg-[#F5F9FA] border border-[#EAEAEA]'
                        }`}>
                            <Icons.CheckCircle className={`w-4 h-4 ${property.is_purchased ? 'text-white' : 'text-[#6C6C6C]'}`} />
                            <span className={`text-sm font-medium font-inter whitespace-nowrap ${
                                property.is_purchased ? 'text-white' : 'text-[#6C6C6C]'
                            }`}>
                                {property.is_purchased ? __('Contact Purchased') : __('Available')}
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`${property.type_propriete} - ${property.ville} - Propio`} />

            <div className="py-8">
                <div className="mx-auto max-w-[1336px] px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - Images and Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Image Gallery Section */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                                <div className="relative">
                                    {property.images && property.images.length > 0 ? (
                                        <>
                                            <div className="relative h-96 lg:h-[500px] group cursor-pointer" onClick={() => openImageModal()}>
                                                <img
                                                    src={`/storage/${property.images[currentImageIndex].chemin_fichier}`}
                                                    alt={property.adresse_complete}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                                    onError={(e) => {
                                                        if (!e.target.dataset.fallbackAttempted) {
                                                            e.target.dataset.fallbackAttempted = 'true';
                                                            e.target.src = `/images/${property.images[currentImageIndex].chemin_fichier}`;
                                                        } else {
                                                            // Create a placeholder div and replace the image
                                                            const placeholder = document.createElement('div');
                                                            placeholder.className = 'w-full h-full bg-[#F5F9FA] flex items-center justify-center';
                                                            placeholder.innerHTML = '<div class="text-center"><svg class="w-16 h-16 text-[#6C6C6C] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg><p class="text-[#6C6C6C] font-medium font-inter">No photos available</p></div>';
                                                            e.target.parentNode.replaceChild(placeholder, e.target);
                                                        }
                                                    }}
                                                />
                                                
                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-lg px-4 py-2 flex items-center">
                                                        <Icons.Eye className="w-5 h-5 mr-2 text-[#000]" />
                                                        <span className="text-[#000] font-medium font-inter">{__('View Gallery')}</span>
                                                    </div>
                                                </div>
                                                
                                                {property.images.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-[#000] p-3 rounded-full border border-[#EAEAEA] transition-all duration-200 hover:scale-110"
                                                        >
                                                            <Icons.ArrowLeft className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-[#000] p-3 rounded-full border border-[#EAEAEA] transition-all duration-200 hover:scale-110"
                                                        >
                                                            <Icons.ArrowRight className="w-5 h-5" />
                                                        </button>
                                                        
                                                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium font-inter">
                                                            {currentImageIndex + 1} / {property.images.length}
                                                        </div>
                                                    </>
                                                )}
                                                
                                                {/* Gallery button */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openImageModal(); }}
                                                    className="absolute bottom-4 left-4 bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm font-medium font-inter transition-all duration-200 flex items-center"
                                                >
                                                    <Icons.Maximize2 className="w-4 h-4 mr-2" />
                                                    {property.images.length} {__('photos')}
                                                </button>
                                            </div>

                                            {/* Thumbnails - Only if more than 1 image */}
                                            {property.images.length > 1 && (
                                                <div className="p-6 bg-[#F5F9FA]">
                                                    <div className="grid grid-cols-6 gap-4">
                                                        {property.images.slice(0, 6).map((image, index) => (
                                                            <button
                                                                key={image.id}
                                                                onClick={() => setCurrentImageIndex(index)}
                                                                className={`relative h-20 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 border-2 ${
                                                                    index === currentImageIndex 
                                                                        ? 'border-[#065033] ring-2 ring-[#065033] ring-opacity-20 scale-105' 
                                                                        : 'border-[#EAEAEA] hover:border-[#065033]'
                                                                }`}
                                                            >
                                                                <img
                                                                    src={`/storage/${image.chemin_fichier}`}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        if (!e.target.dataset.fallbackAttempted) {
                                                                            e.target.dataset.fallbackAttempted = 'true';
                                                                            e.target.src = `/images/${image.chemin_fichier}`;
                                                                        } else {
                                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik00MC41IDU2SDE5LjVDMTguNjc5IDU2IDE4IDU1LjMyMSAxOCA1NC41VjI1LjVDMTggMjQuNjc5IDE4LjY3OSAyNCAxOS41IDI0SDQwLjVDNDEuMzIxIDI0IDQyIDI0LjY3OSA0MiAyNS41VjU0LjVDNDIgNTUuMzIxIDQxLjMyMSA1NiA0MC41IDU2Wk0yMCAyNlY1NEg0MFYyNkgyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwIDM0QzMxLjEwNDYgMzQgMzIgMzMuMTA0NiAzMiAzMkMzMiAzMC44OTU0IDMxLjEwNDYgMzAgMzAgMzBDMjguODk1NCAzMCAyOCAzMC44OTU0IDI4IDMyQzI4IDMzLjEwNDYgMjguODk1NCAzNCAzMCAzNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTQwIDQ5SDIwTDI3IDQyTDMwIDQ1TDM3IDM4TDQwIDQxVjQ5WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                                                        }
                                                                    }}
                                                                />
                                                            </button>
                                                        ))}
                                                        {property.images.length > 6 && (
                                                            <button
                                                                onClick={() => openImageModal()}
                                                                className="h-20 bg-[#EAEAEA] rounded-lg flex items-center justify-center hover:bg-[#065033] hover:text-white transition-all duration-300 border-2 border-[#EAEAEA] hover:border-[#065033]"
                                                            >
                                                                <span className="text-sm font-bold font-inter">
                                                                    +{property.images.length - 6}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="h-96 lg:h-[500px] bg-[#F5F9FA] flex items-center justify-center">
                                            <div className="text-center">
                                                <Icons.Home className="w-16 h-16 text-[#6C6C6C] mx-auto mb-4" />
                                                <p className="text-[#6C6C6C] font-medium font-inter">{__('No photos available')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Property Description */}
                            {property.description && (
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">{__('Description')}</h3>
                                    <p className="text-[#000] leading-relaxed font-inter">{property.description}</p>
                                </div>
                            )}

                            {/* Property Features */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-[#000] font-inter mb-6">{__('Property Features')}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                    <div className="text-center p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                        <Icons.Home className="w-8 h-8 text-[#065033] mx-auto mb-2" />
                                        <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Type')}</p>
                                        <p className="font-semibold text-[#000] font-inter">{property.type_propriete}</p>
                                    </div>
                                    <div className="text-center p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                        <Icons.Maximize2 className="w-8 h-8 text-[#065033] mx-auto mb-2" />
                                        <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Surface')}</p>
                                        <p className="font-semibold text-[#000] font-inter">{property.superficie_m2} m²</p>
                                    </div>
                                    <div className="text-center p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                        <Icons.Euro className="w-8 h-8 text-[#065033] mx-auto mb-2" />
                                        <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Price/m²')}</p>
                                        <p className="font-semibold text-[#000] font-inter">{formatPrice(property.prix / property.superficie_m2)}</p>
                                    </div>
                                    <div className="text-center p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                        <Icons.User className="w-8 h-8 text-[#065033] mx-auto mb-2" />
                                        <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Contacts')}</p>
                                        <p className="font-semibold text-[#000] font-inter">{property.contacts_restants}/{property.contacts_souhaites}</p>
                                    </div>
                                </div>

                                {/* Additional Property Details */}
                                {(property.nombre_pieces || property.nombre_chambres || property.nombre_salles_bain || property.etage) && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        {property.nombre_pieces && (
                                            <div className="text-center p-3 bg-white border border-[#EAEAEA] rounded-lg">
                                                <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Rooms')}</p>
                                                <p className="font-semibold text-[#000] font-inter">{property.nombre_pieces}</p>
                                            </div>
                                        )}
                                        {property.nombre_chambres && (
                                            <div className="text-center p-3 bg-white border border-[#EAEAEA] rounded-lg">
                                                <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Bedrooms')}</p>
                                                <p className="font-semibold text-[#000] font-inter">{property.nombre_chambres}</p>
                                            </div>
                                        )}
                                        {property.nombre_salles_bain && (
                                            <div className="text-center p-3 bg-white border border-[#EAEAEA] rounded-lg">
                                                <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Bathrooms')}</p>
                                                <p className="font-semibold text-[#000] font-inter">{property.nombre_salles_bain}</p>
                                            </div>
                                        )}
                                        {property.etage !== null && property.etage !== undefined && (
                                            <div className="text-center p-3 bg-white border border-[#EAEAEA] rounded-lg">
                                                <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Floor')}</p>
                                                <p className="font-semibold text-[#000] font-inter">
                                                    {property.etage === 0 ? __('Ground floor') : property.etage}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Monthly charges */}
                                {property.charges_mensuelles && (
                                    <div className="p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                        <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Monthly charges')}</p>
                                        <p className="font-semibold text-[#000] font-inter">{formatPrice(property.charges_mensuelles)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Building Information */}
                            {(property.annee_construction || property.etat_propriete || property.type_chauffage || property.dpe_classe_energie || property.dpe_classe_ges) && (
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-6">{__('Building Information')}</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Basic Building Info */}
                                        <div className="space-y-4">
                                            {property.annee_construction && (
                                                <div className="p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                                    <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Year of construction')}</p>
                                                    <p className="font-semibold text-[#000] font-inter">{property.annee_construction}</p>
                                                </div>
                                            )}
                                            {property.etat_propriete && (
                                                <div className="p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                                    <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Property condition')}</p>
                                                    <p className="font-semibold text-[#000] font-inter">{formatHumanText(property.etat_propriete)}</p>
                                                </div>
                                            )}
                                            {property.type_chauffage && (
                                                <div className="p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                                    <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Heating type')}</p>
                                                    <p className="font-semibold text-[#000] font-inter">{formatHumanText(property.type_chauffage)}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Energy Performance */}
                                        <div className="space-y-4">
                                            {property.dpe_classe_energie && (
                                                <div className="p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                                    <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Energy class (DPE)')}</p>
                                                    <p className="font-semibold text-[#000] font-inter">{formatHumanText(property.dpe_classe_energie)}</p>
                                                </div>
                                            )}
                                            {property.dpe_classe_ges && (
                                                <div className="p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                                    <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('GHG emissions class')}</p>
                                                    <p className="font-semibold text-[#000] font-inter">{formatHumanText(property.dpe_classe_ges)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Amenities */}
                            {property.amenities && property.amenities.length > 0 && (
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-6">{__('Amenities')}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {property.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center p-3 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                                <Icons.CheckCircle className="w-5 h-5 text-[#065033] mr-3" />
                                                <span className="text-[#000] font-inter text-sm">{__(amenity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Information */}
                            {property.informations_complementaires && (
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">{__('Additional Information')}</h3>
                                    <p className="text-[#000] leading-relaxed font-inter">{property.informations_complementaires}</p>
                                </div>
                            )}
                        </div>

                        {/* Sticky Sidebar */}
                        <div className="sticky top-24 space-y-6 h-fit">
                            {/* Price Card */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-[#000] font-inter mb-2">
                                        {formatPrice(property.prix)}
                                    </h1>
                                    <div className="flex items-center text-[#6C6C6C] mb-4">
                                        <Icons.MapPin className="w-5 h-5 mr-2" />
                                        <span className="font-inter">{property.ville}, {property.pays}</span>
                                    </div>
                                    <p className="text-[#000] font-medium font-inter">
                                        {property.adresse_complete}
                                    </p>
                                </div>

                                {/* Contact Purchase */}
                                <div className="space-y-4">
                                    {property.is_purchased ? (
                                        <div className="space-y-4">
                                            <div className="bg-[#F0F9F4] border border-[#D1F2D9] p-4 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <Icons.CheckCircle className="w-5 h-5 text-[#065033] mr-2" />
                                                    <p className="font-medium text-[#065033] font-inter">
                                                        {__('Contact Purchased')}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-[#065033] font-inter">
                                                    {__('You have access to complete owner information')}
                                                </p>
                                            </div>
                                            
                                            <Link
                                                href={route('agent.purchases')}
                                                className="w-full bg-[#065033] hover:bg-[#054028] text-white py-3 px-4 rounded-lg font-medium font-inter transition-colors text-center block"
                                            >
                                                {__('View Contact Information')}
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-[#F5F9FA] border border-[#EAEAEA] p-4 rounded-lg">
                                                <h4 className="font-semibold text-[#000] font-inter mb-3">
                                                    {__('Purchase contact for')} {formatPrice(contactPrice)}
                                                </h4>
                                                <ul className="text-sm text-[#000] space-y-2 font-inter">
                                                    <li className="flex items-center">
                                                        <Icons.User className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                        {__('Owner name and surname')}
                                                    </li>
                                                    <li className="flex items-center">
                                                        <Icons.Phone className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                        {__('Phone number')}
                                                    </li>
                                                    <li className="flex items-center">
                                                        <Icons.Mail className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                        {__('Email address')}
                                                    </li>
                                                    <li className="flex items-center">
                                                        <Icons.CheckCircle className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                        {__('Immediate and permanent access')}
                                                    </li>
                                                </ul>
                                            </div>

                                            <button
                                                onClick={handlePurchaseContact}
                                                className="w-full bg-[#065033] hover:bg-[#054028] text-white py-4 px-6 rounded-lg font-semibold text-lg font-inter transition-all duration-200 hover:shadow-lg"
                                            >
                                                {__('Purchase Contact')}
                                            </button>

                                            <div className="flex items-center justify-center text-xs text-[#6C6C6C] font-inter">
                                                <Icons.Shield className="w-4 h-4 mr-1" />
                                                {__('Secure payment • Immediate access')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Owner Info */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                                    {__('Property Owner')}
                                </h3>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#065033] to-[#054028] rounded-full flex items-center justify-center">
                                        <Icons.User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#000] font-inter">
                                            {property.is_purchased 
                                                ? `${property.proprietaire.prenom} ${property.proprietaire.nom}`
                                                : __('Verified Owner')
                                            }
                                        </p>
                                        <p className="text-sm text-[#6C6C6C] font-inter">
                                            {property.is_purchased 
                                                ? __('Complete information available')
                                                : __('Purchase contact for more details')
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Property Information */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-[#000] font-inter mb-6">
                                    {__('Property Information')}
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-[#065033] rounded-full flex items-center justify-center mr-4">
                                                <Icons.Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-[#000] font-inter">{__('Published on')}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-[#000] font-inter">
                                            {new Date(property.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-[#065033] rounded-full flex items-center justify-center mr-4">
                                                <span className="text-white font-bold text-xs font-inter">#</span>
                                            </div>
                                            <span className="text-sm font-medium text-[#000] font-inter">{__('Reference')}</span>
                                        </div>
                                        <span className="text-sm font-mono font-semibold text-[#000] font-inter">
                                            #{property.id.toString().padStart(6, '0')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-[#065033] rounded-full flex items-center justify-center mr-4">
                                                <Icons.CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-[#000] font-inter">{__('Status')}</span>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F0F9F4] text-[#065033] border border-[#D1F2D9] font-inter">
                                            <div className="w-2 h-2 bg-[#065033] rounded-full mr-2"></div>
                                            {__('Published')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <Modal show={showImageModal} onClose={closeImageModal} maxWidth="full" closeable={true}>
                <div className="relative bg-black w-screen h-screen overflow-hidden">
                    {property.images && property.images.length > 0 && (
                        <>
                            {/* Modal Header */}
                            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-6">
                                <div className="flex items-center justify-between text-white">
                                    <h3 className="text-lg font-semibold font-inter">
                                        {__('Gallery')} - {currentImageIndex + 1} / {property.images.length}
                                    </h3>
                                    <button
                                        onClick={closeImageModal}
                                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                                    >
                                        <Icons.X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Main Image */}
                            <div className="relative h-screen flex items-center justify-center">
                                <img
                                    src={`/storage/${property.images[currentImageIndex].chemin_fichier}`}
                                    alt={`${property.adresse_complete} - Image ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        if (!e.target.dataset.fallbackAttempted) {
                                            e.target.dataset.fallbackAttempted = 'true';
                                            e.target.src = `/images/${property.images[currentImageIndex].chemin_fichier}`;
                                        } else {
                                            const placeholder = document.createElement('div');
                                            placeholder.className = 'max-w-full max-h-full flex items-center justify-center text-white';
                                            placeholder.innerHTML = '<div class="text-center"><svg class="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg><p class="font-medium">Image not available</p></div>';
                                            e.target.parentNode.replaceChild(placeholder, e.target);
                                        }
                                    }}
                                />

                                {/* Navigation Arrows */}
                                {property.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
                                        >
                                            <Icons.ArrowLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
                                        >
                                            <Icons.ArrowRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {property.images.length > 1 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                                    <div className="flex space-x-3 overflow-x-auto pb-2">
                                        {property.images.map((image, index) => (
                                            <button
                                                key={image.id}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                                                    index === currentImageIndex 
                                                        ? 'ring-2 ring-white scale-110' 
                                                        : 'opacity-70 hover:opacity-100'
                                                }`}
                                            >
                                                <img
                                                    src={`/storage/${image.chemin_fichier}`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        if (!e.target.dataset.fallbackAttempted) {
                                                            e.target.dataset.fallbackAttempted = 'true';
                                                            e.target.src = `/images/${image.chemin_fichier}`;
                                                        } else {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik00MC41IDU2SDE5LjVDMTguNjc5IDU2IDE4IDU1LjMyMSAxOCA1NC41VjI1LjVDMTggMjQuNjc5IDE4LjY3OSAyNCAxOS41IDI0SDQwLjVDNDEuMzIxIDI0IDQyIDI0LjY3OSA0MiAyNS41VjU0LjVDNDIgNTUuMzIxIDQxLjMyMSA1NiA0MC41IDU2Wk0yMCAyNlY1NEg0MFYyNkgyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwIDM0QzMxLjEwNDYgMzQgMzIgMzMuMTA0NiAzMiAzMkMzMiAzMC44OTU0IDMxLjEwNDYgMzAgMzAgMzBDMjguODk1NCAzMCAyOCAzMC44OTU0IDI4IDMyQzI4IDMzLjEwNDYgMjguODk1NCAzNCAzMCAzNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTQwIDQ5SDIwTDI3IDQyTDMwIDQ1TDM3IDM4TDQwIDQxVjQ5WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                                        }
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
