import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/Utils/translations';
import PublicLayout from '@/Layouts/PublicLayout';
import Modal from '@/Components/Modal';
import ConfirmationModal from '@/Components/ConfirmationModal';

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

export default function PublicDetail({ property, propertyTypes, similarProperties, locale = 'fr', auth = null }) {
    const { __ } = useTranslations();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showContactForm, setShowContactForm] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    
    // Admin moderation states
    const [processing, setProcessing] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    
    const isAdmin = auth && auth.user && auth.user.type_utilisateur === 'ADMIN';

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
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleContactClick = () => {
        // Check if user is authenticated and is an agent
        if (auth && auth.user) {
            const user = auth.user;
            
            if (user.type_utilisateur === 'AGENT') {
                // User is logged in as agent, redirect to payment page
                window.location.href = `/payment/properties/${property.id}`;
                return;
            } else {
                // User is logged in but not as an agent, show modal explaining they need agent account
                setShowContactForm(true);
                return;
            }
        }
        
        // User is not logged in, show modal for login/signup options
        setShowContactForm(true);
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

    const handleBackNavigation = () => {
        // Check if there's a referrer from the same domain
        const referrer = document.referrer;
        const currentDomain = window.location.origin;
        
        if (referrer && referrer.startsWith(currentDomain)) {
            // If user came from our site, try to go back
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Fallback to properties search
                window.location.href = '/properties/search';
            }
        } else {
            // If opened directly or from external site, go to properties search
            window.location.href = '/properties/search';
        }
    };

    // Admin moderation functions
    const handleApprove = () => {
        if (processing) return;
        setShowApproveModal(true);
    };

    const confirmApprove = () => {
        setProcessing(true);
        router.post(route('admin.approve-property', property.id), {}, {
            onSuccess: () => {
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Error approving property:', errors);
                alert('Error approving property. Please try again.');
            },
            onFinish: () => setProcessing(false)
        });
    };

    const handleReject = () => {
        if (processing || !rejectReason.trim()) return;
        
        setProcessing(true);
        router.post(route('admin.reject-property', property.id), {
            raison_rejet: rejectReason
        }, {
            onSuccess: () => {
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Error rejecting property:', errors);
                alert('Error rejecting property. Please try again.');
            },
            onFinish: () => setProcessing(false)
        });
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

    const renderContactModal = () => {
        const isLoggedIn = auth && auth.user;
        const isAgent = isLoggedIn && auth.user.type_utilisateur === 'AGENT';
        const currentUrl = window.location.href;

        if (isLoggedIn && !isAgent) {
            // User is logged in but not as an agent
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icons.User className="w-8 h-8 text-[#D97706]" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#000] font-inter mb-2">{__('Agent Account Required')}</h3>
                            <p className="text-[#000] font-inter">
                                {__('You need an agent account to purchase property contact information. Your current account type does not have access to this feature.')}
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-[#EBF4FF] border border-[#EAEAEA] p-4 rounded-lg">
                                <h4 className="font-semibold text-[#000] font-inter mb-3 flex items-center">
                                    <Icons.CheckCircle className="w-5 h-5 text-[#0F44FC] mr-2" />
                                    {__('Benefits of an agent account:')}
                                </h4>
                                <ul className="text-sm text-[#000] space-y-2 font-inter">
                                    <li className="flex items-start">
                                        <Icons.Phone className="w-4 h-4 mr-2 text-[#6C6C6C] mt-0.5 flex-shrink-0" />
                                        {__('Access to property owner contacts')}
                                    </li>
                                    <li className="flex items-start">
                                        <Icons.Mail className="w-4 h-4 mr-2 text-[#6C6C6C] mt-0.5 flex-shrink-0" />
                                        {__('Direct communication with owners')}
                                    </li>
                                    <li className="flex items-start">
                                        <Icons.Shield className="w-4 h-4 mr-2 text-[#6C6C6C] mt-0.5 flex-shrink-0" />
                                        {__('Professional real estate tools')}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => {
                                    window.location.href = `/register?redirect=${encodeURIComponent(currentUrl)}&type=agent`;
                                }}
                                className="w-full bg-[#0F44FC] hover:bg-[#0A37D1] text-white py-3 px-4 rounded-lg font-semibold font-inter transition-colors"
                            >
                                {__('Create Agent Account')}
                            </button>
                            <button
                                onClick={() => setShowContactForm(false)}
                                className="w-full text-[#6C6C6C] hover:text-[#000] py-2 px-4 font-medium font-inter transition-colors"
                            >
                                {__('Maybe Later')}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // User is not logged in
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#0F44FC] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icons.User className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#000] font-inter mb-2">{__('Buy Property Contact')}</h3>
                        <p className="text-[#000] font-inter">
                            {__('Sign in as an agent or create an agent account to purchase property owner contact information.')}
                        </p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="bg-[#EBF4FF] border border-[#EAEAEA] p-4 rounded-lg">
                            <h4 className="font-semibold text-[#000] font-inter mb-3 flex items-center">
                                <Icons.CheckCircle className="w-5 h-5 text-[#0F44FC] mr-2" />
                                {__('What you get as an agent:')}
                            </h4>
                            <ul className="text-sm text-[#000] space-y-2 font-inter">
                                <li className="flex items-start">
                                    <Icons.Phone className="w-4 h-4 mr-2 text-[#6C6C6C] mt-0.5 flex-shrink-0" />
                                    {__('Property owner phone number')}
                                </li>
                                <li className="flex items-start">
                                    <Icons.Mail className="w-4 h-4 mr-2 text-[#6C6C6C] mt-0.5 flex-shrink-0" />
                                    {__('Direct email contact')}
                                </li>
                                <li className="flex items-start">
                                    <Icons.User className="w-4 h-4 mr-2 text-[#6C6C6C] mt-0.5 flex-shrink-0" />
                                    {__('Owner name and details')}
                                </li>
                                <li className="flex items-start">
                                    <Icons.Shield className="w-4 h-4 mr-2 text-[#6C6C6C] mt-0.5 flex-shrink-0" />
                                    {__('Secure payment and instant access')}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => {
                                window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}&type=agent`;
                            }}
                            className="w-full bg-[#0F44FC] hover:bg-[#0A37D1] text-white py-3 px-4 rounded-lg font-semibold font-inter transition-colors"
                        >
                            {__('Sign In as Agent')}
                        </button>
                        <button
                            onClick={() => {
                                window.location.href = `/register?redirect=${encodeURIComponent(currentUrl)}&type=agent`;
                            }}
                            className="w-full bg-white hover:bg-[#F5F9FA] text-[#0F44FC] py-3 px-4 rounded-lg font-semibold font-inter transition-colors border-2 border-[#0F44FC]"
                        >
                            {__('Become an Agent')}
                        </button>
                        <button
                            onClick={() => setShowContactForm(false)}
                            className="w-full text-[#6C6C6C] hover:text-[#000] py-2 px-4 font-medium font-inter transition-colors"
                        >
                            {__('Maybe Later')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <PublicLayout>
            <Head title={property.type_propriete + " - " + property.ville + " - Propio"} />
            
            <div className="min-h-screen bg-[#EBF4FF]">
                {/* Main Content */}
                <div className={`py-8 ${isAdmin ? 'pt-16' : ''}`}>
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
                                                <div className="p-6 bg-[#EBF4FF]">
                                                    <div className="grid grid-cols-6 gap-4">
                                                        {property.images.slice(0, 6).map((image, index) => (
                                                            <button
                                                                key={image.id}
                                                                onClick={() => setCurrentImageIndex(index)}
                                                                className={`relative h-20 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 border-2 ${
                                                                    index === currentImageIndex 
                                                                        ? 'border-[#0F44FC] ring-2 ring-[#0F44FC] ring-opacity-20 scale-105' 
                                                                        : 'border-[#EAEAEA] hover:border-[#0F44FC]'
                                                                }`}
                                                            >
                                                                <img
                                                                    src={`/storage/${image.chemin_fichier}`}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </button>
                                                        ))}
                                                        {property.images.length > 6 && (
                                                            <button
                                                                onClick={() => openImageModal()}
                                                                className="h-20 bg-[#EAEAEA] rounded-lg flex items-center justify-center hover:bg-[#0F44FC] hover:text-white transition-all duration-300 border-2 border-[#EAEAEA] hover:border-[#0F44FC]"
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
                                        <div className="h-96 lg:h-[500px] bg-[#EBF4FF] flex items-center justify-center">
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
                                    <div className="text-center p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
                                        <Icons.Home className="w-8 h-8 text-[#0F44FC] mx-auto mb-2" />
                                        <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Type')}</p>
                                        <p className="font-semibold text-[#000] font-inter">{propertyTypes[property.type_propriete]}</p>
                                    </div>
                                    <div className="text-center p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
                                        <Icons.Maximize2 className="w-8 h-8 text-[#0F44FC] mx-auto mb-2" />
                                        <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Surface')}</p>
                                        <p className="font-semibold text-[#000] font-inter">{property.superficie_m2} m²</p>
                                    </div>
                                    <div className="text-center p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
                                        <Icons.Euro className="w-8 h-8 text-[#0F44FC] mx-auto mb-2" />
                                        <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Price/m²')}</p>
                                        <p className="font-semibold text-[#000] font-inter">{formatPrice(property.prix / property.superficie_m2)}</p>
                                    </div>
                                    <div className="text-center p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
                                        <Icons.User className="w-8 h-8 text-[#0F44FC] mx-auto mb-2" />
                                        <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Contacts')}</p>
                                        <p className="font-semibold text-[#000] font-inter">{property.contacts_restants}/{property.contacts_souhaites}</p>
                                    </div>
                                </div>

                                {/* Room Details */}
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
                                    <div className="p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
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
                                                <div className="p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
                                                    <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Year of construction')}</p>
                                                    <p className="font-semibold text-[#000] font-inter">{property.annee_construction}</p>
                                                </div>
                                            )}
                                            {property.etat_propriete && (
                                                <div className="p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
                                                    <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Property condition')}</p>
                                                    <p className="font-semibold text-[#000] font-inter">{formatHumanText(property.etat_propriete)}</p>
                                                </div>
                                            )}
                                            {property.type_chauffage && (
                                                <div className="p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
                                                    <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Heating type')}</p>
                                                    <p className="font-semibold text-[#000] font-inter">{formatHumanText(property.type_chauffage)}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Energy Performance */}
                                        <div className="space-y-4">
                                            {property.dpe_classe_energie && (
                                                <div className="p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
                                                    <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Energy class (DPE)')}</p>
                                                    <p className="font-semibold text-[#000] font-inter">{formatHumanText(property.dpe_classe_energie)}</p>
                                                </div>
                                            )}
                                            {property.dpe_classe_ges && (
                                                <div className="p-4 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {property.amenities.map((amenity, index) => {
                                            // Amenity icon mapping - matching PropertyDetails.jsx exactly
                                            const amenityIcons = {
                                                // Exterior and Parking
                                                'parking': 'Car',
                                                'garage': 'Home',
                                                'jardin': 'TreePine', // Trees alternative
                                                'terrasse': 'Mountain',
                                                'balcon': 'Building2',
                                                'piscine': 'Waves',
                                                'cave': 'Archive',
                                                'grenier': 'Package',
                                                
                                                // Security and Comfort
                                                'ascenseur': 'ArrowUpDown',
                                                'elevator': 'ArrowUpDown',
                                                'digicode': 'Key', // KeyRound alternative
                                                'interphone': 'Phone',
                                                'gardien': 'User',
                                                'alarme': 'Shield',
                                                'climatisation': 'Snowflake',
                                                'cheminee': 'Flame',
                                                
                                                // Equipment
                                                'cuisine_equipee': 'ChefHat',
                                                'cuisine_amenagee': 'Utensils', // UtensilsCrossed alternative
                                                'dressing': 'Shirt',
                                                'placards': 'Package',
                                                'double_vitrage': 'Square',
                                                'volets_electriques': 'Blinds',
                                                
                                                // Accessibility and Services
                                                'acces_handicape': 'Accessibility',
                                                'fibre_optique': 'Wifi',
                                                'proche_transports': 'Train',
                                                'proche_commerces': 'ShoppingCart',
                                                'proche_ecoles': 'GraduationCap'
                                            };
                                            
                                            // Amenity text capitalization
                                            const capitalizeAmenityText = (text) => {
                                                if (!text) return '';
                                                
                                                const specialCases = {
                                                    'parking': 'Parking',
                                                    'balcon': 'Balcony', 
                                                    'elevator': 'Elevator',
                                                    'alarme': 'Alarm System',
                                                    'cuisine_equipee': 'Equipped Kitchen',
                                                    'double_vitrage': 'Double Glazing',
                                                    'acces_handicape': 'Disabled Access',
                                                    'fibre_optique': 'Fiber Optic',
                                                    'proche_transports': 'Near Public Transport',
                                                    'proche_commerces': 'Near Shops',
                                                    'proche_ecoles': 'Near Schools',
                                                    'garage': 'Garage',
                                                    'jardin': 'Garden',
                                                    'terrasse': 'Terrace',
                                                    'piscine': 'Swimming Pool',
                                                    'cave': 'Cellar',
                                                    'grenier': 'Attic/Loft',
                                                    'ascenseur': 'Elevator',
                                                    'digicode': 'Digital Code',
                                                    'interphone': 'Intercom',
                                                    'gardien': 'Doorman/Concierge',
                                                    'climatisation': 'Air Conditioning',
                                                    'cheminee': 'Fireplace',
                                                    'cuisine_amenagee': 'Fitted Kitchen',
                                                    'dressing': 'Dressing Room',
                                                    'placards': 'Built-in Wardrobes',
                                                    'volets_electriques': 'Electric Shutters'
                                                };
                                                
                                                if (specialCases[text]) {
                                                    return specialCases[text];
                                                }
                                                
                                                return text
                                                    .toLowerCase()
                                                    .replace(/_/g, ' ')
                                                    .replace(/\b\w/g, l => l.toUpperCase());
                                            };
                                            
                                            // Get capitalized text
                                            const displayText = capitalizeAmenityText(amenity);
                                            
                                            return (
                                                <div key={index} className="flex items-center p-3 bg-[#EBF4FF] border border-[#EAEAEA] rounded-lg min-h-[48px]">
                                                    <div className="flex-shrink-0 w-5 h-5 mr-3">
                                                        <Icons.CheckCircle 
                                                            className="w-full h-full text-[#0F44FC]" 
                                                            strokeWidth={1.5}
                                                        />
                                                    </div>
                                                    <span className="text-[#000] font-inter text-sm font-medium leading-tight">
                                                        {__(displayText)}
                                                    </span>
                                                </div>
                                            );
                                        })}
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
                        <div className="sticky top-8 space-y-6 h-fit">
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
                                    <p className="text-[#6C6C6C] font-inter text-sm">
                                        {__('Full address available after purchase')}
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <div className="bg-[#EBF4FF] border border-[#EAEAEA] p-4 rounded-lg">
                                        <h4 className="font-semibold text-[#000] font-inter mb-3">
                                            {__('Purchase Contact Information')}
                                        </h4>
                                        <ul className="text-sm text-[#000] space-y-2 font-inter">
                                            <li className="flex items-center">
                                                <Icons.User className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                {__('Owner contact details')}
                                            </li>
                                            <li className="flex items-center">
                                                <Icons.Phone className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                {__('Direct phone number')}
                                            </li>
                                            <li className="flex items-center">
                                                <Icons.Mail className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                {__('Email address')}
                                            </li>
                                            <li className="flex items-center">
                                                <Icons.CheckCircle className="w-4 h-4 mr-2 text-[#6C6C6C]" />
                                                {__('Instant access after payment')}
                                            </li>
                                        </ul>
                                    </div>

                                    <button
                                        onClick={handleContactClick}
                                        className="w-full bg-[#0F44FC] hover:bg-[#0A37D1] text-white py-4 px-6 rounded-lg font-semibold text-lg font-inter transition-all duration-200 hover:shadow-lg"
                                    >
                                        {__('Buy Contact')}
                                    </button>

                                    <div className="flex items-center justify-center text-xs text-[#6C6C6C] font-inter">
                                        <Icons.Shield className="w-4 h-4 mr-1" />
                                        {__('Secure platform • Verified listings')}
                                    </div>
                                </div>
                            </div>
                            {/* Owner Info */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                                    {__('Property Owner')}
                                </h3>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#0F44FC] to-[#0A37D1] rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl font-bold font-inter">
                                            {property.proprietaire?.prenom?.[0]}{property.proprietaire?.nom?.[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#000] font-inter">
                                            {property.proprietaire?.prenom} {property.proprietaire?.nom}
                                        </p>
                                        <p className="text-sm text-[#6C6C6C] font-inter">
                                            {__('Verified Property Owner')}
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
                                    <div className="flex items-center justify-between py-3 px-4 bg-[#EBF4FF] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-[#0F44FC] rounded-full flex items-center justify-center mr-4">
                                                <Icons.Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-[#000] font-inter">{__('Published on')}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-[#000] font-inter">
                                            {new Date(property.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between py-3 px-4 bg-[#EBF4FF] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-[#0F44FC] rounded-full flex items-center justify-center mr-4">
                                                <span className="text-white font-bold text-xs font-inter">#</span>
                                            </div>
                                            <span className="text-sm font-medium text-[#000] font-inter">{__('Reference')}</span>
                                        </div>
                                        <span className="text-sm font-mono font-semibold text-[#000] font-inter">
                                            #{property.id.toString().substring(0, 8)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between py-3 px-4 bg-[#EBF4FF] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-[#0F44FC] rounded-full flex items-center justify-center mr-4">
                                                <Icons.CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-[#000] font-inter">{__('Status')}</span>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F0F9F4] text-[#0F44FC] border border-[#D1F2D9] font-inter">
                                            <div className="w-2 h-2 bg-[#0F44FC] rounded-full mr-2"></div>
                                            {__('Available')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Properties */}
                    {similarProperties && similarProperties.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-[#000] font-inter mb-6">{__('Similar Properties')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {similarProperties.map((similarProperty) => (
                                    <a
                                        key={similarProperty.id}
                                        href={"/property/" + similarProperty.id}
                                        className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden hover:shadow-lg hover:border-[#0F44FC] transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <div className="h-48 overflow-hidden">
                                            {similarProperty.images && similarProperty.images.length > 0 ? (
                                                <img
                                                    src={"/storage/" + similarProperty.images[0].chemin_fichier}
                                                    alt="Similar property"
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <Icons.Home className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="text-lg font-bold text-[#0F44FC] mb-1 font-inter">
                                                {formatPrice(similarProperty.prix)}
                                            </div>
                                            <div className="text-[#6C6C6C] text-sm mb-2 font-inter">
                                                {similarProperty.ville}, {similarProperty.pays}
                                            </div>
                                            <div className="text-xs text-[#6C6C6C] font-inter">
                                                {similarProperty.nombre_pieces} {__('rooms')} • {similarProperty.superficie_m2} m²
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Admin Moderation Panel */}
            {isAdmin && property.statut === 'EN_ATTENTE' && (
                <div className="fixed bottom-6 right-6 bg-white border-2 border-[#065033] rounded-lg shadow-xl p-6 z-50">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-[#000] font-inter">
                                {__('Admin Review Required')}
                            </span>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleApprove}
                                disabled={processing}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold font-inter transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                                <Icons.CheckCircle className="w-4 h-4" />
                                <span>{processing ? __('Processing...') : __('Approve')}</span>
                            </button>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                disabled={processing}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold font-inter transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>{__('Reject')}</span>
                            </button>
                            <Link
                                href={route('admin.property-review', property.id)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold font-inter transition-colors flex items-center space-x-2"
                            >
                                <Icons.Eye className="w-4 h-4" />
                                <span>{__('Full Review')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Status Banner */}
            {isAdmin && (
                <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 z-40">
                    <div className="max-w-[1336px] mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Icons.Shield className="w-5 h-5" />
                            <span className="font-medium font-inter">
                                {__('Admin View')} - {__('Property Status')}: 
                                <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                                    property.statut === 'EN_ATTENTE' ? 'bg-yellow-500' :
                                    property.statut === 'PUBLIE' ? 'bg-green-500' :
                                    property.statut === 'REJETE' ? 'bg-red-500' : 'bg-gray-500'
                                }`}>
                                    {property.statut === 'EN_ATTENTE' ? __('Pending Review') :
                                     property.statut === 'PUBLIE' ? __('Published') :
                                     property.statut === 'REJETE' ? __('Rejected') : property.statut}
                                </span>
                            </span>
                        </div>
                        <div className="text-sm font-inter">
                            {__('Property ID')}: {property.id}
                        </div>
                    </div>
                </div>
            )}

            {/* Agent Login/Signup Modal */}
            {showContactForm && renderContactModal()}

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
            </div>

            {/* Admin Approval Modal */}
            <ConfirmationModal
                show={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={confirmApprove}
                title={__('Approve this property')}
                message={
                    <div className="space-y-3">
                        <p className="font-inter">
                            {__('Are you sure you want to approve this property?')}
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h4 className="text-sm font-semibold text-green-800 font-inter">
                                        {__('This will:')}
                                    </h4>
                                    <ul className="mt-2 text-sm text-green-700 space-y-1 font-inter">
                                        <li>• {__('Make the property visible to the public')}</li>
                                        <li>• {__('Send approval email to owner')}</li>
                                        <li>• {__('Allow agents to purchase contacts')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                confirmText={__('Yes, approve')}
                cancelText={__('Cancel')}
                variant="success"
                processing={processing}
            />

            {/* Admin Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setShowRejectModal(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-[#000] font-inter">
                                            {__('Reject this property')}
                                        </h3>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                                                {__('Rejection reason')} *
                                            </label>
                                            <textarea
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                rows={4}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 font-inter"
                                                placeholder={__('Explain why this property is rejected...')}
                                            />
                                            <p className="mt-2 text-sm text-[#6C6C6C] font-inter">
                                                {__('This reason will be sent to the owner by email.')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleReject}
                                    disabled={processing || !rejectReason.trim()}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed font-inter"
                                >
                                    {processing ? __('Processing...') : __('Reject')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectReason('');
                                    }}
                                    disabled={processing}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm font-inter"
                                >
                                    {__('Cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}