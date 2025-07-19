import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

export default function Index({ auth, properties }) {
    const { __ } = useTranslations();

    const getStatusBadge = (status) => {
        const statusStyles = {
            'EN_ATTENTE': 'bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full',
            'PUBLIE': 'bg-[#CEE8DE] text-[#696969] border border-[#CEE8DE] rounded-full',
            'REJETE': 'bg-red-50 text-red-700 border border-red-200 rounded-full',
            'VENDU': 'bg-blue-50 text-blue-700 border border-blue-200 rounded-full',
        };

        const statusLabels = {
            'EN_ATTENTE': __('En attente'),
            'PUBLIE': __('Publié'),
            'REJETE': __('Rejeté'),
            'VENDU': __('Vendu'),
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium font-inter ${statusStyles[status]}`}>
                {statusLabels[status]}
            </span>
        );
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleDelete = (propertyId) => {
        if (confirm(__('Êtes-vous sûr de vouloir supprimer cette propriété ?'))) {
            router.delete(route('properties.destroy', propertyId));
        }
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

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('My Properties')}
                        </h1>
                        <p className="text-[#6C6C6C] text-xs font-inter mt-1">
                            {__('Manage your properties submitted on Proprio Link')}
                        </p>
                    </div>
                    <Link
                        href={route('properties.create')}
                        className="flex justify-center items-center px-4 py-2 gap-2 h-8 bg-[#065033] border border-[#065033] rounded-full font-inter font-medium text-sm text-white transition-all duration-200 hover:bg-[#054028] focus:outline-none focus:bg-[#054028] whitespace-nowrap"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {__('New property')}
                    </Link>
                </div>
            }
        >
            <Head title={__('Mes propriétés')} />

            <div className="py-8">
                <div className="mx-auto max-w-[1336px] px-8">
                    {properties.data.length === 0 ? (
                        <div className="bg-white border border-[#EAEAEA] rounded-2xl shadow-sm">
                            <div className="text-center py-16 px-8">
                                <div className="w-20 h-20 bg-[#F5F9FA] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-[#6C6C6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-[#696969] font-inter mb-3">
                                    {__('No properties yet')}
                                </h3>
                                <p className="text-[#6C6C6C] font-inter mb-8 max-w-md mx-auto">
                                    {__('You haven\'t submitted any properties yet. Start by adding your first property to get started.')}
                                </p>
                                <Link
                                    href={route('properties.create')}
                                    className="inline-flex justify-center items-center px-6 py-3 gap-2 h-11 bg-[#065033] border border-[#065033] rounded-full font-inter font-medium text-sm text-white transition-all duration-200 hover:bg-[#054028] focus:outline-none focus:bg-[#054028] whitespace-nowrap"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {__('Submit my first property')}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-[#EAEAEA] rounded-2xl shadow-sm overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-white border-b border-[#EAEAEA] px-8 py-4">
                                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-[#696969] font-inter">
                                    <div className="col-span-3">{__('Property')}</div>
                                    <div className="col-span-1">{__('Status')}</div>
                                    <div className="col-span-2">{__('Price')}</div>
                                    <div className="col-span-1 whitespace-nowrap">{__('Surface area')}</div>
                                    <div className="col-span-2">{__('Contacts')}</div>
                                    <div className="col-span-2 whitespace-nowrap">{__('Created on')}</div>
                                    <div className="col-span-1 text-right">{__('Actions')}</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-[#EAEAEA]">
                                {properties.data.map((property, index) => (
                                    <div key={property.id} className="px-8 py-6 bg-[#F5F9FA] hover:bg-white transition-colors duration-200">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            {/* Property Info */}
                                            <div className="col-span-3">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        {property.images && property.images.length > 0 ? (
                                                        <img
                                                            className="w-16 h-16 rounded-xl object-cover border border-[#EAEAEA]"
                                                            src={property.images[0].chemin_image || property.images[0].url || `/storage/${property.images[0].chemin_fichier}`}
                                                            alt={property.adresse_complete}
                                                            onError={(e) => {
                                                                // Try backup image route if storage fails
                                                                const originalSrc = e.target.src;
                                                                if (originalSrc.includes('/storage/')) {
                                                                    const fileName = property.images[0].chemin_fichier;
                                                                    e.target.src = `/images/${fileName}`;
                                                                } else {
                                                                    // Hide image and show placeholder
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }
                                                            }}
                                            />
                                        ) : null}
                                                        <div 
                                                            className={`w-16 h-16 rounded-xl bg-[#F5F9FA] border border-[#EAEAEA] flex items-center justify-center ${property.images && property.images.length > 0 ? 'hidden' : ''}`}
                                                        >
                                                            <svg className="w-8 h-8 text-[#6C6C6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-semibold text-[#696969] font-inter truncate">
                                                            {translatePropertyType(property.type_propriete)}
                                                        </h3>
                                                        <p className="text-sm text-[#6C6C6C] font-inter truncate">
                                                            {property.ville}, {property.pays}
                                                        </p>
                                                        {property.statut === 'REJETE' && property.raison_rejet && (
                                                            <div className="text-xs text-red-600 mt-1 truncate">
                                                                <strong>{__('Rejection reason:')} </strong>
                                                                {property.raison_rejet.length > 30 
                                                                    ? property.raison_rejet.substring(0, 30) + '...'
                                                                    : property.raison_rejet
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-1">
                                                {getStatusBadge(property.statut)}
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-2">
                                                <span className="text-sm font-semibold text-[#696969] font-inter">
                                                    {formatPrice(property.prix)}
                                                </span>
                                            </div>

                                            {/* Surface */}
                                            <div className="col-span-1">
                                                <span className="text-sm text-[#6C6C6C] font-inter">
                                                    {property.superficie_m2} m²
                                                </span>
                                            </div>

                                            {/* Contacts */}
                                            <div className="col-span-2">
                                                {property.statut === 'PUBLIE' ? (
                                                    <div className="text-center">
                                                        <div className="text-sm font-semibold text-[#696969] font-inter">
                                                            {property.contacts_restants} / {property.contacts_souhaites}
                                                        </div>
                                                        <div className="text-xs text-[#6C6C6C] font-inter">
                                                            {__('remaining')}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-[#6C6C6C]">—</span>
                                                )}
                                            </div>

                                            {/* Created Date */}
                                            <div className="col-span-2">
                                                <span className="text-sm text-[#6C6C6C] font-inter">
                                                    {new Date(property.created_at).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-1 text-right">
                                                <div className="flex justify-end items-center space-x-3">
                                                    <Link
                                                        href={route('properties.show', property.id)}
                                                        className="text-[#065033] hover:text-[#054529] font-medium text-sm font-inter transition-colors duration-200"
                                                    >
                                                        {__('View')}
                                                    </Link>
                                                    
                                                    {(property.statut === 'EN_ATTENTE' || property.statut === 'REJETE') && (
                                                        <>
                                                            <div className="w-px h-4 bg-[#EAEAEA]"></div>
                                                            <Link
                                                                href={route('properties.edit', property.id)}
                                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm font-inter transition-colors duration-200"
                                                            >
                                                                {__('Edit')}
                                                            </Link>
                                                            
                                                            <div className="w-px h-4 bg-[#EAEAEA]"></div>
                                                            <button
                                                                onClick={() => handleDelete(property.id)}
                                                                className="text-red-600 hover:text-red-800 font-medium text-sm font-inter transition-colors duration-200"
                                                            >
                                                                {__('Delete')}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {properties.data.length > 0 && properties.links && properties.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                {properties.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`flex items-center justify-center transition-all duration-200 rounded-full font-medium text-sm leading-4 font-inter h-[35px] px-4 ${
                                            link.active
                                                ? 'bg-[#065033] text-white border border-[#065033]'
                                                : link.url
                                                ? 'text-[#6C6C6C] hover:bg-white hover:border hover:border-[#CEE8DE] hover:text-[#696969] hover:shadow-sm bg-white border border-[#EAEAEA]'
                                                : 'text-[#EAEAEA] cursor-not-allowed bg-white border border-[#EAEAEA]'
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
        </AuthenticatedLayout>
    );
}
