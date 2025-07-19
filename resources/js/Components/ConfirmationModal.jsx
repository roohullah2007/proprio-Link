import React from 'react';
import Modal from './Modal';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { __ } from '@/Utils/translations';

export default function ConfirmationModal({
    show = false,
    onClose = () => {},
    onConfirm = () => {},
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary', // 'primary', 'success', 'warning', 'danger'
    icon = null,
    processing = false,
    confirmButtonClass = '',
    maxWidth = 'md'
}) {
    const getVariantClasses = () => {
        switch (variant) {
            case 'success':
                return {
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    buttonBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
                    defaultIcon: (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            case 'warning':
                return {
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600',
                    buttonBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                    defaultIcon: (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    )
                };
            case 'danger':
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    buttonBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    defaultIcon: (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    )
                };
            default:
                return {
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    buttonBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                    defaultIcon: (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
        }
    };

    const variantClasses = getVariantClasses();
    const displayIcon = icon || variantClasses.defaultIcon;

    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth} closeable={!processing}>
            <div className="p-6">
                <div className="flex items-start">
                    {/* Icon */}
                    <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${variantClasses.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                        <div className={variantClasses.iconColor}>
                            {displayIcon}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">
                            {title}
                        </h3>
                        <div className="mt-3">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <SecondaryButton
                        onClick={onClose}
                        disabled={processing}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </SecondaryButton>
                    
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${variantClasses.buttonBg} ${confirmButtonClass}`}
                    >
                        {processing ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {__('Traitement...')}
                            </div>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
