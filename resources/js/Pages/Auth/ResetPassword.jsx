import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/translations';

// Icons
const Icons = {
    Mail: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Lock: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    ),
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    EyeOff: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
    ),
    Shield: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    )
};

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={__("Reset Password") + " - Propio"} />

            {/* Header */}
            <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-[#065033]/10 rounded-full flex items-center justify-center mb-4">
                    <Icons.Shield className="w-8 h-8 text-[#065033]" />
                </div>
                <h1 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                    {__("Reset Password")}
                </h1>
                <p className="text-[#6C6C6C] font-inter">
                    {__("Enter your new password below")}
                </p>
            </div>

            {/* Reset Password Form */}
            <form onSubmit={submit} className="space-y-4">
                {/* Email Field (Read-only) */}
                <div>
                    <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-gray-50 border-[1.5px] border-[#EAEAEA] rounded-[100px]">
                        <div className="flex-none w-4 h-4">
                            <Icons.Mail className="w-4 h-4 text-[#4E5051]" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            readOnly
                            className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-gray-500 focus:outline-none focus:ring-0 focus:border-0"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* New Password Field */}
                <div>
                    <div className="relative">
                        <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                            <div className="flex-none w-4 h-4">
                                <Icons.Lock className="w-4 h-4 text-[#4E5051]" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                placeholder={__("New Password")}
                                className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0 pr-8"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 flex-none w-4 h-4 text-[#4E5051] hover:text-[#065033] transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <div className="relative">
                        <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                            <div className="flex-none w-4 h-4">
                                <Icons.Lock className="w-4 h-4 text-[#4E5051]" />
                            </div>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                placeholder={__("Confirm Password")}
                                className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0 pr-8"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 flex-none w-4 h-4 text-[#4E5051] hover:text-[#065033] transition-colors"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center items-center px-4 py-3 h-[35px] bg-[#065033] border border-[#065033] rounded-[100px] text-white font-inter font-medium text-[14px] hover:bg-[#054028] focus:outline-none focus:bg-[#054028] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? __("Resetting...") : __("Reset Password")}
                    </button>
                </div>
            </form>

            {/* Password Requirements */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 font-inter mb-2">
                    {__("Password requirements:")}
                </h3>
                <ul className="text-xs text-gray-600 font-inter space-y-1">
                    <li>• {__("At least 8 characters long")}</li>
                    <li>• {__("Contains at least one uppercase letter")}</li>
                    <li>• {__("Contains at least one lowercase letter")}</li>
                    <li>• {__("Contains at least one number")}</li>
                </ul>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Icons.Shield className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 font-inter">
                            {__("Security tip")}
                        </h3>
                        <p className="text-xs text-blue-700 font-inter mt-1">
                            {__("Choose a strong, unique password that you haven't used elsewhere.")}
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
