import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

export default function Properties({ properties, filters, propertyTypes }) {
    const { __ } = useTranslations();
    
    // Debug logging
    console.log('🏠 Agent Properties Component Loaded');
    console.log('📊 Properties received:', properties);
    console.log('🔍 Filters received:', filters);
    console.log('📋 Property types received:', propertyTypes);
    
    // Safety check for properties data
    if (!properties || !properties.data) {
        console.error('❌ Properties data is missing or invalid');
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center px-0 gap-[9px] w-full">
                        <div className="flex-none order-0 flex-grow-0">
                            <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                                {__('Search Properties')}
                            </h1>
                        </div>
                    </div>
                }
            >
                <Head title={__("Search Properties") + " - Propio"} />
                <div className="py-8">
                    <div className="w-full px-8">
                        <div className="max-w-[1337px] mx-auto">
                            <div className="text-center py-12">
                                <p className="text-red-500">Error loading properties data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
    
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [searchForm, setSearchForm] = useState({
        search: filters.search || '',
        type_propriete: filters.type_propriete || '',
        prix_min: filters.prix_min || '',
        prix_max: filters.prix_max || '',
        superficie_min: filters.superficie_min || '',
        superficie_max: filters.superficie_max || '',
        ville: filters.ville || '',
        pays: filters.pays || '',
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Debug logging
        console.log('🔍 Agent Properties Search initiated');
        console.log('📝 Search form data:', searchForm);
        console.log('🎯 Search query:', searchForm.search);
        console.log('🏠 Property type filter:', searchForm.type_propriete);
        console.log('💰 Price range:', { min: searchForm.prix_min, max: searchForm.prix_max });
        console.log('📍 Location filters:', { city: searchForm.ville, country: searchForm.pays });
        console.log('📐 Surface filters:', { min: searchForm.superficie_min, max: searchForm.superficie_max });
        console.log('🔄 Sort options:', { by: searchForm.sort_by, order: searchForm.sort_order });
        
        router.get(route('agent.properties'), searchForm, {
            preserveState: true,
            replace: true,
            onBefore: () => {
                console.log('⏳ Search request starting...');
            },
            onSuccess: (page) => {
                console.log('✅ Search completed successfully');
                console.log('📊 Results:', page.props.properties);
            },
            onError: (errors) => {
                console.error('❌ Search failed:', errors);
            },
        });
    };

    const handleInputChange = (field, value) => {
        setSearchForm(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        const clearedForm = {
            search: '',
            type_propriete: '',
            prix_min: '',
            prix_max: '',
            superficie_min: '',
            superficie_max: '',
            ville: '',
            pays: '',
            sort_by: 'created_at',
            sort_order: 'desc',
        };
        setSearchForm(clearedForm);
        router.get(route('agent.properties'), clearedForm);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Check if any advanced filters are active
    const hasAdvancedFilters = searchForm.superficie_min || searchForm.superficie_max || searchForm.pays;

    return (
        <AuthenticatedLayout
            header={
                <div className="hidden md:flex md:justify-between md:items-center px-0 gap-4 w-full py-2">
                    {/* Left side - Properties count */}
                    <div className="flex-1">
                        <span className="block font-inter font-medium text-[14px] leading-[19px] text-[#000] capitalize">
                            {properties.total} {__('properties found matching your buying preferences')}
                        </span>
                    </div>
                    
                    {/* Right side - Sort By button */}
                    <div className="flex items-center gap-[14px] flex-none">
                        {/* Sort By */}
                        <div className="relative">
                            <select
                                value={`${searchForm.sort_by}-${searchForm.sort_order}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] = e.target.value.split('-');
                                    const newForm = { ...searchForm, sort_by: sortBy, sort_order: sortOrder };
                                    setSearchForm(newForm);
                                    router.get(route('agent.properties'), newForm, {
                                        preserveState: true,
                                        replace: true,
                                    });
                                }}
                                className="appearance-none bg-[#065033] border border-[#065033] text-white px-4 py-2 pr-8 rounded-full text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065033] focus:ring-opacity-50 hover:bg-[#054028] transition-colors min-w-[160px]"
                            >
                                <option value="created_at-desc">{__('Newest First')}</option>
                                <option value="created_at-asc">{__('Oldest First')}</option>
                                <option value="prix-asc">{__('Price: Low to High')}</option>
                                <option value="prix-desc">{__('Price: High to Low')}</option>
                                <option value="superficie_m2-desc">{__('Largest First')}</option>
                                <option value="superficie_m2-asc">{__('Smallest First')}</option>
                                <option value="ville-asc">{__('City A-Z')}</option>
                                <option value="ville-desc">{__('City Z-A')}</option>
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={__('Property Search')} />

            <div className="py-6 sm:py-8 md:py-12 bg-[#F5F7F9] min-h-screen">
                <div className="w-full px-4 sm:px-6 md:px-8">
                    <div className="max-w-[1337px] mx-auto">
                        
                        {/* Mobile Properties Count & Sort - Only visible on mobile */}
                        <div className="block md:hidden mb-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex flex-col space-y-3">
                                    {/* Properties count */}
                                    <div className="text-center">
                                        <span className="font-inter font-medium text-[14px] leading-[19px] text-[#000]">
                                            {properties.total} {__('properties found matching your buying preferences')}
                                        </span>
                                    </div>
                                    
                                    {/* Sort dropdown */}
                                    <div className="relative">
                                        <select
                                            value={`${searchForm.sort_by}-${searchForm.sort_order}`}
                                            onChange={(e) => {
                                                const [sortBy, sortOrder] = e.target.value.split('-');
                                                const newForm = { ...searchForm, sort_by: sortBy, sort_order: sortOrder };
                                                setSearchForm(newForm);
                                                router.get(route('agent.properties'), newForm, {
                                                    preserveState: true,
                                                    replace: true,
                                                });
                                            }}
                                            className="appearance-none bg-[#065033] border border-[#065033] text-white px-4 py-3 pr-10 rounded-full text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065033] focus:ring-opacity-50 hover:bg-[#054028] transition-colors w-full"
                                        >
                                            <option value="created_at-desc">{__('Newest First')}</option>
                                            <option value="created_at-asc">{__('Oldest First')}</option>
                                            <option value="prix-asc">{__('Price: Low to High')}</option>
                                            <option value="prix-desc">{__('Price: High to Low')}</option>
                                            <option value="superficie_m2-desc">{__('Largest First')}</option>
                                            <option value="superficie_m2-asc">{__('Smallest First')}</option>
                                            <option value="ville-asc">{__('City A-Z')}</option>
                                            <option value="ville-desc">{__('City Z-A')}</option>
                                        </select>
                                        {/* Custom dropdown arrow */}
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Improved Search Filters */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-4 sm:mb-6 md:mb-8">
                            <div className="p-3 sm:p-4 md:p-6">
                            <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
                                {/* Main Search Row - Responsive */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
                                    {/* Search Input */}
                                    <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                                        <div className="flex items-center px-3 sm:px-4 gap-[8px] sm:gap-[10px] w-full h-[36px] sm:h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                            <div className="flex-none w-3 h-3 sm:w-4 sm:h-4">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#4E5051]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={searchForm.search}
                                                onChange={(e) => handleInputChange('search', e.target.value)}
                                                placeholder={__('Search...')}
                                                className="flex-1 border-0 outline-none bg-transparent text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                            />
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                                        <div className="flex items-center px-3 sm:px-4 gap-[8px] sm:gap-[10px] w-full h-[36px] sm:h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                            <input
                                                type="text"
                                                value={searchForm.ville}
                                                onChange={(e) => handleInputChange('ville', e.target.value)}
                                                placeholder={__('City')}
                                                className="w-full border-0 outline-none bg-transparent text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                            />
                                        </div>
                                    </div>

                                    {/* Property Type */}
                                    <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                                        <div className="flex items-center px-3 sm:px-4 gap-[8px] sm:gap-[10px] w-full h-[36px] sm:h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                            <select
                                                value={searchForm.type_propriete}
                                                onChange={(e) => handleInputChange('type_propriete', e.target.value)}
                                                className="w-full border-0 outline-none bg-transparent text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] font-normal text-[#5A5A5A] capitalize appearance-none focus:outline-none focus:ring-0 focus:border-0"
                                            >
                                                <option value="">{__('All types')}</option>
                                                {Object.entries(propertyTypes).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                                        <div className="flex space-x-2">
                                            <div className="flex items-center px-2 sm:px-3 gap-[8px] sm:gap-[10px] w-full h-[36px] sm:h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                                <input
                                                    type="number"
                                                    value={searchForm.prix_min}
                                                    onChange={(e) => handleInputChange('prix_min', e.target.value)}
                                                    placeholder="Min"
                                                    className="w-full border-0 outline-none bg-transparent text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                                />
                                            </div>
                                            <div className="flex items-center px-2 sm:px-3 gap-[8px] sm:gap-[10px] w-full h-[36px] sm:h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                                <input
                                                    type="number"
                                                    value={searchForm.prix_max}
                                                    onChange={(e) => handleInputChange('prix_max', e.target.value)}
                                                    placeholder="Max"
                                                    className="w-full border-0 outline-none bg-transparent text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Search Button */}
                                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-[#065033] hover:bg-[#054028] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors duration-200 flex items-center justify-center h-[36px] sm:h-[39px] focus:outline-none focus:ring-0 text-sm sm:text-base"
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            {__('Search')}
                                        </button>
                                    </div>
                                </div>

                                {/* Advanced Filters Toggle */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-200 space-y-2 sm:space-y-0">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 justify-center sm:justify-start"
                                    >
                                        <svg 
                                            className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`}
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        <span className="text-sm sm:text-base">
                                            {showAdvancedFilters ? __('Hide advanced filters') : __('Show advanced filters')}
                                        </span>
                                        {hasAdvancedFilters && !showAdvancedFilters && (
                                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                Active
                                            </span>
                                        )}
                                    </button>

                                    {(searchForm.search || searchForm.ville || searchForm.type_propriete || searchForm.prix_min || searchForm.prix_max || hasAdvancedFilters) && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200 flex items-center justify-center sm:justify-start text-sm sm:text-base"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            {__('Clear all')}
                                        </button>
                                    )}
                                </div>

                                {/* Advanced Filters - Collapsible */}
                                <div className={`transition-all duration-300 overflow-hidden ${showAdvancedFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                                        {/* Surface Range */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="flex items-center px-3 sm:px-4 gap-[8px] sm:gap-[10px] w-full h-[36px] sm:h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                                <input
                                                    type="number"
                                                    value={searchForm.superficie_min}
                                                    onChange={(e) => handleInputChange('superficie_min', e.target.value)}
                                                    placeholder={__('Minimum surface (m²)')}
                                                    className="w-full border-0 outline-none bg-transparent text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                                />
                                            </div>
                                            <div className="flex items-center px-3 sm:px-4 gap-[8px] sm:gap-[10px] w-full h-[36px] sm:h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                                <input
                                                    type="number"
                                                    value={searchForm.superficie_max}
                                                    onChange={(e) => handleInputChange('superficie_max', e.target.value)}
                                                    placeholder={__('Maximum surface (m²)')}
                                                    className="w-full border-0 outline-none bg-transparent text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                                />
                                            </div>
                                        </div>

                                        {/* Country only */}
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-3 sm:gap-4">
                                            <div className="flex items-center px-3 sm:px-4 gap-[8px] sm:gap-[10px] w-full h-[36px] sm:h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                                <input
                                                    type="text"
                                                    value={searchForm.pays}
                                                    onChange={(e) => handleInputChange('pays', e.target.value)}
                                                    placeholder={__('Country')}
                                                    className="w-full border-0 outline-none bg-transparent text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] capitalize focus:outline-none focus:ring-0 focus:border-0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Properties Grid - Responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                        {properties.data.map((property) => (
                            <Link
                                key={property.id}
                                href={route('agent.property', property.id)}
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
                                                    onError={(e) => {
                                                        if (!e.target.dataset.fallbackAttempted) {
                                                            e.target.dataset.fallbackAttempted = 'true';
                                                            e.target.src = `/images/${property.images[0].chemin_fichier}`;
                                                        } else {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEzOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTM4IiBmaWxsPSIjZjNmNGY2Ii8+CiAgICA8cmVjdCB4PSIzNiIgeT0iMzQiIHdpZHRoPSIxMDgiIGhlaWdodD0iNzAiIGZpbGw9IiNlNWU3ZWIiLz4KICAgIDxyZWN0IHg9IjQ1IiB5PSI0MiIgd2lkdGg9IjM2IiBoZWlnaHQ9IjI4IiBmaWxsPSIjZDFkNWRiIi8+CiAgICA8cmVjdCB4PSI5OSIgeT0iNDIiIHdpZHRoPSIzNiIgaGVpZ2h0PSIyOCIgZmlsbD0iI2QxZDVkYiIvPgogICAgPHJlY3QgeD0iNDUiIHk9Ijc4IiB3aWR0aD0iOTAiIGhlaWdodD0iMjAiIGZpbGw9IiNkMWQ1ZGIiLz4KICAgIDx0ZXh0IHg9IjkwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+U2ltaWxhciBQcm9wZXJ0eTwvdGV4dD4KICA8L3N2Zz4K';
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEzOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTM4IiBmaWxsPSIjZjNmNGY2Ii8+CiAgICA8cmVjdCB4PSIzNiIgeT0iMzQiIHdpZHRoPSIxMDgiIGhlaWdodD0iNzAiIGZpbGw9IiNlNWU3ZWIiLz4KICAgIDxyZWN0IHg9IjQ1IiB5PSI0MiIgd2lkdGg9IjM2IiBoZWlnaHQ9IjI4IiBmaWxsPSIjZDFkNWRiIi8+CiAgICA8cmVjdCB4PSI5OSIgeT0iNDIiIHdpZHRoPSIzNiIgaGVpZ2h0PSIyOCIgZmlsbD0iI2QxZDVkYiIvPgogICAgPHJlY3QgeD0iNDUiIHk9Ijc4IiB3aWR0aD0iOTAiIGhlaWdodD0iMjAiIGZpbGw9IiNkMWQ1ZGIiLz4KICAgIDx0ZXh0IHg9IjkwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+U2ltaWxhciBQcm9wZXJ0eTwvdGV4dD4KICA8L3N2Zz4K"
                                                    alt="Property image"
                                                    className="desktop-card-image w-full h-[138px] object-cover rounded-[8px] transition-transform duration-300 hover:scale-110"
                                                />
                                            )}
                                            
                                            {/* Heart Button */}
                                            <button className="desktop-heart-button absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 transition-all duration-200 cursor-pointer hover:bg-gray-50 hover:scale-110">
                                                <svg 
                                                    viewBox="0 0 24 24" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    strokeWidth="2" 
                                                    className="desktop-heart-icon w-4 h-4"
                                                >
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                </svg>
                                            </button>

                                            {/* Status Badge */}
                                            <div className="desktop-status-badge absolute bottom-3 left-0 bg-[#059669] text-white text-[14px] font-medium py-1 px-3 rounded-r">
                                                {property.is_purchased ? __('Purchased') : __('For Sale')}
                                            </div>
                                        </div>
                                        
                                        <div className="desktop-card-content py-4 px-0">
                                            <div className="desktop-price-building-row flex justify-between items-center mb-2">
                                                <p className="desktop-price text-[18px] font-bold text-[#212121]">
                                                    {formatPrice(property.prix)}
                                                </p>
                                                <p className="desktop-property-type text-[11px] font-bold text-[#6b7280] text-right">
                                                    {propertyTypes[property.type_propriete] || property.type_propriete}
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
                                                        onError={(e) => {
                                                            if (!e.target.dataset.fallbackAttempted) {
                                                                e.target.dataset.fallbackAttempted = 'true';
                                                                e.target.src = `/images/${property.images[0].chemin_fichier}`;
                                                            } else {
                                                                const placeholder = document.createElement('div');
                                                                placeholder.className = 'w-full h-full bg-gray-200 flex items-center justify-center';
                                                                placeholder.innerHTML = '<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>';
                                                                e.target.parentNode.replaceChild(placeholder, e.target);
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                    </div>
                                                )}
                                                
                                                {/* Mobile Status Badge */}
                                                <div className="absolute top-1 left-1 bg-[#059669] text-white text-xs font-medium py-0.5 px-2 rounded">
                                                    {property.is_purchased ? __('Purchased') : __('For Sale')}
                                                </div>
                                                
                                                {/* Mobile Heart Button */}
                                                <button className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 transition-all duration-200">
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            
                                            {/* Mobile Content - Right Side */}
                                            <div className="flex-1 p-3">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-lg font-bold text-[#212121]">
                                                        {formatPrice(property.prix)}
                                                    </p>
                                                    <p className="text-xs font-semibold text-[#6b7280]">
                                                        {propertyTypes[property.type_propriete] || property.type_propriete}
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

                    {/* Empty State */}
                    {properties.data.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                {__('Aucune propriété trouvée')}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {__('Essayez de modifier vos critères de recherche.')}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {properties.links && properties.links.length > 3 && (
                        <div className="mt-6 sm:mt-8 flex justify-center">
                            <nav className="flex space-x-1 sm:space-x-2">
                                {properties.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
        </div>
        </AuthenticatedLayout>
    );
}