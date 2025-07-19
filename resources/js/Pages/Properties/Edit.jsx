import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslations } from '@/Utils/translations';
import * as Icons from 'lucide-react';

export default function Edit({ auth, property }) {
    const { __ } = useTranslations();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
    const [existingImages, setExistingImages] = useState(property.images || []);

    const { data, setData, put, processing, errors, progress } = useForm({
        // Basic Info
        adresse_complete: property.adresse_complete || '',
        pays: property.pays || 'France',
        ville: property.ville || '',
        prix: property.prix || '',
        superficie_m2: property.superficie_m2 || '',
        type_propriete: property.type_propriete || '',
        
        // Property Details
        description: property.description || '',
        nombre_pieces: property.nombre_pieces || '',
        nombre_chambres: property.nombre_chambres || '',
        nombre_salles_bain: property.nombre_salles_bain || '',
        etage: property.etage || '',
        annee_construction: property.annee_construction || '',
        etat_propriete: property.etat_propriete || '',
        type_chauffage: property.type_chauffage || '',
        
        // Features and Amenities
        amenities: property.amenities || [],
        meuble: property.meuble || false,
        charges_mensuelles: property.charges_mensuelles || '',
        informations_complementaires: property.informations_complementaires || '',
        
        // Contact preferences
        contacts_souhaites: property.contacts_souhaites || 5,
        
        // Images
        images: [],
        remove_images: [],
    });

    const propertyTypes = [
        { value: 'APPARTEMENT', label: __('Appartement') },
        { value: 'MAISON', label: __('Maison') },
        { value: 'TERRAIN', label: __('Terrain') },
        { value: 'COMMERCIAL', label: __('Local commercial') },
        { value: 'BUREAU', label: __('Bureau') },
        { value: 'AUTRES', label: __('Autres') },
    ];

    const propertyConditions = [
        { value: 'NEUF', label: __('Neuf') },
        { value: 'EXCELLENT', label: __('Excellent état') },
        { value: 'BON', label: __('Bon état') },
        { value: 'A_RENOVER', label: __('À rénover') },
        { value: 'A_RESTAURER', label: __('À restaurer') },
    ];

    const heatingTypes = [
        { value: 'GAZ', label: __('Gaz') },
        { value: 'ELECTRIQUE', label: __('Électrique') },
        { value: 'FIOUL', label: __('Fioul') },
        { value: 'POMPE_CHALEUR', label: __('Pompe à chaleur') },
        { value: 'BOIS', label: __('Bois/Biomasse') },
        { value: 'COLLECTIF', label: __('Chauffage collectif') },
        { value: 'AUTRE', label: __('Autre') },
    ];

    const availableAmenities = [
        // Extérieur et parking
        { 
            category: __('Extérieur et Parking'),
            items: [
                { value: 'parking', label: __('Parking'), icon: 'Car' },
                { value: 'garage', label: __('Garage'), icon: 'Home' },
                { value: 'jardin', label: __('Garden'), icon: 'Trees' },
                { value: 'terrasse', label: __('Terrace'), icon: 'Mountain' },
                { value: 'balcon', label: __('Balcony'), icon: 'Building' },
                { value: 'piscine', label: __('Swimming pool'), icon: 'Waves' },
                { value: 'cave', label: __('Cave'), icon: 'Archive' },
                { value: 'grenier', label: __('Grenier/Combles'), icon: 'Package' },
            ]
        },
        // Sécurité et confort
        {
            category: __('Sécurité et Confort'),
            items: [
                { value: 'ascenseur', label: __('Ascenseur'), icon: 'ArrowUpDown' },
                { value: 'digicode', label: __('Digicode'), icon: 'KeyRound' },
                { value: 'interphone', label: __('Interphone'), icon: 'Phone' },
                { value: 'gardien', label: __('Gardien/Concierge'), icon: 'User' },
                { value: 'alarme', label: __('Système d\'alarme'), icon: 'Shield' },
                { value: 'climatisation', label: __('Climatisation'), icon: 'Snowflake' },
                { value: 'cheminee', label: __('Cheminée'), icon: 'Flame' },
            ]
        },
        // Équipements
        {
            category: __('Équipements'),
            items: [
                { value: 'cuisine_equipee', label: __('Cuisine équipée'), icon: 'ChefHat' },
                { value: 'cuisine_amenagee', label: __('Cuisine aménagée'), icon: 'Utensils' },
                { value: 'double_vitrage', label: __('Double vitrage'), icon: 'Home' },
                { value: 'volets_electriques', label: __('Volets électriques'), icon: 'ToggleLeft' },
                { value: 'placards', label: __('Placards intégrés'), icon: 'Package2' },
            ]
        },
        // Accessibilité et services
        {
            category: __('Accessibilité et Services'),
            items: [
                { value: 'acces_handicape', label: __('Accès handicapé'), icon: 'Accessibility' },
                { value: 'fibre_optique', label: __('Fibre optique'), icon: 'Wifi' },
                { value: 'proche_transports', label: __('Proche transports'), icon: 'Bus' },
                { value: 'proche_commerces', label: __('Proche commerces'), icon: 'ShoppingBag' },
                { value: 'proche_ecoles', label: __('Proche écoles'), icon: 'GraduationCap' },
            ]
        }
    ];

    const countries = [
        { value: 'France', label: __('France') },
        { value: 'Belgique', label: __('Belgique') },
        { value: 'Suisse', label: __('Suisse') },
        { value: 'Luxembourg', label: __('Luxembourg') },
        { value: 'Canada', label: __('Canada') },
        { value: 'Maroc', label: __('Maroc') },
        { value: 'Tunisie', label: __('Tunisie') },
        { value: 'Algérie', label: __('Algérie') },
    ];

    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < 6) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return data.adresse_complete && data.pays && data.ville;
            case 2:
                return data.type_propriete && data.prix && data.superficie_m2;
            case 3:
                return true;
            case 4:
                return data.contacts_souhaites;
            case 5:
                return true;
            case 6:
                return true;
            default:
                return false;
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setShowUpdateConfirmation(true);
    };

    const confirmUpdate = () => {
        put(route('properties.update', property.id));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, {
                    file,
                    url: e.target.result
                }]);
            };
            reader.readAsDataURL(file);
        });

        setData('images', [...data.images, ...files]);
    };

    const removeImage = (index, isExisting = false) => {
        if (isExisting) {
            const imageToRemove = existingImages[index];
            setExistingImages(prev => prev.filter((_, i) => i !== index));
            setData('remove_images', [...data.remove_images, imageToRemove.id]);
        } else {
            setSelectedImages(prev => prev.filter((_, i) => i !== index));
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
            setData('images', data.images.filter((_, i) => i !== index));
        }
    };

    const toggleAmenity = (amenity) => {
        const currentAmenities = Array.isArray(data.amenities) ? data.amenities : [];
        const isSelected = currentAmenities.includes(amenity);
        
        if (isSelected) {
            setData('amenities', currentAmenities.filter(a => a !== amenity));
        } else {
            setData('amenities', [...currentAmenities, amenity]);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center space-x-8 mb-8">
            {[1, 2, 3, 4, 5, 6].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        step === currentStep 
                            ? 'bg-[#065033] border-[#065033] text-white' 
                            : step < currentStep 
                                ? 'bg-[#065033] border-[#065033] text-white'
                                : 'bg-white border-gray-300 text-gray-500'
                    }`}>
                        {step < currentStep ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <span className="text-sm font-medium">{step}</span>
                        )}
                    </div>
                    <div className={`ml-3 ${step === currentStep ? 'text-[#065033]' : 'text-gray-500'}`}>
                        <div className="text-sm font-medium">
                            {step === 1 && __('Localisation')}
                            {step === 2 && __('Informations')}
                            {step === 3 && __('Détails')}
                            {step === 4 && __('Contact')}
                            {step === 5 && __('Photos')}
                            {step === 6 && __('Review')}
                        </div>
                    </div>
                    {step < 6 && (
                        <div className={`w-16 h-0.5 ml-3 ${step < currentStep ? 'bg-[#065033]' : 'bg-gray-300'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                    {__('Où se trouve votre propriété ?')}
                </h3>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                    {__('Adresse complète')} *
                </label>
                <textarea
                    value={data.adresse_complete}
                    onChange={(e) => setData('adresse_complete', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    placeholder="123 Rue de la Paix, 75001 Paris"
                />
                {errors.adresse_complete && <p className="text-sm text-red-600 font-inter mt-1">{errors.adresse_complete}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Pays')} *
                    </label>
                    <select
                        value={data.pays}
                        onChange={(e) => setData('pays', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    >
                        {countries.map(country => (
                            <option key={country.value} value={country.value}>
                                {country.label}
                            </option>
                        ))}
                    </select>
                    {errors.pays && <p className="text-sm text-red-600 font-inter mt-1">{errors.pays}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Ville')} *
                    </label>
                    <input
                        type="text"
                        value={data.ville}
                        onChange={(e) => setData('ville', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                        placeholder="Paris"
                    />
                    {errors.ville && <p className="text-sm text-red-600 font-inter mt-1">{errors.ville}</p>}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                    {__('Informations principales')}
                </h3>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                    {__('Type de propriété')} *
                </label>
                <select
                    value={data.type_propriete}
                    onChange={(e) => setData('type_propriete', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                >
                    <option value="">{__('Sélectionnez un type')}</option>
                    {propertyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
                {errors.type_propriete && <p className="text-sm text-red-600 font-inter mt-1">{errors.type_propriete}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Prix de vente (€)')} *
                    </label>
                    <input
                        type="number"
                        value={data.prix}
                        onChange={(e) => setData('prix', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                        placeholder="250000"
                    />
                    {errors.prix && <p className="text-sm text-red-600 font-inter mt-1">{errors.prix}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Superficie (m²)')} *
                    </label>
                    <input
                        type="number"
                        value={data.superficie_m2}
                        onChange={(e) => setData('superficie_m2', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                        placeholder="75"
                    />
                    {errors.superficie_m2 && <p className="text-sm text-red-600 font-inter mt-1">{errors.superficie_m2}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                    {__('Description de la propriété')}
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    placeholder={__('Décrivez votre propriété...')}
                />
                {errors.description && <p className="text-sm text-red-600 font-inter mt-1">{errors.description}</p>}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                    {__('Détails de la propriété')}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Nombre de pièces')}
                    </label>
                    <input
                        type="number"
                        value={data.nombre_pieces}
                        onChange={(e) => setData('nombre_pieces', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Nombre de chambres')}
                    </label>
                    <input
                        type="number"
                        value={data.nombre_chambres}
                        onChange={(e) => setData('nombre_chambres', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Nombre de salles de bain')}
                    </label>
                    <input
                        type="number"
                        value={data.nombre_salles_bain}
                        onChange={(e) => setData('nombre_salles_bain', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Étage')}
                    </label>
                    <input
                        type="number"
                        value={data.etage}
                        onChange={(e) => setData('etage', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Année de construction')}
                    </label>
                    <input
                        type="number"
                        value={data.annee_construction}
                        onChange={(e) => setData('annee_construction', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Charges mensuelles (€)')}
                    </label>
                    <input
                        type="number"
                        value={data.charges_mensuelles}
                        onChange={(e) => setData('charges_mensuelles', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('État de la propriété')}
                    </label>
                    <select
                        value={data.etat_propriete}
                        onChange={(e) => setData('etat_propriete', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    >
                        <option value="">{__('Sélectionnez un état')}</option>
                        {propertyConditions.map(condition => (
                            <option key={condition.value} value={condition.value}>
                                {condition.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                        {__('Type de chauffage')}
                    </label>
                    <select
                        value={data.type_chauffage}
                        onChange={(e) => setData('type_chauffage', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    >
                        <option value="">{__('Sélectionnez un type')}</option>
                        {heatingTypes.map(heating => (
                            <option key={heating.value} value={heating.value}>
                                {heating.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={data.meuble}
                        onChange={(e) => setData('meuble', e.target.checked)}
                        className="rounded border-gray-300 text-[#065033] focus:ring-[#065033]"
                    />
                    <span className="ml-2 text-sm text-[#000] font-inter">
                        {__('Meublé')}
                    </span>
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                    {__('Informations complémentaires')}
                </label>
                <textarea
                    value={data.informations_complementaires}
                    onChange={(e) => setData('informations_complementaires', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                    placeholder={__('Informations supplémentaires...')}
                />
            </div>

            <div>
                <h4 className="text-lg font-semibold text-[#000] font-inter mb-4">
                    {__('Équipements et commodités')}
                </h4>
                <p className="text-sm text-gray-600 font-inter mb-4">
                    {__('Sélectionnez les équipements disponibles')}
                </p>

                {availableAmenities.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="mb-6">
                        <h5 className="font-medium text-[#000] font-inter mb-3">
                            {category.category}
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {category.items.map((amenity, amenityIndex) => {
                                const IconComponent = Icons[amenity.icon];
                                const isSelected = Array.isArray(data.amenities) && data.amenities.includes(amenity.value);
                                
                                return (
                                    <button
                                        key={amenityIndex}
                                        type="button"
                                        onClick={() => toggleAmenity(amenity.value)}
                                        className={`flex items-center p-3 border rounded-lg transition-colors ${
                                            isSelected
                                                ? 'border-[#065033] bg-[#065033] text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-[#065033]'
                                        }`}
                                    >
                                        {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                                        <span className="text-sm font-inter">{amenity.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                    {__('Combien de contacts souhaitez-vous ?')}
                </h3>
                <p className="text-gray-600 font-inter mb-6">
                    {__('Plus vous choisissez de contacts, plus vous avez de chances de vendre rapidement')}
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                    {__('Nombre de contacts souhaités')}
                </label>
                <select
                    value={data.contacts_souhaites}
                    onChange={(e) => setData('contacts_souhaites', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065033] focus:border-transparent"
                >
                    {[1, 2, 3, 4, 5, 10, 15, 20].map(num => (
                        <option key={num} value={num}>
                            {num} {num === 1 ? __('contact') : __('contacts')}
                        </option>
                    ))}
                </select>
                {errors.contacts_souhaites && <p className="text-sm text-red-600 font-inter mt-1">{errors.contacts_souhaites}</p>}
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                    {__('Ajoutez des photos de votre propriété')}
                </h3>
                <p className="text-gray-600 font-inter mb-6">
                    {__('Cliquez ou glissez-déposez jusqu\'à 10 images')}
                </p>
            </div>

            {existingImages.length > 0 && (
                <div>
                    <h4 className="font-medium text-[#000] font-inter mb-3">
                        {__('Images existantes')}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {existingImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={`/storage/${image.chemin_fichier}`}
                                    alt={`Property ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                    onError={(e) => {
                                        // Prevent infinite loop by checking if we already tried the fallback
                                        if (!e.target.dataset.fallbackAttempted) {
                                            e.target.dataset.fallbackAttempted = 'true';
                                            // Try the backup image serving route
                                            e.target.src = `/images/${image.chemin_fichier}`;
                                        } else {
                                            // Final fallback - show placeholder
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1IiBzdHJva2U9IiNkZGQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                                            e.target.style.backgroundColor = '#f5f5f5';
                                            console.log('Image not found:', image.chemin_fichier);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index, true)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                    ×
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-[#065033] text-white text-xs px-2 py-1 rounded font-inter">
                                        {__('Photo principale')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-[#000] font-inter mb-2">
                    {__('Nouvelles images')}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#065033] transition-colors">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="text-gray-500 font-inter">
                            <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="text-sm">{__('Cliquez pour sélectionner des images')}</p>
                            <p className="text-xs text-gray-400 mt-1">{__('Formats acceptés: JPG, PNG, WebP (max 5 MB par image)')}</p>
                        </div>
                    </label>
                </div>
            </div>

            {imagePreviews.length > 0 && (
                <div>
                    <h4 className="font-medium text-[#000] font-inter mb-3">
                        {__('Nouvelles images sélectionnées')}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview.url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                    ×
                                </button>
                                {index === 0 && existingImages.length === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-[#065033] text-white text-xs px-2 py-1 rounded font-inter">
                                        {__('Photo principale')}
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
                    {__('Conseils pour de bonnes photos')}
                </h4>
                <ul className="text-sm text-[#92400E] font-inter space-y-1">
                    <li>• {__('Prenez des photos avec une bonne luminosité naturelle')}</li>
                    <li>• {__('Montrez les principales pièces et caractéristiques')}</li>
                    <li>• {__('Évitez les photos floues ou sombres')}</li>
                    <li>• {__('La première photo sera celle mise en avant')}</li>
                    <li>• {__('Pensez à photographier les équipements et commodités mentionnés')}</li>
                </ul>
            </div>
        </div>
    );

    const renderStep6 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[#000] font-inter mb-4">
                    {__('Review Your Property Details')}
                </h3>
                <p className="text-gray-600 font-inter mb-6">
                    {__('Please review all information before updating your property')}
                </p>
            </div>

            {/* Property Summary */}
            <div className="bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg p-6">
                <h4 className="text-lg font-semibold text-[#000] font-inter mb-4">
                    {__('Property Summary')}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h5 className="font-medium text-[#000] font-inter mb-3">{__('Basic Information')}</h5>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-[#6C6C6C] font-inter">{__('Type')}:</span>
                                <span className="font-medium text-[#000] font-inter">{data.type_propriete}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#6C6C6C] font-inter">{__('Price')}:</span>
                                <span className="font-medium text-[#000] font-inter">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.prix)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#6C6C6C] font-inter">{__('Surface Area')}:</span>
                                <span className="font-medium text-[#000] font-inter">{data.superficie_m2} m²</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#6C6C6C] font-inter">{__('Location')}:</span>
                                <span className="font-medium text-[#000] font-inter">{data.ville}, {data.pays}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h5 className="font-medium text-[#000] font-inter mb-3">{__('Property Details')}</h5>
                        <div className="space-y-2">
                            {data.nombre_pieces && (
                                <div className="flex justify-between">
                                    <span className="text-[#6C6C6C] font-inter">{__('Rooms')}:</span>
                                    <span className="font-medium text-[#000] font-inter">{data.nombre_pieces}</span>
                                </div>
                            )}
                            {data.nombre_chambres && (
                                <div className="flex justify-between">
                                    <span className="text-[#6C6C6C] font-inter">{__('Bedrooms')}:</span>
                                    <span className="font-medium text-[#000] font-inter">{data.nombre_chambres}</span>
                                </div>
                            )}
                            {data.nombre_salles_bain && (
                                <div className="flex justify-between">
                                    <span className="text-[#6C6C6C] font-inter">{__('Bathrooms')}:</span>
                                    <span className="font-medium text-[#000] font-inter">{data.nombre_salles_bain}</span>
                                </div>
                            )}
                            {data.etage && (
                                <div className="flex justify-between">
                                    <span className="text-[#6C6C6C] font-inter">{__('Floor')}:</span>
                                    <span className="font-medium text-[#000] font-inter">{data.etage}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-[#6C6C6C] font-inter">{__('Contacts Desired')}:</span>
                                <span className="font-medium text-[#000] font-inter">{data.contacts_souhaites}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {data.description && (
                    <div className="mt-6 pt-6 border-t border-[#EAEAEA]">
                        <h5 className="font-medium text-[#000] font-inter mb-3">{__('Description')}</h5>
                        <p className="text-[#6C6C6C] font-inter">{data.description}</p>
                    </div>
                )}
                
                {data.amenities && data.amenities.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-[#EAEAEA]">
                        <h5 className="font-medium text-[#000] font-inter mb-3">{__('Amenities')}</h5>
                        <div className="flex flex-wrap gap-2">
                            {data.amenities.map((amenity, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#065033] text-white font-inter">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {(existingImages.length > 0 || imagePreviews.length > 0) && (
                    <div className="mt-6 pt-6 border-t border-[#EAEAEA]">
                        <h5 className="font-medium text-[#000] font-inter mb-3">{__('Images')}</h5>
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                            {existingImages.map((image, index) => (
                                <img
                                    key={`existing-${index}`}
                                    src={`/storage/${image.chemin_fichier}`}
                                    alt={`Property ${index + 1}`}
                                    className="w-full h-16 object-cover rounded border"
                                    onError={(e) => {
                                        if (!e.target.dataset.fallbackAttempted) {
                                            e.target.dataset.fallbackAttempted = 'true';
                                            e.target.src = `/images/${image.chemin_fichier}`;
                                        } else {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1IiBzdHJva2U9IiNkZGQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                                            e.target.style.backgroundColor = '#f5f5f5';
                                        }
                                    }}
                                />
                            ))}
                            {imagePreviews.map((preview, index) => (
                                <img
                                    key={`new-${index}`}
                                    src={preview.url}
                                    alt={`New ${index + 1}`}
                                    className="w-full h-16 object-cover rounded border border-green-300"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Update Confirmation */}
            {showUpdateConfirmation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1">
                            <h4 className="font-semibold text-blue-900 font-inter mb-2">
                                {__('Confirm Property Update')}
                            </h4>
                            <p className="text-blue-800 font-inter text-sm mb-4">
                                {__('Are you sure you want to update this property with the information shown above? This action will save all your changes.')}
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={confirmUpdate}
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium font-inter transition-colors disabled:opacity-50"
                                >
                                    {processing ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {__('Updating...')}
                                        </div>
                                    ) : (
                                        __('Yes, Update Property')
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateConfirmation(false)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium font-inter transition-colors"
                                >
                                    {__('Cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Information Message */}
            {!showUpdateConfirmation && (
                <div className="bg-[#FEF3CD] border border-[#FDE68A] rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-[#92400E]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h4 className="font-semibold text-[#92400E] font-inter">
                                {__('Review Before Updating')}
                            </h4>
                            <p className="text-[#92400E] font-inter text-sm mt-1">
                                {__('Please review all the information above. Click "Update Property" to proceed to the confirmation step, where you can finalize your property update.')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
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
                            {__('Edit Property')}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={__('Modifier la propriété') + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-8">
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-black font-inter">
                                {__('Modifier la propriété')}
                            </h2>
                            <p className="mt-2 text-[#6C6C6C] font-inter">
                                {__('Modifiez les informations de votre propriété')}
                            </p>
                            {property.statut && (
                                <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium font-inter ${
                                    property.statut === 'PUBLIE' ? 'bg-[#CEE8DE] text-[#065033]' :
                                    property.statut === 'EN_ATTENTE' ? 'bg-[#FEF3CD] text-[#92400E]' :
                                    property.statut === 'REJETE' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {property.statut === 'PUBLIE' && __('Publié')}
                                    {property.statut === 'EN_ATTENTE' && __('En attente')}
                                    {property.statut === 'REJETE' && __('Rejeté')}
                                    {property.statut === 'VENDU' && __('Vendu')}
                                </div>
                            )}
                        </div>

                        {renderStepIndicator()}

                        <form onSubmit={submit} className="space-y-6">
                            {renderCurrentStep()}

                            <div className="flex justify-between pt-6 border-t border-[#EAEAEA]">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className={`px-6 py-2 border border-[#EAEAEA] rounded-lg text-sm font-medium font-inter transition-colors ${
                                        currentStep === 1
                                            ? 'text-[#6C6C6C] cursor-not-allowed bg-[#F5F9FA]'
                                            : 'text-[#6C6C6C] hover:bg-[#F5F9FA] hover:border-[#CEE8DE]'
                                    }`}
                                    disabled={currentStep === 1}
                                >
                                    {__('Précédent')}
                                </button>

                                {currentStep < 6 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className={`px-6 py-2 rounded-lg text-sm font-medium font-inter transition-colors ${
                                            validateStep(currentStep)
                                                ? 'bg-[#065033] text-white hover:bg-[#054028] focus:ring-2 focus:ring-[#065033] focus:ring-offset-2'
                                                : 'bg-[#EAEAEA] text-[#6C6C6C] cursor-not-allowed'
                                        }`}
                                        disabled={!validateStep(currentStep)}
                                    >
                                        {currentStep === 5 ? __('Review Changes') : __('Suivant')}
                                    </button>
                                ) : (
                                    !showUpdateConfirmation && (
                                        <button
                                            type="submit"
                                            className="px-8 py-2 bg-[#065033] text-white rounded-lg text-sm font-medium font-inter hover:bg-[#054028] focus:ring-2 focus:ring-[#065033] focus:ring-offset-2 transition-colors"
                                        >
                                            {__('Update Property')}
                                        </button>
                                    )
                                )}
                            </div>

                            {progress && (
                                <div className="w-full bg-[#EAEAEA] rounded-full h-2 mt-4">
                                    <div
                                        className="bg-[#065033] h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress.percentage}%` }}
                                    ></div>
                                    <p className="text-xs text-[#6C6C6C] font-inter mt-1 text-center">
                                        {__('Upload en cours... :percentage%', { percentage: progress.percentage })}
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
