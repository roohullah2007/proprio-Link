import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import AlternativeProfileForm from './Partials/AlternativeProfileForm';
import { useTranslations } from '@/Utils/translations';

// Icons for the profile page
const Icons = {
    User: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Lock: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    ),
    Trash: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    Shield: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    Settings: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
};

export default function Edit({ mustVerifyEmail, status, auth }) {
    const { __ } = useTranslations();
    const user = auth.user;

    const profileSections = [
        {
            id: 'profile-info',
            title: __('Profile Information'),
            description: __('Update your account\'s profile information and email address.'),
            icon: Icons.User,
            color: 'blue',
            component: (
                <AlternativeProfileForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    className="w-full"
                />
            )
        },
        {
            id: 'password',
            title: __('Update Password'),
            description: __('Ensure your account is using a long, random password to stay secure.'),
            icon: Icons.Lock,
            color: 'green',
            component: (
                <UpdatePasswordForm className="w-full" />
            )
        },
        {
            id: 'delete-account',
            title: __('Delete Account'),
            description: __('Permanently delete your account and all associated data.'),
            icon: Icons.Trash,
            color: 'red',
            component: (
                <DeleteUserForm className="w-full" />
            )
        }
    ];

    const colorVariants = {
        blue: {
            bg: 'bg-blue-500',
            light: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200'
        },
        green: {
            bg: 'bg-green-500',
            light: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-200'
        },
        red: {
            bg: 'bg-red-500',
            light: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-200'
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center px-0 gap-[9px] w-full h-[31px]">
                    {/* Left side - Profile title */}
                    <div className="flex-none order-0 flex-grow-0">
                        <h1 className="font-inter font-medium text-[14px] leading-[19px] flex items-center text-[#000] capitalize">
                            {__('Profile Settings')}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={__("Profile") + " - Propio"} />

            <div className="py-8">
                <div className="mx-auto max-w-[1400px] px-8">
                    {/* Profile Header Card */}
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 mb-8">
                        <div className="flex items-start space-x-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {user.profile_image_url || user.profile_image ? (
                                    <img
                                        src={user.profile_image_url || `/storage/${user.profile_image}`}
                                        alt={`${user.prenom} ${user.nom}`}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white font-inter">
                                            {user.prenom?.[0]?.toUpperCase()}{user.nom?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* User Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-[#000] font-inter mb-2">
                                    {user.prenom} {user.nom}
                                </h2>
                                <p className="text-[#6C6C6C] font-inter mb-2">
                                    {user.email}
                                </p>
                                
                                {/* Agent-specific information */}
                                {user.type_utilisateur === 'AGENT' && (
                                    <div className="space-y-1 mb-4">
                                        {user.numero_siret && (
                                            <p className="text-[#6C6C6C] font-inter text-sm">
                                                <span className="font-medium">{__('SIRET Number')}:</span> {user.numero_siret}
                                            </p>
                                        )}
                                        {user.licence_professionnelle_url && (
                                            <p className="text-[#6C6C6C] font-inter text-sm">
                                                <span className="font-medium">{__('Professional License')}:</span> 
                                                <a 
                                                    href={user.licence_professionnelle_url.startsWith('http') ? user.licence_professionnelle_url : `/storage/${user.licence_professionnelle_url}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-[#065033] hover:text-[#054028] underline ml-1"
                                                >
                                                    {__('View License')}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                )}
                                
                                {/* User Type Badge */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <div className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#F5F9FA] border border-[#EAEAEA] rounded-full">
                                        <Icons.Shield className="w-4 h-4 text-[#6C6C6C]" />
                                        <span className="text-[#6C6C6C] text-sm font-medium font-inter whitespace-nowrap">
                                            {user.type_utilisateur === 'PROPRIETAIRE' && __('Property Owner')}
                                            {user.type_utilisateur === 'AGENT' && __('Real Estate Agent')}
                                            {user.type_utilisateur === 'ADMIN' && __('Administrator')}
                                        </span>
                                    </div>

                                    {/* Verification Status */}
                                    {user.est_verifie ? (
                                        <div className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-[#0F44FC] border border-[#0F44FC] rounded-full">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-white text-sm font-medium font-inter whitespace-nowrap">
                                                {__('Verified Account')}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center px-[12px] py-[6px] gap-[8px] min-w-max h-[32px] bg-yellow-500 border border-yellow-500 rounded-full">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-white text-sm font-medium font-inter whitespace-nowrap">
                                                {__('Pending Verification')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Settings Sections */}
                    <div className="space-y-6">
                        {profileSections.map((section, index) => {
                            const IconComponent = section.icon;
                            const colors = colorVariants[section.color];
                            
                            return (
                                <div key={section.id} className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
                                    {/* Section Header */}
                                    <div className="px-6 py-4 bg-[#F5F9FA] border-b border-[#EAEAEA]">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 ${colors.light} rounded-full flex items-center justify-center`}>
                                                <IconComponent className={`w-5 h-5 ${colors.text}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-[#000] font-inter">
                                                    {section.title}
                                                </h3>
                                                <p className="text-sm text-[#6C6C6C] font-inter">
                                                    {section.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Section Content */}
                                    <div className="p-6">
                                        {section.component}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Account Statistics */}
                    <div className="mt-8 bg-white border border-[#EAEAEA] rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-[#696969] font-inter mb-6">
                            {__("Account Information")}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-[#000] font-inter">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-[#6C6C6C] font-inter">
                                    {__("Member Since")}
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-[#000] font-inter">
                                    {user.email_verified_at ? __("Verified") : __("Unverified")}
                                </div>
                                <div className="text-sm text-[#6C6C6C] font-inter">
                                    {__("Email Status")}
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-[#000] font-inter">
                                    {user.derniere_connexion ? new Date(user.derniere_connexion).toLocaleDateString() : __("Never")}
                                </div>
                                <div className="text-sm text-[#6C6C6C] font-inter">
                                    {__("Last Login")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
