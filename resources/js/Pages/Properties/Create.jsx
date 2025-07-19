import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';
import * as Icons from 'lucide-react';

export default function Create({ auth }) {
    const { __ } = useTranslations();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const { data, setData, post, processing, errors, progress } = useForm({
        // Basic Info
        adresse_complete: '',
        pays: 'France',
        ville: '',
        prix: '',
        superficie_m2: '',
        type_propriete: '',
        
        // Property Details
        description: '',
        nombre_pieces: '',
        nombre_chambres: '',
        nombre_salles_bain: '',
        etage: '',
        annee_construction: '',
        etat_propriete: '',
        type_chauffage: '',
        
        // Features and Amenities
        amenities: [],
        meuble: false,
        charges_mensuelles: '',
        informations_complementaires: '',
        
        // Contact preferences
        contacts_souhaites: 5,
        
        // Images
        images: [],
    });

    const propertyTypes = [
        { value: 'APPARTEMENT', label: __('Apartment') },
        { value: 'MAISON', label: __('House') },
        { value: 'TERRAIN', label: __('Land') },
        { value: 'COMMERCIAL', label: __('Commercial Space') },
        { value: 'BUREAU', label: __('Office') },
        { value: 'AUTRES', label: __('Other') },
    ];

    const propertyConditions = [
        { value: 'NEUF', label: __('New') },
        { value: 'EXCELLENT', label: __('Excellent Condition') },
        { value: 'BON', label: __('Good Condition') },
        { value: 'A_RENOVER', label: __('Needs Renovation') },
        { value: 'A_RESTAURER', label: __('Needs Restoration') },
    ];

    const heatingTypes = [
        { value: 'GAZ', label: __('Gas') },
        { value: 'ELECTRIQUE', label: __('Electric') },
        { value: 'FIOUL', label: __('Oil') },
        { value: 'POMPE_CHALEUR', label: __('Heat Pump') },
        { value: 'BOIS', label: __('Wood/Biomass') },
        { value: 'COLLECTIF', label: __('Collective Heating') },
        { value: 'AUTRE', label: __('Other') },
    ];

    const countries = [
        { value: 'France', label: __('France') },
        { value: 'Belgique', label: __('Belgium') },
        { value: 'Suisse', label: __('Switzerland') },
        { value: 'Luxembourg', label: __('Luxembourg') },
        { value: 'Canada', label: __('Canada') },
        { value: 'Maroc', label: __('Morocco') },
        { value: 'Tunisie', label: __('Tunisia') },
        { value: 'Algérie', label: __('Algeria') },
    ];

    const availableAmenities = [
        // Exterior and Parking
        { 
            category: __('Exterior and Parking'),
            items: [
                { value: 'parking', label: __('Parking'), icon: 'Car' },
                { value: 'garage', label: __('Garage'), icon: 'Home' },
                { value: 'jardin', label: __('Garden'), icon: 'Trees' },
                { value: 'terrasse', label: __('Terrace'), icon: 'Mountain' },
                { value: 'balcon', label: __('Balcony'), icon: 'Building' },
                { value: 'piscine', label: __('Swimming Pool'), icon: 'Waves' },
                { value: 'cave', label: __('Cellar'), icon: 'Archive' },
                { value: 'grenier', label: __('Attic/Loft'), icon: 'Package' },
            ]
        },
        // Security and Comfort
        {
            category: __('Security and Comfort'),
            items: [
                { value: 'ascenseur', label: __('Elevator'), icon: 'ArrowUpDown' },
                { value: 'digicode', label: __('Digital Code'), icon: 'KeyRound' },
                { value: 'interphone', label: __('Intercom'), icon: 'Phone' },
                { value: 'gardien', label: __('Doorman/Concierge'), icon: 'User' },
                { value: 'alarme', label: __('Alarm System'), icon: 'Shield' },
                { value: 'climatisation', label: __('Air Conditioning'), icon: 'Snowflake' },
                { value: 'cheminee', label: __('Fireplace'), icon: 'Flame' },
            ]
        },
        // Equipment
        {
            category: __('Equipment'),
            items: [
                { value: 'cuisine_equipee', label: __('Equipped Kitchen'), icon: 'ChefHat' },
                { value: 'cuisine_amenagee', label: __('Fitted Kitchen'), icon: 'UtensilsCrossed' },
                { value: 'dressing', label: __('Dressing Room'), icon: 'Shirt' },
                { value: 'placards', label: __('Built-in Wardrobes'), icon: 'Cabinet' },
                { value: 'double_vitrage', label: __('Double Glazing'), icon: 'Square' },
                { value: 'volets_electriques', label: __('Electric Shutters'), icon: 'Blinds' },
            ]
        },
        // Accessibility and Services
        {
            category: __('Accessibility and Services'),
            items: [
                { value: 'acces_handicape', label: __('Disabled Access'), icon: 'Accessibility' },
                { value: 'fibre_optique', label: __('Fiber Optic'), icon: 'Wifi' },
                { value: 'proche_transports', label: __('Near Public Transport'), icon: 'Train' },
                { value: 'proche_commerces', label: __('Near Shops'), icon: 'ShoppingCart' },
                { value: 'proche_ecoles', label: __('Near Schools'), icon: 'GraduationCap' },
            ]
        }
    ];

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Limit to maximum 10 images
        if (files.length > 10) {
            alert(__('You can only select a maximum of 10 images'));
            return;
        }
        
        // Check file sizes (max 5MB per image)
        const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            alert(__('Some images exceed the maximum size of 5MB'));
            return;
        }
        
        // Add new files to existing selection
        const newFiles = [...selectedImages, ...files];
        if (newFiles.length > 10) {
            alert(__('Maximum 10 images allowed. Selection truncated.'));
            setSelectedImages(newFiles.slice(0, 10));
            setData('images', newFiles.slice(0, 10));
        } else {
            setSelectedImages(newFiles);
            setData('images', newFiles);
        }

        // Create preview URLs for all images
        const allPreviews = newFiles.slice(0, 10).map(file => URL.createObjectURL(file));
        setImagePreviews(allPreviews);
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        setData('images', newImages);
    };

    const handleAmenityToggle = (amenityValue) => {
        const newAmenities = data.amenities.includes(amenityValue)
            ? data.amenities.filter(item => item !== amenityValue)
            : [...data.amenities, amenityValue];
        setData('amenities', newAmenities);
    };

    const handleNextStep = (e) => {
        e.preventDefault(); // Prevent any form submission
        e.stopPropagation(); // Stop event bubbling
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = (e) => {
        e.preventDefault(); // Prevent any form submission
        e.stopPropagation(); // Stop event bubbling
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmitProperty = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentStep === 6) {
            post(route('properties.store'));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Only allow form submission when explicitly on step 6 and submit button is clicked
        if (currentStep === 6) {
            post(route('properties.store'));
        }
        // For all other cases, do nothing (prevent submission)
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return data.adresse_complete && data.ville && data.pays;
            case 2:
                return data.prix && data.superficie_m2 && data.type_propriete;
            case 3:
                return true; // Optional details
            case 4:
                return data.contacts_souhaites >= 1 && data.contacts_souhaites <= 20;
            case 5:
                return selectedImages.length > 0;
            case 6:
                return true; // Review step
            default:
                return true;
        }
    };

    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-center">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                    <React.Fragment key={step}>
                        <div className={`
                            flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold font-inter
                            ${currentStep >= step 
                                ? 'bg-[#065033] border-[#065033] text-white' 
                                : 'bg-white border-[#EAEAEA] text-[#6C6C6C]'
                            }
                        `}>
                            {step}
                        </div>
                        {step < 6 && (
                            <div className={`
                                flex-1 h-1 mx-4 
                                ${currentStep > step ? 'bg-[#065033]' : 'bg-[#EAEAEA]'}
                            `} />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="flex justify-between mt-4 text-xs sm:text-sm">
                <span className={`font-inter ${currentStep >= 1 ? 'text-[#065033] font-semibold' : 'text-[#6C6C6C]'}`}>
                    {__('Location')}
                </span>
                <span className={`font-inter ${currentStep >= 2 ? 'text-[#065033] font-semibold' : 'text-[#6C6C6C]'}`}>
                    {__('Information')}
                </span>
                <span className={`font-inter ${currentStep >= 3 ? 'text-[#065033] font-semibold' : 'text-[#6C6C6C]'}`}>
                    {__('Details')}
                </span>
                <span className={`font-inter ${currentStep >= 4 ? 'text-[#065033] font-semibold' : 'text-[#6C6C6C]'}`}>
                    {__('Contact')}
                </span>
                <span className={`font-inter ${currentStep >= 5 ? 'text-[#065033] font-semibold' : 'text-[#6C6C6C]'}`}>
                    {__('Photos')}
                </span>
                <span className={`font-inter ${currentStep >= 6 ? 'text-[#065033] font-semibold' : 'text-[#6C6C6C]'}`}>
                    {__('Review')}
                </span>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black font-inter">
                {__('Where is your property located?')}
            </h3>
            
            <div>
                <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                    {__('Complete Address')} *
                </label>
                <textarea
                    value={data.adresse_complete}
                    onChange={(e) => setData('adresse_complete', e.target.value)}
                    rows={3}
                    className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                    placeholder={__('Example: 123 Peace Street, 75001 Paris')}
                />
                {errors.adresse_complete && (
                    <p className="mt-1 text-sm text-red-600 font-inter">{errors.adresse_complete}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Country')} *
                    </label>
                    <select
                        value={data.pays}
                        onChange={(e) => setData('pays', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-4 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        style={{ 
                            paddingLeft: '16px', 
                            paddingRight: '40px',
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 12px center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '16px',
                            appearance: 'none'
                        }}
                    >
                        {countries.map((country) => (
                            <option key={country.value} value={country.value}>
                                {country.label}
                            </option>
                        ))}
                    </select>
                    {errors.pays && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.pays}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('City')} *
                    </label>
                    <input
                        type="text"
                        value={data.ville}
                        onChange={(e) => setData('ville', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        placeholder={__('Example: Paris')}
                    />
                    {errors.ville && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.ville}</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black font-inter">
                {__('Main Information')}
            </h3>

            <div>
                <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                    {__('Property Type')} *
                </label>
                <select
                    value={data.type_propriete}
                    onChange={(e) => setData('type_propriete', e.target.value)}
                    className="w-full border border-[#EAEAEA] rounded-lg px-4 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                    style={{ 
                        paddingLeft: '16px', 
                        paddingRight: '40px', // Extra space for dropdown arrow
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 12px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '16px',
                        appearance: 'none'
                    }}
                >
                    <option value="" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}>
                        {__('Select a type')}
                    </option>
                    {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value} style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}>
                            {type.label}
                        </option>
                    ))}
                </select>
                {errors.type_propriete && (
                    <p className="mt-1 text-sm text-red-600 font-inter">{errors.type_propriete}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Sale Price')} (€) *
                    </label>
                    <input
                        type="number"
                        value={data.prix}
                        onChange={(e) => setData('prix', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        placeholder="650000"
                        min="0"
                        step="1000"
                    />
                    {errors.prix && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.prix}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Surface Area')} (m²) *
                    </label>
                    <input
                        type="number"
                        value={data.superficie_m2}
                        onChange={(e) => setData('superficie_m2', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        placeholder="85"
                        min="1"
                    />
                    {errors.superficie_m2 && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.superficie_m2}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                    {__('Property Description')} *
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                    placeholder={__('Describe your property in detail: highlights, special features, environment...')}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600 font-inter">{errors.description}</p>
                )}
            </div>
        </div>
    );
    
    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black font-inter">
                {__('Property Details')}
            </h3>

            {/* Rooms and spaces */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Number of Rooms')}
                    </label>
                    <input
                        type="number"
                        value={data.nombre_pieces}
                        onChange={(e) => setData('nombre_pieces', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        placeholder="4"
                        min="1"
                        max="20"
                    />
                    {errors.nombre_pieces && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.nombre_pieces}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Number of Bedrooms')}
                    </label>
                    <input
                        type="number"
                        value={data.nombre_chambres}
                        onChange={(e) => setData('nombre_chambres', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        placeholder="2"
                        min="0"
                        max="15"
                    />
                    {errors.nombre_chambres && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.nombre_chambres}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Bathrooms')}
                    </label>
                    <input
                        type="number"
                        value={data.nombre_salles_bain}
                        onChange={(e) => setData('nombre_salles_bain', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        placeholder="1"
                        min="0"
                        max="10"
                    />
                    {errors.nombre_salles_bain && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.nombre_salles_bain}</p>
                    )}
                </div>
            </div>

            {/* Building details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Floor')}
                    </label>
                    <input
                        type="number"
                        value={data.etage}
                        onChange={(e) => setData('etage', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        placeholder="2"
                        min="0"
                        max="50"
                    />
                    <p className="mt-1 text-xs text-[#6C6C6C] font-inter">{__('0 = Ground floor')}</p>
                    {errors.etage && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.etage}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Year of Construction')}
                    </label>
                    <input
                        type="number"
                        value={data.annee_construction}
                        onChange={(e) => setData('annee_construction', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        placeholder="1995"
                        min="1800"
                        max={new Date().getFullYear()}
                    />
                    {errors.annee_construction && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.annee_construction}</p>
                    )}
                </div>
            </div>

            {/* Property condition and heating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Property Condition')}
                    </label>
                    <select
                        value={data.etat_propriete}
                        onChange={(e) => setData('etat_propriete', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-4 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        style={{ 
                            paddingLeft: '16px', 
                            paddingRight: '40px',
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 12px center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '16px',
                            appearance: 'none'
                        }}
                    >
                        <option value="">{__('Select condition')}</option>
                        {propertyConditions.map((condition) => (
                            <option key={condition.value} value={condition.value}>
                                {condition.label}
                            </option>
                        ))}
                    </select>
                    {errors.etat_propriete && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.etat_propriete}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Heating Type')}
                    </label>
                    <select
                        value={data.type_chauffage}
                        onChange={(e) => setData('type_chauffage', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-4 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        style={{ 
                            paddingLeft: '16px', 
                            paddingRight: '40px',
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 12px center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '16px',
                            appearance: 'none'
                        }}
                    >
                        <option value="">{__('Select heating type')}</option>
                        {heatingTypes.map((heating) => (
                            <option key={heating.value} value={heating.value}>
                                {heating.label}
                            </option>
                        ))}
                    </select>
                    {errors.type_chauffage && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.type_chauffage}</p>
                    )}
                </div>
            </div>

            {/* Additional costs and furniture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                        {__('Monthly Charges')} (€)
                    </label>
                    <input
                        type="number"
                        value={data.charges_mensuelles}
                        onChange={(e) => setData('charges_mensuelles', e.target.value)}
                        className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                        placeholder="120"
                        min="0"
                        step="10"
                    />
                    {errors.charges_mensuelles && (
                        <p className="mt-1 text-sm text-red-600 font-inter">{errors.charges_mensuelles}</p>
                    )}
                </div>

                <div className="flex items-center">
                    <div className="flex items-center h-5">
                        <input
                            type="checkbox"
                            checked={data.meuble}
                            onChange={(e) => setData('meuble', e.target.checked)}
                            className="w-4 h-4 text-[#065033] border-[#EAEAEA] rounded focus:ring-[#065033]"
                        />
                    </div>
                    <div className="ml-3">
                        <label className="text-sm font-medium text-[#6C6C6C] font-inter">
                            {__('Furnished Property')}
                        </label>
                    </div>
                </div>
            </div>

            {/* Amenities */}
            <div>
                <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-3">
                    {__('Equipment and Amenities')}
                </label>
                
                {availableAmenities.map((category) => {
                    return (
                        <div key={category.category} className="mb-6">
                            <h5 className="text-sm font-semibold text-black font-inter mb-3 border-b border-[#EAEAEA] pb-1">
                                {category.category}
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {category.items.map((amenity) => {
                                    const IconComponent = Icons[amenity.icon] || Icons.Home;
                                    return (
                                        <label
                                            key={amenity.value}
                                            className={`
                                                flex items-center p-3 border rounded-lg cursor-pointer transition-all font-inter
                                                ${data.amenities.includes(amenity.value)
                                                    ? 'border-[#065033] bg-[#F5F9FA] text-[#065033]'
                                                    : 'border-[#EAEAEA] hover:border-[#CEE8DE] hover:bg-[#F5F9FA]'
                                                }
                                            `}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.amenities.includes(amenity.value)}
                                                onChange={() => handleAmenityToggle(amenity.value)}
                                                className="sr-only"
                                            />
                                            <IconComponent className="w-5 h-5 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium">{amenity.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                
                {errors.amenities && (
                    <p className="mt-1 text-sm text-red-600 font-inter">{errors.amenities}</p>
                )}
            </div>

            {/* Additional information */}
            <div>
                <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                    {__('Additional Information')}
                </label>
                <textarea
                    value={data.informations_complementaires}
                    onChange={(e) => setData('informations_complementaires', e.target.value)}
                    rows={3}
                    className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 font-inter focus:outline-none focus:ring-2 focus:ring-[#065033] focus:border-[#065033]"
                    placeholder={__('Other important information: co-ownership, recent work, special features...')}
                />
                {errors.informations_complementaires && (
                    <p className="mt-1 text-sm text-red-600 font-inter">{errors.informations_complementaires}</p>
                )}
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black font-inter">
                {__('Contact Preferences')}
            </h3>

            <div>
                <label className="block text-sm font-medium text-[#6C6C6C] font-inter mb-2">
                    {__('Number of desired contacts')} *
                </label>
                <div className="flex items-center space-x-4">
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={data.contacts_souhaites}
                        onChange={(e) => setData('contacts_souhaites', parseInt(e.target.value))}
                        className="flex-1"
                    />
                    <span className="min-w-0 text-lg font-semibold text-[#065033] font-inter">
                        {data.contacts_souhaites}
                    </span>
                </div>
                {errors.contacts_souhaites && (
                    <p className="mt-1 text-sm text-red-600 font-inter">{errors.contacts_souhaites}</p>
                )}
            </div>

            <div className="bg-[#F5F9FA] border border-[#CEE8DE] rounded-lg p-4">
                <h4 className="font-semibold text-[#065033] font-inter mb-2">
                    {__('Tips to optimize your contacts')}
                </h4>
                <ul className="text-sm text-[#6C6C6C] font-inter space-y-1">
                    <li>• <strong>{__('5-10 contacts')}:</strong> {__('Ideal for most properties')}</li>
                    <li>• <strong>{__('10-15 contacts')}:</strong> {__('For sought-after or unique properties')}</li>
                    <li>• <strong>{__('15-20 contacts')}:</strong> {__('To maximize your chances')}</li>
                </ul>
                <div className="mt-3 p-3 bg-white rounded border border-[#CEE8DE]">
                    <div className="flex items-center text-[#065033]">
                        <span className="text-2xl mr-2">→</span>
                        <div>
                            <p className="font-semibold font-inter">
                                {__('More contacts = more opportunities')}
                            </p>
                            <p className="text-xs text-[#6C6C6C] font-inter">
                                {__('Increase your chances of finding the ideal agent')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black font-inter">
                {__('Add photos of your property')}
            </h3>

            <div className="border-2 border-dashed border-[#EAEAEA] rounded-lg p-6 text-center hover:border-[#CEE8DE] transition-colors">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                />
                <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                >
                    <svg className="w-12 h-12 text-[#6C6C6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-[#6C6C6C] font-medium font-inter">
                        {__('Click to select photos or drag and drop')}
                    </span>
                    <span className="text-xs text-[#6C6C6C] font-inter">
                        {__('PNG, JPG, WebP up to 5MB per image')}
                    </span>
                </label>
            </div>

            {imagePreviews.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-[#6C6C6C] font-inter mb-3">
                        {__('Selected photos (:count)', { count: imagePreviews.length })}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-[#EAEAEA]"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    title={__('Remove this photo')}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-[#065033] text-white text-xs px-2 py-1 rounded font-inter">
                                        {__('Main photo')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {errors.images && (
                <p className="text-sm text-red-600 font-inter">{errors.images}</p>
            )}

            <div className="bg-[#FEF3CD] border border-[#FDE68A] rounded-lg p-4">
                <h4 className="font-semibold text-[#92400E] font-inter mb-2">
                    {__('Tips for good photos')}
                </h4>
                <ul className="text-sm text-[#92400E] font-inter space-y-1">
                    <li>• {__('Take photos with good natural lighting')}</li>
                    <li>• {__('Show the main rooms and features')}</li>
                    <li>• {__('Avoid blurry or dark photos')}</li>
                    <li>• {__('The first photo will be the one highlighted')}</li>
                    <li>• {__('Remember to photograph the equipment and amenities mentioned')}</li>
                </ul>
            </div>
        </div>
    );

    const getAmenityLabel = (value) => {
        const amenityLabels = {
            // Exterior and Parking
            'parking': __('Parking'),
            'garage': __('Garage'),
            'jardin': __('Garden'),
            'terrasse': __('Terrace'),
            'balcon': __('Balcony'),
            'piscine': __('Swimming Pool'),
            'cave': __('Cellar'),
            'grenier': __('Attic/Loft'),
            
            // Security and Comfort
            'ascenseur': __('Elevator'),
            'digicode': __('Digital Code'),
            'interphone': __('Intercom'),
            'gardien': __('Doorman/Concierge'),
            'alarme': __('Alarm System'),
            'climatisation': __('Air Conditioning'),
            'cheminee': __('Fireplace'),
            
            // Equipment
            'cuisine_equipee': __('Equipped Kitchen'),
            'cuisine_amenagee': __('Fitted Kitchen'),
            'dressing': __('Dressing Room'),
            'placards': __('Built-in Wardrobes'),
            'double_vitrage': __('Double Glazing'),
            'volets_electriques': __('Electric Shutters'),
            
            // Accessibility and Services
            'acces_handicape': __('Disabled Access'),
            'fibre_optique': __('Fiber Optic'),
            'proche_transports': __('Near Public Transport'),
            'proche_commerces': __('Near Shops'),
            'proche_ecoles': __('Near Schools'),
        };
        
        return amenityLabels[value] || value;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const renderStep6 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black font-inter">
                {__('Review Your Property Details')}
            </h3>
            <p className="text-[#6C6C6C] font-inter">
                {__('Please review all the information below before submitting your property')}
            </p>

            {/* Review Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Property Overview */}
                    <div className="bg-[#F5F9FA] border border-[#CEE8DE] rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-black font-inter mb-4 flex items-center">
                            <Icons.Home className="w-5 h-5 mr-2 text-[#065033]" />
                            {__('Property Overview')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-[#6C6C6C] font-inter">{__('Property Type')}</span>
                                <p className="font-medium text-black font-inter">{propertyTypes.find(t => t.value === data.type_propriete)?.label || data.type_propriete}</p>
                            </div>
                            <div>
                                <span className="text-sm text-[#6C6C6C] font-inter">{__('Sale Price')}</span>
                                <p className="font-bold text-[#065033] font-inter text-lg">{formatPrice(data.prix)}</p>
                            </div>
                            <div>
                                <span className="text-sm text-[#6C6C6C] font-inter">{__('Surface Area')}</span>
                                <p className="font-medium text-black font-inter">{data.superficie_m2} m²</p>
                            </div>
                            <div>
                                <span className="text-sm text-[#6C6C6C] font-inter">{__('Price per m²')}</span>
                                <p className="font-medium text-black font-inter">{formatPrice(data.prix / data.superficie_m2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-black font-inter mb-4 flex items-center">
                            <Icons.MapPin className="w-5 h-5 mr-2 text-[#065033]" />
                            {__('Location')}
                        </h4>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-[#6C6C6C] font-inter">{__('Complete Address')}</span>
                                <p className="font-medium text-black font-inter">{data.adresse_complete}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('City')}</span>
                                    <p className="font-medium text-black font-inter">{data.ville}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Country')}</span>
                                    <p className="font-medium text-black font-inter">{data.pays}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {data.description && (
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-black font-inter mb-4 flex items-center">
                                <Icons.FileText className="w-5 h-5 mr-2 text-[#065033]" />
                                {__('Description')}
                            </h4>
                            <p className="text-black font-inter leading-relaxed">{data.description}</p>
                        </div>
                    )}

                    {/* Property Details */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-black font-inter mb-4 flex items-center">
                            <Icons.Settings className="w-5 h-5 mr-2 text-[#065033]" />
                            {__('Property Details')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {data.nombre_pieces && (
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Number of Rooms')}</span>
                                    <p className="font-medium text-black font-inter">{data.nombre_pieces}</p>
                                </div>
                            )}
                            {data.nombre_chambres && (
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Number of Bedrooms')}</span>
                                    <p className="font-medium text-black font-inter">{data.nombre_chambres}</p>
                                </div>
                            )}
                            {data.nombre_salles_bain && (
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Bathrooms')}</span>
                                    <p className="font-medium text-black font-inter">{data.nombre_salles_bain}</p>
                                </div>
                            )}
                            {data.etage !== null && data.etage !== '' && (
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Floor')}</span>
                                    <p className="font-medium text-black font-inter">{data.etage === '0' ? __('Ground floor') : data.etage}</p>
                                </div>
                            )}
                            {data.annee_construction && (
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Year of Construction')}</span>
                                    <p className="font-medium text-black font-inter">{data.annee_construction}</p>
                                </div>
                            )}
                            {data.etat_propriete && (
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Property Condition')}</span>
                                    <p className="font-medium text-black font-inter">{propertyConditions.find(c => c.value === data.etat_propriete)?.label || data.etat_propriete}</p>
                                </div>
                            )}
                            {data.type_chauffage && (
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Heating Type')}</span>
                                    <p className="font-medium text-black font-inter">{heatingTypes.find(h => h.value === data.type_chauffage)?.label || data.type_chauffage}</p>
                                </div>
                            )}
                            {data.charges_mensuelles && (
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Monthly Charges')}</span>
                                    <p className="font-medium text-black font-inter">{formatPrice(data.charges_mensuelles)}</p>
                                </div>
                            )}
                            {data.meuble && (
                                <div>
                                    <span className="text-sm text-[#6C6C6C] font-inter">{__('Furnished')}</span>
                                    <p className="font-medium text-[#065033] font-inter">{__('Yes')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amenities */}
                    {data.amenities && data.amenities.length > 0 && (
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-black font-inter mb-4 flex items-center">
                                <Icons.Star className="w-5 h-5 mr-2 text-[#065033]" />
                                {__('Equipment and Amenities')}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {data.amenities.map((amenity) => (
                                    <div key={amenity} className="flex items-center p-2 bg-[#F0F9F4] border border-[#D1F2D9] rounded-lg">
                                        <Icons.Check className="w-4 h-4 text-[#065033] mr-2" />
                                        <span className="text-sm font-medium text-[#065033] font-inter">
                                            {getAmenityLabel(amenity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    {data.informations_complementaires && (
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-black font-inter mb-4 flex items-center">
                                <Icons.Info className="w-5 h-5 mr-2 text-[#065033]" />
                                {__('Additional Information')}
                            </h4>
                            <p className="text-black font-inter leading-relaxed">{data.informations_complementaires}</p>
                        </div>
                    )}

                    {/* Photos */}
                    {imagePreviews.length > 0 && (
                        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-black font-inter mb-4 flex items-center">
                                <Icons.Camera className="w-5 h-5 mr-2 text-[#065033]" />
                                {__('Photos')} ({imagePreviews.length})
                            </h4>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                {imagePreviews.slice(0, 8).map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image}
                                            alt={`Photo ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border border-[#EAEAEA]"
                                        />
                                        {index === 0 && (
                                            <div className="absolute bottom-1 left-1 bg-[#065033] text-white text-xs px-2 py-1 rounded font-inter">
                                                {__('Main')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {imagePreviews.length > 8 && (
                                    <div className="h-24 bg-[#F5F9FA] rounded-lg border border-[#EAEAEA] flex items-center justify-center">
                                        <span className="text-sm font-medium text-[#065033] font-inter">
                                            +{imagePreviews.length - 8}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Preferences */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-black font-inter mb-4 flex items-center">
                            <Icons.Users className="w-5 h-5 mr-2 text-[#065033]" />
                            {__('Contact Preferences')}
                        </h4>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#065033] font-inter mb-2">
                                {data.contacts_souhaites}
                            </div>
                            <p className="text-[#6C6C6C] font-inter">
                                {__('Desired contacts')}
                            </p>
                        </div>
                    </div>

                    {/* Submission Summary */}
                    <div className="bg-[#F0F9F4] border border-[#D1F2D9] rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-[#065033] font-inter mb-4 flex items-center">
                            <Icons.CheckCircle className="w-5 h-5 mr-2" />
                            {__('Ready to Submit')}
                        </h4>
                        <div className="space-y-3 text-sm font-inter">
                            <div className="flex items-center">
                                <Icons.Check className="w-4 h-4 text-[#065033] mr-2" />
                                <span className="text-[#065033]">{__('Property information complete')}</span>
                            </div>
                            <div className="flex items-center">
                                <Icons.Check className="w-4 h-4 text-[#065033] mr-2" />
                                <span className="text-[#065033]">{__('Photos uploaded')}</span>
                            </div>
                            <div className="flex items-center">
                                <Icons.Check className="w-4 h-4 text-[#065033] mr-2" />
                                <span className="text-[#065033]">{__('Contact preferences set')}</span>
                            </div>
                        </div>
                    </div>

                    {/* What happens next */}
                    <div className="bg-[#FEF3CD] border border-[#FDE68A] rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-[#92400E] font-inter mb-4 flex items-center">
                            <Icons.Clock className="w-5 h-5 mr-2" />
                            {__('What happens next?')}
                        </h4>
                        <div className="space-y-3 text-sm font-inter text-[#92400E]">
                            <div className="flex items-start">
                                <span className="font-bold mr-2">1.</span>
                                <span>{__('Your property will be reviewed by our team')}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-bold mr-2">2.</span>
                                <span>{__('You will receive an email confirmation')}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-bold mr-2">3.</span>
                                <span>{__('Once approved, it will be visible to agents')}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-bold mr-2">4.</span>
                                <span>{__('Agents can purchase your contact information')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            case 6: return renderStep6();
            default: return null;
        }
    };

    return (
        <AuthenticatedLayout
            usePillNavigation={false}
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Add Property')}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={__('Submit a property') + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-8">
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-black font-inter">
                                {__('Submit a property')}
                            </h2>
                            <p className="mt-2 text-[#6C6C6C] font-inter">
                                {__('Fill in the information about your property to publish it on Propio')}
                            </p>
                        </div>

                        {renderStepIndicator()}

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            {renderCurrentStep()}

                            <div className="flex justify-between pt-6 border-t border-[#EAEAEA]">
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    className={`px-6 py-2 border border-[#EAEAEA] rounded-lg text-sm font-medium font-inter transition-colors ${
                                        currentStep === 1
                                            ? 'text-[#6C6C6C] cursor-not-allowed bg-[#F5F9FA]'
                                            : 'text-[#6C6C6C] hover:bg-[#F5F9FA] hover:border-[#CEE8DE]'
                                    }`}
                                    disabled={currentStep === 1}
                                >
                                    {__('Previous')}
                                </button>

                                {currentStep < 6 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className={`px-6 py-2 rounded-lg text-sm font-medium font-inter transition-colors ${
                                            validateStep(currentStep)
                                                ? 'bg-[#065033] text-white hover:bg-[#054028] focus:ring-2 focus:ring-[#065033] focus:ring-offset-2'
                                                : 'bg-[#EAEAEA] text-[#6C6C6C] cursor-not-allowed'
                                        }`}
                                        disabled={!validateStep(currentStep)}
                                    >
                                        {currentStep === 5 ? __('Review') : __('Next')}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmitProperty}
                                        className={`px-8 py-2 rounded-lg text-sm font-medium font-inter transition-colors ${
                                            validateStep(currentStep) && !processing
                                                ? 'bg-[#065033] text-white hover:bg-[#054028] focus:ring-2 focus:ring-[#065033] focus:ring-offset-2'
                                                : 'bg-[#EAEAEA] text-[#6C6C6C] cursor-not-allowed'
                                        }`}
                                        disabled={!validateStep(currentStep) || processing}
                                    >
                                        {processing ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {__('Submitting...')}
                                            </div>
                                        ) : (
                                            __('Submit my property')
                                        )}
                                    </button>
                                )}
                            </div>

                            {progress && (
                                <div className="w-full bg-[#EAEAEA] rounded-full h-2 mt-4">
                                    <div
                                        className="bg-[#065033] h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress.percentage}%` }}
                                    ></div>
                                    <p className="text-xs text-[#6C6C6C] font-inter mt-1 text-center">
                                        {__('Upload in progress... :percentage%', { percentage: progress.percentage })}
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
