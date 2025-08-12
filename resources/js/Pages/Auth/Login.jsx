import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/translations';

// Icons
const Icons = {
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
    User: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    )
};

export default function Login({ status, canResetPassword, intendedUrl, userType }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const isAgentLogin = userType === 'agent' || new URLSearchParams(window.location.search).get('type') === 'agent';

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={__("Login") + " - Proprio Link"} />

            {/* Header */}
            <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mb-4">
                    <Icons.User className="w-8 h-8 text-[#2563EB]" />
                </div>
                <h1 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                    {isAgentLogin ? __("Agent Login") : __("Login to your account")}
                </h1>
                <p className="text-[#6C6C6C] font-inter">
                    {isAgentLogin ? __("Access your agent dashboard") : __("Access your Proprio Link personal space")}
                </p>
                {isAgentLogin && (
                    <div className="mt-3 p-3 bg-[#F0F4FF] border border-[#C5D0FF] rounded-lg">
                        <p className="text-sm text-[#2563EB] font-inter">
                            {__("Login with your agent account to purchase property contacts")}
                        </p>
                    </div>
                )}
            </div>

            {/* Status Message */}
            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-inter">{status}</p>
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={submit} className="space-y-4">
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
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password Field */}
                <div>
                    <div className="relative">
                        <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#2563EB] transition-colors">
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <span className="ml-2 text-sm text-gray-600 font-inter">
                            {__("Remember me")}
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium font-inter"
                        >
                            {__("Forgot your password?")}
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center items-center px-4 py-3 h-[35px] bg-[#2563EB] border border-[#2563EB] rounded-[100px] text-white font-inter font-medium text-[14px] hover:bg-[#1D4ED8] focus:outline-none focus:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? __("Logging in...") : __("Login")}
                    </button>
                </div>

                {/* Register Link */}
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-600 font-inter">
                        {isAgentLogin ? __("Not an agent yet?") : __("Not registered yet?")} {' '}
                        <Link
                            href={isAgentLogin ? route('register') + '?type=agent' : route('register')}
                            className="text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                        >
                            {isAgentLogin ? __("Become an Agent") : __("Register")}
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
