import React, { useState } from 'react';
import { Heart, MapPin, Home, Users, Euro } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import PaymentModal from './PaymentModal';
import { 
    formatCurrency, 
    translatePropertyType, 
    translatePropertyStatus,
    formatContactsRemaining,
    __
} from '@/Utils/translations';

const PropertyCard = ({ 
    property, 
    userType = null, 
    showContactButton = false,
    onFavoriteToggle = null,
    isFavorite = false 
}) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState(null);

    // Check if user can purchase contact
    const checkPurchaseEligibility = async () => {
        try {
            const response = await fetch(`/payments/properties/${property.id}/can-purchase`);
            const result = await response.json();
            
            if (!result.can_purchase) {
                alert(result.message);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error checking purchase eligibility:', error);
            alert(__('Erreur lors de la vérification'));
            return false;
        }
    };

    // Create payment intent
    const handleContactPurchase = async () => {
        if (!(await checkPurchaseEligibility())) {
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch(`/payments/properties/${property.id}/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            const result = await response.json();

            if (response.ok) {
                setPaymentData(result);
                setShowPaymentModal(true);
            } else {
                alert(result.error || 'Erreur lors de la création du paiement');
            }
        } catch (error) {
            console.error('Error creating payment intent:', error);
            alert('Erreur lors de la création du paiement');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (result) => {
        setPurchaseStatus('success');
        alert('Paiement confirmé ! Vous allez recevoir les informations de contact par email.');
        // Could trigger a refresh of the property data here
    };

    // Helper function to create a clean title
    const getPropertyTitle = () => {
        let title = '';
        
        // Use address complete if available, otherwise use property type + city
        if (property.adresse_complete && property.adresse_complete.trim()) {
            title = property.adresse_complete;
        } else if (property.titre && property.titre.trim()) {
            title = property.titre;
        } else {
            title = `${translatePropertyType(property.type_propriete)} ${__('à')} ${property.ville}`;
        }
        
        // Aggressively truncate to 35 characters max
        if (title.length > 35) {
            return title.substring(0, 35) + '...';
        }
        
        return title;
    };

    const getContactButtonText = () => {
        if (loading) return __('Vérification...');
        if (property.contacts_restants <= 0) return __('Plus de contacts');
        return __('Accéder aux contacts') + ' (15€)';
    };

    const isContactButtonDisabled = () => {
        return loading || property.contacts_restants <= 0 || purchaseStatus === 'success';
    };

    return (
        <>
            {/* Card Container with exact dimensions */}
            <div 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                style={{ 
                    width: '270px', 
                    height: '405px',
                    minWidth: '270px',
                    maxWidth: '270px'
                }}
            >
                {/* Property Image - 270px height */}
                <div 
                    className="relative flex-shrink-0"
                    style={{ height: '270px', width: '270px' }}
                >
                    {property.images && property.images.length > 0 ? (
                        <div className="relative w-full h-full">
                            <img
                                src={typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url}
                                alt={property.titre}
                                className="w-full h-full object-cover"
                                style={{ width: '270px', height: '270px' }}
                            />
                            
                            {/* Image Slider Navigation for multiple images */}
                            {property.images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            // Add slider navigation logic here
                                        }}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            // Add slider navigation logic here
                                        }}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    
                                    {/* Image Counter */}
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                        1 / {property.images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="text-center">
                                <Home className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">{__('Aucune photo')}</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Favorite Button (for agents) */}
                    {userType === 'AGENT' && onFavoriteToggle && (
                        <button
                            onClick={() => onFavoriteToggle(property.id)}
                            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${
                                isFavorite 
                                    ? 'bg-red-500 text-white hover:bg-red-600' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Heart 
                                className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} 
                            />
                        </button>
                    )}

                    {/* Contact Status Badge */}
                    {property.contacts_restants !== undefined && (
                        <div className="absolute top-3 left-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                property.contacts_restants > 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {formatContactsRemaining(property.contacts_restants)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Property Content - 135px height */}
                <div 
                    className="flex flex-col justify-between px-4 py-3"
                    style={{ 
                        height: '135px', 
                        width: '270px',
                        minHeight: '135px',
                        maxHeight: '135px'
                    }}
                >
                    {/* Price Section - Typography Style from Image 2 (Inter, Medium, 16.17px) */}
                    <div className="mb-2">
                        <div 
                            className="text-black font-medium flex items-center"
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '16.17px',
                                lineHeight: '24px',
                                letterSpacing: '-0.5px',
                                fontWeight: '500'
                            }}
                        >
                            <Euro className="w-4 h-4 mr-1" />
                            {formatCurrency(property.prix)}
                        </div>
                    </div>

                    {/* Property Details Section - Typography Style from Image 3 (Inter, Bold, 13.78px) */}
                    <div className="mb-2">
                        <div 
                            className="flex items-center gap-3 text-black"
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '13.78px',
                                lineHeight: '22px',
                                letterSpacing: '0px',
                                fontWeight: 'bold'
                            }}
                        >
                            {property.nombre_pieces && (
                                <div className="flex items-center">
                                    <span>
                                        {property.nombre_pieces} {__('Bed')} & {property.nombre_salles_bain || '1'} {__('Bath')}
                                    </span>
                                </div>
                            )}
                            {property.superficie && (
                                <div className="flex items-center">
                                    <span>{property.superficie} m²</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location Section - Typography Style from Image 4 (Inter, Regular, 13.56px) */}
                    <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span 
                            className="truncate"
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '13.56px',
                                lineHeight: '22px',
                                letterSpacing: '0px',
                                fontWeight: '400'
                            }}
                        >
                            {property.ville}{property.pays ? `, ${property.pays}` : ''}
                        </span>
                    </div>

                    {/* Action Buttons - Compact Layout */}
                    <div className="mt-2 space-y-1">
                        {/* Contact Purchase Button (for verified agents) */}
                        {showContactButton && userType === 'AGENT' && (
                            <PrimaryButton
                                onClick={handleContactPurchase}
                                disabled={isContactButtonDisabled()}
                                className="w-full justify-center text-xs py-1"
                            >
                                {getContactButtonText()}
                            </PrimaryButton>
                        )}

                        {/* View Details Button */}
                        <SecondaryButton
                            onClick={() => {
                                // This could navigate to a property detail page
                                console.log('View property details:', property.id);
                            }}
                            className="w-full justify-center text-xs py-1"
                        >
                            {__('View details')}
                        </SecondaryButton>
                    </div>

                    {/* Property Status (if applicable) - Compact */}
                    {property.statut && (
                        <div className="mt-1">
                            <span className={`inline-flex px-1 py-0.5 text-xs font-medium rounded-full ${
                                property.statut === 'publie' ? 'bg-green-100 text-green-800' :
                                property.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                                property.statut === 'rejete' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {translatePropertyStatus(property.statut)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {paymentData && (
                <PaymentModal
                    show={showPaymentModal}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setPaymentData(null);
                    }}
                    property={paymentData.property}
                    clientSecret={paymentData.client_secret}
                    purchaseId={paymentData.purchase_id}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </>
    );
};

export default PropertyCard;