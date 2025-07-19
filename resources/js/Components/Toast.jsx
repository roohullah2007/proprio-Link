import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function Toast() {
    const { props } = usePage();
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const newToasts = [];

        // Check for flash messages
        if (props.flash?.success) {
            newToasts.push({
                id: Date.now(),
                type: 'success',
                message: props.flash.success,
                description: props.flash.success_description,
            });
        }

        if (props.flash?.error) {
            newToasts.push({
                id: Date.now() + 1,
                type: 'error',
                message: props.flash.error,
            });
        }

        if (props.flash?.info) {
            newToasts.push({
                id: Date.now() + 2,
                type: 'info',
                message: props.flash.info,
            });
        }

        if (newToasts.length > 0) {
            setToasts(prev => [...prev, ...newToasts]);

            // Auto remove toasts after 5 seconds (increased from 4)
            newToasts.forEach(toast => {
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== toast.id));
                }, 5000);
            });
        }
    }, [props.flash]);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 space-y-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`min-w-[400px] max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out hover:shadow-xl ${
                        toast.type === 'success' 
                            ? 'border-l-4 border-[#065033]' 
                            : toast.type === 'error'
                            ? 'border-l-4 border-red-500'
                            : 'border-l-4 border-blue-500'
                    }`}
                    style={{
                        animation: 'slideInRight 0.3s ease-out'
                    }}
                >
                    <div className="p-5">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {toast.type === 'success' && (
                                    <div className="w-8 h-8 bg-[#065033] rounded-full flex items-center justify-center">
                                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                {toast.type === 'error' && (
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                {toast.type === 'info' && (
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <p className="text-sm font-semibold text-[#000] font-inter leading-5">
                                    {toast.type === 'success' && 'Success'}
                                    {toast.type === 'error' && 'Error'}
                                    {toast.type === 'info' && 'Information'}
                                </p>
                                <p className="text-sm text-[#6C6C6C] font-inter mt-1 leading-relaxed">
                                    {toast.message}
                                </p>
                                {toast.description && (
                                    <p className="text-xs text-[#6C6C6C] font-inter mt-1 opacity-80">
                                        {toast.description}
                                    </p>
                                )}
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    className="bg-white rounded-full inline-flex text-[#6C6C6C] hover:text-[#065033] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#065033] p-1 transition-colors duration-200"
                                    onClick={() => removeToast(toast.id)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}