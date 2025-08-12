import React, { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslations } from '@/Utils/translations';

// Icons
const EmailIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const KeyIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

export default function VerifyEmail({ status, message, canRequestCode = true }) {
    const { __ } = useTranslations();
    const [verificationMethod, setVerificationMethod] = useState('link'); // 'link' or 'code'
    
    // Form for sending verification link
    const { post, processing } = useForm({});
    
    // Form for sending verification code
    const { post: postCode, processing: processingCode } = useForm({});
    
    // Form for verifying code
    const { data: codeData, setData: setCodeData, post: postVerify, processing: processingVerify, errors: codeErrors } = useForm({
        code: '',
    });

    const submitResendLink = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    const submitSendCode = (e) => {
        e.preventDefault();
        postCode(route('verification.code.send'));
    };

    const submitVerifyCode = (e) => {
        e.preventDefault();
        postVerify(route('verification.code.verify'));
    };

    const handleCodeInput = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCodeData('code', value);
    };

    return (
        <GuestLayout>
            <Head title={__("Email Verification")} />

            {/* Card Header with Icon */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#F5F9FA] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto mb-4">
                    {verificationMethod === 'code' ? (
                        <KeyIcon className="w-8 h-8 text-[#065033]" />
                    ) : (
                        <EmailIcon className="w-8 h-8 text-[#065033]" />
                    )}
                </div>
                <h1 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                    {verificationMethod === 'code' ? __("Enter Verification Code") : __("Verify Your Email")}
                </h1>
            </div>

            {/* Email Verification Required Notice */}
            {(status === 'email-verification-required' || message) && (
                <div className="mb-6 bg-[#FFF3CD] border border-[#FFEAA7] rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="w-5 h-5 bg-[#F39C12] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[#B7791F] font-inter text-sm font-medium mb-1">
                                {__("Email Verification Required")}
                            </p>
                            <p className="text-[#B7791F] font-inter text-sm">
                                {message || __("You must verify your email address before accessing your account.")}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Method Toggle */}
            {canRequestCode && (
                <div className="mb-6">
                    <div className="flex bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setVerificationMethod('link')}
                            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                verificationMethod === 'link'
                                    ? 'bg-white text-[#065033] shadow-sm border border-[#EAEAEA]'
                                    : 'text-[#6C6C6C] hover:text-[#065033]'
                            }`}
                        >
                            {__("Email Link")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setVerificationMethod('code')}
                            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                verificationMethod === 'code'
                                    ? 'bg-white text-[#065033] shadow-sm border border-[#EAEAEA]'
                                    : 'text-[#6C6C6C] hover:text-[#065033]'
                            }`}
                        >
                            {__("Verification Code")}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Message */}
            <div className="mb-6 text-center">
                <p className="text-[#6C6C6C] font-inter text-sm leading-relaxed">
                    {verificationMethod === 'code' 
                        ? __("We'll send a 6-digit verification code to your email address. Enter it below to verify your account.")
                        : __("Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.")
                    }
                </p>
            </div>

            {/* Success Messages */}
            {status === 'verification-link-sent' && verificationMethod === 'link' && (
                <div className="mb-6 bg-[#F0F8FF] border border-[#CEE8DE] rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="w-5 h-5 bg-[#065033] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-[#065033] font-inter text-sm font-medium">
                            {__("A new verification link has been sent to the email address you provided during registration.")}
                        </p>
                    </div>
                </div>
            )}

            {status === 'verification-code-sent' && verificationMethod === 'code' && (
                <div className="mb-6 bg-[#F0F8FF] border border-[#CEE8DE] rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="w-5 h-5 bg-[#065033] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-[#065033] font-inter text-sm font-medium">
                            {__("A verification code has been sent to your email address.")}
                        </p>
                    </div>
                </div>
            )}

            {/* Verification Method Content */}
            {verificationMethod === 'link' ? (
                // Email Link Method
                <form onSubmit={submitResendLink}>
                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full flex justify-center items-center px-6 py-3 gap-2 h-11 bg-[#065033] border border-[#065033] rounded-full font-inter font-medium text-sm text-white transition-all duration-200 hover:bg-[#054028] focus:outline-none focus:bg-[#054028] disabled:opacity-50 disabled:cursor-not-allowed ${
                                processing ? 'opacity-50' : ''
                            }`}
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {__("Sending...")}
                                </>
                            ) : (
                                <>
                                    <EmailIcon className="w-4 h-4" />
                                    {__("Resend Verification Email")}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                // Verification Code Method
                <div className="space-y-4">
                    {/* Send Code Button */}
                    {status !== 'verification-code-sent' && (
                        <form onSubmit={submitSendCode}>
                            <button
                                type="submit"
                                disabled={processingCode}
                                className={`w-full flex justify-center items-center px-6 py-3 gap-2 h-11 bg-[#2563EB] border border-[#2563EB] rounded-full font-inter font-medium text-sm text-white transition-all duration-200 hover:bg-[#1D4ED8] focus:outline-none focus:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed ${
                                    processingCode ? 'opacity-50' : ''
                                }`}
                            >
                                {processingCode ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {__("Sending Code...")}
                                    </>
                                ) : (
                                    <>
                                        <KeyIcon className="w-4 h-4" />
                                        {__("Send Verification Code")}
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Code Input and Verify */}
                    {status === 'verification-code-sent' && (
                        <form onSubmit={submitVerifyCode} className="space-y-4">
                            <div>
                                <div className="flex items-center justify-center">
                                    <input
                                        type="text"
                                        value={codeData.code}
                                        onChange={handleCodeInput}
                                        placeholder="000000"
                                        maxLength="6"
                                        className="w-32 h-12 text-center text-2xl font-mono font-bold border-2 border-[#EAEAEA] rounded-lg focus:border-[#065033] focus:outline-none transition-colors tracking-widest"
                                    />
                                </div>
                                <InputError message={codeErrors.code} className="mt-2 text-center" />
                                <p className="text-xs text-[#6C6C6C] text-center mt-2">
                                    {__("Enter the 6-digit code sent to your email")}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processingVerify || codeData.code.length !== 6}
                                className={`w-full flex justify-center items-center px-6 py-3 gap-2 h-11 bg-[#065033] border border-[#065033] rounded-full font-inter font-medium text-sm text-white transition-all duration-200 hover:bg-[#054028] focus:outline-none focus:bg-[#054028] disabled:opacity-50 disabled:cursor-not-allowed ${
                                    processingVerify ? 'opacity-50' : ''
                                }`}
                            >
                                {processingVerify ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {__("Verifying...")}
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="w-4 h-4" />
                                        {__("Verify Code")}
                                    </>
                                )}
                            </button>

                            {/* Resend Code */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={submitSendCode}
                                    disabled={processingCode}
                                    className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors disabled:opacity-50"
                                >
                                    {__("Didn't receive the code? Send again")}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Secondary Actions */}
            <div className="text-center pt-6 border-t border-[#EAEAEA] mt-6">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="inline-flex items-center gap-2 text-sm text-[#6C6C6C] font-inter hover:text-[#065033] transition-colors duration-200 underline decoration-1 underline-offset-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {__("Log Out")}
                </Link>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-[#EAEAEA]">
                <div className="bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-[#696969] font-inter mb-2">
                        {__("Need Help?")}
                    </h3>
                    <ul className="text-xs text-[#6C6C6C] font-inter space-y-1">
                        <li>• {__("Check your spam or junk folder")}</li>
                        <li>• {__("Make sure you entered the correct email address")}</li>
                        <li>• {__("Verification codes expire after 15 minutes")}</li>
                        <li>• {__("Email links expire after 24 hours")}</li>
                    </ul>
                </div>
            </div>
        </GuestLayout>
    );
}
