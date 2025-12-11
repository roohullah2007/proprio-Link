import React, { useState } from 'react';

const PropertyImage = ({ 
    image, 
    alt = "Property image", 
    className = "", 
    fallbackClassName = "",
    showPlaceholder = true,
    debug = false // Add debug prop
}) => {
    const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [loadAttempts, setLoadAttempts] = useState([]);

    // Generate multiple fallback URLs
    const generateImageUrls = (imagePath) => {
        if (!imagePath) return [];
        
        return [
            `/storage/${imagePath}`,
            `/images/${imagePath}`,
            `/storage/${imagePath}`, // Direct storage access
            `${window.location.origin}/storage/${imagePath}` // Full URL fallback
        ].filter(Boolean);
    };

    const imageUrls = image?.chemin_fichier ? generateImageUrls(image.chemin_fichier) : [];

    const handleError = () => {
        const failedUrl = imageUrls[currentSrcIndex];
        const attempt = { url: failedUrl, success: false, timestamp: new Date().toISOString() };
        setLoadAttempts(prev => [...prev, attempt]);
        
        console.warn('🖼️ Property Image failed to load:', failedUrl);
        console.log('📊 Image info:', {
            imageId: image?.id,
            cheminFichier: image?.chemin_fichier,
            attemptNumber: currentSrcIndex + 1,
            totalUrls: imageUrls.length
        });
        
        if (currentSrcIndex < imageUrls.length - 1) {
            setCurrentSrcIndex(prev => prev + 1);
        } else {
            console.error('❌ All property image fallbacks failed for:', image);
            setHasError(true);
        }
    };

    const handleLoad = () => {
        const successUrl = imageUrls[currentSrcIndex];
        const attempt = { url: successUrl, success: true, timestamp: new Date().toISOString() };
        setLoadAttempts(prev => [...prev, attempt]);
        
        console.log('✅ Property Image loaded successfully:', successUrl);
        setHasError(false);
    };

    // Placeholder SVG
    const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#f3f4f6"/>
            <rect x="80" y="75" width="240" height="150" fill="#e5e7eb"/>
            <rect x="100" y="95" width="80" height="60" fill="#d1d5db"/>
            <rect x="220" y="95" width="80" height="60" fill="#d1d5db"/>
            <rect x="100" y="170" width="200" height="40" fill="#d1d5db"/>
            <text x="200" y="250" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="16">Property Image</text>
        </svg>
    `)}`;

    if (!imageUrls.length || hasError) {
        if (!showPlaceholder) return null;
        
        // Log debug info when showing placeholder
        console.log('🎨 Showing placeholder for property image:', {
            hasImageData: !!image,
            cheminFichier: image?.chemin_fichier,
            imageUrlsLength: imageUrls.length,
            hasError,
            loadAttempts
        });
        
        return (
            <div className={`bg-gray-200 flex items-center justify-center ${fallbackClassName || className}`}>
                <img 
                    src={placeholderSvg}
                    alt={alt}
                    className={className}
                />
                {debug && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs p-1">
                        No Image
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <img
                src={imageUrls[currentSrcIndex]}
                alt={alt}
                className={className}
                onError={handleError}
                onLoad={handleLoad}
                loading="lazy"
            />
            {debug && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs p-1">
                    {currentSrcIndex + 1}/{imageUrls.length}
                </div>
            )}
        </div>
    );
};

export default PropertyImage;
