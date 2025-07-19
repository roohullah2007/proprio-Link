import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import Modal from '../Modal';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { router } from '@inertiajs/react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ property, clientSecret, onSuccess, onError, processing, setProcessing }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        setIsProcessing(true);
        setProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: property.owner_name,
                    },
                }
            });

            if (error) {
                console.error('Payment failed:', error);
                onError(error.message || 'Le paiement a échoué');
            } else if (paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent.id);
            }
        } catch (err) {
            console.error('Payment error:', err);
            onError('Une erreur est survenue lors du paiement');
        } finally {
            setIsProcessing(false);
            setProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: '1.5',
                padding: '12px',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informations de paiement
                </h3>
                <div className="border border-gray-300 rounded-md p-3 bg-white">
                    <CardElement options={cardElementOptions} />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Vos informations de paiement sont sécurisées et cryptées.
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Total à payer: <span className="font-bold text-gray-900">15,00 €</span>
                </div>
                
                <PrimaryButton
                    type="submit"
                    disabled={!stripe || isProcessing || processing}
                    className="min-w-32"
                >
                    {isProcessing ? 'Traitement...' : 'Payer 15,00 €'}
                </PrimaryButton>
            </div>
        </form>
    );
};

const PaymentModal = ({ 
    show, 
    onClose, 
    property, 
    clientSecret, 
    purchaseId,
    onPaymentSuccess 
}) => {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            // Confirm payment with backend
            const response = await fetch('/payments/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    payment_intent_id: paymentIntentId,
                    purchase_id: purchaseId,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                onPaymentSuccess && onPaymentSuccess(result);
                onClose();
                
                // Show success message or redirect
                router.visit('/dashboard', {
                    preserveState: false,
                    preserveScroll: false,
                });
            } else {
                setError(result.error || 'Erreur lors de la confirmation du paiement');
            }
        } catch (err) {
            console.error('Payment confirmation error:', err);
            setError('Erreur lors de la confirmation du paiement');
        }
    };

    const handlePaymentError = (errorMessage) => {
        setError(errorMessage);
    };

    const resetModal = () => {
        setError('');
        setProcessing(false);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Acheter le contact
                    </h2>
                    <button
                        onClick={() => {
                            resetModal();
                            onClose();
                        }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Property Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-4">
                        {property.images && property.images.length > 0 && (
                            <img
                                src={property.images[0].url}
                                alt={property.titre}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{property.titre}</h3>
                            <p className="text-gray-600">{property.ville}</p>
                            <p className="text-lg font-bold text-green-600">
                                {new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: 'EUR'
                                }).format(property.prix)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Accès aux informations de contact</span>
                        <span className="font-medium">15,00 €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TVA incluse</span>
                        <span className="font-medium">0,00 €</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>15,00 €</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Stripe Payment Form */}
                {clientSecret && (
                    <Elements stripe={stripePromise}>
                        <PaymentForm
                            property={property}
                            clientSecret={clientSecret}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                            processing={processing}
                            setProcessing={setProcessing}
                        />
                    </Elements>
                )}

                {/* Terms */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        En procédant au paiement, vous acceptez nos conditions d'utilisation 
                        et notre politique de confidentialité. Les informations de contact 
                        vous seront envoyées par email après confirmation du paiement.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentModal;
