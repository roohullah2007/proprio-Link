import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useTranslations } from '@/Utils/translations';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const { __ } = useTranslations();
    
    // State for password visibility toggles
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const PasswordToggleIcon = ({ show }) => (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {show ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            )}
        </svg>
    );

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-6">
                {/* Hidden username field for accessibility */}
                <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    style={{ display: 'none' }}
                    readOnly
                    aria-hidden="true"
                />
                {/* Current Password */}
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value={__("Current Password")}
                        className="text-sm font-medium text-[#000] font-inter mb-2"
                    />
                    <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type={showCurrentPassword ? "text" : "password"}
                            className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                            autoComplete="current-password"
                            placeholder={__("Enter your current password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="flex-none focus:outline-none"
                        >
                            <PasswordToggleIcon show={showCurrentPassword} />
                        </button>
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                {/* New Password */}
                <div>
                    <InputLabel 
                        htmlFor="password" 
                        value={__("New Password")}
                        className="text-sm font-medium text-[#000] font-inter mb-2"
                    />
                    <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type={showNewPassword ? "text" : "password"}
                            className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                            autoComplete="new-password"
                            placeholder={__("Enter a new password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="flex-none focus:outline-none"
                        >
                            <PasswordToggleIcon show={showNewPassword} />
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                    
                    {/* Password requirements */}
                    <div className="mt-2 text-xs text-[#6C6C6C] font-inter">
                        {__("Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.")}
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={__("Confirm New Password")}
                        className="text-sm font-medium text-[#000] font-inter mb-2"
                    />
                    <div className="flex items-center px-4 gap-[10px] w-full h-[39px] bg-white border-[1.5px] border-[#EAEAEA] rounded-[100px] focus-within:border-[#065033] transition-colors">
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type={showConfirmPassword ? "text" : "password"}
                            className="flex-1 border-0 outline-none bg-transparent text-[14px] leading-[19px] font-normal text-[#5A5A5A] placeholder-[#5A5A5A] focus:outline-none focus:ring-0 focus:border-0"
                            autoComplete="new-password"
                            placeholder={__("Confirm your new password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="flex-none focus:outline-none"
                        >
                            <PasswordToggleIcon show={showConfirmPassword} />
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {/* Password strength indicator */}
                {data.password && (
                    <div className="space-y-2">
                        <div className="text-xs text-[#6C6C6C] font-inter">
                            {__("Password Strength")}
                        </div>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4].map((level) => {
                                let strength = 0;
                                if (data.password.length >= 8) strength++;
                                if (/[A-Z]/.test(data.password)) strength++;
                                if (/[0-9]/.test(data.password)) strength++;
                                if (/[^A-Za-z0-9]/.test(data.password)) strength++;
                                
                                return (
                                    <div
                                        key={level}
                                        className={`h-2 flex-1 rounded ${
                                            level <= strength
                                                ? strength === 1 ? 'bg-red-400'
                                                : strength === 2 ? 'bg-yellow-400'
                                                : strength === 3 ? 'bg-blue-400'
                                                : 'bg-green-500'
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                );
                            })}
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
                            {__("Update Password")}
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
                                    {__("Password updated successfully!")}
                                </span>
                            </div>
                        </Transition>
                    </div>
                </div>
            </form>
        </section>
    );
}
