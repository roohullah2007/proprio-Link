import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

// Icons in dashboard style
const Icons = {
    CreditCard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    CheckCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Home: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    MapPin: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Maximize2: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6m-6 0L9 15M9 3H3v6m6 0l6-6" />
        </svg>
    ),
    User: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Phone: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    Mail: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Shield: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    Euro: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
    ),
    ArrowLeft: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    ),
};

// Payment form component using Stripe Elements
const PaymentForm = ({ property, price, currency, onSuccess, onError }) => {
    const { __ } = useTranslations();
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            onError(__('Stripe is not loaded yet. Please try again.'));
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            onError(__('Card element not found'));
            return;
        }

        setIsLoading(true);

        try {
            // Create payment intent
            const response = await fetch(`/payment/properties/${property.id}/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // Server returned HTML instead of JSON (likely an error page)
                const htmlResponse = await response.text();
                console.error('Server returned HTML instead of JSON:', htmlResponse.substring(0, 500));
                throw new Error(__('Server error occurred. Please try again or contact support.'));
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || __('Error creating payment'));
            }

            const { client_secret, payment_intent_id } = data;
            
            // Confirm payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                client_secret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: `${property.proprietaire?.prenom || ''} ${property.proprietaire?.nom || ''}`,
                        },
                    }
                }
            );

            if (stripeError) {
                onError(stripeError.message);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // Confirm payment on our backend
                const confirmResponse = await fetch('/payment/confirm', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                payment_intent_id: payment_intent_id,
                property_id: property.id,
                }),
                });

                // Check if response is JSON
            const contentType = confirmResponse.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                // Server returned HTML instead of JSON (likely an error page)
                    const htmlResponse = await confirmResponse.text();
                console.error('Server returned HTML instead of JSON:', htmlResponse.substring(0, 500));
                throw new Error(__('Server error occurred. Please try again or contact support.'));
            }

            const confirmData = await confirmResponse.json();

            if (!confirmResponse.ok) {
                throw new Error(confirmData.error || __('Error confirming payment'));
            }

                onSuccess(confirmData);
            }

        } catch (error) {
            onError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency.toUpperCase(),
            maximumFractionDigits: 2,
        }).format(price);
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '14px',
                color: '#555555',
                '::placeholder': {
                    color: '#aab7c4',
                },
                fontFamily: 'Inter, system-ui, sans-serif',
            },
            invalid: {
                color: '#dc2626',
            },
        },
        hidePostalCode: false,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-[#000] font-inter mb-3">
                    {__('Card Information')}
                </label>
                <div className="p-4 border border-[#EAEAEA] rounded-lg bg-white focus-within:border-[#065033] transition-colors">
                    <CardElement options={cardElementOptions} />
                </div>
                <p className="text-xs text-[#6C6C6C] font-inter mt-2 flex items-center">
                    <Icons.Shield className="w-3 h-3 mr-1" />
                    {__('Your payment information is secure and encrypted')}
                </p>
            </div>

            <div className="bg-[#F5F9FA] border border-[#EAEAEA] p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                    <input 
                        type="checkbox" 
                        required 
                        className="mt-1 rounded border-[#EAEAEA] text-[#065033] focus:ring-[#065033] focus:border-[#065033]" 
                    />
                    <span className="text-sm text-[#000] font-inter leading-relaxed">
                        {__('I accept the terms of use and privacy policy')}
                    </span>
                </label>
            </div>

            <button
                type="submit"
                disabled={!stripe || isLoading}
                className={`w-full flex justify-center items-center px-4 py-3 h-12 bg-[#065033] border border-[#065033] rounded-lg text-white font-inter font-medium text-sm transition-colors ${
                    isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#054028] focus:outline-none focus:bg-[#054028]'
                }`}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                        {__('Processing...')}
                    </div>
                ) : (
                    <>
                        <Icons.CreditCard className="w-4 h-4 mr-2" />
                        {__('Buy Contact for')} {formatPrice(price)}
                    </>
                )}
            </button>
        </form>
    );
};
// Main component
export default function ContactPurchase({ property, price, currency, stripePublishableKey }) {
    const { __ } = useTranslations();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Initialize Stripe with the publishable key passed from the server - use useMemo to prevent reinitialization
    const stripePromise = useMemo(() => {
        return stripePublishableKey ? loadStripe(stripePublishableKey) : null;
    }, [stripePublishableKey]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency.toUpperCase(),
            maximumFractionDigits: 2,
        }).format(price);
    };

    const getPropertyTypeLabel = (type) => {
        const types = {
            'APPARTEMENT': __('Apartment'),
            'MAISON': __('House'),
            'TERRAIN': __('Land'),
            'COMMERCIAL': __('Commercial'),
            'BUREAU': __('Office'),
            'AUTRES': __('Other'),
        };
        return types[type] || type;
    };

    const handlePaymentSuccess = (data) => {
        setSuccess(true);
        setError(null);
        
        // Redirect to contact details after short delay
        setTimeout(() => {
            router.visit(`/agent/purchases/${data.purchase_id}/contact`, {
                method: 'get',
            });
        }, 2000);
    };

    const handlePaymentError = (errorMessage) => {
        setError(errorMessage);
        setSuccess(false);
    };

    const handleBackClick = () => {
        window.history.back();
    };

    if (success) {
        return (
            <AuthenticatedLayout
                usePillNavigation={false}
                header={
                    <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                        <div className="flex-none order-0 flex-grow-0">
                            <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                                {__('Payment Successful')}
                            </h1>
                        </div>
                    </div>
                }
            >
                <Head title={__('Payment Successful')} />
                
                <div className="py-8">
                    <div className="mx-auto max-w-2xl px-8">
                        <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-6 bg-[#F0F9F4] border border-[#D1F2D9] rounded-full flex items-center justify-center">
                                    <Icons.CheckCircle className="w-8 h-8 text-[#065033]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#000] font-inter mb-3">
                                    {__('Payment confirmed successfully!')}
                                </h3>
                                <p className="text-[#6C6C6C] font-inter mb-6">
                                    {__('You will be redirected to the contact information...')}
                                </p>
                                <div className="animate-spin w-6 h-6 border-2 border-[#065033] border-t-transparent rounded-full mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            usePillNavigation={false}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Buy Contact')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-[14px] h-[31px] flex-none order-1 flex-grow-0">
                        <button 
                            onClick={handleBackClick}
                            className="flex justify-center items-center px-[10px] py-[6px] gap-[6px] h-[31px] bg-[#F5F9FA] border-[1.5px] border-[#EAEAEA] rounded-[20px] hover:bg-[#EAEAEA] transition-colors focus:outline-none"
                        >
                            <Icons.ArrowLeft className="w-4 h-4 text-[#000]" />
                            <span className="font-inter font-medium text-[12px] leading-[16px] text-[#000]">
                                {__('Back')}
                            </span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={__('Buy Contact')} />

            <div className="py-8">
                <div className="mx-auto max-w-[1200px] px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Property Details - Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-4 flex items-center">
                                        <Icons.Home className="w-5 h-5 mr-2 text-[#065033]" />
                                        {__('Property Details')}
                                    </h3>
                                    
                                    {/* Property Image */}
                                    <div className="mb-6">
                                        {property.images && property.images.length > 0 ? (
                                            <img
                                                src={`/storage/${property.images[0].chemin_fichier}`}
                                                alt={property.adresse_complete}
                                                className="w-full h-64 object-cover rounded-lg border border-[#EAEAEA]"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <Icons.Home className="w-12 h-12 text-[#6C6C6C] mx-auto mb-2" />
                                                    <p className="text-[#6C6C6C] font-inter text-sm">{__('No images available')}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-[#F5F9FA] border border-[#EAEAEA] p-4 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <Icons.MapPin className="w-4 h-4 text-[#6C6C6C] mr-2" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Address')}</span>
                                                </div>
                                                <p className="text-[#000] font-inter font-medium">{property.adresse_complete}</p>
                                                <p className="text-[#6C6C6C] font-inter text-sm">{property.ville}, {property.pays}</p>
                                            </div>
                                            
                                            <div className="bg-[#F5F9FA] border border-[#EAEAEA] p-4 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <Icons.Euro className="w-4 h-4 text-[#6C6C6C] mr-2" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Price')}</span>
                                                </div>
                                                <p className="text-xl font-bold text-[#065033] font-inter">
                                                    {formatPrice(property.prix)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="bg-[#F5F9FA] border border-[#EAEAEA] p-4 rounded-lg text-center">
                                                <div className="flex items-center justify-center mb-2">
                                                    <Icons.Home className="w-4 h-4 text-[#6C6C6C] mr-1" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Type')}</span>
                                                </div>
                                                <p className="text-[#000] font-inter font-medium">{getPropertyTypeLabel(property.type_propriete)}</p>
                                            </div>
                                            
                                            <div className="bg-[#F5F9FA] border border-[#EAEAEA] p-4 rounded-lg text-center">
                                                <div className="flex items-center justify-center mb-2">
                                                    <Icons.Maximize2 className="w-4 h-4 text-[#6C6C6C] mr-1" />
                                                    <span className="text-sm font-medium text-[#000] font-inter">{__('Surface')}</span>
                                                </div>
                                                <p className="text-[#000] font-inter font-medium">{property.superficie_m2} m²</p>
                                            </div>
                                            
                                            {property.nombre_pieces && (
                                                <div className="bg-[#F5F9FA] border border-[#EAEAEA] p-4 rounded-lg text-center">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <Icons.User className="w-4 h-4 text-[#6C6C6C] mr-1" />
                                                        <span className="text-sm font-medium text-[#000] font-inter">{__('Rooms')}</span>
                                                    </div>
                                                    <p className="text-[#000] font-inter font-medium">{property.nombre_pieces}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form - Right Column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden sticky top-8">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-[#000] font-inter mb-4 flex items-center">
                                        <Icons.CreditCard className="w-5 h-5 mr-2 text-[#065033]" />
                                        {__('Payment Information')}
                                    </h3>

                                    {/* Purchase Summary */}
                                    <div className="bg-[#F5F9FA] border border-[#EAEAEA] p-4 rounded-lg mb-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[#000] font-inter font-medium">{__('Property Owner Contact')}:</span>
                                            <span className="font-semibold text-[#000] font-inter">
                                                {formatPrice(price)}
                                            </span>
                                        </div>
                                        <div className="border-t border-[#EAEAEA] pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[#000] font-inter font-semibold">{__('Total')}:</span>
                                                <span className="text-lg font-bold text-[#065033] font-inter">
                                                    {formatPrice(price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* What you get */}
                                    <div className="bg-[#F0F9F4] border border-[#D1F2D9] p-4 rounded-lg mb-6">
                                        <h4 className="font-semibold text-[#065033] font-inter mb-3 flex items-center">
                                            <Icons.CheckCircle className="w-4 h-4 mr-2" />
                                            {__('What you will get')}:
                                        </h4>
                                        <ul className="text-sm text-[#065033] font-inter space-y-2">
                                            <li className="flex items-center">
                                                <Icons.User className="w-3 h-3 mr-2 flex-shrink-0" />
                                                {__('Owner name and surname')}
                                            </li>
                                            <li className="flex items-center">
                                                <Icons.Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                                                {__('Phone number')}
                                            </li>
                                            <li className="flex items-center">
                                                <Icons.Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                                                {__('Email address')}
                                            </li>
                                            <li className="flex items-center">
                                                <Icons.CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                                                {__('Instant access to information')}
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600 font-inter">{error}</p>
                                        </div>
                                    )}

                                    {/* Check if Stripe is configured */}
                                    {!stripePublishableKey ? (
                                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-800 font-inter">
                                                {__('Payment system not configured. Please contact support.')}
                                            </p>
                                        </div>
                                    ) : (
                                        /* Stripe Payment Form */
                                        <Elements stripe={stripePromise}>
                                            <PaymentForm
                                                property={property}
                                                price={price}
                                                currency={currency}
                                                onSuccess={handlePaymentSuccess}
                                                onError={handlePaymentError}
                                            />
                                        </Elements>
                                    )}

                                    <div className="mt-4 text-xs text-[#6C6C6C] font-inter text-center space-y-1">
                                        <p className="flex items-center justify-center">
                                            <Icons.Shield className="w-3 h-3 mr-1" />
                                            {__('Secure payment by Stripe')}
                                        </p>
                                        <p>{__('Your banking information is not stored on our servers')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}