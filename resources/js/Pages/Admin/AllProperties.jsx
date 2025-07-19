import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { __ } from '@/Utils/translations';

// Icons
const Icons = {
    Home: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    Search: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Filter: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
    ),
    ArrowLeft: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    X: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    ChevronDown: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    )
};

export default function AllProperties({ auth, properties, filters }) {
    const [searchForm, setSearchForm] = useState({
        search: filters.search || '',
        status: filters.status || ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const filtersRef = useRef(null);

    // Handle click outside for filters
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filtersRef.current && !filtersRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.all-properties'), searchForm, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearchForm({
            search: '',
            status: ''
        });
        router.get(route('admin.all-properties'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'en_attente': 'bg-yellow-100 text-yellow-800',
            'publie': 'bg-green-100 text-green-800',
            'rejete': 'bg-red-100 text-red-800',
            'vendu': 'bg-blue-100 text-blue-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const translateStatus = (status) => {
        const translations = {
            'en_attente': __('En attente'),
            'publie': __('Publié'),
            'rejete': __('Rejeté'),
            'vendu': __('Vendu')
        };
        return translations[status] || status;
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
            usePillNavigation={false}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    {/* Left side - Page title */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.dashboard')}
                            className="flex items-center text-[#000] hover:text-[#065033] transition-colors"
                        >
                            <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="font-inter font-medium text-[14px] leading-[19px]">
                                {__('Retour au tableau de bord')}
                            </span>
                        </Link>
                    </div>
                    
                    {/* Right side - Actions */}
                    <div className="flex items-center gap-[14px] h-[31px]">
                        <div className="relative" ref={filtersRef}>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#065033] border border-[#065033] rounded-full transition-colors hover:bg-[#054028] focus:outline-none focus:bg-[#054028]"
                            >
                                <Icons.Filter className="w-3 h-3 text-white" />
                                <span className="font-inter font-medium text-[13px] leading-[16px] text-white whitespace-nowrap">
                                    {__('Filtres')}
                                </span>
                                <Icons.ChevronDown className={`w-3 h-3 text-white transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Filters Dropdown */}
                            {showFilters && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-[#000] font-inter">
                                                {__('Filtres de recherche')}
                                            </h3>
                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <Icons.X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        
                                        <form onSubmit={handleSearch} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {__('Recherche')}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Icons.Search className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={searchForm.search}
                                                        onChange={(e) => setSearchForm({...searchForm, search: e.target.value})}
                                                        placeholder={__('Ville, adresse, propriétaire...')}
                                                        className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-[#065033] focus:ring-[#065033]"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {__('Statut')}
                                                </label>
                                                <select
                                                    value={searchForm.status}
                                                    onChange={(e) => setSearchForm({...searchForm, status: e.target.value})}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#065033] focus:ring-[#065033]"
                                                >
                                                    <option value="">{__('Tous les statuts')}</option>
                                                    <option value="en_attente">{__('En attente')}</option>
                                                    <option value="publie">{__('Publié')}</option>
                                                    <option value="rejete">{__('Rejeté')}</option>
                                                    <option value="vendu">{__('Vendu')}</option>
                                                </select>
                                            </div>
                                            
                                            <div className="flex justify-between pt-4">
                                                <button
                                                    type="button"
                                                    onClick={clearFilters}
                                                    className="text-sm text-gray-500 hover:text-gray-700"
                                                >
                                                    {__('Effacer les filtres')}
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-[#065033] hover:bg-[#054028] text-white px-4 py-2 rounded-md text-sm font-medium"
                                                    onClick={() => setShowFilters(false)}
                                                >
                                                    {__('Rechercher')}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={__('Toutes les propriétés')} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-8">


                    {/* Filter Status Bar */}
                    {(filters.search || filters.status) && (
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600">
                                        {__('Filtres actifs')}:
                                    </span>
                                    {filters.search && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#065033] text-white">
                                            {filters.search}
                                            <button
                                                onClick={() => {
                                                    setSearchForm({...searchForm, search: ''});
                                                    router.get(route('admin.all-properties'), {...searchForm, search: ''});
                                                }}
                                                className="ml-2 hover:bg-[#054028] rounded-full p-0.5"
                                            >
                                                <Icons.X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {filters.status && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#065033] text-white">
                                            {translateStatus(filters.status)}
                                            <button
                                                onClick={() => {
                                                    setSearchForm({...searchForm, status: ''});
                                                    router.get(route('admin.all-properties'), {...searchForm, status: ''});
                                                }}
                                                className="ml-2 hover:bg-[#054028] rounded-full p-0.5"
                                            >
                                                <Icons.X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    {__('Effacer tous les filtres')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Properties Table */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {__('Propriétés')} ({properties.total})
                            </h3>
                        </div>

                        {properties.data.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                    <Icons.Home className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-[#696969] font-inter mb-2">
                                    {__('Aucune propriété trouvée')}
                                </h3>
                                <p className="text-sm text-[#6C6C6C] font-inter">
                                    {filters.search || filters.status 
                                        ? __('Essayez de modifier vos critères de recherche.')
                                        : __('Aucune propriété n\'a été soumise pour le moment.')
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Propriété')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Propriétaire')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Prix')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Statut')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Contacts')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {__('Date')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                            {property.images.length > 0 ? (
                                                                <img
                                                                    className="h-12 w-12 rounded-lg object-cover"
                                                                    src={`/storage/${property.images[0].chemin_fichier}`}
                                                                    alt={property.type_propriete}
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-2 4h2" />
                                                                    </svg>
                                                                </div>
                                                            )}
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
                                                    <div className="text-sm text-gray-900">
                                                        {property.proprietaire.prenom} {property.proprietaire.nom}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {property.proprietaire.email}
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
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.statut)}`}>
                                                        {translateStatus(property.statut)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div>{property.contacts_restants} / {property.contacts_souhaites}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {property.contacts_souhaites - property.contacts_restants} {__('vendus')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(property.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {property.statut === 'en_attente' && (
                                                            <Link
                                                                href={route('admin.property-review', property.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                {__('Modérer')}
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href={route('properties.show', property.id)}
                                                            className="text-gray-600 hover:text-gray-900"
                                                        >
                                                            {__('Voir')}
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {properties.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700 font-inter">
                                        {__('Affichage de')} {properties.from} {__('à')} {properties.to} {__('sur')} {properties.total} {__('résultats')}
                                    </div>
                                    <div className="flex space-x-1">
                                        {properties.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-md font-medium ${
                                                    link.active
                                                        ? 'bg-[#065033] text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
