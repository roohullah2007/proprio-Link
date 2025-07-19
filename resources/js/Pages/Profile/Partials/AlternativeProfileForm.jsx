import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SimpleProfileImageUpload from '@/Components/SimpleProfileImageUpload';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useTranslations } from '@/Utils/translations';
import { useEffect } from 'react';

export default function AlternativeProfileForm({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { __ } = useTranslations();

    const { data, setData, patch, errors, processing, recentlySuccessful, clearErrors } =
        useForm({
            prenom: user.prenom || '',
            nom: user.nom || '',
            email: user.email || '',
            telephone: user.telephone || '',
            numero_siret: user.numero_siret || '',
            licence_professionnelle: null,
        });

    // Clear errors when data changes
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const timeoutId = setTimeout(() => {
                clearErrors();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [data.prenom, data.nom, data.email, data.telephone]);

    const submit = (e) => {
        e.preventDefault();
        
        console.log('Profile form submission (no image)', {
            formData: {
                prenom: data.prenom,
                nom: data.nom,
                email: data.email,
                telephone: data.telephone,
                numero_siret: data.numero_siret
            }
        });
        
        clearErrors();
        
        // Submit only text data - no files
        patch(route('profile.update'), {
            onSuccess: (page) => {
                console.log('✅ Profile updated successfully!');
                clearErrors();
            },
            onError: (errors) => {
                console.error('❌ Profile update failed:', errors);
            },
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            {/* Profile Image Upload - Separate from form */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-[#000] font-inter mb-4">
                    {__("Profile Photo")}
                </h3>
                <SimpleProfileImageUpload
                    currentImage={user.profile_image_url}
                    userInitials={`${user.prenom?.[0]?.toUpperCase() || ''}${user.nom?.[0]?.toUpperCase() || ''}`}
                />
            </div>

            {/* Profile Information Form - Text only */}
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-[#000] font-inter mb-4">
                        {__("Profile Information")}
                    </h3>
                </div>

                {/* Hidden username field for accessibility */}
                <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    value={data.email}
                    style={{ display: 'none' }}
                    readOnly
                    aria-hidden="true"
                />

                {/* Two columns layout for names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel 
                            htmlFor="prenom" 
                            value={__("First Name")}
                            className="text-sm font-medium text-[#000] font-inter mb-2"
                        />
                        <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                            <TextInput
                                id="prenom"
                                className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                value={data.prenom}
                                onChange={(e) => setData('prenom', e.target.value)}
                                required
                                autoComplete="given-name"
                                placeholder={__("Enter your first name")}
                            />
                        </div>
                        <InputError className="mt-2" message={errors.prenom} />
                    </div>

                    <div>
                        <InputLabel 
                            htmlFor="nom" 
                            value={__("Last Name")}
                            className="text-sm font-medium text-[#000] font-inter mb-2"
                        />
                        <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                            <TextInput
                                id="nom"
                                className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                required
                                autoComplete="family-name"
                                placeholder={__("Enter your last name")}
                            />
                        </div>
                        <InputError className="mt-2" message={errors.nom} />
                    </div>
                </div>

                {/* Email field */}
                <div>
                    <InputLabel 
                        htmlFor="email" 
                        value={__("Email Address")}
                        className="text-sm font-medium text-[#000] font-inter mb-2"
                    />
                    <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                        <TextInput
                            id="email"
                            type="email"
                            className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder={__("Enter your email address")}
                        />
                    </div>
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Phone field */}
                <div>
                    <InputLabel 
                        htmlFor="telephone" 
                        value={__("Phone Number")}
                        className="text-sm font-medium text-[#000] font-inter mb-2"
                    />
                    <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                        <TextInput
                            id="telephone"
                            type="tel"
                            className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                            value={data.telephone}
                            onChange={(e) => setData('telephone', e.target.value)}
                            autoComplete="tel"
                            placeholder={__("Enter your phone number")}
                        />
                    </div>
                    <InputError className="mt-2" message={errors.telephone} />
                </div>

                {/* Agent-specific fields */}
                {user.type_utilisateur === 'AGENT' && (
                    <>
                        {/* SIRET Number field */}
                        <div>
                            <InputLabel 
                                htmlFor="numero_siret" 
                                value={__("SIRET Number")}
                                className="text-sm font-medium text-[#000] font-inter mb-2"
                            />
                            <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                <TextInput
                                    id="numero_siret"
                                    type="text"
                                    className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                                    value={data.numero_siret}
                                    onChange={(e) => setData('numero_siret', e.target.value)}
                                    placeholder={__("Enter your SIRET number")}
                                />
                            </div>
                            <InputError className="mt-2" message={errors.numero_siret} />
                        </div>

                        {/* Professional License Upload field */}
                        <div>
                            <InputLabel 
                                htmlFor="licence_professionnelle" 
                                value={__("Professional License")}
                                className="text-sm font-medium text-[#000] font-inter mb-2"
                            />
                            
                            {/* Current License Display */}
                            {user.licence_professionnelle_url && (
                                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm text-green-800 font-medium font-inter">
                                                {__("Current License Uploaded")}
                                            </span>
                                        </div>
                                        <a 
                                            href={user.licence_professionnelle_url.startsWith('http') ? user.licence_professionnelle_url : `/storage/${user.licence_professionnelle_url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[#065033] hover:text-[#054028] text-sm font-medium underline"
                                        >
                                            {__('View Current License')}
                                        </a>
                                    </div>
                                </div>
                            )}
                            
                            {/* File Upload */}
                            <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                                <svg className="w-4 h-4 text-[#6C6C6C] flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <label htmlFor="licence_professionnelle" className="flex-1 cursor-pointer">
                                    <span className="text-[14px] leading-[19px] font-normal text-[#5A5A5A]">
                                        {data.licence_professionnelle 
                                            ? data.licence_professionnelle.name 
                                            : user.licence_professionnelle_url 
                                                ? __("Replace License File")
                                                : __("Upload License File (PDF, JPG, PNG)")
                                        }
                                    </span>
                                </label>
                                <input
                                    id="licence_professionnelle"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={(e) => setData('licence_professionnelle', e.target.files[0])}
                                />
                            </div>
                            <div className="mt-1 text-xs text-[#6C6C6C] font-inter">
                                {__("Upload your professional license document (PDF, JPG, PNG). Maximum file size: 5MB")}
                            </div>
                            <InputError className="mt-2" message={errors.licence_professionnelle} />
                        </div>
                    </>
                )}

                {/* Email verification notice */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm text-yellow-800 font-inter">
                                    {__("Your email address is unverified.")}
                                </p>
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="mt-2 text-sm text-yellow-700 underline hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded font-inter"
                                >
                                    {__("Click here to re-send the verification email.")}
                                </Link>
                            </div>
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mt-3 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                                {__("A new verification link has been sent to your email address.")}
                            </div>
                        )}
                    </div>
                )}

                {/* General error display */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm text-red-800 font-inter">
                                    {errors.general}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#EAEAEA]">
                    <div className="flex items-center space-x-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex justify-center items-center px-6 py-3 gap-2 bg-[#065033] border border-[#065033] rounded-lg text-white font-medium font-inter transition-colors hover:bg-[#054028] focus:outline-none focus:bg-[#054028] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing && (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            {__("Save Changes")}
                        </button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in-out duration-300"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="flex items-center space-x-2 text-green-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium font-inter">
                                    {__("Changes saved successfully!")}
                                </span>
                            </div>
                        </Transition>
                    </div>
                </div>
            </form>
        </section>
    );
}
