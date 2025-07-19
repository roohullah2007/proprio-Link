import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function ProfileDebugInfo() {
    const { props } = usePage();
    const user = props.auth?.user;
    const errors = props.errors || {};

    useEffect(() => {
        console.log('=== PROFILE DEBUG INFO ===');
        console.log('User data:', user);
        console.log('Current errors:', errors);
        console.log('User fields filled:');
        console.log('  prenom:', user?.prenom, '(length:', user?.prenom?.length || 0, ')');
        console.log('  nom:', user?.nom, '(length:', user?.nom?.length || 0, ')');
        console.log('  email:', user?.email, '(length:', user?.email?.length || 0, ')');
        console.log('Errors present:', Object.keys(errors));
        console.log('========================');
    }, [user, errors]);

    if (!user) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
            <h4 className="font-bold mb-2">Debug Info:</h4>
            <div>User: {user.prenom} {user.nom}</div>
            <div>Email: {user.email}</div>
            <div>Errors: {Object.keys(errors).join(', ') || 'None'}</div>
            <div>Profile Image: {user.profile_image ? 'Yes' : 'No'}</div>
        </div>
    );
}
