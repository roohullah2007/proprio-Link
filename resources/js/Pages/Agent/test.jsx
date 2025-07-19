import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

// Stripe-style icons using Lucide React equivalent styling
const Icons = {
    TrendingUp: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    TrendingDown: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
    ),
    Home: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    CreditCard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    DollarSign: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
    ),
    Users: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    ),
    BarChart3: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    Search: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    ShoppingBag: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
        </svg>
    ),
    Settings: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Activity: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    ),
    ArrowRight: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    ),
};

export default function TestDashboard({ stats }) {
    const [timeframe, setTimeframe] = useState('30d');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num);
    };

    const statCards = [
        {
            title: 'Available Properties',
            value: formatNumber(stats.available_properties),
            change: '+12.5%',
            trend: 'up',
            icon: Icons.Home,
            color: 'blue'
        },
        {
            title: 'Revenue this month',
            value: formatCurrency(stats.revenue_this_month),
            change: '+8.2%',
            trend: 'up',
            icon: Icons.DollarSign,
            color: 'green'
        },
        {
            title: 'Purchases',
            value: formatNumber(stats.purchases_this_month),
            change: '+15.3%',
            trend: 'up',
            icon: Icons.ShoppingBag,
            color: 'purple'
        },
        {
            title: 'Conversion Rate',
            value: `${stats.conversion_rate}%`,
            change: '-2.1%',
            trend: 'down',
            icon: Icons.BarChart3,
            color: 'orange'
        }
    ];

    const quickActions = [
        {
            title: 'Search Properties',
            description: 'Find and explore available properties',
            icon: Icons.Search,
            href: '/agent/properties',
            color: 'blue'
        },
        {
            title: 'My Purchases',
            description: 'View your contact purchases',
            icon: Icons.CreditCard,
            href: '/agent/purchases',
            color: 'green'
        },
        {
            title: 'Analytics',
            description: 'View detailed performance metrics',
            icon: Icons.Activity,
            href: '#',
            color: 'purple'
        },
        {
            title: 'Settings',
            description: 'Manage your account preferences',
            icon: Icons.Settings,
            href: '/profile',
            color: 'gray'
        }
    ];

    const recentActivity = [
        { type: 'purchase', property: 'Villa in Cannes', amount: '€15', time: '2 hours ago' },
        { type: 'view', property: 'Apartment in Paris 16th', amount: null, time: '4 hours ago' },
        { type: 'purchase', property: 'House in Nice', amount: '€15', time: '1 day ago' },
        { type: 'view', property: 'Penthouse in Monaco', amount: null, time: '2 days ago' },
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
        orange: {
            bg: 'bg-orange-500',
            light: 'bg-orange-50',
            text: 'text-orange-600',
            border: 'border-orange-200'
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
            usePillNavigation={true}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button 
                            className="flex items-center justify-center px-[10px] py-[10px] gap-[10px] w-[134px] h-[31px] bg-white border-[1.5px] border-[#E5E5E5] rounded-[20px] font-inter font-medium text-[12px] leading-[19px] text-[#000] capitalize transition-colors hover:border-[#065033] focus:outline-none focus:border-[#065033]"
                        >
                            <svg 
                                width="17" 
                                height="15" 
                                viewBox="0 0 17 15" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-none"
                            >
                                <path 
                                    d="M16 2.625H14.3333M16 7.5H11.8333M16 12.375H11.8333M4.33333 14V8.76848C4.33333 8.59948 4.33333 8.51498 4.31632 8.43413C4.30122 8.36247 4.27626 8.29308 4.2421 8.22784C4.20359 8.15439 4.14945 8.08841 4.04116 7.95638L1.29218 4.60609C1.18388 4.47411 1.12974 4.40812 1.09123 4.33464C1.05707 4.26944 1.03211 4.20005 1.01702 4.12834C1 4.04751 1 3.963 1 3.79398V2.3C1 1.84496 1 1.61744 1.09082 1.44363C1.17072 1.29075 1.29821 1.16646 1.45501 1.08855C1.63327 1 1.86662 1 2.33333 1H9.66667C10.1334 1 10.3668 1 10.545 1.08855C10.7018 1.16646 10.8292 1.29075 10.9092 1.44363C11 1.61744 11 1.84496 11 2.3V3.79398C11 3.963 11 4.04751 10.983 4.12834C10.9679 4.20005 10.9429 4.26944 10.9087 4.33464C10.8702 4.40812 10.8161 4.47411 10.7078 4.60609L7.95883 7.95638C7.85058 8.08841 7.79642 8.15439 7.75792 8.22784C7.72375 8.29308 7.69875 8.36247 7.68367 8.43413C7.66667 8.51498 7.66667 8.59948 7.66667 8.76848V11.5625L4.33333 14Z" 
                                    stroke="#065033" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="flex-none text-[12px] font-medium leading-[19px] text-[#000] capitalize">
                                Last 30 Days
                            </span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Agent Dashboard - Test" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-lg ${colorVariants[stat.color].light} flex items-center justify-center`}>
                                        <stat.icon className={`w-6 h-6 ${colorVariants[stat.color].text}`} />
                                    </div>
                                    <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.trend === 'up' ? (
                                            <Icons.TrendingUp className="w-4 h-4 mr-1" />
                                        ) : (
                                            <Icons.TrendingDown className="w-4 h-4 mr-1" />
                                        )}
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                    <p className="text-sm text-gray-600">{stat.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                                    <span className="text-sm text-gray-500">Get started</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {quickActions.map((action, index) => (
                                        <Link
                                            key={index}
                                            href={action.href}
                                            className="group flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <div className={`w-10 h-10 rounded-lg ${colorVariants[action.color].light} flex items-center justify-center mr-4`}>
                                                <action.icon className={`w-5 h-5 ${colorVariants[action.color].text}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                                                    {action.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                                            </div>
                                            <Icons.ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                                    <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        View all
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                activity.type === 'purchase' ? 'bg-green-100' : 'bg-blue-100'
                                            }`}>
                                                {activity.type === 'purchase' ? (
                                                    <Icons.CreditCard className={`w-4 h-4 ${activity.type === 'purchase' ? 'text-green-600' : 'text-blue-600'}`} />
                                                ) : (
                                                    <Icons.Search className={`w-4 h-4 ${activity.type === 'purchase' ? 'text-green-600' : 'text-blue-600'}`} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.type === 'purchase' ? 'Purchased contact' : 'Viewed property'}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">{activity.property}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-gray-400">{activity.time}</span>
                                                    {activity.amount && (
                                                        <span className="text-xs font-medium text-green-600">{activity.amount}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Insights */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Performance Insights</h2>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Compared to last month</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {formatCurrency(stats.avg_property_price)}
                                </div>
                                <div className="text-sm text-gray-600">Average Property Price</div>
                                <div className="text-xs text-green-600 mt-1 flex items-center justify-center">
                                    <Icons.TrendingUp className="w-3 h-3 mr-1" />
                                    +5.2% vs last month
                                </div>
                            </div>
                            
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                    {stats.growth_rate}%
                                </div>
                                <div className="text-sm text-gray-600">Portfolio Growth</div>
                                <div className="text-xs text-green-600 mt-1 flex items-center justify-center">
                                    <Icons.TrendingUp className="w-3 h-3 mr-1" />
                                    Strong performance
                                </div>
                            </div>
                            
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 mb-1">
                                    {formatNumber(stats.total_properties)}
                                </div>
                                <div className="text-sm text-gray-600">Total Properties</div>
                                <div className="text-xs text-blue-600 mt-1 flex items-center justify-center">
                                    <Icons.Activity className="w-3 h-3 mr-1" />
                                    Market leading
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Getting Started Guide */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Getting Started with Propio</h2>
                                <p className="text-blue-100 mb-4">
                                    Follow these steps to maximize your property investment potential
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs font-medium mr-3">1</div>
                                        Search and filter properties by your criteria
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs font-medium mr-3">2</div>
                                        Purchase owner contacts for €15 each
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs font-medium mr-3">3</div>
                                        Connect directly with property owners
                                    </div>
                                </div>
                            </div>
                            <div className="hidden lg:block">
                                <Link
                                    href="/agent/properties"
                                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center"
                                >
                                    Start Exploring
                                    <Icons.ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
