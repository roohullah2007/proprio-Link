import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslations } from '@/Utils/translations';
import PublicLayout from '@/Layouts/PublicLayout';

const Icons = {
    Search: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Filter: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 010-5.656m0 5.656l2.879 2.879M9.121 9.121L12 12m-2.879 2.879a3 3 0 105.656 0M12 12a3 3 0 105.656 0M12 12L9.121 9.121" />
        </svg>
    ),
};

export default function PublicSearch({ properties, propertyTypes, cities, filters }) {
    const { __ } = useTranslations();
    
    // Debug logging
    console.log('🏠 PublicSearch Component Loaded');
    console.log('📊 Properties received:', properties);
    console.log('🔢 Properties count:', properties?.data?.length || 0);
    console.log('📝 Property types:', propertyTypes);
    console.log('🏙️ Cities:', cities);
    console.log('🔍 Filters:', filters);
    
    const [searchForm, setSearchForm] = useState({
        search_term: filters.search_term || '',
        property_type: filters.property_type || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        city: filters.city || '',
    });

    const handleInputChange = (field, value) => {
        setSearchForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Debug logging
        console.log('🔍 Public Search initiated');
        console.log('📝 Search form data:', searchForm);
        console.log('🎯 Search term:', searchForm.search_term);
        console.log('🏠 Property type:', searchForm.property_type);
        console.log('💰 Price range:', { min: searchForm.min_price, max: searchForm.max_price });
        console.log('📍 City filter:', searchForm.city);
        
        // Build query parameters
        const params = new URLSearchParams();
        Object.entries(searchForm).forEach(([key, value]) => {
            if (value && value.toString().trim()) {
                params.append(key, value.toString().trim());
            }
        });
        
        console.log('📤 Final search parameters:', Object.fromEntries(params));
        
        // Navigate to search results
        router.get(route('properties.search'), Object.fromEntries(params), {
            onBefore: () => {
                console.log('⏳ Public search request starting...');
            },
            onSuccess: (page) => {
                console.log('✅ Public search completed successfully');
                console.log('📊 Results:', page.props.properties);
            },
            onError: (errors) => {
                console.error('❌ Public search failed:', errors);
            },
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getPropertyTypeLabel = (type) => {
        const typeMap = {
            'APPARTEMENT': __("Apartment"),
            'MAISON': __("House"),
            'VILLA': __("Villa"),
            'STUDIO': __("Studio"),
            'TERRAIN': __("Land"),
            'COMMERCIAL': __("Commercial"),
            'BUREAU': __("Office"),
        };
        return typeMap[type] || type;
    };

    return (
        <PublicLayout>
            <Head title={__("Property Search") + " - Proprio Link"} />
            
            <div className="min-h-screen bg-[#F5F7F9]">
                <div className="py-12 bg-[#F5F7F9] min-h-screen">
                    <div className="w-full px-8">
                        <div className="max-w-[1337px] mx-auto">
                            {/* Search Filters */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                                <div className="p-6">
                                    <form onSubmit={handleSearch} className="space-y-6">
                                        {/* Main Search Row - Responsive */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
                                            {/* Search Input */}
                                            <div className="sm:col-span-2 lg:col-span-4">
                                                <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#1E40AF] transition-colors">
                                                    <div className="flex-none w-4 h-4">
                                                        <Icons.Search className="w-4 h-4 text-[#4E5051]" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={searchForm.search_term}
                                                        onChange={(e) => handleInputChange('search_term', e.target.value)}
                                                        placeholder={__('Search...')}
                                                        className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                                    />
                                                </div>
                                            </div>

                                            {/* City */}
                                            <div className="sm:col-span-1 lg:col-span-2">
                                                <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#1E40AF] transition-colors">
                                                    <input
                                                        type="text"
                                                        value={searchForm.city}
                                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                                        placeholder={__('City')}
                                                        className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                                    />
                                                </div>
                                            </div>

                                            {/* Property Type */}
                                            <div className="sm:col-span-1 lg:col-span-2">
                                                <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#1E40AF] transition-colors">
                                                    <select
                                                        value={searchForm.property_type}
                                                        onChange={(e) => handleInputChange('property_type', e.target.value)}
                                                        className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] capitalize appearance-none focus:outline-none focus:ring-0 focus:border-0"
                                                    >
                                                        <option value="">{__('All types')}</option>
                                                        {Object.entries(propertyTypes).map(([value, label]) => (
                                                            <option key={value} value={value}>{__(label)}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Price Range */}
                                            <div className="sm:col-span-2 lg:col-span-2">
                                                <div className="flex space-x-2">
                                                    <div className="flex items-center px-3 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#1E40AF] transition-colors">
                                                        <input
                                                            type="number"
                                                            value={searchForm.min_price}
                                                            onChange={(e) => handleInputChange('min_price', e.target.value)}
                                                            placeholder={__("Min")}
                                                            className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                    <div className="flex items-center px-3 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#1E40AF] transition-colors">
                                                        <input
                                                            type="number"
                                                            value={searchForm.max_price}
                                                            onChange={(e) => handleInputChange('max_price', e.target.value)}
                                                            placeholder={__("Max")}
                                                            className="w-full border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Search Button */}
                                            <div className="sm:col-span-2 lg:col-span-2">
                                                <button
                                                    type="submit"
                                                    className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center justify-center h-[39px] focus:outline-none focus:ring-0"
                                                >
                                                    <Icons.Search className="w-4 h-4 mr-2" />
                                                    {__('Search')}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Properties Grid - Responsive */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                                {properties.data.map((property) => (
                                    <Link
                                        key={property.id}
                                        href={route('property.public', property.id)}
                                        className="block"
                                    >
                                        {/* Desktop Card */}
                                        <div className="hidden md:block">
                                            <div className="desktop-card bg-white rounded-[12px] overflow-hidden shadow-sm flex flex-col p-[12px] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                                <div className="desktop-card-image-container relative overflow-hidden">
                                                    {/* Property Image */}
                                                    {property.images && property.images.length > 0 ? (
                                                        <img
                                                            src={`/storage/${property.images[0].chemin_fichier}`}
                                                            alt="Property image"
                                                            className="desktop-card-image w-full h-[138px] object-cover rounded-[8px] transition-transform duration-300 hover:scale-110"
                                                        />
                                                    ) : (
                                                        <img
                                                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEzOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTM4IiBmaWxsPSIjZjNmNGY2Ii8+CiAgICA8cmVjdCB4PSIzNiIgeT0iMzQiIHdpZHRoPSIxMDgiIGhlaWdodD0iNzAiIGZpbGw9IiNlNWU3ZWIiLz4KICAgIDxyZWN0IHg9IjQ1IiB5PSI0MiIgd2lkdGg9IjM2IiBoZWlnaHQ9IjI4IiBmaWxsPSIjZDFkNWRiIi8+CiAgICA8cmVjdCB4PSI5OSIgeT0iNDIiIHdpZHRoPSIzNiIgaGVpZ2h0PSIyOCIgZmlsbD0iI2QxZDVkYiIvPgogICAgPHJlY3QgeD0iNDUiIHk9Ijc4IiB3aWR0aD0iOTAiIGhlaWdodD0iMjAiIGZpbGw9IiNkMWQ1ZGIiLz4KICAgIDx0ZXh0IHg9IjkwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+U2ltaWxhciBQcm9wZXJ0eTwvdGV4dD4KICA8L3N2Zz4K"
                                                            alt="Property image"
                                                            className="desktop-card-image w-full h-[138px] object-cover rounded-[8px] transition-transform duration-300 hover:scale-110"
                                                        />
                                                    )}
                                                    
                                                    {/* Status Badge */}
                                                    <div className="desktop-status-badge absolute bottom-3 left-0 bg-[#1E40AF] text-white text-[14px] font-medium py-1 px-3 rounded-r">
                                                        {__('For Sale')}
                                                    </div>
                                                </div>
                                                
                                                <div className="desktop-card-content py-4 px-0">
                                                    <div className="desktop-price-building-row flex justify-between items-center mb-2">
                                                        <p className="desktop-price text-[18px] font-bold text-[#212121]">
                                                            {formatPrice(property.prix)}
                                                        </p>
                                                        <p className="desktop-property-type text-[11px] font-bold text-[#6b7280] text-right">
                                                            {getPropertyTypeLabel(property.type_propriete)}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="desktop-property-details flex flex-wrap gap-2 text-[12px] text-[#374151] mb-2">
                                                        {property.nombre_chambres && (
                                                            <>
                                                                <span className="font-medium">{property.nombre_chambres} {property.nombre_chambres === 1 ? __('Bed') : __('Beds')}</span>
                                                                <span>|</span>
                                                            </>
                                                        )}
                                                        {property.nombre_salles_bain && (
                                                            <>
                                                                <span className="font-medium">{property.nombre_salles_bain} {property.nombre_salles_bain === 1 ? __('Bath') : __('Baths')}</span>
                                                                <span>|</span>
                                                            </>
                                                        )}
                                                        <span className="font-medium">{property.superficie_m2} m²</span>
                                                    </div>
                                                    
                                                    <p className="desktop-address text-[11px] font-bold text-[#212121]">
                                                        {property.ville}, {property.pays}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Card */}
                                        <div className="block md:hidden">
                                            <div className="mobile-card bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
                                                <div className="flex">
                                                    {/* Mobile Image - Left Side */}
                                                    <div className="w-32 h-24 flex-shrink-0 relative overflow-hidden">
                                                        {property.images && property.images.length > 0 ? (
                                                            <img
                                                                src={`/storage/${property.images[0].chemin_fichier}`}
                                                                alt="Property image"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <Icons.Home className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                        
                                                        {/* Mobile Status Badge */}
                                                        <div className="absolute top-1 left-1 bg-[#1E40AF] text-white text-xs font-medium py-0.5 px-2 rounded">
                                                            {__('For Sale')}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Mobile Content - Right Side */}
                                                    <div className="flex-1 p-3">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <p className="text-lg font-bold text-[#212121]">
                                                                {formatPrice(property.prix)}
                                                            </p>
                                                            <p className="text-xs font-semibold text-[#6b7280]">
                                                                {getPropertyTypeLabel(property.type_propriete)}
                                                            </p>
                                                        </div>
                                                        
                                                        <p className="text-xs text-[#212121] font-medium mb-2">
                                                            {property.ville}, {property.pays}
                                                        </p>
                                                        
                                                        <div className="flex flex-wrap gap-1 text-xs text-[#374151]">
                                                            {property.nombre_chambres && (
                                                                <span className="font-medium">{property.nombre_chambres} {property.nombre_chambres === 1 ? __('Bed') : __('Beds')}</span>
                                                            )}
                                                            {property.nombre_chambres && property.nombre_salles_bain && <span>•</span>}
                                                            {property.nombre_salles_bain && (
                                                                <span className="font-medium">{property.nombre_salles_bain} {property.nombre_salles_bain === 1 ? __('Bath') : __('Baths')}</span>
                                                            )}
                                                            {(property.nombre_chambres || property.nombre_salles_bain) && <span>•</span>}
                                                            <span className="font-medium">{property.superficie_m2} m²</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination - Responsive */}
                            {properties.last_page > 1 && (
                                <div className="mt-8 flex justify-center px-4">
                                    <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
                                        {properties.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md whitespace-nowrap ${
                                                    link.active
                                                        ? 'bg-[#1E40AF] text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results */}
                            {properties.data.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-lg">
                                    <Icons.Home className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        {__('No properties found')}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {__('Try adjusting your search criteria')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
