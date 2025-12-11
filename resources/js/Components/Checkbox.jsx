export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-proprio-blue shadow-sm focus:ring-proprio-blue ' +
                className
            }
        />
    );
}
