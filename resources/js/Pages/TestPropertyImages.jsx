import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PropertyImage from '@/Components/PropertyImage';
import ImageDebugger from '@/Components/ImageDebugger';

export default function TestPropertyImages({ auth, properties = [] }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Test Property Images" />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-2xl font-bold mb-6">🖼️ Property Images Test Page</h1>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h2 className="font-bold text-blue-800">Instructions:</h2>
                        <ol className="list-decimal list-inside text-blue-700 space-y-1 mt-2">
                            <li>Open browser console (F12) to see detailed logs</li>
                            <li>Look for messages starting with 🖼️, ✅, ❌</li>
                            <li>Check which URLs are failing/succeeding</li>
                            <li>Right-click on broken images → "Inspect" to see what URL is being used</li>
                        </ol>
                    </div>

                    {properties.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <p className="text-yellow-800">No properties with images found to test.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {properties.map(property => (
                                <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Property {property.id} - {property.type_propriete} in {property.ville}
                                    </h3>
                                    
                                    {property.images && property.images.length > 0 ? (
                                        <div className="space-y-6">
                                            {property.images.map((image, index) => (
                                                <div key={image.id} className="border border-gray-300 rounded-lg p-4">
                                                    <h4 className="font-medium mb-3">Image {index + 1} (ID: {image.id})</h4>
                                                    
                                                    {/* Debug Information */}
                                                    <ImageDebugger image={image} propertyId={property.id} />
                                                    
                                                    {/* Image Display Tests */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                        {/* Normal PropertyImage */}
                                                        <div>
                                                            <h5 className="font-medium mb-2">PropertyImage Component (Normal)</h5>
                                                            <PropertyImage
                                                                image={image}
                                                                alt={`Property ${property.id} image ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded border"
                                                                fallbackClassName="w-full h-32 rounded border"
                                                            />
                                                        </div>
                                                        
                                                        {/* Debug PropertyImage */}
                                                        <div>
                                                            <h5 className="font-medium mb-2">PropertyImage Component (Debug)</h5>
                                                            <PropertyImage
                                                                image={image}
                                                                alt={`Property ${property.id} image ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded border"
                                                                fallbackClassName="w-full h-32 rounded border"
                                                                debug={true}
                                                            />
                                                        </div>
                                                        
                                                        {/* Raw IMG test */}
                                                        <div>
                                                            <h5 className="font-medium mb-2">Raw IMG Element</h5>
                                                            <img
                                                                src={`/storage/${image.chemin_fichier}`}
                                                                alt={`Raw image test`}
                                                                className="w-full h-32 object-cover rounded border"
                                                                onError={(e) => {
                                                                    console.log('❌ Raw IMG failed:', e.target.src);
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextElementSibling.style.display = 'block';
                                                                }}
                                                                onLoad={(e) => {
                                                                    console.log('✅ Raw IMG loaded:', e.target.src);
                                                                }}
                                                            />
                                                            <div 
                                                                className="w-full h-32 bg-red-200 flex items-center justify-center rounded border"
                                                                style={{ display: 'none' }}
                                                            >
                                                                <span className="text-red-800 text-sm">Raw IMG Failed</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* URL Tests */}
                                                    <div className="mt-4 p-3 bg-gray-50 rounded">
                                                        <h5 className="font-medium mb-2">URLs to test manually:</h5>
                                                        <div className="space-y-1 text-sm font-mono">
                                                            <div>
                                                                <span className="text-gray-600">Storage:</span> 
                                                                <a 
                                                                    href={`/storage/${image.chemin_fichier}`} 
                                                                    target="_blank" 
                                                                    className="text-blue-600 hover:underline ml-2"
                                                                >
                                                                    /storage/{image.chemin_fichier}
                                                                </a>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Images:</span> 
                                                                <a 
                                                                    href={`/images/${image.chemin_fichier}`} 
                                                                    target="_blank" 
                                                                    className="text-blue-600 hover:underline ml-2"
                                                                >
                                                                    /images/{image.chemin_fichier}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">No images for this property</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
