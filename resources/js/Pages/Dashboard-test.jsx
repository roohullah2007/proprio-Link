import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="bg-white p-6 rounded-lg">
                        <h1>Dashboard works!</h1>
                        <p>User: {auth.user.prenom} {auth.user.nom}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
