import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from '@/Utils/translations';

// Icons for the dashboard
const Icons = {
    Home: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    Users: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    ),
    Shield: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    BarChart3: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    Clock: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    CheckCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    XCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Settings: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    ArrowRight: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    ),
    Clipboard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
    Euro: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1" />
        </svg>
    ),
    CreditCard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
};

export default function Dashboard({ auth, stats = {}, recentProperties = [] }) {
    const user = auth.user;
    const { __ } = useTranslations();
    const [timeframe, setTimeframe] = useState('30d');
    const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num || 0);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount || 0);
    };

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
            case '7d': return __('Last 7 Days');
            case '30d': return __('Last 30 Days');
            case '90d': return __('Last 90 Days');
            case '1y': return __('Last Year');
            default: return __('Last 30 Days');
        }
    };

    const statCards = [
        {
            title: __('Properties Pending Review'),
            value: formatNumber(stats.properties_pending || 0),
            change: stats.properties_pending > 0 ? '+New' : 'None',
            trend: stats.properties_pending > 0 ? 'urgent' : 'up',
            icon: Icons.Clock,
            color: 'yellow'
        },
        {
            title: __('Total Platform Earnings'),
            value: formatCurrency(stats.total_earnings || 0),
            change: `+${formatCurrency(stats.earnings_this_month || 0)} this month`,
            trend: 'up',
            icon: Icons.Euro,
            color: 'green'
        },
        {
            title: __('Successful Transactions'),
            value: formatNumber(stats.total_transactions || 0),
            change: `+${formatNumber(stats.transactions_this_month || 0)} this month`,
            trend: 'up',
            icon: Icons.CreditCard,
            color: 'blue'
        },
        {
            title: __('Total Users'),
            value: formatNumber(stats.total_users || 0),
            change: '+15.3%',
            trend: 'up',
            icon: Icons.Users,
            color: 'purple'
        }
    ];

    const quickActions = [
        {
            title: __('Review Properties'),
            description: __('Moderate pending property submissions'),
            icon: Icons.Clipboard,
            href: route('admin.pending-properties'),
            color: 'blue',
            badge: stats.properties_pending || 0
        },
        {
            title: __('All Properties'),
            description: __('Manage all platform properties'),
            icon: Icons.Home,
            href: route('admin.all-properties'),
            color: 'green'
        },
        {
            title: __('Platform Analytics'),
            description: __('View detailed platform metrics'),
            icon: Icons.BarChart3,
            href: '#',
            color: 'purple'
        },
        {
            title: __('User Management'),
            description: __('Manage platform users'),
            icon: Icons.Settings,
            href: '#',
            color: 'gray'
        }
    ];

    const colorVariants = {
        blue: {
            bg: 'bg-blue-500',
            light: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200'
        },
        green: {
            bg: 'bg-green-500',
            light: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-200'
        },
        purple: {
            bg: 'bg-purple-500',
            light: 'bg-purple-50',
            text: 'text-purple-600',
            border: 'border-purple-200'
        },
        yellow: {
            bg: 'bg-yellow-500',
            light: 'bg-yellow-50',
            text: 'text-yellow-600',
            border: 'border-yellow-200'
        },
        red: {
            bg: 'bg-red-500',
            light: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-200'
        },
        gray: {
            bg: 'bg-gray-500',
            light: 'bg-gray-50',
            text: 'text-gray-600',
            border: 'border-gray-200'
        }
    };

    return (
        <AuthenticatedLayout
            usePillNavigation={false}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    {/* Left side - Dashboard title */}
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Admin Dashboard')}
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
                                                setTimeframe('90d');
                                                setShowTimeframeDropdown(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                                timeframe === '90d' ? 'bg-[#065033] text-white' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {__('Last 90 Days')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTimeframe('1y');
                                                setShowTimeframeDropdown(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                                timeframe === '1y' ? 'bg-[#065033] text-white' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {__('Last Year')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={__("Admin Dashboard") + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-8">
                    {/* Welcome Message */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-4 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                                    {__("Welcome to Admin Panel, :name!", { name: `${user.prenom} ${user.nom}` })}
                                </h2>
                                <p className="text-[#6C6C6C] font-inter">
                                    {__("Monitor platform activity and manage property moderation.")}
                                </p>
                            </div>
                            
                            {/* Admin Status */}
                            <div>
                                <div className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#065033] border border-[#065033] rounded-full flex-none order-0 flex-grow-0 transition-colors hover:bg-[#054028] focus:outline-none focus:bg-[#054028]">
                                    <Icons.Shield className="w-4 h-4 text-white flex-none order-0 flex-grow-0" />
                                    <span className="text-white text-sm font-medium font-inter flex-none order-1 flex-grow-0 whitespace-nowrap">
                                        {__("Administrator")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((card, index) => {
                            const IconComponent = card.icon;
                            const colors = colorVariants[card.color];
                            
                            return (
                                <div key={index} className="bg-white border border-[#EAEAEA] rounded-lg p-4">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-medium text-black font-inter">
                                            {card.title}
                                        </h3>
                                        <p className="text-2xl font-semibold text-black font-inter">
                                            {card.value}
                                        </p>
                                        {card.trend === 'urgent' && card.change === '+New' && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {__('Requires attention')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-sm mb-8">
                        <h3 className="text-lg font-semibold text-[#696969] font-inter mb-6">
                            {__("Admin Actions")}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickActions.map((action, index) => {
                                const IconComponent = action.icon;
                                const colors = colorVariants[action.color];
                                
                                return (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className="group bg-[#F5F9FA] border border-[#EAEAEA] rounded-xl p-6 hover:bg-white hover:border-[#CEE8DE] transition-all duration-200 relative"
                                    >
                                        {action.badge > 0 && (
                                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                                {action.badge > 99 ? '99+' : action.badge}
                                            </div>
                                        )}
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className={`w-12 h-12 ${colors.light} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                                <IconComponent className={`w-6 h-6 ${colors.text}`} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-[#696969] font-inter mb-1">
                                                    {action.title}
                                                </h4>
                                                <p className="text-xs text-[#6C6C6C] font-inter">
                                                    {action.description}
                                                </p>
                                            </div>
                                            <Icons.ArrowRight className="w-4 h-4 text-[#6C6C6C] group-hover:text-[#696969] group-hover:translate-x-1 transition-all duration-200" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Properties */}
                    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-[#696969] font-inter">
                                {__('Recent Properties Pending Review')}
                            </h3>
                            <Link
                                href={route('admin.pending-properties')}
                                className="text-sm font-medium text-[#065033] hover:text-[#054028] transition-colors"
                            >
                                {__('View All')}
                            </Link>
                        </div>
                        
                        {recentProperties.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Icons.CheckCircle className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-[#696969] font-inter mb-2">
                                    {__('No Properties Pending')}
                                </h4>
                                <p className="text-sm text-[#6C6C6C] font-inter">
                                    {__('All properties have been reviewed. Great job!')}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentProperties.map((property) => (
                                    <div key={property.id} className="flex items-center space-x-4 p-4 border border-[#EAEAEA] rounded-lg hover:border-[#CEE8DE] transition-colors">
                                        <div className="flex-shrink-0">
                                            {property.images && property.images.length > 0 ? (
                                                <img
                                                    className="h-16 w-16 rounded-lg object-cover"
                                                    src={`/storage/${property.images[0].chemin_fichier}`}
                                                    alt={property.type_propriete}
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Icons.Home className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-[#000] font-inter truncate">
                                                        {property.type_propriete} - {property.ville}
                                                    </p>
                                                    <p className="text-sm text-[#6C6C6C] font-inter truncate">
                                                        {property.proprietaire.prenom} {property.proprietaire.nom}
                                                    </p>
                                                    <p className="text-sm text-[#6C6C6C] font-inter">
                                                        {formatNumber(property.prix)} € • {property.superficie_m2} m²
                                                    </p>
                                                </div>
                                                <div className="text-right flex items-center space-x-3">
                                                    <div>
                                                        <p className="text-xs text-[#6C6C6C] font-inter">
                                                            {new Date(property.created_at).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={route('admin.property-review', property.id)}
                                                        className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#065033] border border-[#065033] rounded-full transition-colors hover:bg-[#054028] focus:outline-none focus:bg-[#054028]"
                                                    >
                                                        <Icons.Eye className="w-4 h-4 text-white" />
                                                        <span className="text-white text-sm font-medium font-inter whitespace-nowrap">
                                                            {__('Review')}
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}