import React from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/translations';

// Icons
const Icons = {
    Mail: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    ArrowLeft: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    Key: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
    )
};

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title={__("Forgot your password?") + " - Proprio Link"} />

            {/* Header */}
            <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mb-4">
                    <Icons.Key className="w-8 h-8 text-[#2563EB]" />
                </div>
                <h1 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                    {__("Forgot your password?")}
                </h1>
                <p className="text-[#6C6C6C] font-inter text-center text-sm">
                    {__("No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.")}
                </p>
            </div>

            {/* Status Message */}
            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-800 font-inter">{status}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Form */}
            <form onSubmit={submit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#2563EB] transition-colors">
                        <div className="flex-none w-4 h-4">
                            <Icons.Mail className="w-4 h-4 text-[#4E5051]" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            placeholder={__("Email address")}
                            className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center items-center px-4 py-3 h-[35px] bg-[#2563EB] border border-[#2563EB] rounded-[100px] text-white font-inter font-medium text-[14px] hover:bg-[#1D4ED8] focus:outline-none focus:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? __("Sending...") : __("Email Password Reset Link")}
                    </button>
                </div>

                {/* Back to Login Link */}
                <div className="text-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium font-inter"
                    >
                        <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                        {__("Back to login")}
                    </Link>
                </div>
            </form>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 font-inter mb-2">
                    {__("Need help?")}
                </h3>
                <p className="text-sm text-gray-600 font-inter">
                    {__("If you don't receive an email within a few minutes, please check your spam folder.")}
                </p>
            </div>
        </GuestLayout>
    );
}
