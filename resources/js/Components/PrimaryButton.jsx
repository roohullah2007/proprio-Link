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
                `inline-flex items-center justify-center px-6 py-3 gap-2 h-11 bg-proprio-blue border border-proprio-blue rounded-full font-inter font-medium text-sm text-white transition-all duration-200 hover:bg-proprio-blue-600 focus:outline-none focus:bg-proprio-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}