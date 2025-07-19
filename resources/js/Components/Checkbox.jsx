export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-[#065033] shadow-sm focus:ring-[#065033] ' +
                className
            }
        />
    );
}
