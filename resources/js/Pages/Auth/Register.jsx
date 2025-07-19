import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/translations';

// Icons
const Icons = {
    User: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Mail: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Phone: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    Lock: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    ),
    Building: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-2 4h2" />
        </svg>
    ),
    Document: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
    )
};

export default function Register({ userType }) {
    // Check if user type is specified in URL or props
    const urlParams = new URLSearchParams(window.location.search);
    const defaultUserType = userType || urlParams.get('type') === 'agent' ? 'AGENT' : 'PROPRIETAIRE';
    
    const { data, setData, post, processing, errors, reset } = useForm({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        password: '',
        password_confirmation: '',
        type_utilisateur: defaultUserType,
        numero_siret: '',
        licence_professionnelle: null,
    });

    const [selectedUserType, setSelectedUserType] = useState(defaultUserType);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isAgentRegistration = defaultUserType === 'AGENT';

    const handleUserTypeChange = (type) => {
        setSelectedUserType(type);
        setData('type_utilisateur', type);
        
        // Clear agent-specific fields when switching to propriétaire
        if (type === 'PROPRIETAIRE') {
            setData({
                ...data,
                type_utilisateur: type,
                numero_siret: '',
                licence_professionnelle: null,
            });
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={__("Register") + " - Proprio Link"} />

            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                    {isAgentRegistration ? __("Create Agent Account") : __("Create a Proprio Link Account")}
                </h1>
                <p className="text-[#6C6C6C] font-inter">
                    {isAgentRegistration ? __("Join as a real estate agent") : __("Join our real estate platform")}
                </p>
                {isAgentRegistration && (
                    <div className="mt-3 p-3 bg-[#F0F9F4] border border-[#D1F2D9] rounded-lg">
                        <p className="text-sm text-[#065033] font-inter">
                            {__("Agent accounts can purchase property owner contact information")}
                        </p>
                    </div>
                )}
            </div>

            {/* User Type Selection */}
            <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 font-inter mb-3">
                    {__("I am:")}
                </p>
                <div className="grid grid-cols-1 gap-3">
                    {/* Property Owner Option */}
                    <label className={`relative cursor-pointer rounded-lg border p-3 transition-all ${
                        selectedUserType === 'PROPRIETAIRE' 
                            ? 'border-[#065033] bg-[#065033]/5' 
                            : 'border-gray-300 hover:border-gray-400'
                    }`}>
                        <input
                            type="radio"
                            name="user_type"
                            value="PROPRIETAIRE"
                            checked={selectedUserType === 'PROPRIETAIRE'}
                            onChange={() => handleUserTypeChange('PROPRIETAIRE')}
                            className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedUserType === 'PROPRIETAIRE' 
                                    ? 'border-[#065033] bg-[#065033]' 
                                    : 'border-gray-300'
                            }`}>
                                {selectedUserType === 'PROPRIETAIRE' && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <Icons.Building className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium text-gray-900 font-inter text-sm">
                                        {__("Property Owner")}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 font-inter">
                                    {__("I want to sell my property")}
                                </p>
                            </div>
                        </div>
                    </label>

                    {/* Real Estate Agent Option */}
                    <label className={`relative cursor-pointer rounded-lg border p-3 transition-all ${
                        selectedUserType === 'AGENT' 
                            ? 'border-[#065033] bg-[#065033]/5' 
                            : 'border-gray-300 hover:border-gray-400'
                    }`}>
                        <input
                            type="radio"
                            name="user_type"
                            value="AGENT"
                            checked={selectedUserType === 'AGENT'}
                            onChange={() => handleUserTypeChange('AGENT')}
                            className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedUserType === 'AGENT' 
                                    ? 'border-[#065033] bg-[#065033]' 
                                    : 'border-gray-300'
                            }`}>
                                {selectedUserType === 'AGENT' && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <Icons.User className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium text-gray-900 font-inter text-sm">
                                        {__("Real Estate Agent")}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 font-inter">
                                    {__("I help property owners with real estate services")}
                                </p>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={submit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                            <div className="flex-none w-4 h-4">
                                <Icons.User className="w-4 h-4 text-[#4E5051]" />
                            </div>
                            <input
                                name="prenom"
                                value={data.prenom}
                                autoComplete="given-name"
                                placeholder={__("First Name")}
                                className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                onChange={(e) => setData('prenom', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.prenom} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                            <div className="flex-none w-4 h-4">
                                <Icons.User className="w-4 h-4 text-[#4E5051]" />
                            </div>
                            <input
                                name="nom"
                                value={data.nom}
                                autoComplete="family-name"
                                placeholder={__("Last Name")}
                                className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                onChange={(e) => setData('nom', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.nom} className="mt-2" />
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
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

                {/* Phone Field */}
                <div>
                    <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                        <div className="flex-none w-4 h-4">
                            <Icons.Phone className="w-4 h-4 text-[#4E5051]" />
                        </div>
                        <input
                            type="tel"
                            name="telephone"
                            value={data.telephone}
                            autoComplete="tel"
                            placeholder={__("Phone")}
                            className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                            onChange={(e) => setData('telephone', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.telephone} className="mt-2" />
                </div>

                {/* Agent-specific fields */}
                {selectedUserType === 'AGENT' && (
                    <>
                        {/* SIRET Number */}
                        <div>
                            <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                <div className="flex-none w-4 h-4">
                                    <Icons.Building className="w-4 h-4 text-[#4E5051]" />
                                </div>
                                <input
                                    name="numero_siret"
                                    value={data.numero_siret}
                                    placeholder={__("SIRET Number")}
                                    className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                    onChange={(e) => setData('numero_siret', e.target.value)}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 font-inter ml-4">
                                {__("14 digits only, no spaces")}
                            </p>
                            <InputError message={errors.numero_siret} className="mt-1" />
                        </div>

                        {/* Professional License Upload */}
                        <div>
                            <div className="flex items-center px-4 gap-[10px] w-full h-[35px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                <div className="flex-none w-4 h-4">
                                    <Icons.Document className="w-4 h-4 text-[#4E5051]" />
                                </div>
                                <input
                                    name="licence_professionnelle"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] file:border-0 file:bg-transparent file:text-[14px] file:font-normal file:text-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                    onChange={(e) => setData('licence_professionnelle', e.target.files[0])}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 font-inter ml-4">
                                {__("Professional License (Carte T) - PDF, JPG, PNG (max 10 MB)")}
                            </p>
                            <InputError message={errors.licence_professionnelle} className="mt-1" />
                        </div>
                    </>
                )}

                {/* Password Fields */}
                <div className="space-y-3">
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
                </div>

                {/* Terms and Submit */}
                <div className="space-y-4 pt-2">
                    <p className="text-xs text-gray-600 font-inter text-center">
                        {__("By registering, you accept our terms of service and privacy policy.")}
                    </p>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center items-center px-4 py-3 h-[35px] bg-[#065033] border border-[#065033] rounded-[100px] text-white font-inter font-medium text-[14px] hover:bg-[#054028] focus:outline-none focus:bg-[#054028] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? __("Registering...") : __("Register")}
                    </button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-600 font-inter">
                        {__("Already registered?")} {' '}
                        <Link
                            href={route('login')}
                            className="text-[#065033] hover:text-[#054028] font-medium"
                        >
                            {__("Login")}
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
