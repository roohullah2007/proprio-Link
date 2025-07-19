import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function DebugProfile() {
    const { props } = usePage();
    const user = props.auth.user;
    const [debugInfo, setDebugInfo] = useState(null);
    const [testResult, setTestResult] = useState(null);

    const { data, setData, post, processing } = useForm({
        prenom: user.prenom || '',
        nom: user.nom || '',
        email: user.email || '',
        telephone: user.telephone || '',
    });

    const fetchDebugInfo = async () => {
        try {
            const response = await fetch('/debug-profile');
            const data = await response.json();
            setDebugInfo(data);
        } catch (error) {
            console.error('Error fetching debug info:', error);
        }
    };

    const testProfileUpdate = async () => {
        try {
            const response = await fetch('/debug-profile-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            setTestResult(result);
        } catch (error) {
            console.error('Error testing profile update:', error);
            setTestResult({ error: error.message });
        }
    };

    const testInertiaUpdate = () => {
        post('/debug-profile-update', {
            onSuccess: (response) => {
                console.log('Inertia update successful:', response);
            },
            onError: (errors) => {
                console.log('Inertia update errors:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile Debug
                </h2>
            }
        >
            <Head title="Profile Debug" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    
                    {/* Current User Info */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Current User Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><strong>ID:</strong> {user.id}</div>
                            <div><strong>UUID:</strong> {user.uuid}</div>
                            <div><strong>Prenom:</strong> {user.prenom || 'null'}</div>
                            <div><strong>Nom:</strong> {user.nom || 'null'}</div>
                            <div><strong>Email:</strong> {user.email || 'null'}</div>
                            <div><strong>Telephone:</strong> {user.telephone || 'null'}</div>
                            <div><strong>Type:</strong> {user.type_utilisateur}</div>
                            <div><strong>Verified:</strong> {user.est_verifie ? 'Yes' : 'No'}</div>
                        </div>
                    </div>

                    {/* Debug Controls */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Debug Controls</h3>
                        <div className="space-x-4">
                            <button 
                                onClick={fetchDebugInfo}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Fetch Debug Info
                            </button>
                            <button 
                                onClick={testProfileUpdate}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Test Direct Update
                            </button>
                            <button 
                                onClick={testInertiaUpdate}
                                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                                disabled={processing}
                            >
                                Test Inertia Update
                            </button>
                        </div>
                    </div>

                    {/* Test Form */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Test Form Data</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={data.prenom}
                                    onChange={(e) => setData('prenom', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={data.telephone}
                                    onChange={(e) => setData('telephone', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                        </div>
                        <div className="mt-4 text-xs bg-gray-100 p-3 rounded">
                            <strong>Form Data:</strong> {JSON.stringify(data, null, 2)}
                        </div>
                    </div>

                    {/* Debug Info Display */}
                    {debugInfo && (
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Debug Information</h3>
                            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Test Result Display */}
                    {testResult && (
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Test Result</h3>
                            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                                {JSON.stringify(testResult, null, 2)}
                            </pre>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
