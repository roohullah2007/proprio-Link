import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

// Icons for the property view page
const Icons = {
    ArrowLeft: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    ),
    Edit: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    Trash2: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
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
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    ChevronLeft: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    ),
    ChevronRight: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    ),
    Maximize2: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6m-6 0L9 15M9 3H3v6m6 0l6-6" />
        </svg>
    ),
    Users: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    ),
    TrendingUp: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    CheckCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Clock: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    AlertCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    XCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    MessageSquare: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    ),
};

export default function Show({ auth, property, editRequests = [] }) {
    const { __ } = useTranslations();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getStatusConfig = (status) => {
        const statusConfigs = {
            'EN_ATTENTE': {
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                textColor: 'text-yellow-800',
                icon: Icons.Clock,
                label: __('Pending Review')
            },
            'PUBLIE': {
                bgColor: 'bg-[#F0F9F4]',
                borderColor: 'border-[#D1F2D9]',
                textColor: 'text-[#065033]',
                icon: Icons.CheckCircle,
                label: __('Published')
            },
            'REJETE': {
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                textColor: 'text-red-800',
                icon: Icons.XCircle,
                label: __('Rejected')
            },
            'VENDU': {
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                textColor: 'text-blue-800',
                icon: Icons.CheckCircle,
                label: __('Sold')
            },
        };

        return statusConfigs[status] || statusConfigs['EN_ATTENTE'];
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleDelete = () => {
        if (confirm(__('Are you sure you want to delete this property?'))) {
            router.delete(route('properties.destroy', property.id));
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === property.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? property.images.length - 1 : prev - 1
        );
    };

    const statusConfig = getStatusConfig(property.statut);
    const StatusIcon = statusConfig.icon;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    {/* Left side - Property details title and back button */}
                    <div className="flex items-center space-x-4 flex-none order-0 flex-grow-0">
                        <Link
                            href={route('properties.index')}
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
                    
                    {/* Right side - Action buttons */}
                    <div className="flex items-center gap-3 h-[31px] flex-none order-1 flex-grow-0">
                        {property.statut !== 'PUBLIE' && (
                            <>
                                <Link
                                    href={route('properties.edit', property.id)}
                                    className="flex justify-center items-center px-4 py-2 gap-2 bg-[#065033] border border-[#065033] rounded-lg text-white font-medium font-inter transition-colors hover:bg-[#054028] focus:outline-none focus:bg-[#054028]"
                                >
                                    <Icons.Edit className="w-4 h-4" />
                                    {__('Edit')}
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="flex justify-center items-center px-4 py-2 gap-2 bg-red-600 border border-red-600 rounded-lg text-white font-medium font-inter transition-colors hover:bg-red-700 focus:outline-none focus:bg-red-700"
                                >
                                    <Icons.Trash2 className="w-4 h-4" />
                                    {__('Delete')}
                                </button>
                            </>
                        )}
                        
                        {/* Status badge */}
                        <div className={`flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] ${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-full`}>
                            <StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
                            <span className={`text-sm font-medium font-inter whitespace-nowrap ${statusConfig.textColor}`}>
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`${property.type_propriete} - ${property.ville} - Proprio Link`} />

            <div className="py-8">
                <div className="mx-auto max-w-[1336px] px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - Images and Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Property Header */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-[#000] font-inter mb-2">
                                            {property.type_propriete}
                                        </h1>
                                        <div className="flex items-center text-[#6C6C6C] mb-2">
                                            <Icons.MapPin className="w-5 h-5 mr-2" />
                                            <span className="font-inter">{property.adresse_complete}</span>
                                        </div>
                                        <p className="text-[#6C6C6C] font-inter">
                                            {property.ville}, {property.pays}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-[#065033] font-inter">
                                    {formatPrice(property.prix)}
                                </div>
                            </div>

                            {/* Image Gallery Section */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                                {property.images && property.images.length > 0 ? (
                                    <>
                                        {/* Main Image */}
                                        <div className="relative h-80 lg:h-96">
                                            <img
                                                src={`/storage/${property.images[currentImageIndex].chemin_fichier}`}
                                                alt={`${property.type_propriete} photo ${currentImageIndex + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Try backup image route if storage fails
                                                    const originalSrc = e.target.src;
                                                    if (originalSrc.includes('/storage/')) {
                                                        const fileName = property.images[currentImageIndex].chemin_fichier;
                                                        e.target.src = `/images/${fileName}`;
                                                    }
                                                }}
                                            />
                                            
                                            {property.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={prevImage}
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-[#000] p-3 rounded-full border border-[#EAEAEA] transition-all duration-200 hover:scale-110"
                                                    >
                                                        <Icons.ChevronLeft className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={nextImage}
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-[#000] p-3 rounded-full border border-[#EAEAEA] transition-all duration-200 hover:scale-110"
                                                    >
                                                        <Icons.ChevronRight className="w-5 h-5" />
                                                    </button>
                                                    
                                                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium font-inter">
                                                        {currentImageIndex + 1} / {property.images.length}
                                                    </div>
                                                </>
                                            )}
                                            
                                            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium font-inter flex items-center">
                                                <Icons.Eye className="w-4 h-4 mr-1" />
                                                {property.images.length} {__('photos')}
                                            </div>
                                        </div>
                                        
                                        {/* Thumbnails - Only if more than 1 image */}
                                        {property.images.length > 1 && (
                                            <div className="p-6 bg-[#F5F9FA]">
                                                <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                                                    {property.images.slice(0, 8).map((image, index) => (
                                                        <button
                                                            key={image.id}
                                                            onClick={() => setCurrentImageIndex(index)}
                                                            className={`relative h-16 w-full rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 border-2 ${
                                                                index === currentImageIndex 
                                                                    ? 'border-[#065033] ring-2 ring-[#065033] ring-opacity-20 scale-105' 
                                                                    : 'border-[#EAEAEA] hover:border-[#065033]'
                                                            }`}
                                                        >
                                                            <img
                                                                src={`/storage/${image.chemin_fichier}`}
                                                                alt={`Thumbnail ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    // Try backup image route if storage fails
                                                                    const originalSrc = e.target.src;
                                                                    if (originalSrc.includes('/storage/')) {
                                                                        const fileName = image.chemin_fichier;
                                                                        e.target.src = `/images/${fileName}`;
                                                                    } else {
                                                                        // Hide thumbnail if still fails
                                                                        e.target.style.opacity = '0.3';
                                                                    }
                                                                }}
                                                            />
                                                        </button>
                                                    ))}
                                                    {property.images.length > 8 && (
                                                        <div className="h-16 bg-[#EAEAEA] rounded-lg flex items-center justify-center hover:bg-[#065033] hover:text-white transition-all duration-300 border-2 border-[#EAEAEA] hover:border-[#065033]">
                                                            <span className="text-sm font-bold font-inter">
                                                                +{property.images.length - 8}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="h-80 lg:h-96 bg-[#F5F9FA] flex items-center justify-center">
                                        <div className="text-center">
                                            <Icons.Home className="w-16 h-16 text-[#6C6C6C] mx-auto mb-4" />
                                            <p className="text-[#6C6C6C] font-medium font-inter">{__('No photos available')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Property Description */}
                            {property.description && (
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">{__('Description')}</h3>
                                    <p className="text-[#000] leading-relaxed font-inter">{property.description}</p>
                                </div>
                            )}
                            
                            {/* Edit Requests Section */}
                            {editRequests && editRequests.length > 0 && (
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <Icons.MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-[#000] font-inter">
                                            {__('Admin Requests')}
                                        </h3>
                                    </div>
                                    
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                        <p className="text-blue-800 font-inter">
                                            {__('An administrator has requested changes to your property listing. Please review the requests below and make the necessary updates.')}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {editRequests.filter(request => request.status === 'PENDING' || request.status === 'ACKNOWLEDGED').map((request) => (
                                            <div key={request.id} className="border border-[#EAEAEA] rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-[#000] font-inter">
                                                            {__('Admin Request')}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            request.status === 'PENDING' 
                                                                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                                                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                                                        }`}>
                                                            {request.status === 'PENDING' ? __('Pending') : __('Acknowledged')}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-[#6C6C6C] font-inter">
                                                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                                
                                                <div className="bg-[#F5F9FA] border border-[#EAEAEA] rounded p-3 mb-3">
                                                    <h4 className="font-medium text-[#000] font-inter mb-2">{__('Requested Changes:')}</h4>
                                                    <p className="text-[#000] font-inter">{request.requested_changes}</p>
                                                </div>
                                                
                                                {request.admin_notes && (
                                                    <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                                                        <h4 className="font-medium text-[#6C6C6C] font-inter mb-2">{__('Admin Notes:')}</h4>
                                                        <p className="text-[#6C6C6C] font-inter text-sm">{request.admin_notes}</p>
                                                    </div>
                                                )}
                                                
                                                {request.status === 'PENDING' && (
                                                    <div className="flex space-x-3 mt-4">
                                                        <button
                                                            onClick={() => {
                                                                router.patch(route('admin.property-edit-requests.update', request.id), {
                                                                    status: 'ACKNOWLEDGED'
                                                                });
                                                            }}
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium font-inter transition-colors"
                                                        >
                                                            {__('Mark as Seen')}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Property Details */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                                    {__('Property Details')}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <Icons.Home className="w-5 h-5 text-[#065033] mr-3" />
                                            <span className="text-[#000] font-inter">{__('Type')}</span>
                                        </div>
                                        <span className="font-medium text-[#000] font-inter">{property.type_propriete}</span>
                                    </div>
                                    <div className="flex justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <Icons.Euro className="w-5 h-5 text-[#065033] mr-3" />
                                            <span className="text-[#000] font-inter">{__('Price')}</span>
                                        </div>
                                        <span className="font-medium text-[#000] font-inter">{formatPrice(property.prix)}</span>
                                    </div>
                                    <div className="flex justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <Icons.Maximize2 className="w-5 h-5 text-[#065033] mr-3" />
                                            <span className="text-[#000] font-inter">{__('Surface Area')}</span>
                                        </div>
                                        <span className="font-medium text-[#000] font-inter">{property.superficie_m2} m²</span>
                                    </div>
                                    <div className="flex justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <Icons.TrendingUp className="w-5 h-5 text-[#065033] mr-3" />
                                            <span className="text-[#000] font-inter">{__('Price per m²')}</span>
                                        </div>
                                        <span className="font-medium text-[#000] font-inter">
                                            {formatPrice(property.prix / property.superficie_m2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Status */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                                    {__('Contact Management')}
                                </h3>
                                
                                {property.statut === 'PUBLIE' ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                            <div className="flex items-center">
                                                <Icons.Users className="w-5 h-5 text-[#065033] mr-3" />
                                                <span className="text-[#000] font-inter">{__('Desired Contacts')}</span>
                                            </div>
                                            <span className="font-medium text-[#000] font-inter">{property.contacts_souhaites}</span>
                                        </div>
                                        <div className="flex justify-between py-3 px-4 bg-[#F0F9F4] rounded-lg border border-[#D1F2D9]">
                                            <div className="flex items-center">
                                                <Icons.CheckCircle className="w-5 h-5 text-[#065033] mr-3" />
                                                <span className="text-[#065033] font-inter">{__('Remaining Contacts')}</span>
                                            </div>
                                            <span className="font-semibold text-[#065033] font-inter">{property.contacts_restants}</span>
                                        </div>
                                        <div className="flex justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                            <div className="flex items-center">
                                                <Icons.TrendingUp className="w-5 h-5 text-[#065033] mr-3" />
                                                <span className="text-[#000] font-inter">{__('Contacts Sold')}</span>
                                            </div>
                                            <span className="font-medium text-[#000] font-inter">{property.contacts_souhaites - property.contacts_restants}</span>
                                        </div>
                                        <div className="flex justify-between py-3 px-4 bg-gradient-to-r from-[#F5F9FA] to-[#F0F9F4] rounded-lg border border-[#EAEAEA]">
                                            <div className="flex items-center">
                                                <Icons.Euro className="w-5 h-5 text-[#065033] mr-3" />
                                                <span className="text-[#000] font-inter font-medium">{__('Generated Revenue')}</span>
                                            </div>
                                            <span className="font-bold text-[#065033] font-inter">
                                                {formatPrice((property.contacts_souhaites - property.contacts_restants) * 15)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`text-center py-6 ${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg`}>
                                        <StatusIcon className={`w-12 h-12 mx-auto mb-3 ${statusConfig.textColor}`} />
                                        <p className={`${statusConfig.textColor} font-medium font-inter`}>
                                            {property.statut === 'EN_ATTENTE' && __('Pending publication approval')}
                                            {property.statut === 'REJETE' && __('Property was rejected')}
                                            {property.statut === 'VENDU' && __('Property marked as sold')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Property Information */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                                    {__('Property Information')}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <StatusIcon className={`w-5 h-5 mr-3 ${statusConfig.textColor}`} />
                                            <span className="text-[#000] font-inter">{__('Status')}</span>
                                        </div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border font-inter`}>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <Icons.Calendar className="w-5 h-5 text-[#065033] mr-3" />
                                            <span className="text-[#000] font-inter">{__('Created On')}</span>
                                        </div>
                                        <span className="font-medium text-[#000] font-inter">
                                            {new Date(property.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 px-4 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA]">
                                        <div className="flex items-center">
                                            <Icons.Clock className="w-5 h-5 text-[#065033] mr-3" />
                                            <span className="text-[#000] font-inter">{__('Last Updated')}</span>
                                        </div>
                                        <span className="font-medium text-[#000] font-inter">
                                            {new Date(property.updated_at).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Rejection Reason */}
                            {property.statut === 'REJETE' && property.raison_rejet && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <Icons.AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-red-900 font-inter">
                                            {__('Rejection Reason')}
                                        </h3>
                                    </div>
                                    <p className="text-red-800 font-inter leading-relaxed">
                                        {property.raison_rejet}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
