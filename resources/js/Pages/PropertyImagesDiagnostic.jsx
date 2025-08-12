import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PropertyImagesDiagnostic({ auth, diagnosticData }) {
    const [testResults, setTestResults] = useState({});
    
    useEffect(() => {
        // Test image URLs in browser
        if (diagnosticData.sample_images) {
            testImageUrls();
        }
    }, [diagnosticData]);

    const testImageUrls = async () => {
        const results = {};
        
        for (const image of diagnosticData.sample_images) {
            const urls = [
                `/storage/${image.chemin_fichier}`,
                `/images/${image.chemin_fichier}`,
                image.asset_url,
                image.storage_url
            ];
            
            results[image.id] = {};
            
            for (const url of urls) {
                try {
                    const response = await fetch(url, { method: 'HEAD' });
                    results[image.id][url] = {
                        status: response.status,
                        ok: response.ok,
                        contentType: response.headers.get('content-type'),
                        contentLength: response.headers.get('content-length')
                    };
                } catch (error) {
                    results[image.id][url] = {
                        status: 'ERROR',
                        error: error.message
                    };
                }
            }
        }
        
        setTestResults(results);
        console.log('🔍 Property Images URL Test Results:', results);
    };

    const StatusBadge = ({ condition, trueText = "✅ YES", falseText = "❌ NO" }) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${
            condition 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
        }`}>
            {condition ? trueText : falseText}
        </span>
    );

    const UrlTestResult = ({ result }) => {
        if (!result) return <span className="text-gray-400">Testing...</span>;
        
        if (result.error) {
            return <span className="text-red-600">❌ {result.error}</span>;
        }
        
        return (
            <span className={result.ok ? 'text-green-600' : 'text-red-600'}>
                {result.ok ? '✅' : '❌'} {result.status}
                {result.contentType && (
                    <span className="text-xs text-gray-500 ml-1">
                        ({result.contentType})
                    </span>
                )}
            </span>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Property Images Diagnostic" />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6">🔍 Property Images Diagnostic</h1>
                    
                    {/* System Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg border p-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Database</h3>
                            <div className="space-y-1">
                                <div>Total Images: <strong>{diagnosticData.total_images}</strong></div>
                                <div>With Properties: <strong>{diagnosticData.images_with_properties}</strong></div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg border p-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Storage</h3>
                            <div className="space-y-1">
                                <div>Storage Path: <StatusBadge condition={diagnosticData.storage_exists} /></div>
                                <div>Properties Folder: <StatusBadge condition={diagnosticData.properties_folder_exists} /></div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg border p-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Public Access</h3>
                            <div className="space-y-1">
                                <div>Public Symlink: <StatusBadge condition={diagnosticData.public_symlink_exists} /></div>
                                <div>Symlink Valid: <StatusBadge condition={diagnosticData.symlink_valid} /></div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg border p-4">
                            <h3 className="font-semibold text-gray-700 mb-2">File System</h3>
                            <div className="space-y-1">
                                <div>Property Dirs: <strong>{diagnosticData.property_directories_count}</strong></div>
                                <div>Total Files: <strong>{diagnosticData.total_property_files}</strong></div>
                            </div>
                        </div>
                    </div>

                    {/* Storage Paths */}
                    <div className="bg-white rounded-lg border p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">📁 Storage Paths</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Storage Paths</h3>
                                <div className="space-y-2 text-sm font-mono bg-gray-50 p-3 rounded">
                                    <div><strong>Storage Root:</strong> {diagnosticData.storage_path}</div>
                                    <div><strong>Properties:</strong> {diagnosticData.properties_storage_path}</div>
                                    <div><strong>Public Root:</strong> {diagnosticData.public_path}</div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Profile Images (Working)</h3>
                                <div className="space-y-2 text-sm bg-green-50 p-3 rounded">
                                    <div>Storage Exists: <StatusBadge condition={diagnosticData.profile_storage_exists} /></div>
                                    <div>Public Exists: <StatusBadge condition={diagnosticData.profile_public_exists} /></div>
                                    <div>Files Count: <strong>{diagnosticData.profile_files_count}</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sample Images Analysis */}
                    {diagnosticData.sample_images && diagnosticData.sample_images.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">🖼️ Sample Property Images Analysis</h2>
                            
                            {diagnosticData.sample_images.map((image) => (
                                <div key={image.id} className="bg-white rounded-lg border p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Image Info */}
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">
                                                Image {image.id} 
                                                {image.property && (
                                                    <span className="text-sm font-normal text-gray-600 ml-2">
                                                        ({image.property.type_propriete} in {image.property.ville})
                                                    </span>
                                                )}
                                            </h3>
                                            
                                            <div className="space-y-2 text-sm">
                                                <div><strong>Database Path:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{image.chemin_fichier}</code></div>
                                                <div><strong>Original Name:</strong> {image.nom_fichier}</div>
                                                <div><strong>Display Order:</strong> {image.ordre_affichage}</div>
                                                <div><strong>Created:</strong> {new Date(image.created_at).toLocaleString()}</div>
                                            </div>
                                            
                                            <div className="mt-4 space-y-1">
                                                <div>Storage File: <StatusBadge condition={image.storage_file_exists} /></div>
                                                <div>Public File: <StatusBadge condition={image.public_file_exists} /></div>
                                                {image.file_size && (
                                                    <div>File Size: <strong>{(image.file_size / 1024).toFixed(1)} KB</strong></div>
                                                )}
                                                {image.mime_type && (
                                                    <div>Type: <strong>{image.mime_type}</strong></div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* URL Tests */}
                                        <div>
                                            <h4 className="font-medium mb-3">URL Tests</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-600">Storage URL</div>
                                                    <div className="flex items-center justify-between">
                                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 mr-2">
                                                            /storage/{image.chemin_fichier}
                                                        </code>
                                                        <UrlTestResult result={testResults[image.id]?.[`/storage/${image.chemin_fichier}`]} />
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <div className="text-sm font-medium text-gray-600">Images URL</div>
                                                    <div className="flex items-center justify-between">
                                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 mr-2">
                                                            /images/{image.chemin_fichier}
                                                        </code>
                                                        <UrlTestResult result={testResults[image.id]?.[`/images/${image.chemin_fichier}`]} />
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <div className="text-sm font-medium text-gray-600">Asset URL</div>
                                                    <div className="flex items-center justify-between">
                                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 mr-2">
                                                            {image.asset_url}
                                                        </code>
                                                        <UrlTestResult result={testResults[image.id]?.[image.asset_url]} />
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <div className="text-sm font-medium text-gray-600">Storage Facade URL</div>
                                                    <div className="flex items-center justify-between">
                                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 mr-2">
                                                            {image.storage_url}
                                                        </code>
                                                        <UrlTestResult result={testResults[image.id]?.[image.storage_url]} />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Visual Test */}
                                            <div className="mt-4">
                                                <div className="text-sm font-medium text-gray-600 mb-2">Visual Test</div>
                                                <div className="border rounded p-2">
                                                    <img 
                                                        src={`/storage/${image.chemin_fichier}`}
                                                        alt="Property test"
                                                        className="w-32 h-24 object-cover rounded"
                                                        onError={(e) => {
                                                            console.log('❌ Visual test failed for:', e.target.src);
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'block';
                                                        }}
                                                        onLoad={(e) => {
                                                            console.log('✅ Visual test success for:', e.target.src);
                                                        }}
                                                    />
                                                    <div 
                                                        className="w-32 h-24 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center text-red-600 text-xs"
                                                        style={{ display: 'none' }}
                                                    >
                                                        Image Failed
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Laravel Configuration */}
                    <div className="bg-white rounded-lg border p-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4">⚙️ Laravel Storage Configuration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Filesystem Config</h3>
                                <div className="space-y-1 text-sm">
                                    <div><strong>Default Disk:</strong> {diagnosticData.default_disk}</div>
                                    <div><strong>Public Disk Root:</strong> <code className="text-xs">{diagnosticData.public_disk_root}</code></div>
                                    <div><strong>Public Disk URL:</strong> <code className="text-xs">{diagnosticData.public_disk_url}</code></div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Storage Facade Test</h3>
                                <div className="space-y-1 text-sm">
                                    <div>Public Disk Works: <StatusBadge condition={diagnosticData.storage_facade_works} /></div>
                                    <div>Sample Image Exists: <StatusBadge condition={diagnosticData.sample_image_exists_via_storage} /></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                        <h2 className="text-xl font-semibold text-yellow-800 mb-4">🛠️ Recommended Actions</h2>
                        <div className="space-y-2 text-sm">
                            {!diagnosticData.public_symlink_exists && (
                                <div className="text-red-600">❌ <strong>CRITICAL:</strong> Run <code>php artisan storage:link</code></div>
                            )}
                            {!diagnosticData.symlink_valid && (
                                <div className="text-red-600">❌ <strong>CRITICAL:</strong> Symlink is broken - recreate it</div>
                            )}
                            {diagnosticData.total_images > 0 && diagnosticData.images_with_accessible_files === 0 && (
                                <div className="text-red-600">❌ <strong>CRITICAL:</strong> No image files are accessible via web</div>
                            )}
                            {diagnosticData.public_symlink_exists && diagnosticData.symlink_valid && (
                                <div className="text-green-600">✅ Storage symlink is working correctly</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
