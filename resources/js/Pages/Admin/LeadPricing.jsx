import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';

// Icons
const Icons = {
    DollarSign: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    MapPin: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Layers: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    ),
    Settings: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Calculator: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    ),
    Plus: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    ),
    Pencil: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    ),
    Trash: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    Check: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    X: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Save: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
    ),
};

export default function LeadPricing({ auth, cities, tiers, settings, pricingMatrix }) {
    const { __ } = useTranslations();
    const [activeTab, setActiveTab] = useState('cities');
    const [showCityModal, setShowCityModal] = useState(false);
    const [showTierModal, setShowTierModal] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [editingTier, setEditingTier] = useState(null);

    // Calculator state
    const [calcCity, setCalcCity] = useState('');
    const [calcValue, setCalcValue] = useState('');
    const [calcResult, setCalcResult] = useState(null);
    const [calculating, setCalculating] = useState(false);

    // City form
    const cityForm = useForm({
        city_name: '',
        country: 'France',
        base_price: 25.00,
        is_major_city: true,
        is_active: true,
    });

    // Tier form
    const tierForm = useForm({
        tier_name: '',
        min_property_value: 0,
        max_property_value: '',
        price_adjustment: 0,
        is_flat_rate: false,
        flat_rate_price: '',
        is_active: true,
    });

    // Settings form
    const settingsForm = useForm({
        default_non_major_city_price: settings.default_non_major_city_price || 15,
        default_major_city_price: settings.default_major_city_price || 25,
        pricing_enabled: settings.pricing_enabled !== false,
    });

    const tabs = [
        { id: 'cities', label: __('Cities'), icon: Icons.MapPin },
        { id: 'tiers', label: __('Pricing Tiers'), icon: Icons.Layers },
        { id: 'settings', label: __('Settings'), icon: Icons.Settings },
        { id: 'calculator', label: __('Price Calculator'), icon: Icons.Calculator },
        { id: 'matrix', label: __('Pricing Matrix'), icon: Icons.DollarSign },
    ];

    // City CRUD handlers
    const openAddCityModal = () => {
        setEditingCity(null);
        cityForm.reset();
        cityForm.setData({
            city_name: '',
            country: 'France',
            base_price: 25.00,
            is_major_city: true,
            is_active: true,
        });
        setShowCityModal(true);
    };

    const openEditCityModal = (city) => {
        setEditingCity(city);
        cityForm.setData({
            city_name: city.city_name,
            country: city.country,
            base_price: parseFloat(city.base_price),
            is_major_city: city.is_major_city,
            is_active: city.is_active,
        });
        setShowCityModal(true);
    };

    const handleSaveCity = (e) => {
        e.preventDefault();
        if (editingCity) {
            cityForm.put(`/admin/pricing/cities/${editingCity.id}`, {
                onSuccess: () => {
                    setShowCityModal(false);
                    setEditingCity(null);
                },
            });
        } else {
            cityForm.post('/admin/pricing/cities', {
                onSuccess: () => {
                    setShowCityModal(false);
                },
            });
        }
    };

    const handleDeleteCity = (city) => {
        if (confirm(__('Are you sure you want to delete this city?'))) {
            router.delete(`/admin/pricing/cities/${city.id}`);
        }
    };

    const handleAddDefaultCities = () => {
        if (confirm(__('This will add the 10 major French cities with default pricing. Continue?'))) {
            router.post('/admin/pricing/cities/add-defaults');
        }
    };

    // Tier CRUD handlers
    const openEditTierModal = (tier) => {
        setEditingTier(tier);
        tierForm.setData({
            tier_name: tier.tier_name,
            min_property_value: parseFloat(tier.min_property_value),
            max_property_value: tier.max_property_value ? parseFloat(tier.max_property_value) : '',
            price_adjustment: parseFloat(tier.price_adjustment),
            is_flat_rate: tier.is_flat_rate,
            flat_rate_price: tier.flat_rate_price ? parseFloat(tier.flat_rate_price) : '',
            is_active: tier.is_active,
        });
        setShowTierModal(true);
    };

    const handleSaveTier = (e) => {
        e.preventDefault();
        tierForm.put(`/admin/pricing/tiers/${editingTier.id}`, {
            onSuccess: () => {
                setShowTierModal(false);
                setEditingTier(null);
            },
        });
    };

    // Settings handler
    const handleSaveSettings = (e) => {
        e.preventDefault();
        settingsForm.put('/admin/pricing/settings');
    };

    // Calculator handler
    const handleCalculate = async () => {
        if (!calcCity || !calcValue) {
            alert(__('Please enter both city and property value'));
            return;
        }

        setCalculating(true);
        try {
            const response = await fetch('/admin/pricing/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    city: calcCity,
                    property_value: parseFloat(calcValue),
                    country: 'France',
                }),
            });
            const data = await response.json();
            if (data.success) {
                setCalcResult(data);
            }
        } catch (error) {
            console.error('Calculation error:', error);
        } finally {
            setCalculating(false);
        }
    };

    // Format currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
    };

    const formatPropertyValue = (value) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Lead Pricing Management')}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={__("Lead Pricing") + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-2 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-2 sm:p-6">
                                <nav className="space-y-2">
                                    {tabs.map((tab) => {
                                        const IconComponent = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors font-inter ${
                                                    activeTab === tab.id
                                                        ? 'bg-[#F5F9FA] border border-[#CEE8DE] text-[#065033]'
                                                        : 'text-[#6C6C6C] hover:bg-[#F5F9FA] hover:text-[#065033]'
                                                }`}
                                            >
                                                <IconComponent className="w-5 h-5 mr-3" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-4">
                            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-2 sm:p-8 shadow-sm">
                                {/* Cities Tab */}
                                {activeTab === 'cities' && (
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-[#EAEAEA] pb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                    {__('City Pricing Configuration')}
                                                </h3>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {__('Configure base prices for specific cities. Cities not listed will use the default price.')}
                                                </p>
                                            </div>
                                            <div className="flex flex-col xs:flex-row gap-3">
                                                <button
                                                    onClick={handleAddDefaultCities}
                                                    className="flex items-center justify-center px-4 py-2 text-sm bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg text-[#6C6C6C] hover:text-[#065033] hover:border-[#065033] transition-colors"
                                                >
                                                    {__('Add Default Cities')}
                                                </button>
                                                <button
                                                    onClick={openAddCityModal}
                                                    className="flex items-center justify-center px-4 py-2 text-sm bg-[#065033] text-white rounded-lg hover:bg-[#054028] transition-colors"
                                                >
                                                    <Icons.Plus className="w-4 h-4 mr-2" />
                                                    {__('Add City')}
                                                </button>
                                            </div>
                                        </div>

                                        {cities.length === 0 ? (
                                            <div className="text-center py-12 border-2 border-dashed border-[#EAEAEA] rounded-lg">
                                                <Icons.MapPin className="w-12 h-12 mx-auto text-[#6C6C6C] mb-4" />
                                                <p className="text-[#6C6C6C] mb-4">{__('No cities configured yet.')}</p>
                                                <button
                                                    onClick={handleAddDefaultCities}
                                                    className="px-4 py-2 bg-[#065033] text-white rounded-lg hover:bg-[#054028]"
                                                >
                                                    {__('Add Default French Cities')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
                                                <table className="w-full min-w-[600px]">
                                                    <thead>
                                                        <tr className="border-b border-[#EAEAEA]">
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-[#696969] whitespace-nowrap">{__('City')}</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-[#696969] whitespace-nowrap">{__('Country')}</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-[#696969] whitespace-nowrap">{__('Base Price')}</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-[#696969] whitespace-nowrap">{__('Type')}</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-[#696969] whitespace-nowrap">{__('Status')}</th>
                                                            <th className="text-right py-3 px-4 text-sm font-medium text-[#696969] whitespace-nowrap">{__('Actions')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cities.map((city) => (
                                                            <tr key={city.id} className="border-b border-[#EAEAEA] hover:bg-[#F5F9FA]">
                                                                <td className="py-3 px-4 font-medium text-[#000]">{city.city_name}</td>
                                                                <td className="py-3 px-4 text-[#6C6C6C]">{city.country}</td>
                                                                <td className="py-3 px-4 text-[#065033] font-medium">{formatPrice(city.base_price)}</td>
                                                                <td className="py-3 px-4">
                                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                                        city.is_major_city
                                                                            ? 'bg-blue-100 text-blue-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {city.is_major_city ? __('Major City') : __('City')}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                                        city.is_active
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {city.is_active ? __('Active') : __('Inactive')}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    <button
                                                                        onClick={() => openEditCityModal(city)}
                                                                        className="p-2 text-[#6C6C6C] hover:text-[#065033] hover:bg-[#F5F9FA] rounded-lg"
                                                                    >
                                                                        <Icons.Pencil className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteCity(city)}
                                                                        className="p-2 text-[#6C6C6C] hover:text-red-600 hover:bg-red-50 rounded-lg ml-1"
                                                                    >
                                                                        <Icons.Trash className="w-4 h-4" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Tiers Tab */}
                                {activeTab === 'tiers' && (
                                    <div className="space-y-6">
                                        <div className="border-b border-[#EAEAEA] pb-4">
                                            <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                {__('Property Value Pricing Tiers')}
                                            </h3>
                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                {__('Configure pricing adjustments based on property value ranges.')}
                                            </p>
                                        </div>

                                        <div className="grid gap-4">
                                            {tiers.map((tier) => (
                                                <div
                                                    key={tier.id}
                                                    className={`p-4 border rounded-lg ${tier.is_active ? 'border-[#EAEAEA] bg-white' : 'border-red-200 bg-red-50'}`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className="font-semibold text-[#000]">{tier.tier_name}</h4>
                                                                <span className="px-2 py-1 text-xs bg-[#F5F9FA] text-[#6C6C6C] rounded">
                                                                    {tier.tier_key}
                                                                </span>
                                                                {!tier.is_active && (
                                                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                                                        {__('Inactive')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                <div>
                                                                    <span className="text-[#6C6C6C]">{__('Value Range')}:</span>
                                                                    <p className="font-medium text-[#000]">
                                                                        {formatPropertyValue(tier.min_property_value)} - {tier.max_property_value ? formatPropertyValue(tier.max_property_value) : '∞'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[#6C6C6C]">{__('Pricing Mode')}:</span>
                                                                    <p className="font-medium text-[#000]">
                                                                        {tier.is_flat_rate ? __('Flat Rate') : __('Adjustment')}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[#6C6C6C]">
                                                                        {tier.is_flat_rate ? __('Flat Price') : __('Adjustment')}:
                                                                    </span>
                                                                    <p className="font-medium text-[#065033]">
                                                                        {tier.is_flat_rate
                                                                            ? formatPrice(tier.flat_rate_price)
                                                                            : `+${formatPrice(tier.price_adjustment)}`
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[#6C6C6C]">{__('Display Order')}:</span>
                                                                    <p className="font-medium text-[#000]">{tier.display_order}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => openEditTierModal(tier)}
                                                            className="p-2 text-[#6C6C6C] hover:text-[#065033] hover:bg-[#F5F9FA] rounded-lg"
                                                        >
                                                            <Icons.Pencil className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Settings Tab */}
                                {activeTab === 'settings' && (
                                    <form onSubmit={handleSaveSettings} className="space-y-6">
                                        <div className="border-b border-[#EAEAEA] pb-4">
                                            <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                {__('Default Pricing Settings')}
                                            </h3>
                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                {__('Configure default prices for cities not in the list.')}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-[#696969] mb-2">
                                                    {__('Default Price (Non-Major Cities)')}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="1"
                                                        value={settingsForm.data.default_non_major_city_price}
                                                        onChange={(e) => settingsForm.setData('default_non_major_city_price', parseFloat(e.target.value))}
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                                    />
                                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6C6C6C]">€</span>
                                                </div>
                                                <p className="text-xs text-[#6C6C6C] mt-1">
                                                    {__('Applied to properties in cities not in the configured list')}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#696969] mb-2">
                                                    {__('Default Major City Price')}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="1"
                                                        value={settingsForm.data.default_major_city_price}
                                                        onChange={(e) => settingsForm.setData('default_major_city_price', parseFloat(e.target.value))}
                                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                                    />
                                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6C6C6C]">€</span>
                                                </div>
                                                <p className="text-xs text-[#6C6C6C] mt-1">
                                                    {__('Default base price when adding new major cities')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-[#F5F9FA] rounded-lg">
                                            <input
                                                type="checkbox"
                                                id="pricing_enabled"
                                                checked={settingsForm.data.pricing_enabled}
                                                onChange={(e) => settingsForm.setData('pricing_enabled', e.target.checked)}
                                                className="w-4 h-4 text-[#065033] border-gray-300 rounded focus:ring-[#065033]"
                                            />
                                            <label htmlFor="pricing_enabled" className="text-sm font-medium text-[#696969]">
                                                {__('Enable Dynamic Pricing')}
                                            </label>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={settingsForm.processing}
                                                className="flex items-center px-6 py-3 bg-[#065033] text-white rounded-lg hover:bg-[#054028] disabled:opacity-50"
                                            >
                                                <Icons.Save className="w-5 h-5 mr-2" />
                                                {settingsForm.processing ? __('Saving...') : __('Save Settings')}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Calculator Tab */}
                                {activeTab === 'calculator' && (
                                    <div className="space-y-6">
                                        <div className="border-b border-[#EAEAEA] pb-4">
                                            <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                {__('Price Calculator')}
                                            </h3>
                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                {__('Test pricing for any city and property value combination.')}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-[#696969] mb-2">
                                                    {__('City Name')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={calcCity}
                                                    onChange={(e) => setCalcCity(e.target.value)}
                                                    placeholder="e.g., Paris, Lyon, Marseille..."
                                                    className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#696969] mb-2">
                                                    {__('Property Value')} (€)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={calcValue}
                                                    onChange={(e) => setCalcValue(e.target.value)}
                                                    placeholder="e.g., 500000"
                                                    className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCalculate}
                                            disabled={calculating}
                                            className="flex items-center px-6 py-3 bg-[#065033] text-white rounded-lg hover:bg-[#054028] disabled:opacity-50"
                                        >
                                            <Icons.Calculator className="w-5 h-5 mr-2" />
                                            {calculating ? __('Calculating...') : __('Calculate Price')}
                                        </button>

                                        {calcResult && (
                                            <div className="mt-6 p-6 bg-[#F5F9FA] rounded-lg border border-[#CEE8DE]">
                                                <h4 className="font-semibold text-[#065033] mb-4">{__('Pricing Result')}</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <span className="text-sm text-[#6C6C6C]">{__('Final Price')}</span>
                                                        <p className="text-2xl font-bold text-[#065033]">{calcResult.formatted_price}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-[#6C6C6C]">{__('Base Price')}</span>
                                                        <p className="text-lg font-medium text-[#000]">{formatPrice(calcResult.pricing.base_price)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-[#6C6C6C]">{__('Tier')}</span>
                                                        <p className="text-lg font-medium text-[#000]">{calcResult.pricing.tier_name}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-[#6C6C6C]">{__('City Matched')}</span>
                                                        <p className="text-lg font-medium text-[#000]">
                                                            {calcResult.pricing.city_matched ? (
                                                                <span className="text-green-600">{__('Yes')}</span>
                                                            ) : (
                                                                <span className="text-orange-600">{__('No (using default)')}</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-[#6C6C6C]">{__('Major City')}</span>
                                                        <p className="text-lg font-medium text-[#000]">
                                                            {calcResult.pricing.is_major_city ? __('Yes') : __('No')}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-[#6C6C6C]">{__('Flat Rate')}</span>
                                                        <p className="text-lg font-medium text-[#000]">
                                                            {calcResult.pricing.is_flat_rate ? __('Yes') : __('No')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Matrix Tab */}
                                {activeTab === 'matrix' && (
                                    <div className="space-y-6">
                                        <div className="border-b border-[#EAEAEA] pb-4">
                                            <h3 className="text-lg font-semibold text-[#696969] font-inter mb-2">
                                                {__('Pricing Matrix')}
                                            </h3>
                                            <p className="text-sm text-[#6C6C6C] font-inter">
                                                {__('Overview of all pricing combinations by city and property value tier.')}
                                            </p>
                                        </div>

                                        <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
                                            <table className="w-full text-sm min-w-[800px]">
                                                <thead>
                                                    <tr className="border-b border-[#EAEAEA] bg-[#F5F9FA]">
                                                        <th className="text-left py-3 px-4 font-medium text-[#696969] whitespace-nowrap">{__('City')}</th>
                                                        <th className="text-left py-3 px-4 font-medium text-[#696969] whitespace-nowrap">{__('Base')}</th>
                                                        {pricingMatrix.tiers.map((tier) => (
                                                            <th key={tier.key} className="text-left py-3 px-4 font-medium text-[#696969] whitespace-nowrap">
                                                                <span>{tier.name}</span>
                                                                <span className="text-xs font-normal ml-1">({tier.value_range})</span>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pricingMatrix.matrix.map((row, index) => (
                                                        <tr key={index} className="border-b border-[#EAEAEA] hover:bg-[#F5F9FA]">
                                                            <td className="py-3 px-4 whitespace-nowrap">
                                                                <div className="font-medium text-[#000]">{row.city}</div>
                                                                {row.is_major && (
                                                                    <span className="text-xs text-blue-600">{__('Major City')}</span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-4 text-[#065033] font-medium whitespace-nowrap">
                                                                {formatPrice(row.base_price)}
                                                            </td>
                                                            {pricingMatrix.tiers.map((tier) => (
                                                                <td key={tier.key} className="py-3 px-4 text-[#065033] font-medium whitespace-nowrap">
                                                                    {formatPrice(row.tiers[tier.key])}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* City Modal */}
            {showCityModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-[#000]">
                                {editingCity ? __('Edit City') : __('Add City')}
                            </h3>
                            <button onClick={() => setShowCityModal(false)} className="text-[#6C6C6C] hover:text-[#000]">
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCity} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#696969] mb-2">{__('City Name')}</label>
                                <input
                                    type="text"
                                    value={cityForm.data.city_name}
                                    onChange={(e) => cityForm.setData('city_name', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                    required
                                />
                                {cityForm.errors.city_name && (
                                    <p className="text-red-500 text-sm mt-1">{cityForm.errors.city_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#696969] mb-2">{__('Country')}</label>
                                <input
                                    type="text"
                                    value={cityForm.data.country}
                                    onChange={(e) => cityForm.setData('country', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#696969] mb-2">{__('Base Price')} (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={cityForm.data.base_price}
                                    onChange={(e) => cityForm.setData('base_price', parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={cityForm.data.is_major_city}
                                        onChange={(e) => cityForm.setData('is_major_city', e.target.checked)}
                                        className="w-4 h-4 text-[#065033] border-gray-300 rounded focus:ring-[#065033] mr-2"
                                    />
                                    <span className="text-sm text-[#696969]">{__('Major City')}</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={cityForm.data.is_active}
                                        onChange={(e) => cityForm.setData('is_active', e.target.checked)}
                                        className="w-4 h-4 text-[#065033] border-gray-300 rounded focus:ring-[#065033] mr-2"
                                    />
                                    <span className="text-sm text-[#696969]">{__('Active')}</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCityModal(false)}
                                    className="px-4 py-2 border border-[#EAEAEA] rounded-lg text-[#6C6C6C] hover:bg-[#F5F9FA]"
                                >
                                    {__('Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={cityForm.processing}
                                    className="px-4 py-2 bg-[#065033] text-white rounded-lg hover:bg-[#054028] disabled:opacity-50"
                                >
                                    {cityForm.processing ? __('Saving...') : __('Save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tier Modal */}
            {showTierModal && editingTier && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-[#000]">{__('Edit Tier')}: {editingTier.tier_name}</h3>
                            <button onClick={() => setShowTierModal(false)} className="text-[#6C6C6C] hover:text-[#000]">
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTier} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#696969] mb-2">{__('Tier Name')}</label>
                                <input
                                    type="text"
                                    value={tierForm.data.tier_name}
                                    onChange={(e) => tierForm.setData('tier_name', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#696969] mb-2">{__('Min Value')} (€)</label>
                                    <input
                                        type="number"
                                        value={tierForm.data.min_property_value}
                                        onChange={(e) => tierForm.setData('min_property_value', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#696969] mb-2">{__('Max Value')} (€)</label>
                                    <input
                                        type="number"
                                        value={tierForm.data.max_property_value}
                                        onChange={(e) => tierForm.setData('max_property_value', e.target.value ? parseFloat(e.target.value) : '')}
                                        placeholder={__('No limit')}
                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-[#F5F9FA] rounded-lg">
                                <input
                                    type="checkbox"
                                    id="is_flat_rate"
                                    checked={tierForm.data.is_flat_rate}
                                    onChange={(e) => tierForm.setData('is_flat_rate', e.target.checked)}
                                    className="w-4 h-4 text-[#065033] border-gray-300 rounded focus:ring-[#065033]"
                                />
                                <label htmlFor="is_flat_rate" className="text-sm font-medium text-[#696969]">
                                    {__('Use Flat Rate Price')}
                                </label>
                            </div>

                            {tierForm.data.is_flat_rate ? (
                                <div>
                                    <label className="block text-sm font-medium text-[#696969] mb-2">{__('Flat Rate Price')} (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={tierForm.data.flat_rate_price}
                                        onChange={(e) => tierForm.setData('flat_rate_price', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                        required
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-[#696969] mb-2">{__('Price Adjustment')} (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={tierForm.data.price_adjustment}
                                        onChange={(e) => tierForm.setData('price_adjustment', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#065033]"
                                        required
                                    />
                                    <p className="text-xs text-[#6C6C6C] mt-1">{__('Added to the base city price')}</p>
                                </div>
                            )}

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={tierForm.data.is_active}
                                    onChange={(e) => tierForm.setData('is_active', e.target.checked)}
                                    className="w-4 h-4 text-[#065033] border-gray-300 rounded focus:ring-[#065033] mr-2"
                                />
                                <span className="text-sm text-[#696969]">{__('Active')}</span>
                            </label>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowTierModal(false)}
                                    className="px-4 py-2 border border-[#EAEAEA] rounded-lg text-[#6C6C6C] hover:bg-[#F5F9FA]"
                                >
                                    {__('Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={tierForm.processing}
                                    className="px-4 py-2 bg-[#065033] text-white rounded-lg hover:bg-[#054028] disabled:opacity-50"
                                >
                                    {tierForm.processing ? __('Saving...') : __('Save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
