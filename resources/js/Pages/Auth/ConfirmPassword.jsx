import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/translations';

// Icons
const Icons = {
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

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={__("Confirm Password") + " - Propio"} />

            {/* Header */}
            <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-[#065033]/10 rounded-full flex items-center justify-center mb-4">
                    <Icons.Shield className="w-8 h-8 text-[#065033]" />
                </div>
                <h1 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                    {__("Confirm Password")}
                </h1>
                <p className="text-[#6C6C6C] font-inter">
                    {__("This is a secure area of the application. Please confirm your password before continuing.")}
                </p>
            </div>

            {/* Confirm Password Form */}
            <form onSubmit={submit} className="space-y-4">
                {/* Password Field */}
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
                                autoComplete="current-password"
                                placeholder={__("Password")}
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

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center items-center px-4 py-3 h-[35px] bg-[#065033] border border-[#065033] rounded-[100px] text-white font-inter font-medium text-[14px] hover:bg-[#054028] focus:outline-none focus:bg-[#054028] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? __("Confirming...") : __("Confirm")}
                    </button>
                </div>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Icons.Shield className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 font-inter">
                            {__("Security verification")}
                        </h3>
                        <p className="text-xs text-blue-700 font-inter mt-1">
                            {__("We need to verify your identity before accessing this secure area.")}
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
