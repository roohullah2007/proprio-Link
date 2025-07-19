export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center px-6 py-3 gap-2 h-11 bg-[#065033] border border-[#065033] rounded-full font-inter font-medium text-sm text-white transition-all duration-200 hover:bg-[#054028] focus:outline-none focus:bg-[#054028] disabled:opacity-50 disabled:cursor-not-allowed ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}