import React, { useState } from 'react';
import { useTranslations } from '@/Utils/translations';
import { router } from '@inertiajs/react';

export default function ProfileImageUpload({ currentImage, onChange, error, userInitials = 'U' }) {
    const { __ } = useTranslations();
    const [previewUrl, setPreviewUrl] = useState(currentImage);
    const [isDragging, setIsDragging] = useState(false);
    
    // Update preview URL when currentImage changes (after successful upload)
    React.useEffect(() => {
        setPreviewUrl(currentImage);
    }, [currentImage]);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
            
            // Call onChange with the file
            onChange(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const removeImage = () => {
        if (currentImage && !previewUrl) {
            // If there's a current image from the server, delete it via API
            router.delete(route('profile.remove-image'), {
                preserveScroll: true,
                onSuccess: () => {
                    setPreviewUrl(null);
                    onChange(null);
                },
                onError: (errors) => {
                    console.error('Failed to remove profile image:', errors);
                }
            });
        } else {
            // If it's just a preview, remove it locally
            setPreviewUrl(null);
            onChange(null);
        }
    };

    const getInitials = () => {
        return userInitials;
    };

    return (
        <div className="space-y-4">
            {/* Current/Preview Image */}
            <div className="flex items-center space-x-6">
                <div className="relative">
                    {previewUrl ? (
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt={__("Profile Image")}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                                title={__("Remove image")}
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-[#065033] to-[#0a7042] rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-white font-inter">
                                {getInitials()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h4 className="text-sm font-medium text-[#000] font-inter mb-1">
                        {__("Profile Photo")}
                    </h4>
                    <p className="text-xs text-[#6C6C6C] font-inter mb-3">
                        {__("Upload a photo to personalize your profile. JPG, PNG, or GIF. Max 2MB.")}
                    </p>
                    
                    <div className="flex items-center space-x-3">
                        <label
                            htmlFor="profile_image_input"
                            className="inline-flex items-center px-4 py-2 bg-[#065033] border border-[#065033] rounded-lg text-white text-sm font-medium font-inter cursor-pointer hover:bg-[#054028] transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            {previewUrl ? __("Change Photo") : __("Upload Photo")}
                        </label>
                        
                        {previewUrl && (
                            <button
                                type="button"
                                onClick={removeImage}
                                className="inline-flex items-center px-4 py-2 bg-white border border-[#EAEAEA] rounded-lg text-[#6C6C6C] text-sm font-medium font-inter hover:bg-gray-50 transition-colors"
                            >
                                {__("Remove")}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                id="profile_image_input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Drag and drop area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${isDragging 
                        ? 'border-[#065033] bg-green-50' 
                        : 'border-[#EAEAEA] hover:border-[#065033] hover:bg-green-50'
                    }
                `}
            >
                <div className="space-y-2">
                    <svg 
                        className={`mx-auto w-8 h-8 ${isDragging ? 'text-[#065033]' : 'text-[#6C6C6C]'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                        />
                    </svg>
                    <div className="text-sm">
                        <span className={`font-medium ${isDragging ? 'text-[#065033]' : 'text-[#6C6C6C]'} font-inter`}>
                            {__("Drag and drop your image here")}
                        </span>
                        <p className="text-xs text-[#6C6C6C] font-inter mt-1">
                            {__("or click the Upload Photo button above")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Error display */}
            {error && (
                <div className="text-red-600 text-sm font-inter">
                    {error}
                </div>
            )}
        </div>
    );
}
