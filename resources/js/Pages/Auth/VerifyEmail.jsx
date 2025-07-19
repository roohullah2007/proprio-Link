import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslations } from '@/Utils/translations';

// Email verification icon
const EmailIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
);

// Check icon for success state
const CheckIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const { __ } = useTranslations();

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title={__("Email Verification")} />

            {/* Card Header with Icon */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#F5F9FA] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto mb-4">
                    <EmailIcon className="w-8 h-8 text-[#065033]" />
                </div>
                <h1 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                    {__("Verify Your Email")}
                </h1>
            </div>

            {/* Main Message */}
            <div className="mb-6 text-center">
                <p className="text-[#6C6C6C] font-inter text-sm leading-relaxed">
                    {__("Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.")}
                </p>
            </div>

            {/* Success Message */}
            {status === 'verification-link-sent' && (
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

            {/* Action Buttons */}
            <form onSubmit={submit}>
                <div className="space-y-4">
                    {/* Primary Action Button */}
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
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                {__("Resend Verification Email")}
                            </>
                        )}
                    </button>

                    {/* Secondary Action */}
                    <div className="text-center pt-4 border-t border-[#EAEAEA]">
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
                </div>
            </form>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-[#EAEAEA]">
                <div className="bg-[#F5F9FA] border border-[#EAEAEA] rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-[#696969] font-inter mb-2">
                        {__("Need Help?")}
                    </h3>
                    <ul className="text-xs text-[#6C6C6C] font-inter space-y-1">
                        <li>• {__("Check your spam or junk folder")}</li>
                        <li>• {__("Make sure you entered the correct email address")}</li>
                        <li>• {__("The verification link expires after 24 hours")}</li>
                    </ul>
                </div>
            </div>
        </GuestLayout>
    );
}