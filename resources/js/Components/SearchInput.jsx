import { useState } from 'react';

export default function SearchInput({ 
    placeholder = 'Search...', 
    value = '', 
    onChange = () => {}, 
    onSubmit = () => {},
    className = '',
    width = '269px'
}) {
    const [searchValue, setSearchValue] = useState(value);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        console.log('🔍 SearchInput: Input changed to:', newValue);
        setSearchValue(newValue);
        onChange(newValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('🚀 SearchInput: Form submitted with value:', searchValue);
        console.log('📤 SearchInput: Calling onSubmit callback...');
        onSubmit(searchValue);
    };

    // Convert width prop to Tailwind class if it's a standard size
    const getWidthClass = () => {
        if (width === '100%') return 'w-full';
        if (width === '269px') return 'w-[269px]';
        return 'w-[269px]'; // default
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className={`flex items-center bg-white border-[1.5px] border-[#EAEAEA] rounded-full h-[35px] px-4 py-2.5 gap-2.5 ${getWidthClass()} focus-within:border-[#065033] transition-colors`}>
                {/* Search Icon */}
                <div className="flex-none w-4 h-4">
                    <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                    >
                        {/* Search circle */}
                        <circle 
                            cx="7.5" 
                            cy="7.5" 
                            r="6" 
                            stroke="#4E5051" 
                            strokeWidth="1"
                            fill="none"
                        />
                        {/* Search handle */}
                        <line 
                            x1="13.5" 
                            y1="13.5" 
                            x2="12" 
                            y2="12" 
                            stroke="#4E5051" 
                            strokeWidth="1"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-sm font-normal font-inter leading-[19px] text-[#5A5A5A] placeholder-[#5A5A5A] capitalize"
                />
            </div>
        </form>
    );
}