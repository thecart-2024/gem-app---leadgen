import React, { useState, useEffect } from 'react';
import { saveMedia, getMedia, deleteMedia } from '../services/storageService';

interface AssetManagerProps {
  onClose: () => void;
}

export const AssetManager: React.FC<AssetManagerProps> = ({ onClose }) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [fileStatus, setFileStatus] = useState<Record<string, boolean>>({});

  const assets = [
    { label: "Main Logo (logo.png)", key: "logo", type: "image/png" },
  ];

  // Check which files exist in storage on mount
  useEffect(() => {
    const checkFiles = async () => {
      const status: Record<string, boolean> = {};
      for (const asset of assets) {
        const url = await getMedia(asset.key);
        status[asset.key] = !!url;
      }
      setFileStatus(status);
    };
    checkFiles();
  }, []);

  const handleUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(key);
    try {
      await saveMedia(key, file);
      setFileStatus(prev => ({ ...prev, [key]: true }));
      alert(`Successfully saved ${key}! Refresh the page to see it.`);
    } catch (err) {
      console.error(err);
      alert("Failed to save asset.");
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (key: string) => {
    if(window.confirm(`Are you sure you want to delete your custom ${key} and revert to the default?`)) {
        try {
            await deleteMedia(key);
            setFileStatus(prev => ({ ...prev, [key]: false }));
            alert("Custom asset deleted. Default will be used on refresh.");
        } catch (e) {
            console.error(e);
            alert("Failed to delete asset.");
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-blue">Asset Manager</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 pb-4">
          <p className="text-xs text-brand-grey mb-4">
            Upload a custom logo to override the default.
          </p>
          
          {assets.map((asset) => (
            <div key={asset.key} className="border border-gray-200 rounded-lg p-3 transition-colors hover:bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-brand-blue">
                  {asset.label}
                </label>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${fileStatus[asset.key] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {fileStatus[asset.key] ? 'Custom' : 'Default'}
                    </span>
                    {fileStatus[asset.key] && (
                        <button 
                            onClick={() => handleDelete(asset.key)}
                            className="text-[10px] text-red-500 hover:underline"
                        >
                            Reset
                        </button>
                    )}
                </div>
              </div>
              
              <div className="mb-2">
                <input
                  type="file"
                  accept={asset.type}
                  disabled={uploading !== null}
                  onChange={(e) => handleUpload(asset.key, e)}
                  className="block w-full text-xs text-gray-500
                    file:mr-2 file:py-1 file:px-3
                    file:rounded-full file:border-0
                    file:text-[10px] file:font-semibold
                    file:bg-brand-blue/10 file:text-brand-blue
                    hover:file:bg-brand-blue/20"
                />
              </div>

              {uploading === asset.key && (
                  <div className="mt-2 text-xs text-brand-yellow font-bold animate-pulse">
                    Saving...
                  </div>
                )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-brand-yellow text-brand-blue rounded-lg text-sm font-bold shadow-lg hover:bg-[#ffc933] hover:shadow-xl transition-all"
          >
            Refresh Page to Apply
          </button>
        </div>
      </div>
    </div>
  );
};