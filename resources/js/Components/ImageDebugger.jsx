import React, { useState, useEffect } from 'react';

const ImageDebugger = ({ image, propertyId }) => {
    const [debugInfo, setDebugInfo] = useState(null);
    const [testResults, setTestResults] = useState({});

    useEffect(() => {
        if (image) {
            setDebugInfo({
                imageId: image.id,
                cheminFichier: image.chemin_fichier,
                propertyId: propertyId,
                urls: {
                    storage: `/storage/${image.chemin_fichier}`,
                    images: `/images/${image.chemin_fichier}`,
                    direct: `${window.location.origin}/storage/${image.chemin_fichier}`,
                }
            });

            // Test each URL
            testImageUrls(image.chemin_fichier);
        }
    }, [image, propertyId]);

    const testImageUrls = async (imagePath) => {
        const urls = [
            `/storage/${imagePath}`,
            `/images/${imagePath}`,
            `${window.location.origin}/storage/${imagePath}`,
        ];

        const results = {};
        
        for (const url of urls) {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                results[url] = {
                    status: response.status,
                    ok: response.ok,
                    contentType: response.headers.get('content-type'),
                    contentLength: response.headers.get('content-length'),
                };
            } catch (error) {
                results[url] = {
                    status: 'ERROR',
                    error: error.message,
                };
            }
        }
        
        setTestResults(results);
        console.log('🖼️ Image URL Test Results:', results);
    };

    const testSingleImage = (url) => {
        const img = new Image();
        img.onload = () => console.log(`✅ Image loaded successfully: ${url}`);
        img.onerror = () => console.log(`❌ Image failed to load: ${url}`);
        img.src = url;
    };

    if (!debugInfo) return null;

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">🐛 Image Debug Info</h3>
            
            <div className="space-y-2 text-sm">
                <div><strong>Image ID:</strong> {debugInfo.imageId}</div>
                <div><strong>Property ID:</strong> {debugInfo.propertyId}</div>
                <div><strong>File Path:</strong> {debugInfo.cheminFichier}</div>
                
                <div className="mt-4">
                    <strong>URLs being tested:</strong>
                    <div className="space-y-1 mt-2">
                        {Object.entries(debugInfo.urls).map(([key, url]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <span className="w-16 text-xs bg-gray-100 px-2 py-1 rounded">{key}</span>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">{url}</code>
                                <button 
                                    onClick={() => testSingleImage(url)}
                                    className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
                                >
                                    Test
                                </button>
                                {testResults[url] && (
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        testResults[url].ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {testResults[url].ok ? '✅' : '❌'} {testResults[url].status}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 p-2 bg-gray-100 rounded">
                    <strong>Console Instructions:</strong>
                    <div className="text-xs mt-1">
                        Open browser console (F12) to see detailed image loading results.
                        Look for messages starting with 🖼️ or ❌/✅
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageDebugger;
