import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

// Icons for the moderation page
const Icons = {
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
    Home: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    Clock: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    X: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    ArrowLeft: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    Clipboard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
};

export default function PendingProperties({ auth, properties, filters }) {
    const { __ } = useTranslations();
    const [processing, setProcessing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [timeframe, setTimeframe] = useState('all');
    const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
    const dropdownRef = useRef(null);
    
    const [searchForm, setSearchForm] = useState({
        search: filters.search || '',
        type: filters.type || '',
        price_min: filters.price_min || '',
        price_max: filters.price_max || ''
    });

    // Handle click outside for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTimeframeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get timeframe label
    const getTimeframeLabel = () => {
        switch(timeframe) {
            case 'today': return __('Today');
            case '7d': return __('Last 7 Days');
            case '30d': return __('Last 30 Days');
            case 'all': return __('All Time');
            default: return __('All Time');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.pending-properties'), searchForm, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearchForm({
            search: '',
            type: '',
            price_min: '',
            price_max: ''
        });
        router.get(route('admin.pending-properties'), {}, {
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
            month: 'long',
            day: 'numeric'
        });
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

    const hasActiveFilters = searchForm.search || searchForm.type || searchForm.price_min || searchForm.price_max;

    return (
        <AuthenticatedLayout
            usePillNavigation={false}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    {/* Left side - Page title */}
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Property Moderation')}
                        </h1>
                    </div>
                    
                    {/* Right side - Filter button */}
                    <div className="flex items-center gap-[14px] h-[31px] flex-none order-1 flex-grow-0">
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
                                className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#065033] border border-[#065033] rounded-full flex-none order-0 flex-grow-0 transition-colors hover:bg-[#054028] focus:outline-none focus:bg-[#054028]"
                            >
                                <svg 
                                    width="12" 
                                    height="12" 
                                    viewBox="0 0 17 15" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-none order-0 flex-grow-0"
                                >
                                    <path 
                                        d="M16 2.625H14.3333M16 7.5H11.8333M16 12.375H11.8333M4.33333 14V8.76848C4.33333 8.59948 4.33333 8.51498 4.31632 8.43413C4.30122 8.36247 4.27626 8.29308 4.2421 8.22784C4.20359 8.15439 4.14945 8.08841 4.04116 7.95638L1.29218 4.60609C1.18388 4.47411 1.12974 4.40812 1.09123 4.33464C1.05707 4.26944 1.03211 4.20005 1.01702 4.12834C1 4.04751 1 3.963 1 3.79398V2.3C1 1.84496 1 1.61744 1.09082 1.44363C1.17072 1.29075 1.29821 1.16646 1.45501 1.08855C1.63327 1 1.86662 1 2.33333 1H9.66667C10.1334 1 10.3668 1 10.545 1.08855C10.7018 1.16646 10.8292 1.29075 10.9092 1.44363C11 1.61744 11 1.84496 11 2.3V3.79398C11 3.963 11 4.04751 10.983 4.12834C10.9679 4.20005 10.9429 4.26944 10.9087 4.33464C10.8702 4.40812 10.8161 4.47411 10.7078 4.60609L7.95883 7.95638C7.85058 8.08841 7.79642 8.15439 7.75792 8.22784C7.72375 8.29308 7.69875 8.36247 7.68367 8.43413C7.66667 8.51498 7.66667 8.59948 7.66667 8.76848V11.5625L4.33333 14Z" 
                                        stroke="white" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="font-inter font-medium text-[13px] leading-[16px] flex items-center text-white flex-none order-1 flex-grow-0 whitespace-nowrap">
                                    {getTimeframeLabel()}
                                </span>
                                <svg 
                                    className={`w-3 h-3 text-white transition-transform duration-200 flex-none order-2 flex-grow-0 ${showTimeframeDropdown ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showTimeframeDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setTimeframe('today');
                                                setShowTimeframeDropdown(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                                timeframe === 'today' ? 'bg-[#065033] text-white' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {__('Today')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTimeframe('7d');
                                                setShowTimeframeDropdown(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                                timeframe === '7d' ? 'bg-[#065033] text-white' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {__('Last 7 Days')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTimeframe('30d');
                                                setShowTimeframeDropdown(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                                timeframe === '30d' ? 'bg-[#065033] text-white' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {__('Last 30 Days')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTimeframe('all');
                                                setShowTimeframeDropdown(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                                timeframe === 'all' ? 'bg-[#065033] text-white' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {__('All Time')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={__("Property Moderation") + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-8">
                    {/* Header Section */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-4 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                                    {__("Property Moderation")}
                                </h2>
                                <p className="text-[#6C6C6C] font-inter">
                                    {__("Review and approve property submissions from owners.")}
                                </p>
                            </div>
                            
                            {/* Stats Badge */}
                            <div className="flex items-center gap-4">
                                <div className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#065033] border border-[#065033] rounded-full">
                                    <Icons.Clock className="w-4 h-4 text-white" />
                                    <span className="text-white text-sm font-medium font-inter whitespace-nowrap">
                                        {__("Requires Review")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-sm mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-[#696969] font-inter">
                                {__("Search & Filter Properties")}
                            </h3>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] border rounded-full transition-colors ${
                                    showFilters || hasActiveFilters
                                        ? 'bg-[#065033] border-[#065033] text-white'
                                        : 'bg-white border-[#EAEAEA] text-[#6C6C6C] hover:border-[#CEE8DE]'
                                }`}
                            >
                                <Icons.Filter className="w-4 h-4" />
                                <span className="text-sm font-medium font-inter whitespace-nowrap">
                                    {showFilters ? __('Hide Filters') : __('Show Filters')}
                                </span>
                                {hasActiveFilters && (
                                    <span className="bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
                                        {Object.values(searchForm).filter(v => v).length}
                                    </span>
                                )}
                            </button>
                        </div>
                        
                        {/* Quick Search Bar */}
                        <div className="mb-6">
                            <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                <Icons.Search className="flex-none w-4 h-4 text-[#4E5051]" />
                                <input
                                    type="text"
                                    value={searchForm.search}
                                    onChange={(e) => setSearchForm({...searchForm, search: e.target.value})}
                                    placeholder={__('Search by city, address, or owner name...')}
                                    className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(e);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                            {__('Property Type')}
                                        </label>
                                        <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                            <select
                                                value={searchForm.type}
                                                onChange={(e) => setSearchForm({...searchForm, type: e.target.value})}
                                                className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] appearance-none focus:outline-none focus:ring-0 focus:border-0"
                                            >
                                                <option value="">{__('All Types')}</option>
                                                <option value="APPARTEMENT">{__('Apartment')}</option>
                                                <option value="MAISON">{__('House')}</option>
                                                <option value="TERRAIN">{__('Land')}</option>
                                                <option value="COMMERCIAL">{__('Commercial Space')}</option>
                                                <option value="BUREAU">{__('Office')}</option>
                                                <option value="AUTRES">{__('Other')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                            {__('Minimum Price')}
                                        </label>
                                        <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                            <input
                                                type="number"
                                                value={searchForm.price_min}
                                                onChange={(e) => setSearchForm({...searchForm, price_min: e.target.value})}
                                                placeholder="€ 0"
                                                className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-[#696969] font-inter mb-2">
                                            {__('Maximum Price')}
                                        </label>
                                        <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                            <input
                                                type="number"
                                                value={searchForm.price_max}
                                                onChange={(e) => setSearchForm({...searchForm, price_max: e.target.value})}
                                                placeholder="€ 999,999"
                                                className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center pt-4">
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-white border border-[#EAEAEA] rounded-full text-[#6C6C6C] hover:border-[#CEE8DE] transition-colors"
                                    >
                                        <Icons.X className="w-4 h-4" />
                                        <span className="text-sm font-medium font-inter whitespace-nowrap">
                                            {__('Clear Filters')}
                                        </span>
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#065033] border border-[#065033] rounded-full text-white hover:bg-[#054028] transition-colors"
                                    >
                                        <Icons.Search className="w-4 h-4" />
                                        <span className="text-sm font-medium font-inter whitespace-nowrap">
                                            {__('Apply Filters')}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Properties Results */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl shadow-sm">
                        <div className="p-6 border-b border-[#EAEAEA]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-[#696969] font-inter">
                                    {__('Properties Pending Review')} ({properties.total})
                                </h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[#065033] hover:text-[#054028] font-medium font-inter"
                                    >
                                        {__('Clear all filters')}
                                    </button>
                                )}
                            </div>
                        </div>

                        {properties.data.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Icons.Clipboard className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-[#696969] font-inter mb-2">
                                    {hasActiveFilters ? __('No Properties Match Your Filters') : __('No Properties Pending Review')}
                                </h4>
                                <p className="text-sm text-[#6C6C6C] font-inter">
                                    {hasActiveFilters 
                                        ? __('Try adjusting your search criteria or clear the filters.')
                                        : __('All property submissions have been reviewed. Great work!')
                                    }
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#065033] border border-[#065033] rounded-full text-white hover:bg-[#054028] transition-colors mx-auto"
                                    >
                                        <Icons.X className="w-4 h-4" />
                                        <span className="text-sm font-medium font-inter whitespace-nowrap">
                                            {__('Clear Filters')}
                                        </span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-[#EAEAEA]">
                                {properties.data.map((property) => (
                                    <div key={property.id} className="p-6 hover:bg-[#F5F9FA] transition-colors">
                                        <div className="flex items-start space-x-4">
                                            {/* Property Image */}
                                            <div className="flex-shrink-0">
                                                {property.images.length > 0 ? (
                                                    <img
                                                        className="h-20 w-20 rounded-lg object-cover border border-[#EAEAEA]"
                                                        src={`/storage/${property.images[0].chemin_fichier}`}
                                                        alt={property.type_propriete}
                                                    />
                                                ) : (
                                                    <div className="h-20 w-20 rounded-lg bg-gray-100 border border-[#EAEAEA] flex items-center justify-center">
                                                        <Icons.Home className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Property Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-[#000] font-inter">
                                                            {translatePropertyType(property.type_propriete)} - {property.ville}
                                                        </h4>
                                                        <p className="text-sm text-[#6C6C6C] font-inter mt-1">
                                                            {property.adresse_complete}
                                                        </p>
                                                        <div className="flex items-center space-x-4 mt-2 text-sm text-[#6C6C6C] font-inter">
                                                            <span className="font-semibold text-[#000]">{formatPrice(property.prix)}</span>
                                                            <span>•</span>
                                                            <span>{property.superficie_m2} m²</span>
                                                            <span>•</span>
                                                            <span>{property.contacts_souhaites} {__('contacts requested')}</span>
                                                        </div>
                                                        <div className="mt-3 space-y-1">
                                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                                <span className="font-medium text-[#696969]">{__('Owner')}:</span> {property.proprietaire.prenom} {property.proprietaire.nom}
                                                            </p>
                                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                                <span className="font-medium text-[#696969]">{__('Submitted')}:</span> {formatDate(property.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Actions */}
                                                    <div className="flex-shrink-0 ml-4">
                                                        <Link
                                                            href={route('admin.property-review', property.id)}
                                                            className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#065033] border border-[#065033] rounded-full transition-colors hover:bg-[#054028] focus:outline-none focus:bg-[#054028]"
                                                        >
                                                            <Icons.Eye className="w-4 h-4 text-white" />
                                                            <span className="text-white text-sm font-medium font-inter whitespace-nowrap">
                                                                {__('Review Property')}
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {properties.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-[#EAEAEA]">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-[#6C6C6C] font-inter">
                                        {__('Showing')} {properties.from} {__('to')} {properties.to} {__('of')} {properties.total} {__('results')}
                                    </div>
                                    <div className="flex space-x-2">
                                        {properties.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-lg font-inter transition-colors ${
                                                    link.active
                                                        ? 'bg-[#065033] text-white'
                                                        : link.url
                                                        ? 'bg-white text-[#6C6C6C] border border-[#EAEAEA] hover:bg-[#F5F9FA] hover:border-[#CEE8DE]'
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
