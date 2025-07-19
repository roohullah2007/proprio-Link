import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { useTranslations } from '@/Utils/translations';

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

export default function PropertyReview({ auth, property, editRequests = [], flash }) {
    const { __ } = useTranslations();
    const [processing, setProcessing] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showEditRequestModal, setShowEditRequestModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [editRequestData, setEditRequestData] = useState({
        requested_changes: '',
        admin_notes: ''
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const translatePropertyType = (type) => {
        const propertyTypes = {
            'APPARTEMENT': __('Apartment'),
            'MAISON': __('House'),
            'TERRAIN': __('Land'),
            'COMMERCIAL': __('Commercial Space'),
            'BUREAU': __('Office'),
            'AUTRES': __('Other'),
        };
        return propertyTypes[type] || type;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    const handleApprove = () => {
        if (processing) return;
        setShowApproveModal(true);
    };

    const confirmApprove = () => {
        setProcessing(true);
        router.post(route('admin.approve-property', property.id), {}, {
            onSuccess: (page) => {
                console.log('Property approved successfully');
                setShowApproveModal(false);
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
            onSuccess: (page) => {
                console.log('Property rejected successfully');
                setShowRejectModal(false);
                setRejectReason('');
            },
            onError: (errors) => {
                console.error('Error rejecting property:', errors);
                alert('Error rejecting property. Please try again.');
            },
            onFinish: () => setProcessing(false)
        });
    };

    const handleEditRequest = () => {
        if (processing || !editRequestData.requested_changes.trim()) return;
        
        setProcessing(true);
        router.post(route('admin.property-edit-requests.store', property.id), editRequestData, {
            onSuccess: (page) => {
                console.log('Edit request sent successfully');
                setShowEditRequestModal(false);
                setEditRequestData({ requested_changes: '', admin_notes: '' });
                router.reload();
            },
            onError: (errors) => {
                console.error('Error sending edit request:', errors);
                alert('Error sending edit request. Please try again.');
            },
            onFinish: () => setProcessing(false)
        });
    };

    const translateStatus = (status) => {
        const translations = {
            'EN_ATTENTE': __('Pending'),
            'PUBLIE': __('Published'),
            'REJETE': __('Rejected'),
            'VENDU': __('Sold')
        };
        return translations[status] || status;
    };

    const translateEditRequestStatus = (status) => {
        const translations = {
            'PENDING': __('Pending'),
            'ACKNOWLEDGED': __('Acknowledged'),
            'COMPLETED': __('Completed'),
            'CANCELLED': __('Cancelled')
        };
        return translations[status] || status;
    };

    const getEditRequestStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ACKNOWLEDGED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            usePillNavigation={false}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    {/* Left side - Page title with breadcrumb */}
                    <div className="flex-none order-0 flex-grow-0">
                        <div className="flex items-center space-x-2">
                            <Link
                                href={route('admin.pending-properties')}
                                className="font-inter font-medium text-[14px] leading-[19px] text-[#065033] hover:text-[#054028] transition-colors"
                            >
                                {__('Pending Properties')}
                            </Link>
                            <span className="text-[#6C6C6C]">/</span>
                            <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                                {__('Property Review')}
                            </h1>
                        </div>
                    </div>
                    
                    {/* Right side - Status badge */}
                    <div className="flex items-center gap-[14px] h-[31px] flex-none order-1 flex-grow-0">
                        <div className={`flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] border rounded-full flex-none order-0 flex-grow-0 ${
                            property.statut === 'EN_ATTENTE' 
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                : property.statut === 'PUBLIE'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : property.statut === 'REJETE'
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-gray-50 border-gray-200 text-gray-800'
                        }`}>
                            <svg className="w-3 h-3 flex-none order-0 flex-grow-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-inter font-medium text-[13px] leading-[16px] flex items-center flex-none order-1 flex-grow-0 whitespace-nowrap">
                                {translateStatus(property.statut)}
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={__('Property Review') + " - Propio"} />

            <div className="min-h-screen bg-[#F5F9FA]">
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
                                                <div className="relative h-96 lg:h-[500px] group">
                                                    <img
                                                        src={`/storage/${property.images[currentImageIndex].chemin_fichier}`}
                                                        alt={property.adresse_complete}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                                    />
                                                    
                                                    {property.images.length > 1 && (
                                                        <>
                                                            <button
                                                                onClick={prevImage}
                                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-[#000] p-3 rounded-full border border-[#EAEAEA] transition-all duration-200 hover:scale-110"
                                                            >
                                                                <Icons.ArrowLeft className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={nextImage}
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
                                                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm font-medium font-inter">
                                                        <Icons.Maximize2 className="w-4 h-4 mr-2 inline" />
                                                        {property.images.length} {__('photos')}
                                                    </div>
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
                                                                    />
                                                                </button>
                                                            ))}
                                                            {property.images.length > 6 && (
                                                                <div className="h-20 bg-[#EAEAEA] rounded-lg flex items-center justify-center border-2 border-[#EAEAEA]">
                                                                    <span className="text-sm font-bold font-inter">
                                                                        +{property.images.length - 6}
                                                                    </span>
                                                                </div>
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
                                            <p className="font-semibold text-[#000] font-inter">{translatePropertyType(property.type_propriete)}</p>
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
                                    <div className="space-y-4">
                                        <div className="p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                            <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Complete address')}</p>
                                            <p className="font-semibold text-[#000] font-inter">{property.adresse_complete}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                                <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('City')}</p>
                                                <p className="font-semibold text-[#000] font-inter">{property.ville}</p>
                                            </div>
                                            <div className="p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg">
                                                <p className="text-sm text-[#6C6C6C] mb-1 font-inter">{__('Country')}</p>
                                                <p className="font-semibold text-[#000] font-inter">{property.pays}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                {property.informations_complementaires && (
                                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">{__('Additional Information')}</h3>
                                        <p className="text-[#000] leading-relaxed font-inter">{property.informations_complementaires}</p>
                                    </div>
                                )}

                                {/* Edit Requests History */}
                                {editRequests && editRequests.length > 0 && (
                                    <div className="bg-white border border-[#EAEAEA] rounded-lg">
                                        <div className="px-6 py-4 border-b border-[#EAEAEA]">
                                            <h3 className="text-lg font-semibold text-[#000] font-inter">
                                                {__('Edit Requests History')} ({editRequests.length})
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                {editRequests.map((request) => (
                                                    <div key={request.id} className="border border-[#EAEAEA] rounded-lg p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center space-x-3">
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEditRequestStatusColor(request.status)}`}>
                                                                    {translateEditRequestStatus(request.status)}
                                                                </span>
                                                                <span className="text-sm text-[#6C6C6C] font-inter">
                                                                    {__('Requested by:')} {request.requested_by?.prenom} {request.requested_by?.nom}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-[#6C6C6C] font-inter">
                                                                {formatDate(request.created_at)}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <p className="text-sm font-medium text-[#000] font-inter mb-1">
                                                                    {__('Requested Changes:')}
                                                                </p>
                                                                <p className="text-sm text-[#6C6C6C] font-inter bg-[#F5F9FA] p-3 rounded">
                                                                    {request.requested_changes}
                                                                </p>
                                                            </div>
                                                            {request.admin_notes && (
                                                                <div>
                                                                    <p className="text-sm font-medium text-[#000] font-inter mb-1">
                                                                        {__('Admin Notes:')}
                                                                    </p>
                                                                    <p className="text-sm text-[#6C6C6C] font-inter bg-[#F5F9FA] p-3 rounded">
                                                                        {request.admin_notes}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sticky Sidebar */}
                            <div className="sticky top-8 space-y-6 h-fit">
                                {/* Property Summary Card */}
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <div className="mb-6">
                                        <h1 className="text-2xl font-bold text-[#000] font-inter mb-2">
                                            {formatPrice(property.prix)}
                                        </h1>
                                        <div className="flex items-center text-[#6C6C6C] mb-4">
                                            <Icons.MapPin className="w-5 h-5 mr-2" />
                                            <span className="font-inter">{property.ville}, {property.pays}</span>
                                        </div>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                                            property.statut === 'EN_ATTENTE' 
                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                : property.statut === 'PUBLIE'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : property.statut === 'REJETE'
                                                ? 'bg-red-100 text-red-800 border-red-200'
                                                : 'bg-gray-100 text-gray-800 border-gray-200'
                                        } font-inter`}>
                                            <div className="w-2 h-2 rounded-full mr-2" style={{
                                                backgroundColor: property.statut === 'EN_ATTENTE' ? '#D97706' :
                                                               property.statut === 'PUBLIE' ? '#065033' :
                                                               property.statut === 'REJETE' ? '#DC2626' : '#6C6C6C'
                                            }}></div>
                                            {translateStatus(property.statut)}
                                        </div>
                                    </div>
                                </div>

                                {/* Owner Information */}
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                                        {__('Property Owner')}
                                    </h3>
                                    
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#065033] to-[#054028] rounded-full flex items-center justify-center">
                                            <span className="text-white text-xl font-bold font-inter">
                                                {property.proprietaire?.prenom?.[0]}{property.proprietaire?.nom?.[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#000] font-inter">
                                                {property.proprietaire?.prenom} {property.proprietaire?.nom}
                                            </p>
                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                {property.proprietaire?.type_utilisateur}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <Icons.Mail className="w-4 h-4 mr-3 text-[#6C6C6C]" />
                                            <a 
                                                href={`mailto:${property.proprietaire.email}`}
                                                className="text-[#065033] hover:text-[#054028] transition-colors font-inter"
                                            >
                                                {property.proprietaire.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center">
                                            <Icons.Phone className="w-4 h-4 mr-3 text-[#6C6C6C]" />
                                            <a 
                                                href={`tel:${property.proprietaire.telephone}`}
                                                className="text-[#065033] hover:text-[#054028] transition-colors font-inter"
                                            >
                                                {property.proprietaire.telephone}
                                            </a>
                                        </div>
                                        <div className="flex items-center">
                                            <Icons.CheckCircle className="w-4 h-4 mr-3 text-[#6C6C6C]" />
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                property.proprietaire.est_verifie 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            } font-inter`}>
                                                {property.proprietaire.est_verifie ? __('Verified') : __('Not Verified')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submission Details */}
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-6">
                                        {__('Submission Details')}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-[#065033] rounded-full flex items-center justify-center mr-4">
                                                    <Icons.Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-[#000] font-inter">{__('Submitted on')}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-[#000] font-inter">
                                                {formatDate(property.created_at)}
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
                                                #{property.id.toString().substring(0, 8)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Actions */}
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-6">
                                        {__('Admin Actions')}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {/* Request Edits Button - Always available for admin */}
                                        <button
                                            onClick={() => setShowEditRequestModal(true)}
                                            disabled={processing}
                                            className="w-full flex justify-center items-center px-4 py-3 gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold font-inter transition-all duration-200 hover:shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            {__('Request Edits')}
                                        </button>

                                        {property.statut === 'EN_ATTENTE' ? (
                                            <>
                                                <button
                                                    onClick={handleApprove}
                                                    disabled={processing}
                                                    className="w-full flex justify-center items-center px-4 py-3 gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold font-inter transition-all duration-200 hover:shadow-lg"
                                                >
                                                    <Icons.CheckCircle className="w-5 h-5" />
                                                    {processing ? __('Processing...') : __('Approve Property')}
                                                </button>
                                                
                                                <button
                                                    onClick={() => setShowRejectModal(true)}
                                                    disabled={processing}
                                                    className="w-full flex justify-center items-center px-4 py-3 gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold font-inter transition-all duration-200 hover:shadow-lg"
                                                >
                                                    <Icons.X className="w-5 h-5" />
                                                    {__('Reject Property')}
                                                </button>

                                                <div className="pt-4 border-t border-[#EAEAEA]">
                                                    <div className="flex items-center text-xs text-[#6C6C6C] font-inter">
                                                        <Icons.Shield className="w-4 h-4 mr-1" />
                                                        {__('Owner will be notified automatically')}
                                                    </div>
                                                </div>
                                            </>
                                        ) : property.statut === 'PUBLIE' ? (
                                            <div className="text-center py-6">
                                                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
                                                    <Icons.CheckCircle className="w-5 h-5 mr-2" />
                                                    <span className="font-inter font-medium">{__('Property approved')}</span>
                                                </div>
                                            </div>
                                        ) : property.statut === 'REJETE' ? (
                                            <div className="text-center py-6">
                                                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg border border-red-200">
                                                    <Icons.X className="w-5 h-5 mr-2" />
                                                    <span className="font-inter font-medium">{__('Property rejected')}</span>
                                                </div>
                                                {property.raison_rejet && (
                                                    <div className="mt-4 p-4 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg text-left">
                                                        <p className="text-sm text-[#000] font-inter">
                                                            <strong>{__('Rejection reason:')} </strong>
                                                            {property.raison_rejet}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Request Modal */}
                {showEditRequestModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" onClick={() => setShowEditRequestModal(false)}>
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-[#000] font-inter">
                                                {__('Request Property Edits')}
                                            </h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                                                        {__('Requested Changes')} *
                                                    </label>
                                                    <textarea
                                                        value={editRequestData.requested_changes}
                                                        onChange={(e) => setEditRequestData({
                                                            ...editRequestData,
                                                            requested_changes: e.target.value
                                                        })}
                                                        rows={4}
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-inter"
                                                        placeholder={__('Describe what needs to be changed or improved...')}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                                                        {__('Admin Notes')} ({__('Optional')})
                                                    </label>
                                                    <textarea
                                                        value={editRequestData.admin_notes}
                                                        onChange={(e) => setEditRequestData({
                                                            ...editRequestData,
                                                            admin_notes: e.target.value
                                                        })}
                                                        rows={3}
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-inter"
                                                        placeholder={__('Additional notes or instructions for the owner...')}
                                                    />
                                                </div>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {__('The property owner will receive an email notification with your requested changes.')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={handleEditRequest}
                                        disabled={processing || !editRequestData.requested_changes.trim()}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed font-inter"
                                    >
                                        {processing ? __('Sending...') : __('Send Edit Request')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditRequestModal(false);
                                            setEditRequestData({ requested_changes: '', admin_notes: '' });
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

                {/* Approve Confirmation Modal */}
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
                                            {__('Consequences of approval:')}
                                        </h4>
                                        <ul className="mt-2 text-sm text-green-700 space-y-1 font-inter">
                                            <li>• {__('The property will be immediately visible to the public')}</li>
                                            <li>• {__('The owner will receive a confirmation email')}</li>
                                            <li>• {__('Agents will be able to start receiving contacts')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-[#6C6C6C] font-inter">
                                <strong>{__('Property:')} </strong>
                                {translatePropertyType(property.type_propriete)} • {formatPrice(property.prix)} • {property.ville}
                            </div>
                        </div>
                    }
                    confirmText={__('Yes, approve')}
                    cancelText={__('Cancel')}
                    variant="success"
                    processing={processing}
                    icon={
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />

                {/* Reject Modal */}
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
            </div>
        </AuthenticatedLayout>
    );
}
