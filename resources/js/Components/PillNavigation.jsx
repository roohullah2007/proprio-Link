import { Link } from '@inertiajs/react';

export default function PillNavigation({ items = [], className = '' }) {
    const defaultItems = [
        { 
            href: '/agent/properties?type=rent', 
            label: 'For Rent',
            active: false,
            external: false
        },
        { 
            href: '/agent/properties?type=sale', 
            label: 'For Sale',
            active: true, // Example of active state
            external: false
        },
        { 
            href: '/agent/properties?category=buildings', 
            label: 'Browse Buildings',
            active: false,
            external: false
        },
        { 
            href: '/sell', 
            label: 'Sell',
            active: false,
            external: false
        },
        { 
            href: '/contact', 
            label: 'Contact',
            active: false,
            external: false
        }
    ];

    const navigationItems = items.length > 0 ? items : defaultItems;

    return (
        <div className={`flex items-center ${className}`}>
            <div className="flex items-center justify-center px-2.5 py-1.5 bg-[#F5F9FA] border border-[#CEE8DE] rounded-full h-[35px] gap-[5px]">
                {navigationItems.map((item, index) => (
                    item.external ? (
                        <a
                            key={index}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center transition-all duration-200 rounded-full font-medium text-sm leading-4 font-inter whitespace-nowrap ${
                                item.active 
                                    ? 'bg-white border border-[#CEE8DE] text-[#696969] shadow-sm px-4 py-1.5 h-7' 
                                    : 'text-[#6C6C6C] hover:bg-white hover:border hover:border-[#CEE8DE] hover:text-[#696969] hover:shadow-sm px-4 py-1.5 h-7'
                            }`}
                        >
                            {item.label}
                        </a>
                    ) : (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center justify-center transition-all duration-200 rounded-full font-medium text-sm leading-4 font-inter whitespace-nowrap ${
                                item.active 
                                    ? 'bg-white border border-[#CEE8DE] text-[#696969] shadow-sm px-4 py-1.5 h-7' 
                                    : 'text-[#6C6C6C] hover:bg-white hover:border hover:border-[#CEE8DE] hover:text-[#696969] hover:shadow-sm px-4 py-1.5 h-7'
                            }`}
                        >
                            {item.label}
                        </Link>
                    )
                ))}
            </div>
        </div>
    );
}