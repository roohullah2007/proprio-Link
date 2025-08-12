import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';
import PropertyImage from '@/Components/PropertyImage';

const Icons = {
    ArrowLeft: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    ),
    Edit2: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    User: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
    Clock: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    XCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Calendar: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Maximize2: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6m-6 0L9 15M9 3H3v6m6 0l6-6" />
        </svg>
    ),
    MessageSquare: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    ),
    Send: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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

export default function AdminPropertyView({ auth, property, editRequests = [] }) {
    const { __ } = useTranslations();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showEditRequestForm, setShowEditRequestForm] = useState(false);
    const [editRequestText, setEditRequestText] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [processing, setProcessing] = useState(false);

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

    const getEditRequestStatusConfig = (status) => {
        const configs = {
            'PENDING': {
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                textColor: 'text-yellow-800',
                label: __('Pending')
            },
            'ACKNOWLEDGED': {
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200', 
                textColor: 'text-blue-800',
                label: __('Acknowledged')
            },
            'COMPLETED': {
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                textColor: 'text-green-800',
                label: __('Completed')
            },
            'CANCELLED': {
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                textColor: 'text-gray-800',
                label: __('Cancelled')
            },
        };
        return configs[status] || configs['PENDING'];
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
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

    const handleEditRequest = () => {
        if (!editRequestText.trim()) {
            alert(__('Please describe the changes you want to request.'));
            return;
        }

        setProcessing(true);
        router.post(route('admin.property-edit-requests.store', property.id), {
            requested_changes: editRequestText,
            admin_notes: adminNotes
        }, {
            onSuccess: () => {
                setEditRequestText('');
                setAdminNotes('');
                setShowEditRequestForm(false);
            },
            onError: (errors) => {
                console.error('Error sending edit request:', errors);
            },
            onFinish: () => setProcessing(false)
        });
    };

    const statusConfig = getStatusConfig(property.statut);
    const StatusIcon = statusConfig.icon;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex items-center space-x-4 flex-none order-0 flex-grow-0">
                        <Link
                            href={route('admin.dashboard')}
                            className="flex items-center text-[#6C6C6C] hover:text-[#065033] font-inter text-sm font-medium transition-colors"
                        >
                            <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                            {__('Back to Admin')}
                        </Link>
                        <div className="h-4 w-px bg-[#EAEAEA]"></div>
                        <div className="flex items-center space-x-2">
                            <Icons.Shield className="w-5 h-5 text-blue-600" />
                            <h1 className="font-inter font-medium text-[14px] leading-[19px] text-[#000] capitalize">
                                {__('Admin Property View')}
                            </h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 h-[31px] flex-none order-1 flex-grow-0">
                        <button
                            onClick={() => setShowEditRequestForm(!showEditRequestForm)}
                            className="flex justify-center items-center px-4 py-2 gap-2 bg-blue-600 border border-blue-600 rounded-lg text-white font-medium font-inter transition-colors hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                        >
                            <Icons.Edit2 className="w-4 h-4" />
                            {__('Request Edit')}
                        </button>
                        
                        <Link
                            href={route('admin.property-review', property.id)}
                            className="flex justify-center items-center px-4 py-2 gap-2 bg-[#065033] border border-[#065033] rounded-lg text-white font-medium font-inter transition-colors hover:bg-[#054028] focus:outline-none focus:bg-[#054028]"
                        >
                            <Icons.Eye className="w-4 h-4" />
                            {__('Full Review')}
                        </Link>

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
            <Head title={`Admin - ${property.type_propriete} - ${property.ville}`} />

            <div className="py-8">
                <div className="mx-auto max-w-[1336px] px-8">
                    {/* Edit Request Form */}
                    {showEditRequestForm && (
                        <div className="mb-8 bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <Icons.Edit2 className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-lg font-semibold text-[#000] font-inter">
                                    {__('Request Property Edit')}
                                </h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                                        {__('Requested Changes')} *
                                    </label>
                                    <textarea
                                        value={editRequestText}
                                        onChange={(e) => setEditRequestText(e.target.value)}
                                        rows={4}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-inter"
                                        placeholder={__('Describe the changes you want the property owner to make...')}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                                        {__('Admin Notes')} ({__('Optional')})
                                    </label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        rows={2}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-inter"
                                        placeholder={__('Internal notes about this edit request...')}
                                    />
                                </div>
                                
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleEditRequest}
                                        disabled={processing || !editRequestText.trim()}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium font-inter transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                    >
                                        <Icons.Send className="w-4 h-4 mr-2" />
                                        {processing ? __('Sending...') : __('Send Request')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowEditRequestForm(false);
                                            setEditRequestText('');
                                            setAdminNotes('');
                                        }}
                                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium font-inter transition-colors"
                                    >
                                        {__('Cancel')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Property Header */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <div className="mb-4">
                                    <h1 className="text-3xl font-bold text-[#000] font-inter mb-3">
                                        {translatePropertyType(property.type_propriete)}
                                    </h1>
                                    <div className="flex items-center text-[#6C6C6C] mb-2">
                                        <Icons.MapPin className="w-5 h-5 mr-2" />
                                        <span className="font-inter text-lg">{property.adresse_complete}</span>
                                    </div>
                                    <p className="text-[#6C6C6C] font-inter text-lg mb-4">
                                        {property.ville}, {property.pays}
                                    </p>
                                    <div className="text-3xl font-bold text-[#065033] font-inter">
                                        {formatPrice(property.prix)}
                                    </div>
                                </div>
                            </div>

                            {/* Property Images */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                                {property.images && property.images.length > 0 ? (
                                    <>
                                        <div className="relative h-80 lg:h-96">
                                            <PropertyImage
                                                image={property.images[currentImageIndex]}
                                                alt={`${property.type_propriete} photo ${currentImageIndex + 1}`}
                                                className="w-full h-full object-cover"
                                                fallbackClassName="w-full h-full"
                                            />
                                            
                                            {property.images.length > 1 && (
                                                <>
                                                    <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-[#000] p-3 rounded-full border border-[#EAEAEA] transition-all duration-200 hover:scale-110">
                                                        <Icons.ChevronLeft className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-[#000] p-3 rounded-full border border-[#EAEAEA] transition-all duration-200 hover:scale-110">
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
                                                            <PropertyImage
                                                                image={image}
                                                                alt={`Thumbnail ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                                fallbackClassName="w-full h-full"
                                                            />
                                                        </button>
                                                    ))}
                                                    {property.images.length > 8 && (
                                                        <div className="h-16 bg-[#EAEAEA] rounded-lg flex items-center justify-center">
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

                            {/* Edit Requests History */}
                            {editRequests && editRequests.length > 0 && (
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <Icons.MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-[#000] font-inter">
                                            {__('Edit Requests History')}
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {editRequests.map((request) => {
                                            const requestStatusConfig = getEditRequestStatusConfig(request.status);
                                            return (
                                                <div key={request.id} className="border border-[#EAEAEA] rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-[#000] font-inter">
                                                                {request.requested_by?.prenom} {request.requested_by?.nom}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${requestStatusConfig.bgColor} ${requestStatusConfig.textColor} ${requestStatusConfig.borderColor} border`}>
                                                                {requestStatusConfig.label}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-[#6C6C6C] font-inter">
                                                            {new Date(request.created_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                    <p className="text-[#000] font-inter mb-2">{request.requested_changes}</p>
                                                    {request.admin_notes && (
                                                        <div className="mt-2 p-3 bg-[#F5F9FA] border border-[#EAEAEA] rounded">
                                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                                <strong>{__('Admin Notes')}:</strong> {request.admin_notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Property Owner Info */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <div className="flex items-center mb-6">
                                    <Icons.User className="w-6 h-6 text-[#000] mr-3" />
                                    <h3 className="text-lg font-semibold text-[#000] font-inter">
                                        {__('Propriétaire')}
                                    </h3>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#065033] to-[#054028] rounded-full flex items-center justify-center">
                                            <span className="text-white text-lg font-bold font-inter">
                                                {property.proprietaire?.prenom?.[0]}{property.proprietaire?.nom?.[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#000] font-inter text-lg">
                                                {property.proprietaire?.prenom} {property.proprietaire?.nom}
                                            </p>
                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                {__('Propriétaire')}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <Icons.Mail className="w-5 h-5 text-[#6C6C6C] mr-3 mt-1" />
                                            <div className="flex-1">
                                                <p className="text-sm text-[#6C6C6C] font-inter mb-1">{__('Email')}</p>
                                                <p className="font-medium text-[#000] font-inter break-all">{property.proprietaire?.email}</p>
                                            </div>
                                        </div>
                                        
                                        {property.proprietaire?.telephone && (
                                            <div className="flex items-start">
                                                <Icons.Phone className="w-5 h-5 text-[#6C6C6C] mr-3 mt-1" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-[#6C6C6C] font-inter mb-1">{__('Téléphone')}</p>
                                                    <p className="font-medium text-[#000] font-inter">{property.proprietaire?.telephone}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-[#000] font-inter mb-6">
                                    {__('Détails de la propriété')}
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Icons.Home className="w-5 h-5 text-[#6C6C6C] mr-3" />
                                            <span className="text-[#000] font-inter">{__('Type')}</span>
                                        </div>
                                        <span className="font-semibold text-[#000] font-inter">{translatePropertyType(property.type_propriete)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Icons.Euro className="w-5 h-5 text-[#6C6C6C] mr-3" />
                                            <span className="text-[#000] font-inter">{__('Prix')}</span>
                                        </div>
                                        <span className="font-semibold text-[#000] font-inter">{formatPrice(property.prix)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Icons.Maximize2 className="w-5 h-5 text-[#6C6C6C] mr-3" />
                                            <span className="text-[#000] font-inter">{__('Superficie')}</span>
                                        </div>
                                        <span className="font-semibold text-[#000] font-inter">{property.superficie_m2} m²</span>
                                    </div>
                                    
                                    {property.contacts_souhaites && (
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Icons.User className="w-5 h-5 text-[#6C6C6C] mr-3" />
                                                <span className="text-[#000] font-inter">{__('Contacts')}</span>
                                            </div>
                                            <span className="font-semibold text-[#000] font-inter">
                                                {property.contacts_restants}/{property.contacts_souhaites}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Property Information */}
                            {(property.nombre_pieces || property.nombre_chambres || property.nombre_salles_bain || property.annee_construction) && (
                                <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                                        {__('Additional Details')}
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {property.nombre_pieces && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#6C6C6C] font-inter">{__('Rooms')}</span>
                                                <span className="font-medium text-[#000] font-inter">{property.nombre_pieces}</span>
                                            </div>
                                        )}
                                        {property.nombre_chambres && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#6C6C6C] font-inter">{__('Bedrooms')}</span>
                                                <span className="font-medium text-[#000] font-inter">{property.nombre_chambres}</span>
                                            </div>
                                        )}
                                        {property.nombre_salles_bain && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#6C6C6C] font-inter">{__('Bathrooms')}</span>
                                                <span className="font-medium text-[#000] font-inter">{property.nombre_salles_bain}</span>
                                            </div>
                                        )}
                                        {property.annee_construction && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#6C6C6C] font-inter">{__('Year Built')}</span>
                                                <span className="font-medium text-[#000] font-inter">{property.annee_construction}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Rejection Reason */}
                            {property.statut === 'REJETE' && property.raison_rejet && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <Icons.XCircle className="w-6 h-6 text-red-600 mr-3" />
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
