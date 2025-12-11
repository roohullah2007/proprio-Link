import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';
import { formatDate } from '@/Utils/dateUtils';
import PropertyImage from '@/Components/PropertyImage';

// Icons
const Icons = {
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    MoreHorizontal: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
    ),
    Edit: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    Trash: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
};

export default function Index({ auth, properties }) {
    const { __ } = useTranslations();
    const [dropdownProperty, setDropdownProperty] = useState(null);
    const dropdownRef = useRef(null);

    // Handle click outside for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownProperty(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getStatusBadge = (status) => {
        const statusStyles = {
            'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
            'PUBLIE': 'bg-green-100 text-green-800',
            'REJETE': 'bg-red-100 text-red-800',
            'VENDU': 'bg-blue-100 text-blue-800',
        };

        const statusLabels = {
            'EN_ATTENTE': __('En attente'),
            'PUBLIE': __('Publié'),
            'REJETE': __('Rejeté'),
            'VENDU': __('Vendu'),
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
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
        const property = properties.data.find(p => p.id === propertyId);
        
        let confirmMessage;
        if (property?.statut === 'PUBLIE') {
            confirmMessage = __('Are you sure you want to delete this published property? This action will also delete all purchased contacts and cannot be undone.');
        } else {
            confirmMessage = __('Are you sure you want to delete this property?');
        }
        
        if (confirm(confirmMessage)) {
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full space-y-4 sm:space-y-0">
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
                        className="flex justify-center items-center px-4 py-2 gap-2 h-8 bg-[#0F44FC] border border-[#0F44FC] rounded-full font-inter font-medium text-sm text-white transition-all duration-200 hover:bg-[#0A37D1] focus:outline-none focus:bg-[#0A37D1] whitespace-nowrap"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">{__('New property')}</span>
                        <span className="sm:hidden">{__('New')}</span>
                    </Link>
                </div>
            }
        >
            <Head title={__('My Properties')} />

            <div className="py-8">
                <div className="mx-auto max-w-[1336px] px-4 sm:px-8">
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
                                    className="inline-flex justify-center items-center px-6 py-3 gap-2 h-11 bg-[#0F44FC] border border-[#0F44FC] rounded-full font-inter font-medium text-sm text-white transition-all duration-200 hover:bg-[#0A37D1] focus:outline-none focus:bg-[#0A37D1] whitespace-nowrap"
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
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {__('My Properties')} ({properties.data.length})
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Property')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Price')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Status')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Contacts')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Date')}
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-medium text-[#696969] font-inter">
                                                {__('Actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {properties.data.map((property) => (
                                            <tr key={property.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            <PropertyImage
                                                                image={property.images?.[0]}
                                                                alt={property.adresse_complete}
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                                fallbackClassName="h-12 w-12 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {translatePropertyType(property.type_propriete)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {property.ville}, {property.pays}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {property.superficie_m2} m²
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-medium">
                                                        {formatPrice(property.prix)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {formatPrice(property.prix / property.superficie_m2)}/m²
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(property.statut)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {property.statut === 'PUBLIE' ? (
                                                        <div>
                                                            <div>{property.contacts_restants} / {property.contacts_souhaites}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {__('remaining')}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(property.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center space-x-2 justify-end">
                                                        <Link
                                                            href={route('properties.show', property.id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-[#EAEAEA] rounded-lg text-sm text-[#6C6C6C] hover:text-[#065033] hover:border-[#065033] transition-colors"
                                                        >
                                                            <Icons.Eye className="w-4 h-4 mr-1" />
                                                            {__('View')}
                                                        </Link>
                                                        
                                                        <div className="relative" ref={dropdownProperty === property.id ? dropdownRef : null}>
                                                            <button
                                                                onClick={() => setDropdownProperty(dropdownProperty === property.id ? null : property.id)}
                                                                className="inline-flex items-center px-2 py-1.5 border border-[#EAEAEA] rounded-lg text-[#6C6C6C] hover:text-[#065033] hover:border-[#065033] transition-colors"
                                                            >
                                                                <Icons.MoreHorizontal className="w-4 h-4" />
                                                            </button>
                                                            
                                                            {dropdownProperty === property.id && (
                                                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#EAEAEA] z-50">
                                                                    <div className="py-1">
                                                                        <Link
                                                                            href={route('properties.edit', property.id)}
                                                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                            onClick={() => setDropdownProperty(null)}
                                                                        >
                                                                            <Icons.Edit className="w-4 h-4 mr-2" />
                                                                            {__('Edit')}
                                                                        </Link>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleDelete(property.id);
                                                                                setDropdownProperty(null);
                                                                            }}
                                                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                        >
                                                                            <Icons.Trash className="w-4 h-4 mr-2" />
                                                                            {__('Delete')}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {properties.links && properties.links.length > 3 && (
                        <div className="bg-white border border-[#EAEAEA] rounded-2xl shadow-sm overflow-hidden mt-6">
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                    <div className="text-sm text-gray-700 font-inter">
                                        {__('Showing')} {properties.from} {__('to')} {properties.to} {__('of')} {properties.total} {__('results')}
                                    </div>
                                    <div className="flex flex-wrap gap-1 justify-center sm:justify-end">
                                        {properties.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md font-medium ${
                                                    link.active
                                                        ? 'bg-[#065033] text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                preserveState
                                                preserveScroll
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}