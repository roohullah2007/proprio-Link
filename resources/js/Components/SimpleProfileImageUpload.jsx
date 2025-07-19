import React, { useState } from 'react';
import { useTranslations } from '@/Utils/translations';
import { router } from '@inertiajs/react';

export default function SimpleProfileImageUpload({ currentImage, onChange, error, userInitials = 'U' }) {
    const { __ } = useTranslations();
    const [previewUrl, setPreviewUrl] = useState(currentImage);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    
    // Update preview URL when currentImage changes
    React.useEffect(() => {
        setPreviewUrl(currentImage);
    }, [currentImage]);

    const uploadImageToServer = async (file) => {
        setIsUploading(true);
        setUploadError(null);
        
        try {
            const formData = new FormData();
            formData.append('profile_image', file);
            
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/profile/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                setPreviewUrl(result.image_url);
                if (onChange) onChange(result.image_url);
                
                // Show success message
                console.log('✅ Profile image uploaded successfully!');
                
                // Refresh the page to update the image everywhere
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('❌ Profile image upload failed:', error);
            setUploadError(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setUploadError('File size too large. Maximum size is 2MB.');
                return;
            }
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setUploadError('File type not allowed. Please upload JPG, PNG, or GIF images only.');
                return;
            }
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
            
            // Upload to server
            uploadImageToServer(file);
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

    const removeImage = async () => {
        setIsUploading(true);
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/profile/remove-image-new', {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                setPreviewUrl(null);
                if (onChange) onChange(null);
                
                // Refresh the page
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                throw new Error(result.message || 'Removal failed');
            }
        } catch (error) {
            console.error('❌ Profile image removal failed:', error);
            setUploadError(error.message);
        } finally {
            setIsUploading(false);
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
                            {!isUploading && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                                    title={__("Remove image")}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-[#065033] to-[#0a7042] rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-white font-inter">
                                {getInitials()}
                            </span>
                        </div>
                    )}
                    
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                            className={`inline-flex items-center px-4 py-2 bg-[#065033] border border-[#065033] rounded-lg text-white text-sm font-medium font-inter cursor-pointer transition-colors ${
                                isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#054028]'
                            }`}
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 mr-2 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    {__("Uploading...")}
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    {previewUrl ? __("Change Photo") : __("Upload Photo")}
                                </>
                            )}
                        </label>
                        
                        {previewUrl && !isUploading && (
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
                disabled={isUploading}
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
                    ${isUploading ? 'opacity-50 pointer-events-none' : ''}
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
            {(uploadError || error) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-800 text-sm font-inter">
                            {uploadError || error}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
