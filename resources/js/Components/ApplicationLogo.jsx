export default function ApplicationLogo({ className = "h-8 w-auto", ...props }) {
    return (
        <img 
            src="/assets/Logo.svg" 
            alt="Proprio Link" 
            className={className}
            {...props}
        />
    );
}
